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
} from "@/lib/auth-client-hono" // import the auth client

import type { OnSignInParams } from "@/components/login";
import type { onRegisterParams } from "@/components/register";
import type { ForgotPasswordSubmitParams } from "@/components/forgot-password";
import type { OnChangePasswordParams } from "@/components/authenticated";

export function HonoForm() {

  const [ authState, setAuthState ] = useState<'register'|'login'|'forgot-password'|'authenticated'|null>(null);
  const [ errorState, setError ] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const state = searchParams.get('state');
  const honoError = searchParams.get('honoerror');

  useEffect(() => {
    if(honoError) {
      setError(honoError);
    }
  }, [honoError]);

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
    }else if(state === 'hono-register' || state === 'hono-login' || state === 'hono-forgot-password'){
      setAuthState(state.replace('hono-', '') as 'register'|'login'|'forgot-password');
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
      redirectTo: window.location.origin + '/reset-password-hono'
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

  async function handleSignInSocial(provider: string) {
    await signIn.social({
      provider: provider,
    })
    refetch();
  }

  return (
      <div className="my-4 w-1/2">
      { authState === 'authenticated' && session ? (
        <Authenticated 
          hello={'Hello from Hono'}
          session={session} 
          onSignOut={onSignOut}
          onChangePassword={onChangePassword}
          protectedResourceUrl={process.env.NEXT_PUBLIC_HONO_SERVER + "/protected"}
        />
      ) : null }
      {authState === 'register' ? (
        <RegisterForm 
          className={`w-full`}
          title="Sign Up (Hono)"
          onLoginClicked={() => setAuthState('login')}
          onRegister={onRegister}
          oauthProviders={['github', 'google']}
          onSignInSocial={handleSignInSocial}
        />
      ) : null}     
      {authState === 'login' ? (
        <LoginForm
          className={`w-full`}
          title="Sign In (Hono)"
          onRegisterClicked={() => setAuthState('register')}
          onForgotPasswordClicked={() => setAuthState('forgot-password')}
          onSignIn={onSignIn}
          oauthProviders={['github', 'google']}
          onSignInSocial={handleSignInSocial}
          authError={errorState}
        />
      ) : null}
      {authState === 'forgot-password' ? (
        <ForgotPassword
          className={`w-full`}
          onLoginClicked={() => setAuthState('login')}
          title="Reset Password (Hono)"
          onSubmit={onForgotPassword}
        />
      ) : null}
      </div>
  );
}


export function HonoFormWithSuspense() {
  return <Suspense fallback={<div>Loading...</div>}>
    <HonoForm />
  </Suspense>
}