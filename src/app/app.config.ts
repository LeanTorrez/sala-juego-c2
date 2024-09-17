import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideToastr } from 'ngx-toastr';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"sala-juegos-c2","appId":"1:918329808986:web:087091fd12f2dd181ce063","storageBucket":"sala-juegos-c2.appspot.com","apiKey":"AIzaSyBecZomc-3c8_E3glvEGys_JBGMGioc8JM","authDomain":"sala-juegos-c2.firebaseapp.com","messagingSenderId":"918329808986","measurementId":"G-L4NNDEYPP5"})), provideAuth(() => getAuth()), provideFirestore(() => getFirestore()), provideStorage(() => getStorage()),
    provideToastr(),
    provideAnimations(),
    provideHttpClient(),
  ]
};
