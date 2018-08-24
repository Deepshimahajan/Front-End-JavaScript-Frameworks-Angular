import { Injectable } from '@angular/core';
import { Promotion } from '../shared/promotion';
import { PROMOTIONS } from '../shared/promotions';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { map, catchError } from 'rxjs/operators';
import { Restangular } from 'ngx-restangular';

@Injectable({
  providedIn: 'root'
})
export class PromotionService {

  constructor(private restangular: Restangular) { }
  
  getPromotions(): Observable<Promotion[]> {
    return this.restangular.all('promotions').getList();

}

  getPromotion(id: number): Observable<Promotion> {
    return this.restangular.all('promotions', id).get();
  
}

  getFeaturedPromotion(): Observable<Promotion> {
    return this.restangular.all('promotions').getList({featured: true})
    .pipe(map(promotions => promotions[0]));
  
}

  
}
