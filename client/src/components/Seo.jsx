import { useEffect } from 'react';

const setMeta = (attribute, key, value) => {
    let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
    if (!value) {
        element?.remove();
        return;
    }
    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, key);
        document.head.appendChild(element);
    }
    element.setAttribute('content', value);
};

const Seo = ({ title, description, noIndex = false }) => {
    useEffect(() => {
        document.title = title;
        setMeta('name', 'description', description);
        setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');
        setMeta('property', 'og:title', title);
        setMeta('property', 'og:description', description);
        setMeta('property', 'og:type', 'website');
        setMeta('property', 'og:image', `${window.location.origin}/social-share.svg`);
        setMeta('name', 'twitter:card', 'summary_large_image');
        setMeta('name', 'twitter:title', title);
        setMeta('name', 'twitter:description', description);
        setMeta('name', 'twitter:image', `${window.location.origin}/social-share.svg`);

        const siteUrl = import.meta.env.VITE_SITE_URL?.replace(/\/+$/, '');
        const canonicalUrl = siteUrl
            ? new URL(window.location.pathname, `${siteUrl}/`).href
            : '';
        setMeta('property', 'og:url', canonicalUrl);

        let canonical = document.head.querySelector('link[rel="canonical"]');
        if (canonicalUrl) {
            if (!canonical) {
                canonical = document.createElement('link');
                canonical.rel = 'canonical';
                document.head.appendChild(canonical);
            }
            canonical.href = canonicalUrl;
        } else {
            canonical?.remove();
        }

        const verification = import.meta.env.VITE_GSC_VERIFICATION;
        setMeta('name', 'google-site-verification', verification);

        let structuredData = document.head.querySelector('#charitra-structured-data');
        if (!structuredData) {
            structuredData = document.createElement('script');
            structuredData.id = 'charitra-structured-data';
            structuredData.type = 'application/ld+json';
            document.head.appendChild(structuredData);
        }
        structuredData.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: 'Charitra',
            applicationCategory: 'EducationalApplication',
            operatingSystem: 'Web',
            ...(siteUrl ? { url: siteUrl } : {})
        });
    }, [title, description, noIndex]);

    return null;
};

export default Seo;
