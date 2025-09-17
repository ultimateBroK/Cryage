import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    console.log('useIsMobile useEffect mounted');
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      const newValue = window.innerWidth < MOBILE_BREAKPOINT;
      console.log('useIsMobile onChange:', { innerWidth: window.innerWidth, newValue, mqlMatches: mql.matches });
      setIsMobile(newValue)
    }
    mql.addEventListener("change", onChange)
    const initialValue = window.innerWidth < MOBILE_BREAKPOINT;
    console.log('useIsMobile initial set:', { innerWidth: window.innerWidth, initialValue, mqlMatches: mql.matches });
    setIsMobile(initialValue)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
