import {
  useCallback,
  useState
} from 'react'
import { Feature } from 'geojson'
import type { PickingInfo } from '@deck.gl/core'

interface TooltipHook {
  tooltipInfo: string | null
  tooltipPosition: { x: number, y: number }
  showTooltip: (info: PickingInfo) => void
}

interface TooltipState {
  info: string | null
  position: { x: number, y: number }
}

const createTooltipContent = (info: PickingInfo): string => {
  const { properties } = info.object
  const lines: string[] = []
  for (const key in properties) {
    const value: string = typeof properties[key] === 'string' ? properties[key] : JSON.stringify(properties[key])
    lines.push(`${key}: ${value}`)
  }
  return lines.join('\n')
}

const useTooltip = (): TooltipHook => {
  const [tooltip, setTooltip] = useState<TooltipState>({ info: null, position: { x: 0, y: 0 } })

  const showTooltip = useCallback((info: PickingInfo) => {
    const { object } = info ?? null
    if (object === null || object === undefined) {
      setTooltip({ info: null, position: { x: 0, y: 0 } })
      return
    }
    const tooltipText = createTooltipContent(info)
    setTooltip({ info: tooltipText, position: { x: info.x, y: info.y } })
  }, [])

  return {
    tooltipInfo: tooltip.info,
    tooltipPosition: tooltip.position,
    showTooltip
  }
}

export default useTooltip
