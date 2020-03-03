// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const firebaseConfig = {
  apiKey: 'AIzaSyBKGSu6cybncQofBccKheRHU8MJtxVsDCk',
  authDomain: 'calman-777.firebaseapp.com',
  databaseURL: 'https://calman-777.firebaseio.com',
  projectId: 'calman-777',
  storageBucket: 'calman-777.appspot.com',
  messagingSenderId: '369867060760',
  appId: '1:369867060760:web:7fb389413e1661e442756d',
  measurementId: 'G-9T9GHFJTSK'
};

export const environment = {
  production: false,
  firebase: firebaseConfig,
  baseUrl: 'https://us-central1-calman-777.cloudfunctions.net'
};
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
