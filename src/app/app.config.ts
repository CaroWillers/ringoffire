import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getStorage, provideStorage } from '@angular/fire/storage';
import {
  getRemoteConfig,
  provideRemoteConfig,
} from '@angular/fire/remote-config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'ring-of-fire-2b44e',
        appId: '1:315646523863:web:689c7302d760c99f9b3392',
        storageBucket: 'ring-of-fire-2b44e.appspot.com',
        apiKey: 'AIzaSyDxr0drSI9I6uDJ4yu82aAl0wtQ4I5fOJg',
        authDomain: 'ring-of-fire-2b44e.firebaseapp.com',
        messagingSenderId: '315646523863',
      })
    ),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
    provideRemoteConfig(() => getRemoteConfig()),
  ],
};
