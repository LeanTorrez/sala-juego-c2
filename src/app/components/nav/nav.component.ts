import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  auth = inject(AuthService);

  router = inject(Router);

  cerrarSesion(){
    this.auth.enSesion = false;
    this.auth.email = "";
    this.auth.token = "";
    this.router.navigate(["/home"]);
  }
}
