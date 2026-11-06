import React, { useEffect, useRef } from 'react';
import { motion, useInView, animate } from 'framer-motion';

export const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({ children, delay = 0, className = '' }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 32 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

export const Counter: React.FC<{ to: number; suffix?: string }> = ({ to, suffix = '' }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, {
      duration: 2,
      ease: 'easeOut',
      onUpdate: (v) => { if (ref.current) ref.current.textContent = Math.round(v) + suffix; },
    });
    return () => c.stop();
  }, [inView, to, suffix]);
  return <span ref={ref}>0{suffix}</span>;
};

import { useScroll, useSpring } from 'framer-motion';

export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div style={{ scaleX: x }} className="fixed top-0 inset-x-0 h-[2px] bg-brand origin-left z-[60]" />;
};

export const Eyebrow: React.FC<{ n: string; children: React.ReactNode }> = ({ n, children }) => (
  <p className="label mb-4"><span className="text-white/35 mr-3">{n}</span>{children}</p>
);

// Révélation mot par mot, masquée
export const MaskText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => (
  <span className={className}>
    {text.split(' ').map((w, i) => (
      <span key={i} className="inline-block overflow-hidden align-bottom mr-[.25em]">
        <motion.span
          className="inline-block"
          initial={{ y: '110%' }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          {w}
        </motion.span>
      </span>
    ))}
  </span>
);