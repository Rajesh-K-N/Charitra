import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import Seo from '../components/Seo';
import Breadcrumbs from '../components/Breadcrumbs';
import { apiFetch } from '../lib/api';

const Reader = () => {
    const { bookId, page } = useParams();
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContent = async () => {
            setLoading(true);
            setError('');
            try {
                const res = await apiFetch(`books/content/${encodeURIComponent(bookId)}/${encodeURIComponent(page)}`);
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.message || 'Unable to load this scripture page.');
                }
                setContent(data.content);
            } catch (err) {
                setError(err.message || 'Unable to load this scripture page.');
            } finally {
                setLoading(false);
            }
        };
        fetchContent();
    }, [bookId, page]);

    const handleComplete = async () => {
        try {
            const res = await apiFetch('books/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookId, page: Number(page) })
            });
            const data = await res.json();

            if (!res.ok) {
            throw new Error(data.message || 'Unable to save progress.');
            }
            const updatedUser = {
                ...user,
                points: data.points,
                streaks: data.streaks,
                dailyReads: data.dailyReads
            };
            login(updatedUser);
            navigate(`/read/${bookId}/${Number(page) + 1}`);
        } catch (err) {
            setError(err.message || 'Unable to save progress.');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-saffron"></div>
        </div>
    );

    return (
        <>
        <Seo title={`${bookId === 'bhagavadgita' ? 'Bhagavad Gita' : 'Ramayana'} Page ${page} | Charitra`} description={`Read page ${page} of the ${bookId === 'bhagavadgita' ? 'Bhagavad Gita' : 'Ramayana'} in Charitra.`} noIndex />
        <Breadcrumbs items={[{ label: 'Dashboard', to: '/dashboard' }, { label: bookId === 'bhagavadgita' ? 'Bhagavad Gita' : 'Ramayana' }]} />
        <div className="container mx-auto px-4 py-8 pb-28 max-w-4xl md:pb-8">
            <div className="flex justify-between items-center mb-8 border-b-2 border-gold/30 pb-4">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="mr-4 text-maroon hover:text-saffron transition-colors"
                        title="Back to Dashboard"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>
                    <h1 className="text-3xl font-serif font-bold text-maroon-dark">{bookId === 'bhagavadgita' ? 'Bhagavad Gita' : 'Ramayana'}</h1>
                </div>
                <div className="bg-gold/20 px-4 py-1 rounded-full border border-gold/50">
                    <span className="text-maroon font-serif font-bold">Adhyaya (Page) {page}</span>
                </div>
            </div>

            {/* Parchment Reader Area */}
            <div className="bg-[#FDF6E3] p-8 md:p-12 rounded-lg shadow-2xl mb-10 min-h-[500px] relative border-8 border-double border-[#D4C5A9]">
                {/* Decorative Corners */}
                <div className="absolute top-2 left-2 w-8 h-8 border-t-4 border-l-4 border-maroon/30"></div>
                <div className="absolute top-2 right-2 w-8 h-8 border-t-4 border-r-4 border-maroon/30"></div>
                <div className="absolute bottom-2 left-2 w-8 h-8 border-b-4 border-l-4 border-maroon/30"></div>
                <div className="absolute bottom-2 right-2 w-8 h-8 border-b-4 border-r-4 border-maroon/30"></div>

                <div className="prose prose-lg max-w-none font-serif text-gray-800 leading-loose text-justify whitespace-pre-line" aria-live="polite">
                    {error && <p role="alert" className="text-red-700">{error}</p>}
                    {content}
                </div>
            </div>

            <div className="fixed bottom-0 inset-x-0 z-40 flex justify-between items-center gap-2 border-t border-gold/50 bg-parchment/95 p-3 shadow-lg backdrop-blur md:static md:border-0 md:bg-transparent md:p-0 md:shadow-none">
                <button
                    onClick={() => navigate(`/read/${bookId}/${parseInt(page) - 1}`)}
                    disabled={parseInt(page) <= 1}
                    className="bg-white border border-gold text-maroon px-3 py-3 rounded-lg font-serif hover:bg-gold/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm md:px-6"
                >
                    ← Previous Verse
                </button>
                <button
                    onClick={handleComplete}
                    className="bg-gradient-to-r from-saffron to-maroon text-white px-3 py-3 rounded-lg font-serif font-bold hover:shadow-lg transition-all border border-gold md:px-8"
                >
                    Complete & Continue (+10 Karma) →
                </button>
            </div>
        </div>
        </>
    );
};

export default Reader;
