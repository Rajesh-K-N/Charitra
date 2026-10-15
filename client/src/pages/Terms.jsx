import Breadcrumbs from '../components/Breadcrumbs';
import Seo from '../components/Seo';

const Terms = () => (
    <>
        <Seo
            title="Terms of Use | Charitra"
            description="Draft terms for using Charitra's scripture reading and progress-tracking application."
        />
        <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Terms' }]} />
        <article className="container mx-auto max-w-3xl px-4 py-10">
            <h1 className="mb-3 text-4xl font-serif font-bold">Terms of Use</h1>
            <p className="mb-8 font-semibold text-maroon">Draft — have the actual operator review and complete these terms before public launch.</p>
            <section className="mb-6">
                <h2 className="mb-2 text-xl font-serif font-bold">Using Charitra</h2>
                <p className="leading-relaxed text-gray-700">TODO: specify eligibility, account responsibilities, acceptable use, and the rules for account suspension or deletion.</p>
            </section>
            <section className="mb-6">
                <h2 className="mb-2 text-xl font-serif font-bold">Content and availability</h2>
                <p className="leading-relaxed text-gray-700">The app currently contains a limited sample of scripture content and may change. TODO: confirm content sources, rights, disclaimers, and service availability terms.</p>
            </section>
            <section className="mb-6">
                <h2 className="mb-2 text-xl font-serif font-bold">Operator and effective date</h2>
                <p className="leading-relaxed text-gray-700">TODO: add the operator's legal name, contact details, governing jurisdiction, and effective date.</p>
            </section>
        </article>
    </>
);

export default Terms;
