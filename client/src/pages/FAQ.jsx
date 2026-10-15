import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../components/Seo';

const questions = [
    ['What is Charitra?', 'Charitra is a reading app for the Bhagavad Gita and Ramayana, with optional progress tracking.'],
    ['Do I need an account?', 'An account is required to save reading progress, earn points, and use the leaderboard.'],
    ['How do points and streaks work?', 'Completing a scripture page earns 10 points. Reading on consecutive days builds a streak.'],
    ['Is the complete text available?', 'No. The app currently contains a limited sample of pages; unavailable pages are identified in the reader.'],
    ['What information is saved?', 'The app stores your account name and email, a password hash, and reading statistics in its MongoDB database. A necessary one-hour HttpOnly session cookie keeps you signed in.']
];

const FAQ = () => (
    <>
        <Seo
            title="Frequently Asked Questions | Charitra"
            description="Answers about Charitra accounts, reading progress, points, streaks, and the scripture content currently available."
        />
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'FAQ' }]} />
        <article className="container mx-auto max-w-3xl px-4 py-10">
            <h1 className="mb-8 text-4xl font-serif font-bold">Frequently Asked Questions</h1>
            <div className="space-y-6">
                {questions.map(([question, answer]) => (
                    <section key={question}>
                        <h2 className="mb-2 text-xl font-serif font-bold">{question}</h2>
                        <p className="leading-relaxed text-gray-700">{answer}</p>
                    </section>
                ))}
            </div>
        </article>
    </>
);

export default FAQ;
