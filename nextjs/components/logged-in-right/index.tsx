import { useSession } from '@/lib/auth-client-hono';
import { AppDescription } from './app-description';

export function LoggedInRight() {
  const { data: session } = useSession();

  return (
    <div className="w-full">
      <div className="backdrop-blur-lg bg-black/20 border border-white/10 rounded-2xl p-8 shadow-2xl h-full">
        <AppDescription />

        {/* Decorative elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 bg-purple-500/20 rounded-full blur-sm"></div>
        <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-pink-500/20 rounded-full blur-sm"></div>
      </div>
    </div>
  );
}