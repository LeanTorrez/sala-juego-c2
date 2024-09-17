import { Component, inject, OnDestroy } from '@angular/core';
import { ICarta, IMazo } from '../../../Interfaces/IMazoCarta';
import { Subscriber, Subscription } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';
import { FireStoreService } from '../../../services/fire-store.service';

@Component({
  selector: 'app-mayor-menor',
  standalone: true,
  imports: [],
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.css'
})
export class MayorMenorComponent implements OnDestroy {

  carta = inject(ApiService);
  toast = inject(ToastrService);
  auth = inject(AuthService);
  fireStore = inject(FireStoreService);

  public imgActualCarta : string = "https://www.deckofcardsapi.com/static/img/back.png";
  public valorCartaActual !:string;

  public imgNuevaCarta : string = "https://www.deckofcardsapi.com/static/img/back.png";
  public valorNuevaCarta !:string;

  private arrayCartas =  new Array<ICarta>();
  private suscribe!: Subscription;

  public puntos:number = 0;

  constructor(){
    this.empezarJuegoMayorMenor();
  }

  empezarJuegoMayorMenor(){
    const obs = this.carta.getObsCartasMayorMenor()
    this.suscribe = obs.subscribe((mazo)=>{
      this.arrayCartas = mazo.cards;

      const carta =  this.arrayCartas.pop();
      if(carta !== undefined){
        this.imgActualCarta = carta?.image
        this.valorCartaActual = carta?.value;
      }
    })
  }

  mayorMenorCarta(boton:string){
    const cartaNueva = this.arrayCartas.pop();

    if(cartaNueva !== undefined){
      this.imgNuevaCarta = cartaNueva.image;
      this.valorNuevaCarta = cartaNueva.value;

      setTimeout(() => {
        this.imgActualCarta = this.imgNuevaCarta;
        this.valorCartaActual = this.valorNuevaCarta;

        this.imgNuevaCarta = "https://www.deckofcardsapi.com/static/img/back.png";
        this.valorNuevaCarta = "0";
      }, 1500);

      if(this.valorCartas(this.valorCartaActual) != this.valorCartas(this.valorNuevaCarta)){
        switch(boton){
          case "menor":
            if(this.valorCartas(this.valorCartaActual) > this.valorCartas(this.valorNuevaCarta)){
            
              this.toastAlert("Ganaste 1 Punto","Ganaste");
              this.puntos += 1 ;

            }else{

              this.toastAlert("La carta era mayor","Perdiste");
              /* Envia puntaje */
              if(this.puntos > 5){
                this.fireStore.insertarPuntaje(this.puntos, this.auth.email, "mayor-menor");
              }
              this.puntos = 0;

            }
            break;
          case "mayor":
            if(this.valorCartas(this.valorCartaActual) < this.valorCartas(this.valorNuevaCarta)){
              
              this.toastAlert("Ganaste 1 Punto","Ganaste");
              this.puntos += 1;

            }else{     

              this.toastAlert("La carta era mayor","Perdiste");
              /* envia puntaje */
              if(this.puntos > 5){
                this.fireStore.insertarPuntaje(this.puntos, this.auth.email, "mayor-menor");
              }

              this.puntos = 0;

            }
            break;
        }
      }else{
        this.puntos += 1;

        this.toastAlert("Ganaste 1 Punto","Ganaste");

        //en caso de tener el mismo valor
      }
    }
  }

  toastAlert(mensaje:string, tipo:string){
    switch(tipo){
      case "Ganaste":
        this.toast.success(mensaje,tipo,{
          positionClass:"toast-center-center",timeOut:1500
        })
        break;
      case "Perdiste":
        this.toast.error(mensaje,tipo,{
          positionClass:"toast-center-center",timeOut:1500
        })
        break;
    }
  }

  valorCartas(valor:string){
    let number = 0;
    switch(valor){
      case "KING":
        number = 13;
        break;
      case "QUEEN":
        number = 12;
        break;
      case "JACK":
        number = 11;
        break;
      case "ACE":
        number = 1;
        break;
      default:
        number = parseInt(valor); 
        break;
    }
    return number;
  }

  ngOnDestroy(){
    this.suscribe.unsubscribe();
  }

}
