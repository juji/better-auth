'use client'
import { RegisterForm } from "@/components/register";
import { LoginForm } from "@/components/login";
import { ForgotPassword } from "@/components/forgot-password";
import { useEffect, useState } from "react";
import { Authenticated } from "@/components/authenticated";
import { useSearchParams } from "next/navigation";

import { 
  useSession, 
  signIn, signOut, signUp, 
  requestPasswordReset,
  changePassword
} from "@/lib/auth-client" // import the auth client

import type { OnSignInParams } from "@/components/login";
import type { onRegisterParams } from "@/components/register";
import type { ForgotPasswordSubmitParams } from "@/components/forgot-password";
import type { OnChangePasswordParams } from "@/components/authenticated";

export function NextjsForm() {

  const [ authState, setAuthState ] = useState<'register'|'login'|'forgot-password'|'authenticated'|null>(null);

  const searchParams = useSearchParams();
  const state = searchParams.get('state');

  const { 
    data: session, 
    refetch //refetch the session
  } = useSession();

  useEffect(() => {

    console.log('state', state);
    // If the user is already logged in
    if (session) {
      setAuthState('authenticated')
    }else if(state === 'nextjs-register' || state === 'nextjs-login' || state === 'nextjs-forgot-password'){
      setAuthState(state.replace('nextjs-', '') as 'register'|'login'|'forgot-password');
    }else{
      setAuthState('login')
    }
  }, [session, state ]);

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
      redirectTo: window.location.origin + '/reset-password'
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
          hello={'Hello from NextJs'}
          session={session} 
          onSignOut={onSignOut}
          onChangePassword={onChangePassword}
        />
      ) : null }
      {authState === 'register' ? (
        <RegisterForm 
          className={`w-full`}
          title="Sign Up (NextJs)"
          onLoginClicked={() => setAuthState('login')}
          onRegister={onRegister}
        />
      ) : null}     
      {authState === 'login' ? (
        <LoginForm
          className={`w-full`}
          title="Sign In (NextJs)"
          onRegisterClicked={() => setAuthState('register')}
          onForgotPasswordClicked={() => setAuthState('forgot-password')}
          onSignIn={onSignIn}
        />
      ) : null}
      {authState === 'forgot-password' ? (
        <ForgotPassword
          className={`w-full`}
          onLoginClicked={() => setAuthState('login')}
          title="Reset Password (NextJs)"
          onSubmit={onForgotPassword}
        />
      ) : null}
      </div>
  );
}
