import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators , FormArray} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFileSignature, faMobileScreen, faGamepad, faComment, faThumbsUp} from '@fortawesome/free-solid-svg-icons';
import { Encuesta } from '../../Interfaces/IEncuesta';
import { FireStoreService } from '../../services/fire-store.service';

@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.css'
})
export class EncuestaComponent {

  faNombre = faFileSignature;
  faTelefono = faMobileScreen;
  faJuego = faGamepad;
  faComentario = faComment;
  faOpinion = faThumbsUp;

  private fireStore = inject(FireStoreService);
  private toast = inject(ToastrService);
  private fb = inject(FormBuilder);
  auth = inject(AuthService);

  esNecesarioJuegos = false;
  protected form:FormGroup;
  constructor(){
    this.form = this.fb.group({
      nombre: new FormControl(null,Validators.compose([Validators.required,Validators.pattern("^[a-zA-Z ]+$"),Validators.minLength(3),Validators.maxLength(30),Validators.nullValidator])),
      apellido: new FormControl(null,Validators.compose([Validators.required,Validators.pattern("^[a-zA-Z ]+$"),Validators.minLength(3),Validators.maxLength(15),Validators.nullValidator])),
      edad: new FormControl(18,Validators.compose([Validators.required,Validators.max(99),Validators.min(18),Validators.nullValidator])),
      telefono: new FormControl("1111111111",Validators.compose([Validators.pattern("^[0-9]*$"),Validators.required,Validators.minLength(10),Validators.maxLength(10),Validators.nullValidator])),
      juegos: new FormArray([]),
      opinion: new FormControl("",Validators.compose([Validators.required,Validators.minLength(10),Validators.maxLength(200),Validators.nullValidator])),
      recomendar: ["",Validators.required],
    });
  }

  enviarEncuesta(){
    this.form.markAllAsTouched();
    
    if(this.form.invalid){
      this.toast.error("Los datos para la encuesta no estan completos o son incorrectos","ERROR",{
        positionClass:"toast-top-center",timeOut:2000
      });
      return;
    }
    const model = this.form.value as Encuesta;
    
    this.fireStore.insertarEncuesta(model, this.auth.email);


  }

  juegosFavoritos(event :any) {
    const formArray: FormArray = this.form.get('juegos') as FormArray; 
    if(event != null){
      if(event.target.checked){
        formArray.push(new FormControl(event.target.value));
        this.esNecesarioJuegos = false;
      }
      else{
        let i: number = 0; 
        formArray.controls.forEach((control) => {
          if(control.value == event.target.value) {
            formArray.removeAt(i);
            return;
          }
          i++;
        });
        if(formArray.length == 0){
          this.esNecesarioJuegos = true;
        }
      }
    }
    console.log(formArray.value);
    this.form.patchValue({juegos: formArray.value})
  }
}
