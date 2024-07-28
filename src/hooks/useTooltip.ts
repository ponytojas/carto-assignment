import {
  useCallback,
  useState
} from 'react'
import { Feature } from 'geojson'
import { PickingInfo } from 'deck.gl'

interface TooltipContent {
  object: { name: string, value: string }
  x: number
  y: number
}

interface TooltipHook {
  tooltipInfo: string | null
  tooltipPosition: { x: number, y: number }
  showTooltip: (info: TooltipContent) => void
}

const createTooltipContent = (info: PickingInfo<Feature>): string[] => {
  const { properties } = info.object
  const lines: string[] = []
  for (const key in properties) {
    const value: string = typeof properties[key] === 'string' ? properties[key] : JSON.stringify(properties[key])
    lines.push(`${key}: ${value}`)
  }
  return lines.join('\n')
}

const useTooltip = (): TooltipHook => {
  const [tooltip, setTooltip] = useState({ info: null, position: { x: 0, y: 0 } })

  const showTooltip = useCallback((info) => {
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
