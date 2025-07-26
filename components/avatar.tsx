export function Avatar() {
  return (
    <div className="relative">
      {/* Runic frame glow */}
      <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-30 blur-lg scale-110 animate-pulse"></div>
      {/* Runic frame */}
      <div className="relative w-24 h-24 rounded-full border-4 border-cyan-400 p-1 bg-gradient-to-br from-cyan-400/20 to-transparent">
        {/* Runic decorations */}
        <div className="absolute -top-2 -left-2 w-6 h-6 border-2 border-cyan-400 rounded-full bg-slate-800 flex items-center justify-center">
          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 border-2 border-cyan-400 rounded-full bg-slate-800 flex items-center justify-center">
          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
        </div>
        <div className="absolute -bottom-2 -left-2 w-6 h-6 border-2 border-cyan-400 rounded-full bg-slate-800 flex items-center justify-center">
          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
        </div>
        <div className="absolute -bottom-2 -right-2 w-6 h-6 border-2 border-cyan-400 rounded-full bg-slate-800 flex items-center justify-center">
          <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
        </div>
        
        {/* Avatar image */}
        <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center text-2xl">
          ⚔️
        </div>
      </div>
    </div>
  );
}