import { Request, Response } from 'express';
import { RoleLevel, Roles } from './roles';

export function isAuthorized(opts: { hasRole: Array<string>, allowSameUser?: boolean }) {
  return (req: Request, res: Response, next: any) => {

    try {

      const {role, email, uid} = res.locals;
      const {id} = req.params;

      if (email === 'admin@domain.com') {
        return next();
      }

      if (req.body?.role) {
        validateRoleFromTo(role, req.body.role);
      }

      if (opts.allowSameUser && id && uid === id) {
        return next();
      }

      if (role && opts.hasRole.includes(role)) {
        return next();
      }

      throw new Error('Fulfill all requirements');
    } catch (err) {
      res.status(403);
      return res.send({message: `Unauthorized: ${err.message}`});
    }
  };
}

function validateRoleFromTo(fromRole: string, toRole: string) {
  if (!(fromRole in Roles) || !(toRole in Roles) ||
    (RoleLevel[fromRole] < RoleLevel[toRole])) {
    throw new Error('Check all passed roles');
  }
}
