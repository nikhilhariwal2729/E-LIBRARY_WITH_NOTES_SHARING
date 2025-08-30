import { Link } from 'react-router-dom';

export default function ResourceCard({ r }){
  return (
    <Link to={`/resource/${r._id}`} className="block group">
      <div className="bg-white rounded-xl shadow-lg border border-stone-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        {/* Header with Status */}
        <div className="p-4 border-b border-stone-100">
          <div className="flex items-center justify-between mb-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              r.status === 'approved' ? 'bg-green-100 text-green-800' :
              r.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {r.status.charAt(0).toUpperCase() + r.status.slice(1)}
            </span>
            <span className="text-xs text-stone-500">
              {new Date(r.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <h3 className="font-semibold text-stone-800 text-lg group-hover:text-amber-600 transition-colors line-clamp-2">
            {r.title}
          </h3>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Subject Badge */}
          <div className="mb-3">
            <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
              {r.subject}
            </span>
          </div>

          {/* Description */}
          {r.description && (
            <p className="text-stone-600 text-sm mb-4 line-clamp-3">
              {r.description}
            </p>
          )}

          {/* Tags */}
          {r.tags && r.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {r.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-1 bg-stone-100 text-stone-700 rounded-full text-xs">
                  #{tag}
                </span>
              ))}
              {r.tags.length > 3 && (
                <span className="px-2 py-1 bg-stone-100 text-stone-700 rounded-full text-xs">
                  +{r.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Stats Row */}
          <div className="flex items-center justify-between text-sm text-stone-600">
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="font-medium">
                {r.rating?.avg?.toFixed(1) || '0.0'}
              </span>
              <span className="text-stone-500">({r.rating?.count || 0})</span>
            </div>
            
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>{r.downloadsCount || 0}</span>
            </div>
          </div>

          {/* Uploader Info */}
          <div className="mt-3 pt-3 border-t border-stone-100">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>By {r.uploadedBy?.name}</span>
              <span className="capitalize">{r.uploadedBy?.role}</span>
            </div>
          </div>
        </div>

        {/* Hover Effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
    </Link>
  );
}
