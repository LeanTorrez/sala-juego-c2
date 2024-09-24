import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { BlackjackService } from '../../../services/blackjack.service';
import { Observable, Subscription } from 'rxjs';
import { ICarta, IMazo } from '../../../Interfaces/IMazoCarta';
import { ToastrService } from 'ngx-toastr';
import { FireStoreService } from '../../../services/fire-store.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-blackjack',
  standalone: true,
  imports: [],
  templateUrl: './blackjack.component.html',
  styleUrl: './blackjack.component.css'
})
export class BlackjackComponent implements OnInit,OnDestroy{

  public deck_id!:string;
  private obsMazo!: Observable<IMazo>;
  private suscribe !: Subscription;

  public cartasCrupier:ICarta[] = new Array<ICarta>;
  public cartasJugador:ICarta[] = new Array<ICarta>;


  mazoApi = inject(BlackjackService);
  toast = inject(ToastrService);
  fireStore = inject(FireStoreService);
  auth = inject(AuthService);

  public puntosCrupier:number = 0;
  public puntosJugador:number = 0;

  public mostrarCartas:boolean = false;

  public partidaTerminada:boolean = false;
  public mensajePartida:string = "Tu puntaje es mayor que el Crupier";
  public mensajeTitulo:string = "";

  constructor(){
    
  }

  ngOnInit(){
    this.iniciarMazo();
  }

  ngOnDestroy(): void {
    this.suscribe.unsubscribe();
  }

  async iniciarMazo(){
    await this.mazoApi.getMazo()
          .then(id => this.deck_id = id);

    this.obsMazo = this.mazoApi.getUnaCarta(this.deck_id);

    this.comenzarBlackjack();
  }

  async getCarta(jugador="jugador",cantidad = 1){
    for(let i = 0; i < cantidad; i++){
      this.suscribe = await this.obsMazo.subscribe((mazo)=> {
        if(jugador === "crupier"){
          this.cartasCrupier.push(mazo.cards[0]);
          this.puntosCrupier = this.calcularPuntos(this.cartasCrupier,"crupier");
        }else{
          this.cartasJugador.push(mazo.cards[0]);
          this.puntosJugador = this.calcularPuntos(this.cartasJugador);

          if(this.puntosJugador > 21){  
            this.stand();
          }else if(this.puntosJugador == 21){
            this.stand();
          }

        }
      });
    }
  }

  async finalizarMazoCrupier(){
    this.suscribe = await this.obsMazo.subscribe((mazo)=> {
      this.cartasCrupier.push(mazo.cards[0]);
      this.puntosCrupier = this.calcularPuntos(this.cartasCrupier,"crupier");

      if(this.puntosCrupier < 17 && this.puntosJugador < 22) this.finalizarMazoCrupier();
    });
  }

  async comenzarBlackjack(){
    this.partidaTerminada = false;
    this.puntosCrupier = 0;
    this.puntosJugador = 0;
    this.mostrarCartas = false;
    this.cartasCrupier.length = 0;
    this.cartasJugador.length = 0;

    await this.getCarta("crupier",2);
    await this.getCarta("jugador",2);
  }

  valorCartas(valor:string){
    let number = 0;
    switch(valor){
      case "KING":
        number = 10;
        break;
      case "QUEEN":
        number = 10;
        break;
      case "JACK":
        number = 10;
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

  calcularPuntos(array:ICarta[],jugador="jugador"){
    let contador = 0;

    for(let i = 0;i < array.length;i++){
      if(!this.mostrarCartas && jugador=="crupier" && i == 1) continue
      contador += this.valorCartas(array[i].value);          
    }
    return contador;
  }


  async hit(){
    await this.getCarta("jugador",1);
  }

  async stand(){
    this.mostrarCartas = true;

    this.puntosCrupier = this.calcularPuntos(this.cartasCrupier,"");

    if(this.puntosCrupier < 17 && this.puntosJugador < 22){
      await this.finalizarMazoCrupier();
    }

    if(this.puntosJugador > 21){
      //PERDISTE
      this.conclusionPartida("Superaste el puntaje 21","PERDISTE","error");
      
    }else if(this.puntosJugador != this.puntosCrupier){

      if( this.puntosJugador > this.puntosCrupier || this.puntosCrupier > 21){
      this.conclusionPartida("Tu puntaje es mayor que el Crupier","GANASTE"," ");
        //GANASTE con o sin blackjack
        //REGISTRO
        this.fireStore.insertarPuntaje(this.puntosJugador,this.auth.email,"blackjack");
      }else{
      this.conclusionPartida("Tu puntaje es menor que el Crupier","PERDISTE","error");
        //PERDISTE
      }
    }else{
      //EMPATE
      this.conclusionPartida("Tienes los mismo puntos que el crupier","EMPATE"," ");
    }

  }

  conclusionPartida(mensaje:string,titulo:string,tipoMensaje:string){
    if(tipoMensaje=="error"){
      this.toast.error(mensaje,titulo,{
        positionClass:"toast-top-center",timeOut:1500
      });
    }else{
      this.toast.success(mensaje,titulo,{
        positionClass:"toast-top-center",timeOut:1500
      });
    }
    this.partidaTerminada = true;
    this.mensajePartida = mensaje;
    this.mensajeTitulo = titulo;
  }

}
