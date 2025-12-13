import { useEffect, useState, RefObject } from 'react';

/**
 * Calculate relative luminance of a color (WCAG formula)
 * @param r Red channel (0-255)
 * @param g Green channel (0-255)
 * @param b Blue channel (0-255)
 * @returns Relative luminance (0-1)
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate contrast ratio between two colors (WCAG formula)
 * @param l1 Luminance of color 1
 * @param l2 Luminance of color 2
 * @returns Contrast ratio (1-21)
 */
function getContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Parse RGB color string to components
 * @param rgbString RGB color string (e.g., "rgb(255, 255, 255)")
 * @returns [r, g, b] or null if invalid
 */
function parseRGB(rgbString: string): [number, number, number] | null {
  const match = rgbString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (!match) return null;
  return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
}

/**
 * Get the best contrasting text color for a given background
 * Ensures WCAG AA compliance (4.5:1 for normal text)
 * @param backgroundColor RGB string or computed style
 * @returns '#ffffff' or '#000000' based on best contrast
 */
export function getContrastingTextColor(backgroundColor: string): string {
  const rgb = parseRGB(backgroundColor);
  if (!rgb) return '#ffffff'; // Default to white if can't parse

  const bgLuminance = getRelativeLuminance(rgb[0], rgb[1], rgb[2]);
  
  // Luminance of white and black
  const whiteLuminance = 1;
  const blackLuminance = 0;
  
  const contrastWithWhite = getContrastRatio(bgLuminance, whiteLuminance);
  const contrastWithBlack = getContrastRatio(bgLuminance, blackLuminance);
  
  // Choose color with better contrast, prefer white for dark backgrounds
  return contrastWithWhite >= contrastWithBlack ? '#ffffff' : '#000000';
}

/**
 * React hook to automatically determine text color based on background
 * @param ref Reference to the element to check background color
 * @returns Object with textColor and contrastRatio
 */
export function useAutoContrast(ref: RefObject<HTMLElement>) {
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [contrastRatio, setContrastRatio] = useState<number>(21);

  useEffect(() => {
    if (!ref.current) return;

    const updateTextColor = () => {
      if (!ref.current) return;
      
      const computedStyle = window.getComputedStyle(ref.current);
      const backgroundColor = computedStyle.backgroundColor;
      
      const color = getContrastingTextColor(backgroundColor);
      setTextColor(color);
      
      // Calculate actual contrast ratio for monitoring
      const rgb = parseRGB(backgroundColor);
      if (rgb) {
        const bgLuminance = getRelativeLuminance(rgb[0], rgb[1], rgb[2]);
        const textRgb = color === '#ffffff' ? [255, 255, 255] : [0, 0, 0];
        const textLuminance = getRelativeLuminance(textRgb[0], textRgb[1], textRgb[2]);
        const ratio = getContrastRatio(bgLuminance, textLuminance);
        setContrastRatio(ratio);
      }
    };

    // Initial calculation
    updateTextColor();

    // Update on theme changes or window resize
    const observer = new MutationObserver(updateTextColor);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'style'],
    });

    window.addEventListener('resize', updateTextColor);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateTextColor);
    };
  }, [ref]);

  return { textColor, contrastRatio, isAACompliant: contrastRatio >= 4.5 };
}

/**
 * Get text color class based on background color
 * @param backgroundColor Background color string
 * @returns Tailwind class for text color
 */
export function getAutoContrastClass(backgroundColor: string): string {
  const color = getContrastingTextColor(backgroundColor);
  return color === '#ffffff' ? 'text-white' : 'text-black';
}
