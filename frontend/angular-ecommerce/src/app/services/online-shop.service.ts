import {Injectable} from '@angular/core';
import {map, Observable, of} from "rxjs";
import {Country} from "../common/country";
import {HttpClient} from "@angular/common/http";
import {State} from "../common/state";

@Injectable({
  providedIn: 'root'
})
export class OnlineShopService {
  countries: Country[] = [];
  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) {
  }

  getCreditMonths(startMonth: number): Observable<number[]> {
    let data: number[] = []

    for (let month = startMonth; month <= 12; month++) {
      data.push(month);
    }

    return of(data);
  }

  getCreditYears(): Observable<number[]> {
    let data: number[] = []

    let currentYear: number = new Date().getFullYear();

    let endYear = currentYear + 10;
    for (let year = currentYear; year <= endYear; year++) {
      data.push(year);
    }

    return of(data);
  }

  getCountries(): Observable<Country[]> {

    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response => response._embedded.countries)
    );
  }

  getStates(theCountryCode: string): Observable<State[]> {

    // search url
    const searchStatesUrl = `${this.statesUrl}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );
  }

}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  }
}
