import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuth from '../context/authStore';
import useTheme from '../context/themeStore';

export default function ResourceDetail(){
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const [resource, setResource] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchResourceData();
  }, [id]);

  const fetchResourceData = async () => {
    try {
      const [resourceRes, commentsRes] = await Promise.all([
        fetch(`/api/resources/${id}`),
        fetch(`/api/comments?resourceId=${id}`)
      ]);
      
      if (resourceRes.ok) {
        const resourceData = await resourceRes.json();
        setResource(resourceData);
        
        // Get user's existing rating
        if (user) {
          try {
            const ratingRes = await fetch(`/api/ratings?resourceId=${id}&userId=${user.id}`);
            if (ratingRes.ok) {
              const ratingData = await ratingRes.json();
              if (ratingData.length > 0) {
                setUserRating(ratingData[0].rating);
              }
            }
          } catch (error) {
            console.error('Error fetching user rating:', error);
          }
        }
      }
      
      if (commentsRes.ok) {
        const commentsData = await commentsRes.json();
        setComments(commentsData);
      }
    } catch (error) {
      console.error('Error fetching resource data:', error);
      setMessage({ type: 'error', text: 'Failed to load resource' });
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/auth');
      return;
    }
    
    if (!commentText.trim()) return;
    
    setSubmitting(true);
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId: id, comment: commentText.trim() })
      });
      
      if (response.ok) {
        const newComment = await response.json();
        setComments([newComment, ...comments]);
        setCommentText('');
        setMessage({ type: 'success', text: 'Comment added successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add comment' });
    } finally {
      setSubmitting(false);
    }
  };

  const submitRating = async (rating) => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId: id, rating })
      });
      
      if (response.ok) {
        setUserRating(rating);
        // Update the resource rating immediately
        setResource(prev => ({
          ...prev,
          rating: {
            avg: rating,
            count: (prev.rating?.count || 0) + 1
          }
        }));
        setMessage({ type: 'success', text: 'Rating submitted successfully!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to submit rating' });
    }
  };

  const downloadResource = async () => {
    try {
      // Increment download count
      await fetch(`/api/resources/${id}/download`, { method: 'POST' });
      
      // Open file in new tab
      if (resource.filePath.startsWith('http')) {
        window.open(resource.filePath, '_blank');
      } else {
        window.open(`/api${resource.filePath}`, '_blank');
      }
      
      // Refresh resource data
      fetchResourceData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Download failed' });
    }
  };

  const toggleBookmark = async () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    try {
      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resourceId: id })
      });
      
      if (response.ok) {
        setMessage({ type: 'success', text: 'Added to your shelf!' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to bookmark' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-stone-600'}`}>Loading resource...</div>
      </div>
    );
  }

  if (!resource) {
    return (
      <div className="text-center py-16">
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>Resource Not Found</h2>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
        >
          Back to Library
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
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

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Resource Header */}
          <div className={`rounded-xl shadow-lg p-8 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-stone-200'}`}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className={`text-3xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>{resource.title}</h1>
                <div className={`flex items-center gap-4 text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-stone-600'}`}>
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full font-medium">
                    {resource.subject}
                  </span>
                  <span className={`px-3 py-1 rounded-full font-medium ${
                    resource.status === 'approved' ? 'bg-green-100 text-green-800' :
                    resource.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {resource.status.charAt(0).toUpperCase() + resource.status.slice(1)}
                  </span>
                </div>
                
                {resource.description && (
                  <p className={`text-lg leading-relaxed mb-6 ${isDarkMode ? 'text-gray-300' : 'text-stone-700'}`}>
                    {resource.description}
                  </p>
                )}

                {/* Tags */}
                {resource.tags && resource.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {resource.tags.map(tag => (
                      <span key={tag} className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-stone-100 text-stone-700'}`}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Upload Info */}
                <div className={`flex items-center gap-6 text-sm border-t pt-4 ${isDarkMode ? 'text-gray-300 border-gray-700' : 'text-stone-600 border-gray-200'}`}>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>By {resource.uploadedBy?.name} ({resource.uploadedBy?.role})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rating Display */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>
                  {resource.rating?.avg?.toFixed(1) || '0.0'}
                </span>
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map(star => (
                    <svg
                      key={star}
                      className={`w-6 h-6 ${
                        star <= (resource.rating?.avg || 0) ? 'text-amber-500 fill-current' : (isDarkMode ? 'text-gray-400' : 'text-stone-300')
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className={isDarkMode ? 'text-gray-300' : 'text-stone-600'}>({resource.rating?.count || 0} ratings)</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={downloadResource}
                className={`px-6 py-3 rounded-lg transition-colors flex items-center gap-2 ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-stone-800 text-white hover:bg-stone-700'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download ({resource.downloadsCount || 0})
              </button>
              
              <button
                onClick={toggleBookmark}
                className={`px-6 py-3 border border-amber-600 text-amber-600 rounded-lg transition-colors flex items-center gap-2 ${isDarkMode ? 'hover:bg-amber-900/30' : 'hover:bg-amber-50'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Add to Shelf
              </button>
            </div>
          </div>

          {/* Rate This Resource */}
          {user && (
            <div className={`rounded-xl shadow-lg p-6 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-stone-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>Rate This Resource</h3>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => submitRating(star)}
                    className={`text-3xl transition-colors ${
                      star <= userRating ? 'text-amber-500' : (isDarkMode ? 'text-gray-400 hover:text-amber-400' : 'text-stone-300 hover:text-amber-400')
                    }`}
                  >
                    ★
                  </button>
                ))}
                <span className={`ml-3 ${isDarkMode ? 'text-gray-300' : 'text-stone-600'}`}>
                  {userRating > 0 ? `You rated this ${userRating} stars` : 'Click to rate'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Notebook Sidebar */}
        <div className="space-y-6">
          {/* Add Comment */}
          <div className={`rounded-xl p-6 border ${isDarkMode ? 'bg-amber-900/30 border-amber-700' : 'bg-amber-50 border-amber-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Notebook
            </h3>
            
            {user ? (
              <form onSubmit={submitComment} className="space-y-3">
                <textarea
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-amber-300 text-gray-900 placeholder-gray-500'}`}
                  rows={3}
                  placeholder="Write your thoughts, notes, or questions..."
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  disabled={submitting || !commentText.trim()}
                  className="w-full px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? 'Adding...' : 'Add Note'}
                </button>
              </form>
            ) : (
              <div className="text-center py-4">
                <p className={`mb-3 ${isDarkMode ? 'text-gray-300' : 'text-stone-600'}`}>Sign in to add notes and comments</p>
                <button
                  onClick={() => navigate('/auth')}
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>

          {/* Comments List */}
          <div className={`rounded-xl shadow-lg p-6 border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-stone-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>
              <svg className="w-5 h-5 text-stone-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Community Notes ({comments.length})
            </h3>
            
            {comments.length === 0 ? (
              <p className={`text-center py-4 ${isDarkMode ? 'text-gray-400' : 'text-stone-500'}`}>No notes yet. Be the first to share your thoughts!</p>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {comments.map(comment => (
                  <div key={comment._id} className={`rounded-lg p-4 border-l-4 border-amber-400 ${isDarkMode ? 'bg-gray-700' : 'bg-stone-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>{comment.userId?.name}</span>
                      <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-stone-500'}`}>
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-stone-700'}>{comment.comment}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
