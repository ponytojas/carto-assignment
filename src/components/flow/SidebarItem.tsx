import { Box, Typography } from '@mui/material'
import React from 'react'

interface SidebarItemProps {
  type: string
  label: string
}

export default function SidebarItem ({ type, label }: SidebarItemProps): JSX.Element {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>): void => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type, label }))
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <Box
      onDragStart={handleDragStart}
      draggable
      sx={{
        paddingTop: 10,
        paddingBottom: 10,
        textAlign: 'center',
        border: '1px solid black',
        borderRadius: 5,
        marginTop: 5,
        marginBottom: 5,
        marginLeft: 10,
        marginRight: 10,
        cursor: 'move'
      }}
      data-testid={`sidebar-item-${type }`}
    >
      <Typography>{label}</Typography>
    </Box>
  )
}
