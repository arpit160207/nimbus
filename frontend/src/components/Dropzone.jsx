import React, { useRef } from 'react';

const Dropzone = ({ onDrop }) => {
    const fileInputRef = useRef(null);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onDrop(e.dataTransfer.files);
            e.dataTransfer.clearData();
        }
    };

    const handleClick = () => {
        fileInputRef.current.click();
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            onDrop(e.target.files);
        }
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={handleClick}
            className="border-2 border-dashed border-blue-500/30 bg-blue-500/10 backdrop-blur-sm rounded-xl p-10 text-center cursor-pointer hover:bg-blue-500/20 hover:border-blue-500 transition-all duration-300 relative group"
        >
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
            />
            <div className="text-5xl mb-4 text-blue-400 group-hover:scale-110 transition-transform">☁️</div>
            <p className="font-medium text-blue-300 text-lg">Drag & Drop files here</p>
            <p className="text-sm text-blue-400/60 mt-1">or click to browse</p>
        </div>
    );
};

export default Dropzone;
