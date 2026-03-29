import { Link, useLocation } from 'react-router-dom';
import { Zap, Settings, Sun } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-surface-0/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-accent-lime/10 border border-accent-lime/20 flex items-center justify-center group-hover:bg-accent-lime/20 transition-colors">
            <Zap className="w-4 h-4 text-accent-lime" />
          </div>
          <span className="font-display font-semibold text-lg tracking-tight">
            morning<span className="text-accent-lime">brief</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/'
                ? 'text-white bg-white/5'
                : 'text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/onboarding"
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === '/onboarding'
                ? 'text-white bg-white/5'
                : 'text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            Profile
          </Link>
          <button className="ml-2 p-2 rounded-lg text-muted hover:text-white hover:bg-white/5 transition-colors">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
}
