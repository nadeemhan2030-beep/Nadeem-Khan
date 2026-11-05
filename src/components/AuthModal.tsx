import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, Lock, Mail, User as UserIcon, Sparkles } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, loginDemo, register } = useStore();
  const [tab, setTab] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === 'signin') {
      login(email, password);
    } else {
      if (!name.trim()) return;
      register(name, email);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="p-6 sm:p-8 pb-4">
          <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">
            Nadeem &amp; Co. Membership
          </span>
          <h3 className="text-xl font-bold text-neutral-950 dark:text-white font-editorial">
            {tab === 'signin' ? 'Welcome Back' : 'Create an Account'}
          </h3>
          <p className="text-xs text-neutral-500 mt-1">
            Access your order history, saved addresses, and express checkout.
          </p>
        </div>

        {/* 1-Click Demo Profiles (For Instant Evaluation) */}
        <div className="px-6 sm:px-8 pb-4">
          <div className="p-3 bg-neutral-50 dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700/80">
            <span className="text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 block mb-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Quick Demo 1-Click Login:
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => loginDemo('customer')}
                className="px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-neutral-950 dark:hover:border-white text-neutral-800 dark:text-neutral-200 text-left transition-colors"
              >
                <div className="font-semibold truncate">Alex Morgan</div>
                <div className="text-[10px] text-neutral-400 truncate">Standard Customer</div>
              </button>

              <button
                type="button"
                onClick={() => loginDemo('vip')}
                className="px-2.5 py-1.5 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:border-neutral-950 dark:hover:border-white text-neutral-800 dark:text-neutral-200 text-left transition-colors"
              >
                <div className="font-semibold truncate">Elena Vance</div>
                <div className="text-[10px] text-amber-600 dark:text-amber-400 font-medium truncate">VIP Nadeem &amp; Co. Member</div>
              </button>
            </div>
          </div>
        </div>

        {/* Tab switch */}
        <div className="px-6 sm:px-8 flex border-b border-neutral-100 dark:border-neutral-800 text-xs font-medium">
          <button
            onClick={() => setTab('signin')}
            className={`pb-2.5 mr-6 relative ${
              tab === 'signin'
                ? 'text-neutral-950 dark:text-white font-semibold'
                : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Sign In
            {tab === 'signin' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 dark:bg-white" />
            )}
          </button>

          <button
            onClick={() => setTab('register')}
            className={`pb-2.5 relative ${
              tab === 'register'
                ? 'text-neutral-950 dark:text-white font-semibold'
                : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Register
            {tab === 'register' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 dark:bg-white" />
            )}
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 text-xs">
          {tab === 'register' && (
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Your Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Smith"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-neutral-950"
                />
                <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="you@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-neutral-950"
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-neutral-600 dark:text-neutral-400 font-medium">
                Password
              </label>
              {tab === 'signin' && (
                <button
                  type="button"
                  onClick={() => alert('Demo password reset link has been dispatched to your email.')}
                  className="text-[11px] text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-neutral-900 dark:text-neutral-100 focus:outline-hidden focus:border-neutral-950"
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold rounded-lg hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-colors shadow-sm"
          >
            {tab === 'signin' ? 'Sign In to Nadeem & Co.' : 'Create My Account'}
          </button>
        </form>

      </div>
    </div>
  );
};
