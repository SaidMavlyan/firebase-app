import 'mocha';
import { Request, Response } from 'express';
import * as sinon from 'sinon';
import { expect } from 'chai';
import { isAuthenticated } from './authenticated';

describe('authenticated.ts', () => {

  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = {headers: {}};
    res = {
      status: sinon.stub(),
      send: sinon.stub()
    };
  });

  describe('when called with empty header', () => {

    it('should return status: 401', async () => {
      await isAuthenticated(req as Request, res as Response, null);
      sinon.assert.calledWith(res.status as sinon.SinonStub, 401);
    });

    it('should return {message: "Unauthorized..."}', async () => {
      await isAuthenticated(req as Request, res as Response, null);

      const responseMessage = (res.send as sinon.SinonStub).lastCall.args[0];
      expect(responseMessage).to.have.property('message').match(/^Unauthorized:/);
    });

  });

  describe.skip('when called with invalid token', () => {

    it('should return {message: "Unauthorized..."}', async () => {

    });

    it('should return status: 401', async () => {

    });

  });

  describe.skip('when called with valid token', () => {

    it('should call next()', async () => {

    });

    it('should return status: 400', async () => {

    });

  });

});

