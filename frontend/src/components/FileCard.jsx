import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Trash2, FileText, Image as ImageIcon, Package } from 'lucide-react';

const FileCard = ({ file, onDelete, onDownload }) => {
    const [imageError, setImageError] = useState(false);

    const isImage = file.category === 'photos';

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -4, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-brand-300 dark:hover:border-brand-500/50 shadow-sm transition-colors duration-300 group relative flex flex-col h-full"
        >
            <div className="h-40 bg-slate-50 dark:bg-slate-900/50 rounded-xl mb-4 flex items-center justify-center overflow-hidden border border-slate-100 dark:border-slate-800/50 relative">
                {isImage && file.url && !imageError ? (
                    <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="text-slate-400 dark:text-slate-500 group-hover:text-brand-500 transition-colors duration-300 transform group-hover:scale-110">
                        {file.category === 'photos' ? <ImageIcon className="w-10 h-10 stroke-[1.5]" /> :
                            file.category === 'documents' ? <FileText className="w-10 h-10 stroke-[1.5]" /> :
                                <Package className="w-10 h-10 stroke-[1.5]" />}
                    </div>
                )}
            </div>

            <div className="flex-1 flex flex-col justify-end">
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 truncate text-[15px] leading-tight" title={file.name}>{file.name}</h3>
                <div className="flex items-center justify-between mt-1.5">
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{(file.size / 1024).toFixed(1)} KB</p>
                    <p className="text-xs font-medium text-slate-400 dark:text-slate-500 capitalize">{file.category}</p>
                </div>
            </div>

            {/* Hover Actions */}
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-2 translate-y-2 group-hover:translate-y-0">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); onDownload(file); }}
                    className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-md border border-slate-200 dark:border-slate-600 hover:border-brand-400 dark:hover:border-brand-400 hover:text-brand-600 dark:hover:text-brand-400 text-slate-600 dark:text-slate-300 transition-all"
                    title="Download"
                >
                    <Download className="w-4 h-4" />
                </motion.button>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={(e) => { e.stopPropagation(); onDelete(file); }}
                    className="p-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-md border border-slate-200 dark:border-slate-600 hover:border-red-400 dark:hover:border-red-400 hover:text-red-500 dark:hover:text-red-400 text-slate-600 dark:text-slate-300 transition-all"
                    title="Delete"
                >
                    <Trash2 className="w-4 h-4" />
                </motion.button>
            </div>
        </motion.div >
    );
};

export default FileCard;
