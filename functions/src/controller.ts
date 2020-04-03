import {Request, Response} from 'express';
import * as admin from 'firebase-admin';
import {Roles} from './roles';

export async function create(req: Request, res: Response) {
  try {
    const {displayName, password, email, role, dailyCalories} = req.body;

    validateRequired(displayName, password, email, role);
    validatePassword(password);

    const {uid} = await admin.auth().createUser({
      displayName,
      password,
      email
    });

    await admin.auth().setCustomUserClaims(uid, {role});

    if (dailyCalories) {
      await admin.firestore().doc(`users/${uid}`).set({
        dailyCalories
      });
    }

    res.status(201);
    return res.send({uid});
  } catch (err) {
    return handleError(res, err);
  }
}

export async function get(req: Request, res: Response) {
  try {
    const {id} = req.params;
    const user = await admin.auth().getUser(id);
    const userInfo = await mapUser(user);
    res.status(200);
    return res.send({user: userInfo});
  } catch (err) {
    return handleError(res, err);
  }
}

export async function patch(req: Request, res: Response) {
  try {
    const {id} = req.params;
    const {displayName, password, email, role, dailyCalories} = req.body;

    validateRequired(id, displayName, email, role);

    if (password) {
      validatePassword(password);
      await admin.auth().updateUser(id, {displayName, email, password});
    } else {
      await admin.auth().updateUser(id, {displayName, email});
    }

    await admin.auth().setCustomUserClaims(id, {role});

    if (dailyCalories) {
      await admin.firestore().doc(`users/${id}`).set({
        dailyCalories
      }, {merge: true});
    }

    const user = await admin.auth().getUser(id);

    const userInfo = await mapUser(user);

    res.status(200);
    return res.send({user: userInfo});
  } catch (err) {
    return handleError(res, err);
  }
}

export async function remove(req: Request, res: Response) {
  try {
    const {id} = req.params;
    await admin.auth().deleteUser(id);
    res.status(204);
    return res.send({});
  } catch (err) {
    return handleError(res, err);
  }
}

export async function all(req: Request, res: Response) {
  try {
    // todo: optimize
    const listUsers = await admin.auth().listUsers();
    const users = await Promise.all(listUsers.users.map(mapUser));
    res.status(200);
    return res.send({users});
  } catch (err) {
    return handleError(res, err);
  }
}

async function mapUser(user: admin.auth.UserRecord) {

  const customClaims = (user.customClaims || {role: Roles.user}) as { role: string };

  const docSnap = await admin.firestore().doc(`users/${user.uid}`).get();
  const userInfo = docSnap.data() as { dailyCalories?: number };

  return {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    role: customClaims.role,
    dailyCalories: userInfo?.dailyCalories,
    lastSignInTime: user.metadata.lastSignInTime,
    creationTime: user.metadata.creationTime
  };
}

const DATA_VALIDATION_ERROR = 'DataValidationError';

function handleError(res: Response, err: any) {
  if (err.name === DATA_VALIDATION_ERROR) {
    res.status(400);
    return res.send({message: `${err.message}`});
  } else {
    res.status(500);
    return res.send({message: `${err.code} - ${err.message}`});
  }
}

function validatePassword(password: string) {
  if (password.length < 8) {
    throw {name: DATA_VALIDATION_ERROR, message: 'Password should be more than 8 characters long'};
  }
}

function validateRequired(...fields) {
  if (fields.some(field => !field)) {
    throw {name: DATA_VALIDATION_ERROR, message: 'Missing fields'};
  }
}

