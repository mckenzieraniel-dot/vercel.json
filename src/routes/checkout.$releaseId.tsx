import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'
import { useMutation } from 'convex/react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, ChevronLeft, CheckCircle2, Loader2, MessageCircle, Copy, Check } from 'lucide-react'
import { useState } from 'react'
import { getPublicUrl } from '../lib/utils'

export const Route = createFileRoute('/checkout/$releaseId')({
  component: CheckoutPage,
})

function CheckoutPage() {
  const { releaseId } = Route.useParams()
  const navigate = useNavigate()
  const { data: release } = useSuspenseQuery(convexQuery(api.releases.get, { id: releaseId as any }))
  const createOrder = useMutation(api.orders.createOrder)
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle')
  const [email, setEmail] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  if (!release) return <div className="min-h-screen bg-[#080808] flex items-center justify-center text-[#F5F1E8]">Release not found</div>

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return alert("Please enter your email to initiate the order.")
    
    setStatus('processing')
    
    try {
      await createOrder({
        releaseId: release._id,
        email,
        amount: release.price || 0,
        stripeSessionId: `manual_${Date.now()}`
      })
      
      // Simulate a brief delay
      setTimeout(() => {
        setStatus('success')
      }, 1000)
    } catch (err) {
      console.error(err)
      alert("Something went wrong. Please try again.")
      setStatus('idle')
    }
  }

  const isProcessing = status === 'processing'

  return (
    <div className="min-h-screen bg-[#080808] text-[#F5F1E8] font-sans py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-[#C6A15B]/60 hover:text-[#C6A15B] transition-colors mb-12 group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> BACK TO GALLERY
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Product Details */}
          <div className="space-y-8">
            <div className="relative aspect-square w-full max-w-sm mx-auto lg:mx-0 overflow-hidden border border-[#C6A15B]/10">
              <img src={getPublicUrl(release.coverUrl)} className="w-full h-full object-cover grayscale" alt="" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>

            <div className="space-y-4 text-center lg:text-left">
              <span className="text-[#C6A15B] uppercase tracking-[0.3em] text-[10px] font-bold">Official Release</span>
              <h1 className="text-4xl md:text-5xl font-serif">{release.title}</h1>
              <p className="text-[#F5F1E8]/60 text-sm leading-relaxed max-w-md mx-auto lg:mx-0">
                Digital High-Fidelity Master (24-bit/96kHz). Your purchase supports the artist directly and helps fund future sessions.
              </p>
            </div>

            <div className="flex items-center gap-4 py-8 border-y border-white/5">
              <div className="p-3 bg-white/5 rounded-full text-[#C6A15B]">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-sm font-bold">Verified Transfer</h4>
                <p className="text-xs text-white/40">Manual bank verification for secure direct-to-artist support.</p>
              </div>
            </div>
          </div>

          {/* Payment Section - Bank Transfer */}
          <div className="bg-[#0c0c0c] border border-[#C6A15B]/20 p-0 relative overflow-hidden shadow-2xl">
            <AnimatePresence mode="wait">
              {status === 'idle' && (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col h-full"
                >
                  <div className="p-8 lg:p-10 space-y-8">
                    <div className="space-y-4 text-center">
                      <h2 className="text-xl font-bold uppercase tracking-widest text-[#C6A15B]">Payment Instructions</h2>
                      <p className="text-[10px] uppercase tracking-widest text-secondary-text font-sans">Bank Transfer Details</p>
                    </div>

                    <div className="space-y-1 bg-white/[0.02] border border-white/5">
                      {[
                        { label: 'Bank', value: 'Scotia' },
                        { label: 'Branch', value: '20255 St Ann\'s Bay' },
                        { label: 'Account #', value: '802631' },
                        { label: 'Name', value: 'RANNEAL MCKENZIE' },
                      ].map((field) => (
                        <div key={field.label} className="flex justify-between items-center p-4 border-b border-white/5 last:border-0 group">
                          <div>
                            <p className="text-[8px] uppercase tracking-widest text-secondary-text font-sans mb-1">{field.label}</p>
                            <p className="text-sm font-bold font-sans">{field.value}</p>
                          </div>
                          <button 
                            onClick={() => copyToClipboard(field.value, field.label)}
                            className="p-2 text-white/20 hover:text-[#C6A15B] transition-colors"
                          >
                            {copied === field.label ? <Check size={14} /> : <Copy size={14} />}
                          </button>
                        </div>
                      ))}
                      <div className="flex justify-between items-center p-6 bg-[#C6A15B]/5">
                        <span className="text-[10px] uppercase tracking-widest text-secondary-text font-sans font-bold">Total Due</span>
                        <span className="text-2xl font-serif text-[#C6A15B]">${release.price}</span>
                      </div>
                    </div>

                    <div className="bg-[#C6A15B] text-black p-4 text-center">
                      <p className="text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                        <MessageCircle size={14} /> Final Step
                      </p>
                      <p className="text-[10px] font-sans font-medium mt-1 uppercase tracking-tighter">
                        After transfer, WhatsApp your receipt to: <br/>
                        <span className="text-sm font-bold">+1(876) 203-0972</span>
                      </p>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-[0.2em] text-secondary-text font-sans block text-center">Confirmation Email</label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="YOUR@EMAIL.COM"
                          className="w-full bg-white/5 border border-white/10 px-4 py-4 focus:outline-none focus:border-[#C6A15B] transition-all font-sans text-xs text-center uppercase tracking-widest"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isProcessing}
                        className="w-full bg-white text-black py-5 font-bold uppercase tracking-[0.2em] text-xs hover:bg-[#C6A15B] transition-all disabled:opacity-50"
                      >
                        {isProcessing ? 'RECORDING...' : 'I HAVE COMPLETED THE TRANSFER'}
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}

              {status === 'processing' && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-black/95 z-20 flex flex-col items-center justify-center p-12 text-center"
                >
                  <Loader2 className="animate-spin text-[#C6A15B] mb-6" size={48} />
                  <h3 className="text-xl font-serif mb-2 uppercase tracking-widest">Verifying Initiation</h3>
                  <p className="text-[10px] text-white/40 uppercase tracking-[0.3em]">Awaiting secure connection...</p>
                </motion.div>
              )}

              {status === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-[#C6A15B] z-30 flex flex-col items-center justify-center p-8 lg:p-12 text-center text-black"
                >
                  <div className="w-20 h-20 rounded-full border-2 border-black flex items-center justify-center mb-8">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-4xl font-serif mb-6 uppercase tracking-tight">Success</h3>
                  <p className="text-sm font-bold uppercase tracking-[0.1em] mb-12 opacity-90 leading-relaxed max-w-xs mx-auto">
                    We have recorded your order initiation. 
                  </p>
                  
                  <div className="w-full border-t border-black/20 pt-8 space-y-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] font-bold">
                      REQUIRED: SEND RECEIPT TO WHATSAPP
                    </p>
                    <div className="bg-black text-white p-4 font-bold text-lg tracking-widest">
                      +1(876) 203-0972
                    </div>
                  </div>

                  <button
                    onClick={() => navigate({ to: '/' })}
                    className="mt-12 text-black border-b-2 border-black pb-1 font-bold uppercase tracking-widest text-[10px] hover:opacity-50 transition-all"
                  >
                    RETURN TO GALLERY
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
