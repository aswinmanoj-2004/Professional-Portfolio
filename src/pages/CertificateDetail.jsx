import { useParams, Link } from 'react-router-dom';
import { certifications, profile } from '../data/portfolio';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';

function previewUrl(url) {
  const match = url.match(/\/d\/([^/]+)/);
  if (!match) return url;
  return `https://drive.google.com/file/d/${match[1]}/preview`;
}

export default function CertificateDetail({ onContact }) {
  const { id } = useParams();
  const cert = certifications.find((c) => c.id === id);

  if (!cert) {
    return (
      <PageTransition reduced={false} delay={0}>
        <section className="section">
          <div className="shell">
            <p className="label">Not found</p>
            <h1 className="display mt-4 text-3xl">This certificate does not exist.</h1>
            <Link to="/certifications" className="mt-6 inline-block text-ember">
              Back to Certificates
            </Link>
          </div>
        </section>
      </PageTransition>
    );
  }

  return (
    <PageTransition reduced={false} delay={0}>
      <section className="pb-8 pt-[calc(var(--bar-h)+4rem)]">
        <div className="shell">
          <Link
            to="/certifications"
            className="font-mono text-[0.6875rem] uppercase tracking-label text-muted transition-colors hover:text-ember"
          >
            ← Back to Certificates
          </Link>
          <p className="label mt-6">{cert.issuer}</p>
          <h1 className="display h1 mt-4 max-w-[20ch]">{cert.title}</h1>
        </div>
      </section>

      <section className="section pt-4">
        <div className="shell">
          <div className="overflow-hidden rounded-card border border-line bg-panel">
            <div className="aspect-[4/3] w-full">
              <iframe
                src={previewUrl(cert.url)}
                title={cert.title}
                className="h-full w-full border-0"
                allow="autoplay"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href={cert.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--solid !py-2.5 !px-4 text-[0.8125rem]"
            >
              View on Google Drive <span aria-hidden="true">↗</span>
            </a>
            <Link
              to="/certifications"
              className="btn btn--ghost !py-2.5 !px-4 text-[0.8125rem]"
            >
              Back to Certificates
            </Link>
          </div>
        </div>
      </section>

      <Footer onContact={onContact} />
    </PageTransition>
  );
}
