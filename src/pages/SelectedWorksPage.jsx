import { projects } from '../data/portfolio';
import ProjectCard from '../components/ProjectCard';
import Footer from '../components/Footer';
import PageTransition from '../components/PageTransition';

export default function SelectedWorksPage({ onContact }) {
  const list = projects.filter((p) => p.id === 'digital-library' || p.id === 'aquarium-store');

  return (
    <PageTransition reduced={false} delay={0}>
      <section className="pb-8 pt-[calc(var(--bar-h)+4rem)]">
        <div className="shell">
          <p className="label">Selected Works</p>
          <h1 className="display h1 mt-4 max-w-[13ch]">Two builds, end to end</h1>
          <p className="lede mt-6 max-w-[50ch]">
            Full-stack projects from my resume — a digital library platform and an aquarium store.
          </p>
        </div>
      </section>

      <div>
        {list.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} coarse={false} reduced={false} />
        ))}
      </div>

      <Footer onContact={onContact} />
    </PageTransition>
  );
}
