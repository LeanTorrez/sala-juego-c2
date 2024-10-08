import { inject, Injectable, OnInit } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, User} from "@angular/fire/auth";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { FireStoreService } from './fire-store.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {

  auth = inject(Auth);
  router = inject(Router);
  toast = inject(ToastrService);
  fireStore = inject(FireStoreService);


  enSesion !:User | null;
  email = "";
  token = "";

  currentUser!:User | null;
  private authStatusSub = new BehaviorSubject(this.currentUser);
  currentAuthStatus = this.authStatusSub.asObservable();

  constructor(){
    this.authStatusListener();
    this.currentAuthStatus.subscribe(authStatus => {
      this.enSesion = authStatus;
      if(typeof this.enSesion?.email === "string"){
        this.email = this.enSesion?.email;
      }
    });
  }

  ngOnInit(): void {

  }

  authStatusListener(){
    this.auth.onAuthStateChanged((credential)=>{
      if(credential){
        console.log(credential);
        this.authStatusSub.next(credential);
        console.log('User is logged in');
      }
      else{
        this.authStatusSub.next(null);
        console.log('User is logged out');
      }
    })
  }
  

  iniciarSesion(email:string, clave:string){
    signInWithEmailAndPassword(this.auth, email, clave)
    .then( (data) => {
      this.currentUser = data.user;
      this.enSesion = data.user;
      console.log(this.currentUser);
     /*  this.enSesion = true; */
      this.email = email;

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
     /*  this.enSesion = true; */
      this.email = email;

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
