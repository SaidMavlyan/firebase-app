import * as firebase from '@firebase/testing';
import { assertFails, assertSucceeds } from '@firebase/testing';
import * as fs from 'fs';
import { suite, test } from 'mocha-typescript';

const projectId = `calman-777-${new Date().getTime()}`;
const coverageUrl = `http://localhost:8080/emulator/v1/projects/${projectId}:ruleCoverage.html`;

const rules = fs.readFileSync('firestore.rules', 'utf8');

const collections = {
  users: 'users',
  meals: 'meals'
};

interface User {
  uid: string;
  role: string;
  randomField: string;
}

function generateUser(role = 'user', name: string = ''): User {
  return {
    uid: name + Math.random().toString(),
    randomField: Math.random().toString(),
    role
  };
}

function adminDB() {
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

function authToDB(userRole = 'user'): { db: firebase.firestore.Firestore, uid: string } {
  const {uid, role} = generateUser(userRole);
  return {
    db: authedDB({uid, role}),
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

@suite
class UserTestsAsAdmin {

  @test
  async 'Admin can:'() {
  }

  @test
  async '* not create a user'() {
    const {db} = authToDB('admin');
    const user = generateUser();

    await assertFails(db.collection(collections.users).add(user));
  }

  @test
  async '* not read users'() {
    const {db} = authToDB('admin');
    const user = generateUser();
    const docPath = `${collections.users}/${user.uid}`;

    await assertSucceeds(adminDB().doc(docPath).set(user));
    await assertFails(db.collection(`${collections.users}`).get());
  }

  @test
  async '* not read individual user'() {
    const {db} = authToDB('admin');
    const user = generateUser();
    const docPath = `${collections.users}/${user.uid}`;

    await assertSucceeds(adminDB().doc(docPath).set(user));
    await assertFails(db.doc(docPath).get());
  }

  @test
  async '* not update user'() {
    const {db} = authToDB('admin');
    const user = generateUser();
    const docPath = `${collections.users}/${user.uid}`;

    await assertSucceeds(adminDB().doc(docPath).set(user));
    await assertFails(db.doc(docPath).update({...user, randomField: Math.random().toString()}));
  }

  @test
  async '* not delete user'() {
    const {db} = authToDB('admin');
    const user = generateUser();
    const docPath = `${collections.users}/${user.uid}`;

    await assertSucceeds(adminDB().doc(docPath).set(user));
    await assertFails(db.doc(docPath).delete());
  }
}

@suite
class UserTestsAsManager {
  @test
  async 'Manager can:'() {
  }

  @test
  async '* not create a user'() {
    const {db} = authToDB('manager');
    const user = generateUser();

    await assertFails(db.collection(collections.users).add(user));
  }

  @test
  async '* not read users'() {
    const {db} = authToDB('manager');
    const user = generateUser();
    const docPath = `${collections.users}/${user.uid}`;

    await assertSucceeds(adminDB().doc(docPath).set(user));
    await assertFails(db.collection(`${collections.users}`).get());
  }

  @test
  async '* not read individual user'() {
    const {db} = authToDB('manager');
    const user = generateUser();
    const docPath = `${collections.users}/${user.uid}`;

    await assertSucceeds(adminDB().doc(docPath).set(user));
    await assertFails(db.doc(docPath).get());
  }

  @test
  async '* not update user'() {
    const {db} = authToDB('manager');
    const user = generateUser();
    const docPath = `${collections.users}/${user.uid}`;

    await assertSucceeds(adminDB().doc(docPath).set(user));
    await assertFails(db.doc(docPath).update({...user, randomField: Math.random().toString()}));
  }

  @test
  async '* not delete user'() {
    const {db} = authToDB('manager');
    const user = generateUser();
    const docPath = `${collections.users}/${user.uid}`;

    await assertSucceeds(adminDB().doc(docPath).set(user));
    await assertFails(db.doc(docPath).delete());
  }
}

@suite
class UserTestsAsUser {
  @test
  async 'User can:'() {
  }

  @test
  async '* not create a user'() {
    const {db} = authToDB();
    const user = generateUser();

    await assertFails(db.collection(collections.users).add(user));
  }

  @test
  async '* not read users'() {
    const {db} = authToDB();
    const user = generateUser();
    const docPath = `${collections.users}/${user.uid}`;

    await assertSucceeds(adminDB().doc(docPath).set(user));
    await assertFails(db.collection(`${collections.users}`).get());
  }

  @test
  async '* not read individual user'() {
    const {db} = authToDB();
    const user = generateUser();
    const docPath = `${collections.users}/${user.uid}`;

    await assertSucceeds(adminDB().doc(docPath).set(user));
    await assertFails(db.doc(docPath).get());
  }

  @test
  async '* not update user'() {
    const {db} = authToDB();
    const user = generateUser();
    const docPath = `${collections.users}/${user.uid}`;

    await assertSucceeds(adminDB().doc(docPath).set(user));
    await assertFails(db.doc(docPath).update({...user, randomField: Math.random().toString()}));
  }

  @test
  async '* not delete user'() {
    const {db} = authToDB();
    const user = generateUser();
    const docPath = `${collections.users}/${user.uid}`;

    await assertSucceeds(adminDB().doc(docPath).set(user));
    await assertFails(db.doc(docPath).delete());
  }
}

@suite.skip
class MealTests {

  @test
  async 'should let authorized user to create a meal'() {
    const {db, uid} = authToDB();
    await assertSucceeds(
      db.collection(collections.meals).add({
        description: 'some nice description',
        uid
      })
    );
  }

  @test
  async 'should not let authorized user to create a meal for other users'() {
    const {db, uid} = authToDB();
    await assertFails(
      db.collection(collections.meals).add({
        description: 'some nice description',
        uid: `other-${uid}`
      })
    );
  }

  @test
  async 'should let admins create a meal'() {
    const {db} = authToDB('admin');
    await assertSucceeds(
      db.collection(collections.meals).add({
        description: 'some nice description',
        uid: 'bob'
      })
    );
  }
}
