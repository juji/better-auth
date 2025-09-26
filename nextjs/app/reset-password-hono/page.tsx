'use client';
import { ResetPasswordWithSuspense, type ResetPasswordSubmitParams } from '@/components/reset-password';
import { resetPassword } from '@/lib/auth-client-hono';

export default function ResetPasswordPage(){
  
  async function handleSubmit(params: ResetPasswordSubmitParams) {
    
    await resetPassword({
      token: params.token,
      newPassword: params.password,
      fetchOptions: {
        onSuccess: () => {
          params.onSuccess?.();
        },
        onError: (err) => {
          params.onError?.(err.error.message || err.error.statusText || 'An error occurred');
        }
      }
    });

  }

  return <div className="flex min-h-screen flex-col items-center justify-center py-2">
    <ResetPasswordWithSuspense 
      onSubmit={handleSubmit} 
      title="Reset Your Password (Hono)"
      className="max-w-md mx-auto mt-10"
      loginUrl="/?state=hono-login"
      forgotPasswordUrl="/?state=hono-forgot-password"
    />
  </div>;

}