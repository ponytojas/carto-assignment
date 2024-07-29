import React, { useState, useEffect, useCallback, useRef } from 'react'
import { bbox, centroid, polygon } from '@turf/turf'
import { Handle, Position, useReactFlow } from '@xyflow/react'
import { Typography, IconButton } from '@mui/material'
import { BaseNode } from './BaseNode'
import DeleteIcon from '@mui/icons-material/Delete'
import { toast } from 'sonner'
import useStore from '../../../utils/store'
import { useIsFirstRender } from '../../../hooks/useIsFirstRender'

interface InputNodeProps {
  id: string
  data: {
    label: string
    onDeleteNode: (node: Node) => void
    url?: string
  }
}

const InputNode = ({ id, data }: InputNodeProps): JSX.Element => {
  const { updateNodeData } = useReactFlow()
  const isFirstRender = useIsFirstRender()
  const setStoreData = useStore((state) => state.setStoreData)
  const setViewPoint = useStore((state) => state.setViewPoint)

  const { label, onDeleteNode, url: dataUrl = '' } = data
  const [hovered, setHovered] = useState(false)
  const [iconHovered, setIconHovered] = useState(false)
  const [url, setUrl] = useState(dataUrl)
  const loading = useRef(false)

  useEffect(() => {
    if (isFirstRender === false) return
    const { url: initialUrl } = data
    if (initialUrl !== undefined && initialUrl !== null) {
      setUrl(initialUrl)
      void handleFetchGeoJSON(initialUrl)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFirstRender])

  const handleFetchGeoJSON = useCallback(async (inputUrl: string): Promise<void> => {
    if (inputUrl === null || inputUrl === undefined || inputUrl === '' || loading.current) return
    loading.current = true

    try {
      const response = await fetch(inputUrl)
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const geojson = await response.json()

      setStoreData({ [id]: { data: geojson } })
      toast.success('GeoJSON fetched successfully')

      const _bbox = bbox(geojson)
      const _polygon = polygon([[[_bbox[0], _bbox[1]], [_bbox[2], _bbox[1]], [_bbox[2], _bbox[3]], [_bbox[0], _bbox[3]], [_bbox[0], _bbox[1]]]])
      const _centroid = centroid(_polygon)
      const viewpoint = { longitude: _centroid.geometry.coordinates[0], latitude: _centroid.geometry.coordinates[1], zoom: 12 }
      setViewPoint(viewpoint)
    } catch (error) {
      if (import.meta.env.MODE === 'development') console.error('Failed to fetch GeoJSON:', error)
      toast.error('Failed to fetch GeoJSON')
    } finally {
      loading.current = false
    }
  }, [id, setStoreData, setViewPoint])

  const handleBlur = useCallback((event) => {
    const inputUrl = event?.target?.value ?? null
    if (inputUrl === undefined || inputUrl === null) return

    setUrl(inputUrl)
    void handleFetchGeoJSON(inputUrl)
    updateNodeData(id, { url: inputUrl })
  }, [id, updateNodeData, handleFetchGeoJSON])

  return (
    <BaseNode
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <IconButton
          onMouseEnter={() => setIconHovered(true)}
          onMouseLeave={() => setIconHovered(false)}
          size='small'
          onClick={() => onDeleteNode([{ id, data }])}
          style={{ position: 'absolute', top: -25, right: 0 }}
        >
          <DeleteIcon
            fontSize='small' color={iconHovered ? 'error' : 'action'}
          />
        </IconButton>
      )}
      <Typography fontSize={10}>{label}</Typography>
      <TextField
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        onBlur={handleBlur}
        placeholder='URL'
        size='small'
        sx={{ fontSize: 5, width: '100%', padding: 0, margin: 0 }}
      />
      <Handle type='source' position={Position.Right} style={{ background: '#555' }} />
    </BaseNode>
  )
}

export default memo(InputNode)
