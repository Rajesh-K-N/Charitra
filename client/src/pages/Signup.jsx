import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import loginBg from '../assets/login_bg.webp';
import Seo from '../components/Seo';
import { apiFetch } from '../lib/api';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [website, setWebsite] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await apiFetch('auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, website })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Signup failed');

            navigate('/login', { state: { registered: true } });
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <>
        <Seo
            title="Create an Account | Charitra Scripture Reader"
            description="Create a Charitra account to read the Bhagavad Gita and Ramayana and save your scripture reading progress."
        />
        <div className="min-h-screen flex bg-parchment">
            {/* Left Side - Image */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <img src={loginBg} alt="Illustrated mythological scene" width="1024" height="1024" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-maroon-dark/40 flex items-center justify-center">
                    <div className="text-center p-12 text-white">
                        <p className="text-5xl font-serif font-bold mb-6 text-gold-light drop-shadow-lg">Join the Saga</p>
                        <p className="text-xl font-serif italic text-gold-light/90">"Every step you take is a verse in your own epic."</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-2xl border-2 border-gold/30">
                    <div className="text-center">
                        <h1 className="text-3xl font-serif font-bold text-maroon-dark">Create Your Legend</h1>
                        <p className="mt-2 text-sm text-gray-600">Register to start earning points and wisdom</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && <div role="alert" aria-live="polite" className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">{error}</div>}
                        <div className="sr-only" aria-hidden="true">
                            <label htmlFor="signup-website">Leave this field empty</label>
                            <input id="signup-website" name="website" type="text" tabIndex="-1" autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="signup-name" className="block text-sm font-medium text-maroon-dark mb-1">Full Name</label>
                                <input
                                    id="signup-name"
                                    type="text"
                                    required
                                    autoComplete="name"
                                    maxLength="80"
                                    className="appearance-none relative block w-full px-4 py-3 border border-gold/50 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition-all bg-parchment/30"
                                    placeholder="Rama"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="signup-email" className="block text-sm font-medium text-maroon-dark mb-1">Email Address</label>
                                <input
                                    id="signup-email"
                                    type="email"
                                    required
                                    autoComplete="email"
                                    maxLength="254"
                                    className="appearance-none relative block w-full px-4 py-3 border border-gold/50 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition-all bg-parchment/30"
                                    placeholder="rama@ayodhya.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="signup-password" className="block text-sm font-medium text-maroon-dark mb-1">Password</label>
                                <div className="relative">
                                    <input
                                        id="signup-password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        autoComplete="new-password"
                                        minLength="8"
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
                                Register
                            </button>
                        </div>
                        <div className="text-center">
                            <Link to="/login" className="font-medium text-maroon hover:text-saffron transition-colors">
                                Already have an account? <span className="underline decoration-gold">Sign in</span>
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </>
    );
};

export default Signup;
