import Grid from "@mui/material/Grid"
import SearchAppBar from "./components/SearchAppBar"


function App() {
  return (
    <>
      <SearchAppBar />
      <Grid container spacing={2} sx={{ backgroundColor: '#f5f5f5', padding: '16px' }}>
        <Grid size={{ xs: 12, md: 3 }}>
          <h2>Backlog</h2>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <h2>In Progress</h2>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <h2>Archived</h2>
        </Grid>
        <Grid size={{ xs: 12, md: 3 }}>
          <h2>Done</h2>
        </Grid>
      </Grid>
    </>
  )
}

export default App
