import React, { ReactNode } from 'react'
import Drawer from '@mui/material/Drawer'
import { styled, IconButton, List } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'

interface PersistentDrawerProps {
  open: boolean
  setOpen: (newOpen: boolean) => void
  children: ReactNode
}

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar
}))

export default function PersistentDrawer ({ open, setOpen, children }: PersistentDrawerProps): JSX.Element {
  const handleDrawerClose = (): void => {
    setOpen(false)
  }

  return (
    <Drawer
      sx={{
        width: open ? '20%' : 0,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: '20%',
          boxSizing: 'border-box'
        }
      }}
      variant='persistent'
      anchor='left'
      open={open}
    >
      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </DrawerHeader>
      <List>{children}</List>
    </Drawer>
  )
}
