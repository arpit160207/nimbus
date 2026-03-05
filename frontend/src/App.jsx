import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dropzone from './components/Dropzone'
import FileCard from './components/FileCard'
import Login from './components/Login'
import { API_BASE_URL } from './config'
import { Toaster, toast } from 'react-hot-toast'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, FolderOpen } from 'lucide-react'
import './index.css'

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [activeCategory, setActiveCategory] = useState('all')
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  // Theme State
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')

  // Apply Theme to HTML Document & Save to LocalStorage
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  // Sync token to localStorage and fetch data
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      setIsLoading(true)
      Promise.all([fetchFiles(), fetchUser()]).finally(() => {
        setTimeout(() => setIsLoading(false), 400)
      })
    } else {
      localStorage.removeItem('token')
      setFiles([])
      setUser(null)
      setIsLoading(false)
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users/me`, {
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
      const res = await fetch(`${API_BASE_URL}/files/list?t=${Date.now()}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store'
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
    let uploadToast = toast.loading('Uploading files...')
    let successCount = 0
    let failCount = 0

    for (let i = 0; i < fileList.length; i++) {
      const formData = new FormData()
      formData.append('file', fileList[i])

      try {
        const res = await fetch(`${API_BASE_URL}/files/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        })

        if (!res.ok) {
          const errData = await res.json()
          toast.error(`Failed to upload ${fileList[i].name}: ${errData.detail || 'Unknown error'}`)
          failCount++
        } else {
          successCount++
        }
      } catch (e) {
        toast.error(`Error uploading ${fileList[i].name}`)
        failCount++
      }
    }

    await fetchFiles()
    setUploading(false)
    toast.dismiss(uploadToast)

    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} file(s)`)
    }
  }

  const handleDelete = async (file) => {
    if (!confirm(`Are you sure you want to delete ${file.name}?`)) return

    const deleteToast = toast.loading(`Deleting ${file.name}...`)
    try {
      const res = await fetch(`${API_BASE_URL}/files/delete/${file.name}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })

      if (!res.ok) throw new Error('Delete failed')

      await fetchFiles()
      toast.success(`${file.name} deleted`, { id: deleteToast })
    } catch (e) {
      toast.error(`Failed to delete ${file.name}`, { id: deleteToast })
    }
  }

  const handleDownload = (file) => {
    if (file.url) {
      window.open(file.url, '_blank')
    } else {
      window.location.href = `${API_BASE_URL}/files/download/${file.name}`
    }
  }

  const totalSize = files.reduce((acc, file) => acc + (file.size || 0), 0)

  // Custom Toaster styles based on theme
  const toastOptions = {
    className: 'dark:bg-slate-800 dark:text-slate-50 dark:border-slate-700 border bg-white text-slate-900 border-slate-200 shadow-xl rounded-xl font-medium'
  };

  if (!token) {
    return (
      <motion.div
        key="login"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 relative"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-100/50 via-slate-50 to-slate-50 dark:from-blue-900/10 dark:via-slate-900 dark:to-slate-900 pointer-events-none" />
        <Toaster position="bottom-right" toastOptions={toastOptions} />
        <Login onLogin={(newToken) => {
          setToken(newToken)
          toast.success('Successfully logged in!', { icon: '🚀' })
        }} />
      </motion.div>
    )
  }

  const filteredFiles = files.filter(f => {
    const matchCategory = activeCategory === 'all' || f.category === activeCategory
    const matchSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchCategory && matchSearch
  })

  const displayFiles = Array.isArray(filteredFiles) ? filteredFiles : []

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 350, damping: 25 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex min-h-screen font-sans bg-slate-50 dark:bg-slate-900 transition-colors duration-300 selection:bg-brand-500/30 w-full"
    >
      <Toaster position="bottom-right" toastOptions={toastOptions} />

      <Sidebar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        totalSize={totalSize}
        theme={theme}
        setTheme={setTheme}
      />

      <motion.main
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", stiffness: 250, damping: 22 }}
        className="flex-1 p-8 lg:p-12 z-10 overflow-y-auto flex flex-col h-screen relative"
      >
        {/* Soft Radial Background Accent */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-brand-500/5 dark:bg-brand-500/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 shrink-0 relative z-20">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <motion.h2
              key={activeCategory}
              initial={{ opacity: 0, y: -10, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.3, type: "spring" }}
              className="text-3xl font-extrabold text-slate-900 dark:text-slate-50 tracking-tight capitalize min-w-[150px]"
            >
              {activeCategory === 'all' ? 'All Files' : activeCategory}
            </motion.h2>

            <div className="relative group w-full md:w-auto">
              <input
                type="text"
                placeholder="Search files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 bg-white dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700/50 text-slate-900 dark:text-slate-200 pl-11 pr-4 py-2.5 rounded-2xl focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 outline-none transition-all shadow-sm hover:shadow-md dark:shadow-none placeholder-slate-400 dark:placeholder-slate-500"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5 transition-colors group-focus-within:text-brand-500 dark:group-focus-within:text-brand-400" />
            </div>
          </div>

          <div className="flex gap-4 items-center self-end md:self-auto">
            <div className="text-right mr-2 hidden sm:block">
              <div className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-tight">{user?.full_name || 'Loading...'}</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{user?.email || '...'}</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setToken(null)
                toast('Logged out successfully', { icon: '👋' })
              }}
              className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 px-5 py-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/80 hover:text-brand-600 dark:hover:text-white transition-all shadow-sm font-semibold text-sm"
            >
              Log out
            </motion.button>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, type: "spring" }}
          className="mb-10 shrink-0 relative z-20"
        >
          <Dropzone onDrop={handleUpload} isUploading={uploading} />
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20 relative z-20">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white/50 dark:bg-slate-800/30 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/50 h-[220px] animate-pulse flex flex-col shadow-sm">
                <div className="bg-slate-200/50 dark:bg-slate-700/30 w-full h-32 rounded-xl mb-4"></div>
                <div className="bg-slate-200/80 dark:bg-slate-700/40 w-3/4 h-4 rounded-full mt-auto"></div>
                <div className="bg-slate-200/50 dark:bg-slate-700/30 w-1/2 h-3 rounded-full mt-3"></div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20 relative z-20"
          >
            <AnimatePresence>
              {displayFiles.map((file) => (
                <motion.div
                  key={file.key || file.name}
                  variants={itemVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  layout
                  className="h-full"
                >
                  <FileCard file={file} onDownload={handleDownload} onDelete={handleDelete} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {!isLoading && displayFiles.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="w-full flex flex-col items-center justify-center py-24 px-4 text-center bg-white/50 dark:bg-slate-800/20 rounded-3xl border border-slate-200 border-dashed dark:border-slate-800 mt-4 relative z-20"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="mb-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-full shadow-inner border border-slate-100 dark:border-slate-700"
            >
              {searchQuery ? <Search className="w-12 h-12 text-slate-400" /> : <FolderOpen className="w-12 h-12 text-slate-400" />}
            </motion.div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {searchQuery ? 'No results found' : 'No files uploaded yet'}
            </h3>
            <p className="text-slate-500 max-w-sm">
              {searchQuery ? `We couldn't find anything matching "${searchQuery}". Try a different term.` : 'Drag and drop your files above to start organizing your cloud.'}
            </p>
            {searchQuery && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSearchQuery('')}
                className="mt-8 px-6 py-2.5 bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400 rounded-xl hover:bg-brand-100 dark:hover:bg-brand-500/20 transition-colors font-semibold text-sm border border-brand-200 dark:border-brand-500/20"
              >
                Clear Search
              </motion.button>
            )}
          </motion.div>
        )}
      </motion.main>
    </motion.div>
  )
}

export default App
