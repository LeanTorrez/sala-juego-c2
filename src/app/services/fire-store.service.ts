import { inject, Injectable } from '@angular/core';
import { Firestore, collection, collectionData,setDoc, DocumentData, doc, addDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Mensaje } from '../Interfaces/IMensaje';

@Injectable({
  providedIn: 'root'
})
export class FireStoreService {
  fireStore = inject(Firestore);

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

  observableChat(){
    const col = collection(this.fireStore, "chats")
    return collectionData(col) as Observable<Mensaje[]>;
  }
}
