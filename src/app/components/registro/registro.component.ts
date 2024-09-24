import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLock, faEnvelope} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, FontAwesomeModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

  toast = inject(ToastrService);
  auth = inject(AuthService);

  faClave = faLock;
  faEmail = faEnvelope;


  email = "";
  clave = "";
  claveComparar = "";
  esContraseniaIgual = false;


  private fb = inject(FormBuilder);
  protected form:FormGroup;
  constructor(){
    this.form = this.fb.group({
      email: new FormControl(null,Validators.compose([Validators.required,Validators.email,Validators.nullValidator])),
      clave: new FormControl(null,Validators.compose([Validators.required,Validators.minLength(6),Validators.nullValidator])),
      claveComparar: new FormControl(null,Validators.compose([Validators.required,Validators.minLength(6),Validators.nullValidator]))
    });
  }

  compararContrasenia(clave :string){
    this.esContraseniaIgual = false;
    console.log(clave + " - " +  this.claveComparar);
    if(clave != this.claveComparar){
      this.esContraseniaIgual = true;
    }
  }
  
  registrar(){
    this.form.markAllAsTouched();
    console.log("entro inicio")
    if(this.form.invalid){
      this.toast.error("Los datos para iniciar sesion no estan completos o son incorrectos","ERROR",{
        positionClass:"toast-top-center",timeOut:3000
      });
        return;}
      console.log("paso las validaciones");
      
    const model = this.form.value;
    this.clave = model.clave;
    this.email = model.email;
    this.claveComparar = model.claveComparar;

    console.log(this.email + " - " + this.clave + " - " + this.claveComparar);

    this.compararContrasenia(this.clave);

    if(!this.esContraseniaIgual){
      this.auth.registrarUsuario(this.email, this.clave);
    }

  }
}
