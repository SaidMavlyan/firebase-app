import * as firebase from '@firebase/testing';
import * as fs from 'fs';
import { suite, test } from 'mocha-typescript';

const projectId = `calman-777-${new Date().getTime()}`;
const coverageUrl = `http://localhost:8080/emulator/v1/projects/${projectId}:ruleCoverage.html`;

const rules = fs.readFileSync('firestore.rules', 'utf8');

function appAdmin() {
  return firebase
    .initializeAdminApp({
      projectId
    })
    .firestore();
}

function authedDB(auth) {
  return firebase
    .initializeTestApp({
      projectId,
      auth
    })
    .firestore();
}

function authedAsAdmin(): { db: firebase.firestore.Firestore, uid: string } {
  const uid = 'alice';
  return {
    db: authedDB({uid, role: 'admin'}),
    uid
  };
}

function authedAsManager(): { db: firebase.firestore.Firestore, uid: string } {
  const uid = 'alice';
  return {
    db: authedDB({uid, role: 'manager'}),
    uid
  };
}

before(async () => {
  await firebase.loadFirestoreRules({projectId, rules});
});

beforeEach(async () => {
  await firebase.clearFirestoreData({projectId});
});

after(async () => {
  await Promise.all(firebase.apps().map(app => app.delete()));
  console.log(`View rule coverage information at ${coverageUrl}\n`);
});

const assertSucceeds = firebase.assertSucceeds;
const assertFails = firebase.assertFails;
const collections = {
  users: 'users',
  meals: 'meals'
};

@suite.only
class UserTestsAsAdmin {

  @test
  async 'should let admin to create user'() {
    const {db, uid: admin} = authedAsAdmin();
    await assertSucceeds(db.doc(`${collections.users}/${admin}`).set({
      uid: 'bob',
      role: 'manager'
    }));
  }

  @test
  async 'should let admin to read users'() {
    const {db} = authedAsAdmin();
    await assertSucceeds(db.collection(`${collections.users}`).get());
  }

  @test
  async 'should let admin to read individual user'() {
    const {db} = authedAsAdmin();
    await assertSucceeds(db.doc(`${collections.users}/bob`).set({
      uid: 'bob',
      role: 'manager'
    }));
    await assertSucceeds(db.doc(`${collections.users}/bob`).get());
  }

  @test
  async 'should let admin to update user'() {
    const {db} = authedAsAdmin();
    await assertSucceeds(db.doc(`${collections.users}/bob`).set({
      uid: 'bob',
      role: 'manager'
    }));
    await assertSucceeds(db.doc(`${collections.users}/bob`).update({
      uid: 'bob',
      role: 'user'
    }));
  }

  @test
  async 'should let admin to delete user'() {
    const {db} = authedAsAdmin();
    await assertSucceeds(db.doc(`${collections.users}/bob`).set({
      uid: 'bob',
      role: 'manager'
    }));
    await assertSucceeds(db.doc(`${collections.users}/bob`).delete());
  }
}

@suite.only
class UserTestsAsManager {

  @test
  async 'should let manager to create user'() {
    const {db} = authedAsManager();
    await assertSucceeds(db.doc(`${collections.users}/bob`).set({
      uid: 'bob',
      role: 'manager'
    }));
  }

  @test
  async 'should let manager to read users'() {
    const db = authedDB({uid: 'alice', role: 'manager'});
    await assertSucceeds(db.collection(`${collections.users}`).get());
  }

  @test
  async 'should let manager to read individual user'() {
    const db = authedDB({uid: 'alice', role: 'manager'});
    await assertSucceeds(db.doc(`${collections.users}/bob`).set({
      uid: 'bob',
      role: 'manager'
    }));
    await assertSucceeds(db.doc(`${collections.users}/bob`).get());
  }

  @test
  async 'should let manager to update user'() {
    const db = authedDB({uid: 'alice', role: 'manager'});
    await assertSucceeds(db.doc(`${collections.users}/bob`).set({
      uid: 'bob',
      role: 'manager'
    }));
    await assertSucceeds(db.doc(`${collections.users}/bob`).update({
      uid: 'bob',
      role: 'user'
    }));
  }

  @test
  async 'should let manager to delete user'() {
    const db = authedDB({uid: 'alice', role: 'manager'});
    await assertSucceeds(db.doc(`${collections.users}/bob`).set({
      uid: 'bob',
      role: 'manager'
    }));
    await assertSucceeds(db.doc(`${collections.users}/bob`).delete());
  }
}

@suite
class MealTests {

  @test
  async 'should let authorized user to create a meal'() {
    const db = authedDB({uid: 'alice', email: 'alice@example.com'});
    const meal = db.collection('meals');
    await assertSucceeds(
      meal.add({
        description: 'some nice description',
        uid: 'alice'
      })
    );
  }

  @test
  async 'should not let authorized user to create a meal for other users'() {
    const db = authedDB({uid: 'alice', email: 'alice@example.com'});
    const meal = db.collection('meals');
    await assertFails(
      meal.add({
        description: 'some nice description',
        uid: 'bob'
      })
    );
  }

  @test
  async 'should let admins create a meal'() {
    const db = authedDB({uid: 'alice', email: 'alice@example.com', role: 'manager'});
    const meal = db.collection('meals');
    await assertSucceeds(
      meal.add({
        description: 'some nice description',
        uid: 'bob'
      })
    );
  }
}
