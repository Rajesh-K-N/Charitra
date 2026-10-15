import { Link } from 'react-router-dom';
import Seo from '../components/Seo';

const NotFound = () => (
    <>
        <Seo title="Page Not Found | Charitra" description="The page you requested could not be found." noIndex />
        <section className="container mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
            <h1 className="mb-4 text-4xl font-serif font-bold">Page not found</h1>
            <p className="mb-6 text-gray-700">That path is not part of this reading journey.</p>
            <Link to="/" className="rounded-lg bg-maroon px-6 py-3 font-bold text-white hover:bg-maroon-light focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-maroon">
                Return home
            </Link>
        </section>
    </>
);

export default NotFound;
