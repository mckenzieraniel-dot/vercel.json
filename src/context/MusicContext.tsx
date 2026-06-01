import React, { createContext, useContext, useState, useRef, useEffect } from 'react'

type Track = {
  id: string
  title: string
  artist: string
  coverUrl: string
  audioUrl?: string
}

type MusicContextType = {
  currentTrack: Track | null
  isPlaying: boolean
  playTrack: (track: Track) => void
  togglePlay: () => void
  progress: number
  duration: number
  currentTime: number
}

const MusicContext = createContext<MusicContextType | undefined>(undefined)

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateProgress = () => {
      // Preview limit: Only allow playback up to 30 seconds
      if (audio.currentTime >= 30) {
        audio.currentTime = 0;
        audio.pause();
        setIsPlaying(false);
        return;
      }
      
      setCurrentTime(audio.currentTime)
      setDuration(Math.min(audio.duration || 0, 30)) // Show 30s as max duration in UI
      setProgress((audio.currentTime / 30) * 100 || 0)
    }

    audio.addEventListener('timeupdate', updateProgress)
    audio.addEventListener('ended', () => setIsPlaying(false))
    audio.addEventListener('error', () => {
      console.error("MusicContext: Audio element error:", audio.error)
    })

    return () => {
      audio.removeEventListener('timeupdate', updateProgress)
      audio.pause()
    }
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    if (currentTrack?.audioUrl) {
      console.log("MusicContext: Setting audio src to:", currentTrack.audioUrl)
      // Stop current playback
      audio.pause()
      audio.src = currentTrack.audioUrl
      
      // Attempt to play if isPlaying is true
      if (isPlaying) {
        console.log("MusicContext: Attempting to play...")
        const playPromise = audio.play()
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log("MusicContext: Playback started successfully")
          }).catch(err => {
            console.error("MusicContext: Playback failed:", err)
            // If it failed because of auto-play, we don't necessarily want to set isPlaying to false
            // but for now let's keep the current logic
            setIsPlaying(false)
          })
        }
      }
    } else {
      audio.src = ""
      setIsPlaying(false)
    }
  }, [currentTrack])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !audio.src) {
      console.log("MusicContext: No audio or src, skipping play effect")
      return
    }

    if (isPlaying) {
      console.log("MusicContext: isPlaying is true, calling audio.play()")
      const playPromise = audio.play()
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log("MusicContext: Playback started (isPlaying effect)")
        }).catch(err => {
          console.error("MusicContext: Playback failed (isPlaying effect):", err)
          setIsPlaying(false)
        })
      }
    } else {
      console.log("MusicContext: isPlaying is false, calling audio.pause()")
      audio.pause()
    }
  }, [isPlaying])

  const playTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlay()
    } else {
      setCurrentTrack(track)
      setIsPlaying(true)
    }
  }

  const togglePlay = () => setIsPlaying(!isPlaying)

  return (
    <MusicContext.Provider value={{ currentTrack, isPlaying, playTrack, togglePlay, progress, duration, currentTime }}>
      {children}
      <audio 
        ref={audioRef}
      />
    </MusicContext.Provider>
  )
}

export function useMusic() {
  const context = useContext(MusicContext)
  if (!context) throw new Error('useMusic must be used within MusicProvider')
  return context
}
