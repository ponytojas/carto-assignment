import InputNode from '../components/flow/nodes/InputNode'
import OutputNode from '../components/flow/nodes/OutputNode'

export enum NodeType {
  SOURCE = 'sourceNode',
  LAYER = 'layerNode'
}

export enum NodeLabel {
  SOURCE = 'Source',
  LAYER = 'Layer'
}

export const NodeComponent = {
  [NodeType.SOURCE]: InputNode,
  [NodeType.LAYER]: OutputNode
}
