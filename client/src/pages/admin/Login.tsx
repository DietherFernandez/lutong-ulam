import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ChefHat, Lock, Mail, AlertCircle, Settings, AlertTriangle } from 'lucide-react';

function SetupNotice() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Supabase Not Configured</h2>
          <p className="text-gray-600 mb-6 text-sm">
            Before you can log in, connect the app to Supabase by adding your credentials.
          </p>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-4 text-left text-sm font-mono mb-6 space-y-1">
            <p className="text-green-400"># 1. Create .env file</p>
            <p>cd client</p>
            <p>cp .env.example .env</p>
            <br />
            <p className="text-green-400"># 2. Edit .env and add:</p>
            <p>VITE_SUPABASE_URL=https://your-project.supabase.co</p>
            <p>VITE_SUPABASE_ANON_KEY=eyJ...</p>
            <br />
            <p className="text-green-400"># 3. Restart the dev server</p>
            <p>npm run dev</p>
          </div>
          <p className="text-xs text-gray-500">
            See <code className="bg-gray-100 px-1 rounded">README.md</code> for full Supabase setup instructions.
          </p>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-sm text-gray-500 hover:text-primary-600">
            ← Back to restaurant site
          </a>
        </div>
      </div>
    </div>
  );
}

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, needsSetup } = useAuth();
  const navigate = useNavigate();

  // If Supabase is not configured, show the setup notice.
  if (needsSetup) {
    return <SetupNotice />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err: any) {
      const msg: string = err?.message ?? '';
      // Network-level errors (fetch failed, DNS, CORS, etc.)
      if (
        msg === 'Failed to fetch' ||
        msg.toLowerCase().includes('fetch') ||
        msg.includes('NetworkError') ||
        msg.includes('ERR_') ||
        msg.includes('net::')
      ) {
        setError(
          'Cannot connect to Supabase. Check that your VITE_SUPABASE_URL in .env is correct and that you have an internet connection.'
        );
      } else {
        setError(msg || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-4">
              <ChefHat size={32} />
            </div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">Admin Login</h1>
            <p className="text-sm text-gray-500 mt-2">Sign in to manage your restaurant</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
              <AlertCircle size={18} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-10"
                  placeholder="admin@example.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              <strong>First time?</strong> Create your admin in Supabase Dashboard
              → Authentication → Users → Add user (email + password).
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-sm text-gray-500 hover:text-primary-600">
            ← Back to restaurant site
          </a>
        </div>
      </div>
    </div>
  );
}
