import React, { useState, useEffect, useCallback } from 'react'
import { Box, Button, CssBaseline, IconButton, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import PersistentDrawer from '../common/Drawer'
import { ReactFlowProvider } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import SidebarItem from './SidebarItem'
import { FlowComponent } from './FlowComponent'
import { NodeLabel, NodeType } from '../../enums/flow'
import { useNavigate } from 'react-router-dom'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import useStore, { FlowState } from '../../utils/store'

export function Flow (): JSX.Element {
  const [open, setOpen] = useState(false)
  const navigateTo = useNavigate()
  const saveFlowState = useStore((state: FlowState) => state.saveFlowState)
  const loadFlowState = useStore((state: FlowState) => state.loadFlowState)
  const setNodes = useStore((state: FlowState) => state.setNodes)
  const setEdges = useStore((state: FlowState) => state.setEdges)
  const nodes = useStore((state: FlowState) => state.nodes)
  const edges = useStore((state: FlowState) => state.edges)

  const handleNavigate = useCallback(() => {
    saveFlowState(nodes, edges)
    navigateTo('/map')
  }, [nodes, edges, saveFlowState, navigateTo])

  useEffect(() => {
    const { nodes: savedNodes, edges: savedEdges } = loadFlowState()
    setNodes(savedNodes)
    setEdges(savedEdges)
  }, [loadFlowState, setNodes, setEdges])

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
        <PersistentDrawer open={open} setOpen={setOpen}>
          <SidebarItem type={NodeType.SOURCE} label={NodeLabel.SOURCE} />
          <SidebarItem type={NodeType.LAYER} label={NodeLabel.LAYER} />
          <SidebarItem type={NodeType.INTERSECTION} label={NodeLabel.INTERSECTION} />
        </PersistentDrawer>
        <Box
          component='main'
          sx={{
            flexGrow: 1,
            transition: 'margin 0.3s',
            width: open ? '80%' : '100%',
            height: '100%'
          }}
        >
          {!open && (
            <Box sx={{ position: 'absolute', top: 8, left: 8, zIndex: 100 }}>
              <IconButton onClick={() => setOpen(true)} data-testid='menu-icon'>
                <MenuIcon />
              </IconButton>
            </Box>
          )}

          <Box sx={{ position: 'absolute', top: 8, right: 8, zIndex: 100 }}>
            <Button variant='contained' onClick={handleNavigate} data-testid='map-icon'>
              <Typography variant='body2'>Map</Typography>
              <ArrowForwardIosIcon fontSize='small' sx={{ marginLeft: 1 }} />
            </Button>
          </Box>
          <ReactFlowProvider>
            <FlowComponent />
          </ReactFlowProvider>
        </Box>
      </Box>
    </>
  )
}
