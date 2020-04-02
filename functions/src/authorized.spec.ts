import 'mocha';
import { Request, Response } from 'express';
import * as sinon from 'sinon';
import { isAuthorized } from './authorized';
import { expect } from 'chai';
import { UserManagerRoles } from './roles';

describe('authorized.ts', () => {

  let req: Partial<Request>;
  let res: Partial<Response>;
  let next;

  beforeEach(() => {
    req = {headers: {}, params: {}};
    res = {
      status: sinon.stub(),
      send: sinon.stub(),
      locals: {
        uid: Math.random().toString(),
        email: 'test@domain.com',
        role: 'user'
      }
    };
    next = sinon.stub();
  });

  describe('when called with invalid request', () => {
    it('should return status: 403', async () => {
      req = {headers: {}};
      await isAuthorized({hasRole: UserManagerRoles})(req as Request, res as Response, next);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 403);
    });

    it('should return {message: "Unauthorized:..."}', async () => {
      req = {headers: {}};
      await isAuthorized({hasRole: ['user']})(req as Request, res as Response, next);

      const responseMessage = (res.send as sinon.SinonStub).lastCall.args[0];
      expect(responseMessage).to.have.property('message').match(/^Unauthorized:/);
    });
  });

  describe('when called with res without locals field (locals filled in isAuthenticated)', () => {
    beforeEach(() => {
      res = {
        status: sinon.stub(),
        send: sinon.stub(),
      };
    });

    it('should return status: 403', async () => {
      await isAuthorized({hasRole: ['user']})(req as Request, res as Response, next);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 403);
    });

    it('should return {message: "Unauthorized:..."}', async () => {
      await isAuthorized({hasRole: ['user']})(req as Request, res as Response, next);

      const responseMessage = (res.send as sinon.SinonStub).lastCall.args[0];
      expect(responseMessage).to.have.property('message').match(/^Unauthorized:/);
    });
  });

  describe('when called with valid req, res', () => {
    beforeEach(() => {
    });

    it('should call next when email is admin@domain.com', async () => {
      res.locals.email = 'admin@domain.com';
      await isAuthorized({hasRole: []})(req as Request, res as Response, next);
      sinon.assert.calledOnce(next as sinon.SinonStub);
    });

    it('should return 403 if allowSameUser is set and ids do not match', async () => {
      req.params.id = 'a';
      res.locals.uid = 'b';
      await isAuthorized({hasRole: [], allowSameUser: true})(req as Request, res as Response, next);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 403);
    });

    it('should call next if allowSameUser is set and ids match', async () => {
      req.params.id = 'a';
      res.locals.uid = 'a';
      await isAuthorized({hasRole: [], allowSameUser: true})(req as Request, res as Response, next);
      sinon.assert.calledOnce(next as sinon.SinonStub);
    });

    it('should return 403 if role is not provided', async () => {
      res.locals.role = null;
      await isAuthorized({hasRole: []})(req as Request, res as Response, next);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 403);
    });

    it('should call next if role is provided and in hasRole', async () => {
      res.locals.role = UserManagerRoles[0];
      await isAuthorized({hasRole: UserManagerRoles})(req as Request, res as Response, next);
      sinon.assert.calledOnce(next as sinon.SinonStub);
    });

    it('should return 403 if role is provided and is not in hasRole', async () => {
      res.locals.role = 'a';
      await isAuthorized({hasRole: UserManagerRoles})(req as Request, res as Response, next);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 403);
    });
  });

});

