import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, of, Observable } from 'rxjs';

// Define the interface to match your PHP output
export interface User {
  id: number;
  name: string;
  email: string;
  gender: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost/demo/index.php';

  getProducts(): Observable<User[]> {
    return this.http.get<User[]>(this.API_URL);
  }

  // POST for Update
  updateUser(user: User): Observable<any> {
    return this.http.post(this.API_URL, { action: 'update', ...user });
  }

  // POST for Delete
  deleteUser(id: number): Observable<any> {
    return this.http.post(this.API_URL, { action: 'delete', id });
  }
}