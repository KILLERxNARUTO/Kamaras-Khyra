'use client';

import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import './FlowingMenu.css';

export interface MenuItemData {
  id: string;
  text: string;
  subtitle?: string;
  count?: number;
  link?: string;
  image: string;
  active?: boolean;
  onClick?: () => void;
}

export interface FlowingMenuProps {
  items: MenuItemData[];
  speed?: number;
  textColor?: string;
  bgColor?: string;
  marqueeBgColor?: string;
  marqueeTextColor?: string;
  borderColor?: string;
  onSelect?: (id: string) => void;
}

export default function FlowingMenu({
  items = [],
  speed = 15,
  textColor = '#f8f5ef',
  bgColor = 'transparent',
  marqueeBgColor = '#f5cf47',
  marqueeTextColor = '#0b1510',
  borderColor = 'rgba(107, 143, 113, 0.2)',
  onSelect,
}: FlowingMenuProps) {
  return (
    <div className="flowing-menu-wrap" style={{ backgroundColor: bgColor }}>
      <nav className="flowing-menu">
        {items.map((item, idx) => (
          <MenuItem
            key={item.id || idx}
            index={idx}
            item={item}
            speed={speed}
            textColor={textColor}
            marqueeBgColor={marqueeBgColor}
            marqueeTextColor={marqueeTextColor}
            borderColor={borderColor}
            onSelect={onSelect}
          />
        ))}
      </nav>
    </div>
  );
}

interface MenuItemComponentProps {
  index: number;
  item: MenuItemData;
  speed: number;
  textColor: string;
  marqueeBgColor: string;
  marqueeTextColor: string;
  borderColor: string;
  onSelect?: (id: string) => void;
}

function MenuItem({
  index,
  item,
  speed,
  textColor,
  marqueeBgColor,
  marqueeTextColor,
  borderColor,
  onSelect,
}: MenuItemComponentProps) {
  const itemRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);
  const marqueeInnerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Tween | null>(null);
  const [repetitions, setRepetitions] = useState(4);

  const animationDefaults = { duration: 0.6, ease: 'expo.out' };

  const findClosestEdge = (mouseX: number, mouseY: number, width: number, height: number) => {
    const topEdgeDist = distMetric(mouseX, mouseY, width / 2, 0);
    const bottomEdgeDist = distMetric(mouseX, mouseY, width / 2, height);
    return topEdgeDist < bottomEdgeDist ? 'top' : 'bottom';
  };

  const distMetric = (x: number, y: number, x2: number, y2: number) => {
    const xDiff = x - x2;
    const yDiff = y - y2;
    return xDiff * xDiff + yDiff * yDiff;
  };

  useEffect(() => {
    const calculateRepetitions = () => {
      if (!marqueeInnerRef.current) return;
      const marqueeContent = marqueeInnerRef.current.querySelector('.flowing-menu__marquee-part') as HTMLElement;
      if (!marqueeContent) return;

      const contentWidth = marqueeContent.offsetWidth;
      const viewportWidth = window.innerWidth;

      const needed = Math.ceil(viewportWidth / (contentWidth || 1)) + 2;
      setRepetitions(Math.max(4, needed));
    };

    calculateRepetitions();
    window.addEventListener('resize', calculateRepetitions);
    return () => window.removeEventListener('resize', calculateRepetitions);
  }, [item.text, item.image]);

  useEffect(() => {
    const setupMarquee = () => {
      if (!marqueeInnerRef.current) return;

      const marqueeContent = marqueeInnerRef.current.querySelector('.flowing-menu__marquee-part') as HTMLElement;
      if (!marqueeContent) return;

      const contentWidth = marqueeContent.offsetWidth;
      if (contentWidth === 0) return;

      if (animationRef.current) {
        animationRef.current.kill();
      }

      animationRef.current = gsap.to(marqueeInnerRef.current, {
        x: -contentWidth,
        duration: speed,
        ease: 'none',
        repeat: -1,
      });
    };

    const timer = setTimeout(setupMarquee, 50);

    return () => {
      clearTimeout(timer);
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [item.text, item.image, repetitions, speed]);

  const handleMouseEnter = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .set(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .set(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0)
      .to([marqueeRef.current, marqueeInnerRef.current], { y: '0%' }, 0);
  };

  const handleMouseLeave = (ev: React.MouseEvent<HTMLDivElement>) => {
    if (!itemRef.current || !marqueeRef.current || !marqueeInnerRef.current) return;
    const rect = itemRef.current.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const edge = findClosestEdge(x, y, rect.width, rect.height);

    gsap
      .timeline({ defaults: animationDefaults })
      .to(marqueeRef.current, { y: edge === 'top' ? '-101%' : '101%' }, 0)
      .to(marqueeInnerRef.current, { y: edge === 'top' ? '101%' : '-101%' }, 0);
  };

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (item.onClick) item.onClick();
    if (onSelect) onSelect(item.id);
  };

  return (
    <div
      className="flowing-menu__item"
      ref={itemRef}
      style={{ borderColor }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      <a
        className="flowing-menu__item-link"
        href={item.link || '#'}
        style={{ color: item.active ? '#f5cf47' : textColor }}
      >
        <div className="flex items-center gap-4 sm:gap-6">
          <span className={`font-mono text-xs font-bold tracking-widest ${
            item.active ? 'text-antique-gold font-extrabold' : 'text-cream/40'
          }`}>
            0{index + 1}
          </span>
          <span className="font-serif">{item.text}</span>
        </div>

        <div className="flex items-center gap-4">
          {item.count !== undefined && (
            <span className={`text-xs font-mono px-3 py-1 rounded-full border transition-colors ${
              item.active
                ? 'border-antique-gold bg-antique-gold/20 text-antique-gold font-bold'
                : 'border-sage/20 bg-cream/5 text-cream/70'
            }`}>
              {item.count} Procedures
            </span>
          )}
          <span className="text-xl text-antique-gold transition-transform duration-300">
            →
          </span>
        </div>
      </a>

      {/* MARQUEE OVERLAY (React Bits Directional GSAP Reveal) */}
      <div className="flowing-menu__marquee" ref={marqueeRef} style={{ backgroundColor: marqueeBgColor }}>
        <div className="flowing-menu__marquee-inner-wrap">
          <div className="flowing-menu__marquee-inner" ref={marqueeInnerRef} aria-hidden="true">
            {[...Array(repetitions)].map((_, rIdx) => (
              <div className="flowing-menu__marquee-part" key={rIdx} style={{ color: marqueeTextColor }}>
                <span className="font-serif">{item.text}</span>
                <div
                  className="flowing-menu__marquee-img"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
