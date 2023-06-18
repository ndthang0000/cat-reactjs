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
  const [tmName, setTmName] = useState('')
  const [dictName, setDictName] = useState('')
  const [translationMemory, setTranslationMemory] = useState('')
  const [dictionary, setDictionary] = useState('')
  const [description, setDescription] = useState('')
  const [projectName, setProjectName] = useState('')
  const [languageConfig, setLanguageConfig] = useState([])
  const [translationMemoryList, setTranslationMemoryList] = useState([])
  const [dictionaryList, setDictionaryList] = useState([])

  const dispatch = useDispatch()

  const handleCreateNewProject = async () => {
    const body = {
      scope: scope ? 'PUBLIC' : 'INDIVIDUAL',
      sourceLanguage,
      targetLanguage,
      description,
      projectName,
      translationMemoryCode: translationMemory.code,
      isTmReverse: sourceLanguage !== translationMemory.sourceLanguage,
      dictionaryCode: dictionary.code,
      isDictReverse: sourceLanguage !== dictionary.sourceLanguage,
    }
    if (!body.projectName) {
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
    if (!body.translationMemoryCode) {
      return toast.error('Please select a Translation Memory')
    }
    if (!body.dictionaryCode) {
      return toast.error('Please select a Dictionary')
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

  const fetchTmAndDict = async () => {
    try {
      if (sourceLanguage !== '' && targetLanguage !== '') {
        const data = await axiosInstance.get(`/auth/get-tm-dict?source=${sourceLanguage}&target=${targetLanguage}`)
        setTranslationMemoryList(data.data[0])
        setDictionaryList(data.data[1])
      }
    } catch (error) {}
  }

  useEffect(()=>{
    fetchTmAndDict()
  }, [sourceLanguage])

  useEffect(()=>{
    fetchTmAndDict()
  }, [targetLanguage])

  const handleAddTm = async () => {
    try {
      await axiosInstance.post('/auth/add-tm', { name: tmName, sourceLanguage, targetLanguage })
      fetchTmAndDict()
    } catch (error) {}
  }

  const handleAddDict = async () => {
    try {
      await axiosInstance.post('/auth/add-dictionary', { name: dictName, sourceLanguage, targetLanguage })
      fetchTmAndDict()
    } catch (error) {}
  }

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
        <TextField style={{ width: '100%' }} id="input-with-sx" label="Name Of Project (required)" variant="outlined" defaultValue={' '} value={projectName} onChange={(e) => setProjectName(e.target.value)} />
        <TextField style={{ width: '100%' }} id="input-with-sx" label="Description" variant="outlined" defaultValue={' '} value={description} onChange={(e) => setDescription(e.target.value)} />
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

        <Typography sx={{ mb: 1 }}>
          Choose Translation Memory:
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControl sx={{ m: 1, minWidth: 280 }}>
            <InputLabel htmlFor="tm-select">Translation Memory</InputLabel>
            <Select defaultValue="" id="tm-select" label="Translation Memory">
              {translationMemoryList.map((item, index) => <MenuItem value={item.code} key={index} onClick={(e) => setTranslationMemory(item)}>{item.name}</MenuItem>)}
              <input className='mx-2' type="text" placeholder='Input name' value={tmName} onChange={(e) => setTmName(e.target.value)} />
              <Button variant="text" onClick={handleAddTm}>Create</Button>
            </Select>
          </FormControl>
        </Box>

        <Typography sx={{ mb: 1 }}>
          Choose Dictionary:
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FormControl sx={{ m: 1, minWidth: 280 }}>
            <InputLabel htmlFor="dictionary-select">Dictionary</InputLabel>
            <Select defaultValue="" id="dictionary-select" label="Dictionary">
              {dictionaryList.map((item, index) => <MenuItem value={item.code} key={index} onClick={(e) => setDictionary(item)}>{item.name}</MenuItem>)}
              <input className='mx-2' type="text" placeholder='Input name' value={dictName} onChange={(e) => setDictName(e.target.value)} />
              <Button variant="text" onClick={handleAddDict}>Create</Button>
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