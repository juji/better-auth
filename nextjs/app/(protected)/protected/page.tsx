

export default function ProtectedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <h1 className="text-3xl font-bold mb-4">Protected Page</h1>
      <p className="text-lg mb-4">You have successfully accessed a protected page!</p>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Welcome to the protected area!
        </p>
      </div>
    </div>
  );
}