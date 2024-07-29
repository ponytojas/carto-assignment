import React, { useCallback, useEffect, useRef, useState } from 'react'
import { MapWrapper } from './MapWrapper'
import { Box, Button, Typography } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useNavigate } from 'react-router-dom'
import useStore from '../../utils/store'
import { NodeType } from '../../enums/flow'
import { GeoJsonLayer } from 'deck.gl'
import { DEFAULT_GEOJSON_LAYER_PROPS, handleViewStateChange } from './utils'
import useTooltip from '../../hooks/useTooltip'
import { CustomTooltip } from './utils/CustomTooltip'

export function Map (): JSX.Element {
  const viewPoint = useStore((state) => state.viewPoint) ?? { longitude: -73.9853, latitude: 40.7466, zoom: 12 }
  const storeData = useStore((state) => state.storeData)
  const nodes = useStore((state) => state.nodes)
  const edges = useStore((state) => state.edges)

  const [layersNode, setLayersNode] = useState([])
  const [layers, setLayers] = useState([])

  const height = window.innerHeight
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN
  const mapStyle = import.meta.env.VITE_MAP_THEME ?? 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
  const mapRef = useRef(null)

  const { tooltipInfo, tooltipPosition, showTooltip } = useTooltip()

  const navigateTo = useNavigate()

  const onHover = useCallback((info) => {
    showTooltip(info)
  }, [showTooltip])

  const mapConfig = {
    mapboxToken,
    mapRef,
    mapStyle
  }

  const deckGlConfig = {
    initialViewState: { ...viewPoint },
    onHover,
    onViewStateChange: (info) => handleViewStateChange(info)
  }

  const handleNavigate = (): void => {
    navigateTo('/flow')
  }

  useEffect(() => {
    if (nodes === null || nodes === undefined) return

    const _layersNodes = nodes
      .filter((node) => node.type === NodeType.LAYER)
      .sort((a, b) => b.position.y - a.position.y)

    setLayersNode(_layersNodes)
  }, [nodes])

  useEffect(() => {
    if (layersNode.length === 0) return

    const _filteredLayerNodesID = layersNode
      .filter((node) => edges.some((edge) => edge.target === node.id))
      .map((node) => node.id)

    const layerSourceTuples = _filteredLayerNodesID.map((layerId) => {
      const sourceNodeId = edges.find((edge) => edge.target === layerId)?.source
      return { layer: layerId, source: sourceNodeId }
    })

    const _layers = layerSourceTuples.map((tuple) => {
      const _keys = Object.keys(storeData)
      if (_keys.length === 0 || !_keys.includes(tuple.source)) return null
      const { data } = storeData[tuple.source]
      return new GeoJsonLayer({
        ...DEFAULT_GEOJSON_LAYER_PROPS,
        id: tuple.layer,
        data
      })
    })

    setLayers(_layers)
  }, [layersNode, edges, storeData])

  return (
    <>
      <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 100 }}>
        <Button variant='contained' onClick={handleNavigate} data-testid='flow-icon'>
          <Typography variant='body2'>Back</Typography>
          <ArrowForwardIosIcon fontSize='small' sx={{ marginLeft: 1 }} />
        </Button>
      </Box>
      <Box sx={{ cursor: 'pointer', position: 'relative', width: '100%', height }} data-testid='deckgl-map'>
        <MapWrapper mapConfig={mapConfig} deckGlConfig={deckGlConfig} layers={layers}>
          <CustomTooltip content={tooltipInfo} position={tooltipPosition} />
        </MapWrapper>
      </Box>
    </>
  )
}
