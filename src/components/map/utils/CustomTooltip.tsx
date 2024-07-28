import React from 'react'

import {
  Box,
  Paper,
  Typography
} from '@mui/material'

interface TooltipProps {
  content: string
  position: { x: number, y: number }
}

const parseText = (text): JSX.Element[] => text.split('\n').filter(Boolean).map((line, index) => {
  const _key = Symbol(line).toString()
  const typographyProps = {
    variant: 'body1',
    sx: {
      fontWeight: index === 0 ? 400 : 100,
      fontSize: index === 0 ? 14 : 12
    }
  }

  return (
    <Box key={_key}>
      <Typography {...typographyProps}>{line}</Typography>
      {index < text.length - 1 && <br />}
    </Box>
  )
})

const DEFAULT_STYLE = {
  position: 'absolute',
  zIndex: 1,
  height: 'auto',
  width: 'auto',
  padding: '1rem 1rem 0.5rem 1rem',
  borderRadius: '8px',
  boxShadow: '0 1px 20px rgba(0,0,0,0.22)'
}

export const CustomTooltip = ({ content, position }: TooltipProps): JSX.Element => {
  if (content === null || content === undefined) return null
  const parsedContent = parseText(content)

  const paperStyle = {
    ...DEFAULT_STYLE,
    top: position.y + 3,
    left: position.x + 8
  }

  return (
    <Paper sx={paperStyle}>
      <Box className='tooltip'>{parsedContent}</Box>
    </Paper>
  )
}
