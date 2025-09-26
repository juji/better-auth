'use client'
import { RegisterForm } from "@/components/register";
import { LoginForm } from "@/components/login";
import { ForgotPassword } from "@/components/forgot-password";
import { useEffect, useState } from "react";
import { Authenticated } from "@/components/authenticated";
import { useSearchParams } from "next/navigation";
import { Suspense } from 'react'

import { 
  useSession, 
  signIn, signOut, signUp, 
  requestPasswordReset,
  changePassword
} from "@/lib/auth-client-express" // import the auth client

import type { OnSignInParams } from "@/components/login";
import type { onRegisterParams } from "@/components/register";
import type { ForgotPasswordSubmitParams } from "@/components/forgot-password";
import type { OnChangePasswordParams } from "@/components/authenticated";

export function ExpressForm() {

  const [ authState, setAuthState ] = useState<'register'|'login'|'forgot-password'|'authenticated'|null>(null);

  const searchParams = useSearchParams();
  const state = searchParams.get('state');

  const { 
    data: session, 
    isPending, //loading state
    error, //error object
    refetch //refetch the session
  } = useSession();

  useEffect(() => {

    // console.log('state', state);
    // console.log('session', session);
    // console.log('isPending', isPending);
    // console.log('error', error);

    if(isPending) return; // still loading

    if(error){
      setAuthState('login'); // on error, show login form
      return;
    }

    // If the user is already logged in
    if (session?.user?.id) {
      setAuthState('authenticated')
    }else if(state === 'express-register' || state === 'express-login' || state === 'express-forgot-password'){
      setAuthState(state.replace('express-', '') as 'register'|'login'|'forgot-password');
    }else{
      setAuthState('login')
    }

  }, [session, state, isPending, error ]);

  async function onSignOut() {
    await signOut();
    refetch();
  }

  async function onSignIn({ email, password, rememberMe, fetchOptions }: OnSignInParams) {
    await signIn.email({
      email, // user email address
      password, // user password
      rememberMe, // whether to remember the session
    }, {
      onSuccess: () => {
        fetchOptions?.onSuccess?.();
      },
      onError: (err) => {
        fetchOptions?.onError?.(err.error.message || err.error.statusText || 'An error occurred');
      }
    });
    refetch();
  }

  async function onRegister({
    email, password, name, fetchOptions
  }: onRegisterParams ) {
    await signUp.email({
      email, // user email address
      password, // user password -> min 8 characters by default
      name, // user display name
    }, {
      onSuccess: () => {
        fetchOptions?.onSuccess?.();
      },
      onError: (err) => {
        fetchOptions?.onError?.(err.error.message || err.error.statusText || 'An error occurred');
      }
    });
    refetch();
  }

  async function onForgotPassword(
    {
      email,
      onSuccess,
      onError
    }: ForgotPasswordSubmitParams
  ) {

    await requestPasswordReset({
      email, // user email address
      redirectTo: window.location.origin + '/reset-password-express'
    }, {
      onSuccess: () => {
        // You can show a success message or redirect the user
        onSuccess?.();
      },
      omError: () => {
        onError?.('An error occurred');
      }
    });
  }

  async function onChangePassword(params: OnChangePasswordParams) {
    await changePassword({
      currentPassword: params.oldPassword,
      newPassword: params.newPassword
    }, {
      onSuccess: () => {
        params.fetchOptions?.onSuccess?.();
      },
      onError: (err) => {
        params.fetchOptions?.onError?.(err.error.message || err.error.statusText || 'An error occurred');
      }
    });
    refetch();
  }
  
  return (
      <div className="my-4 w-1/2">
      { authState === 'authenticated' && session ? (
        <Authenticated 
          hello={'Hello from Express.js'}
          session={session} 
          onSignOut={onSignOut}
          onChangePassword={onChangePassword}
        />
      ) : null }
      {authState === 'register' ? (
        <RegisterForm 
          className={`w-full`}
          title="Sign Up (Express.js)"
          onLoginClicked={() => setAuthState('login')}
          onRegister={onRegister}
        />
      ) : null}     
      {authState === 'login' ? (
        <LoginForm
          className={`w-full`}
          title="Sign In (Express.js)"
          onRegisterClicked={() => setAuthState('register')}
          onForgotPasswordClicked={() => setAuthState('forgot-password')}
          onSignIn={onSignIn}
        />
      ) : null}
      {authState === 'forgot-password' ? (
        <ForgotPassword
          className={`w-full`}
          onLoginClicked={() => setAuthState('login')}
          title="Reset Password (Express.js)"
          onSubmit={onForgotPassword}
        />
      ) : null}
      </div>
  );
}


export function ExpressFormWithSuspense() {
  return <Suspense fallback={<div>Loading...</div>}>
    <ExpressForm />
  </Suspense>
}