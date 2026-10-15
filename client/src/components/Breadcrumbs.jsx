import { Link } from 'react-router-dom';

const Breadcrumbs = ({ items }) => (
    <nav aria-label="Breadcrumb" className="container mx-auto px-4 pt-5">
        <ol className="flex flex-wrap gap-2 text-sm text-maroon/80">
            {items.map((item, index) => (
                <li key={item.label} className="flex items-center gap-2">
                    {index > 0 && <span aria-hidden="true">/</span>}
                    {item.to && index < items.length - 1
                        ? <Link className="underline underline-offset-2 hover:text-maroon" to={item.to}>{item.label}</Link>
                        : <span aria-current="page">{item.label}</span>}
                </li>
            ))}
        </ol>
    </nav>
);

export default Breadcrumbs;
