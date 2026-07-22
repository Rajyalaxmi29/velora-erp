import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, MOCK_USERS, UserRole } from '../context/AuthContext';
import { Eye, EyeOff, Lock, Mail, ShieldAlert, Sparkles, Check } from 'lucide-react';

export default function LoginPage() {
  const { login, user } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user is already logged in, navigate them to dashboard
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setError(null);
    setIsSubmitting(true);

    try {
      const success = await login(email, password);
      if (success) {
        if (rememberMe) {
          localStorage.setItem('velora_remembered_email', email);
        } else {
          localStorage.removeItem('velora_remembered_email');
        }
        navigate('/dashboard');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Populate form with mock user info
  const handleQuickLogin = (selectedEmail: string) => {
    const userDetails = MOCK_USERS[selectedEmail];
    if (userDetails) {
      setEmail(selectedEmail);
      setPassword(userDetails.password);
      setError(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-body selection:bg-accent/20">
      
      {/* Top logo */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-1.5 text-xl font-semibold tracking-tight text-foreground">
          <span className="text-foreground">✦</span>
          <span>Velora</span>
          <span className="text-[9px] bg-secondary text-foreground px-1.5 py-0.5 rounded font-mono font-medium">ERP</span>
        </Link>
        <h2 className="mt-6 text-center text-3xl font-display tracking-tight text-foreground">
          Sign In to Your Workspace
        </h2>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Enter your authorized credentials or select a mock user role below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 border border-border/80 shadow-sm sm:rounded-xl sm:px-10">
          
          {error && (
            <div className="mb-4 bg-[#FFF5F5] border border-[#FFC9C9] text-[#E03131] rounded-lg p-3 text-xs flex items-start gap-2.5">
              <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                Email Address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground/70">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="name@velora.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg text-sm bg-[#FDFDFD] placeholder-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-xs font-semibold text-foreground uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => alert('Forgot password? Under mock credentials, please use the quick login buttons.')}
                  className="text-xs text-accent hover:underline font-medium"
                >
                  Forgot password?
                </button>
              </div>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground/70">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-border rounded-lg text-sm bg-[#FDFDFD] placeholder-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground/70 hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-accent border-border rounded focus:ring-accent"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs font-medium text-muted-foreground">
                Remember me for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-75 transition-opacity"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                ) : (
                  'Login to Account'
                )}
              </button>
            </div>
          </form>

          {/* Quick Mock Login Selection Panel */}
          <div className="mt-8 border-t border-border/80 pt-6">
            <span className="block text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Authorized Mock Profiles
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {Object.keys(MOCK_USERS).map((mockEmail) => {
                const details = MOCK_USERS[mockEmail];
                const isSelected = email.toLowerCase() === mockEmail;
                return (
                  <button
                    key={mockEmail}
                    type="button"
                    onClick={() => handleQuickLogin(mockEmail)}
                    className={`p-2.5 rounded-lg border text-left transition-all hover:bg-secondary flex flex-col gap-0.5 justify-between relative ${
                      isSelected 
                        ? 'border-accent bg-accent/5 ring-1 ring-accent' 
                        : 'border-border bg-[#FCFCFD]'
                    }`}
                  >
                    <div className="flex justify-between items-center w-full">
                      <span className="font-semibold text-[10px] text-foreground">{details.name}</span>
                      {isSelected && <Check className="w-3 h-3 text-accent" />}
                    </div>
                    <span className="text-[9px] text-muted-foreground">{details.role} Profile</span>
                    <span className="text-[8px] text-muted-foreground/70 font-mono mt-1">{mockEmail}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
