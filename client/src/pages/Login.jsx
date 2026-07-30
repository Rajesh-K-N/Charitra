import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import loginBg from '../assets/login_bg.png';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Login failed');

            login(data.token, data.user);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="min-h-screen flex bg-parchment">
            {/* Left Side - Image */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <img src={loginBg} alt="Mythological Background" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-maroon-dark/40 flex items-center justify-center">
                    <div className="text-center p-12 text-white">
                        <h1 className="text-5xl font-serif font-bold mb-6 text-gold-light drop-shadow-lg">Charitra</h1>
                        <p className="text-xl font-serif italic text-gold-light/90">"Your journey into the ancient wisdom begins here."</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative">
                <div className="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-sm p-10 rounded-2xl shadow-2xl border-2 border-gold/30">
                    <div className="text-center">
                        <h2 className="text-3xl font-serif font-bold text-maroon-dark">Enter the Realm</h2>
                        <p className="mt-2 text-sm text-gray-600">Sign in to continue your reading yatra</p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center">{error}</div>}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-maroon-dark mb-1">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="appearance-none relative block w-full px-4 py-3 border border-gold/50 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition-all bg-parchment/30"
                                    placeholder="arjuna@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-maroon-dark mb-1">Password</label>
                                <input
                                    type="password"
                                    required
                                    className="appearance-none relative block w-full px-4 py-3 border border-gold/50 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-saffron focus:border-transparent transition-all bg-parchment/30"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
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
    );
};

export default Login;
