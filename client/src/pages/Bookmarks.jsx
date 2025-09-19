import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/authStore';
import useTheme from '../context/themeStore';
import ResourceCard from '../components/ResourceCard';

export default function Bookmarks(){
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, subjects, recent

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchBookmarks();
  }, [user, navigate]);

  const fetchBookmarks = async () => {
    try {
      const response = await fetch('/api/bookmarks');
      if (response.ok) {
        const data = await response.json();
        setBookmarks(data);
      }
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeBookmark = async (resourceId) => {
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId })
      });
      
      if (response.ok) {
        setBookmarks(bookmarks.filter(b => b.resourceId._id !== resourceId));
      }
    } catch (error) {
      console.error('Error removing bookmark:', error);
    }
  };

  const getFilteredBookmarks = () => {
    let filtered = [...bookmarks];
    
    switch (filter) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'subjects':
        filtered.sort((a, b) => a.resourceId.subject.localeCompare(b.resourceId.subject));
        break;
      default:
        break;
    }
    
    return filtered;
  };

  const getSubjects = () => {
    const subjects = [...new Set(bookmarks.map(b => b.resourceId.subject))];
    return subjects.sort();
  };

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-stone-600'}`}>Loading your shelf...</div>
      </div>
    );
  }

  const filteredBookmarks = getFilteredBookmarks();
  const subjects = getSubjects();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>My Shelf</h1>
        <p className={isDarkMode ? 'text-gray-300' : 'text-stone-600'}>Your personal collection of saved resources</p>
      </div>

      {/* Stats and Filters */}
      <div className={`rounded-xl shadow-lg p-6 mb-8 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-stone-200'}`}>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600">{bookmarks.length}</div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-stone-600'}`}>Total Resources</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-stone-600">{subjects.length}</div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-stone-600'}`}>Subjects</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-stone-600">
              {bookmarks.filter(b => b.resourceId.status === 'approved').length}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-stone-600'}`}>Approved</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-stone-600">
              {bookmarks.filter(b => b.resourceId.status === 'pending').length}
            </div>
            <div className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-stone-600'}`}>Pending</div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-4">
          <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-stone-700'}`}>Sort by:</label>
          <select 
            className={`px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-stone-300 text-gray-900'}`}
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            <option value="all">All Resources</option>
            <option value="recent">Recently Added</option>
            <option value="subjects">By Subject</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {bookmarks.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow border border-stone-200">
          <svg className="mx-auto h-16 w-16 text-stone-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          </svg>
          <h3 className="text-lg font-medium text-stone-800 mb-2">Your shelf is empty</h3>
          <p className="text-stone-600 mb-6">Start building your personal library by bookmarking resources you find useful</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Browse Library
          </button>
        </div>
      ) : (
        <div>
          {/* Subject Breakdown */}
          {filter === 'subjects' && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-stone-800 mb-4">Organized by Subject</h2>
              <div className="space-y-6">
                {subjects.map(subject => {
                  const subjectBookmarks = bookmarks.filter(b => b.resourceId.subject === subject);
                  return (
                    <div key={subject} className="bg-white rounded-xl shadow border border-stone-200 overflow-hidden">
                      <div className="bg-stone-50 px-6 py-4 border-b border-stone-200">
                        <h3 className="text-lg font-semibold text-stone-800">{subject}</h3>
                        <p className="text-sm text-stone-600">{subjectBookmarks.length} resources</p>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                          {subjectBookmarks.map(bookmark => (
                            <div key={bookmark._id} className="relative group">
                              <div className="relative">
                                <ResourceCard r={bookmark.resourceId} />
                                <button
                                  onClick={() => removeBookmark(bookmark.resourceId._id)}
                                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                                  title="Remove from shelf"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                              <div className="mt-2 text-xs text-stone-500 text-center">
                                Added {new Date(bookmark.createdAt).toLocaleDateString()}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Standard Grid View */}
          {filter !== 'subjects' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredBookmarks.map(bookmark => (
                <div key={bookmark._id} className="relative group">
                  <div className="relative">
                    <ResourceCard r={bookmark.resourceId} />
                    <button
                      onClick={() => removeBookmark(bookmark.resourceId._id)}
                      className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-200 z-10"
                      title="Remove from shelf"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="mt-2 text-xs text-stone-500 text-center">
                    Added {new Date(bookmark.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
