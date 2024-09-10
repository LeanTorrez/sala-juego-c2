import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword} from "@angular/fire/auth";
import { Firestore, collection, collectionData,setDoc, DocumentData, doc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth = inject(Auth);
  router = inject(Router);
  toast = inject(ToastrService);
  fireStore = inject(Firestore);

  enSesion = false;
  email = "";
  token = "";

  iniciarSesion(email:string, clave:string){
    signInWithEmailAndPassword(this.auth, email, clave)
    .then( (data) => {
      this.enSesion = true;
      this.email = email;
      data.user.getIdToken().then(token => this.token = token);


      const col = collection(this.fireStore,"logs");
      const docRef = doc(col);

      setDoc(docRef,{
      id: docRef.id,
      email: email,
      fecha: new Date()
      })

      this.router.navigate(["/home"]);
    })
    .catch(( error) => console.error(error))
  }

  registrarUsuario(email:string, clave:string){
    createUserWithEmailAndPassword(this.auth, email, clave)
    .then((data) => {
      this.enSesion = true;
      this.email = email;
      data.user.getIdToken().then(token => this.token = token);

      const col = collection(this.fireStore,"logs");
      const docRef = doc(col);

      console.log("envio data a firestore");
      setDoc(docRef,{
        id: docRef.id,
        email: email,
        fecha: new Date()
      })

      this.router.navigate(["/home"]);
    })
    .catch(( error) => console.error(error))
  }
}
