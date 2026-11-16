import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';

const certs = [
  {
    title: 'Course Completion Certificate',
    url: 'https://drive.google.com/file/d/1At08zjUIhTEAqqTkyB0cuv4ujBb1nFbj/view?usp=drive_link',
  },
  {
    title: 'Internship Certificate',
    url: 'https://drive.google.com/file/d/10OGaT2R-WuJvGWTLasyDilxwcS834Nps/view?usp=drive_link',
  },
];

function previewUrl(url) {
  const match = url.match(/\/d\/([^/]+)/);
  if (!match) return url;
  return `https://drive.google.com/file/d/${match[1]}/preview`;
}

export default function InternshipCertificatePage({ onContact }) {
  return (
    <PageTransition reduced={false} delay={0}>
      <section className="pb-8 pt-[calc(var(--bar-h)+4rem)]">
        <div className="shell">
          <Link
            to="/internship"
            className="font-mono text-[0.6875rem] uppercase tracking-label text-muted transition-colors hover:text-ember"
          >
            ← Back to Internship
          </Link>
          <p className="label mt-6">NeST Digital Academy</p>
          <h1 className="display h1 mt-4 max-w-[20ch]">Internship Certificates</h1>
        </div>
      </section>

      <section className="section pt-4">
        <div className="shell grid gap-6 lg:grid-cols-2">
          {certs.map((cert) => (
            <div key={cert.title} className="overflow-hidden rounded-card border border-line bg-panel">
              <div className="aspect-[4/3] w-full">
                <iframe
                  src={previewUrl(cert.url)}
                  title={cert.title}
                  className="h-full w-full border-0"
                  allow="autoplay"
                />
              </div>
              <div className="p-5">
                <h3 className="display text-xl">{cert.title}</h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={cert.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn--solid !py-2.5 !px-4 text-[0.8125rem]"
                  >
                    View on Google Drive <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="shell mt-6">
          <Link to="/internship" className="btn btn--ghost !py-2.5 !px-4 text-[0.8125rem]">
            Back to Internship
          </Link>
        </div>
      </section>

      <Footer onContact={onContact} />
    </PageTransition>
  );
}
