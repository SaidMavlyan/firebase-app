import 'mocha';
import {Request, Response} from 'express';
import * as sinon from 'sinon';
import {isAuthorized} from './authorized';
import {expect} from 'chai';
import {Roles, UserManagerRoles} from './roles';

describe.only('authorized.ts', () => {

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
    it('should return status: 403', () => {
      req = {headers: {}};
      isAuthorized({hasRole: UserManagerRoles})(req as Request, res as Response, next);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 403);
    });

    it('should return {message: "Unauthorized:..."}', () => {
      req = {headers: {}};
      isAuthorized({hasRole: ['user']})(req as Request, res as Response, next);

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

    it('should return status: 403', () => {
      isAuthorized({hasRole: ['user']})(req as Request, res as Response, next);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 403);
    });

    it('should return {message: "Unauthorized:..."}', () => {
      isAuthorized({hasRole: ['user']})(req as Request, res as Response, next);

      const responseMessage = (res.send as sinon.SinonStub).lastCall.args[0];
      expect(responseMessage).to.have.property('message').match(/^Unauthorized:/);
    });
  });

  describe('when called with valid req, res', () => {
    beforeEach(() => {
    });

    it('should call next when email is admin@domain.com', () => {
      res.locals.email = 'admin@domain.com';
      isAuthorized({hasRole: []})(req as Request, res as Response, next);
      sinon.assert.calledOnce(next as sinon.SinonStub);
    });

    it('should return 403 if allowSameUser is set and ids do not match', () => {
      req.params.id = 'a';
      res.locals.uid = 'b';
      isAuthorized({hasRole: [], allowSameUser: true})(req as Request, res as Response, next);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 403);
    });

    it('should call next if allowSameUser is set and ids match', () => {
      req.params.id = 'a';
      res.locals.uid = 'a';
      isAuthorized({hasRole: [], allowSameUser: true})(req as Request, res as Response, next);
      sinon.assert.calledOnce(next as sinon.SinonStub);
    });

    it('should return 403 if role is not provided', () => {
      res.locals.role = null;
      isAuthorized({hasRole: []})(req as Request, res as Response, next);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 403);
    });

    it('should call next if role is provided and in hasRole', () => {
      res.locals.role = UserManagerRoles[0];
      isAuthorized({hasRole: UserManagerRoles})(req as Request, res as Response, next);
      sinon.assert.calledOnce(next as sinon.SinonStub);
    });

    it('should return 403 if role is provided and is not in hasRole', () => {
      res.locals.role = 'a';
      isAuthorized({hasRole: UserManagerRoles})(req as Request, res as Response, next);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 403);
    });

    it('should return 403 when allowUser: true, role: admin, roleTo: invalidRole', () => {
      res.locals.uid = 'testId';
      res.locals.role = Roles.admin;
      req.params.id = 'testId';
      req.body = {role: 'invalid' + Roles.admin};

      isAuthorized({hasRole: UserManagerRoles, allowSameUser: true})(req as Request, res as Response, next);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 403);
    });

    it('should return 403 when role: invalidRole, roleTo: admin', () => {
      res.locals.role = 'invalid' + Roles.admin;
      req.body = {role: Roles.admin};

      isAuthorized({hasRole: UserManagerRoles})(req as Request, res as Response, next);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 403);
    });

    it('should call next when allowUser: true, role: admin, roleTo: admin', () => {
      res.locals.uid = 'testId';
      res.locals.role = Roles.admin;
      req.params.id = 'testId';
      req.body = {role: Roles.admin};

      isAuthorized({hasRole: UserManagerRoles, allowSameUser: true})(req as Request, res as Response, next);
      sinon.assert.calledOnce(next as sinon.SinonStub);
    });

    it('should call next when role: admin, roleTo: manager', () => {
      res.locals.role = Roles.admin;
      req.body = {role: Roles.manager};

      isAuthorized({hasRole: UserManagerRoles})(req as Request, res as Response, next);
      sinon.assert.calledOnce(next as sinon.SinonStub);
    });

    it('should return 403 when allowUser: true, role: manager, roleTo: admin', () => {
      res.locals.uid = 'randomId';
      res.locals.role = Roles.manager;
      req.params.id = 'randomId';
      req.body = {role: Roles.admin};

      isAuthorized({hasRole: UserManagerRoles, allowSameUser: true})(req as Request, res as Response, next);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 403);
    });

    it('should return 403 when role: user, roleTo: admin', () => {
      res.locals.role = Roles.user;
      req.body = {role: Roles.admin};

      isAuthorized({hasRole: UserManagerRoles})(req as Request, res as Response, next);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 403);
    });
  });

});

