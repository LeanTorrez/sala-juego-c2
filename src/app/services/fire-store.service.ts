import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData,setDoc, DocumentData, doc, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Mensaje } from '../Interfaces/IMensaje';
import { Puntaje } from '../Interfaces/IPuntaje';
import { Encuesta } from '../Interfaces/IEncuesta';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class FireStoreService {
  fireStore = inject(Firestore);
  toast = inject(ToastrService);
  router = inject(Router);

  insertarLogs(email:string){
    const col = collection(this.fireStore,"logs");
    const docRef = doc(col);

    setDoc(docRef,{
      id: docRef.id,
      email: email,
      fecha: new Date()
    })
  }

  insertarChatMensaje(mensaje:string, email: string){
    const col = collection(this.fireStore, "chats");
    addDoc(col,{
      email: email,
      mensaje: mensaje,
      fecha: new Date()
     });
  }

  insertarPuntaje(puntaje:number, email:string, juego:string){
    const col = collection(this.fireStore, "puntajes");
    addDoc(col,{
      juego: juego,
      email: email,
      puntaje: puntaje,
      fecha: new Date()
     });
  }

  insertarEncuesta(encuesta:Encuesta, email:string){
    const col = collection(this.fireStore, "encuesta");
    addDoc(col,{
      nombre: encuesta.nombre,
      apellido: encuesta.apellido,
      edad: encuesta.edad,
      telefono: encuesta.telefono,
      opinion: encuesta.opinion,
      recomendar: encuesta.recomendar,
      juegos: encuesta.juegos,
      email:email
    }).then(()=>{
      this.toast.success("Se envio la encuesta con exito, Muchas gracias","Exito",{
      positionClass:"toast-top-center",timeOut:3000
      });
      this.router.navigate(["/home"]);
    }
  )
  }

  observableChat(){
    const col = collection(this.fireStore, "chats")
    return collectionData(col) as Observable<Mensaje[]>;
  }

  observablePuntajes(){
    const col = collection(this.fireStore, "puntajes");
    return collectionData(col) as Observable<Puntaje[]>
  }
}
