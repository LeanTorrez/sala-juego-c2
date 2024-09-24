import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { Mensaje } from '../../Interfaces/IMensaje';
import { FechaPipe } from '../../pipes/fecha.pipe';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPaperPlane , faXmark, faComment} from '@fortawesome/free-solid-svg-icons';
import { FireStoreService } from '../../services/fire-store.service';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule, FechaPipe, FontAwesomeModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnDestroy{
  public msj!:string;
  public msjArray = new Array<Mensaje>;
  public mostrarChat = true;

  faEnviar = faPaperPlane;
  faCerrar = faXmark;
  faChat = faComment;

  private suscribe!: Subscription;

  
  
  private fireStore = inject(FireStoreService);
  auth = inject(AuthService);

  ngOnInit(){
    this.actualizarChat();
  }

  accionarChat(){
    this.mostrarChat = !this.mostrarChat;
  }
 
  nuevoMensaje(){
    if(this.msj == "") return false;
    
    this.fireStore.insertarChatMensaje(this.msj, this.auth.email);
    this.msj = ""; 
    return true;
  }

  actualizarChat(){
    const obs = this.fireStore.observableChat();
    this.suscribe = obs.subscribe((respuesta) => {
      this.msjArray = respuesta.sort( (b: Mensaje, a: Mensaje) => b.fecha.valueOf() - a.fecha.valueOf()); 
    });
  }

  ngOnDestroy(): void {
    this.suscribe.unsubscribe();
  }

}
