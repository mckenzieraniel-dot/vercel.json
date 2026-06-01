import { useMusic } from '../context/MusicContext'

export function MusicPlayer() {
  const { currentTrack, isPlaying, togglePlay, progress, duration, currentTime } = useMusic()

  if (!currentTrack) return null

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return '0:00'
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="fixed bottom-0 left-0 w-full z-[100] bg-surface/95 backdrop-blur-xl border-t border-gold/10 px-8 py-4 animate-slide-up">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        {/* Track Info */}
        <div className="flex items-center gap-4 min-w-[200px]">
          <img src={currentTrack.coverUrl} className="w-12 h-12 object-cover rounded shadow-lg" alt="" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-serif truncate text-cream">{currentTrack.title}</h4>
              <span className="bg-gold/10 text-gold text-[7px] px-1.5 py-0.5 border border-gold/20 font-bold uppercase tracking-tighter">Preview</span>
            </div>
            <p className="text-[10px] uppercase tracking-widest text-gold truncate">{currentTrack.artist}</p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex-1 max-w-2xl flex flex-col items-center gap-2">
          <div className="flex items-center gap-6">
            <button className="text-cream/50 hover:text-gold transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                <path d="M6 6h2v12H6V6zm3.5 6 8.5 6V6l-8.5 6z" />
              </svg>
            </button>
            
            <button 
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-background hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button className="text-cream/50 hover:text-gold transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
                <path d="m6 18 8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>

          <div className="w-full flex items-center gap-3">
            <span className="text-[10px] text-cream/40 font-mono">{formatTime(currentTime)}</span>
            <div className="flex-1 h-1 bg-cream/10 rounded-full relative overflow-hidden group cursor-pointer">
              <div 
                className="absolute top-0 left-0 h-full bg-gold transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] text-cream/40 font-mono">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume/Extras */}
        <div className="flex items-center gap-4 min-w-[200px] justify-end">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-cream/40">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
          </svg>
          <div className="w-24 h-1 bg-cream/10 rounded-full">
            <div className="w-2/3 h-1 bg-gold rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}
