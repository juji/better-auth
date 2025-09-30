import React from 'react';

interface User {
  id: string;
  organizationId: string;
  role: "member" | "admin" | "owner";
  createdAt: Date;
  userId: string;
  user: {
    email: string;
    name: string;
    image?: string;
  };
}

interface OrganizationUserCardProps {
  user: User;
}

export default function OrganizationUserCard({ user }: OrganizationUserCardProps) {
  return (
    <div className="p-6 hover:bg-white/5 transition-colors">
      <div className="flex items-center space-x-4">
        {user.user.image ? (
          <img
            src={user.user.image}
            alt={user.user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {user.user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-medium text-white">{user.user.name}</h3>
          <p className="text-gray-400">{user.user.email}</p>
        </div>
        <div className="text-right">
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
            user.role === 'admin'
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : user.role === 'owner'
              ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
          }`}>
            {user.role}
          </span>
          <p className="text-xs text-gray-500 mt-1">
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}