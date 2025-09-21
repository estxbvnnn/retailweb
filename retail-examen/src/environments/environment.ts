// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  mapbox: {
    accessToken: 'pk.eyJ1IjoiZXN0eGJ2biIsImEiOiJjbWV5b3oweWUxbGFyMnJvYXU3cTVlaWxlIn0._Q39NyiwrEprwLJGNVy3WA',
  },
  firebase: {
    apiKey: 'AIzaSyDHSNS8BSZYkZtCOa6Jv814g9ed30eUtIs',
    authDomain: 'retailoff-5e869.firebaseapp.com',
    projectId: 'retailoff-5e869',
    storageBucket: 'retailoff-5e869.firebasestorage.app',
    messagingSenderId: '164786716293',
    appId: '1:164786716293:web:f1d6e61f37d620522b33ec',
    measurementId: 'G-T5N5TG6SBJ',
  },
  awsApi: {
    baseUrl: 'https://yqfrbl2kg9.execute-api.us-east-1.amazonaws.com/pmp-video-deploy',
    endpoints: {
      saveTransaction: '/transactions',
      listTransactions: '/transactions/list',
      // Rutas reales del API Gateway REST
      registerUser: '/pmp-video-post',
      loginUser: '/pmp-video-get',
    },
    apiKey: 'KoeehAhdib43jwl69AWmbAr3BZvPYDq388YHD30h',
  },
  // Activar fallback para que el POST llegue a Lambda mientras ajustas CORS
  useNoCorsFallback: true,
};