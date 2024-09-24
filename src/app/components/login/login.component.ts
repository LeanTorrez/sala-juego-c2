import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLock, faEnvelope} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  auth = inject(AuthService);
  toast = inject(ToastrService);

  faClave = faLock;
  faEmail = faEnvelope;

  email = "";
  clave = "";


  private fb = inject(FormBuilder);
  protected form:FormGroup;
  constructor(){
    this.form = this.fb.group({
      email: new FormControl(null,Validators.compose([Validators.required,Validators.email,Validators.nullValidator])),
      clave: new FormControl(null,Validators.compose([Validators.required,Validators.minLength(6),Validators.nullValidator]))
    });
  }
  
  iniciarSesion(){
    this.form.markAllAsTouched();

    if(this.form.invalid){
      this.toast.error("Los datos para iniciar sesion no estan completos o son incorrectos","ERROR",{
        positionClass:"toast-top-center",timeOut:2000
      });
      return;}
    const model = this.form.value;
    this.clave = model.clave;
    this.email = model.email;


    this.auth.iniciarSesion(this.email, this.clave);
  }

  llenarUsuario(numero :number){
    switch(numero){
      case 1:
        this.form.setValue({email:"pepito@gmail.com", clave: "asdasd"});
        break;
      case 2:
        this.form.setValue({email:"jose@gmail.com", clave: "asdasd"});
        break;
    }
  }
}
