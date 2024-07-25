import React, { useState } from 'react'
import { Box, CssBaseline, IconButton } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import TemporaryDrawer from '../common/Drawer'
import { ReactFlowProvider } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import SidebarItem from './SidebarItem'
import { FlowComponent } from './FlowComponent'

export function Flow (): JSX.Element {
  const [open, setOpen] = useState(false)

  return (
    <>
      <CssBaseline />
      <Box sx={{ display: 'flex', width: '100%', height: '100%' }}>
        <TemporaryDrawer open={open} setOpen={setOpen}>
          <SidebarItem type='sourceNode' label='Source' />
          <SidebarItem type='layerNode' label='Layer' />
        </TemporaryDrawer>
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
              <IconButton onClick={() => setOpen(true)}>
                <MenuIcon />
              </IconButton>
            </Box>
          )}
          <ReactFlowProvider>
            <FlowComponent />
          </ReactFlowProvider>
        </Box>
      </Box>
    </>
  )
}
