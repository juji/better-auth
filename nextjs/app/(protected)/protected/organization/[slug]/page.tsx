'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { organization } from '@/lib/auth-client-hono';

interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  createdAt: Date | string;
}

export default function OrganizationDetailPage() {
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
        // For now, we'll get all organizations and find the one with matching slug
        // In a real app, you'd want an API endpoint to get organization by slug
        const { data, error } = await organization.list();
        if (error) {
          setError(error.message || 'Failed to load organization');
        } else {
          const org = data?.find((org: Organization) => org.slug === slug);
          if (org) {
            setOrganizationData(org);
          } else {
            setError('Organization not found');
          }
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
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-slate-500 border-t-transparent rounded-full"></div>
            <span className="ml-3 text-gray-300">Loading organization...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !organizationData) {
    return (
      <div className="text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <Link
              href="/protected/organization"
              className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center"
            >
              ← Back to Organizations
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
              The organization you're looking for doesn't exist or you don't have access to it.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="text-white p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <div className="mb-8">
          <Link
            href="/protected/organization"
            className="text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center"
          >
            ← Back to Organizations
          </Link>
        </div>

        {/* Organization Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            {organizationData.logo ? (
              <img
                src={organizationData.logo}
                alt={organizationData.name}
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {organizationData.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{organizationData.name}</h1>
              <p className="text-gray-400">@{organizationData.slug}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-black/30 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Organization Details</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">ID:</span>
                  <span className="text-gray-300 font-mono">{organizationData.id.slice(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Created:</span>
                  <span className="text-gray-300">
                    {new Date(organizationData.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Slug:</span>
                  <span className="text-gray-300">@{organizationData.slug}</span>
                </div>
              </div>
            </div>

            <div className="bg-black/30 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Members</h3>
              <div className="text-center py-4">
                <div className="text-2xl font-bold text-blue-400 mb-1">0</div>
                <p className="text-sm text-gray-400">Total members</p>
              </div>
              <Link
                href={`/protected/organization/${organizationData.slug}/users`}
                className="w-full px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm rounded transition-all duration-200 cursor-pointer shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 active:scale-95 text-center block"
              >
                Manage Users
              </Link>
            </div>

            <div className="bg-black/30 border border-white/10 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-2">Teams</h3>
              <div className="text-center py-4">
                <div className="text-2xl font-bold text-green-400 mb-1">0</div>
                <p className="text-sm text-gray-400">Total teams</p>
              </div>
              <Link
                href={`/protected/organization/${organizationData.slug}/teams`}
                className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white text-sm rounded transition-all duration-200 cursor-pointer shadow-lg hover:shadow-green-500/25 transform hover:scale-105 active:scale-95 text-center block"
              >
                Manage Teams
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-black/20 border border-white/10 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href={`/protected/organization/${organizationData.slug}/users`}
              className="p-4 bg-black/30 border border-white/10 rounded-lg hover:bg-black/40 transition-colors group"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                  </svg>
                </div>
                <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors">Users</h4>
              </div>
              <p className="text-sm text-gray-400">Manage organization members and roles</p>
            </Link>

            <Link
              href={`/protected/organization/${organizationData.slug}/teams`}
              className="p-4 bg-black/30 border border-white/10 rounded-lg hover:bg-black/40 transition-colors group"
            >
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h4 className="font-medium text-white group-hover:text-green-400 transition-colors">Teams</h4>
              </div>
              <p className="text-sm text-gray-400">Create and manage teams</p>
            </Link>

            <div className="p-4 bg-black/30 border border-white/10 rounded-lg">
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h4 className="font-medium text-white">Settings</h4>
              </div>
              <p className="text-sm text-gray-400">Configure organization settings</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}