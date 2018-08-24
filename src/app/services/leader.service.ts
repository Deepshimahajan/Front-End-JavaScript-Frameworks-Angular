import { Injectable } from '@angular/core';
import { LEADERS } from '../shared/leaders';
import { Leader } from '../shared/leader';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { map, catchError } from 'rxjs/operators';
import { Restangular } from 'ngx-restangular';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  LEADERS: Leader[];

  constructor(private restangular: Restangular) { }


  getLeaders(): Observable<Leader[]> {
    return this.restangular.all('leaders').getList();

  }

  getLeader(id: number): Observable<Leader> {
    return this.restangular.one('leaders', id).get();
  
  }


  getFeaturedLeader(): Observable<Leader> {
    return this.restangular.all('leaders').getList({featured: true}) 
    .pipe(map(leaders => leaders[0]));
  
}

}
