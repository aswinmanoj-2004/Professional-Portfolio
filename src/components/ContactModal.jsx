import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { profile } from '../data/portfolio';

const EASE = [0.22, 1, 0.36, 1];
const EMPTY = { name: '', email: '', project: '', company: '' };

/**
 * "Start a project" modal. Validates, guards bots with a honeypot, opens a
 * prefilled mailto draft, then swaps to a success state.
 */
const ContactModal = forwardRef(function ContactModal(_props, ref) {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);
  const lastFocused = useRef(null);

  useImperativeHandle(ref, () => ({ open: () => setOpen(true) }), []);

  // Reset when closed so the draft is never half-filled on reopen.
  useEffect(() => {
    if (open) {
      lastFocused.current = document.activeElement;
      const id = window.setTimeout(() => firstFieldRef.current?.focus(), 320);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => {
      setSent(false);
      setValues(EMPTY);
      setErrors({});
      if (lastFocused.current instanceof HTMLElement) lastFocused.current.focus();
    }, 250);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;
      const items = Array.from(
        dialogRef.current?.querySelectorAll(
          'a[href], button:not([disabled]), input:not([type="hidden"]), textarea, select',
        ) || [],
      ).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const set = (key) => (event) => {
    setValues((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const mailtoHref = useMemo(() => {
    const subject = `Project enquiry — ${values.name || 'new project'}`;
    const body = [
      `Name: ${values.name}`,
      `Email: ${values.email}`,
      '',
      'Project brief:',
      values.project,
    ].join('\n');
    return `mailto:${profile.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }, [values]);

  const submit = (event) => {
    event.preventDefault();
    // Honeypot: a filled hidden-ish field means a bot — close silently.
    if (values.company.trim()) {
      setOpen(false);
      return;
    }

    const next = {};
    if (values.name.trim().length < 2) next.name = 'Please tell me your name.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()))
      next.email = 'That email does not look right.';
    if (values.project.trim().length < 15)
      next.project = 'A sentence or two about the project helps.';

    if (Object.keys(next).length) {
      setErrors(next);
      const firstKey = Object.keys(next)[0];
      dialogRef.current?.querySelector(`[name="${firstKey}"]`)?.focus();
      return;
    }

    window.location.href = mailtoHref;
    setSent(true);
  };

  const field =
    'w-full rounded-control border border-line bg-field px-4 py-3 text-[0.9375rem] text-fg placeholder:text-faint focus:border-ember/50 focus:outline-none transition-colors duration-300';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="contact-backdrop"
          className="fixed inset-0 z-[125] flex items-end justify-center p-0 sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            type="button"
            aria-label="Close dialog"
            onClick={() => setOpen(false)}
            className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
            tabIndex={-1}
          />

          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-title"
            className="relative w-full max-w-[560px] overflow-hidden rounded-t-card border border-line bg-panel shadow-[0_40px_90px_rgba(0,0,0,0.6)] sm:rounded-card"
            initial={{ y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 32, opacity: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-line p-6">
              <div>
                <p className="label">Start a project</p>
                <h2 id="contact-title" className="display mt-2 text-[clamp(1.35rem,2.6vw,1.9rem)]">
                  Tell me what you need built.
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btn btn--ghost !py-2 !px-3 text-[0.75rem]"
              >
                ✕ <span className="sr-only">Close</span>
              </button>
            </div>

            {sent ? (
              <div className="p-6">
                <p className="display text-[clamp(1.2rem,2.2vw,1.6rem)] text-ember">
                  Almost there.
                </p>
                <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
                  Your email app has opened with your message ready to go. Press send there and I’ll
                  reply within one business day.
                </p>
                <p className="mt-5 text-sm text-faint">
                  Email app didn’t open?{' '}
                  <a href={mailtoHref} className="text-rose underline underline-offset-4 hover:text-ember">
                    Write to my email.
                  </a>
                </p>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="btn btn--solid mt-7"
                  autoFocus
                >
                  Close
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="space-y-5 p-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="c-name" className="label label--plain mb-2">
                      Name
                    </label>
                    <input
                      id="c-name"
                      name="name"
                      ref={firstFieldRef}
                      value={values.name}
                      onChange={set('name')}
                      autoComplete="name"
                      className={field}
                      placeholder="Your name"
                      aria-invalid={Boolean(errors.name)}
                      aria-describedby={errors.name ? 'c-name-err' : undefined}
                    />
                    {errors.name && (
                      <p id="c-name-err" className="mt-2 text-[0.75rem] text-ember">
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="c-email" className="label label--plain mb-2">
                      Email
                    </label>
                    <input
                      id="c-email"
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={set('email')}
                      autoComplete="email"
                      className={field}
                      placeholder="you@company.com"
                      aria-invalid={Boolean(errors.email)}
                      aria-describedby={errors.email ? 'c-email-err' : undefined}
                    />
                    {errors.email && (
                      <p id="c-email-err" className="mt-2 text-[0.75rem] text-ember">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="c-project" className="label label--plain mb-2">
                    Project
                  </label>
                  <textarea
                    id="c-project"
                    name="project"
                    rows={5}
                    value={values.project}
                    onChange={set('project')}
                    className={`${field} resize-y`}
                    placeholder="What are we building? Stack, timeline, budget range — whatever you know so far."
                    aria-invalid={Boolean(errors.project)}
                    aria-describedby={errors.project ? 'c-project-err' : 'c-help'}
                  />
                  {errors.project && (
                    <p id="c-project-err" className="mt-2 text-[0.75rem] text-ember">
                      {errors.project}
                    </p>
                  )}
                </div>

                {/* honeypot */}
                <div className="absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden="true">
                  <label htmlFor="c-company">Leave this empty</label>
                  <input
                    id="c-company"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={values.company}
                    onChange={set('company')}
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <p id="c-help" className="text-[0.8125rem] text-faint">
                    {profile.replyNote}
                  </p>
                  <button type="submit" className="btn btn--solid">
                    Send the details <span className="btn__arrow">↗</span>
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default ContactModal;
