import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as crypto from 'crypto';

admin.initializeApp();
const db = admin.firestore();

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} n - Length of the random string.
 */
const genRandomString = (n: number) => {
  return crypto.randomBytes(Math.ceil(n / 2)).toString('hex');
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
const sha512WithSalt = (password: String, salt: String) => {
  const hash = crypto.createHmac('sha512', salt as string); /** Hashing algorithm sha512 */
  hash.update(password as string);
  return hash.digest('hex');
};

const saltHashPassword = (password: String) => {
  const salt = genRandomString(16); /** Gives us salt of length 16 */
  return ({
    salt,
    hashedPassword: sha512WithSalt(password, salt)
  });
};

interface LoginBody {
  email: string;
  password: string;
}

interface User {
  email: String;
  salt: String;
  hashedPassword: String;
  dateCreated: Date;
  steps: number;
  points: number;
}

export const login = functions.https.onRequest(async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body.data as LoginBody;
  console.log(email, password);
  const userDoc = await db.collection('users').doc(email).get();
  if (userDoc.exists) {
    const { salt, hashedPassword } = userDoc.data() as User;
    if (sha512WithSalt(password, salt) === hashedPassword) {
      res.status(200).send({data: userDoc.data()});
      return;
    }
  }
  res.status(401).send({
    data: {error: 'Invalid email or password'}
  });
});

export const createAccount = functions.https.onRequest(async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body.data as LoginBody;
  console.log(email, password);
  const existingUser = await db.collection('users').doc(email).get();
  if (existingUser.exists) {
    res.status(409).send({
      data: {error: `An account already exists`}
    });
    return;
  }
  const newUser = {
    ...saltHashPassword(password),
    email,
    dateCreated: new Date(),
    steps: 0,
    points: 0,
  };
  await db.collection('users').doc(email).set(newUser);
  res.status(200).send({data: newUser});
});

interface RedeemRequest {
  email: string;
  id: string;
}

export const redeemReward = functions.https.onRequest(async (req, res) => {
  console.log(req.body);
  const { email, id } = req.body.data as RedeemRequest;
  console.log(email, id);
  const userDoc = db.collection('users').doc(email);
  const rewardDoc = db.collection('rewards').doc(id);
  const userData = (await userDoc.get()).data();
  const rewardData = (await rewardDoc.get()).data();
  if (userData && rewardData) {
    const points = userData.points as number;
    const availability = rewardData.availability as number;
    if (availability > 0 && points >= (rewardData.points as number)) {
      await userDoc.update({points: points - rewardData.points});
      await rewardDoc.update({availability: availability - 1});
      res.status(200).send({data: {}});
      return;
    }
    if (availability === 0) {
      res.status(200).status(401).send({
        data: {error: 'Item out of stock'}
      });
      return;
    }
    res.status(200).send({
      data: {error: 'Not enough points'}
    });
  }
  res.status(200).send({
    data: {error: 'User or reward does not exist'}
  });
});
