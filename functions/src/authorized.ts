import { Request, Response } from 'express';

export function isAuthorized(opts: { hasRole: Array<string>, allowSameUser?: boolean }) {
  return (req: Request, res: Response, next: any) => {

    try {

      const {role, email, uid} = res.locals;
      const {id} = req.params;

      if (email === 'admin@domain.com') {
        return next();
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
