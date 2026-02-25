import Grid from "@mui/material/Grid"
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';
import { Box, Typography } from "@mui/material"

interface TaskListContinerProps {
  title?: string;
  pointColor?: string;
  taskCount?: number;
  countColor?: {
    bgColor: string;
    color: string;
  },
  children?: React.ReactNode;
}


export default function TaskListContiner({ title, taskCount, pointColor, countColor, children }: TaskListContinerProps) {

  return (
    <Grid size={{ xs: 12, md: 3 }} sx={{ backgroundColor: '#eaf0f0', padding: '16px', borderRadius: '8px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
        <CircleRoundedIcon sx={{ fontSize: '0.75rem', color: pointColor || '#1976d2', marginRight: '8px' }} />
        <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold', fontSize: '1rem', color: '#333', textTransform: 'uppercase' }}>
          {title}
        </Typography>
        <Box sx={{ backgroundColor: countColor?.bgColor || '#e7e7e7', color: countColor?.color || '#222', borderRadius: '12px', padding: '2px 8px', fontSize: '0.75rem', marginLeft: '8px' }}>
          {taskCount}
        </Box>
      </Box>
      {children}
    </Grid>
  )
}
