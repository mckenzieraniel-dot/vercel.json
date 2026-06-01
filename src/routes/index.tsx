import { createFileRoute, Link } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'
import { motion } from 'framer-motion'
import { Play, ArrowRight, Music, Globe, Mail, ShoppingBag } from 'lucide-react'
import { useMusic } from '../context/MusicContext'
import { getPublicUrl } from '../lib/utils'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {
  const { data: releases } = useSuspenseQuery(convexQuery(api.releases.list, {}))
  const { playTrack } = useMusic()

  const latestRelease = releases.length > 0 ? releases[0] : null;

  return (
    <div className="min-h-screen bg-background text-cream font-sans selection:bg-gold selection:text-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-black relative">
            {/* 
              A placeholder that captures the dramatic stage performer vibe.
              User can replace this with their specific background image.
            */}
            <img 
              src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=2000" 
              className="w-full h-full object-cover opacity-40 animate-slow-zoom"
              alt="Tenshon Performing"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />
            <div className="absolute inset-0 bg-gold/5 mix-blend-color" />
          </div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-gold tracking-[0.8em] text-[10px] md:text-xs font-bold mb-8 uppercase block opacity-80">
              TENSHON.SHOP • Kingston Jamaica
            </span>
            
            <h1 className="text-[14vw] md:text-[12vw] font-serif font-black mb-0 tracking-tighter leading-none text-white uppercase drop-shadow-2xl italic">
              TEN<span className="text-gold">SHON</span>
            </h1>
            
            <p className="text-xl md:text-4xl italic text-gold/80 mb-16 font-serif tracking-tight drop-shadow-lg max-w-3xl mx-auto leading-relaxed">
              "The soul is a frequency we're all trying to catch."
            </p>

            <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
              {latestRelease && (
                <Link 
                  to="/checkout/$releaseId"
                  params={{ releaseId: latestRelease._id }}
                  className="bg-gold text-background px-16 py-6 rounded-none font-bold hover:bg-white transition-all flex items-center gap-4 group tracking-[0.4em] uppercase text-[10px] border border-gold hover:border-white shadow-[0_0_50px_rgba(198,161,91,0.2)]"
                >
                  Purchase Master <ShoppingBag size={18} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
              
              <button 
                onClick={() => {
                  if (latestRelease) {
                    playTrack({ 
                      id: latestRelease._id, 
                      title: latestRelease.title, 
                      artist: "Tenshon", 
                      coverUrl: getPublicUrl(latestRelease.coverUrl), 
                      audioUrl: getPublicUrl(latestRelease.audioUrl || '') 
                    });
                  }
                }}
                className="bg-transparent text-gold border border-gold/40 hover:border-gold px-16 py-6 rounded-none font-bold transition-all flex items-center gap-4 tracking-[0.4em] uppercase text-[10px] group"
              >
                Listen Latest <Play size={16} fill="currentColor" className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-6 opacity-40">
          <span className="text-[9px] tracking-[0.6em] uppercase font-bold text-gold">Explore</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-gold to-transparent" />
        </div>
      </section>

      {/* Featured Releases */}
      <section id="music" className="py-48 px-4 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-16 border-l border-gold/20 pl-12">
          <div>
            <span className="text-gold text-[10px] font-bold tracking-[0.5em] uppercase block mb-6">The Master Collection</span>
            <h2 className="text-7xl md:text-9xl font-serif font-bold italic leading-[0.8] text-cream">Featured <br/><span className="text-gold">Works</span></h2>
          </div>
          <div className="space-y-8">
            <p className="text-gold/60 max-w-md font-serif text-2xl leading-relaxed italic">
              Hand-selected compositions, captured in pure analog warmth. Frequency is the bridge between heart and sound.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24 mb-48">
          {releases.map((release, i) => (
            <motion.div 
              key={release._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-12 bg-surface ring-1 ring-gold/10 group-hover:ring-gold/30 transition-all duration-1000">
                <img 
                  src={getPublicUrl(release.coverUrl)} 
                  alt={release.title}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000 ease-out"
                />
                <div className="absolute inset-0 bg-background/90 opacity-0 group-hover:opacity-100 transition-all duration-700 flex items-center justify-center backdrop-blur-sm">
                  <button 
                    onClick={() => playTrack({ 
                      id: release._id, 
                      title: release.title, 
                      artist: "Tenshon", 
                      coverUrl: getPublicUrl(release.coverUrl), 
                      audioUrl: getPublicUrl(release.audioUrl || '') 
                    })}
                    className="w-24 h-24 rounded-full border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-black transition-all hover:scale-110 shadow-2xl"
                  >
                    <Play size={32} fill="currentColor" />
                  </button>
                </div>
                <div className="absolute top-0 right-0 bg-gold text-background text-[10px] font-bold px-6 py-3 tracking-[0.3em] uppercase shadow-2xl">
                  ${release.price} USD
                </div>
              </div>
              
              <div className="flex flex-col gap-10">
                <div className="border-b border-gold/10 pb-8">
                  <h3 className="text-4xl font-serif font-bold mb-4 group-hover:text-gold transition-colors italic tracking-tight">{release.title}</h3>
                  <div className="flex items-center gap-4 text-gold/40 text-[10px] font-bold uppercase tracking-[0.4em]">
                    <span>{release.genres.join(' • ')}</span>
                    <span className="w-1.5 h-1.5 bg-gold/20 rounded-full" />
                    <span>{release.year}</span>
                  </div>
                </div>
                
                <Link 
                  to="/checkout/$releaseId"
                  params={{ releaseId: release._id }}
                  className="w-full bg-transparent text-gold hover:bg-gold hover:text-background transition-all py-6 font-bold uppercase text-[9px] tracking-[0.5em] flex items-center justify-center gap-4 border border-gold group"
                >
                  Purchase Master <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tracklist View */}
        <div className="max-w-5xl mx-auto pt-32 border-t border-gold/10">
          <div className="flex justify-between items-center mb-24">
            <h3 className="text-5xl font-serif italic text-gold">The Recordings</h3>
            <span className="text-[9px] font-bold tracking-[0.6em] text-gold/40 uppercase">Frequency Index</span>
          </div>
          <div className="space-y-6">
            {releases.map((release, idx) => (
              <motion.div 
                key={release._id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05, duration: 0.6 }}
                onClick={() => playTrack({ 
                  id: release._id, 
                  title: release.title, 
                  artist: "Tenshon", 
                  coverUrl: getPublicUrl(release.coverUrl), 
                  audioUrl: getPublicUrl(release.audioUrl || '') 
                })}
                className="group flex items-center justify-between py-8 px-12 border border-white/5 hover:border-gold/20 hover:bg-white/[0.01] transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="flex items-center gap-12 relative z-10">
                  <span className="font-serif text-3xl text-gold/20 group-hover:text-gold transition-colors font-black">{(idx + 1).toString().padStart(2, '0')}</span>
                  <div>
                    <h4 className="text-2xl font-serif text-cream group-hover:text-gold transition-colors tracking-tight italic">{release.title}</h4>
                    <p className="text-[9px] font-bold tracking-[0.3em] text-gold/30 uppercase mt-2">{release.genres[0]} • Master Quality</p>
                  </div>
                </div>
                <div className="flex items-center gap-16 relative z-10">
                  <span className="text-[10px] font-bold tracking-[0.4em] text-gold/60 hidden md:block">RECORDED {release.year}</span>
                  <button className="text-gold/20 group-hover:text-gold group-hover:scale-125 transition-all">
                    <Play size={24} fill="currentColor" />
                  </button>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-64 bg-surface/30 relative">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <span className="text-gold text-[10px] font-bold tracking-[1em] uppercase block mb-20 opacity-60">The Artist's Intent</span>
          <h2 className="text-6xl md:text-9xl font-serif font-bold mb-20 italic leading-tight text-white tracking-tighter">
            "Frequency is the currency of the spirit."
          </h2>
          <div className="flex justify-center mb-20">
             <div className="w-40 h-[1px] bg-gold/30" />
          </div>
          <p className="text-gold/60 text-2xl font-serif leading-relaxed max-w-3xl mx-auto italic">
            TENSHON music is designed to be felt as much as heard. Every recording session is a ceremony of sound, 
            blending the rich history of Jamaican jazz with the raw emotion of the blues.
          </p>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-48 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="border border-gold/10 p-20 md:p-40 text-center bg-surface/10 backdrop-blur-3xl relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-full bg-gold/5 mix-blend-overlay opacity-20 pointer-events-none" />
            <h2 className="text-6xl md:text-8xl font-serif font-bold mb-12 text-cream uppercase tracking-tighter italic">The Inner <span className="text-gold underline decoration-gold/20 underline-offset-[20px]">Circle</span></h2>
            <p className="text-gold/60 mb-20 font-serif text-2xl italic max-w-2xl mx-auto">
              Join the guild of refined listeners for exclusive session access and private master links.
            </p>
            <form className="flex flex-col md:flex-row gap-0 max-w-xl mx-auto shadow-[0_30px_100px_rgba(0,0,0,0.5)]" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="YOUR@EMAIL.COM" 
                className="flex-1 bg-black border border-gold/20 px-12 py-7 font-bold text-[10px] focus:outline-none focus:border-gold transition-colors tracking-[0.5em] text-cream"
              />
              <button className="bg-gold text-background px-16 py-7 font-bold hover:bg-white transition-all uppercase text-[10px] tracking-[0.5em] border border-gold">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-40 px-4 bg-background border-t border-gold/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-32">
          <div className="text-center md:text-left">
            <h2 className="text-7xl font-serif font-black mb-8 tracking-tighter text-white italic">TEN<span className="text-gold">SHON</span></h2>
            <p className="text-gold/30 text-[10px] font-bold tracking-[0.6em] uppercase italic">© 2024 TENSHON.SHOP • Kingston Jamaica</p>
          </div>
          
          <div className="flex gap-20">
            <a href="#" className="text-gold/30 hover:text-gold transition-all transform hover:scale-125"><Music size={32} /></a>
            <a href="#" className="text-gold/30 hover:text-gold transition-all transform hover:scale-125"><Globe size={32} /></a>
            <a href="#" className="text-gold/30 hover:text-gold transition-all transform hover:scale-125"><Mail size={32} /></a>
          </div>
          
          <div className="text-gold/40 text-[10px] font-bold tracking-[0.8em] uppercase border-b border-gold/10 pb-6 italic">
            <Link to="/admin" className="hover:text-gold transition-colors">SOUND IS SACRED</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
