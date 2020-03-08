import { Application } from "express";
import { all, create, get, patch, remove } from "./controller";
import { isAuthenticated } from './authenticated';
import { isAuthorized } from './authorized';
import { UserManagerRoles } from './roles';

export function routesConfig(app: Application) {

  app.post('/users', [
    isAuthenticated,
    isAuthorized({hasRole: UserManagerRoles}),
    create
  ]);

  app.get('/users', [
    isAuthenticated,
    isAuthorized({hasRole: UserManagerRoles}),
    all
  ]);

  app.get('/users/:id', [
    isAuthenticated,
    isAuthorized({hasRole: UserManagerRoles, allowSameUser: true}),
    get
  ]);

  app.patch('/users/:id', [
    isAuthenticated,
    isAuthorized({hasRole: UserManagerRoles, allowSameUser: true}),
    patch
  ]);

  app.delete('/users/:id', [
    isAuthenticated,
    isAuthorized({hasRole: UserManagerRoles}),
    remove
  ]);
}
