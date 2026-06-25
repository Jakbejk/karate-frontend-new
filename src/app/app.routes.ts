import {Routes} from '@angular/router';
import {Layout} from '../layout/layout';
import {Users} from '../users/users';
import {Events} from '../events/events';
import {Exercises} from '../exercises/exercises';


export const routes: Routes = [
  {
    path: '',
    component: Layout,
    children: [
      {path: '', redirectTo: 'users', pathMatch: 'full'},
      {path: 'users', component: Users},
      {path: 'events', component: Events},
      {path: 'exercises', component: Exercises},
    ]
  }
];
