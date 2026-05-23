import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';

@Component(
  {
    selector: 'app-root',
    template: '<router-outlet/>',
    imports: [
      RouterOutlet
    ]
  }
)
export class App {
  constructor(translate: TranslateService) {
    translate.use('cs');
  }
}
