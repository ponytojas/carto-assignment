import InputNode from '../components/flow/nodes/InputNode'
import IntersectionNode from '../components/flow/nodes/IntersectionNode'
import OutputNode from '../components/flow/nodes/OutputNode'

export const NodeType = {
  SOURCE: 'sourceNode',
  LAYER: 'layerNode',
  INTERSECTION: 'intersectionNode'
}

export const NodeLabel = {
  SOURCE: 'Source',
  LAYER: 'Layer',
  INTERSECTION: 'Intersection'
}

export const NodeComponent = {
  [NodeType.SOURCE]: InputNode,
  [NodeType.LAYER]: OutputNode,
  [NodeType.INTERSECTION]: IntersectionNode
}
