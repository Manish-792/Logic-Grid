import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { registerUser } from '../authSlice';

const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak")
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 font-outfit relative" style={{ backgroundColor: 'var(--bg)', transition: 'background-color 300ms ease, color 300ms ease' }}>
      {/* Spline Background */}
      <iframe 
        src='https://my.spline.design/particlesflow-JaHgzfkbu7IVTc2PFo5khoZC/' 
        frameBorder='0' 
        width='100%' 
        height='100%'
        className="absolute inset-0 z-0"
        style={{ pointerEvents: 'none' }}
      />
      
      {/* Scoped theme styles to match Homepage */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap" rel="stylesheet" />
      <style>{`
        :root {
          --bg: #0b0f14;
          --header: #111827ee;
          --panel: rgba(17, 24, 39, 0.55);
          --border: #2a2f3a;
          --text: #e5e7eb;
          --muted: #9ca3af;
          --accent: #22c55e;
          --warn: #eab308;
          --danger: #ef4444;
          --neon: #22d3ee;
          --glass-blur: 12px;
        }
        .font-outfit{ font-family: 'Outfit', ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Apple Color Emoji', 'Segoe UI Emoji'; }
        .glass{ background: var(--panel); backdrop-filter: blur(var(--glass-blur)); -webkit-backdrop-filter: blur(var(--glass-blur)); border:1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,.25); }
        .neon-input, .neon-btn{ border:1px solid var(--border); transition: transform .22s ease, box-shadow .22s ease, background-color .22s ease, color .22s ease; }
        .neon-input:hover{ box-shadow: 0 0 10px var(--neon); }
        .neon-btn:hover{ transform: translateY(-1px) scale(1.03); box-shadow: 0 8px 20px rgba(0,0,0,.3), 0 0 18px var(--neon); }
        @keyframes logoPulse {
          0%, 100% { 
            text-shadow: 0 0 20px #22d3ee, 0 0 40px #22d3ee;
            filter: drop-shadow(0 0 10px #22d3ee);
          }
          50% { 
            text-shadow: 0 0 30px #22d3ee, 0 0 60px #22d3ee, 0 0 80px #22d3ee;
            filter: drop-shadow(0 0 20px #22d3ee);
          }
        }
        .logo-pulse {
          animation: logoPulse 2s ease-in-out infinite;
        }
      `}</style>
      <div className="card w-full max-w-md glass rounded-2xl relative z-10">
        <div className="card-body">
          <h2 className="card-title justify-center text-4xl mb-6 font-bold" style={{ color: 'var(--text)' }}>
            <span 
              className="inline-block transition-all duration-300 hover:scale-110 hover:rotate-1 logo-pulse"
              style={{ 
                color: '#22d3ee', 
                textShadow: '0 0 20px #22d3ee, 0 0 40px #22d3ee',
                filter: 'drop-shadow(0 0 10px #22d3ee)'
              }}
            >
              LG
            </span>
            <span 
              className="inline-block transition-all duration-300 hover:scale-105"
              style={{ 
                color: 'var(--text)', 
                textShadow: '0 0 10px var(--text)',
                filter: 'drop-shadow(0 0 5px var(--text))'
              }}
            >
              {' '}LogicGrid
            </span>
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* First Name Field */}
            <div className="form-control">
              <label className="label">
                <span className="label-text" style={{ color: '#eeeee4' }}>First Name</span>
              </label>
              <input
                type="text"
                placeholder="John"
                className="input w-full border neon-input focus:outline-none transition-all duration-200"
                style={{ backgroundColor: 'var(--header)', borderColor: 'var(--border)', color: 'var(--text)' }}
                {...register('firstName')}
              />
              {errors.firstName && (
                <span className="text-sm mt-1" style={{ color: 'var(--warn)' }}>{errors.firstName.message}</span>
              )}
            </div>

            {/* Email Field */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text" style={{ color: '#eeeee4' }}>Email</span>
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className="input w-full border neon-input focus:outline-none transition-all duration-200"
                style={{ backgroundColor: 'var(--header)', borderColor: 'var(--border)', color: 'var(--text)' }}
                {...register('emailId')}
              />
              {errors.emailId && (
                <span className="text-sm mt-1" style={{ color: 'var(--warn)' }}>{errors.emailId.message}</span>
              )}
            </div>

            {/* Password Field with Toggle */}
            <div className="form-control mt-4">
              <label className="label">
                <span className="label-text" style={{ color: '#eeeee4' }}>Password</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="input w-full pr-10 border neon-input focus:outline-none transition-all duration-200"
                  style={{ backgroundColor: 'var(--header)', borderColor: 'var(--border)', color: 'var(--text)' }}
                  {...register('password')}
                />
                <button
                  type="button"
                  className="absolute top-1/2 right-3 transform -translate-y-1/2 hover:opacity-80 transition-opacity"
                  style={{ color: 'var(--text)' }}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-sm mt-1" style={{ color: 'var(--warn)' }}>{errors.password.message}</span>
              )}
            </div>

            {/* Submit Button */}
            <div className="form-control mt-8 flex justify-center"> 
              <button
                type="submit"
                className="btn w-full font-semibold transition-all duration-200 hover:scale-105 neon-btn"
                style={{ backgroundColor: 'var(--accent)', color: '#0b0f15', border: 'none' }}
                disabled={loading}
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </div>
          </form>

          {/* Login Redirect */}
          <div className="text-center mt-6">
            <span className="text-sm" style={{ color: 'var(--text)' }}>
              Already have an account?{' '}
              <NavLink 
                to="/login" 
                className="link font-semibold hover:opacity-80 transition-opacity neon-btn"
                style={{ color: 'var(--accent)', backgroundColor: 'transparent' }}
              >
                Login
              </NavLink>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;