import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';
import * as bodyParser from 'body-parser';
import { routesConfig } from './routes-config';

export const adminApp = admin.initializeApp();

const app = express();
app.use(bodyParser.json());
app.use(cors({origin: true}));
routesConfig(app);

export const api = functions.https.onRequest(app);

export const authUserCreated = functions.auth.user().onCreate((user: admin.auth.UserRecord) => {
  console.log('user created', user);
});

export const authUserDeleted = functions.auth.user().onDelete((user: admin.auth.UserRecord) => {
  console.log('user deleted', user);
});
