import Grid from "@mui/material/Grid"
import SearchAppBar from "./components/SearchAppBar"
import TaskListContiner from "./components/TaskListContiner"
import TaskItem from "./components/TaskItem"


function App() {
  return (
    <>
      <SearchAppBar />
      <Grid container spacing={2} sx={{ backgroundColor: '#f5f5f5', padding: '16px' }}>
        <TaskListContiner 
          title="Backlog"
          taskCount={5}
          pointColor="#1976d2"
          countColor={{ bgColor: '#e7e7e7', color: '#222' }}
        >
          <TaskItem />
          <TaskItem />
          <TaskItem />
        </TaskListContiner>
        <TaskListContiner 
          title="In Progress"
          taskCount={3}
          pointColor="#ff9800"
          countColor={{ bgColor: '#fff3e0', color: '#222' }}
        >
          <TaskItem />
          <TaskItem />
        </TaskListContiner> 
        <TaskListContiner 
          title="In Review"
          taskCount={2}
          pointColor="#4c4eaf"
          countColor={{ bgColor: '#e8f5e9', color: '#222' }}
        >
          <TaskItem />
        </TaskListContiner>
        <TaskListContiner 
          title="Done"
          taskCount={8}
          pointColor="#4caf50"
          countColor={{ bgColor: '#e8f5e9', color: '#222' }}
        >
          <TaskItem />
          <TaskItem />
          <TaskItem />
        </TaskListContiner>
      </Grid>
    </>
  )
}

export default App
