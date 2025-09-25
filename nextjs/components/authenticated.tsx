'use client'


export function Authenticated({
  session,
  onSignOut,
  hello = 'Hello'
}: {
  session: { user: { name?: string; email: string } },
  onSignOut: () => void
  hello?: string
}) {
  return (
    <div className="p-4 border rounded">
      <h2 className="text-2xl font-bold mb-4">{hello}!</h2>
      <p className="mb-4">Welcome, {session.user.name || session.user.email}!</p>
      <p className="mb-4">You are logged in with the email: {session.user.email}</p>
      <button
        onClick={() => {
          onSignOut()
        }}
        className="py-2 px-4 bg-red-600 hover:bg-red-700 text-white font-medium 
          rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Logout
      </button>
    </div>
  );
}