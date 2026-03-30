import * as React from "react";

const MOBILE_BREAKPOINT = 768;

/**
 * Custom Hook: useIsMobile
 * Dynamically detects if the user's viewport is currently at a mobile size.
 * Automatically updates if the user resizes their browser window or rotates their device.
 * * @returns {boolean} True if viewport width is < 768px, false otherwise.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
