import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { TablePuntajesComponent } from '../table-puntajes/table-puntajes.component';
import { Puntaje } from '../../Interfaces/IPuntaje';
import { AuthService } from '../../services/auth.service';
import { FireStoreService } from '../../services/fire-store.service';
import { Subscription } from 'rxjs';
import { FechaPipe } from '../../pipes/fecha.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMedal } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-puntuaciones',
  standalone: true,
  imports: [TablePuntajesComponent, FechaPipe, FontAwesomeModule],
  templateUrl: './puntuaciones.component.html',
  styleUrl: './puntuaciones.component.css'
})
export class PuntuacionesComponent implements OnInit, OnDestroy {

  faMedalla = faMedal;

  listadoPuntajes!:Puntaje[];

  puntajesAhorcado!:Puntaje[];
  puntajesBlackJack!:Puntaje[];
  puntajesMayorMenor!:Puntaje[];
  puntajesPreguntados!:Puntaje[];
  puntajesJugador!:Puntaje[];

  auth = inject(AuthService);
  fireStore = inject(FireStoreService);

  private suscription!:Subscription

  ngOnInit(): void {
    const obs = this.fireStore.observablePuntajes();
    this.suscription = obs.subscribe((listado)=> {
      console.log(listado);
      this.listadoPuntajes = listado;

      this.listadoPuntajes.sort((p1 ,p2)=> p2.puntaje - p1.puntaje);

      this.listadoAhorcado();
      this.listadoBlackJack();
      this.listadoMayorMenor();
      this.listadoPreguntados();
      this.listadoJugador();
    })
  }

  ngOnDestroy(): void {
    this.suscription.unsubscribe();
  }

  listadoAhorcado(){
    this.puntajesAhorcado = this.listadoPuntajes.filter((puntaje)=> puntaje.juego === "ahorcado");
  }

  listadoBlackJack(){
    this.puntajesBlackJack = this.listadoPuntajes.filter((puntaje)=> puntaje.juego === "blackjack");
  }

  listadoMayorMenor(){
    this.puntajesMayorMenor = this.listadoPuntajes.filter((puntaje)=> puntaje.juego === "mayor-menor");
  }

  listadoPreguntados(){
    this.puntajesPreguntados = this.listadoPuntajes.filter((puntaje)=> puntaje.juego === "preguntados");
  }

  listadoJugador(){
    this.puntajesJugador = this.listadoPuntajes.filter((puntaje)=> puntaje.email === this.auth.email);
  }
}
