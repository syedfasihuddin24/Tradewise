import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";

const googleProvider = new GoogleAuthProvider();

export const registerUser = async (name, email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
  if (name) {
    await updateProfile(userCredential.user, { displayName: name });
  }

  return userCredential;
};

export const loginUser = async (email, password) => {
  if (email === 'demo@tradewise.io' && password === 'password123') {
    // Simulate a successful login for the demo account
    return new Promise((resolve) => 
      setTimeout(() => resolve({ user: { email, displayName: 'Syed Fasih (Demo)', uid: 'demo' } }), 800)
    );
  }
  return await signInWithEmailAndPassword(auth, email, password);
};

export const logoutUser = async () => {
  return await signOut(auth);
};

export const loginWithGoogle = async () => {
  return await signInWithPopup(auth, googleProvider);
};

export const updateUserPassword = async (user, currentPassword, newPassword) => {
  if (user.email === 'demo@tradewise.io') {
    throw new Error('Changing passwords is not permitted on the demo account.');
  }

  const credential = EmailAuthProvider.credential(user.email, currentPassword);
  await reauthenticateWithCredential(user, credential);
  return await updatePassword(user, newPassword);
};