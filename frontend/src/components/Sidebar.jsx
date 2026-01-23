import React from 'react';

const Sidebar = ({ activeCategory, setActiveCategory, totalSize = 0 }) => {
    const totalMB = (totalSize / (1024 * 1024)).toFixed(1);
    const percentage = Math.min((totalSize / (1024 * 1024 * 1024 * 100)) * 100, 100); // 100GB limit

    const categories = [
        { id: 'all', label: 'All Files', icon: '📁' },
        { id: 'photos', label: 'Photos', icon: '📷' },
        { id: 'documents', label: 'Documents', icon: '📄' },
        { id: 'others', label: 'Others', icon: '📦' },
    ];

    return (
        <div className="w-64 bg-black/60 backdrop-blur-md border-r border-cyan-500/20 text-white min-h-screen p-6 flex flex-col shadow-[0_0_30px_rgba(0,255,255,0.05)]">
            <h1 className="text-3xl font-extrabold mb-8 flex items-center gap-2 bg-gradient-to-r from-cyan-400 to-fuchsia-400 text-transparent bg-clip-text drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">
                ⚡ Nimbus
            </h1>

            <div className="space-y-4 flex-1">
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 flex items-center gap-3 border ${activeCategory === cat.id
                            ? 'bg-cyan-500/10 border-cyan-500 text-cyan-300 shadow-[0_0_15px_rgba(0,255,255,0.3)]'
                            : 'border-transparent hover:bg-white/5 text-slate-400 hover:text-white'
                            }`}
                    >
                        <span>{cat.icon}</span>
                        <span className="font-medium">{cat.label}</span>
                    </button>
                ))}
            </div>

            {/* Storage Stats */}
            <div className="mt-8 p-4 bg-black/40 rounded-xl border border-fuchsia-500/30 relative overflow-hidden group">
                <div className="absolute inset-0 bg-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex justify-between text-xs text-cyan-200 mb-2 relative z-10">
                    <span>Storage Used</span>
                    <span>{totalMB} MB</span>
                </div>
                <div className="w-full bg-gray-900 rounded-full h-1.5 overflow-hidden relative z-10">
                    <div
                        className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 h-1.5 rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(255,0,255,0.7)]"
                        style={{ width: `${Math.max(percentage, 5)}%` }}
                    ></div>
                </div>
                <p className="text-[10px] text-slate-500 mt-2 text-center relative z-10 font-mono">100 GB TOTAL</p>
            </div>
        </div>
    );
};

export default Sidebar;
