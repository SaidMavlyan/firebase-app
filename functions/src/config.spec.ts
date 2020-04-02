import axios from 'axios';
import * as admin from 'firebase-admin';

let isInited = false;

const apiKey = 'AIzaSyBKGSu6cybncQofBccKheRHU8MJtxVsDCk';
const singUpUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;
const singInUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

export let idToken;
export let userId;

async function createTestUser(role: string = 'user') {
  try {
    let response = await axios.post(singUpUrl, {
      email: 'user23@example.com',
      password: 'test1234',
      returnSecureToken: true
    });

    userId = response.data.localId;

    await admin.auth().setCustomUserClaims(userId, {role});

    // after setting custom claims token is changed so login is required to get the new token
    response = await axios.post(singInUrl, {
      email: 'user12@example.com',
      password: 'test1234',
      returnSecureToken: true
    });

    idToken = response.data.idToken;

    return response.data.idToken;

  } catch (e) {
    console.log('Failed to create user', e.response.data);
  }
}

export async function initTestData() {
  if (isInited) {
    return true;
  }

  try {
    await createTestUser();
    isInited = true;
    return true;
  } catch (e) {
    console.log('Failed to init test data', e);
    throw e;
  }
}

export async function clearTestData() {
  if (!isInited) {
    return false;
  }

  try {
    await admin.auth().deleteUser(userId);
    isInited = false;
    return true;
  } catch (e) {
    console.log('Failed to clear test data', e);
    return false;
  }
}
