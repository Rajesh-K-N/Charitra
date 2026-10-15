import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import loginBg from '../assets/login_bg.webp';
import Seo from '../components/Seo';
import { apiFetch } from '../lib/api';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [website, setWebsite] = useState('');
    const [error, setError] = useState('');
    const location = useLocation();
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await apiFetch('auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password, website })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');

            login(data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
        <Seo
            title="Sign In | Charitra Scripture Reader"
            description="Sign in to Charitra to continue reading the Bhagavad Gita and Ramayana and track your scripture reading progress."
        />
        <div className="min-h-screen flex bg-parchment">
            {/* Left Side - Image */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <img src={loginBg} alt="Illustrated mythological scene" width="1024" height="1024" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-maroon-dark/40 flex items-center justify-center">
                    <div className="text-center p-12 text-white">
                        <p className="text-5xl font-serif font-bold mb-6 text-gold-light drop-shadow-lg">Charitra</p>
                        <p className="text-xl font-serif italic text-gold-light/90">"Your journey into the ancient wisdom begins here."</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-2xl border-2 border-gold/30">
                    <div className="text-center">
                        <h1 className="text-3xl font-serif font-bold text-maroon-dark">Enter the Realm</h1>
                        <p className="mt-2 text-sm text-gray-600">Sign in to continue your reading yatra</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {location.state?.registered && <p role="status" className="rounded border border-green-400 bg-green-100 px-4 py-3 text-center text-green-800">Account created. Sign in to continue.</p>}
                        {error && <div role="alert" aria-live="polite" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">{error}</div>}
                        <div className="sr-only" aria-hidden="true">
                            <label htmlFor="login-website">Leave this field empty</label>
                            <input id="login-website" name="website" type="text" tabIndex="-1" autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="login-email" className="block text-sm font-medium text-maroon-dark mb-1">Email Address</label>
                                <input
                                    id="login-email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    maxLength="254"
                                    className="appearance-none relative block w-full px-4 py-3 border border-gold/50 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition-all bg-parchment/30"
                                    placeholder="arjuna@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="login-password" className="block text-sm font-medium text-maroon-dark mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        id="login-password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        autoComplete="current-password"
                                        maxLength="72"
                                        className="appearance-none relative block w-full px-4 py-3 pr-16 border border-gold/50 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition-all bg-parchment/30"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                        aria-pressed={showPassword}
                                        onClick={() => setShowPassword((visible) => !visible)}
                                        className="absolute inset-y-0 right-3 my-auto rounded px-2 text-sm font-medium text-maroon underline underline-offset-2 hover:text-saffron-dark focus-visible:outline"
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-serif font-bold rounded-lg text-white bg-gradient-to-r from-saffron-dark to-maroon hover:from-saffron hover:to-maroon-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-saffron transition-all shadow-lg transform hover:-translate-y-0.5"
                            >
                                Begin Journey
                            </button>
                        </div>
                        <div className="text-center">
                            <Link to="/signup" className="font-medium text-maroon hover:text-saffron transition-colors">
                                New to Charitra? <span className="underline decoration-gold">Create an account</span>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </>
    );
};

export default Login;
