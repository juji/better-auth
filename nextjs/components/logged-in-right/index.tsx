import { useSession } from '@/lib/auth-client-hono';

export function LoggedInRight() {
  const { data: session } = useSession();

  return (
    <div className="w-full">
      <div className="backdrop-blur-lg bg-black/20 border border-white/10 rounded-2xl p-8 shadow-2xl h-full">
        
      </div>
    </div>
  );
}