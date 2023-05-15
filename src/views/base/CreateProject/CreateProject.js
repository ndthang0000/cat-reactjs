import { Box, Button, Divider, FormControl, FormControlLabel, InputLabel, MenuItem, Paper, Select, Switch, TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { styled } from '@mui/material/styles';
import axiosInstance from '../../../axios'
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import CachedIcon from '@mui/icons-material/Cached';
import Brightness7Icon from '@mui/icons-material/Brightness7';

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

function CreateProject({ setActiveStep, setNewProject }) {

  const [scope, setScope] = useState(true)
  const [sourceLanguage, setSourceLanguage] = useState('')
  const [targetLanguage, setTargetLanguage] = useState('')
  const [description, setDescription] = useState('')
  const [projectName, setProjectName] = useState('')
  const [languageConfig, setLanguageConfig] = useState([])

  const dispatch = useDispatch()

  const handleCreateNewProject = async () => {
    const body = {
      scope: scope ? 'PUBLIC' : 'INDIVIDUAL',
      sourceLanguage,
      targetLanguage,
      description,
      projectName
    }
    if (!body.projectName) {
      console.log('vo day koo ')
      return toast.error('Project name is required', { autoClose: 3000 })
    }
    if (!body.sourceLanguage) {
      return toast.error('Please select your source language')
    }
    if (!body.targetLanguage) {
      return toast.error('Please select your target language')
    }
    if (body.sourceLanguage == body.targetLanguage) {
      return toast.error('Source and target must be different !!')
    }
    try {
      dispatch({ type: 'set-backdrop' })
      const data = await axiosInstance.post('/project', body)
      setActiveStep((state) => state + 1)
      setNewProject(data.data.data)
      dispatch({ type: 'set-backdrop' })
      resetForm()
    } catch (error) {
      dispatch({ type: 'set-backdrop' })

    }
  }

  const resetForm = () => {
    setProjectName('')
    setDescription('')
  }


  useEffect(() => {
    const fetchLanguageConfig = async () => {
      try {
        const data = await axiosInstance.get('/project/get-language-of-system')
        setLanguageConfig(data.data.data)
      } catch (error) {

      }
    }
    fetchLanguageConfig()
  }, [])

  return (
    <div>
      <Paper
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '100ch' },
          mt: 4,
          padding: 2,
          mb: 2
        }}
        noValidate
        autoComplete="off"
        elevation={4}
      >
        <Typography variant="h6">
          <Brightness7Icon sx={{ mr: 1, fontSize: 28 }} />Set up Information Of Project
        </Typography>
        <TextField id="input-with-sx" label="Name Of Project (required)" variant="outlined" defaultValue={' '} value={projectName} onChange={(e) => setProjectName(e.target.value)} />
        <TextField id="input-with-sx" label="Description" variant="outlined" defaultValue={' '} value={description} onChange={(e) => setDescription(e.target.value)} />
        <FormControlLabel
          value={scope ? 'PUBLIC' : 'INDIVIDUAL'}
          onChange={() => { setScope(!scope) }}
          control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
          label={scope ? 'PUBLIC' : 'INDIVIDUAL'}
        />
        <Divider variant="middle" />
        <Typography sx={{ mb: 1 }}>
          Choose language:
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel htmlFor="grouped-select">Source</InputLabel>
            <Select defaultValue="" id="grouped-select" label="Source">
              {languageConfig.map((item, index) => <MenuItem value={item} key={index} onClick={(e) => setSourceLanguage(item)}>{item}</MenuItem>)}
            </Select>
          </FormControl>
          <div><CachedIcon color={'secondary'} /></div>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel htmlFor="grouped-select-2">Target</InputLabel>
            <Select defaultValue="" id="grouped-select-2" label="Target">
              {languageConfig.map((item, index) => <MenuItem value={item} key={index} onClick={((e) => setTargetLanguage(item))}>{item}</MenuItem>)}

            </Select>
          </FormControl>
        </Box>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} size='medium' onClick={handleCreateNewProject}>
            Create new Project
          </Button>

        </div>
      </Paper>
    </div>
  )
}

export default CreateProject