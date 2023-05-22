import React, { createRef, useEffect, useRef, useState } from 'react'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import Grid2 from '@mui/material/Unstable_Grid2'

import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'

import SendIcon from '@mui/icons-material/Send';
import DownloadIcon from '@mui/icons-material/Download';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';

import axiosInstance from '../../axios'
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { Alert, Box, Button, CircularProgress, FormControl, FormControlLabel, FormLabel, InputLabel, Menu, MenuItem, Modal, Pagination, Radio, RadioGroup, Select, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack, TextField, Tooltip, Typography } from '@mui/material';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import MachineTranslating from './MachineTranslating'
import GTranslateIcon from '@mui/icons-material/GTranslate';

import ContentEditable from 'react-contenteditable'

const actions = [
  { icon: <FileCopyIcon />, name: 'Copy' },
  { icon: <SaveIcon />, name: 'Save' },
  { icon: <PrintIcon />, name: 'Print' },
  { icon: <ShareIcon />, name: 'Share' },
];

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  boxShadow: 24,
  p: 4,
}

const Translating = () => {
  const location = useLocation().pathname
  const pathName = location.split('/')
  const fileId = pathName[pathName.length - 1]
  const slugProject = pathName[pathName.length - 2]

  const [sentences, setSentences] = useState([])
  const [project, setProject] = useState({})

  const [tm, setTm] = useState(null)
  const [openSelectTM, setOpenSelectTm] = useState(false);
  const [rowChoose, setRowChoose] = useState(0);
  const [dictionarySuggest, setDictionarySuggest] = useState([])
  const [fuzzyMatching, setFuzzyMatching] = useState([])
  const [fetchNew, setFetchNew] = useState(false)
  const [isOpenModalMachine, setIsOpenModalMachine] = useState(false)
  const [optionMachine, setOptionMachine] = useState(null)

  const [filters, setFilters] = useState({
    limit: 6,
    page: 1,
    status: 'null',
  })

  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const itemsRef = useRef([]);


  const dispatch = useDispatch()

  const handleApplySettingMachine = async () => {
    try {
      if (!optionMachine) {
        return toast.error('Please choose one option below')
      }
      dispatch({ type: 'set-backdrop' })
      const data = await axiosInstance.post('/translate/apply-machine-for-all-sentence',
        {
          projectId: project.id,
          fileId,
          optionMachine
        }
      )
      if (data.data.status) {
        setFetchNew(state => !state)
      }
      dispatch({ type: 'set-backdrop' })
    }
    catch (err) {
      dispatch({ type: 'set-backdrop' })
    }
  }

  const handleOpenFilterStatus = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleApplyCopyTarget = (data) => {
    const index = sentences.findIndex((item) => item.index == rowChoose)
    itemsRef.current[index].textContent = data
    sentences[index].textTarget = data
    sentences[index].isEdit = true
  }

  const handleCloseSelectStatus = (e) => {
    if (e.target.getAttribute('value') != null) {
      setFilters({ ...filters, status: e.target.getAttribute('value'), page: 1 })
    }

    setAnchorEl(null);
  };



  const fetchFuzzyMatching = async () => {
    try {
      const dataSentence = sentences.find(item => item.index == rowChoose).textSrc
      const data = await axiosInstance.post('/translate/fuzzy-matching', { sentence: dataSentence })
      if (data.data.status) {
        setFuzzyMatching(data.data.data)
      }
    } catch (err) {

    }
  }


  useEffect(() => {
    const fetchSentences = async () => {
      const body = {
        slug: slugProject,
        fileId: fileId,
      }
      try {
        dispatch({ type: 'set-backdrop' })
        const data = await axiosInstance.post(
          `/project/open-file-of-project?${queryString.stringify(filters)}`,
          body,
        )
        dispatch({ type: 'set-backdrop' })
        if (!data.data.status) {
          return
        }
        localStorage.setItem('recent-translate', location)
        setSentences(data.data.data.results)
        setProject(data.data.project)
        if (data.data.data.results.length > 0) {
          setRowChoose(data.data.data.results[0].index)
        }
        setTotalPages(data.data.data.totalPages)
        setTotalResults(data.data.data.totalResults)
      } catch (err) {
        dispatch({ type: 'set-backdrop' })
      }
    }
    fetchSentences()
  }, [filters, fetchNew])

  useEffect(() => {
    //fetchMachineTranslate()
    fetchFuzzyMatching()
  }, [rowChoose])

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, sentences.length);
  }, [sentences]);

  const handleChangeTarget = (e) => {
    const index = sentences.findIndex((item) => item.index == rowChoose)
    sentences[index].textTarget = e.target.value
    sentences[index].isEdit = true
  }

  const handleTranslate = async (source) => {
    const response = await axiosElastic.post('/test_cat.transmems/_search', {
      query: {
        match: {
          source: source
        }
      }
    })

    const data = response.data.hits.hits.length >= 3 ? response.data.hits.hits.slice(0, 3) : response.data.hits.hits
    setFuzzies(data)
  }

  const handleSelectTM = (e) => {
    setTm(e.target.value)
  }

  const handleOpenSelectTM = () => {
    setOpenSelectTm(true)
  }

  const handleCloseSelectTM = () => {
    setOpenSelectTm(false)
  }

  const handlePaginate = (e, page) => {
    setFilters({ ...filters, page })
  }

  const handleChangeLimit = (e) => {
    setFilters({ ...filters, limit: e.target.value })
  }

  const handleChooseRow = (e) => {
    setRowChoose(e.target.closest('tr').getAttribute('value'))
  }

  const getStatusSentence = () => {
    return [
      {
        status: 'UN_TRANSLATE',
        tittle: 'Untranslated',
        color: '#afb3af'
      },
      {
        status: 'REVIEW',
        tittle: 'Reviewing',
        color: '#f09e07'
      },
      {
        status: 'TRANSLATING',
        tittle: 'Translating',
        color: '#f0071b'
      },
      {
        status: 'CONFIRM',
        tittle: 'Confirm',
        color: '#07f01b'
      },
    ]
  }

  const convertStatusSentenceToSquareColor = (status) => {
    return getStatusSentence().filter(item => item.status == status)[0] || { status: 'null', tittle: 'All', color: 'black' }
  }



  return (
    <>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseSelectStatus}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem key={-1} onClick={handleCloseSelectStatus} sx={{ color: 'black' }} value={'null'}>All</MenuItem>
        {getStatusSentence().map((item, index) => <MenuItem key={index} value={item.status} onClick={handleCloseSelectStatus} sx={{ color: item.color }}>{item.tittle}</MenuItem>)}
      </Menu>
      <Grid2>
        <Paper sx={{ mb: 2, padding: 2 }} elevation={2}>
          <Box sx={{ justifyContent: 'space-between', display: 'flex' }}>
            {/* <Tooltip title="TM is Translation memory. Help ......" placement="top-start">
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel id="demo-simple-select-label">Translation Memory</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={tm}
                  label="TM"
                  sx={{ height: 50 }}
                  open={openSelectTM}
                  onOpen={handleOpenSelectTM}
                  onClose={handleCloseSelectTM}
                  onChange={handleSelectTM}
                >
                  <MenuItem value={10}>TM1</MenuItem>
                  <MenuItem value={20}>TM2</MenuItem>
                  <MenuItem value={30}>TM3</MenuItem>
                </Select>
              </FormControl>
            </Tooltip> */}
            <div style={{ display: 'flex' }}>
              <Tooltip title="Setting machine translating">
                <div className='tool-translate' onClick={() => setIsOpenModalMachine(true)}>
                  <GTranslateIcon />

                </div>
              </Tooltip>
            </div>
            <Button variant="outlined" color="error" startIcon={<DownloadIcon />}>
              Download file Target
            </Button>
          </Box>
        </Paper>
      </Grid2>
      <Grid2 container spacing={2} sx={{ mb: 0.1 }}>
        <Grid2 xs={12} lg={8}>
          <Paper>
            <TableContainer
              component={Paper}
              sx={{
                maxHeight: 400,
                overflow: 'scroll',
                overflowY: 'auto',
                overflowX: 'auto',
                scrollbarWidth: 'thin',
                scrollbarColor: 'green',
              }}
            >
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell width='20'>STT </TableCell>
                    <TableCell>Source ({project?.sourceLanguage}) </TableCell>
                    <TableCell align="left">Target ({project?.targetLanguage}) </TableCell>
                    <TableCell align="left" sx={{ display: 'flex' }}>
                      <div>Status</div>
                      <div>
                        <FilterAltIcon onClick={handleOpenFilterStatus} sx={{ color: convertStatusSentenceToSquareColor(filters.status).color }} />

                      </div>
                    </TableCell>
                    <TableCell align="left">Action</TableCell>
                  </TableRow >
                </TableHead >
                <TableBody>
                  {sentences.map((row, index) => (
                    <TableRow
                      key={index}
                      //sx={{ backgroundColor: row.index == rowChoose ? 'green' : 'inherit' }}
                      className={row.index != rowChoose || 'choose-row-current'}
                      value={row.index}
                      onClick={handleChooseRow}
                    >
                      <TableCell align="center">{row.index}</TableCell>
                      <TableCell component="th" scope="row" width='40%'>
                        {row.textSrc}
                      </TableCell>
                      <TableCell align="left" width='40%' sx={{ padding: 0 }}>
                        {/* <input className='input-translate' type='text' /> */}
                        {/* {row.textTarget || <span style={{ color: '#afb3af', fontStyle: 'italic' }}>Untranslated</span>} */}
                        {/* <div
                          className='div-translate'
                          style={{
                            height: '100%',
                            width: '100%',
                            paddingInline: 4,
                            paddingBlock: 10
                          }}
                          ref={el => itemsRef.current[index] = el}
                          onClick={handleEditTarget}
                          contentEditable={true}
                        >{row.textTarget}</div> */}
                        {/* <textarea className='input-translate' value={row.textTarget}>
                        </textarea> */}
                        <ContentEditable
                          innerRef={el => itemsRef.current[index] = el}
                          html={row.textTarget || ''}
                          onChange={handleChangeTarget}
                          style={{
                            paddingInline: 10,
                            paddingBlock: 4
                          }}
                        />
                      </TableCell>
                      <TableCell align="left" >
                        <Tooltip title={convertStatusSentenceToSquareColor(row.status).tittle}>
                          <Box
                            sx={{
                              margin: 'auto',
                              width: 18,
                              height: 18,
                              backgroundColor: convertStatusSentenceToSquareColor(row.status).color,
                              borderRadius: '50%',
                            }}
                          ></Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell align="left">Confirm</TableCell>
                    </TableRow>
                  ))}
                </TableBody >
              </Table >
            </TableContainer >
            <Paper spacing={1} sx={{ padding: 1, display: 'flex', justifyContent: 'space-between', mt: 1, alignItems: 'center' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 450, color: '#5c5e5d' }}>
                  Sentences per page
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
              <div style={{ fontSize: 12, fontWeight: 450, color: '#5c5e5d' }}>Have <span style={{ fontWeight: 600, fontStyle: 'italic' }}>{totalResults}</span> sentence in this file</div>
              <Pagination count={totalPages} color="primary" onChange={handlePaginate} page={filters.page} />
            </Paper>
          </Paper>
        </Grid2 >
        <Grid2 xs={12} lg={4} container>
          <Grid2 lg={12} xs={4} sx={{ border: 1, borderColor: '#b8b6b6', borderRadius: 1, mb: 0.8 }}>
            <Typography variant='h6' color='black'>Machine Translate:</Typography>
            <MachineTranslating
              rowChoose={rowChoose}
              sentences={sentences}
              target={project?.targetLanguage}
              projectId={project?.id}
              fileId={fileId}
              setFetchNew={setFetchNew}
              handleApplyCopyTarget={handleApplyCopyTarget}
            />
          </Grid2>
          <Grid2
            lg={12}
            xs={4}
            sx={{ border: 1, borderColor: '#b8b6b6', borderRadius: 1, mb: 0.8 }}
          >
            <Typography variant="h6" color="black">
              Dictionary:
            </Typography>
            <Paper variant="outline" elevation={2}>
              Dictionary
            </Paper>
          </Grid2>
          <Grid2
            lg={12}
            xs={4}
            sx={{ border: 1, borderColor: '#b8b6b6', borderRadius: 1, mb: 0.8 }}
          >
            <Typography variant="h6" color="black">
              Fuzzy Match:
            </Typography>

            <Paper variant='outline' elevation={2} >
              {fuzzyMatching.map((item, index) => <Typography key={index} variant='subtitle1'>{item}</Typography>)}
            </Paper >
          </Grid2 >
        </Grid2 >
        {/* <Grid2 xs={12} lg={4} container spacing={2}>
          <Grid2 lg={12} xs={4} sx={{ backgroundColor: 'red' }}>
            <Paper variant='outline' elevation={2} >
              Machine Translate
            </Paper >
          </Grid2>
          <Grid2 lg={12} xs={8} spacing={2} sx={{ backgroundColor: 'green' }}>
            <Grid2 lg={12} xs={8}><Paper variant='outline' elevation={2} >2</Paper ></Grid2>
            <Grid2 lg={12} xs={4}><Paper variant='outline' elevation={2} >3</Paper></Grid2>
          </Grid2>
        </Grid2> */}
      </Grid2 >
      <Box sx={{ height: 0, transform: 'translateZ(0px)', flexGrow: 1 }}>
        <SpeedDial
          ariaLabel="SpeedDial openIcon example"
          sx={{ position: 'absolute', bottom: 16, right: 16 }}
          icon={<SpeedDialIcon openIcon={<EditIcon />} />}
        >
          {actions.map((action) => (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
            />
          ))}
        </SpeedDial>
      </Box>

      <Modal // Model setting machine translate
        open={isOpenModalMachine}
        onClose={() => setIsOpenModalMachine(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={style}>
          <Typography variant="h6" className="mb-4">
            Setting for Machine Translate
          </Typography>
          <Alert severity="info">We using Machine of GoogleTranslate </Alert>
          <FormControl>
            <FormLabel id="demo-controlled-radio-buttons-group">Options</FormLabel>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={optionMachine}
              onChange={(e) => setOptionMachine(e.target.value)}
            >
              <FormControlLabel value="1" control={<Radio />} label="Apply for sentence un_translate and Confirm All" />
              <FormControlLabel value="2" control={<Radio />} label="Apply for sentence un_translate and set Translating" />
            </RadioGroup>
          </FormControl>

          <Stack direction="row" justifyContent="end">
            <Button variant="outlined" onClick={() => setIsOpenModalMachine(false)}>
              Cancel
            </Button>
            <Button variant="contained" className="ms-2" onClick={handleApplySettingMachine}>
              Apply
            </Button>
          </Stack>
        </Paper>
      </Modal>

    </>
  )
}

export default Translating
