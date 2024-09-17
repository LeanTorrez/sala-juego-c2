import { Component, inject } from '@angular/core';
import { FireStoreService } from '../../../services/fire-store.service';
import { AuthService } from '../../../services/auth.service';
import { faArrowsRotate} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-ahorcado',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.css'
})
export class AhorcadoComponent {

  faReinicio =  faArrowsRotate;
  caracter:string = "";

  fireStore = inject(FireStoreService);
  auth = inject(AuthService);

  public contadorExitos:number = 0;
  public contadorErrores:number = 0;

  public terminacionPartida:boolean = false;
  public terminacionMensaje:string = "GANASTE LA PARTIDA";

  public palabras= ["ARBOL","BICICLETA","AVION","SILLA","TECLADO","AUTO","ABECEDARIO",
                    "MAESTRA","ARGENTINA","CHILE","URUGUAY","COLOMBIA","ALUMNO","HELADO",
                    "PELADO"];

  public palabraSelec!:string;

  public alfabeto = ["A","B","C","D","E","F","G","H","I",
                     "J","K","L","M","N","O","P","R",
                     "S","T","U","V","W","X","Y","Z"];


  letraAhorcado(letra:string){
    this.caracter = letra;
    console.log(this.caracter);

    if(this.palabraSelec.includes(this.caracter)){

      /*Esto solo es para cuando termina el juego que no afecte en los botones*/
      if(this.contadorExitos == this.palabraSelec.length || this.contadorErrores >= 6) return false;

      const letra = document.getElementById("letra"+this.caracter);

      let index = this.indexLetras();

      this.contadorExitos += index.length;
      
      this.asignarLetrasSpan(index);

      letra?.setAttribute("disabled","");
      letra?.classList.remove("btn-primary");
      letra?.classList.add("btn-success");

      if(this.contadorExitos == this.palabraSelec.length)
        this.configuracionMensajeTerminacion("GANASTE LA PARTIDA",true);

      console.log("Esta en la palabra");
    }else{

      /*Esto solo es para cuando termina el juego que no afecte en los botones*/
      if(this.contadorExitos == this.palabraSelec.length || this.contadorErrores >= 6) return false;

      this.contadorErrores++;

      const letra = document.getElementById("letra"+this.caracter);
      letra?.setAttribute("disabled","");
      letra?.classList.remove("btn-primary");
      letra?.classList.add("btn-danger");

      if(this.contadorErrores >= 6) 
        this.configuracionMensajeTerminacion("PERDISTE LA PARTIDA");
        
      console.log("No esta en la palabra");
    }
    return false;
  }

  configuracionMensajeTerminacion(mensaje:string, gano:boolean = false){
    this.terminacionPartida = true; 
    this.terminacionMensaje = mensaje;

    if(gano){
      this.fireStore.insertarPuntaje(this.contadorExitos, this.auth.email, "ahorcado");
    }
  }

  ngOnInit(){
    this.comienzoJuego();
  }

  comienzoJuego(){
    this.terminacionPartida = false;
    this.palabraSelec = this.palabras[Math.floor(Math.random() * this.palabras.length)];
    this.reiniciarAhorcado();
  }

  indexLetras(){
    let indices:number[] = [];
    for(let i = 0;i < this.palabraSelec.length; i++){
      if(this.palabraSelec[i]==this.caracter) indices.push(i);
    }
    return indices;
  }

  asignarLetrasSpan(index:number[]){
    index.forEach(e => {
      const span = document.getElementById("caracter" + e);
      if(span != null){
        span.innerText = this.caracter;
        span.classList.remove("span-ahorcado");
        span.classList.add("span-exito");
      }
    });
  }

  reiniciarAhorcado(){
    for(let i = 0;i < this.palabraSelec.length;i++){
      const span = document.getElementById("caracter" + i);
      if(span != null){
        span.innerText = "___";
        span.classList.remove("span-exito");
        span.classList.add("span-ahorcado");
      }
    }
    this.alfabeto.forEach(c=>{
      const letra = document.getElementById("letra"+c);
      letra?.removeAttribute("disabled");
      letra?.classList.remove("btn-success");
      letra?.classList.remove("btn-danger");
      letra?.classList.add("btn-primary");
    })
    this.contadorErrores = 0;
    this.contadorExitos = 0;
  }

}
