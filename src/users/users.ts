import {Component, OnInit} from '@angular/core';
import {Page} from '../commons/PageTools';
import {GetHttpClient} from '../commons/RestTools';
import {RouterOutlet} from '@angular/router';
import {AsyncPipe} from '@angular/common';
import {Observable} from 'rxjs';
import {TranslateModule} from '@ngx-translate/core';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  weight: number;
  birthday: Date;
  contact: string;
  kyu: string
}

@Component({
  selector: 'users',
  templateUrl: 'template.html',
  imports: [RouterOutlet, AsyncPipe, TranslateModule],
  standalone: true
})
export class Users implements OnInit {

  private usersClient: GetHttpClient<Page<User>> = new GetHttpClient();
  users$! : Observable<Page<User>>

  ngOnInit(): void {
    this.users$ = this.usersClient.GET('/users');
  }
}
