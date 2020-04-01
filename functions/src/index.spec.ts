import 'mocha';
import * as sinon from 'sinon';

// // At the top of test/index.test.js
// const test = require('firebase-functions-test')({
//   databaseURL: 'https://my-project.firebaseio.com',
//   storageBucket: 'my-project.appspot.com',
//   projectId: 'my-project',
// }, 'path/to/serviceAccountKey.json');

afterEach(() => {
  sinon.restore();
});
