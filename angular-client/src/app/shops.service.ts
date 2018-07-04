import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';

@Injectable()
export class ShopsService {
    private token: string;
  private apiUrl = 'http://localhost:3000/api/';
  constructor(private http: HttpClient) {}
  // Fetch shops that are not disliked and not preferred shops
  getShops(): Promise<any> {
        return this.http.get(this.apiUrl + 'shops', { headers: { Authorization: `Bearer ${this.getToken()}` }})
                   .toPromise()
                   .then(this.handleData)
                   .catch(this.handleError);
    }
    getPreferedShops(): Promise<any> {
      return this.http.get(this.apiUrl + 'preferedShops', { headers: { Authorization: `Bearer ${this.getToken()}` }})
                  .toPromise()
                  .then(this.handleData)
                  .catch(this.handleError);
    }
    addPreferedShop(shop: any): Promise<any> {
      return this.http.post(this.apiUrl + 'preferedShops/' + shop, {}, { headers: { Authorization: `Bearer ${this.getToken()}` }})
                  .toPromise()
                  .then(this.handleData)
                  .catch(this.handleError);
    }
    addDislikedShop(shop: any): Promise<any> {
      return this.http.post(this.apiUrl + 'dislikedShops/' + shop, {}, { headers: { Authorization: `Bearer ${this.getToken()}` }})
                  .toPromise()
                  .then(this.handleData)
                  .catch(this.handleError);
    }
    removePreferedShop(shop: any): Promise<any> {
      return this.http.delete(this.apiUrl + 'preferedShops/' + shop, { headers: { Authorization: `Bearer ${this.getToken()}` }})
                  .toPromise()
                  .then(this.handleData)
                  .catch(this.handleError);
    }

private handleData(res: any) {
    const body = res.shops;
    return body || {};
}
private handleError(error: any): Promise<any> {
  console.error('An error occurred', error);
  return Promise.reject(error.message || error);
}
private getToken(): string {
    if (!this.token) {
      this.token = localStorage.getItem('mean-token');
    }
    return this.token;
  }
  public getUserId(): string {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1];
      payload = window.atob(payload);
      return JSON.parse(payload)._id;
    } else {
      return null;
    }
  }
}
