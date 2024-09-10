import { Routes } from '@angular/router';

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
];
