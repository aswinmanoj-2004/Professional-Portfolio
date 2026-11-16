import { useEffect, useState } from 'react';
import { House, UserRound, Code, BriefcaseBusiness, Award, GraduationCap, Building2, Mail, Sun, Moon, Menu, X } from 'lucide-react';
import { useTheme } from '../lib/hooks';
import { requestNavigate } from '../lib/nav';

const items = [
  { label: 'Home', Icon: House, action: () => requestNavigate('/#hero') },
  { label: 'Profile', Icon: UserRound, action: () => requestNavigate('/#profile') },
  { label: 'Expertise', Icon: Code, action: () => requestNavigate('/expertise') },
  { label: 'Selected Works', Icon: BriefcaseBusiness, action: () => requestNavigate('/projects') },
  { label: 'Credentials', Icon: Award, action: () => requestNavigate('/certifications') },
  { label: 'Academic Journey', Icon: GraduationCap, action: () => requestNavigate('/story') },
  { label: 'Internship', Icon: Building2, action: () => requestNavigate('/internship') },
  { label: "Let's Connect", Icon: Mail, action: () => requestNavigate('/contact') },
];

export default function FloatingNav({ theme, onToggleTheme, onBrandClick }) {
  const [open, setOpen] = useState(false);
  const [brandStyle, setBrandStyle] = useState({ opacity: 1, filter: 'blur(0px)' });

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const fadeStart = 40;
      const fadeEnd = 160;
      const t = Math.min(1, Math.max(0, (y - fadeStart) / (fadeEnd - fadeStart)));
      const opacity = 1 - t;
      const blur = t * 4;
      setBrandStyle({ opacity, filter: `blur(${blur}px)` });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const run = (fn) => { fn(); setOpen(false); };

  return (
    <header className="fixed inset-x-0 top-0 z-[100]">
      <div className="shell flex h-[var(--bar-h)] items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBrandClick}
          className="group transition-opacity hover:opacity-80"
          style={brandStyle}
        >
          <span
            className="text-3xl tracking-[0.02em] text-fg"
            style={{ fontFamily: "'Teko', sans-serif", fontWeight: 600 }}
          >
            Aswin<span className="text-ember">.</span>
          </span>
        </button>

        {/* Desktop inline icons */}
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {items.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              title={item.label}
              className="group relative grid h-9 w-9 place-items-center rounded-full text-fg/70 transition-all duration-300 hover:scale-125 hover:rotate-6 hover:text-ember"
            >
              <item.Icon className="h-5 w-5" />
              <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-[0.625rem] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                {item.label}
              </span>
            </button>
          ))}
          <button
            type="button"
            onClick={onToggleTheme}
            title="Theme"
            className="group relative grid h-9 w-9 place-items-center rounded-full text-fg/70 transition-all duration-300 hover:scale-125 hover:rotate-6 hover:text-ember"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="pointer-events-none absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-[0.625rem] font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
              Theme
            </span>
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center rounded-lg text-fg lg:hidden"
          aria-label="Menu"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-bg/80 px-4 py-3 backdrop-blur-xl lg:hidden">
          <nav className="flex flex-col gap-1">
            {items.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => run(item.action)}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-fg/80 transition-colors hover:bg-fg/10 hover:text-fg"
              >
                <item.Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
            <button
              type="button"
              onClick={() => { onToggleTheme(); setOpen(false); }}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-fg/80 transition-colors hover:bg-fg/10 hover:text-fg"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span>Theme</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
