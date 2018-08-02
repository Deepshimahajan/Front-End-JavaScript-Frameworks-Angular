import { Injectable } from '@angular/core';
import { LEADERS } from '../shared/leaders';
import { Leader } from '../shared/leader';
import { removeListener } from 'cluster';

@Injectable({
  providedIn: 'root'
})
export class LeaderService {

  LEADERS: Leader[];

  constructor() { }


  getLeaders(): Promise<Leader[]> {
    return new Promise(resolve => { setTimeout(() => resolve(LEADERS), 2000);
  });
  }



  getFeaturedLeader(): Promise<Leader> {
    return new Promise(resolve => { setTimeout(() => resolve(LEADERS.filter((leader) => leader.featured)[0]), 2000);
  });
}

}
