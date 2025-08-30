import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/authStore';

export default function Dashboard(){
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalResources: 0,
    userResources: 0,
    userBookmarks: 0,
    userComments: 0,
    userRating: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      const [resourcesRes, bookmarksRes, commentsRes] = await Promise.all([
        fetch('/api/resources'),
        fetch('/api/bookmarks'),
        fetch('/api/comments')
      ]);

      let totalResources = 0;
      let userResources = 0;
      let userBookmarks = 0;
      let userComments = 0;
      let userRating = 0;

      if (resourcesRes.ok) {
        const resources = await resourcesRes.json();
        totalResources = resources.length;
        userResources = resources.filter(r => r.uploadedBy?._id === user.id).length;
      }

      if (bookmarksRes.ok) {
        const bookmarks = await bookmarksRes.json();
        userBookmarks = bookmarks.length;
      }

      if (commentsRes.ok) {
        const comments = await commentsRes.json();
        userComments = comments.filter(c => c.userId?._id === user.id).length;
      }

      setStats({
        totalResources,
        userResources,
        userBookmarks,
        userComments,
        userRating
      });

      // Get recent activity (last 5 resources)
      if (resourcesRes.ok) {
        const resources = await resourcesRes.json();
        const recent = resources
          .filter(r => r.status === 'approved')
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentActivity(recent);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-stone-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">
          Welcome back, {user.name}! 👋
        </h1>
        <p className="text-stone-600">Here's what's happening in your E-Library</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-stone-600">Total Resources</p>
              <p className="text-2xl font-bold text-stone-800">{stats.totalResources}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-stone-600">Your Uploads</p>
              <p className="text-2xl font-bold text-stone-800">{stats.userResources}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200">
          <div className="flex items-center">
            <div className="p-3 bg-amber-100 rounded-lg">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-stone-600">Your Shelf</p>
              <p className="text-2xl font-bold text-stone-800">{stats.userBookmarks}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-stone-600">Your Comments</p>
              <p className="text-2xl font-bold text-stone-800">{stats.userComments}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200">
          <h2 className="text-xl font-semibold text-stone-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/upload')}
              className="w-full flex items-center justify-between p-4 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 text-amber-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                <span className="font-medium text-stone-800">Upload New Resource</span>
              </div>
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-between p-4 bg-stone-50 border border-stone-200 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 text-stone-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="font-medium text-stone-800">Browse Library</span>
              </div>
              <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <button
              onClick={() => navigate('/bookmarks')}
              className="w-full flex items-center justify-between p-4 bg-stone-50 border border-stone-200 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <div className="flex items-center">
                <svg className="w-5 h-5 text-stone-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span className="font-medium text-stone-800">View My Shelf</span>
              </div>
              <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {user.role === 'admin' && (
              <button
                onClick={() => navigate('/admin')}
                className="w-full flex items-center justify-between p-4 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="font-medium text-stone-800">Admin Panel</span>
                </div>
                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-stone-200">
          <h2 className="text-xl font-semibold text-stone-800 mb-4">Recent Library Activity</h2>
          {recentActivity.length === 0 ? (
            <p className="text-stone-500 text-center py-8">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.map(resource => (
                <div key={resource._id} className="flex items-center p-3 bg-stone-50 rounded-lg">
                  <div className="flex-1">
                    <h4 className="font-medium text-stone-800 text-sm">{resource.title}</h4>
                    <p className="text-xs text-stone-600">
                      {resource.subject} • {new Date(resource.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/resource/${resource._id}`)}
                    className="px-3 py-1 text-xs bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* User Profile Summary */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6 border border-stone-200">
        <h2 className="text-xl font-semibold text-stone-800 mb-4">Your Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-stone-50 rounded-lg">
            <div className="text-2xl font-bold text-stone-800">{user.name}</div>
            <div className="text-sm text-stone-600 capitalize">{user.role}</div>
          </div>
          <div className="text-center p-4 bg-stone-50 rounded-lg">
            <div className="text-2xl font-bold text-stone-800">{user.email}</div>
            <div className="text-sm text-stone-600">Email Address</div>
          </div>
          <div className="text-center p-4 bg-stone-50 rounded-lg">
            <div className="text-2xl font-bold text-stone-800">
              {new Date().toLocaleDateString()}
            </div>
            <div className="text-sm text-stone-600">Today's Date</div>
          </div>
        </div>
      </div>
    </div>
  );
}
