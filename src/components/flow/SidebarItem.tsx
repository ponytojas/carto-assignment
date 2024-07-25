import React from 'react'

interface SidebarItemProps {
  type: string
  label: string
}

export default function SidebarItem ({ type, label }): React.FC<SidebarItemProps> {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>): void => {
    event.dataTransfer.setData('application/reactflow', type)
    event.dataTransfer.effectAllowed = 'move'
  }

  return (
    <div
      onDragStart={handleDragStart}
      draggable
      style={{ padding: 10, border: '1px dashed black', marginBottom: 10, cursor: 'move' }}
    >
      {label}
    </div>
  )
}
