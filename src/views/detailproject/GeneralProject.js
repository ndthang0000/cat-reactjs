import { Button, Card, CardActions, CardContent, CardMedia, FormControl, FormControlLabel, InputLabel, Menu, MenuItem, Paper, Select, Stack, Switch, Tooltip, Typography } from '@mui/material'
import React, { useState } from 'react'
import Grid2 from '@mui/material/Unstable_Grid2'
import { styled } from '@mui/material/styles';
import { Box } from '@mui/system';
import moment from 'moment'
import { CProgress } from '@coreui/react';
import TourIcon from '@mui/icons-material/Tour';
import CachedIcon from '@mui/icons-material/Cached';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import initPriority from '../config/priority'
import { toast } from 'react-toastify';
import axiosInstance from '../../axios'
import { async } from 'regenerator-runtime';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { unstable_HistoryRouter } from 'react-router-dom';

const convertStatusProject = (status) => {
  if (status == 'INPROGRESS') {
    return 'warning'
  }
  if (status == 'CANCEL') {
    return 'danger'
  }
  if (status == 'FINISH') {
    return 'success'
  }
}

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

function GeneralProject({ project, handleChangeTab, setFetchNew }) {

  const [isViewPortEdit, setIsViewPortEdit] = useState(false)

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [priority, setPriority] = useState(project.projects?.priority)
  const [projectName, setProjectName] = useState(project.projects?.projectName)
  const [description, setDescription] = useState(project.projects?.description)
  const [scope, setScope] = useState(project.projects?.scope)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleClickOpenPriority = (event) => {
    if (!isViewPortEdit) {
      return
    }
    setAnchorEl(event.currentTarget);
  };

  const handleUpdateDetailProject = async (event) => {
    const body = {
      scope: scope ? 'PUBLIC' : 'INDIVIDUAL',
      priority,
      projectName,
      description,
      _id: project.projects.id
    }
    if (priority > 5 || priority < 1) {
      return toast.error('Priority invalid')
    }
    if (!projectName) {
      return toast.error('Project name is required')
    }
    try {
      dispatch({ type: 'set-backdrop' })
      const data = await axiosInstance.post('/project/update', body)
      navigate(`/project/detail/${data.data.data.slug}`)
      setFetchNew(state => !state)
      dispatch({ type: 'set-backdrop' })
    } catch (error) {
      dispatch({ type: 'set-backdrop' })
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  }

  const getPriority = (index) => {
    return initPriority.find(item => item.priority == index) || initPriority[0]
  }

  const handleViewPortEdit = () => {
    setIsViewPortEdit(true)
    setPriority(project.projects?.priority)
    setProjectName(project.projects?.projectName)
    setDescription(project.projects?.description)
    if (project.projects?.scope == 'PUBLIC') {
      setScope(true)
    }
    else {
      setScope(false)
    }
  }

  const handleSetScope = () => {
    if (!isViewPortEdit) {
      console.log('vô nè')
      return
    }
    setScope(state => !state)
  }

  const returnLabelScope = (value) => {
    if (Boolean(value == undefined)) {
      return project.projects?.scope
    }
    if (value) {
      return 'PUBLIC'
    }
    return 'INDIVIDUAL'
  }

  const returnValueScope = (value) => {
    if (value == 'PUBLIC')
      return true
    return false
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid2 container spacing={2}>
        <Grid2 md={4} sm={12}>
          <div className='tab1-general-detail-project'>
            <img src={project.projects?.image} style={{ marginBottom: 20 }} className='image-detail-project' />
            <div className="clearfix">
              <div className="float-start">
                <strong>{project.projects?.percentComplete}%</strong>
              </div>
              <div className="float-end">
                <strong className="text-medium-emphasis">100%</strong>
              </div>
            </div> 

            <CProgress thin color={convertStatusProject(project.projects?.status)} value={project.projects?.percentComplete} />
            <p style={{ marginTop: 20 }}><strong>Create at:</strong> <span style={{ color: '#2b6fd6', textAlign: 'center' }}>{moment(project.projects?.createdAt).format('LLL')}</span></p>
            <p><strong>Owner:</strong> <span style={{ color: '#2b6fd6', textDecoration: 'underline', textAlign: 'center' }}>{project.owner?.name}</span></p>
            <p><strong>Quantity Files:</strong> <span style={{ color: '#2b6fd6', textAlign: 'center' }}>{project.projects?.files.length}</span><span style={{ fontSize: 14, cursor: 'pointer' }} onClick={(e) => handleChangeTab(e, 1)}> -&gt; Go to Manage File</span></p>
            <p><strong>Quantity Members:</strong> <span style={{ color: '#2b6fd6', textAlign: 'center' }}>{project.projects?.members.length}</span> <span style={{ fontSize: 14, cursor: 'pointer' }} onClick={(e) => handleChangeTab(e, 2)}> -&gt; Go to Manage Member</span></p>
          </div>
        </Grid2>
        <Grid2 md={8} sm={12}>
          <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 20, display: 'flex', justifyContent: 'space-between' }}>
            <div>Project Detail Information</div>
            <div>
              {!isViewPortEdit && <Tooltip title="Edit Project"><ModeEditIcon className='edit-icon-detail-project' onClick={handleViewPortEdit} /></Tooltip>}
            </div>
          </div>

          <form>
            <div className="form-group">
              <label for="exampleFormControlInput1" className='form-label-project' >Project Name</label>
              <input type="text" className="form-control" id="exampleFormControlInput1" value={Boolean(projectName != undefined) ? projectName : project.projects?.projectName} defaultValue={project.projects?.projectName} onChange={(e) => setProjectName(e.target.value)} disabled={!isViewPortEdit} />

            </div>

            <div className="form-group">
              <label for="exampleFormControlInput2" className='form-label-project'>Description</label>
              <input type="text" className="form-control" id="exampleFormControlInput2" value={Boolean(description != undefined) ? description : project.projects?.description} defaultValue={project.projects?.description} onChange={(e) => setDescription(e.target.value)} disabled={!isViewPortEdit} />
            </div>
            <Box sx={{ display: 'flex', alignItems: 'center', marginBlock: 2.5 }}>
              <FormControl sx={{ m: 1, minWidth: 120, }}>
                <InputLabel htmlFor="grouped-select-1">{project.projects?.sourceLanguage}</InputLabel>
                <Select defaultValue={project.projects?.sourceLanguage} id="grouped-select-2" label={project.projects?.sourceLanguage} disabled>
                  <MenuItem value={project.projects?.sourceLanguage}>{project.projects?.sourceLanguage}</MenuItem>
                </Select>
              </FormControl>


              <div>
                <CachedIcon color={'secondary'} />
              </div>
              <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel htmlFor="grouped-select-2">{project.projects?.targetLanguage}</InputLabel>
                <Select defaultValue={project.projects?.targetLanguage} id="grouped-select-2" label={project.projects?.targetLanguage} disabled>
                  <MenuItem value={project.projects?.targetLanguage}>{project.projects?.targetLanguage}</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <FormControlLabel
              value={returnLabelScope(scope)}
              disabled={!isViewPortEdit}
              onChange={handleSetScope}
              control={<IOSSwitch sx={{ m: 1 }} defaultValueChecked />}
              label={returnLabelScope(scope)}
            />
            <div className="form-group" style={{ marginTop: 20 }}>
              <label for="exampleFormControlInput2" className='form-label-project'>Priority: <strong style={{ color: getPriority(priority || project.projects?.priority).color }}>{getPriority(priority || project.projects?.priority).tittle}</strong></label>
              <TourIcon sx={{
                ml: 2,
                cursor: isViewPortEdit ? 'pointer' : 'not-allowed',
                color: getPriority(priority || project.projects?.priority).color
              }} onClick={handleClickOpenPriority} />
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                {initPriority.map(item => <MenuItem sx={{ color: item.color }} key={item.priority} onClick={(e) => { handleClose(); setPriority(item.priority) }}>{item.tittle}</MenuItem>)}
              </Menu>
            </div>
          </form>
          <Stack spacing={2} direction="row" sx={{ marginTop: 5 }}>
            <Button variant="outlined" disabled={!isViewPortEdit} onClick={handleUpdateDetailProject}>Update</Button>
          </Stack>
        </Grid2>
      </Grid2>
    </Box >
  )
}

export default GeneralProject