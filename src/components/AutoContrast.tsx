import { ReactNode, useRef, useEffect, CSSProperties } from 'react';
import { useAutoContrast } from '../hooks/useAutoContrast';

interface AutoContrastProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: keyof JSX.IntrinsicElements;
  enforceContrast?: boolean;
}

/**
 * AutoContrast wrapper component that automatically adjusts text color
 * based on the computed background color of its container.
 * 
 * Ensures WCAG AA compliance (4.5:1 contrast ratio) automatically.
 * 
 * @example
 * <AutoContrast className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
 *   <h1>This text will be white automatically</h1>
 *   <p>All children inherit the contrasting color</p>
 * </AutoContrast>
 */
export function AutoContrast({ 
  children, 
  className = '', 
  style = {},
  as: Component = 'div',
  enforceContrast = true
}: AutoContrastProps) {
  const ref = useRef<HTMLElement>(null);
  const { textColor, contrastRatio, isAACompliant } = useAutoContrast(ref);

  useEffect(() => {
    if (!isAACompliant && process.env.NODE_ENV === 'development') {
      console.warn(
        `AutoContrast: Contrast ratio ${contrastRatio.toFixed(2)}:1 is below WCAG AA standard (4.5:1)`,
        ref.current
      );
    }
  }, [contrastRatio, isAACompliant]);

  const autoStyle: CSSProperties = enforceContrast
    ? { ...style, color: textColor }
    : style;

  return (
    <Component
      ref={ref as any}
      className={className}
      style={autoStyle}
      data-contrast-ratio={contrastRatio.toFixed(2)}
      data-wcag-aa={isAACompliant ? 'pass' : 'fail'}
    >
      {children}
    </Component>
  );
}

/**
 * Text component that automatically contrasts with its background
 */
export function AutoContrastText({ 
  children, 
  className = '',
  as: Component = 'span'
}: Omit<AutoContrastProps, 'enforceContrast'>) {
  return (
    <AutoContrast as={Component} className={className} enforceContrast={true}>
      {children}
    </AutoContrast>
  );
}
