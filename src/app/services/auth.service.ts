import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../env/environment';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  userName: string;
  userFirstName: string;
  userLastName: string;
  email: string;
  password: string;
}

export interface JwtResponse {
  jwtToken: string;
  user: any;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private tokenKey = 'auth_token';
  private userKey = 'current_user';
  
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private isAdminSubject = new BehaviorSubject<boolean>(this.checkAdminRole());
  public isAdmin$ = this.isAdminSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(loginRequest: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.apiUrl}/auth/signin`, loginRequest)
      .pipe(
        tap(response => {
          this.setToken(response.jwtToken);
          this.setUser(response.user);
          this.isLoggedInSubject.next(true);
          this.isAdminSubject.next(this.checkAdminRole());
        })
      );
  }

  register(registerRequest: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/signup`, registerRequest);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.isLoggedInSubject.next(false);
    this.isAdminSubject.next(false);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUser(): any {
    const user = localStorage.getItem(this.userKey);
    return user ? JSON.parse(user) : null;
  }

  isAuthenticated(): Observable<boolean> {
    return this.isLoggedIn$;
  }

  isUserAdmin(): boolean {
    return this.checkAdminRole();
  }

  getUserRoles(): string[] {
    const user = this.getUser();
    if (user && user.roles) {
      return user.roles.map((role: any) => role.roleName);
    }
    return [];
  }

  private setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private setUser(user: any): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  private checkAdminRole(): boolean {
    const user = this.getUser();
    if (user && user.roles) {
      return user.roles.some((role: any) => 
        role.roleName === 'ROLE_ADMIN' || 
        role.roleName === 'ADMIN'
      );
    }
    return false;
  }

  checkInitialAuthStatus(): void {
    this.isLoggedInSubject.next(this.hasToken());
    this.isAdminSubject.next(this.checkAdminRole());
  }

  // Address API Methods - FIXED URLs
  getUserAddresses(userName: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/addresses/user/${userName}`);
  }

  createAddress(addressData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/addresses`, addressData);
  }

  updateAddress(addressId: number, addressData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/addresses/${addressId}`, addressData);
  }

  deleteAddress(addressId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/addresses/${addressId}`);
  }
}