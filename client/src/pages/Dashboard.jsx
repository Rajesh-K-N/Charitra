import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

const Dashboard = () => {
    const { user, login } = useAuth();

    const books = [
        { id: 'ramayana', title: 'Ramayana', description: 'The epic journey of Prince Rama.', color: 'from-orange-100 to-orange-50' },
        { id: 'bhagavadgita', title: 'Bhagavad Gita', description: 'The divine song of Lord Krishna.', color: 'from-yellow-100 to-yellow-50' }
    ];

    // Fetch fresh progress on mount
    useEffect(() => {
        const fetchProgress = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;

                const res = await fetch('http://localhost:5000/api/books/my-progress', {
                    headers: { 'auth-token': token }
                });
                const data = await res.json();

                if (res.ok && user) {
                    const updatedUser = {
                        ...user,
                        points: data.points,
                        streaks: data.streaks,
                        dailyReads: data.dailyReads
                    };
                    // Only update if data changed to avoid loops (though login sets state, so it might rerender)
                    // Simple check or just update
                    if (JSON.stringify(updatedUser) !== JSON.stringify(user)) {
                        login(token, updatedUser);
                    }
                }
            } catch (err) {
                console.error("Failed to refresh progress", err);
            }
        };
        fetchProgress();
    }, []);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-maroon-dark mb-4">Namaste, {user?.name}</h1>
                <p className="text-xl text-maroon/80 italic font-serif">"Your spiritual journey continues."</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {/* Progress Card */}
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl border-2 border-gold relative overflow-hidden group hover:shadow-2xl transition-all">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-saffron to-maroon"></div>
                    <h2 className="text-2xl font-serif font-bold text-maroon-dark mb-6 flex items-center">
                        <span className="text-3xl mr-3">🕉️</span> Your Yatra (Progress)
                    </h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-parchment rounded-lg border border-gold/30">
                            <span className="text-lg font-medium text-maroon-dark">Divine Points (Karma)</span>
                            <span className="text-3xl font-bold text-saffron-dark">{user?.points}</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-parchment rounded-lg border border-gold/30">
                            <span className="text-lg font-medium text-maroon-dark">Daily Streak (Tapasya)</span>
                            <span className="text-3xl font-bold text-saffron-dark">{user?.streaks || 0} <span className="text-sm font-normal text-gray-600">days</span></span>
                        </div>
                    </div>
                </div>

                {/* Daily Goal Card */}
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-xl border-2 border-gold relative overflow-hidden group hover:shadow-2xl transition-all">
                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-maroon to-saffron"></div>
                    <h2 className="text-2xl font-serif font-bold text-maroon-dark mb-6 flex items-center">
                        <span className="text-3xl mr-3">🎯</span> Daily Sankalpa (Goal)
                    </h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        Read at least <span className="font-bold text-maroon">1 page</span> today to maintain your spiritual discipline and earn divine blessings.
                    </p>
                    <div className="mt-6">
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className="bg-saffron h-2.5 rounded-full transition-all duration-500"
                                style={{ width: `${Math.min((user?.dailyReads || 0) * 100, 100)}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-gray-500 mt-2 text-right">{user?.dailyReads || 0}/1 Pages Read</p>
                    </div>
                </div>
            </div>

            <h2 className="text-3xl font-serif font-bold text-center text-maroon-dark mb-10 relative">
                <span className="relative z-10 bg-parchment px-6">Select a Scripture</span>
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gold/50 -z-0"></div>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
                {books.map(book => (
                    <div key={book.id} className={`bg-gradient-to-br ${book.color} p-8 rounded-xl shadow-lg border border-gold/40 hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer group`}>
                        <h3 className="text-2xl font-serif font-bold text-maroon-dark mb-3 group-hover:text-saffron-dark transition-colors">{book.title}</h3>
                        <p className="text-gray-700 mb-6 font-serif italic">{book.description}</p>
                        <Link to={`/read/${book.id}/1`} className="inline-block w-full text-center bg-maroon text-white px-6 py-3 rounded-lg font-bold hover:bg-maroon-light transition-colors shadow-md border border-gold">
                            Open Scripture
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
