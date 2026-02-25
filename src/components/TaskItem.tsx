import { Box, Chip, Typography } from '@mui/material'


export default function TaskItem() {
  return (
    <Box sx={{ backgroundColor: '#fff', padding: '12px', borderRadius: '4px', marginBottom: '8px', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)' }}>
      <Typography variant="body1" sx={{ color: '#555', fontWeight: 'bold' }}>
        Task 1: Design the UI
      </Typography>
      <Typography variant="body2" sx={{ color: '#777' }}>
        Create wireframes and mockups for the new project.
      </Typography>
      <Chip variant="outlined" label="High" color="error" size="small" sx={{ marginTop: '8px', borderRadius: '8px', backgroundColor: '#ffebee' }} />
    </Box>
  )
}
