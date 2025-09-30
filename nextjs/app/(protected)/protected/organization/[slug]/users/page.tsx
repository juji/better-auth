'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { organization } from '@/lib/auth-client-hono';

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

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  createdAt: Date | string;
  members: User[];
}

export default function OrganizationUsersPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [organizationData, setOrganizationData] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrganization = async () => {
      if (!slug) return;

      setIsLoading(true);
      setError(null);
      try {
        const { data, error } = await organization.getFullOrganization({
          query: {
            organizationSlug: slug,
          },
        });
        if (error) {
          setError(error.message || 'Failed to load organization');
        } else if (data) {
          setOrganizationData(data);
        } else {
          setError('Organization not found');
        }
      } catch (err) {
        setError('Failed to load organization');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrganization();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-slate-500 border-t-transparent rounded-full"></div>
            <span className="ml-3 text-gray-300">Loading users...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !organizationData) {
    return (
      <div className="text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <Link
              href={`/protected/organization/${slug}`}
              className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center"
            >
              ← Back to Organization
            </Link>
          </div>

          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.98-5.5-2.5m.5-4V5a2 2 0 114 0v1.5" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-300 mb-2">
              {error || 'Organization not found'}
            </h3>
            <p className="text-gray-400 mb-4">
              Unable to load organization users.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            href={`/protected/organization/${organizationData.slug}`}
            className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center"
          >
            ← Back to {organizationData.name}
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Users in {organizationData.name}
          </h1>
          <p className="text-gray-400">
            Manage organization members and their roles
          </p>
        </div>

        {/* Users List */}
        <div className="bg-black/30 border border-white/10 rounded-lg overflow-hidden">
          {organizationData.members.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">No users found</h3>
              <p className="text-gray-400">This organization doesn't have any members yet.</p>
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {organizationData.members.map((user) => (
                <div key={user.id} className="p-6 hover:bg-white/5 transition-colors">
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
              ))}
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="mt-6 text-center text-gray-400">
          <p>Total members: {organizationData.members.length}</p>
        </div>
      </div>
    </div>
  );
}