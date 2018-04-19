import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';

// Interfaces to handle the data types
export interface UserDetails {
  _id: string;
  email: string;
  exp: number;
}

interface TokenResponse {
  token: string;
}

export interface TokenPayload {
  email: string;
  password: string;
  name?: string;
}

@Injectable()
export class AuthentificationService {
  private token: string;
  private apiUrl = 'http://localhost:3000/api/';
  constructor(private http: HttpClient, private router: Router) {}

  // Create a token for the user
  private saveToken(token: string): void {
    localStorage.setItem('mean-token', token);
    this.token = token;
  }

  private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }

  public logout(): void {
    this.token = '';
    // Destroy the token
    window.localStorage.removeItem('mean-token');
    // Redirect to the HomePage
    this.router.navigateByUrl('/');
  }
  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload);
    } else {
      return null;
    }
  }
  public isLoggedIn(): boolean {
    const user = this.getUserDetails();
    if (user) {
      // Check the expirations date of the token
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }
  // Design Pattern : Factory method of HTTP verbs
  private request(method: 'post'|'get', type: 'login'|'register', user?: TokenPayload): Observable<any> {
    let base;
    base = this.http.get(this.apiUrl + `${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
    if (method === 'post') {
      base = this.http.post(this.apiUrl + `${type}`, user);
    } else {
      base = this.http.get(this.apiUrl + `${type}`, { headers: { Authorization: `Bearer ${this.getToken()}` }});
    }
    const request = base.pipe(
      map((data: TokenResponse) => {
        if (data.token) {
          this.saveToken(data.token);
        }
        return data;
      })
    );
    return request;
  }
  public register(user: TokenPayload): Observable<any> {
    return this.request('post', 'register', user);
  }
  public login(user: TokenPayload): Observable<any> {
    return this.request('post', 'login', user);
  }
}
