import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { IMazo } from '../Interfaces/IMazoCarta';

@Injectable({
  providedIn: 'root'
})
export class BlackjackService {

  http = inject(HttpClient);
  mazoSuscribe!: Subscription;

  constructor() { }

  getMazo(){
    return new Promise<string>((resolve) =>{
      const obs = this.http.get("https://www.deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6") as Observable<IMazo>;
      this.mazoSuscribe = obs.subscribe((mazo) =>{
        resolve(mazo.deck_id);
      });
    })
  }

  getUnaCarta(mazoId:string){
    /* .pipe(shareReplay()) as Observable<IMazo> */
    /* 
    const obs = this.http.get("https://www.deckofcardsapi.com/api/deck/"+mazoId+"/draw/?count=1").pipe(shareReplay());
    return obs as Observable<IMazo> 
    */
    return this.http.get("https://www.deckofcardsapi.com/api/deck/"+mazoId+"/draw/?count=1") as Observable<IMazo>;
  }

}


