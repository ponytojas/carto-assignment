
import type { MapViewState } from '@deck.gl/core'
import type { GeoJsonLayerProps } from '@deck.gl/layers'

import useStore from '../../../utils/store'

interface HandleViewStateChange {
  viewState: MapViewState
}

const {
  setViewPoint
} = useStore.getState()

export const DEFAULT_GEOJSON_LAYER_PROPS: Partial<GeoJsonLayerProps> = {
  pickable: true,
  stroked: true,
  filled: true,
  extruded: false,
  lineWidthScale: 20,
  lineWidthMinPixels: 2,
  getLineColor: [160, 160, 180],
  getFillColor: [200, 200, 220, 140],
  getPointRadius: 100,
  getLineWidth: 1,
  getElevation: 30
}

const debounce = <F extends (...args: any[]) => void>(fn: F, time: number): F => {
  let timeout: NodeJS.Timeout

  return function (this: any, ...args: any[]) {
    const functionCall = () => fn.apply(this, args)

    clearTimeout(timeout)
    timeout = setTimeout(functionCall, time)
  } as F
}

const debouncedHandleViewStateChange = debounce(({ viewState }: HandleViewStateChange) => {
  setViewPoint(viewState)
}, 10)

export const handleViewStateChange = (info: MapViewState) => {
  debouncedHandleViewStateChange({ viewState: info })
}
