import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services/authentication.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  user: any;
  constructor(private authService: AuthenticationService) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('auth') != null) {
      const res = JSON.parse(sessionStorage.getItem('auth') || '{}');
      console.log('RES', res);
      this.user = res.user;
    }
  }



}
