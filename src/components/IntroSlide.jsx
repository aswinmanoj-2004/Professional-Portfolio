import { motion } from 'framer-motion';

const letters = 'ASWIN'.split('');

export default function IntroSlide({ onExplore }) {
  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
      <div className="text-center">
        <motion.h1
          className="text-[clamp(4rem,14vw,10rem)] font-black leading-[0.9] tracking-normal"
          style={{ fontFamily: "'Tanker', sans-serif", fontWeight: 400 }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        >
          Hi, I'm Aswin.
        </motion.h1>

        <motion.button
          type="button"
          onClick={onExplore}
          className="mt-10 rounded-full border border-ember/40 bg-ember/10 px-6 py-3 text-[0.8125rem] font-medium text-ember backdrop-blur transition-colors hover:bg-ember hover:text-bg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          Explore My Portfolio →
        </motion.button>
      </div>
    </div>
  );
}
