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
import { Alert, Box, Button, CircularProgress, FormControl, FormControlLabel, FormLabel, InputLabel, ListItemIcon, ListItemText, Menu, MenuItem, MenuList, Modal, Pagination, Radio, RadioGroup, Select, SpeedDial, SpeedDialAction, SpeedDialIcon, Stack, TextField, Tooltip, Typography } from '@mui/material';
import queryString from 'query-string';
import { useLocation } from 'react-router-dom';
import MachineTranslating from './MachineTranslating'
import GTranslateIcon from '@mui/icons-material/GTranslate';
import CachedIcon from '@mui/icons-material/Cached';

import ContentEditable from 'react-contenteditable'
import { CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { ContentCopy, ContentCut, ContentPaste } from '@mui/icons-material'

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

  console.log('Re-render')

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
  const [fetchTempNew, setFetchTempNew] = useState(false)
  const [isOpenModalMachine, setIsOpenModalMachine] = useState(false)
  const [isOpenModalCreateTermBase, setIsOpenModalCreateTermBase] = useState(false)
  const [optionMachine, setOptionMachine] = useState(null)
  const [statisticFile, setStatisticFile] = useState([])
  const [termBaseValue, setTermBaseValue] = useState({ src: ' ', target: ' ' })

  const [filters, setFilters] = useState({
    limit: 6,
    page: 1,
    status: 'null',
  })

  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  const [anchorEl, setAnchorEl] = useState(null);
  const [createTermBase, setCreateTermBase] = useState(null);
  const open = Boolean(anchorEl);
  const openCreateTermBase = Boolean(createTermBase);

  const itemsRef = useRef([]);


  const dispatch = useDispatch()

  const handleConfirmSentence = async (e) => {
    try {
      setIsOpenModalMachine(false)

      const splitButton = e.target.value.split('***')
      const sentenceId = splitButton[0]
      const indexArraySentence = Number(splitButton[1])
      const indexSentence = Number(splitButton[2])

      dispatch({ type: 'set-backdrop' })
      const data = await axiosInstance.post('/translate/confirm-sentence',
        {
          projectId: project.id,
          fileId,
          sentenceId,
          data: itemsRef.current[indexArraySentence].textContent
        }
      )

      dispatch({ type: 'set-backdrop' })
      if (data.data.status) {
        sentences[indexArraySentence].status = 'CONFIRM'
        sentences[indexArraySentence].textTarget = itemsRef.current[indexArraySentence].textContent
        setFetchTempNew(state => !state)
        //setSentences(state => state.map(item => { return { ...item } }))
      }
    }
    catch (err) {
      dispatch({ type: 'set-backdrop' })
    }
  }

  const handleApplySettingMachine = async () => {
    try {
      if (!optionMachine) {
        return toast.error('Please choose one option below')
      }
      dispatch({ type: 'set-backdrop' })
      setIsOpenModalMachine(false)
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

  const handleDownloadFile = async () => {
    try {
      dispatch({ type: 'set-backdrop' })
      const data = await axiosInstance.post('/project/export-file', {
        projectId: project.id,
        fileId
      })
      dispatch({ type: 'set-backdrop' })
      if (data.data.status) {
        const link = document.createElement('a');
        link.href = data.data.data;
        link.click();
      }
    } catch (error) {
      dispatch({ type: 'set-backdrop' })
    }
  }

  const handleApplyCopyTarget = (data) => {
    const index = sentences.findIndex((item) => item.index == rowChoose)
    if (index == -1) {
      return
    }
    itemsRef.current[index].textContent = data
    sentences[index].textTarget = data
    sentences[index].status = 'DRAFT'
    setFetchTempNew(state => !state)
    //setSentences(state => [...state])
  }

  const handleApplyTranslateTarget = (data) => {
    const index = sentences.findIndex((item) => item.index == rowChoose)
    if (index == -1) {
      return
    }
    itemsRef.current[index].textContent = data
    sentences[index].textTarget = data
    sentences[index].status = 'CONFIRM'
    setFetchTempNew(state => !state)
    // setSentences(state => [...state])
  }

  const handleCloseSelectStatus = (e) => {
    if (e.target.getAttribute('value') != null) {
      setFilters({ ...filters, status: e.target.getAttribute('value'), page: 1 })
    }

    setAnchorEl(null);
  };

  const handleDetectLanguage = async (text) => {
    const data = await axiosInstance.post('/project/detect-language',
      {
        text
      }
    )
    return data
  };

  const handleOpenModalCreateTermBase = async () => {
    setIsOpenModalCreateTermBase(true)
    setCreateTermBase(null)
    const data = await handleDetectLanguage(termBaseValue.src)
    const language = data.data.data
    if (project.sourceLanguage == language) {
      setTermBaseValue(state => { return { ...state, target: '' } })
    }
    if (project.targetLanguage == language) {
      setTermBaseValue(state => { return { ...state, src: '' } })
    }
  }

  const fetchFuzzyMatching = async () => {
    try {
      const dataSentence = sentences.find(item => item.index == rowChoose).textSrc
      const data = await axiosInstance.post('/translate/fuzzy-matching', { sentence: dataSentence, projectId: project.id, fileId })
      console.log('fuzzy', data)
      if (data.data.status) {
        setFuzzyMatching(data.data.data)
        setDictionarySuggest(data.data.dataTB)
      }
    } catch (err) {

    }
  }

  const fetchTermBase = async () => {
    try {
      const dataSentence = sentences.find(item => item.index == rowChoose).textSrc
      const data = await axiosInstance.post('/translate/query-term-base', { sentence: dataSentence, projectId: project.id })
      if (data.data.status) {
        setDictionarySuggest(data.data.data)
      }
    } catch (err) {

    }
  }

  const handleCreateNewTermBase = async () => {
    try {
      dispatch({ type: 'set-backdrop' })
      const data = await axiosInstance.post(`project/create-term-base`,
        {
          projectId: project?.id,
          src: termBaseValue.src,
          target: termBaseValue.target,
        })
      setIsOpenModalCreateTermBase(false)
      dispatch({ type: 'set-backdrop' })
    } catch (error) {
      dispatch({ type: 'set-backdrop' })
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

        if (!data.data.status) {
          return
        }
        dispatch({ type: 'set-backdrop' })
        localStorage.setItem('recent-translate', location)
        setSentences(data.data.data.results)
        setProject(data.data.project)
        setTotalPages(data.data.data.totalPages)
        setTotalResults(data.data.data.totalResults)
        if (data.data.data.results.findIndex(item => item.index == rowChoose) == -1 && data.data.data.results.length > 0) {
          setRowChoose(data.data.data.results[0].index)
        }
      } catch (err) {
        dispatch({ type: 'set-backdrop' })
      }
    }
    const fetchStatistic = async () => {
      const body = {
        fileId: fileId,
      }
      try {
        const data = await axiosInstance.post(
          `/translate/statistic-file`,
          body,
        )

        if (!data.data.status) {
          return
        }
        setStatisticFile(data.data.data)
      } catch (err) {
        dispatch({ type: 'set-backdrop' })
      }
    }
    fetchSentences()
    fetchStatistic()
  }, [filters, fetchNew])

  useEffect(() => {
    fetchFuzzyMatching()
  }, [rowChoose])

  useEffect(() => {
    itemsRef.current = itemsRef.current.slice(0, sentences.length);
  }, [sentences]);

  useEffect(() => {
    function getSelectedText() {
      let txt;
      if (window.getSelection) {
        txt = window.getSelection();
      } else if (window.document.getSelection) {
        txt = window.document.getSelection();
      } else if (window.document.selection) {
        txt = window.document.selection.createRange().text;
      }
      return txt;
    }
    const handleEventMouseup = (e) => {
      const txt = getSelectedText().toString()
      if (txt.trim().length > 0) {
        setCreateTermBase(e.target)
        setTermBaseValue({ src: txt.trim(), target: txt.trim() })
        // alert(txt + e)
      }
    }
    document.addEventListener('mouseup', handleEventMouseup)
    return () => {
      document.removeEventListener('mouseup', handleEventMouseup)
    }
  }, [])

  const handleChangeTarget = (e) => {
    const index = sentences.findIndex((item) => item.index == rowChoose)
    sentences[index].textTarget = e.target.value
    sentences[index].status = 'DRAFT'
    // setFetchTempNew(state => !state)
    //setSentences(state => state.map(item => { return { ...item } }))
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
        color: '#09ab1e'
      },
      {
        status: 'DRAFT',
        tittle: 'Draft',
        color: '#b27ecf'
      },
    ]
  }

  const convertStatusSentenceToSquareColor = (status) => {
    return getStatusSentence().filter(item => item.status == status)[0] || { status: 'null', tittle: 'All', color: 'black' }
  }



  return (
    <>
      <Menu
        id="demo-positioned-menu-2"
        aria-labelledby="demo-positioned-button-2"
        anchorEl={createTermBase}
        open={openCreateTermBase}
        onClose={() => setCreateTermBase(null)}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <MenuItem>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ContentPaste fontSize="small" />
          </ListItemIcon>
          <ListItemText onClick={handleOpenModalCreateTermBase}>Add To Term Base</ListItemText>
        </MenuItem>

      </Menu>

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
        {getStatusSentence().filter(item => item.tittle != 'Draft').map((item, index) => <MenuItem key={index} value={item.status} onClick={handleCloseSelectStatus} sx={{ color: item.color }}>{item.tittle}</MenuItem>)}
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
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ marginRight: 10, fontWeight: 550 }}>Tool: </span>
              <Tooltip title="Setting machine translating">
                <div className='tool-translate' onClick={() => setIsOpenModalMachine(true)}>
                  <GTranslateIcon />

                </div>
              </Tooltip>
            </div>
            <Button variant="outlined" color="error" startIcon={<DownloadIcon />} onClick={handleDownloadFile}>
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
              <Table stickyHeader sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell width='20'>STT </TableCell>
                    <TableCell>Source ({project?.sourceLanguage}) </TableCell>
                    <TableCell align="left">Target ({project?.targetLanguage}) </TableCell>
                    <TableCell align="left" >
                      <div style={{ display: 'flex' }}>
                        <div>Status</div>
                        <div>
                          <FilterAltIcon onClick={handleOpenFilterStatus} sx={{ color: convertStatusSentenceToSquareColor(filters.status).color }} />

                        </div>
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
                      <TableCell component="th" scope="row" width='40%' className='text-term-base'>
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
                            paddingBlock: 4,
                            color: convertStatusSentenceToSquareColor(row.status).color
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
                      <TableCell align="left">
                        {
                          row.status == 'CONFIRM'
                          ||
                          <Button variant="contained" color="success" size='small' onClick={handleConfirmSentence} value={row.id + '***' + index + '***' + row.index} >
                            Confirm
                          </Button>
                        }

                      </TableCell>
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
              <div style={{ fontSize: 12, fontWeight: 450, color: '#5c5e5d' }}>Have <span style={{ fontWeight: 600, fontStyle: 'italic' }}>{totalResults}</span> sentence in this workspace</div>
              <Pagination count={totalPages} color="primary" onChange={handlePaginate} page={filters.page} />
            </Paper>
            <Paper className='sticky-footer' elevation={5}>
              <div className='sticky-footer-container'>
                {statisticFile.map(item =>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 450,
                      color: '#5c5e5d',
                      textAlign: 'center',
                      paddingInline: 15,
                      paddingBlock: 10,
                      backgroundColor: 'rgba(160, 216, 162, 0.2)'
                    }}>
                    {item.status}:
                    <span style={{ fontWeight: 600, fontStyle: 'italic' }}>
                      {' ' + item.count + ' '}
                    </span>
                    sentence
                  </div>)}

              </div>

            </Paper>
          </Paper>
        </Grid2 >
        <Grid2 xs={12} lg={4} container>
          <Grid2 lg={12} xs={4} sx={{ border: 1, borderColor: '#b8b6b6', borderRadius: 1, mb: 0.8 }}>
            <Typography variant='h6' color='black'>Machine Translate:</Typography>
            <MachineTranslating
              dictionarySuggest={dictionarySuggest}
              rowChoose={rowChoose}
              sentences={sentences}
              target={project?.targetLanguage}
              projectId={project?.id}
              fileId={fileId}
              setFetchNew={setFetchNew}
              handleApplyCopyTarget={handleApplyCopyTarget}
              handleApplyTranslateTarget={handleApplyTranslateTarget}
            />
          </Grid2>
          <Grid2
            lg={12}
            xs={4}
            sx={{ border: 1, borderColor: '#b8b6b6', borderRadius: 1, mb: 0.8 }}
          >
            <Typography variant="h6" color="black" sx={{ mb: 1 }}>
              Term Base
            </Typography>
            <Paper variant="outline" elevation={2}>
              {dictionarySuggest.length == 0
                ? '- Nothing' :
                <div>
                  {dictionarySuggest.map((item, index) =>
                    <div>
                      <span className='term-base-suggest-src'>{item.source}</span>  - <span className='term-base-suggest-target'>{item.target}</span>
                    </div>
                  )}
                </div>
              }
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

            <Paper variant="outline" elevation={2}>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">#</CTableHeaderCell>
                    <CTableHeaderCell>Source</CTableHeaderCell>
                    <CTableHeaderCell>Target</CTableHeaderCell>
                    <CTableHeaderCell>Score</CTableHeaderCell>{' '}
                  </CTableRow>
                </CTableHead>

                <CTableBody>
                  {fuzzyMatching.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center">{index + 1}</CTableDataCell>
                      <CTableDataCell>{project.isTmReverse ? item._source.target : item._source.source}</CTableDataCell>
                      <CTableDataCell>{project.isTmReverse ? item._source.source : item._source.target}</CTableDataCell>
                      <CTableDataCell>{item._score}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </Paper>
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

      <Modal // Model add Term Base
        open={isOpenModalCreateTermBase}
        onClose={() => setIsOpenModalCreateTermBase(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Paper sx={style}>
          <Typography variant="h6" className="mb-4">
            Create New Term Base
          </Typography>
          <Alert severity="info">We using Machine of GoogleTranslate </Alert>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 5 }}>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField id="outlined-basic" label={project?.sourceLanguage} variant="outlined" value={termBaseValue.src} onChange={e => setTermBaseValue({ ...termBaseValue, src: e.target.value })} />
            </FormControl>
            <div><CachedIcon color={'secondary'} /></div>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              {/* <InputLabel htmlFor="grouped-select-2">Target</InputLabel> */}
              <TextField id="outlined-basic" label={project?.targetLanguage} variant="outlined" value={termBaseValue.target} onChange={e => setTermBaseValue({ ...termBaseValue, target: e.target.value })} />
            </FormControl>
          </Box>

          <Stack direction="row" justifyContent="end">
            <Button variant="outlined" onClick={() => { setIsOpenModalCreateTermBase(false); setCreateTermBase(null) }}>
              Cancel
            </Button>
            <Button variant="contained" className="ms-2" onClick={handleCreateNewTermBase}>
              Create
            </Button>
          </Stack>
        </Paper>
      </Modal>

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
