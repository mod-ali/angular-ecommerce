import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  isAuthenticated: boolean = true;
  userFullName: string = '';
  constructor() { }

  storage: Storage = sessionStorage;

  ngOnInit(): void {
    // TODO: save the user email to the session

    // this.storage.setItem('userEmail', JSON.stringify(email));
  }

  logout() {

  }
}
