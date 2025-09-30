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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      </div>
    </div>
  );
}