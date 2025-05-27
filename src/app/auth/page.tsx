'use client';

import { auth } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup
} from 'firebase/auth';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const router = useRouter();

  const loginWithGoogle = async () => {
    if (isPopupOpen) return;
    setIsPopupOpen(true);

    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      console.log("Google user:", result.user);
      router.push('/');
    } catch (err) {
      const error = err as { code?: string; message?: string };
      if (error.code === 'auth/popup-closed-by-user') {
      } else {
        console.error("Google login error:", err);
      }
    } finally {
      setIsPopupOpen(false);
    }
  };

  const loginWithGithub = async () => {
    if (isPopupOpen) return;
    setIsPopupOpen(true);

    try {
      const result = await signInWithPopup(auth, new GithubAuthProvider());
      console.log("GitHub user:", result.user);
      router.push('/');
    } catch (err) {
      const error = err as { code?: string; message?: string };
      if (error.code === 'auth/popup-closed-by-user') {
        console.warn("Popup closed by user.");
      } else {
        console.error("GitHub login error:", err);
      }
    } finally {
      setIsPopupOpen(false);
    }
  };


  const loginWithEmail = async () => {
    try {
      if (!email || !password) {
        alert("Please enter both email and password.");
        return;
      }

      const result = await signInWithEmailAndPassword(auth, email, password);
      console.log("Email user:", result.user);
      router.push('/');
    } catch (err) {
      const error = err as { code?: string; message?: string };

      switch (error.code) {
        case 'auth/wrong-password':
          alert("Incorrect password.");
          break;
        case 'auth/invalid-email':
          alert("Invalid email format.");
          break;
        case 'auth/invalid-credential':
          alert("Invalid credentials. Please check your email and password.");
          break;
        default:
          console.error("Email login error:", error);
          alert("Login failed. Please try again.");
      }
    }
  };

  const registerWithEmail = async () => {
    try {
      if (!email || !password) {
        alert("Please enter both email and password.");
        return;
      }

      const result = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Registered user:", result.user);
      router.push('/');
    } catch (err) {
      const error = err as { code?: string; message?: string };

      switch (error.code) {
        case 'auth/email-already-in-use':
          alert("This email is already in use. Try logging in instead.");
          break;
        case 'auth/invalid-email':
          alert("Invalid email format.");
          break;
        case 'auth/weak-password':
          alert("Password should be at least 6 characters.");
          break;
        default:
          console.error("Registration error:", error);
          alert("Registration failed. Please try again.");
      }
    }
  };

  const resetPassword = async () => {
    if (!email) {
      alert("Please enter your email to reset your password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent.");
    } catch (err) {
      console.error("Reset password error:", err);
      alert("Failed to send password reset email.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10 space-y-6 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-center text-gray-800">Sign In</h2>

      <div className="flex flex-col space-y-3">
        <input
          type="email"
          placeholder="Email"
          className="px-4 py-2 border rounded text-black placeholder-gray-500 focus:outline-none focus:ring focus:border-blue-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="px-4 py-2 border rounded text-black placeholder-gray-500 focus:outline-none focus:ring focus:border-blue-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={loginWithEmail}
          className="w-full py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer"
        >
          Login with Email
        </button>
        <button
          onClick={registerWithEmail}
          className="w-full py-2 px-4 bg-gray-300 text-black rounded hover:bg-gray-400 transition cursor-pointer"
        >
          Register
        </button>
        <button
          onClick={resetPassword}
          className="w-full py-2 px-4 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition cursor-pointer"
        >
          Reset Password
        </button>
      </div>

      <div className="flex items-center my-4">
        <hr className="flex-grow border-gray-300" />
        <span className="mx-4 text-gray-500">or</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      <div className="flex flex-col space-y-3">
        <button
          onClick={loginWithGoogle}
          disabled={isPopupOpen}
          className="flex items-center justify-center w-full py-2 px-4 bg-white text-gray-800 border border-gray-300 rounded hover:shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Image src="/google.svg" alt="Google" width={20} height={20} className="mr-2" />
          Sign in with Google
        </button>

        <button
          onClick={loginWithGithub}
          disabled={isPopupOpen}
          className="flex items-center justify-center w-full py-2 px-4 bg-gray-800 text-white rounded hover:bg-gray-900 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <Image src="/github.svg" alt="GitHub" width={20} height={20} className="mr-2 invert" />
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}