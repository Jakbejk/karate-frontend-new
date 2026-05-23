import {inject} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {BehaviorSubject, Observable, Subscription, switchMap} from 'rxjs';

export class GetHttpClient<T> {
  private modalService: NgbModal = inject(NgbModal);
  private http: HttpClient = inject(HttpClient);


  public GET(uri: string): Observable<T> {
    return this.http.get(`${environment.api.url + uri}`) as Observable<T>;
  }


  private showError(error: any) {
    this.modalService.open(error);
  }
}
