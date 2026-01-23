import React, { useState } from 'react';

const FileCard = ({ file, onDelete, onDownload }) => {
    const [imageError, setImageError] = useState(false);

    // Determine if file is an image based on category or extension (simple check)
    const isImage = file.category === 'photos';

    return (
        <div className="bg-slate-800/40 backdrop-blur-sm p-4 rounded-xl border border-slate-700 hover:border-blue-500/50 shadow-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all group relative">
            <div className="h-32 bg-slate-900/50 rounded-lg mb-3 flex items-center justify-center overflow-hidden border border-slate-800 relative">
                {isImage && file.url && !imageError ? (
                    <img
                        src={file.url}
                        alt={file.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        onError={() => setImageError(true)}
                    />
                ) : (
                    <div className="text-4xl animate-bounce-slow">
                        {file.category === 'photos' ? '🖼️' : file.category === 'documents' ? '📄' : '📦'}
                    </div>
                )}
            </div>

            <div>
                <h3 className="font-semibold text-slate-200 truncate" title={file.name}>{file.name}</h3>
                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>

            {/* Hover Actions */}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button
                    onClick={(e) => { e.stopPropagation(); onDownload(file); }}
                    className="p-1.5 bg-slate-700/90 rounded-full shadow hover:bg-blue-600 text-white transition-colors"
                    title="Download"
                >
                    ⬇️
                </button>
                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(file); }}
                    className="p-1.5 bg-slate-700/90 rounded-full shadow hover:bg-red-500 text-white transition-colors"
                    title="Delete"
                >
                    🗑️
                </button>
            </div>
        </div>
    );
};

export default FileCard;
