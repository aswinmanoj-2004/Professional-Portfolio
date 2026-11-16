import { certifications, certificationsSection } from '../data/portfolio';
import CertCard from './CertCard';

export default function CertGrid() {
  return (
    <section id="certifications" className="section">
      <div className="shell">
        <div data-reveal className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="label">{certificationsSection.eyebrow}</p>
            <h2 className="display h2 mt-3 max-w-[12ch]">{certificationsSection.title}</h2>
          </div>
          <p className="lede max-w-[34ch]">{certificationsSection.sub}</p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert, i) => (
            <li key={cert.id} data-reveal data-reveal-delay={(i % 3) * 0.08}>
              <CertCard cert={cert} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
