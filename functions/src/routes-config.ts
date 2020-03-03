import { Application } from "express";
import { all, create, get, patch, remove } from "./controller";
import { isAuthenticated } from './authenticated';
import { isAuthorized } from './authorized';

export function routesConfig(app: Application) {

  app.post('/users', [
    isAuthenticated,
    isAuthorized({hasRole: ['admin', 'manager']}),
    create
  ]);

  app.get('/users', [
    isAuthenticated,
    isAuthorized({hasRole: ['admin', 'manager']}),
    all
  ]);

  app.get('/users/:id', [
    isAuthenticated,
    isAuthorized({hasRole: ['admin', 'manager'], allowSameUser: true}),
    get
  ]);

  app.patch('/users/:id', [
    isAuthenticated,
    isAuthorized({hasRole: ['admin', 'manager'], allowSameUser: true}),
    patch
  ]);

  app.delete('/users/:id', [
    isAuthenticated,
    isAuthorized({hasRole: ['admin', 'manager']}),
    remove
  ]);
}
