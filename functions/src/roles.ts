export const Roles = {
  admin: 'admin',
  manager: 'manager',
  user: 'user'
};

export enum RoleLevel {user, manager, admin }

export const UserManagerRoles = [
  Roles.admin,
  Roles.manager
];
