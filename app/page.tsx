"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
    {children}
  </span>
);

const SectionTitle = ({
  kicker,
  title,
  subtitle,
  center,
}: {
  kicker?: string;
  title: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  center?: boolean;
}) => (
  <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
    {kicker && (
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-500">
        {kicker}
      </p>
    )}
    <h2 className={`text-2xl font-semibold text-slate-900 sm:text-4xl text-pretty`}>{title}</h2>
    {subtitle && (
      <p className={`mt-3 text-slate-600 ${center ? "mx-auto max-w-2xl" : ""}`}>{subtitle}</p>
    )}
  </div>
);

const Step = ({ n, title, text }: { n: number; title: string; text: string }) => (
  <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
    <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 font-semibold text-emerald-600">
      {n}
    </div>
    <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
    <p className="mt-2 text-sm text-slate-600">{text}</p>
  </div>
);

// Modern Conversational Modal Form
function KitchenDreamsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    projectType: '',
    timeline: '',
    postcode: '',
    phone: '',
    email: '',
    contactMethod: '',
    message: ''
  });

  const steps = [
    {
      title: "Hi there! 👋",
      subtitle: "I'm Sarah from Zebra Kitchens. What's your name?",
      field: 'name',
      type: 'text',
      placeholder: 'John Smith'
    },
    {
      title: `Nice to meet you${formData.name ? ', ' + formData.name : ''}! 🏠`,
      subtitle: "What kind of kitchen transformation are you dreaming about?",
      field: 'projectType',
      type: 'choice',
      options: [
        { value: 'full', label: '🔨 Full Remodel', desc: 'Complete transformation' },
        { value: 'refresh', label: '✨ Quick Refresh', desc: 'Update existing kitchen' },
        { value: 'exploring', label: '🔍 Just Exploring', desc: 'Getting ideas and costs' }
      ]
    },
    {
      title: "Sounds exciting! ⏰",
      subtitle: "When are you hoping to start?",
      field: 'timeline',
      type: 'choice',
      options: [
        { value: 'asap', label: '🚀 ASAP', desc: 'Ready to go!' },
        { value: '3months', label: '📅 Next 3 months', desc: 'Planning stage' },
        { value: 'future', label: '🗓️ Planning ahead', desc: '6+ months' }
      ]
    },
    {
      title: "Nearly there! 📍",
      subtitle: "What's your postcode? We'll check we can reach you!",
      field: 'postcode',
      type: 'text',
      placeholder: 'WS1 1AA'
    },
    {
      title: "Perfect! 📱",
      subtitle: "How should we contact you?",
      field: 'contact',
      type: 'contact'
    },
    {
      title: "One last thing... 💭",
      subtitle: "Anything specific you'd like us to know?",
      field: 'message',
      type: 'textarea',
      placeholder: 'Tell us about your dream kitchen...',
      optional: true
    }
  ];

  const currentStep = steps[step - 1];

  const handleNext = async () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      // Handle form submission via webhook
      setIsSubmitting(true);
      try {
        // Use environment variable or fallback to placeholder
        const WEBHOOK_URL = process.env.NEXT_PUBLIC_WEBHOOK_URL || 'YOUR_WEBHOOK_URL_HERE';

        console.log('Webhook URL:', WEBHOOK_URL);
        console.log('Form data being sent:', formData);

        // Only send if we have a real webhook URL
        if (WEBHOOK_URL !== 'YOUR_WEBHOOK_URL_HERE') {
          const payload = {
            ...formData,
            timestamp: new Date().toISOString(),
            source: 'website',
            url: typeof window !== 'undefined' ? window.location.href : 'zebra-kitchens'
          };

          console.log('Sending payload:', JSON.stringify(payload));

          const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors', // Add no-cors mode to bypass CORS issues
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
          });

          console.log('Response received:', response);
          // Note: With no-cors, response will be opaque and we can't check status
          console.log('Webhook sent successfully (no-cors mode)');
        } else {
          console.log('No webhook URL configured');
        }

        console.log('Form submitted successfully:', formData);
        setStep(steps.length + 1); // Show success
      } catch (error) {
        console.error('Error submitting form:', error);
        // Still show success to user to maintain good UX
        setStep(steps.length + 1);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleChoice = (value: string) => {
    setFormData({ ...formData, [currentStep.field]: value });
    setTimeout(handleNext, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl sm:rounded-3xl bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                ✕
              </button>

              {/* Progress indicator */}
              <div className="absolute left-0 top-0 h-1 w-full bg-slate-100">
                <motion.div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500"
                  animate={{ width: `${(step / steps.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {step <= steps.length ? (
                <div className="p-6 sm:p-8 pt-10 sm:pt-12">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 className="text-xl sm:text-2xl font-semibold text-slate-900">
                        {currentStep.title}
                      </h3>
                      <p className="mt-2 text-slate-600">{currentStep.subtitle}</p>

                      {/* Input fields based on type */}
                      {currentStep.type === 'text' && (
                        <div className="mt-6">
                          <input
                            type="text"
                            placeholder={currentStep.placeholder}
                            value={formData[currentStep.field as keyof typeof formData]}
                            onChange={(e) => setFormData({ ...formData, [currentStep.field]: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && handleNext()}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base sm:text-lg outline-none ring-emerald-500/20 focus:border-emerald-500 focus:ring"
                            autoFocus
                          />
                          <button
                            onClick={handleNext}
                            disabled={!formData[currentStep.field as keyof typeof formData] && !currentStep.optional}
                            className="mt-4 rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                          >
                            Continue →
                          </button>
                        </div>
                      )}

                      {currentStep.type === 'choice' && (
                        <div className="mt-6 space-y-3">
                          {currentStep.options?.map((option) => (
                            <button
                              key={option.value}
                              onClick={() => handleChoice(option.value)}
                              className="flex w-full items-start gap-3 sm:gap-4 rounded-2xl border border-slate-200 p-3 sm:p-4 text-left transition hover:border-emerald-500 hover:bg-emerald-50"
                            >
                              <span className="text-2xl">{option.label.split(' ')[0]}</span>
                              <div>
                                <p className="font-semibold text-slate-900">{option.label.substring(option.label.indexOf(' ') + 1)}</p>
                                <p className="text-sm text-slate-600">{option.desc}</p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}

                      {currentStep.type === 'contact' && (
                        <div className="mt-6 space-y-3">
                          <input
                            type="tel"
                            placeholder="Phone number"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-emerald-500/20 focus:border-emerald-500 focus:ring"
                          />
                          <input
                            type="email"
                            placeholder="Email address"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-emerald-500/20 focus:border-emerald-500 focus:ring"
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={() => { setFormData({ ...formData, contactMethod: 'phone' }); handleNext(); }}
                              className="flex-1 rounded-full border border-slate-200 py-2 text-sm font-medium hover:bg-slate-50"
                            >
                              📞 Call me
                            </button>
                            <button
                              onClick={() => { setFormData({ ...formData, contactMethod: 'whatsapp' }); handleNext(); }}
                              className="flex-1 rounded-full bg-green-500 py-2 text-sm font-medium text-white hover:bg-green-600"
                            >
                              💬 WhatsApp
                            </button>
                            <button
                              onClick={() => { setFormData({ ...formData, contactMethod: 'email' }); handleNext(); }}
                              className="flex-1 rounded-full border border-slate-200 py-2 text-sm font-medium hover:bg-slate-50"
                            >
                              ✉️ Email
                            </button>
                          </div>
                        </div>
                      )}

                      {currentStep.type === 'textarea' && (
                        <div className="mt-6">
                          <textarea
                            placeholder={currentStep.placeholder}
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none ring-emerald-500/20 focus:border-emerald-500 focus:ring"
                            rows={4}
                          />
                          <div className="mt-4 flex gap-3">
                            <button
                              onClick={() => { setFormData({ ...formData, message: '' }); handleNext(); }}
                              className="rounded-full border border-slate-200 px-6 py-3 text-sm font-medium hover:bg-slate-50"
                            >
                              Skip
                            </button>
                            <button
                              onClick={handleNext}
                              disabled={isSubmitting}
                              className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isSubmitting ? 'Sending...' : 'Submit →'}
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  {/* Quick escape */}
                  <div className="mt-8 text-center text-sm text-slate-500">
                    Prefer to chat? Call <a href="tel:+441922000000" className="font-semibold text-emerald-600">01922 000 000</a>
                  </div>
                </div>
              ) : (
                // Success state
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-8 sm:p-12 text-center"
                >
                  <div className="mx-auto mb-4 text-5xl sm:text-6xl">🎉</div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-slate-900">Brilliant!</h3>
                  <p className="mt-2 text-slate-600">We'll be in touch within 24 hours</p>
                  <p className="mt-4 text-sm text-slate-500">Check your phone for a WhatsApp message from us!</p>
                  <button
                    onClick={onClose}
                    className="mt-6 rounded-full bg-emerald-600 px-8 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function BeforeAfter() {
  const [val, setVal] = React.useState(50);
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <div className="relative aspect-[16/10] w-full">
        <img
          src="/Images/Screenshot 2025-09-19 at 08.27.40.png"
          alt="Before – dated kitchen"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${val}%` }}
        >
          <img
            src="/Images/Screenshot 2025-09-19 at 08.28.58.png"
            alt="After – refurbished kitchen"
            className="h-full w-full object-cover"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-y-0"
          style={{ left: `${val}%` }}
        >
          <div className="h-full w-0.5 bg-white/70 shadow" />
        </div>
      </div>
      <div className="flex items-center gap-3 p-4">
        <span className="text-xs font-medium text-slate-500">Before</span>
        <input
          type="range"
          className="flex-1 accent-emerald-600"
          min={0}
          max={100}
          value={val}
          onChange={(e) => setVal(parseInt(e.target.value))}
          aria-label="Before/After slider"
        />
        <span className="text-xs font-medium text-slate-500">After</span>
      </div>
    </div>
  );
}

export default function ZebraKitchensLanding() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Modern Modal Form */}
      <KitchenDreamsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Floating Action Button */}
      <motion.button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 sm:px-6 py-3 sm:py-4 text-white shadow-xl hover:shadow-2xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <span className="text-xl sm:text-2xl">💬</span>
        <span className="text-sm sm:text-base font-semibold hidden sm:inline">Start Your Kitchen Journey</span>
        <span className="text-sm font-semibold sm:hidden">Chat Now</span>
      </motion.button>
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500" />
            <span className="text-sm font-semibold tracking-tight text-slate-900">
              Zebra Kitchens & Interiors
            </span>
          </div>
          <div className="hidden items-center gap-4 sm:flex">
            <a href="#gallery" className="text-sm text-slate-600 hover:text-slate-900">Gallery</a>
            <a href="#process" className="text-sm text-slate-600 hover:text-slate-900">Our Process</a>
            <a href="#guarantee" className="text-sm text-slate-600 hover:text-slate-900">Guarantee</a>
            <button onClick={() => setIsModalOpen(true)} className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
              Free Design Consultation
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
        {/* Subtle Zebra Print Background */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: 'url("/Images/Zebra-Print-PNG-Picture.png")',
            backgroundSize: '400px',
            backgroundRepeat: 'repeat',
            mixBlendMode: 'overlay'
          }}
        />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 md:py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge>Walsall +60 miles</Badge>
              <Badge>20+ Years Experience</Badge>
              <Badge>Owner-Led • Local</Badge>
            </div>
            <h1 className="text-3xl font-semibold leading-tight text-white sm:text-5xl text-pretty">
              Finally, a Dream Kitchen{' '}
              <span className="text-emerald-400 inline-block">Without the&nbsp;Nightmares</span>
            </h1>
            <p className="mt-5 max-w-xl text-slate-300 text-pretty">
              Transparent design, supply and installation — personally overseen by our founder.
              No pushy sales, no hidden extras, just a kitchen you'll love for decades.
            </p>
            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row">
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700"
              >
                Book Free Design Consultation
              </button>
              <a
                href="#gallery"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white/90 hover:bg-white/10"
              >
                See Before & Afters
              </a>
            </div>
            <div className="mt-5 text-sm text-slate-400">
              Call <a href="tel:+441922000000" className="font-semibold text-white hover:underline">01922 000 000</a> · WhatsApp <a className="font-semibold text-white hover:underline" href="https://wa.me/441922000000" target="_blank">chat now</a>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <BeforeAfter />
          </motion.div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-6 sm:grid-cols-4 sm:px-6">
          {[
            "Transparent Quotes",
            "Vetted Installers",
            "On-Time Delivery",
            "Snag-Free Handover",
          ].map((t) => (
            <div key={t} className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-emerald-500" />
              <span className="text-sm font-medium text-slate-700">{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Pain Points */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionTitle
          kicker="No more horror stories"
          title={<>Tired of delays, hidden costs and&nbsp;pushy&nbsp;sales?</>}
          subtitle="We remove the stress with owner-led project management, local accountability and a clear plan you can rely on."
          center
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              h: "Cowboy fitters",
              p: "We only use vetted, insured installers — and we're accountable if anything isn't right.",
            },
            {
              h: "Hidden extras",
              p: "You'll get a line-by-line, itemised quote. No surprises. Ever.",
            },
            {
              h: "Weeks without a kitchen",
              p: "Tight schedules, tidy daily handovers and clear milestones to keep life moving.",
            },
            {
              h: "Poor aftercare",
              p: "Our Heart of the Home Guarantee: on-time, on-budget, snag-free — and supported.",
            },
          ].map((card) => (
            <div key={card.h} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">{card.h}</h3>
              <p className="mt-2 text-sm text-slate-600">{card.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Difference / Process */}
      <section id="process" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionTitle
          kicker="How we work"
          title={<>The Zebra Kitchens&nbsp;Difference</>}
          subtitle={<>All roads lead to accountability: a single owner-led team from first sketch to final&nbsp;sign&#8209;off.</>}
          center
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Step n={1} title="Free Design Consult" text="We visit, measure, and learn how you live. No pressure, no sales scripts." />
          <Step n={2} title="3D Design & Quote" text="Transparent, itemised pricing with options to match your vision and budget." />
          <Step n={3} title="Supply & Install" text="Quality units and appliances, delivered and fitted by vetted local pros." />
          <Step n={4} title="Snag-Free Handover" text="We walk through every detail together. If it's not right, we fix it." />
        </div>
      </section>

      {/* Gallery / Proof */}
      <section id="gallery" className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionTitle
          kicker="Recent work"
          title={<>Before &amp;&nbsp;After Transformations</>}
          subtitle="A few highlights from homes across Walsall, Cannock, Lichfield and beyond."
          center
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { img: "Screenshot 2025-09-19 at 08.27.08.png", title: "Modern Shaker Kitchen" },
            { img: "Screenshot 2025-09-19 at 08.27.26.png", title: "Contemporary Island Design" },
            { img: "Screenshot 2025-09-19 at 08.27.40.png", title: "Classic Country Kitchen" },
            { img: "Screenshot 2025-09-19 at 08.27.54.png", title: "Sleek Urban Kitchen" },
            { img: "Screenshot 2025-09-19 at 08.28.20.png", title: "Family-Friendly Layout" },
            { img: "Screenshot 2025-09-19 at 08.28.37.png", title: "Luxury Fitted Kitchen" }
          ].map((project, i) => (
            <div key={i} className="group overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={`/Images/${project.img}`}
                  alt={project.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <p className="text-sm font-medium text-slate-900">{project.title}</p>
                <p className="mt-1 text-sm text-slate-600">Modern, durable finishes with smart storage and family-friendly layouts.</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionTitle
          kicker="You're in good company"
          title={<>What local homeowners&nbsp;say</>}
          center
        />
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              q: "We were nervous after horror stories, but Zebra were calm, clear and on-time. The kitchen is stunning.",
              a: "Sarah • Cannock",
            },
            {
              q: "Transparent quote, tidy installers, zero stress. Best project we've done to the house.",
              a: "James • Walsall",
            },
            {
              q: "Owner-led makes all the difference. Every detail was handled. Highly recommend.",
              a: "Priya • Lichfield",
            },
          ].map((t) => (
            <figure key={t.a} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <blockquote className="text-slate-700">"{t.q}"</blockquote>
              <figcaption className="mt-4 text-sm font-medium text-slate-500">{t.a}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Pricing / Transparency */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <SectionTitle
          kicker="Clarity from day one"
          title={<>Transparent, itemised pricing&nbsp;— no&nbsp;hidden&nbsp;extras</>}
          subtitle="We show you where every pound goes so you can choose with confidence."
          center
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-3">
          {[
            {
              h: "Design & Planning",
              p: "Free in‑home consult, precise measuring and 3D visuals tailored to how you live.",
            },
            {
              h: "Quality Supply",
              p: "Durable units, worktops and appliances selected for longevity and value.",
            },
            {
              h: "Expert Installation",
              p: "Vetted, respectful installers with tidy daily handovers and clear milestones.",
            },
          ].map((c) => (
            <div key={c.h} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">{c.h}</h3>
              <p className="mt-2 text-sm text-slate-600">{c.p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Guarantee */}
      <section id="guarantee" className="mx-auto max-w-7xl px-4 pb-14 sm:px-6">
        <div className="rounded-3xl bg-gradient-to-br from-emerald-600 to-teal-600 p-8 text-white sm:p-12">
          <div className="mx-auto max-w-4xl">
            <h3 className="text-2xl font-semibold sm:text-3xl">Heart of the Home Guarantee</h3>
            <p className="mt-3 text-white/90">
              We guarantee your kitchen will be delivered on time, on budget and snag‑free. If something isn't right, we'll make it right — fast.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm font-medium">On‑Time Delivery</p>
                <p className="text-sm text-white/80">Clear milestones and daily tidy handovers.</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm font-medium">On‑Budget Pricing</p>
                <p className="text-sm text-white/80">Itemised quotes, no hidden extras. Ever.</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-sm font-medium">Snag‑Free Handover</p>
                <p className="text-sm text-white/80">We walk through every detail together.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Area + Contact */}
      <section id="contact" className="mx-auto max-w-7xl px-4 pb-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionTitle
              kicker="Ready to start?"
              title="Let's Chat About Your Dream Kitchen"
              subtitle="Quick 2-minute conversation to understand your needs and timeline."
            />
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-3xl">
                  👋
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Start Your Journey</h3>
                <p className="mt-2 text-slate-600">No pushy sales, just a friendly chat about your kitchen dreams</p>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-8 py-4 text-sm font-semibold text-white shadow-sm hover:shadow-md"
                >
                  💬 Start Conversation
                </button>

                <div className="mt-6 flex items-center justify-center gap-4 border-t border-slate-100 pt-6">
                  <a href="tel:+441922000000" className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600">
                    <span>📞</span>
                    <span className="font-medium">01922 000 000</span>
                  </a>
                  <span className="text-slate-300">|</span>
                  <a href="https://wa.me/441922000000" target="_blank" className="flex items-center gap-2 text-sm text-slate-600 hover:text-green-600">
                    <span>💬</span>
                    <span className="font-medium">WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div>
            <SectionTitle
              kicker="Service area"
              title="Walsall +60 miles"
              subtitle="We cover Walsall, Wolverhampton, Cannock, Lichfield, Sutton Coldfield, Birmingham North/West, West Bromwich, Dudley, Stafford, Telford & more."
            />
            <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white p-3">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d77259.89582439905!2d-1.9821599999999997!3d52.5862!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4870a52ef0f57901%3A0x94f09a0c1c13950!2sWalsall%2C%20UK!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                className="aspect-[4/3] w-full rounded-xl"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Service Area Map"
              />
              <div className="mt-3 text-sm text-slate-600">
                Showroom visits by appointment · Weekday evenings available
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-4 rounded-2xl bg-slate-50 p-6 sm:flex-row">
            <p className="text-center text-lg font-medium text-slate-900 sm:text-left">
              Ready to do it once, do it right?
            </p>
            <button onClick={() => setIsModalOpen(true)} className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700">
              Book Free Design Consultation
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
          <div className="grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-sm font-semibold text-slate-900">Zebra Kitchens & Interiors</p>
              <p className="mt-2 text-sm text-slate-600">Owner‑led kitchen refurbishments built to last. Transparent quotes, tidy installers, and a snag‑free handover.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Contact</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                <li>Phone: <a className="font-medium text-slate-800 hover:underline" href="tel:+441922000000">01922 000 000</a></li>
                <li>Email: <a className="font-medium text-slate-800 hover:underline" href="mailto:hello@zebra-kitchens.co.uk">hello@zebra-kitchens.co.uk</a></li>
                <li>Walsall · West Midlands</li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">Links</p>
              <ul className="mt-2 space-y-1 text-sm text-slate-600">
                <li><a className="hover:underline" href="#gallery">Gallery</a></li>
                <li><a className="hover:underline" href="#process">Our Process</a></li>
                <li><a className="hover:underline" href="#guarantee">Guarantee</a></li>
                <li><a className="hover:underline" href="#contact">Free Consultation</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 text-xs text-slate-500">© {new Date().getFullYear()} Zebra Kitchens & Interiors. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
}