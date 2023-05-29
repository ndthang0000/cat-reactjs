import {
  CAvatar,
  CListGroup,
  CListGroupItem
} from '@coreui/react'
import { Box, FormControl, MenuItem, Pagination, Select } from '@mui/material'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import axiosInstance from '../../axios'

const Activity = ({ project }) => {
  const [activities, setActivities] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [filters, setFilters] = useState({ limit: 6, page: 1 })

  const fetchActivities = async () => {
    try {
      const data = await axiosInstance.get(`/activities?projectId=${project.projects.id}&page=${filters.page}&limit=${filters.limit}`)
      setActivities(data.data.results)
      setTotalPages(data.data.totalPages)
    } catch (error) {}
  }

  useEffect(() => {
    fetchActivities()
  }, [filters])

  const handleChangeLimit = (e) => {
    setFilters({ limit: e.target.value, page: 1 })
  }

  const handlePaginate = (e, page) => {
    setFilters({ ...filters, page })
  }

  return (
    <>
      <Paper className="px-4 py-2 mb-3">
        <CListGroup flush>
          {activities.map((activity, index) => (
            <CListGroupItem className="d-flex align-items-center px-0">
            <CAvatar size="lg" src={activity.owner.avatar} className="me-3" />

            <div className="flex-grow-1 d-flex flex-column">
              <Typography>
                <strong>{activity.owner.name}</strong>
              </Typography>

              <div className="d-flex justify-content-between">
                <Typography sx={{ color: 'text.secondary' }} variant="subtitle2">
                  {activity.comment}
                </Typography>
                <Typography sx={{ color: 'text.secondary' }} variant="subtitle2">
                  {new Date(activity.createdAt).toUTCString()}
                </Typography>
              </div>
            </div>
          </CListGroupItem>
          ))}
        </CListGroup>
      </Paper>

      <Paper spacing={1} sx={{ padding: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ fontSize: 12, fontWeight: 450, color: '#5c5e5d' }}>
            Lines per page
          </div>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <Select
              labelId="demo-select-small-label"
              id="demo-select-small"
              value={filters.limit}
              label="Age"
              onChange={handleChangeLimit}
            >
              <MenuItem value={6}>6</MenuItem>
              <MenuItem value={12}>12</MenuItem>
              <MenuItem value={15}>15</MenuItem>
              <MenuItem value={20}>20</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Pagination count={totalPages} color="primary" onChange={handlePaginate} page={filters.page} />
      </Paper>
    </>
  )
}

export default Activity
