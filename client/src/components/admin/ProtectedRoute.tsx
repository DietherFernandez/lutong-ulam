import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ReactNode } from 'react';
import { AlertTriangle, Settings } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
}

function SetupRequired() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle size={32} />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Setup Required</h1>
        <p className="text-gray-600 mb-6">
          Supabase credentials are not configured. Create a <code className="bg-gray-100 px-1 rounded text-sm">.env</code> file
          in the <code className="bg-gray-100 px-1 rounded text-sm">client/</code> folder based on{' '}
          <code className="bg-gray-100 px-1 rounded text-sm">.env.example</code>, then restart the dev server.
        </p>
        <div className="bg-gray-900 text-gray-100 rounded-lg p-4 text-left text-sm font-mono mb-6">
          <p className="text-green-400"># 1. Copy the example file</p>
          <p>cp .env.example .env</p>
          <br />
          <p className="text-green-400"># 2. Fill in your Supabase credentials</p>
          <p>VITE_SUPABASE_URL=https://...</p>
          <p>VITE_SUPABASE_ANON_KEY=eyJ...</p>
          <br />
          <p className="text-green-400"># 3. Restart the dev server</p>
          <p>npm run dev</p>
        </div>
        <a
          href="https://github.com/YOUR_USERNAME/restaurant-website/blob/main/README.md"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
        >
          <Settings size={16} />
          View the setup guide in README.md
        </a>
      </div>
    </div>
  );
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, needsSetup } = useAuth();

  if (needsSetup) {
    return <SetupRequired />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}
