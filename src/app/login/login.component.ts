import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: string = '';
  password: string = '';

  loginForm: FormGroup;

  constructor(private router: Router, private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  ngOnInit(): void { }

  printValues() {
    console.log('Username:', this.username);
    console.log('Password:', this.password);

    this.router.navigate(['/list-clients']);
  }


  onSubmit(): void {
    const username = this.loginForm.get('username')?.value;
    const password = this.loginForm.get('password')?.value;

    this.authService.authenticate(username, password).subscribe(
      (user) => {
        if (user) {
          sessionStorage.setItem('userId', user.id);
          this.router.navigate(['/clients']);
        } else {
          alert('Credenziali non valide');
        }
      },
      (error) => {
        console.error('Errore del server', error);
      }
    );
  }
}
