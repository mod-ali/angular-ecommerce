import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {from, lastValueFrom, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor() {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(request, next));
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    // only add an access token for secured endpoints
    const securedEndPoints = ['http://localhost:8080/api/orders'];
    if (securedEndPoints.some(url => request.urlWithParams.includes(url))) {
      // get access token
      //TODO: get access token from auth server
      const accessToken = '';
      // clone the request and add new header with access token
      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer ' + accessToken
        }
      });
    }
    return await lastValueFrom(next.handle(request));
  }
}
