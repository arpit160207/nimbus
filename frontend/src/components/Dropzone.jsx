import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloudUpload, UploadCloud } from 'lucide-react';

const Dropzone = ({ onDrop, isUploading }) => {
    const fileInputRef = useRef(null);
    const [isDragActive, setIsDragActive] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onDrop(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    };

    const handleClick = () => {
        if (!isUploading) {
            fileInputRef.current.click();
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onDrop(e.target.files);
        }
    };

    return (
        <motion.div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            whileHover={!isUploading ? { scale: 1.01 } : {}}
            whileTap={!isUploading ? { scale: 0.99 } : {}}
            animate={{
                borderColor: isDragActive ? "rgba(59, 130, 246, 1)" : "rgba(148, 163, 184, 0.4)",
                backgroundColor: isDragActive ? "rgba(59, 130, 246, 0.05)" : "rgba(255, 255, 255, 0.5)",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all relative overflow-hidden dark:bg-slate-800/20 bg-white/50 backdrop-blur-sm shadow-sm dark:shadow-none ${isUploading ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
        >
            {/* Animated Background Pulses when dragging */}
            <AnimatePresence>
                {isDragActive && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 2 }}
                        exit={{ opacity: 0, scale: 0 }}
                        transition={{ duration: 0.5, type: "spring" }}
                        className="absolute inset-0 bg-brand-50 dark:bg-brand-500/10 z-0 rounded-full"
                    />
                )}
            </AnimatePresence>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
                multiple
                style={{ display: 'none' }}
                disabled={isUploading}
            />

            <div className="relative z-10 flex flex-col items-center justify-center pointer-events-none">
                <motion.div
                    animate={isDragActive ? { y: -10, scale: 1.1 } : { y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="mb-4"
                >
                    {isUploading ? (
                        <div className="bg-brand-100/50 dark:bg-brand-900/30 p-4 rounded-full">
                            <UploadCloud className="w-10 h-10 text-brand-600 dark:text-brand-400 animate-bounce" />
                        </div>
                    ) : (
                        <div className={`p-4 rounded-full transition-colors duration-300 ${isDragActive ? 'bg-brand-100 dark:bg-brand-500/20' : 'bg-slate-100 dark:bg-slate-800'}`}>
                            <CloudUpload className={`w-10 h-10 ${isDragActive ? 'text-brand-600 dark:text-brand-400' : 'text-slate-500 dark:text-slate-400'}`} />
                        </div>
                    )}
                </motion.div>

                <p className="font-bold text-slate-800 dark:text-slate-200 text-lg">
                    {isUploading
                        ? 'Uploading files...'
                        : isDragActive
                            ? 'Drop files to upload'
                            : 'Click or drag files to this area to upload'}
                </p>
                {!isUploading && !isDragActive && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-sm text-slate-500 dark:text-slate-400 mt-2 font-medium max-w-sm"
                    >
                        Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files.
                    </motion.p>
                )}
            </div>
        </motion.div>
    );
};

export default Dropzone;
