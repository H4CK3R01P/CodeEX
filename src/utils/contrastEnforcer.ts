/**
 * Runtime Contrast Enforcer
 * Detects background colors and enforces proper text contrast dynamically
 * Runs continuously to catch any dynamically created elements
 */

interface RGB {
  r: number;
  g: number;
  b: number;
}

/**
 * Parse any color format to RGB
 */
function parseColor(color: string): RGB | null {
  // Handle rgb/rgba format
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    return {
      r: parseInt(rgbMatch[1]),
      g: parseInt(rgbMatch[2]),
      b: parseInt(rgbMatch[3])
    };
  }

  // Handle hex format
  const hexMatch = color.match(/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (hexMatch) {
    return {
      r: parseInt(hexMatch[1], 16),
      g: parseInt(hexMatch[2], 16),
      b: parseInt(hexMatch[3], 16)
    };
  }

  // Handle named colors by creating a temporary element
  if (color && !color.includes('transparent')) {
    const temp = document.createElement('div');
    temp.style.color = color;
    document.body.appendChild(temp);
    const computed = window.getComputedStyle(temp).color;
    document.body.removeChild(temp);
    return parseColor(computed);
  }

  return null;
}

/**
 * Calculate relative luminance (WCAG formula)
 */
function getRelativeLuminance(rgb: RGB): number {
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(l1: number, l2: number): number {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Determine if should use white or black text on given background
 */
function shouldUseWhiteText(bgColor: string): boolean {
  const rgb = parseColor(bgColor);
  if (!rgb) return false; // Default to false if can't parse

  const luminance = getRelativeLuminance(rgb);
  
  // Calculate contrast with white and black
  const whiteLuminance = 1;
  const blackLuminance = 0;
  
  const contrastWithWhite = getContrastRatio(luminance, whiteLuminance);
  const contrastWithBlack = getContrastRatio(luminance, blackLuminance);
  
  // Use white text if it has better contrast
  return contrastWithWhite >= contrastWithBlack;
}

/**
 * Check if element should be skipped (SVG, already enforced, etc.)
 */
function shouldSkipElement(element: HTMLElement): boolean {
  // Skip SVG elements
  if (element.tagName === 'svg' || element.tagName === 'SVG') return true;
  
  // Skip if element has explicit skip attribute
  if (element.hasAttribute('data-skip-contrast')) return true;
  
  // Skip input elements (they have their own styling)
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(element.tagName)) return true;
  
  return false;
}

/**
 * Get the actual background color of an element (including inherited)
 */
function getActualBackgroundColor(element: HTMLElement): string | null {
  let current: HTMLElement | null = element;
  
  while (current && current !== document.body) {
    const style = window.getComputedStyle(current);
    const bgColor = style.backgroundColor;
    
    // If we found a non-transparent background
    if (bgColor && !bgColor.includes('rgba(0, 0, 0, 0)') && bgColor !== 'transparent') {
      return bgColor;
    }
    
    current = current.parentElement;
  }
  
  // Default to body background
  return window.getComputedStyle(document.body).backgroundColor;
}

/**
 * Enforce contrast on a single element
 */
function enforceElementContrast(element: HTMLElement): void {
  if (shouldSkipElement(element)) return;
  
  // Only process text-containing elements
  const hasTextContent = element.childNodes && Array.from(element.childNodes).some(
    node => node.nodeType === Node.TEXT_NODE && node.textContent?.trim()
  );
  
  if (!hasTextContent && element.children.length > 0) return; // Has children, they'll be processed
  
  // Get background color
  const bgColor = getActualBackgroundColor(element);
  if (!bgColor) return;
  
  // Determine if we should use white text
  const useWhite = shouldUseWhiteText(bgColor);
  const textColor = useWhite ? '#ffffff' : '#0a0a0f';
  
  // Get current computed text color
  const currentColor = window.getComputedStyle(element).color;
  const currentRgb = parseColor(currentColor);
  const bgRgb = parseColor(bgColor);
  
  if (!currentRgb || !bgRgb) return;
  
  // Calculate current contrast ratio
  const currentLuminance = getRelativeLuminance(currentRgb);
  const bgLuminance = getRelativeLuminance(bgRgb);
  const currentContrast = getContrastRatio(currentLuminance, bgLuminance);
  
  // If current contrast is below WCAG AA (4.5:1), enforce proper contrast
  if (currentContrast < 4.5) {
    element.style.color = textColor;
    element.setAttribute('data-contrast-enforced', 'true');
    element.setAttribute('data-contrast-ratio', currentContrast.toFixed(2));
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`Contrast enforced on ${element.tagName}.${element.className}: ${currentContrast.toFixed(2)}:1 -> ${textColor}`);
    }
  }
}

/**
 * Process all elements in a container
 */
function processContainer(container: HTMLElement = document.body): void {
  // Process the container itself
  enforceElementContrast(container);
  
  // Process all children
  const allElements = container.querySelectorAll('*');
  allElements.forEach(el => {
    if (el instanceof HTMLElement) {
      enforceElementContrast(el);
    }
  });
}

/**
 * Initialize the contrast enforcer
 */
export function initializeContrastEnforcer(): () => void {
  // Initial enforcement
  processContainer();
  
  // Create a MutationObserver to watch for DOM changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      // Process added nodes
      mutation.addedNodes.forEach((node) => {
        if (node instanceof HTMLElement) {
          processContainer(node);
        }
      });
      
      // Process attribute changes (class, style changes)
      if (mutation.type === 'attributes' && mutation.target instanceof HTMLElement) {
        if (mutation.attributeName === 'class' || mutation.attributeName === 'style') {
          enforceElementContrast(mutation.target);
        }
      }
    });
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style']
  });
  
  // Re-process on theme changes
  const themeObserver = new MutationObserver(() => {
    processContainer();
  });
  
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class', 'data-theme']
  });
  
  // Re-process on window resize (in case responsive styles change backgrounds)
  let resizeTimeout: NodeJS.Timeout;
  const handleResize = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => processContainer(), 100);
  };
  window.addEventListener('resize', handleResize);
  
  // Return cleanup function
  return () => {
    observer.disconnect();
    themeObserver.disconnect();
    window.removeEventListener('resize', handleResize);
  };
}

/**
 * Manually trigger contrast enforcement (useful for SPAs)
 */
export function enforceContrast(): void {
  processContainer();
}

/**
 * Export utility functions for external use
 */
export { shouldUseWhiteText, getContrastRatio, getRelativeLuminance, parseColor };
