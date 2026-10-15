import { Link } from 'react-router-dom';

const Footer = () => (
    <footer className="mt-12 border-t border-gold/50 bg-maroon-dark px-4 py-6 text-center text-sm text-gold-light">
        <p className="mb-3">Charitra — a scripture reading and progress-tracking app.</p>
        <nav aria-label="Footer navigation" className="flex justify-center gap-5">
            <Link className="underline underline-offset-2 hover:text-white" to="/faq">FAQ</Link>
            <Link className="underline underline-offset-2 hover:text-white" to="/privacy">Privacy</Link>
            <Link className="underline underline-offset-2 hover:text-white" to="/terms">Terms</Link>
        </nav>
        <p className="mt-4 text-xs text-gold-light/90">Cookie notice: Charitra uses a necessary one-hour session cookie to keep you signed in. It does not currently use analytics or advertising cookies.</p>
    </footer>
);

export default Footer;
