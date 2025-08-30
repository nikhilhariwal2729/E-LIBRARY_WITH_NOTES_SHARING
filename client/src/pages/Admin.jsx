import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/authStore';

export default function Admin(){
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pendingResources, setPendingResources] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/dashboard');
      return;
    }
    fetchAdminData();
  }, [user, navigate]);

  const fetchAdminData = async () => {
    try {
      const [pendingRes, usersRes, statsRes] = await Promise.all([
        fetch('/api/admin/pending'),
        fetch('/api/admin/users'),
        fetch('/api/admin/stats')
      ]);

      if (pendingRes.ok) {
        const pendingData = await pendingRes.json();
        setPendingResources(pendingData);
      }

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const approveResource = async (resourceId) => {
    try {
      const response = await fetch(`/api/admin/approve/${resourceId}`, { method: 'POST' });
      if (response.ok) {
        setPendingResources(pendingResources.filter(r => r._id !== resourceId));
        setMessage({ type: 'success', text: 'Resource approved successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        fetchAdminData(); // Refresh stats
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to approve resource' });
    }
  };

  const rejectResource = async (resourceId) => {
    try {
      const response = await fetch(`/api/admin/reject/${resourceId}`, { method: 'POST' });
      if (response.ok) {
        setPendingResources(pendingResources.filter(r => r._id !== resourceId));
        setMessage({ type: 'success', text: 'Resource rejected successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        fetchAdminData(); // Refresh stats
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to reject resource' });
    }
  };

  const toggleUserBlock = async (userId, isBlocked) => {
    try {
      const endpoint = isBlocked ? `/api/admin/unblock/${userId}` : `/api/admin/block/${userId}`;
      const response = await fetch(endpoint, { method: 'POST' });
      
      if (response.ok) {
        setUsers(users.map(u => 
          u._id === userId ? { ...u, isBlocked: !isBlocked } : u
        ));
        setMessage({ 
          type: 'success', 
          text: `User ${isBlocked ? 'unblocked' : 'blocked'} successfully!` 
        });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update user status' });
    }
  };

  if (!user || user.role !== 'admin') return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-stone-600">Loading admin panel...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Admin Panel</h1>
        <p className="text-stone-600">Manage resources, users, and monitor system activity</p>
      </div>

      {/* Message Display */}
      {message.text && (
        <div className={`mb-6 px-4 py-3 rounded-lg text-sm ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600">{pendingResources.length}</div>
            <div className="text-sm text-stone-600">Pending Approvals</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{users.length}</div>
            <div className="text-sm text-stone-600">Total Users</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {users.filter(u => !u.isBlocked).length}
            </div>
            <div className="text-sm text-stone-600">Active Users</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">
              {users.filter(u => u.isBlocked).length}
            </div>
            <div className="text-sm text-stone-600">Blocked Users</div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden">
        <div className="border-b border-stone-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'pending', label: 'Pending Approvals', count: pendingResources.length },
              { id: 'users', label: 'User Management', count: users.length },
              { id: 'analytics', label: 'Analytics', count: null }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
                }`}
              >
                {tab.label}
                {tab.count !== null && (
                  <span className="ml-2 bg-stone-100 text-stone-900 py-0.5 px-2.5 rounded-full text-xs font-medium">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Pending Approvals Tab */}
          {activeTab === 'pending' && (
            <div>
              <h2 className="text-xl font-semibold text-stone-800 mb-4">Resource Approvals</h2>
              {pendingResources.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-stone-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-lg font-medium text-stone-800 mb-2">All caught up!</h3>
                  <p className="text-stone-600">No resources are waiting for approval.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingResources.map(resource => (
                    <div key={resource._id} className="bg-stone-50 rounded-lg p-4 border border-stone-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-stone-800 text-lg">{resource.title}</h3>
                          <p className="text-stone-600 mb-2">{resource.description}</p>
                          <div className="flex items-center gap-4 text-sm text-stone-500">
                            <span className="px-2 py-1 bg-stone-200 rounded-full">{resource.subject}</span>
                            <span>By {resource.uploadedBy?.name} ({resource.uploadedBy?.role})</span>
                            <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
                          </div>
                          {resource.tags && resource.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {resource.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-stone-200 text-stone-700 rounded-full text-xs">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => approveResource(resource._id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => rejectResource(resource._id)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* User Management Tab */}
          {activeTab === 'users' && (
            <div>
              <h2 className="text-xl font-semibold text-stone-800 mb-4">User Management</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-stone-200">
                  <thead className="bg-stone-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-stone-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-stone-200">
                    {users.map(user => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-stone-900">{user.name}</div>
                            <div className="text-sm text-stone-500">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.role === 'admin' ? 'bg-red-100 text-red-800' :
                            user.role === 'teacher' ? 'bg-blue-100 text-blue-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            user.isBlocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}>
                            {user.isBlocked ? 'Blocked' : 'Active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-stone-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => toggleUserBlock(user._id, user.isBlocked)}
                              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                                user.isBlocked
                                  ? 'bg-green-600 text-white hover:bg-green-700'
                                  : 'bg-red-600 text-white hover:bg-red-700'
                              }`}
                            >
                              {user.isBlocked ? 'Unblock' : 'Block'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div>
              <h2 className="text-xl font-semibold text-stone-800 mb-4">System Analytics</h2>
              {stats ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Top Downloads */}
                  <div className="bg-stone-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-stone-800 mb-4">Top Downloads</h3>
                    {stats.topDownloads && stats.topDownloads.length > 0 ? (
                      <div className="space-y-3">
                        {stats.topDownloads.map((resource, index) => (
                          <div key={resource._id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-stone-200">
                            <div className="flex items-center">
                              <span className="text-lg font-bold text-amber-600 mr-3">#{index + 1}</span>
                              <div>
                                <div className="font-medium text-stone-800">{resource.title}</div>
                                <div className="text-sm text-stone-600">{resource.downloadsCount} downloads</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-stone-500 text-center py-4">No download data available</p>
                    )}
                  </div>

                  {/* Resources by Subject */}
                  <div className="bg-stone-50 rounded-lg p-6">
                    <h3 className="text-lg font-medium text-stone-800 mb-4">Resources by Subject</h3>
                    {stats.bySubject && stats.bySubject.length > 0 ? (
                      <div className="space-y-3">
                        {stats.bySubject.map(subject => (
                          <div key={subject._id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-stone-200">
                            <span className="font-medium text-stone-800">{subject._id}</span>
                            <span className="text-lg font-bold text-amber-600">{subject.count}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-stone-500 text-center py-4">No subject data available</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-stone-500 text-center py-8">Analytics data not available</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
