import React, { useEffect, useState } from 'react'
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Grid2 from '@mui/material/Unstable_Grid2';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import SendIcon from '@mui/icons-material/Send';
import DownloadIcon from '@mui/icons-material/Download';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

import axiosInstance from '../../axios'
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { Box, Button, FormControl, InputLabel, Menu, MenuItem, Pagination, Select, Stack, Tooltip, Typography } from '@mui/material';
import queryString from 'query-string';

const Translating = ({ project, setFetchNew, fileIsTranslating }) => {
  const [sentences, setSentences] = useState([])
  const [tm, setTm] = useState(null)
  const [openSelectTM, setOpenSelectTm] = useState(false);
  const [rowChoose, setRowChoose] = useState(1);

  const [filters, setFilters] = useState({
    limit: 6,
    page: 1,
    status: 'null'
  })

  const [totalPages, setTotalPages] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleOpenFilterStatus = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseSelectStatus = (e) => {
    setFilters({ ...filters, status: e.target.getAttribute('value') })
    setAnchorEl(null);
  };

  const dispatch = useDispatch()
  useEffect(() => {
    const fetchSentences = async () => {
      const body = {
        projectId: project?.projects?.id,
        fileId: fileIsTranslating,
      }
      try {
        dispatch({ type: 'set-backdrop' })
        const data = await axiosInstance.post(`/project/open-file-of-project?${queryString.stringify(filters)}`, body)
        dispatch({ type: 'set-backdrop' })
        if (!data.data.status) {
          return
        }
        setSentences(data.data.data.results)
        setTotalPages(data.data.data.totalPages)
        setTotalResults(data.data.data.totalResults)
      }
      catch (err) {
        dispatch({ type: 'set-backdrop' })
      }
    }
    fetchSentences()
  }, [filters])

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
    console.log(e.target.querySelector('tr'))
    setRowChoose(e.target.getAttribute('value'))
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
        <Paper sx={{ mb: 2, padding: 2 }} elevation={2} >
          <Box sx={{ justifyContent: 'space-between', display: 'flex' }}>
            <Tooltip title="TM is Translation memory. Help ......" placement='top-start'>
              <FormControl sx={{ minWidth: 200, }}>
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

            </Tooltip>
            <Button variant="outlined" color="error" startIcon={<DownloadIcon />}>
              Download file Target
            </Button>
          </Box>
        </Paper>
      </Grid2>
      <Grid2 container spacing={2}>
        <Grid2 xs={12} lg={8}>
          <Paper>
            <TableContainer component={Paper} sx={{
              maxHeight: 400, overflow: 'scroll', overflowY: 'auto', overflowX: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'green'
            }}>

              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell width='20'>STT </TableCell>
                    <TableCell>Source ({project?.projects?.sourceLanguage}) </TableCell>
                    <TableCell align="left">Target ({project?.projects?.targetLanguage}) </TableCell>
                    <TableCell align="left" sx={{ display: 'flex' }}>
                      <div>Status</div>
                      <div>
                        <FilterAltIcon onClick={handleOpenFilterStatus} sx={{ color: convertStatusSentenceToSquareColor(filters.status).color }} />

                      </div>
                    </TableCell>
                    <TableCell align="left">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody onClick={handleChooseRow}>
                  {sentences.map((row, index) => (
                    <TableRow
                      key={row.name}
                      sx={{ backgroundColor: row.index == rowChoose ? 'green' : 'inherit' }}

                      value={row.index}

                    >
                      <TableCell align="center">{row.index}</TableCell>
                      <TableCell component="th" scope="row" width='40%'>
                        {row.textSrc}
                      </TableCell>
                      <TableCell align="left" width='40%'>{row.textTarget || '___'}</TableCell>
                      <TableCell align="left" >
                        <Tooltip title={convertStatusSentenceToSquareColor(row.status).tittle}>
                          <Box sx={{ margin: 'auto', width: 18, height: 18, backgroundColor: convertStatusSentenceToSquareColor(row.status).color, borderRadius: '50%' }}>

                          </Box>

                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Paper spacing={1} sx={{ padding: 1, display: 'flex', justifyContent: 'space-between', mt: 1 }}>
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
              <Pagination count={totalPages} color="primary" onChange={handlePaginate} />
            </Paper>

          </Paper>
        </Grid2>
        <Grid2 xs={12} lg={4} container>
          <Grid2 lg={12} xs={4} sx={{ border: 1, borderColor: '#b8b6b6', borderRadius: 1, mb: 0.8 }}>
            <Typography variant='h6' color='black'>Machine Translate:</Typography>
            <Paper variant='outline' elevation={2} >
              Xin chào
            </Paper >
          </Grid2>
          <Grid2 lg={12} xs={4} sx={{ border: 1, borderColor: '#b8b6b6', borderRadius: 1, mb: 0.8 }}>
            <Typography variant='h6' color='black'>Dictionary:</Typography>
            <Paper variant='outline' elevation={2} >
              Dictionary
            </Paper >
          </Grid2>
          <Grid2 lg={12} xs={4} sx={{ border: 1, borderColor: '#b8b6b6', borderRadius: 1, mb: 0.8 }}>
            <Typography variant='h6' color='black'>Fuzzy Match:</Typography>

            <Paper variant='outline' elevation={2} >
              Fuzzy Match
            </Paper >
          </Grid2>
        </Grid2>
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

      </Grid2>

    </>
  )
}

export default Translating
