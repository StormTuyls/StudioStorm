import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout, getCurrentUser } from '../api';
import PhotosManager from '../components/admin/PhotosManager';
import AlbumsManager from '../components/admin/AlbumsManager';
import ClientGalleriesManager from '../components/admin/ClientGalleriesManager';
import UsersManager from '../components/admin/UsersManager';

type Tab = 'photos' | 'albums' | 'galleries' | 'users';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>('photos');
  const [user, setUser] = useState<{ username: string } | null>(null);
  const navigate = useNavigate();

  const loadUser = useCallback(async () => {
    try {
      const userData = await getCurrentUser();
      setUser(userData);
    } catch {
      navigate('/admin/login');
    }
  }, [navigate]);

  useEffect(() => {
    const init = async () => {
      await loadUser();
    };
    void init();
  }, [loadUser]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-light text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome, {user.username}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('photos')}
              className={`${
                activeTab === 'photos'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Photos
            </button>
            <button
              onClick={() => setActiveTab('albums')}
              className={`${
                activeTab === 'albums'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Albums
            </button>
            <button
              onClick={() => setActiveTab('galleries')}
              className={`${
                activeTab === 'galleries'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Client Galleries
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Users
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-8">
          {activeTab === 'photos' && <PhotosManager />}
          {activeTab === 'albums' && <AlbumsManager />}
          {activeTab === 'galleries' && <ClientGalleriesManager />}
          {activeTab === 'users' && <UsersManager />}
        </div>
      </div>
    </div>
  );
}
