'use client';
import { ResetPassword, type ResetPasswordSubmitParams } from '@/components/reset-password';
import { resetPassword } from '@/lib/auth-client';

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
    <ResetPassword 
      onSubmit={handleSubmit} 
      title="Reset Your Password (NextJs)"
      className="max-w-md mx-auto mt-10"
      loginUrl="/?state=nextjs-login"
      forgotPasswordUrl="/?state=nextjs-forgot-password"  
    />
  </div>;

}