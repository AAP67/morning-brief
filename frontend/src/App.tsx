import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-surface-0 text-white">
        {/* Grid background */}
        <div className="fixed inset-0 bg-grid-pattern bg-grid opacity-100 pointer-events-none" />
        {/* Radial glow */}
        <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-radial from-accent-lime/[0.04] via-transparent to-transparent pointer-events-none" />

        <div className="relative z-10">
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/onboarding" element={<Onboarding />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
