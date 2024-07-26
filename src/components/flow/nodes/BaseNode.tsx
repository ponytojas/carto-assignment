import { styled } from '@mui/material'

export const BaseNode = styled('div')(() => ({
  border: '1px solid black',
  backgroundColor: 'white',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-around',
  minHeight: '100px',
  borderRadius: '5px',
  padding: '10px',
  maxWidth: '150px',
  minWidth: '150px',
  textAlign: 'center'
}))
