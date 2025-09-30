'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { organization } from '@/lib/auth-client-hono';
import AddUserToOrganization from './add-user-to-organization';
import OrganizationUserCard from './organization-user-card';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  createdAt: Date | string;
  members: any[];
}

export default function OrganizationUsersPage() {
  const params = useParams();
  const id = params.id as string;

  const [organizationData, setOrganizationData] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrganization = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);
      try {
        const { data, error } = await organization.getFullOrganization({
          query: {
            organizationId: id,
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
  }, [id]);

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
              href={`/protected/organization/${id}`}
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
            href={`/protected/organization/${organizationData.id}`}
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

        {/* Add User Component */}
        <AddUserToOrganization
          organizationId={organizationData.id}
          existingMemberIds={organizationData.members.map(member => member.userId)}
          onUserAdded={() => {
            // Reload the organization data to show the new member
            const loadOrganization = async () => {
              try {
                const { data, error } = await organization.getFullOrganization({
                  query: {
                    organizationId: organizationData.id,
                  },
                });
                if (!error && data) {
                  setOrganizationData(data);
                }
              } catch (err) {
                console.error('Failed to reload organization:', err);
              }
            };
            loadOrganization();
          }}
        />

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
                <OrganizationUserCard key={user.id} user={user} />
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