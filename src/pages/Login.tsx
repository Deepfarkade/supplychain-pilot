import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password);
      if (success) {
        navigate('/');
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-cyan-500/20 animate-pulse"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-pink-400 to-purple-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400 to-pink-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-gradient-to-r from-purple-400 to-cyan-600 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Geometric Lines */}
      <div className="absolute inset-0">
        <svg className="w-full h-full" viewBox="0 0 1000 1000" fill="none">
          <path d="M100 500 Q 300 300 500 500 T 900 500" stroke="url(#gradient1)" strokeWidth="2" fill="none" opacity="0.6">
            <animate attributeName="d" dur="8s" repeatCount="indefinite" values="M100 500 Q 300 300 500 500 T 900 500;M100 500 Q 300 700 500 500 T 900 500;M100 500 Q 300 300 500 500 T 900 500"/>
          </path>
          <path d="M200 300 Q 400 500 600 300 T 800 700" stroke="url(#gradient2)" strokeWidth="2" fill="none" opacity="0.4">
            <animate attributeName="d" dur="6s" repeatCount="indefinite" values="M200 300 Q 400 500 600 300 T 800 700;M200 300 Q 400 100 600 300 T 800 700;M200 300 Q 400 500 600 300 T 800 700"/>
          </path>
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f472b6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Floating Dots */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-yellow-400 rounded-full animate-bounce"></div>
      <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-pink-400 rounded-full animate-bounce animation-delay-1000"></div>
      <div className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-cyan-400 rounded-full animate-bounce animation-delay-2000"></div>
      <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-bounce animation-delay-3000"></div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          {/* Title */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold mb-4">
              <span className="text-yellow-400">Supply Chain</span>
              <span className="text-white">AI</span> 
              <span className="text-white/90 font-light"> Studio</span>
            </h1>
            <p className="text-white/70 text-lg">for everyone</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
              <div className="space-y-4">
                <div>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="bg-transparent border-0 border-b border-white/30 rounded-none text-white placeholder:text-white/50 focus:border-white/70 focus:ring-0 text-lg py-3"
                  />
                </div>
                <div>
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-transparent border-0 border-b border-white/30 rounded-none text-white placeholder:text-white/50 focus:border-white/70 focus:ring-0 text-lg py-3"
                  />
                </div>
                
                {error && (
                  <p className="text-red-400 text-sm">{error}</p>
                )}

                <div className="flex items-center justify-between pt-4">
                  <span className="text-white/70 text-sm">LOGIN</span>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-full p-3 h-auto"
                  >
                    {isLoading ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <ArrowRight className="h-5 w-5" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;