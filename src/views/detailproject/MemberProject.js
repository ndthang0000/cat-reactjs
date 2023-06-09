import { cilPeople, cilTrash } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import {
  CAvatar,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { FormControl, InputLabel, MenuItem, Select, Stack } from '@mui/material'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axiosInstance from '../../axios'
import moment from 'moment'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  boxShadow: 24,
  p: 4,
}

const Member = ({ project, setFetchNew }) => {
  const userInformation = useSelector((state) => state.userInformation)

  const [roleConfig, setRoleConfig] = useState([])
  const [role, setRole] = useState('')
  const [email, setEmail] = useState('')
  const [open, setOpen] = useState(false)

  const dispatch = useDispatch()

  const handleRemoveMember = async (id) => {
    const body = {
      id: id,
      projectId: (project.projects && project.projects.id) ? project.projects.id : ''
    }

    try {
      dispatch({ type: 'set-backdrop' })
      const response = await axiosInstance.post('project/remove-member', body)
      dispatch({ type: 'set-backdrop' })
      if (response.data.status) {
        setFetchNew(state => !state)
      }
    }
    catch (err) {
      dispatch({ type: 'set-backdrop' })
    }
  }

  const handleAddMember = async () => {
    const body = {
      projectId: (project.projects && project.projects.id) ? project.projects.id : '',
      role: role,
      email: email
    }

    try {
      dispatch({ type: 'set-backdrop' })
      const response = await axiosInstance.post('project/add-member', body)
      if (response.data.status) {
        setFetchNew(state => !state)
        setRole('')
        setOpen(false)
      }
      dispatch({ type: 'set-backdrop' })
    } catch (error) {
      dispatch({ type: 'set-backdrop' })
    }
  }

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setRole('')
    setOpen(false)
  }

  const fetchRoleProject = async () => {
    try {
      const data = await axiosInstance.get('/project/get-role-of-project')
      setRoleConfig(data.data.data)
    } catch (error) { }
  }

  useEffect(() => {
    fetchRoleProject()
  }, [])

  const hasRole = () => {
    if (project.projects) {
      const result = project.projects.members.find(member => member.userId.userId === userInformation.userId)
      if (result && (result.role === 'PROJECT MANAGER' || result.role === 'OWNER')) {
        return true
      }
    }
    return false
  }

  return (
    <Paper elevation={6} sx={{ padding: 3 }}>
      {hasRole() ?
        <Stack direction="row" alignItems="center" spacing={2}>
          <Button variant="contained" className="mb-4" onClick={handleOpen}>
            Add member
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Paper sx={style}>
              <Typography variant="h6" className="mb-4">
                Add new member to your project
              </Typography>
              <TextField size="small" label="Email" variant="outlined" className="m-0 w-100 mb-3" onChange={(e) => { setEmail(e.target.value) }} />
              <FormControl size="small" className="m-0 w-100 mb-3">
                <InputLabel>Role</InputLabel>
                <Select value={role} label="Role" onChange={(event) => { setRole(event.target.value) }}>
                  {roleConfig.map((item, index) => <MenuItem value={item} key={index}>{item}</MenuItem>)}
                </Select>
              </FormControl>

              <Stack direction="row" justifyContent="end">
                <Button variant="outlined" onClick={handleClose}>
                  Cancel
                </Button>
                <Button variant="contained" className="ms-2" onClick={handleAddMember}>
                  Add
                </Button>
              </Stack>
            </Paper>
          </Modal>
        </Stack> :
        <Button variant="contained" className="mb-4" onClick={() => handleRemoveMember(userInformation.id)}>
          Leave project
        </Button>}

      <CTable align="middle" className="mb-0 border" hover responsive>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell className="text-center">
              <CIcon icon={cilPeople} />
            </CTableHeaderCell>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Role</CTableHeaderCell>
            <CTableHeaderCell>Time Join</CTableHeaderCell>
            {hasRole() ? <CTableHeaderCell className="text-center">Action</CTableHeaderCell> : <></>}
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {project.projects &&
            project.projects.members.map((item, index) => (
              <CTableRow v-for="item in tableItems" key={index}>
                <CTableDataCell className="text-center">
                  <CAvatar size="lg" src={item.userId.avatar} />
                </CTableDataCell>
                <CTableDataCell>
                  <div className="small text-medium-emphasis">{item.userId.name}</div>
                </CTableDataCell>
                <CTableDataCell>{item.role}</CTableDataCell>
                <CTableDataCell>{moment(item.timeJoin).format('LLL')}</CTableDataCell>
                {hasRole() ? <CTableDataCell className="text-center">
                  <CIcon icon={cilTrash} className={item.role === 'PROJECT MANAGER' ? "d-none" : "cursor-pointer"} onClick={() => handleRemoveMember(item._id)} />
                </CTableDataCell> : <></>}
              </CTableRow>
            ))}
        </CTableBody>
      </CTable>
    </Paper>
  )
}

export default Member
