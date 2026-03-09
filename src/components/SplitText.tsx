import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export interface SplitTextProps {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  ease?: string;
  splitType?: 'chars' | 'words';
  from?: gsap.TweenVars;
  to?: gsap.TweenVars;
  threshold?: number;
  rootMargin?: string;
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';
  textAlign?: React.CSSProperties['textAlign'];
  onLetterAnimationComplete?: () => void;
}

const SplitText: React.FC<SplitTextProps> = ({
  text,
  className = '',
  delay = 50,
  duration = 1.25,
  ease = 'power3.out',
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = '-100px',
  tag = 'p',
  textAlign = 'center',
  onLetterAnimationComplete
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const animatedRef = useRef(false);

  useEffect(() => {
    if (document.fonts.status === 'loaded') {
      setFontsLoaded(true);
    } else {
      document.fonts.ready.then(() => setFontsLoaded(true));
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current || !fontsLoaded || animatedRef.current) return;

    const el = containerRef.current;
    const spans = el.querySelectorAll('.split-unit');
    if (spans.length === 0) return;

    gsap.set(spans, { ...from });

    const startPct = (1 - threshold) * 100;
    const marginMatch = /^(-?\d+(?:\.\d+)?)(px|em|rem|%)?$/.exec(rootMargin);
    const marginValue = marginMatch ? parseFloat(marginMatch[1]) : 0;
    const marginUnit = marginMatch ? marginMatch[2] || 'px' : 'px';
    const sign =
      marginValue === 0
        ? ''
        : marginValue < 0
          ? `-=${Math.abs(marginValue)}${marginUnit}`
          : `+=${marginValue}${marginUnit}`;
    const start = `top ${startPct}%${sign}`;

    gsap.to(spans, {
      ...to,
      duration,
      ease,
      stagger: delay / 1000,
      scrollTrigger: {
        trigger: el,
        start,
        once: true,
      },
      onComplete: () => {
        animatedRef.current = true;
        onLetterAnimationComplete?.();
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === el) st.kill();
      });
    };
  }, [text, fontsLoaded, delay, duration, ease, from, to, threshold, rootMargin, onLetterAnimationComplete]);

  const renderSplitContent = () => {
    if (splitType === 'words') {
      return text.split(' ').map((word, i) => (
        <span key={i} className="split-unit inline-block" style={{ willChange: 'transform, opacity' }}>
          {word}{i < text.split(' ').length - 1 ? '\u00A0' : ''}
        </span>
      ));
    }
    // chars
    return text.split('').map((char, i) => (
      <span
        key={i}
        className="split-unit inline-block"
        style={{ willChange: 'transform, opacity' }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  const Tag = (tag || 'p') as React.ElementType;

  return (
    <Tag
      ref={containerRef}
      className={`inline-block whitespace-normal ${className}`}
      style={{ textAlign, wordWrap: 'break-word' as const }}
    >
      {renderSplitContent()}
    </Tag>
  );
};

export default SplitText;
