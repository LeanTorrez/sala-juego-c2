import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IMazo } from '../Interfaces/IMazoCarta';
import { Observable } from 'rxjs';
import { Pais } from '../Interfaces/IPais';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  http = inject(HttpClient);

  getObsCartasMayorMenor(){
   return this.http.get("https://www.deckofcardsapi.com/api/deck/new/draw/?count=52") as Observable<IMazo>; 
  }

  getObsPaises(){
    return this.http.get("https://restcountries.com/v3.1/lang/spanish") as Observable<Pais[]>;
  }

}
