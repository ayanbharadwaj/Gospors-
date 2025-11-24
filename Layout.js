import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { Trophy, Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Layout({ children, currentPageName }) {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const isAuth = await base44.auth.isAuthenticated();
        if (isAuth) {
          const userData = await base44.auth.me();
          setUser(userData);
        }
      } catch (e) {
        // Not logged in
      }
    };
    loadUser();
  }, []);

  const handleLogout = () => {
    base44.auth.logout(createPageUrl('Home'));
  };

  const navLinks = [
    { name: 'Home', page: 'Home' },
    { name: 'Discover', page: 'Discover' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link 
              to={createPageUrl('Home')}
              className="flex items-center gap-3 group"
            >
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M2 19h20v3H2v-3zm2-9l4 4 4-6 4 6 4-4v9H4v-9z"/></svg>
              </div>
              <span className="text-xl sm:text-2xl font-black bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                Gospors
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map(link => (
                <Link 
                  key={link.page}
                  to={createPageUrl(link.page)}
                  className={`px-5 py-2 rounded-full font-semibold transition ${
                    currentPageName === link.page 
                      ? 'bg-orange-100 text-orange-700' 
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="ml-2 font-semibold">
                      <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center mr-2">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M2 19h20v3H2v-3zm2-9l4 4 4-6 4 6 4-4v9H4v-9z"/></svg>
                      </div>
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-3 py-2">
                      <p className="font-semibold">{user.full_name || 'User'}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={createPageUrl('AthleteDashboard')} className="cursor-pointer">
                        <User className="w-4 h-4 mr-2" />
                        My Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Log Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex gap-2 ml-2">
                  <Button 
                    variant="ghost"
                    onClick={() => base44.auth.redirectToLogin(window.location.href)}
                    className="font-semibold"
                  >
                    Log In
                  </Button>
                  <Link to={createPageUrl('AthleteSignup')}>
                    <Button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold">
                      Join as Athlete
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t pt-4">
              <div className="flex flex-col gap-2">
                {navLinks.map(link => (
                  <Link 
                    key={link.page}
                    to={createPageUrl(link.page)}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`px-4 py-3 rounded-xl font-semibold transition ${
                      currentPageName === link.page 
                        ? 'bg-orange-100 text-orange-700' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                
                {user ? (
                  <>
                    <Link 
                      to={createPageUrl('AthleteDashboard')}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-100"
                    >
                      My Dashboard
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="px-4 py-3 rounded-xl font-semibold text-red-600 hover:bg-red-50 text-left"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => base44.auth.redirectToLogin(window.location.href)}
                      className="px-4 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 text-left"
                    >
                      Log In
                    </button>
                    <Link 
                      to={createPageUrl('AthleteSignup')}
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-4 py-3 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center"
                    >
                      Join as Athlete
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Page Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M2 19h20v3H2v-3zm2-9l4 4 4-6 4 6 4-4v9H4v-9z"/></svg>
                </div>
                <span className="text-2xl font-black">Gospors</span>
              </div>
              <p className="text-slate-400 max-w-sm">
                Connecting rising athletic stars with sponsors who believe in their potential.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Platform</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link to={createPageUrl('Discover')} className="hover:text-white transition">Discover Athletes</Link></li>
                <li><Link to={createPageUrl('AthleteSignup')} className="hover:text-white transition">Join as Athlete</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><a href="#" className="hover:text-white transition">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-10 pt-8 text-center text-slate-500 text-sm">
            © {new Date().getFullYear()} Gospors. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
