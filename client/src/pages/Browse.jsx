import { useEffect, useState } from 'react';
import ResourceCard from '../components/ResourceCard';

export default function Browse(){
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [q, setQ] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [loading, setLoading] = useState(true);
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [items, q, selectedSubject, selectedStatus, sortBy, sortOrder]);

  const fetchResources = async () => {
    try {
      const response = await fetch('/api/resources');
      const data = await response.json();
      setItems(data);
      
      // Extract unique subjects
      const uniqueSubjects = [...new Set(data.map(item => item.subject))].sort();
      setSubjects(uniqueSubjects);
    } catch (error) {
      console.error('Error fetching resources:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...items];

    // Search filter
    if (q.trim()) {
      const searchTerm = q.toLowerCase();
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm) ||
        item.description?.toLowerCase().includes(searchTerm) ||
        item.subject.toLowerCase().includes(searchTerm) ||
        item.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Subject filter
    if (selectedSubject) {
      filtered = filtered.filter(item => item.subject === selectedSubject);
    }

    // Status filter
    if (selectedStatus) {
      filtered = filtered.filter(item => item.status === selectedStatus);
    }

    // Sorting
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'downloadsCount':
          aValue = a.downloadsCount || 0;
          bValue = b.downloadsCount || 0;
          break;
        case 'rating':
          aValue = a.rating?.avg || 0;
          bValue = b.rating?.avg || 0;
          break;
        case 'createdAt':
        default:
          aValue = new Date(a.createdAt);
          bValue = new Date(b.createdAt);
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredItems(filtered);
  };

  const clearFilters = () => {
    setQ('');
    setSelectedSubject('');
    setSelectedStatus('');
    setSortBy('createdAt');
    setSortOrder('desc');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-stone-600">Loading resources...</div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800 mb-2">Browse Library</h1>
        <p className="text-stone-600">Discover and explore educational resources shared by our community</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-stone-200">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          {/* Search */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-stone-700 mb-2">Search Resources</label>
            <input 
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              placeholder="Search titles, descriptions, subjects, tags..."
              value={q} 
              onChange={e => setQ(e.target.value)} 
            />
          </div>

          {/* Subject Filter */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Subject</label>
            <select 
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">Status</label>
            <select 
              className="w-full px-4 py-3 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Sort and Clear */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-stone-700">Sort by:</label>
            <select 
              className="px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
            >
              <option value="createdAt">Date Added</option>
              <option value="title">Title</option>
              <option value="downloadsCount">Downloads</option>
              <option value="rating">Rating</option>
            </select>
            
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors"
            >
              {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
            </button>
          </div>

          <button
            onClick={clearFilters}
            className="px-4 py-2 text-stone-600 hover:text-stone-800 font-medium"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-stone-600">
          Showing <span className="font-medium">{filteredItems.length}</span> of <span className="font-medium">{items.length}</span> resources
          {q && ` matching "${q}"`}
          {selectedSubject && ` in ${selectedSubject}`}
        </p>
      </div>

      {/* Resources Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow border border-stone-200">
          <svg className="mx-auto h-16 w-16 text-stone-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-lg font-medium text-stone-800 mb-2">No resources found</h3>
          <p className="text-stone-600 mb-4">Try adjusting your search criteria or filters</p>
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredItems.map(r => (
            <ResourceCard key={r._id} r={r} />
          ))}
        </div>
      )}
    </div>
  );
}
