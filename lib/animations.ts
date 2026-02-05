import { Variants } from 'framer-motion';

// Fade in with upward slide
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // Custom easing for smooth feel
    },
  },
};

// Blur reveal animation
export const blurReveal: Variants = {
  hidden: {
    opacity: 0,
    filter: 'blur(10px)',
  },
  visible: {
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.8,
      ease: 'easeOut',
    },
  },
};

// Stagger container for list animations
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Stagger item (child of staggerContainer)
export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// Scale in animation
export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// Slide in from left
export const slideInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// Slide in from right
export const slideInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 30,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// Glassmorphism hover effect
export const glassHover = {
  rest: {
    scale: 1,
    backdropFilter: 'blur(20px)',
  },
  hover: {
    scale: 1.02,
    backdropFilter: 'blur(25px)',
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

// Navigation scroll animation
export const navScroll = {
  top: {
    backgroundColor: 'rgba(254, 249, 239, 0)',
    backdropFilter: 'blur(0px)',
  },
  scrolled: {
    backgroundColor: 'rgba(254, 249, 239, 0.9)',
    backdropFilter: 'blur(20px)',
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
};

/**
 * GSAP ScrollTrigger configuration presets
 */

export const gsapScrollConfig = {
  // Section reveal on scroll
  sectionReveal: {
    opacity: 0,
    y: 50,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      start: 'top 80%',
      end: 'top 50%',
      toggleActions: 'play none none reverse',
    },
  },

  // Parallax background effect
  parallaxBg: {
    y: '30%',
    ease: 'none',
    scrollTrigger: {
      scrub: 1,
    },
  },

  // Staggered list reveal
  staggerList: {
    opacity: 0,
    y: 30,
    stagger: 0.1,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
  },
};

/**
 * Utility function for counter animation
 */
export const animateCounter = (
  element: HTMLElement,
  target: number,
  duration: number = 2000,
  suffix: string = ''
) => {
  const start = 0;
  const increment = target / (duration / 16); // 60fps
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target.toLocaleString() + suffix;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current).toLocaleString() + suffix;
    }
  }, 16);
};
