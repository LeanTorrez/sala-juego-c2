import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Firestore, collection, collectionData, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Mensaje } from '../../Interfaces/IMensaje';
import { FechaPipe } from '../../pipes/fecha.pipe';


@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule, FechaPipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  public msj!:string;
  public msjArray = new Array<Mensaje>;

  /* @Output() mostrarChat = new EventEmitter<boolean>(); */

  private fireStorage = inject(Firestore)
  auth = inject(AuthService);

  ngOnInit(){
    this.actualizarChat();
  }

 /*  cerrarChat(){
    this.mostrarChat.emit(false);
  }
 */
  nuevoMensaje(){
    if(this.msj == "") return false;
    const col = collection(this.fireStorage, "chats");
    addDoc(col,{
      email: this.auth.email,
      mensaje: this.msj,
      fecha: new Date()
     });
    this.msj = "";
    return true;
  }

  actualizarChat(){
    const col = collection(this.fireStorage, "chats")
    const obs = collectionData(col) as Observable<Mensaje[]>;

    obs.subscribe((respuesta) => {
      this.msjArray = respuesta.sort( (b: Mensaje, a: Mensaje) => b.fecha.valueOf() - a.fecha.valueOf()); 

      this.msjArray = respuesta;
    });
  }
}
