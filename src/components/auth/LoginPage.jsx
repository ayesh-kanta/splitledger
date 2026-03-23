import { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { LogIn, Mail, Lock, Chrome } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Spinner from '../ui/Spinner';

export default function LoginPage() {
  const { logIn, googleSignIn } = useAuth();
  const [email, setEmail] = useState('ayeshkantadas@gmail.com');
  const [password, setPassword] = useState('Mamata@2004');
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Please fill in all fields');
    try {
      setLoading(true);
      await logIn(email, password);
    } catch (err) {
      const msg = err.code === 'auth/invalid-credential' ? 'Invalid email or password' : err.message;
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setGLoading(true);
      await googleSignIn();
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') toast.error(err.message);
    } finally {
      setGLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-4">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 mb-4">
            <span className="text-2xl">₹</span>
          </div>
          <h1 className="text-2xl font-bold text-white">SplitLedger</h1>
          <p className="text-sm text-slate-400 mt-1">Track expenses across devices, in real-time</p>
        </div>

        <div className="card p-6 border-surface-700">
          <h2 className="text-base font-semibold text-white mb-5">Sign in to your account</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" autoComplete="email"
                  className="input pl-9" />
              </div>
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" autoComplete="current-password"
                  className="input pl-9" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full py-3 mt-1">
              {loading ? <Spinner size="sm" /> : <LogIn size={16} />}
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-surface-700" /></div>
            <div className="relative flex justify-center"><span className="px-3 text-xs text-slate-500 bg-surface-800">or continue with</span></div>
          </div>

          <button onClick={handleGoogle} disabled={gLoading} className="btn-secondary w-full py-3 border border-surface-700">
            {gLoading ? <Spinner size="sm" /> : <Chrome size={16} className="text-brand-400" />}
            {gLoading ? 'Connecting…' : 'Continue with Google'}
          </button>

          <p className="text-center text-xs text-slate-500 mt-5">
            Don&apos;t have an account?{' '}
            <Link to="/signup" className="text-brand-400 hover:text-brand-300 font-semibold">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
