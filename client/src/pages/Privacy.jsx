import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../components/Seo';

const Privacy = () => (
    <>
        <Seo
            title="Privacy Policy | Charitra"
            description="Privacy information for Charitra, including account information, scripture reading progress, and browser storage."
        />
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Privacy' }]} />
        <article className="container mx-auto max-w-3xl px-4 py-10">
            <h1 className="mb-3 text-4xl font-serif font-bold">Privacy Policy</h1>
            <p className="mb-8 font-semibold text-maroon">Draft — complete the marked items before public launch.</p>
            <section className="mb-6">
                <h2 className="mb-2 text-xl font-serif font-bold">Information this app stores</h2>
                <p className="leading-relaxed text-gray-700">Charitra stores the name and email address you provide, a bcrypt password hash, and your reading progress, points, and streaks in MongoDB. A necessary, one-hour HttpOnly session cookie keeps you signed in. The app does not currently include analytics or advertising scripts.</p>
            </section>
            <section className="mb-6">
                <h2 className="mb-2 text-xl font-serif font-bold">Service providers and retention</h2>
                <p className="leading-relaxed text-gray-700">TODO: identify the actual hosting and database providers, the data location, retention period, deletion process, and any other processors before launch.</p>
            </section>
            <section className="mb-6">
                <h2 className="mb-2 text-xl font-serif font-bold">Your choices and contact</h2>
                <p className="leading-relaxed text-gray-700">TODO: add the operator's legal name, contact email, and the process for account/data access or deletion requests.</p>
            </section>
            <p className="text-sm text-gray-600">Last updated: TODO</p>
        </article>
    </>
);

export default Privacy;
