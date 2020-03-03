import { Application } from "express";
import { all, create, get, patch, remove } from "./controller";
import { isAuthenticated } from './authenticated';
import { isAuthorized } from './authorized';
import { Roles } from './roles';

const userManagerRoles = [Roles.admin, Roles.manager];

export function routesConfig(app: Application) {

  app.post('/users', [
    isAuthenticated,
    isAuthorized({hasRole: userManagerRoles}),
    create
  ]);

  app.get('/users', [
    isAuthenticated,
    isAuthorized({hasRole: userManagerRoles}),
    all
  ]);

  app.get('/users/:id', [
    isAuthenticated,
    isAuthorized({hasRole: userManagerRoles, allowSameUser: true}),
    get
  ]);

  app.patch('/users/:id', [
    isAuthenticated,
    isAuthorized({hasRole: userManagerRoles, allowSameUser: true}),
    patch
  ]);

  app.delete('/users/:id', [
    isAuthenticated,
    isAuthorized({hasRole: userManagerRoles}),
    remove
  ]);
}
