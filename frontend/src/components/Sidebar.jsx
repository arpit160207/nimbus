import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudUpload, FolderOpen, ImageIcon, FileText, Package, Sun, Moon, X } from 'lucide-react';

const Sidebar = ({ activeCategory, setActiveCategory, totalSize = 0, theme, setTheme, isOpen, setIsOpen }) => {
    const totalMB = (totalSize / (1024 * 1024)).toFixed(1);
    const percentage = Math.min((totalSize / (1024 * 1024 * 1024 * 100)) * 100, 100);

    const categories = [
        { id: 'all', label: 'All Files', icon: FolderOpen },
        { id: 'photos', label: 'Photos', icon: ImageIcon },
        { id: 'documents', label: 'Documents', icon: FileText },
        { id: 'others', label: 'Others', icon: Package },
    ];

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <>
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            <div
                className={`w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/80 min-h-screen p-6 flex flex-col fixed md:relative z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] dark:shadow-none transition-transform duration-300 ease-in-out h-full overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
            >
                {/* Brand Header */}
                <div className="flex items-center justify-between mb-10 pl-2">
                    <div className="flex items-center gap-3">
                        <div className="bg-brand-500 p-2 rounded-xl shadow-md shadow-brand-500/20">
                            <CloudUpload className="text-white w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                            Nimbus<span className="text-brand-500">.</span>
                        </h1>
                    </div>
                    {/* Mobile Close Button */}
                    <button 
                        onClick={() => setIsOpen(false)} 
                        className="md:hidden p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navigation items */}
                <div className="space-y-1.5 flex-1 relative">
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4 pl-3">Library</p>
                    {categories.map((cat) => {
                        const isActive = activeCategory === cat.id;
                        const Icon = cat.icon;
                        return (
                            <motion.button
                                key={cat.id}
                                whileTap={{ scale: 0.97 }}
                                onClick={() => {
                                    setActiveCategory(cat.id);
                                    if (window.innerWidth < 768) setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3.5 relative transition-colors duration-200 ${isActive
                                        ? 'text-brand-700 dark:text-brand-400 font-semibold'
                                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 font-medium'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="navPill"
                                        className="absolute inset-0 bg-brand-50 dark:bg-brand-500/10 rounded-xl"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                {isActive && (
                                    <motion.div
                                        layoutId="navIndicator"
                                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-brand-500 rounded-r-full"
                                        initial={false}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                    />
                                )}
                                <div className="relative z-10 flex items-center gap-3.5">
                                    <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                                    <span>{cat.label}</span>
                                </div>
                            </motion.button>
                        )
                    })}
                </div>

                <div className="mt-8 space-y-6">
                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between px-3 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 transition-colors duration-300">
                        <span className="text-sm font-semibold flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            {theme === 'dark' ? <Moon className="w-4 h-4 text-brand-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
                            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                        </span>
                        <button
                            onClick={toggleTheme}
                            className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out focus:outline-none flex items-center ${theme === 'dark' ? 'bg-brand-500' : 'bg-slate-300'}`}
                        >
                            <motion.div
                                className="bg-white w-4 h-4 rounded-full shadow-sm"
                                layout
                                animate={{ x: theme === 'dark' ? 24 : 0 }}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        </button>
                    </div>

                    {/* Storage Stats */}
                    <div className="px-4 py-5 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-700/50 relative overflow-hidden transition-colors duration-300">
                        <div className="flex items-end justify-between mb-3 relative z-10">
                            <div className="flex flex-col">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Storage</span>
                                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">{totalMB} <span className="text-xs font-medium text-slate-500">MB used</span></span>
                            </div>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-700/50 rounded-full h-2 overflow-hidden relative z-10">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.max(percentage, 2)}%` }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                className="bg-brand-500 h-full rounded-full"
                            ></motion.div>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-3 font-medium text-right relative z-10">100 GB Total</p>
                    </div>
                </div>
            </div>
        </>
    );
};
export default Sidebar;
