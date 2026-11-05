import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Lock, Mail, User as UserIcon, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const { login, loginDemo, register, currentUser, logout, setCurrentPage } = useStore();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Field Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!emailRegex.test(email)) {
      errs.email = 'Please enter a valid email address (e.g. name@domain.com).';
    }

    if (!password) {
      errs.password = 'Password is required.';
    } else if (password.length < 6) {
      errs.password = 'Password must be at least 6 characters.';
    }

    if (tab === 'signup') {
      if (!name.trim()) {
        errs.name = 'Full name is required.';
      }
      if (password !== confirmPassword) {
        errs.confirmPassword = 'Passwords do not match.';
      }
      if (!agreeTerms) {
        errs.agreeTerms = 'Please agree to the terms of service.';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (tab === 'signin') {
      login(email, password);
      setCurrentPage('shop');
    } else {
      register(name, email);
      setCurrentPage('shop');
    }
  };

  if (currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-900 dark:text-white font-bold text-xl">
          {currentUser.name.charAt(0)}
        </div>
        <h2 className="text-2xl font-bold font-editorial text-neutral-950 dark:text-white">
          Signed In as {currentUser.name}
        </h2>
        <p className="text-xs text-neutral-500 font-mono">
          {currentUser.email} · {currentUser.role === 'vip' ? 'Nadeem & Co. VIP Member' : 'Standard Member'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={() => {
              setCurrentPage('orders');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex-1 py-2.5 px-4 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold rounded-lg"
          >
            View My Orders
          </button>
          <button
            onClick={logout}
            className="px-4 py-2.5 border border-neutral-300 dark:border-neutral-700 text-rose-500 text-xs font-semibold rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 lg:py-16 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-neutral-400">
          Nadeem &amp; Co. Membership
        </span>
        <h1 className="text-3xl font-bold font-editorial text-neutral-950 dark:text-white">
          {tab === 'signin' ? 'Sign In to Your Account' : 'Create a Nadeem & Co. Account'}
        </h1>
        <p className="text-xs text-neutral-500 max-w-xs mx-auto">
          {tab === 'signin'
            ? 'Access your private commissions, order tracking, and express checkout.'
            : 'Join our private client registry for bespoke releases and lifetime warranty coverage.'}
        </p>
      </div>

      {/* 1-Click Demo Logins */}
      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3 shadow-xs">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-800 dark:text-neutral-200">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Quick 1-Click Demo Evaluation Profiles:</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              loginDemo('customer');
              setCurrentPage('shop');
            }}
            className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-neutral-950 dark:hover:border-white text-left transition-colors"
          >
            <span className="font-semibold block text-neutral-900 dark:text-white truncate">Alex Morgan</span>
            <span className="text-[10px] text-neutral-400 block truncate">Customer Account</span>
          </button>

          <button
            type="button"
            onClick={() => {
              loginDemo('vip');
              setCurrentPage('shop');
            }}
            className="p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-neutral-950 dark:hover:border-white text-left transition-colors"
          >
            <span className="font-semibold block text-neutral-900 dark:text-white truncate">Elena Vance</span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 block truncate font-medium">VIP Member</span>
          </button>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white dark:bg-neutral-900 p-6 sm:p-8 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-xs space-y-6">
        
        {/* Tab switch */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 text-xs font-medium">
          <button
            type="button"
            onClick={() => {
              setTab('signin');
              setErrors({});
            }}
            className={`pb-3 flex-1 text-center relative ${
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
            type="button"
            onClick={() => {
              setTab('signup');
              setErrors({});
            }}
            className={`pb-3 flex-1 text-center relative ${
              tab === 'signup'
                ? 'text-neutral-950 dark:text-white font-semibold'
                : 'text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
            }`}
          >
            Create Account
            {tab === 'signup' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-950 dark:bg-white" />
            )}
          </button>
        </div>

        {/* Validation Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {tab === 'signup' && (
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  placeholder="e.g. Jordan Smith"
                  onChange={e => {
                    setName(e.target.value);
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={`w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border rounded-lg text-neutral-900 dark:text-white focus:outline-hidden ${
                    errors.name ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-700'
                  }`}
                />
                <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.name && <p className="text-[11px] text-rose-500 mt-1">{errors.name}</p>}
            </div>
          )}

          <div>
            <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
              Email Address *
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                placeholder="name@domain.com"
                onChange={e => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                className={`w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border rounded-lg text-neutral-900 dark:text-white focus:outline-hidden ${
                  errors.email ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-700'
                }`}
              />
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {errors.email && <p className="text-[11px] text-rose-500 mt-1">{errors.email}</p>}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-neutral-600 dark:text-neutral-400 font-medium">
                Password *
              </label>
              {tab === 'signin' && (
                <button
                  type="button"
                  onClick={() => alert('Demo reset instructions sent to your email.')}
                  className="text-[11px] text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                placeholder="Minimum 6 characters"
                onChange={e => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                className={`w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border rounded-lg text-neutral-900 dark:text-white focus:outline-hidden ${
                  errors.password ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-700'
                }`}
              />
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
            {errors.password && <p className="text-[11px] text-rose-500 mt-1">{errors.password}</p>}
          </div>

          {tab === 'signup' && (
            <div>
              <label className="block text-neutral-600 dark:text-neutral-400 font-medium mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={confirmPassword}
                  placeholder="Repeat your password"
                  onChange={e => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                  }}
                  className={`w-full pl-9 pr-3 py-2 bg-neutral-50 dark:bg-neutral-800 border rounded-lg text-neutral-900 dark:text-white focus:outline-hidden ${
                    errors.confirmPassword ? 'border-rose-500' : 'border-neutral-200 dark:border-neutral-700'
                  }`}
                />
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              </div>
              {errors.confirmPassword && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          {tab === 'signup' && (
            <div>
              <label className="flex items-center gap-2 cursor-pointer text-neutral-600 dark:text-neutral-400">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                  className="rounded text-neutral-950 focus:ring-0"
                />
                <span>I agree to Nadeem &amp; Co. terms and privacy guidelines</span>
              </label>
              {errors.agreeTerms && (
                <p className="text-[11px] text-rose-500 mt-1">{errors.agreeTerms}</p>
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-sm"
          >
            <span>{tab === 'signin' ? 'Sign In to Nadeem & Co.' : 'Create Account'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

        </form>

      </div>
    </div>
  );
};
