import {Component} from '@angular/core';
import {AgGridAngular} from 'ag-grid-angular';
import {TranslateModule} from '@ngx-translate/core';
import {AdvancedTable} from '../components/AdvancedTable';


export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  weight: number;
  birthday: Date;
  contact: string;
  kyu: string;
}

@Component({
  selector: 'users',
  templateUrl: 'template.html',
  imports: [AgGridAngular, TranslateModule],
  standalone: true,
})
export class Users {


  userTable: AdvancedTable<User> = new AdvancedTable("/api/v1/users", [{
    field: 'firstName', headerValueGetter: 'user.firstname', filter: 'agTextColumnFilter'
  }, {
    field: 'lastName', headerValueGetter: 'user.lastname', filter: 'agTextColumnFilter'
  }, {
    field: 'email', headerValueGetter: 'user.email', filter: 'agTextColumnFilter'
  }, {
    field: 'weight', headerValueGetter: 'user.weight', filter: 'agNumberColumnFilter'
  }, {
    field: 'birthday',
    headerValueGetter: 'user.birthday',
    filter: 'agDateColumnFilter',
  }, {
    field: 'contact', headerValueGetter: 'user.contact', filter: 'agTextColumnFilter', sortable: false
  }, {
    field: 'kyu', headerValueGetter: 'user.kyu', filter: false, sortable: false,
  },]);
}
