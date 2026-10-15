import { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import { apiFetch } from '../lib/api';

const Leaderboard = () => {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await apiFetch('books/leaderboard');
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || 'Unable to load leaderboard.');
                }
                setLeaders(data);
            } catch (err) {
                setError(err.message || 'Unable to load leaderboard.');
            } finally {
                setLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    return (
        <>
        <Seo title="Hall of Sages Leaderboard | Charitra" description="See the Charitra reading leaderboard and compare scripture reading points and daily streaks." noIndex />
        <Breadcrumbs items={[{ label: 'Dashboard', to: '/dashboard' }, { label: 'Leaderboard' }]} />
        <div className="container mx-auto px-4 py-12 max-w-4xl">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-serif font-bold text-maroon-dark mb-4">Hall of Sages</h1>
                <p className="text-xl text-maroon/80 italic font-serif">"Those who strive for wisdom shall be exalted."</p>
            </div>

            <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-2xl border-2 border-gold overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-maroon text-white font-serif">
                            <tr>
                                <th className="px-6 py-4 text-left">Rank</th>
                                <th className="px-6 py-4 text-left">Devotee</th>
                                <th className="px-6 py-4 text-center">Karma Points</th>
                                <th className="px-6 py-4 text-center">Streak (Days)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gold/30">
                            {loading ? (
                                <tr>
                                    <td colSpan="4" className="px-6 py-8 text-center text-gray-500 font-serif">
                                        Summoning the records...
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr><td colSpan="4" role="alert" className="px-6 py-8 text-center text-red-700">{error}</td></tr>
                            ) : leaders.length === 0 ? (
                                <tr><td colSpan="4" className="px-6 py-8 text-center text-gray-500">No readers have appeared on the leaderboard yet.</td></tr>
                            ) : (
                                leaders.map((leader, index) => (
                                    <tr
                                        key={leader._id}
                                        className={`
                                            ${leader._id === user?.id ? 'bg-saffron/10' : 'hover:bg-parchment/50'} 
                                            transition-colors font-serif
                                        `}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center">
                                                {index === 0 && <span className="text-2xl mr-2">🥇</span>}
                                                {index === 1 && <span className="text-2xl mr-2">🥈</span>}
                                                {index === 2 && <span className="text-2xl mr-2">🥉</span>}
                                                <span className={`font-bold ${index < 3 ? 'text-maroon-dark text-lg' : 'text-gray-600'}`}>
                                                    #{index + 1}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-800">
                                            {leader.name}
                                            {leader._id === user?.id && <span className="ml-2 text-xs bg-maroon text-white px-2 py-0.5 rounded-full">You</span>}
                                        </td>
                                        <td className="px-6 py-4 text-center font-bold text-saffron-dark">
                                            {leader.points}
                                        </td>
                                        <td className="px-6 py-4 text-center text-gray-600">
                                            {leader.streaks} 🔥
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </>
    );
};

export default Leaderboard;
