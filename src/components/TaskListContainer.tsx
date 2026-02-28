import Grid from "@mui/material/Grid"
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';
import { Box, Button, Typography } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import type { Column } from "../types";

interface TaskListContinerProps {
  title?: string;
  pointColor?: string;
  taskCount?: number;
  countColor?: {
    bgColor: string;
    color: string;
  },
  columnKey: Column;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  taskIds?: string[];
  onAddClick?: (columnKey: Column) => void;
  children?: React.ReactNode;
}


export default function TaskListContiner({
  title,
  taskCount = 0,
  pointColor,
  countColor,
  columnKey,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  isLoading = false,
  taskIds = [],
  onAddClick,
  children
}: TaskListContinerProps) {

  const { setNodeRef, isOver } = useDroppable({
    id: columnKey,
    data: {
      type: 'column',
    },
  });

  return (
    <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
      <Grid size={{ xs: 12, md: 3 }}>
        <Box
          ref={setNodeRef}
          sx={{
            backgroundColor: isOver ? '#d0e8f0' : '#eaf0f0',
            padding: '16px',
            borderRadius: '8px',
            minHeight: '200px',
            transition: 'background-color 0.2s ease',
          }}
        >
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

          {totalPages > 1 && !isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2, gap: 1 }}>
              <Button
                size="small"
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage <= 1}
                sx={{ minWidth: 32, padding: '4px' }}
              >
                <ChevronLeftIcon />
              </Button>
              <Typography variant="body2" sx={{ fontSize: '0.75rem' }}>
                {currentPage} / {totalPages}
              </Typography>
              <Button
                size="small"
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage >= totalPages}
                sx={{ minWidth: 32, padding: '4px' }}
              >
                <ChevronRightIcon />
              </Button>
            </Box>
          )}

          <Button variant="outlined" fullWidth sx={{ marginTop: '16px' }} onClick={() => onAddClick?.(columnKey)}>
            <AddIcon sx={{ marginRight: '8px' }} />
            Add Task
          </Button>
        </Box>
      </Grid>
    </SortableContext>
  )
}
