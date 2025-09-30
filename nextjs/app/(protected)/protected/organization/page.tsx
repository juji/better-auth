'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { organization } from '@/lib/auth-client-hono';
import { ModalDialog } from '@/components/modal-dialog';
interface Organization {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  createdAt: Date | string;
}

export default function OrganizationPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingOrgId, setDeletingOrgId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });

  const generateSlug = async (name: string): Promise<string> => {
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // random string here
    let randString = Math.random().toString(36).substring(2, 15);
    let slug = baseSlug;
    let trying = true;
    let retryMax = 10

    while (trying) {
      try{
        slug = `${baseSlug}-${randString}`;
        await organization.checkSlug({ slug });
        trying = false;
      }catch(e){
        retryMax--;
        randString = Math.random().toString(36).substring(2, 15);
        if(retryMax <= 0){
          slug = ''
          trying = false;
        }
      }
    }

    if(!slug) throw new Error('Failed to generate unique slug');
    return slug;
  };

  const loadOrganizations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await organization.list();
      if (error) {
        setError(error.message || 'Failed to load organizations');
      } else {
        setOrganizations(data || []);
      }
    } catch (err) {
      setError('Failed to load organizations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrganizations();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateError(null);
    try {
      const randomString = Math.random().toString(36).substring(2, 15);
      const logoUrl = `https://avatar.vercel.sh/${randomString}`;
      const slug = await generateSlug(formData.name);

      const { data, error } = await organization.create({
        name: formData.name,
        slug: slug,
        logo: logoUrl,
      });

      if (error) {
        setCreateError(error.message || 'Failed to create organization');
      } else {
        setOrganizations(prev => [...prev, data]);
        setIsCreateModalOpen(false);
        setFormData({ name: '', slug: '' });
        setCreateError(null);
      }
    } catch (err) {
      console.error(err)
      setCreateError('Failed to create organization');
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOrg) return;

    setIsUpdating(true);
    setUpdateError(null);
    try {
      const slug = await generateSlug(formData.name);

      const { data, error } = await organization.update({
        organizationId: editingOrg.id,
        data: {
          name: formData.name,
          slug: slug,
        },
      });

      if (error) {
        setUpdateError(error.message || 'Failed to update organization');
      } else {
        setOrganizations(prev =>
          prev.map(org => org.id === editingOrg.id ? data : org)
        );
        setIsEditModalOpen(false);
        setEditingOrg(null);
        setFormData({ name: '', slug: '' });
        setUpdateError(null);
      }
    } catch (err) {
      setUpdateError('Failed to update organization');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (orgId: string) => {
    setDeletingOrgId(orgId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingOrgId) return;

    try {
      const { error } = await organization.delete({
        organizationId: deletingOrgId,
      });

      if (error) {
        setError(error.message || 'Failed to delete organization');
      } else {
        setOrganizations(prev => prev.filter(org => org.id !== deletingOrgId));
      }
    } catch (err) {
      setError('Failed to delete organization');
    } finally {
      setIsDeleteDialogOpen(false);
      setDeletingOrgId(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setDeletingOrgId(null);
  };

  const openEditModal = (org: Organization) => {
    setEditingOrg(org);
    setFormData({
      name: org.name,
      slug: org.slug || '',
    });
    setIsEditModalOpen(true);
  };

  const closeModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setEditingOrg(null);
    setFormData({ name: '', slug: '' });
    setCreateError(null);
    setUpdateError(null);
  };

  return (
    <div className="text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Organizations</h1>
          <p className="text-sm text-gray-400 mb-2">
            This is a learning exercise about organization management and multi-tenant architecture.
          </p>
          <p className="text-gray-300 mb-4">
            Manage your organizations. Create, update, and delete organizations as needed.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            Your Organizations ({organizations.length})
          </h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded transition-all duration-200 cursor-pointer shadow-lg hover:shadow-green-500/25 transform hover:scale-105 active:scale-95 w-full sm:w-auto"
          >
            <span className="sm:hidden">+ Create</span>
            <span className="hidden sm:inline">+ Create Organization</span>
          </button>
        </div>

        <div>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-slate-500 border-t-transparent rounded-full"></div>
              <span className="ml-3 text-gray-300">Loading organizations...</span>
            </div>
          ) : organizations.length > 0 ? (
            <div className="space-y-4">
              {organizations.map((org) => (
                <div
                  key={org.id}
                  className="p-6 bg-black/30 border border-white/10 rounded-lg hover:bg-black/40 transition-colors"
                >
                  <div className="mb-4">
                    <Link
                      href={`/protected/organization/${org.slug}`}
                      className="flex items-center space-x-3 group"
                    >
                      {org.logo ? (
                        <img
                          src={org.logo}
                          alt={org.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                          {org.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-white group-hover:underline transition-all duration-200">
                          {org.name}
                        </h3>
                        {org.slug && (
                          <p className="text-sm text-gray-400">@{org.slug}</p>
                        )}
                      </div>
                    </Link>
                  </div>

                  <div className="text-sm text-gray-400 mb-4">
                    <div>Created: {new Date(org.createdAt).toLocaleDateString()}</div>
                    <div>ID: {org.id.slice(0, 8)}...</div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => openEditModal(org)}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white text-sm rounded transition-all duration-200 cursor-pointer shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 active:scale-95"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(org.id)}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-sm rounded transition-all duration-200 cursor-pointer shadow-lg hover:shadow-red-500/25 transform hover:scale-105 active:scale-95"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">No organizations</h3>
              <p className="text-gray-400 mb-4">You haven't created any organizations yet.</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded transition-all duration-200 cursor-pointer shadow-lg hover:shadow-green-500/25 transform hover:scale-105 active:scale-95 w-full sm:w-auto"
              >
                Create Your First Organization
              </button>
            </div>
          )}
        </div>

        {/* Create Organization Modal */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-white mb-4">Create Organization</h3>
              {createError && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200 text-sm">
                  {createError}
                </div>
              )}
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="Organization name"
                    required
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreating}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white rounded transition-all duration-200 cursor-pointer shadow-lg hover:shadow-green-500/25 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                  >
                    {isCreating ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Creating...
                      </>
                    ) : (
                      'Create'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Organization Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-900 border border-white/10 rounded-xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-white mb-4">Edit Organization</h3>
              {updateError && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-lg text-red-200 text-sm">
                  {updateError}
                </div>
              )}
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="Organization name"
                    required
                  />
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={closeModals}
                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded transition-all duration-200 cursor-pointer shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                  >
                    {isUpdating ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        Updating...
                      </>
                    ) : (
                      'Update'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ModalDialog
          isOpen={isDeleteDialogOpen}
          title="Delete Organization"
          onCancel={cancelDelete}
          onConfirm={confirmDelete}
          confirmText="Delete"
        >
          <p className="text-gray-300">Are you sure you want to delete this organization? This action cannot be undone.</p>
        </ModalDialog>
      </div>
    </div>
  );
}