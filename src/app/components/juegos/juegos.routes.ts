import { Routes } from "@angular/router";
export const routes:Routes =[
    {
        path:"ahorcado",
        loadComponent: () => import("./ahorcado/ahorcado.component").then(m => m.AhorcadoComponent)
    },
    {
        path:"mayor-menor",
        loadComponent: () => import("./mayor-menor/mayor-menor.component").then(m => m.MayorMenorComponent)
    },
    {
        path:"preguntados",
        loadComponent: () => import("./preguntados/preguntados.component").then(m => m.PreguntadosComponent)
    },
    {
        path:"blackjack",
        loadComponent: () => import("./blackjack/blackjack.component").then(m => m.BlackjackComponent)
    }
]

export default routes;