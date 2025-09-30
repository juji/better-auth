'use client';

import { useState, useEffect } from 'react';
import { organization } from '@/lib/auth-client-hono';
import { fetcher } from '@/lib/fetcher';

interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt: Date | string;
}

interface AddUserToOrganizationProps {
  organizationId: string;
  existingMemberIds: string[];
  onUserAdded: () => void;
}

export default function AddUserToOrganization({
  organizationId,
  existingMemberIds,
  onUserAdded
}: AddUserToOrganizationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isAddingUser, setIsAddingUser] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Debounce search query
  useEffect(() => {
    console.log('Search query changed:', searchQuery);  
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    console.log('Performing search for:', query);

    setIsSearching(true);
    setError(null);

    try {
      // Fetch all users excluding those already in the organization
      const excludeIds = existingMemberIds.join(',');
      const response = await fetcher(
        `${process.env.NEXT_PUBLIC_HONO_SERVER || "http://localhost:3000"}/users?exclude=${excludeIds}`
      );

      // Filter results on frontend based on search query
      const filteredUsers = response.users.filter((user: User) =>
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      );

      setSearchResults(filteredUsers);
    } catch (err) {
      setError('Failed to search users');
      console.error('Search error:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAddUser = async (user: User) => {
    setIsAddingUser(user.id);
    setError(null);

    try {
      const response = await fetcher(
        `${process.env.NEXT_PUBLIC_HONO_SERVER || "http://localhost:3000"}/organizations/add-member`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            organizationId,
            userId: user.id,
            role: 'member',
          }),
        }
      );

      // Refresh the parent component
      onUserAdded();
      // Clear search results
      setSearchResults([]);
      setSearchQuery('');
    } catch (err) {
      setError('Failed to add user to organization');
      console.error('Add user error:', err);
    } finally {
      setIsAddingUser(null);
    }
  };

  const handleSearchInputChange = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className="mt-8">
      <div className="bg-black/30 border border-white/10 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Add Members</h3>

        {/* Search Input */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {isSearching && (
              <div className="absolute right-3 top-3">
                <div className="animate-spin w-5 h-5 border-2 border-slate-500 border-t-transparent rounded-full"></div>
              </div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Search Results</h4>
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-black/20 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-gray-400 text-sm">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddUser(user)}
                  disabled={isAddingUser === user.id}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-gray-600 disabled:to-gray-700 text-white text-sm rounded transition-all duration-200 cursor-pointer shadow-lg hover:shadow-green-500/25 transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isAddingUser === user.id ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                      <span>Adding...</span>
                    </div>
                  ) : (
                    'Add to Organization'
                  )}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* No Results */}
        {searchQuery && !isSearching && searchResults.length === 0 && (
          <div className="text-center py-6">
            <p className="text-gray-400">No users found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  );
}