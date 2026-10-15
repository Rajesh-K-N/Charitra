import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useState } from 'react';
import { apiFetch } from '../lib/api';

const Navbar = () => {
    const { user, logout, login } = useAuth();
    const [showResetModal, setShowResetModal] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const [actionError, setActionError] = useState('');

    const handleReset = async () => {
        try {
            const res = await apiFetch('books/reset-progress', { method: 'POST' });
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Unable to reset progress.');
            }
            const updatedUser = {
                ...user,
                points: data.points,
                streaks: data.streaks,
                dailyReads: data.dailyReads
            };
            login(updatedUser);
            setActionError('');
            setShowResetModal(false);
            setConfirmText('');
        } catch (error) {
            setActionError(error.message || 'Unable to reset progress.');
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            setActionError('');
        } catch (error) {
            setActionError(error.message || 'Unable to sign out.');
        }
    };

    return (
        <nav className="bg-maroon-dark text-white shadow-lg border-b border-gold/50 sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-serif font-bold text-gold-light tracking-wide flex items-center">
                    <span className="mr-2">🕉️</span> Charitra
                </Link>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <Link to="/leaderboard" className="font-serif text-gold-light hidden md:inline hover:text-white transition-colors mr-4" title="View Rankings">
                                🏆 Leaderboard
                            </Link>
                            <button
                                onClick={() => setShowResetModal(true)}
                                className="font-serif text-gold-light hidden md:inline hover:text-white transition-colors border-b border-transparent hover:border-gold-light mr-4"
                                title="Click to Reset Karma"
                            >
                                Karma: {user.points}
                            </button>
                            <button onClick={handleLogout} className="bg-transparent border border-gold text-gold-light px-4 py-1.5 rounded-lg hover:bg-gold hover:text-maroon-dark transition font-serif font-bold">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gold-light hover:text-white font-serif transition">Login</Link>
                            <Link to="/signup" className="bg-gold text-maroon-dark px-4 py-2 rounded-lg hover:bg-gold-light transition font-serif font-bold">
                                Signup
                            </Link>
                        </>
                    )}
                </div>
            </div>
            {actionError && <p role="alert" className="px-4 pb-2 text-center text-sm text-red-200">{actionError}</p>}

            {/* Reset Confirmation Modal */}
            {showResetModal && (
                <div role="dialog" aria-modal="true" aria-labelledby="reset-dialog-title" className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full border-2 border-red-200 text-gray-800">
                        <h2 id="reset-dialog-title" className="text-2xl font-serif font-bold text-red-700 mb-4">Reset Karma?</h2>
                        <p className="text-gray-700 mb-6">
                            This will reset your **Points**, **Streaks**, and **Daily Goal** to zero. Your reading progress (bookmarks) will be saved.
                            <br /><br />
                            Type <span className="font-mono font-bold bg-gray-100 px-1 rounded">confirm</span> below to proceed.
                        </p>
                        <label htmlFor="reset-confirm" className="sr-only">Type confirm to reset progress</label>
                        <input
                            id="reset-confirm"
                            type="text"
                            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-red-500"
                            placeholder="Type confirm"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                        />
                        <div className="flex justify-end space-x-4">
                            <button
                                onClick={() => { setShowResetModal(false); setConfirmText(''); }}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReset}
                                disabled={confirmText !== 'confirm'}
                                className="px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md"
                            >
                                Reset Karma
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
