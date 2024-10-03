import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<boolean> {
    const url = `${this.apiUrl}?username=${username}&password=${password}`;
    return this.http.get<any[]>(url).pipe(
      map(users => {
        return users.length > 0;
      })
    );
  }

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  authenticate(username: string, password: string): Observable<any> {
    return this.getUsers().pipe(
      map((users: any[]) => users.find(user => user.username === username && user.password === password))
    )
  }
}
