import { useRef } from 'react'

export function useIsFirstRender (): React.MutableRefObject<boolean> {
  const renderRef = useRef(true)

  if (renderRef.current) {
    renderRef.current = false
    return true
  }

  return renderRef.current
}
