import 'mocha';
import * as sinon from 'sinon';
import * as test from 'firebase-functions-test';
import * as configs from './test-data.spec';

console.log('_______________________');

const firebaseConfig = {
  databaseURL: 'https://calman-777.firebaseio.com',
  projectId: 'calman-777',
};

const testApp = test(firebaseConfig, '../firebase-service-key.private.json');
let adminApp;

before(async function () {

  this.timeout(15000);

  try {
    adminApp = (await import('./index')).adminApp;
    await configs.initTestData();
  } catch (e) {
    throw e;
  }
});

afterEach(() => {
  sinon.restore();
});

after(async () => {
  try {
    await configs.clearTestData();
    await adminApp.delete();
    testApp.cleanup();
  } catch (e) {
    console.log('Failed to clean up test app', e);
  } finally {
    console.log('_______________________');
  }
});

describe('index.ts', () => {
  it.skip('should', () => {
  });
});
