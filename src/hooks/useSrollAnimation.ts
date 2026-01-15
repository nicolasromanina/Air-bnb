import { useScroll, useTransform, useSpring, type Easing } from "framer-motion";
import { useRef } from "react";

const easeOut: Easing = [0.33, 1, 0.68, 1];

export const useFadeInOnScroll = () => {
  return {
    initial: { opacity: 0, y: 40 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.7, ease: easeOut },
  };
};

export const useStaggerChildren = (staggerDelay = 0.1) => {
  return {
    initial: "hidden" as const,
    whileInView: "visible" as const,
    viewport: { once: true, margin: "-100px" },
    variants: {
      hidden: {},
      visible: {
        transition: {
          staggerChildren: staggerDelay,
        },
      },
    },
  };
};

export const useChildFadeIn = () => {
  return {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: easeOut } 
    },
  };
};

export const useParallax = (speed = 0.3) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [-100 * speed, 100 * speed]);
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  return { ref, y: smoothY };
};
