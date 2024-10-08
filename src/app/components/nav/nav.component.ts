import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUser, faDoorOpen } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink, FontAwesomeModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  auth = inject(AuthService);
  router = inject(Router);

  faUsuario = faUser;
  faSalir = faDoorOpen;

  cerrarSesion(){
    /* this.auth.enSesion = false; */
    this.auth.email = "";
    this.auth.token = "";
    this.auth.cerrarSesion();
    this.router.navigate(["/home"]);
  }
}
