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
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import React, { useState } from 'react'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  boxShadow: 24,
  p: 4,
}

const Member = ({ project }) => {
  const [role, setRole] = React.useState('')
  const [open, setOpen] = React.useState(false)

  const handleRemoveMember = () => {}
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setRole('')
    setOpen(false)
  }

  return (
    <Paper elevation={6} sx={{ padding: 3 }}>
      <CTable align="middle" className="mb-0 border" hover responsive>
        <CTableHead color="light">
          <CTableRow>
            <CTableHeaderCell className="text-center">
              <CIcon icon={cilPeople} />
            </CTableHeaderCell>
            <CTableHeaderCell>Name</CTableHeaderCell>
            <CTableHeaderCell>Role</CTableHeaderCell>
            <CTableHeaderCell className="text-center">Action</CTableHeaderCell> {/* if owner */}
          </CTableRow>
        </CTableHead>

        <CTableBody>
          {project.projects &&
            project.projects.members.map((item, index) => (
              <CTableRow v-for="item in tableItems" key={index}>
                <CTableDataCell className="text-center">
                  <CAvatar size="lg" src="./1.jpg" />
                  {/* <CAvatar size="lg" src={item.avatar} /> */}
                </CTableDataCell>
                <CTableDataCell>
                  <div className="small text-medium-emphasis">Nguyen Duc Thang</div>
                  {/* <div className="small text-medium-emphasis">{item.name}</div> */}
                </CTableDataCell>
                <CTableDataCell>{item.role}</CTableDataCell>
                <CTableDataCell className="text-center">
                  <CIcon icon={cilTrash} className="cursor-pointer" onClick={handleRemoveMember} />
                </CTableDataCell>
              </CTableRow>
            ))}
        </CTableBody>
      </CTable>

      <Stack direction="row" alignItems="center" spacing={2} justifyContent="center">
        <Button variant="contained" className="mt-4" onClick={handleOpen}>
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
            <TextField size="small" label="Email" variant="outlined" className="m-0 w-100 mb-3" />
            <FormControl size="small" className="m-0 w-100 mb-3">
              <InputLabel>Role</InputLabel>
              <Select value={role} label="Role" onChange={(event) => { setRole(event.target.value) }}>
                {/* {sortConfig &&
                    Object.keys(sortConfig).map((item, index) => (
                      <MenuItem key={index} value={sortConfig[item]}>
                        {item}
                      </MenuItem>
                    ))} */}
                <MenuItem value="Manager">Manager</MenuItem>
                <MenuItem value="Translator">Translator</MenuItem>
                <MenuItem value="Beta">Beta</MenuItem>
              </Select>
            </FormControl>

            <Stack direction="row" justifyContent="end">
              <Button variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button variant="contained" className="ms-2">
                Add
              </Button>
            </Stack>
          </Paper>
        </Modal>
      </Stack>
    </Paper>
  )
}

export default Member
