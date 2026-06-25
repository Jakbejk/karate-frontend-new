import {Component} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';

@Component({
  selector: 'app-layout',
  templateUrl: 'layout.html',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslateModule],
  standalone: true
})
export class Layout {}
