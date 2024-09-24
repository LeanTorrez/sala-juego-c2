import { Component, inject, OnDestroy } from '@angular/core';
import { Pais } from "./../../../Interfaces/IPais";
import { Subscriber, Subscription } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';
import { FireStoreService } from '../../../services/fire-store.service';

@Component({
  selector: 'app-preguntados',
  standalone: true,
  imports: [],
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.css'
})
export class PreguntadosComponent implements OnDestroy{

  public arrayPreguntas!:Pais[];
  public contadorPreguntas:number = 0;

  public imagenPregunta!:string;
  public correcta!:string;
  public indexCorrecta!:number;
  

  public opciones = new Array<string>;
  public arraysIndexOpcionesIncorrectas = new Array<number>;
  public indexOpcionCorrecta!:number;
  public arrayIndexUsados = new Array<number>;

  puntos:number = 0;

  private suscriction!: Subscription;

  private paisApi = inject(ApiService);
  private auth = inject(AuthService);
  private fireStore = inject(FireStoreService);

  public juegoFinalizado:boolean = false;

  
  ngOnInit(){
    this.getPreguntas();
  }

  configurarPregunta(){
    this.opciones = [];
    this.arraysIndexOpcionesIncorrectas = [];

    this.indexCorrecta = Math.floor(Math.random() * this.arrayPreguntas.length);

    while(this.arrayIndexUsados.includes(this.indexCorrecta)){
      this.indexCorrecta = Math.floor(Math.random() * this.arrayPreguntas.length);
    }

    //Para que no se repitan banderas
    this.arrayIndexUsados.push(this.indexCorrecta);

    this.imagenPregunta = this.arrayPreguntas[this.indexCorrecta].flags.png;
    this.correcta = this.arrayPreguntas[this.indexCorrecta].translations.spa.common;

    this.opciones.push(this.correcta);

    this.prepararOpciones();

    this.contadorPreguntas += 1;
  }

  prepararOpciones(){
    this.arraysIndexOpcionesIncorrectas.push(this.indexCorrecta);

    for(let i = 0; i < 4;i++){     
      let indiceIncorrecta = Math.floor(Math.random() * this.arrayPreguntas.length);

      while(this.arraysIndexOpcionesIncorrectas.includes(indiceIncorrecta)){
        indiceIncorrecta = Math.floor(Math.random() * (this.arrayPreguntas.length + 1));
      }

      this.arraysIndexOpcionesIncorrectas.push(indiceIncorrecta);
      console.log(this.arraysIndexOpcionesIncorrectas);

      this.opciones.push(this.arrayPreguntas[indiceIncorrecta].translations.spa.common);
    }
    
    this.sufflePreguntas(this.opciones);
    this.indexOpcionCorrecta = this.opciones.indexOf(this.correcta);
  }

  sufflePreguntas(array: any[]){
    for (let i = array.length - 1; i > 0; i--) { 
      const j = Math.floor(Math.random() * (i + 1)); 
      [array[i], array[j]] = [array[j], array[i]]; 
    } 
    return array; 
  }

  responderPregunta(respuesta:string){
    if(respuesta == this.correcta){
      this.btnCorrecta();
      this.puntos += 1;

    }else{
      this.btnCorrecta();
    }

    setTimeout(() => {
      this.btnDefault();
      this.configurarPregunta();

      if(this.contadorPreguntas == 23){
        this.juegoFinalizado = true;
        
        this.fireStore.insertarPuntaje(this.puntos, this.auth.email, "preguntados");

      }

    }, 1500);
  }

  btnCorrecta(){
    for(let i = 0;i < this.opciones.length; i++){

      const btn = document.getElementById("opcion"+i);
      
      if(this.indexOpcionCorrecta != i){
        btn?.classList.remove("btn-primary");
        btn?.classList.add("btn-danger");
      }else{ 
        btn?.classList.remove("btn-primary");
        btn?.classList.add("btn-success");
      }

    }
  }

  btnDefault(){
    for(let i = 0;i < this.opciones.length;i++){
      const btn = document.getElementById("opcion"+i);
      if(this.indexOpcionCorrecta != i){
        btn?.classList.remove("btn-danger");
        btn?.classList.add("btn-primary");
      }else{ 
        btn?.classList.remove("btn-success");
        btn?.classList.add("btn-primary");
      }
    }
  }

  getPreguntas(){
    this.contadorPreguntas=0;
    this.opciones = [];
    this.arraysIndexOpcionesIncorrectas = [];

    const obs = this.paisApi.getObsPaises();

    this.suscriction = obs.subscribe((paises) =>{
      console.log(paises);
      this.arrayPreguntas = paises;
      this.sufflePreguntas(this.arrayPreguntas);

      this.indexCorrecta = Math.floor(Math.random() * this.arrayPreguntas.length);

      //Para que no se repitan banderas
      this.arrayIndexUsados.push(this.indexCorrecta);
      
      this.imagenPregunta = this.arrayPreguntas[this.indexCorrecta].flags.png;
      this.correcta = this.arrayPreguntas[this.indexCorrecta].translations.spa.common;
  
      this.opciones.push(this.correcta);

      this.prepararOpciones();
    });

    this.puntos = 0;
    this.juegoFinalizado = false;
  }

  ngOnDestroy(){
    this.suscriction.unsubscribe();
  }
}
