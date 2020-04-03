import 'mocha';
import {Request, Response} from 'express';
import * as sinon from 'sinon';
import {create, patch} from './controller';
import * as admin from 'firebase-admin';
import {expect} from 'chai';
import {Roles} from './roles';
import {signIn} from './test-utils';

describe('controller.ts', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  const email = 'testEmail@example.com';
  const displayName = 'test display name';
  const role = Roles.user;
  let password = 'test1234';

  const testReq = {
    headers: {},
    body: {
      displayName,
      email,
      password,
      role
    }
  };

  function newReq() {
    return JSON.parse(JSON.stringify(testReq));
  }

  function newRes() {
    return {
      status: sinon.stub(),
      send: sinon.stub()
    };
  }

  before(async function () {
    this.timeout(7000);

    await admin.auth().getUserByEmail(email).then(user => {
      return admin.auth().deleteUser(user.uid);
    }).catch(() => 'ignore if user is not found');
  });

  describe('create()', () => {

    beforeEach(() => {
      req = newReq();
      res = newRes();
    });

    it('should return 400 when email is missing', async () => {
      delete req.body.email;
      await create(req as Request, res as Response);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
    });

    it('should return 400 when password is missing', async () => {
      delete req.body.password;
      await create(req as Request, res as Response);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
    });

    it('should return 400 when displayName is missing', async () => {
      delete req.body.displayName;
      await create(req as Request, res as Response);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
    });

    it('should return 400 when role is missing', async () => {
      delete req.body.role;
      await create(req as Request, res as Response);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
    });

    it('should validate password', async function () {
      this.timeout(7000);
      req.body.password = 'short';

      await create(req as Request, res as Response);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 400);

      const responseMessage = (res.send as sinon.SinonStub).lastCall.args[0];
      expect(responseMessage).to.have.property('message').match(/^Password/);
    });

    it('should create user in firebase auth', async function () {
      this.timeout(5000);
      await create(req as Request, res as Response);
      const response = (res.send as sinon.SinonStub).lastCall.args[0];

      sinon.assert.calledWith(res.status as sinon.SinonStub, 201);
      expect(response).to.have.property('uid');

      await admin.auth().deleteUser(response.uid);
    });

    it('should set role to custom claims', async function () {
      this.timeout(10000);
      await create(req as Request, res as Response);

      const {idToken} = await signIn(req.body.email, req.body.password);
      const decodedToken = await admin.auth().verifyIdToken(idToken);

      expect(decodedToken).ownProperty('role').equals(req.body.role);

      await admin.auth().deleteUser(decodedToken.uid);
    });

    it('should set dailyCalories to the users entry in firestore', async function () {
      this.timeout(10000);
      req.body.dailyCalories = 500;
      await create(req as Request, res as Response);
      const {uid} = (res.send as sinon.SinonStub).lastCall.args[0];

      const doc = await admin.firestore().doc(`users/${uid}`).get();
      expect(doc.data()).ownProperty('dailyCalories').equal(500);

      await admin.auth().deleteUser(uid);
    });
  });

  describe('get()', () => {
    it('should return user object');
    it('should return auth or firestore fail to return user');
  });

  describe('patch()', () => {

    let uid;

    before(async function () {

      this.timeout(7000);

      req = newReq();
      res = newRes();
      req.body.dailyCalories = 500;

      await create(req as Request, res as Response);
      uid = (res.send as sinon.SinonStub).lastCall.args[0].uid;
    });

    beforeEach(() => {
      req = newReq();
      res = newRes();
      req.params = {id: uid};
    });

    after(async function () {
      await admin.auth().deleteUser(uid);
    });

    it('should return 400 when email is missing', async () => {
      delete req.body.email;
      await patch(req as Request, res as Response);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
    });

    it('should return 400 when displayName is missing', async () => {
      delete req.body.displayName;
      await patch(req as Request, res as Response);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
    });

    it('should return 400 when role is missing', async () => {
      delete req.body.role;
      await patch(req as Request, res as Response);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 400);
    });

    it('should update user in firebase auth', async function () {
      this.timeout(5000);
      await patch(req as Request, res as Response);

      sinon.assert.calledWith(res.status as sinon.SinonStub, 200);
    });

    it('should update password', async function () {
      this.timeout(7000);
      password = 'longer' + password;
      req.body.password = password;

      await patch(req as Request, res as Response);
      const response = await signIn(req.body.email, password);
      expect(response).ownProperty('idToken');
    });

    it('should validate password', async function () {
      this.timeout(7000);
      req.body.password = 'short';

      await patch(req as Request, res as Response);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 400);

      const responseMessage = (res.send as sinon.SinonStub).lastCall.args[0];
      expect(responseMessage).to.have.property('message').match(/^Password/);
    });

    it('should update role in custom claims', async function () {
      this.timeout(10000);
      req.body.role = Roles.admin;
      await patch(req as Request, res as Response);

      const {idToken} = await signIn(req.body.email, req.body.password);
      const decodedToken = await admin.auth().verifyIdToken(idToken);

      expect(decodedToken).ownProperty('role').equals(req.body.role);
    });

    it('should set dailyCalories to the users entry in firestore', async function () {
      this.timeout(10000);
      req.body.dailyCalories = 700;
      await patch(req as Request, res as Response);

      const doc = await admin.firestore().doc(`users/${uid}`).get();
      expect(doc.data()).ownProperty('dailyCalories').equal(req.body.dailyCalories);
    });
  });

  describe('remove()', () => {
    it('should remove user object');
    it('should return auth or firestore fail to remove the user');
  });
});
