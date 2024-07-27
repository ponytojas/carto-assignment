import React, { useEffect, useRef } from 'react'
import { MapWrapper } from './MapWrapper'
import { Box, Button, Typography } from '@mui/material'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useNavigate } from 'react-router-dom'
import useStore from '../../utils/store'
import { NodeType } from '../../enums/flow'

export function Map (): JSX.Element {
  const viewPoint = useStore((state) => state.viewPoint) ?? { longitude: -122.4194, latitude: 37.7749, zoom: 12 }
  const storeData = useStore((state) => state.storeData)
  const nodes = useStore((state) => state.nodes)
  const edges = useStore((state) => state.edges)

  const [layersNode, setLayersNode] = React.useState([])
  const [layers, setLayers] = React.useState([])

  const height = window.innerHeight
  const mapboxToken = import.meta.env.VITE_MAPBOX_TOKEN
  const mapStyle = import.meta.env.VITE_MAP_THEME ?? 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json'
  const mapRef = useRef(null)
  const mapConfig = {
    mapboxToken,
    mapRef,
    mapStyle
  }

  const navigateTo = useNavigate()

  const deckGlConfig = {
    initialViewState: { ...viewPoint }
  }

  const handleNavigate = (): void => {
    navigateTo('/flow')
  }

  useEffect(() => {
    if (nodes === undefined || nodes === null) return
    const _layersNodes = nodes.filter(node => node.type === NodeType.LAYER).sort((a, b) => b.position.y - a.position.y)
    setLayersNode(_layersNodes)
  }, [nodes])

  useEffect(() => {
    if (layersNode === undefined || layersNode === null || layersNode.length === 0) return
    // Filter nodes that has no edges
    const _layersNodes = layersNode.filter((node) => edges.some(edge => edge.target === node.id))
    for (const edge of edges) {
      console.log(edge)
    }
  }, [layersNode])

  return (
    <>
      <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 100 }}>
        <Button variant='contained' onClick={handleNavigate}>
          <Typography variant='body2'>Flow</Typography>
          <ArrowForwardIosIcon fontSize='small' sx={{ marginLeft: 1 }} />
        </Button>
      </Box>
      <Box sx={{
        cursor: 'pointer',
        position: 'relative',
        width: '100%',
        height
      }}
      >
        <MapWrapper mapConfig={mapConfig} deckGlConfig={deckGlConfig} />
      </Box>
    </>
  )
}
