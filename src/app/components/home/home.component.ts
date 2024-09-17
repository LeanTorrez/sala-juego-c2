import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  auth = inject(AuthService);

  toast = inject(ToastrService);

  errorSinSesion(){
    this.toast.error("Para poder jugar es necesario Iniciar Sesion","ERROR",{
      positionClass:"toast-top-center",timeOut:3500
    })
  }
}
