import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';
import { useToast } from '../components/ui/toast';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Parent');
  const [grade, setGrade] = useState('Class 5');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { addToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    addToast('success', 'Message Sent!', 'Our academic support team will respond within 24 hours.');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-xs font-bold">
          <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
          <span>We are Here to Help</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Contact Us
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Have questions about Class 1 to Class 8 curriculum, institutional partnerships, or subscription billing? Reach out to us.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Contact info cards */}
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Email Academic Support</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">support@beyondclassroom.in</p>
            <p className="text-[10px] text-slate-400">Response time: &lt; 24 hours</p>
          </div>

          <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Call / WhatsApp Support</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">+91 800-456-7890</p>
            <p className="text-[10px] text-slate-400">Mon - Sat: 9:00 AM - 7:00 PM IST</p>
          </div>

          <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xl space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Headquarters</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Beyond Classroom Technologies Pvt Ltd</p>
            <p className="text-[10px] text-slate-400">Indiranagar 100ft Road, Bengaluru, KA 560038</p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-xl">
          {submitted ? (
            <div className="p-8 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">Thank You for Reaching Out!</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Your message has been assigned ticket ID <strong className="font-mono text-indigo-600 dark:text-indigo-400">#BC-{Math.floor(100000 + Math.random() * 900000)}</strong>. Our support team will follow up via email shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">Send Us a Direct Message</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Radhika Verma"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Your Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. radhika@example.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">I am a...</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Parent">Parent</option>
                    <option value="Student">Student</option>
                    <option value="Educator">School Educator</option>
                    <option value="Affiliate">Affiliate Partner</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">Target Grade</label>
                  <select
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                  >
                    <option value="Class 1">Class 1 Math</option>
                    <option value="Class 2">Class 2 Math</option>
                    <option value="Class 3">Class 3 Math</option>
                    <option value="Class 4">Class 4 Math</option>
                    <option value="Class 5">Class 5 Math</option>
                    <option value="Class 6">Class 6 Math</option>
                    <option value="Class 7">Class 7 Math</option>
                    <option value="Class 8">Class 8 Math</option>
                    <option value="All Grades">All K-8 Grades</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">How can we help you?</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please describe your query or curriculum requirement..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-amber-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Send Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
