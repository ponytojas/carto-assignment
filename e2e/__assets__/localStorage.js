export const flowState = {
  nodes: [
    {
      id: 'sourceNode_0',
      type: 'sourceNode',
      position: {
        x: -243.5,
        y: 151
      },
      data: {
        label: 'Source',
        url: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/geojson/vancouver-blocks.json'
      },
      measured: {
        width: 150,
        height: 100
      },
      selected: false,
      dragging: false
    },
    {
      id: 'layerNode_1',
      type: 'layerNode',
      position: {
        x: 57,
        y: 147.5
      },
      data: {
        label: 'Layer',
        url: ''
      },
      measured: {
        width: 150,
        height: 100
      },
      selected: false,
      dragging: false
    }
  ],
  edges: [
    {
      source: 'sourceNode_0',
      target: 'layerNode_1',
      id: 'xy-edge__sourceNode_0-layerNode_1'
    }
  ]
}
