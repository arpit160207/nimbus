import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dropzone from './components/Dropzone'
import FileCard from './components/FileCard'
import Login from './components/Login'
import ParticlesBackground from './components/ParticlesBackground'
import './index.css'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [activeCategory, setActiveCategory] = useState('all')
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState(null)

  // Sync token to localStorage and fetch files
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      fetchFiles()
      fetchUser()
    } else {
      localStorage.removeItem('token')
      setFiles([])
      setUser(null)
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/users/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      }
    } catch (e) {
      console.error("Failed to fetch user", e)
    }
  }

  const fetchFiles = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/v1/files/list', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (res.ok) {
        const data = await res.json()
        if (Array.isArray(data)) {
          setFiles(data)
        } else {
          setFiles([])
        }
      } else {
        if (res.status === 401) setToken(null)
        setFiles([])
      }
    } catch (e) {
      console.error("Failed to fetch files", e)
      setFiles([])
    }
  }

  const handleUpload = async (fileList) => {
    setUploading(true)

    // Multi-file upload loop
    for (let i = 0; i < fileList.length; i++) {
      const formData = new FormData()
      formData.append('file', fileList[i])

      try {
        const res = await fetch(`http://localhost:8000/api/v1/files/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        })

        if (!res.ok) {
          const errData = await res.json()
          console.error(`Upload failed for ${fileList[i].name}:`, errData)
        }
      } catch (e) {
        console.error(`Upload error for ${fileList[i].name}:`, e)
      }
    }

    await fetchFiles() // Refresh list once after all uploads
    setUploading(false)
  }

  const handleDelete = async (file) => {
    if (!confirm(`Are you sure you want to delete ${file.name}?`)) return
    try {
      await fetch(`http://localhost:8000/api/v1/files/delete/${file.name}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      await fetchFiles() // Refetch to update list/stats
    } catch (e) {
      console.error("Delete failed", e)
    }
  }

  const handleDownload = (file) => {
    // Navigate to presigned URL (which triggers download/view)
    if (file.url) {
      window.open(file.url, '_blank')
    } else {
      window.location.href = `http://localhost:8000/api/v1/files/download/${file.name}`
    }
  }

  // Calculate total size
  const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0)

  if (!token) {
    return (
      <>
        <ParticlesBackground />
        <Login onLogin={setToken} />
      </>
    )
  }

  // Frontend Filter by Category AND Search Query
  const filteredFiles = files.filter(f => {
    const matchCategory = activeCategory === 'all' || f.category === activeCategory
    const matchSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

  const displayFiles = Array.isArray(filteredFiles) ? filteredFiles : []

  return (
    <div className="flex min-h-screen relative overflow-hidden font-sans">
      <ParticlesBackground />
      <Sidebar activeCategory={activeCategory} setActiveCategory={setActiveCategory} totalSize={totalSize} />

      <main className="flex-1 p-8 z-10 overflow-y-auto flex flex-col h-screen">
        <header className="flex justify-between items-center mb-8 shrink-0">
          <div className="flex items-center gap-6">
            <h2 className="text-3xl font-bold text-white tracking-tight capitalize drop-shadow-lg min-w-[150px]">
              {activeCategory === 'all' ? 'All Files' : activeCategory}
            </h2>

            {/* Search Bar */}
            <div className="relative group">
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 text-slate-200 pl-10 pr-4 py-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none w-64 transition-all group-hover:bg-slate-800/80"
              />
              <span className="absolute left-3 top-2.5 text-slate-500">🔍</span>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <div className="text-right mr-4 hidden md:block">
              <div className="text-sm font-bold text-slate-200">{user?.full_name || 'Loading...'}</div>
              <div className="text-xs text-slate-400">{user?.email || '...'}</div>
            </div>
            <button
              onClick={() => setToken(null)}
              className="bg-slate-800/80 backdrop-blur text-slate-300 border border-slate-700 px-4 py-2 rounded-lg hover:bg-slate-700 hover:text-white transition-all shadow-lg text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </header>

        <div className="mb-8 shrink-0">
          <Dropzone onDrop={handleUpload} />
          {uploading && <p className="text-blue-400 mt-2 text-sm animate-pulse font-medium text-center">Uploading files to cloud...</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
          {displayFiles.map((file, i) => (
            <FileCard key={i} file={file} onDownload={handleDownload} onDelete={handleDelete} />
          ))}
          {displayFiles.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500 bg-slate-900/20 rounded-2xl border border-slate-800/50 backdrop-blur-sm min-h-[300px]">
              <div className="text-5xl mb-4 opacity-50 grayscale">
                {searchQuery ? '🔍' : '📭'}
              </div>
              <p className="text-lg font-medium">{searchQuery ? 'No matching files found' : 'No files found in this category'}</p>
              {searchQuery && <button onClick={() => setSearchQuery('')} className="text-blue-400 text-sm mt-2 hover:underline">Clear Search</button>}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
