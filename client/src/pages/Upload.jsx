import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../context/authStore';
import useTheme from '../context/themeStore';

export default function Upload(){
  const { user } = useAuth();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [form, setForm] = useState({ title:'', subject:'', tags:'', description:'' });
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  if (!user) {
    navigate('/auth');
    return null;
  }

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: 'Please select a file to upload' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value.trim()) formData.append(key, value.trim());
      });
      formData.append('file', file);

      const response = await fetch('/api/resources', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage({ 
          type: 'success', 
          text: 'Resource uploaded successfully! Pending admin approval.' 
        });
        setForm({ title:'', subject:'', tags:'', description:'' });
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        const error = await response.text();
        setMessage({ type: 'error', text: error || 'Upload failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Upload failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      {/* Header Section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full mb-6">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>Upload Resource</h1>
        <p className={isDarkMode ? 'text-gray-300' : 'text-stone-600'}>Share your knowledge with the community and help others learn</p>
      </div>

      <div className={`rounded-xl shadow-lg p-10 border w-full ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-stone-200'}`}>
        <form onSubmit={submit} className="space-y-8">
          {/* File Upload Area */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-stone-700'}`}>Resource File</label>
              <span className="text-red-500 text-sm">*</span>
            </div>
            
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300 ${
                dragActive 
                  ? 'border-amber-500 bg-amber-50' 
                  : isDarkMode 
                    ? 'border-gray-600 hover:border-amber-400 hover:bg-gray-700' 
                    : 'border-stone-300 hover:border-amber-400 hover:bg-stone-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className={`text-lg font-semibold mb-1 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>{file.name}</p>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-stone-600'}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  <button
                    type="button"
                    onClick={removeFile}
                    className="px-4 py-2 text-sm text-red-600 hover:text-red-700 font-medium bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    Remove File
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-center">
                    <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center">
                      <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className={`text-lg font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-stone-800'}`}>Drop your file here</p>
                    <p className={`mb-4 ${isDarkMode ? 'text-gray-300' : 'text-stone-600'}`}>or click the button below to browse</p>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors font-medium"
                    >
                      Choose File
                    </button>
                  </div>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.ppt,.pptx"
              />
            </div>
            
            <div className={`flex items-center justify-center gap-6 text-sm ${isDarkMode ? 'text-gray-400' : 'text-stone-500'}`}>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>PDF, DOC, DOCX, PPT, PPTX</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Max 25MB</span>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-stone-700'}`}>Title</label>
                  <span className="text-red-500 text-sm">*</span>
                </div>
                <input 
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-stone-300 text-gray-900 placeholder-gray-500'}`}
                  placeholder="Enter a descriptive title for your resource"
                  value={form.title} 
                  onChange={e => setForm({...form, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-stone-700'}`}>Subject</label>
                  <span className="text-red-500 text-sm">*</span>
                </div>
                <input 
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-stone-300 text-gray-900 placeholder-gray-500'}`}
                  placeholder="e.g., Mathematics, Physics, Computer Science"
                  value={form.subject} 
                  onChange={e => setForm({...form, subject: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-stone-700'}`}>Tags</label>
                  <span className="text-stone-500 text-sm">(Optional)</span>
                </div>
                <input 
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-stone-300 text-gray-900 placeholder-gray-500'}`}
                  placeholder="Enter tags separated by commas (e.g., algebra, equations, basics)"
                  value={form.tags} 
                  onChange={e => setForm({...form, tags: e.target.value})}
                />
                <p className={`text-sm flex items-center gap-2 ${isDarkMode ? 'text-gray-400' : 'text-stone-500'}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Tags help others discover your resource more easily
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-stone-700'}`}>Description</label>
                  <span className="text-stone-500 text-sm">(Optional)</span>
                </div>
                <textarea 
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' : 'bg-white border-stone-300 text-gray-900 placeholder-gray-500'}`}
                  rows={4}
                  placeholder="Describe what this resource contains, what topics it covers, and how it can help others learn..."
                  value={form.description} 
                  onChange={e => setForm({...form, description: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Message Display */}
          {message.text && (
            <div className={`px-4 py-3 rounded-lg text-sm font-medium ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              <div className="flex items-center gap-2">
                {message.type === 'success' ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
                {message.text}
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4 border-t border-stone-200">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-stone-300 text-stone-700 rounded-lg hover:bg-stone-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={loading || !file}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Upload Resource
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
