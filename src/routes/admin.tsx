import { createFileRoute, Link } from '@tanstack/react-router'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useState, useRef } from 'react'
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react"
import { useAuthActions } from "@convex-dev/auth/react"
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { X, Music as MusicIcon, Image as ImageIcon, Loader2, Send } from 'lucide-react'
import { getPublicUrl } from '../lib/utils'
import { useAction } from 'convex/react'

export const Route = createFileRoute('/admin')({
  component: AdminPage,
})

function AdminPage() {
  return (
    <>
      <AuthLoading>
        <div className="min-h-screen bg-black flex items-center justify-center font-serif">
          <div className="text-[#C6A15B] animate-pulse uppercase tracking-widest text-xs">Verifying Session...</div>
        </div>
      </AuthLoading>
      <Unauthenticated>
        <div className="min-h-screen bg-[#080808] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#0c0c0c] p-12 border border-[#C6A15B]/20 shadow-2xl">
            <h1 className="text-3xl font-serif text-[#C6A15B] mb-8 text-center italic">Tenshon Admin Access</h1>
            <AuthForm />
          </div>
        </div>
      </Unauthenticated>
      <Authenticated>
        <AdminDashboard />
      </Authenticated>
    </>
  )
}

function AuthForm() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"email" | { email: string }>("email");
  const [error, setError] = useState("");

  if (step === "email") {
    return (
      <form
        key="email-step"
        className="space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          setError("");
          const formData = new FormData(e.currentTarget);
          signIn("resend-otp", formData)
            .then(() => setStep({ email: formData.get("email") as string }))
            .catch((err) => setError(err.message));
        }}
      >
        <div>
          <label className="block text-[10px] uppercase tracking-[0.2em] mb-2 text-[#C6A15B]/60 font-sans">Enter Management Email</label>
          <input
            name="email"
            type="email"
            placeholder="management@tenshon.shop"
            autoFocus
            required
            className="w-full bg-black border border-[#C6A15B]/10 px-4 py-4 text-sm text-[#F5F1E8] focus:border-[#C6A15B] outline-none transition-colors font-sans"
          />
        </div>
        {error && <p className="text-red-500 text-[10px] uppercase tracking-widest font-sans">{error}</p>}
        <button 
          type="submit"
          className="w-full bg-[#C6A15B] text-black py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#D4B57A] transition-all transform hover:-translate-y-1"
        >
          Send Code
        </button>
      </form>
    );
  }

  return (
    <form
      key="code-step"
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        setError("");
        const formData = new FormData(e.currentTarget);
        signIn("resend-otp", formData).catch((err) => setError(err.message));
      }}
    >
      <input name="email" value={step.email} type="hidden" />
      <div>
        <label className="block text-[10px] uppercase tracking-[0.2em] mb-2 text-[#C6A15B]/60 font-sans">Enter Verification Code</label>
        <input
          name="code"
          placeholder="00000000"
          autoComplete="one-time-code"
          inputMode="numeric"
          autoFocus
          required
          className="w-full bg-black border border-[#C6A15B]/10 px-4 py-4 text-sm text-[#F5F1E8] focus:border-[#C6A15B] outline-none transition-colors font-sans"
        />
      </div>
      {error && <p className="text-red-500 text-[10px] uppercase tracking-widest font-sans">{error}</p>}
      <button 
        type="submit"
        className="w-full bg-[#C6A15B] text-black py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#D4B57A] transition-all transform hover:-translate-y-1"
      >
        Verify Identity
      </button>
      <button 
        type="button" 
        onClick={() => setStep("email")}
        className="w-full text-[#C6A15B]/40 uppercase tracking-[0.2em] text-[10px] font-sans hover:text-[#C6A15B] transition-colors"
      >
        ← Back to Email
      </button>
    </form>
  );
}

function AdminDashboard() {
  const { data: releases } = useSuspenseQuery(convexQuery(api.releases.list, {}))
  const { data: events } = useSuspenseQuery(convexQuery(api.events.list, {}))
  const { data: subscribers } = useSuspenseQuery(convexQuery(api.newsletter.list, {}))
  const { data: orders } = useSuspenseQuery(convexQuery(api.orders.list, {}))
  const createRelease = useMutation(api.releases.create)
  const removeRelease = useMutation(api.releases.remove)
  const createEvent = useMutation(api.events.create)
  const removeEvent = useMutation(api.events.remove)
  const generateUploadUrl = useMutation(api.files.generateUploadUrl)
  const { signOut } = useAuthActions()
  const deliverOrder = useAction(api.delivery.deliver)
  const [delivering, setDelivering] = useState<string | null>(null)
  
  const handleDeliver = async (orderId: any) => {
    setDelivering(orderId)
    try {
      console.log("Calling deliverOrder for:", orderId)
      const result = await deliverOrder({ orderId })
      console.log("deliverOrder result:", result)
      alert("Song delivered successfully to customer email.")
    } catch (err) {
      console.error("handleDeliver error:", err)
      alert(err instanceof Error ? err.message : "Delivery failed")
    } finally {
      setDelivering(null)
    }
  }

  const [form, setForm] = useState({
    title: '',
    artist: 'Tenshon',
    year: new Date().getFullYear(),
    coverUrl: '',
    audioUrl: '',
    genres: '',
    description: '',
    price: 15,
    isFeatured: true,
  })

  const [uploadingCover, setUploadingCover] = useState(false)
  const [uploadingAudio, setUploadingAudio] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)
  const audioInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'audio') => {
    const file = e.target.files?.[0]
    if (!file) return

    if (type === 'cover') setUploadingCover(true)
    else setUploadingAudio(true)
    setUploadError(null)

    try {
      const postUrl = await generateUploadUrl()
      console.log('Original upload URL:', postUrl)
      
      // Dynamic URL replacement for sandbox proxy:
      // Instead of relying on env vars which might be stale,
      // we derive the 3210 (Convex) URL from the current 3000 (Vite) URL.
      let finalUrl = postUrl
      if (postUrl.includes('localhost:3210') || postUrl.includes('127.0.0.1:3210')) {
        const currentOrigin = window.location.origin;
        if (currentOrigin.includes('3000-')) {
           const convexOrigin = currentOrigin.replace('3000-', '3210-');
           finalUrl = postUrl
             .replace(/http:\/\/localhost:3210/, convexOrigin)
             .replace(/https:\/\/localhost:3210/, convexOrigin)
             .replace(/http:\/\/127.0.0.1:3210/, convexOrigin)
             .replace(/https:\/\/127.0.0.1:3210/, convexOrigin);
        } else {
           // Fallback to env var if not in standard sandbox URL format
           const convexUrl = import.meta.env.VITE_CONVEX_URL;
           finalUrl = postUrl
             .replace(/http:\/\/localhost:3210/, convexUrl)
             .replace(/https:\/\/localhost:3210/, convexUrl)
             .replace(/http:\/\/127.0.0.1:3210/, convexUrl)
             .replace(/https:\/\/127.0.0.1:3210/, convexUrl);
        }
      }
      
      console.log('Final Upload URL:', finalUrl)
      
      const result = await fetch(finalUrl, {
        method: "POST",
        body: file,
        mode: 'cors', // Explicitly set CORS
      }).catch(err => {
        throw new Error(`Network error: ${err.message}. Ensure the Convex backend is reachable.`);
      })

      if (!result.ok) {
        const errorText = await result.text()
        throw new Error(`Upload failed with status ${result.status}: ${errorText}`)
      }
      
      const { storageId } = await result.json()
      setForm(prev => ({ ...prev, [type === 'cover' ? 'coverUrl' : 'audioUrl']: storageId }))
    } catch (err) {
      console.error(err)
      setUploadError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      if (type === 'cover') setUploadingCover(false)
      else setUploadingAudio(false)
    }
  }

  const [eventForm, setEventForm] = useState({
    date: '',
    venue: '',
    location: '',
    isSoldOut: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.coverUrl) return alert("Please upload cover art")
    
    await createRelease({
      ...form,
      genres: form.genres.split(',').map(g => g.trim()),
    })
    setForm({
      title: '',
      artist: 'Tenshon',
      year: new Date().getFullYear(),
      coverUrl: '',
      audioUrl: '',
      genres: '',
      description: '',
      price: 15,
      isFeatured: true,
    })
    alert('Release added successfully!')
  }

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await createEvent(eventForm)
    setEventForm({
      date: '',
      venue: '',
      location: '',
      isSoldOut: false
    })
    alert('Event added successfully!')
  }

  const handleDelete = async (id: any) => {
    if (confirm('Are you sure you want to remove this release?')) {
      await removeRelease({ id })
    }
  }

  const handleDeleteEvent = async (id: any) => {
    if (confirm('Are you sure you want to remove this event?')) {
      await removeEvent({ id })
    }
  }

  return (
    <div className="min-h-screen bg-black text-[#F5F1E8] p-8 pt-24 pb-32 font-serif">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-serif text-[#C6A15B]">Admin Dashboard</h1>
          <div className="flex items-center gap-6 font-sans">
            <Link to="/" className="text-[10px] uppercase tracking-widest text-[#F5F1E8]/40 hover:text-[#C6A15B] transition-colors italic">View Site</Link>
            <button onClick={() => void signOut()} className="text-[10px] uppercase tracking-widest text-red-500/50 hover:text-red-500 transition-colors">Sign Out</button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column: Forms */}
          <div className="lg:col-span-1 space-y-12">
            <section className="bg-[#0c0c0c] p-8 border border-[#C6A15B]/10">
              <h2 className="text-xl font-serif mb-6 text-[#C6A15B] italic underline decoration-[#C6A15B]/30 underline-offset-8">Add New Release</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] mb-1 text-[#F5F1E8]/60 font-sans">Title</label>
                  <input 
                    type="text" 
                    value={form.title}
                    onChange={e => setForm({...form, title: e.target.value})}
                    className="w-full bg-black border border-[#F5F1E8]/10 px-4 py-3 text-sm focus:border-[#C6A15B] outline-none transition-colors font-sans"
                    placeholder="Midnight Jazz"
                    required
                  />
                </div>
                
                {uploadError && (
                  <div className="bg-red-500/10 border border-red-500/20 p-4 text-red-500 text-[10px] uppercase tracking-widest font-bold">
                    Error: {uploadError}
                  </div>
                )}
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] mb-1 text-[#F5F1E8]/60 font-sans">Year</label>
                    <input 
                      type="number" 
                      value={form.year}
                      onChange={e => setForm({...form, year: parseInt(e.target.value)})}
                      className="w-full bg-black border border-[#F5F1E8]/10 px-4 py-3 text-sm focus:border-[#C6A15B] outline-none transition-colors font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase tracking-[0.2em] mb-1 text-[#F5F1E8]/60 font-sans">Price ($)</label>
                    <input 
                      type="number" 
                      value={form.price}
                      onChange={e => setForm({...form, price: parseInt(e.target.value)})}
                      className="w-full bg-black border border-[#F5F1E8]/10 px-4 py-3 text-sm focus:border-[#C6A15B] outline-none transition-colors font-sans"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                   <div>
                     <label className="block text-[10px] uppercase tracking-[0.2em] mb-2 text-[#F5F1E8]/60 font-sans">Cover Art</label>
                     {form.coverUrl ? (
                        <div className="relative w-24 h-24 group">
                          <img src={getPublicUrl(form.coverUrl)} className="w-full h-full object-cover border border-[#C6A15B]/20" alt="" />
                          <button 
                            type="button"
                            onClick={() => setForm(prev => ({...prev, coverUrl: ''}))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={12} />
                          </button>
                        </div>
                     ) : (
                       <button 
                         type="button"
                         onClick={() => coverInputRef.current?.click()}
                         disabled={uploadingCover}
                         className="w-full border-2 border-dashed border-[#C6A15B]/10 hover:border-[#C6A15B]/30 py-8 flex flex-col items-center gap-2 transition-colors group"
                       >
                         {uploadingCover ? <Loader2 className="animate-spin text-[#C6A15B]" /> : <ImageIcon className="text-[#C6A15B]/30 group-hover:text-[#C6A15B]" />}
                         <span className="text-[10px] uppercase tracking-widest text-[#F5F1E8]/60 font-sans">Upload Image</span>
                       </button>
                     )}
                     <input 
                        type="file" 
                        ref={coverInputRef}
                        className="hidden" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'cover')}
                      />
                   </div>

                   <div>
                     <label className="block text-[10px] uppercase tracking-[0.2em] mb-2 text-[#F5F1E8]/60 font-sans">Audio File</label>
                     {form.audioUrl ? (
                        <div className="flex items-center justify-between bg-[#C6A15B]/5 border border-[#C6A15B]/10 p-3 rounded">
                          <div className="flex items-center gap-2 text-[#C6A15B]">
                            <MusicIcon size={14} />
                            <span className="text-[10px] uppercase tracking-widest font-sans">File Linked</span>
                          </div>
                          <button 
                            type="button"
                            onClick={() => setForm(prev => ({...prev, audioUrl: ''}))}
                            className="text-[#F5F1E8]/60 hover:text-red-500 transition-colors"
                          >
                            <X size={14} />
                          </button>
                        </div>
                     ) : (
                       <button 
                         type="button"
                         onClick={() => audioInputRef.current?.click()}
                         disabled={uploadingAudio}
                         className="w-full border-2 border-dashed border-[#C6A15B]/10 hover:border-[#C6A15B]/30 py-8 flex flex-col items-center gap-2 transition-colors group"
                       >
                         {uploadingAudio ? <Loader2 className="animate-spin text-[#C6A15B]" /> : <MusicIcon className="text-[#C6A15B]/30 group-hover:text-[#C6A15B]" />}
                         <span className="text-[10px] uppercase tracking-widest text-[#F5F1E8]/60 font-sans">Upload Audio</span>
                       </button>
                     )}
                     <input 
                        type="file" 
                        ref={audioInputRef}
                        className="hidden" 
                        accept="audio/*"
                        onChange={(e) => handleFileUpload(e, 'audio')}
                      />
                   </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] mb-1 text-[#F5F1E8]/60 font-sans">Genres</label>
                  <input 
                    type="text" 
                    value={form.genres}
                    onChange={e => setForm({...form, genres: e.target.value})}
                    className="w-full bg-black border border-[#F5F1E8]/10 px-4 py-3 text-sm focus:border-[#C6A15B] outline-none transition-colors font-sans"
                    placeholder="Jazz, Soul, Blues"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] mb-1 text-[#F5F1E8]/60 font-sans">Description</label>
                  <textarea 
                    value={form.description}
                    onChange={e => setForm({...form, description: e.target.value})}
                    className="w-full bg-black border border-[#F5F1E8]/10 px-4 py-3 text-sm focus:border-[#C6A15B] outline-none h-24 resize-none transition-colors font-sans"
                  />
                </div>
                <div className="flex items-center gap-2 py-2">
                  <input 
                    type="checkbox" 
                    id="featured"
                    checked={form.isFeatured}
                    onChange={e => setForm({...form, isFeatured: e.target.checked})}
                    className="accent-[#C6A15B] h-4 w-4"
                  />
                  <label htmlFor="featured" className="text-[10px] uppercase tracking-[0.2em] text-[#F5F1E8]/60 cursor-pointer font-sans">Feature on Homepage</label>
                </div>
                <button 
                  type="submit"
                  disabled={uploadingCover || uploadingAudio}
                  className="w-full bg-[#C6A15B] text-black py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#D4B57A] transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-xl disabled:opacity-50 disabled:transform-none font-sans"
                >
                  Create Release
                </button>
              </form>
            </section>

            <section className="bg-[#0c0c0c] p-8 border border-[#C6A15B]/10">
              <h2 className="text-xl font-serif mb-6 text-[#C6A15B] italic underline decoration-[#C6A15B]/30 underline-offset-8">Add New Event</h2>
              <form onSubmit={handleEventSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] mb-1 text-[#F5F1E8]/60 font-sans">Date (e.g. 24 MAY 2024)</label>
                  <input 
                    type="text" 
                    value={eventForm.date}
                    onChange={e => setEventForm({...eventForm, date: e.target.value})}
                    className="w-full bg-black border border-[#F5F1E8]/10 px-4 py-3 text-sm focus:border-[#C6A15B] outline-none transition-colors font-sans"
                    placeholder="24 MAY 2024"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] mb-1 text-[#F5F1E8]/60 font-sans">Venue</label>
                  <input 
                    type="text" 
                    value={eventForm.venue}
                    onChange={e => setEventForm({...eventForm, venue: e.target.value})}
                    className="w-full bg-black border border-[#F5F1E8]/10 px-4 py-3 text-sm focus:border-[#C6A15B] outline-none transition-colors font-sans"
                    placeholder="Blue Note"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.2em] mb-1 text-[#F5F1E8]/60 font-sans">Location</label>
                  <input 
                    type="text" 
                    value={eventForm.location}
                    onChange={e => setEventForm({...eventForm, location: e.target.value})}
                    className="w-full bg-black border border-[#F5F1E8]/10 px-4 py-3 text-sm focus:border-[#C6A15B] outline-none transition-colors font-sans"
                    placeholder="Kingston, JM"
                    required
                  />
                </div>
                <div className="flex items-center gap-2 py-2">
                  <input 
                    type="checkbox" 
                    id="soldout"
                    checked={eventForm.isSoldOut}
                    onChange={e => setEventForm({...eventForm, isSoldOut: e.target.checked})}
                    className="accent-[#C6A15B] h-4 w-4"
                  />
                  <label htmlFor="soldout" className="text-[10px] uppercase tracking-[0.2em] text-[#F5F1E8]/60 cursor-pointer font-sans">Mark as Sold Out</label>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#C6A15B] text-black py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-[#D4B57A] transition-all transform hover:-translate-y-1 active:translate-y-0 shadow-xl font-sans"
                >
                  Add Event
                </button>
              </form>
            </section>
          </div>

          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-xl font-serif mb-6 text-[#C6A15B] italic underline decoration-[#C6A15B]/30 underline-offset-8">Manage Releases</h2>
              <div className="grid grid-cols-1 gap-4">
                {releases?.map(release => (
                  <div key={release._id} className="bg-[#0c0c0c] p-6 border border-white/5 flex gap-6 items-center group hover:border-[#C6A15B]/20 transition-colors">
                    <div className="relative w-20 h-20 flex-shrink-0 overflow-hidden bg-black border border-white/5">
                      <img src={getPublicUrl(release.coverUrl)} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-serif text-[#F5F1E8]">{release.title}</h3>
                      <p className="text-[10px] text-[#F5F1E8]/40 uppercase tracking-widest flex items-center gap-2 mt-1 font-sans">
                        {release.genres.join(' • ')}
                        <span className="w-1 h-1 rounded-full bg-[#C6A15B]/50" />
                        {release.year}
                      </p>
                      {release.audioUrl && (
                         <p className="text-[9px] text-[#C6A15B]/60 uppercase tracking-widest mt-1 font-sans font-bold">✓ Audio Linked</p>
                      )}
                    </div>
                    <div className="text-right flex flex-col items-end gap-3 font-sans">
                      <div className="text-[#C6A15B] text-lg font-serif">${release.price}</div>
                      <button 
                        onClick={() => handleDelete(release._id)}
                        className="text-[10px] uppercase tracking-widest text-red-500/50 hover:text-red-500 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-serif mb-6 text-[#C6A15B] italic underline decoration-[#C6A15B]/30 underline-offset-8">Manage Events</h2>
              <div className="grid grid-cols-1 gap-4 font-sans text-xs">
                {events?.map(event => (
                  <div key={event._id} className="bg-[#0c0c0c] p-6 border border-white/5 flex gap-6 items-center group hover:border-[#C6A15B]/20 transition-colors">
                    <div className="flex-1">
                      <h3 className="text-base font-serif text-[#F5F1E8] italic">{event.venue}</h3>
                      <p className="text-[#F5F1E8]/40 uppercase tracking-widest mt-1">{event.date} • {event.location}</p>
                    </div>
                    {event.isSoldOut && <span className="text-[9px] text-red-500/50 border border-red-500/20 px-2 py-1 uppercase">Sold Out</span>}
                    <button 
                      onClick={() => handleDeleteEvent(event._id)}
                      className="text-[10px] uppercase tracking-widest text-red-500/50 hover:text-red-500 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-serif mb-6 text-[#C6A15B] italic underline decoration-[#C6A15B]/30 underline-offset-8">Pending Transfers ({orders.length})</h2>
              <div className="grid grid-cols-1 gap-4 font-sans text-xs">
                {orders.map((order: any) => (
                  <div key={order._id} className="bg-[#0c0c0c] p-6 border border-white/5 flex flex-col gap-4 group hover:border-[#C6A15B]/20 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[#C6A15B] font-bold text-sm">${order.amount}</p>
                        <p className="text-[#F5F1E8]">{order.email}</p>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-1 rounded text-[8px] font-bold uppercase tracking-widest ${order.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-green-500/20 text-green-500'}`}>
                          {order.status}
                        </span>
                        {order.delivered && (
                          <span className="text-[8px] text-blue-400 font-bold uppercase tracking-widest flex items-center gap-1">
                            <Send size={8} /> Delivered
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <div className="flex flex-col gap-1">
                        <span className="text-[9px] text-[#F5F1E8]/40 uppercase tracking-widest">Ref: {order.stripeSessionId}</span>
                        <p className="text-[9px] text-[#F5F1E8]/40 uppercase">{new Date(order._creationTime).toLocaleString()}</p>
                      </div>
                      
                      <button
                        onClick={() => handleDeliver(order._id)}
                        disabled={delivering === order._id}
                        className={`flex items-center gap-2 px-4 py-2 rounded-none uppercase text-[9px] font-bold tracking-widest transition-all ${
                          order.delivered 
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20' 
                          : 'bg-[#C6A15B] text-black hover:bg-white'
                        } disabled:opacity-50`}
                      >
                        {delivering === order._id ? (
                          <Loader2 size={10} className="animate-spin" />
                        ) : (
                          <Send size={10} />
                        )}
                        {order.delivered ? 'Send Again' : 'Deliver Song'}
                      </button>
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <div className="bg-[#0c0c0c] p-12 text-center text-[10px] uppercase tracking-widest text-[#F5F1E8]/40 italic border border-white/5">No order initiations yet.</div>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-serif mb-6 text-[#C6A15B] italic underline decoration-[#C6A15B]/30 underline-offset-8">Inner Circle Subscribers ({subscribers.length})</h2>
              <div className="bg-[#0c0c0c] border border-white/5 divide-y divide-white/5 max-h-96 overflow-y-auto font-sans">
                {subscribers.map(sub => (
                  <div key={sub._id} className="p-4 flex justify-between items-center">
                    <span className="text-sm text-[#F5F1E8]/70">{sub.email}</span>
                    <span className="text-[9px] uppercase tracking-widest text-[#F5F1E8]/40">Joined {new Date(sub._creationTime).toLocaleDateString()}</span>
                  </div>
                ))}
                {subscribers.length === 0 && (
                  <div className="p-12 text-center text-[10px] uppercase tracking-widest text-[#F5F1E8]/40 italic">No subscribers yet.</div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
