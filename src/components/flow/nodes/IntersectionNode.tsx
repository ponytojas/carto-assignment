import React, { useState, useEffect, useRef, useCallback } from 'react'
import { bbox, centroid, polygon, intersect, featureCollection } from '@turf/turf'
import { Handle, Position, useReactFlow } from '@xyflow/react'
import { Typography, IconButton } from '@mui/material'
import { BaseNode } from './BaseNode'
import DeleteIcon from '@mui/icons-material/Delete'
import { toast } from 'sonner'
import useStore from '../../../utils/store'
import { extractPolygons, isPolygonOrFeatureOfPolygons } from './utils'

interface IntersectionNodeProps {
  id: string
  data: {
    label: string
    onDeleteNode: (node: Node) => void
  }
}

const IntersectionNode = ({ id, data }: IntersectionNodeProps): JSX.Element => {
  const { updateNodeData } = useReactFlow()
  const edges = useStore((state) => state.edges)
  const storeData = useStore((state) => state.storeData)
  const setStoreData = useStore((state) => state.setStoreData)
  const setViewPoint = useStore((state) => state.setViewPoint)
  const removeStoreData = useStore((state) => state.removeStoreData)

  const { label, onDeleteNode } = data
  const [hovered, setHovered] = useState(false)
  const [iconHovered, setIconHovered] = useState(false)
  const [inputsId, setInputsId] = useState<string[]>([])
  const previousStoreData = useRef(storeData)

  const handleIntersection = (data1: any, data2: any) => {
    const polygons1 = extractPolygons(data1)
    const polygons2 = extractPolygons(data2)
    const intersection = []

    for (const p1 of polygons1) {
      for (const p2 of polygons2) {
        const feat = featureCollection([polygon([...p1.coordinates], p1.properties), polygon([...p2.coordinates], p2.properties)])
        const _intersection = intersect(feat, { properties: { ...p1.properties, ...p2.properties } })
        if (_intersection != null) {
          intersection.push(_intersection)
        }
      }
    }

    return intersection
  }

  const updateStoreData = useCallback((intersection: any) => {
    const _newData = { ...storeData, [id]: { data: intersection } }

    if (JSON.stringify(previousStoreData.current) !== JSON.stringify(_newData)) {
      previousStoreData.current = _newData
      setStoreData(_newData)
      toast.success('Intersection completed successfully')

      const _bbox = bbox(featureCollection(intersection))
      const _polygon = polygon([[[_bbox[0], _bbox[1]], [_bbox[2], _bbox[1]], [_bbox[2], _bbox[3]], [_bbox[0], _bbox[3]], [_bbox[0], _bbox[1]]]])
      const _centroid = centroid(_polygon)
      const viewpoint = { longitude: _centroid.geometry.coordinates[0], latitude: _centroid.geometry.coordinates[1], zoom: 12 }
      setViewPoint(viewpoint)
      updateNodeData(id, { data: intersection })
    }
  }, [id, storeData, setStoreData, setViewPoint, updateNodeData])

  useEffect(() => {
    const [id1, id2] = inputsId
    const data1 = storeData[id1]?.data
    const data2 = storeData[id2]?.data

    if (data1 === null || data2 === null || data1 === undefined || data2 === undefined) {
      if (Object.keys(storeData).includes(id)) {
        removeStoreData(id)
      }
    }
  }, [inputsId, storeData, id, removeStoreData])

  useEffect(() => {
    const [id1, id2] = inputsId
    const data1 = storeData[id1]?.data
    const data2 = storeData[id2]?.data

    if (data1 === null || data2 === null || data1 === undefined || data2 === undefined) return

    if (!isPolygonOrFeatureOfPolygons(data1) || !isPolygonOrFeatureOfPolygons(data2)) {
      toast.error('The sources for intersection must be a polygon, multipolygon or a feature collection of polygons')
      return
    }

    const intersection = handleIntersection(data1, data2)
    if (intersection.length > 0) {
      updateStoreData(intersection)
    } else {
      toast.error('No intersection found')
    }
  }, [inputsId, setViewPoint, updateNodeData, storeData, updateStoreData, id])

  useEffect(() => {
    const inputs = edges.filter(e => e.target === id).map(e => e.source)
    if (inputs.length === 2 && JSON.stringify(inputs) !== JSON.stringify(inputsId)) {
      setInputsId(inputs)
    }
  }, [edges, id, inputsId])

  return (
    <BaseNode
      data-testid='intersection-node'
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && (
        <IconButton
          data-testid='delete-node'
          onMouseEnter={() => setIconHovered(true)}
          onMouseLeave={() => setIconHovered(false)}
          size='small'
          onClick={() => onDeleteNode([{ id, data }])}
          sx={{ position: 'absolute', top: -25, right: 0 }}
        >
          <DeleteIcon
            fontSize='small' color={iconHovered ? 'error' : 'action'}
          />
        </IconButton>
      )}
      <Typography fontSize={10}>{label}</Typography>
      <Handle type='target' position={Position.Left} style={{ background: '#555', top: '30%' }} data-testid='node-handler-input-1' />
      <Handle type='target' position={Position.Left} style={{ background: '#555', top: '70%' }} data-testid='node-handler-input-2' />
      <Handle type='source' position={Position.Right} style={{ background: '#555' }} data-testid='node-handler-source' />
    </BaseNode>
  )
}

export default IntersectionNode
