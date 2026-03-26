export const motionPage = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
};

export const staggerChildren = {
  animate: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};

export const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
};
