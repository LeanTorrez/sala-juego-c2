import { Routes } from '@angular/router';
import {canActivate,redirectUnauthorizedTo,redirectLoggedInTo } from "@angular/fire/auth-guard"
import { authChildGuard } from './guards/auth-child.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {   
        path:"",
        loadComponent: () => import("./components/home/home.component").then(e => e.HomeComponent)
    },
    {   
        path:"home",
        loadComponent: () => import("./components/home/home.component").then(e => e.HomeComponent)
    },
    {   
        path:"login",
        loadComponent: () => import("./components/login/login.component").then(e => e.LoginComponent)
    },
    {   
        path:"registro",
        loadComponent: () => import("./components/registro/registro.component").then(e => e.RegistroComponent)
    },
    {   
        path:"quien-soy",
        loadComponent: () => import("./components/quien-soy/quien-soy.component").then(e => e.QuienSoyComponent)
    },
    {
        path:"puntajes",
        loadComponent: () => import("./components/puntuaciones/puntuaciones.component").then(e => e.PuntuacionesComponent),
        canActivate:[authGuard]
    },
    {
        path:"encuesta",
        loadComponent:() => import("./components/encuesta/encuesta.component").then(e => e.EncuestaComponent),
        canActivate:[authGuard]
    },
    {
        path:"juegos",
        loadChildren: () => import("./components/juegos/juegos.routes"),
        canActivateChild: [authChildGuard],
    },
    {
        path:"**",
        redirectTo:"home"
    }
];
