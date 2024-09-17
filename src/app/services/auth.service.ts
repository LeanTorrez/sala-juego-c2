import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut} from "@angular/fire/auth";
import { Firestore, collection, collectionData,setDoc, DocumentData, doc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FireStoreService } from './fire-store.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  auth = inject(Auth);
  router = inject(Router);
  toast = inject(ToastrService);
  fireStore = inject(FireStoreService);

  enSesion = false;
  email = "";
  token = "";

  iniciarSesion(email:string, clave:string){
    signInWithEmailAndPassword(this.auth, email, clave)
    .then( (data) => {
      this.enSesion = true;
      this.email = email;
      data.user.getIdToken().then(token => this.token = token);

      this.fireStore.insertarLogs(email);

      this.router.navigate(["/home"]);
    })
    .catch(( error) => {
      this.toast.error(this.errores(error.code),"ERROR",{
        positionClass:"toast-top-center",timeOut:3000
      });
    })
  }

  registrarUsuario(email:string, clave:string){
    createUserWithEmailAndPassword(this.auth, email, clave)
    .then((data) => {
      this.enSesion = true;
      this.email = email;
      data.user.getIdToken().then(token => this.token = token);

      this.fireStore.insertarLogs(email);

      this.router.navigate(["/home"]);
    })
    .catch(( error) => {
      this.toast.error(this.errores(error.code),"ERROR",{
        positionClass:"toast-top-center",timeOut:3000
      });
    })
  }

  cerrarSesion(){
    signOut(this.auth)
    .then()
    .catch();
  }

  errores(error:string){
    let mensaje :string = "";
    switch(error){
      case "auth/invalid-email":
      case "auth/wrong-password":
      case "auth/invalid-credential":
        mensaje = "Clave o Email incorrectos";
        break;
      case "auth/user-not-found":
        mensaje = "Usuario no existente";
        break;
      case "auth/too-many-requests":
        mensaje = "Error en la conexion al servidor";
        break;
      case "auth/email-already-in-use":
        mensaje = "El email que ingreso ya esta registrado";
        break;
      default:
        mensaje = "Error no identificado";
    }
    return mensaje;
  }
}
