import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClientService, Client } from '../client.service';

@Component({
  selector: 'app-list-clients',
  templateUrl: './list-clients.component.html',
  styleUrl: './list-clients.component.css'
})

export class ListClientsComponent implements OnInit {
  customers: Client[] = [];
  displayedColumns: string[] = ['id', 'codice_fiscale', 'nome', 'cognome', 'azienda', 'email', 'azioni'];
  clientForm: FormGroup;
  showForm: boolean = false;
  selectedId: number = -1;

  constructor(private clientService: ClientService, private fb: FormBuilder) {
    this.clientForm = this.fb.group({
      codice_fiscale: ['', Validators.required],
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      azienda: [''],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  id: number = -1;
  ngOnInit(): void {
    this.id = sessionStorage.getItem('userId') ? parseInt(sessionStorage.getItem('userId') as string) : -1;
    if (this.id != -1) {
      this.getClientsById(this.id)
    }
  }

  getClients(): void {
    this.clientService.getClients().subscribe(
      (data: Client[]) => {
        this.customers = data;
      },
      (error) => {
        console.error('Errore nel recupero clienti', error);
      }
    );
  }

  getClientsById(id: number): void {
    this.clientService.getClientsById(id).subscribe(
      (data: Client[]) => {
        this.customers = data;
      }
    );
  }

  editClient(client: Client): void {
    this.clientForm.patchValue(client);
    this.showForm = true;
    this.selectedId = client.id;
  }

  deleteClient(id: number): void {
    console.log(id);
    this.clientService.deleteClient(id).subscribe(
      () => {
        this.customers = this.customers.filter(client => client.id !== id);
      },
      (error) => {
        console.error('Errore nella cancellazione del cliente', error);
      }
    );
  }

  onSubmit(): void {
    if (this.clientForm.valid) {
      if (this.selectedId === -1) {
        const newClient = { ...this.clientForm.value, userId: this.id };
        this.clientService.addClient(newClient).subscribe(
          (client) => {
            this.clientForm.reset();
            this.getClientsById(this.id);
          },
          (error) => {
            console.error('Errore nell\'aggiunta del cliente', error);
          }
        );
      }
      else {
        const newClient = { ...this.clientForm.value, id: this.selectedId, userId: this.id }
        this.clientService.updateClient(newClient).subscribe(
          (client) => {
            this.clientForm.reset();
            this.getClientsById(this.id);
            this.selectedId = -1;
          },
          (error) => {
            console.error('Errore nella modifica', error);
          }
        );
      }
    }

  }
  private generateAutoIncrementId(): number {
    return this.customers.length > 0 ? Math.max(...this.customers.map(c => c.id)) + 1 : 1;
  }
  toggleForm(): void {
    this.selectedId = -1;
    this.showForm = !this.showForm;
  }
}
