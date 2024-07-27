import 'mapbox-gl/dist/mapbox-gl.css'
import 'maplibre-gl/dist/maplibre-gl.css'

import React from 'react'

import { Map as MapboxMap } from 'react-map-gl'
import {
  Map as MaplibreMap,
  useControl
} from 'react-map-gl/maplibre'

import { MapboxOverlay as DeckOverlay } from '@deck.gl/mapbox'
import { DeckGL } from '@deck.gl/react'

interface MapWrapperProps {
  mapConfig: {
    mapboxToken: string
    mapRef: React.MutableRefObject<any>
    mapStyle: string
  }
  deckGlConfig: {
    initialViewState: any
    onHover?: (event: any) => void
    onClick?: (event: any) => void
    onViewStateChange?: (event: any) => void
  }
  children: React.ReactNode
  layers: any[]
}

const DeckGLOverlay = (props): void => {
  const overlay = useControl(() => new DeckOverlay(props))
  overlay.setProps(props)
  return null
}

export const MapWrapper: React.FC<MapWrapperProps> = ({
  mapConfig,
  deckGlConfig,
  children,
  layers
}) => {
  const {
    mapboxToken, mapRef, mapStyle
  } = mapConfig

  const {
    initialViewState, onHover = () => {}, onClick = () => {}, onViewStateChange = () => {}
  } = deckGlConfig

  return (
    mapboxToken !== null && mapboxToken !== undefined
      ? (
        <DeckGL
          getCursor={() => 'inherit'}
          controller
          layers={layers}
          initialViewState={initialViewState}
          onHover={onHover}
          onClick={onClick}
          onViewStateChange={onViewStateChange}
        >
          <MapboxMap
            ref={mapRef}
            reuseMaps
            useDevicePixels={false}
            preventStyleDiffing
            mapboxAccessToken={mapboxToken}
            attributionControl={false}
            mapStyle={mapStyle}
          />
          {children}
        </DeckGL>

        )
      : (
        <MaplibreMap initialViewState={initialViewState} mapStyle={mapStyle} attributionControl={false}>
          <DeckGLOverlay
            getCursor={() => 'inherit'}
            layers={layers}
            interleaved
            onClick={onClick}
            onHover={onHover}
            onViewStateChange={onViewStateChange}
          />
          {children}
        </MaplibreMap>
        )
  )
}
