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

import axiosInstance from '../../axios'
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';


const Translating = ({ project, setFetchNew, fileIsTranslating }) => {
  const [sentences, setSentences] = useState([])
  const dispatch = useDispatch()
  useEffect(() => {
    const fetchSentences = async () => {
      const body = {
        projectId: project?.projects?.id,
        fileId: fileIsTranslating,
      }
      try {
        dispatch({ type: 'set-backdrop' })
        const data = await axiosInstance.post('/project/open-file-of-project', body)
        dispatch({ type: 'set-backdrop' })
        if (!data.data.status) {
          return
        }
        setSentences(data.data.data)
      }
      catch (err) {
        dispatch({ type: 'set-backdrop' })
      }



    }
    fetchSentences()
  }, [])
  return (
    <>
      <Grid2 container spacing={1}>
        <Grid2 sm={12} md={8}>
          <Paper>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell width='20'>STT </TableCell>
                    <TableCell>Source ({project?.projects?.sourceLanguage}) </TableCell>
                    <TableCell align="left">Target ({project?.projects?.targetLanguage}) </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sentences.map((row, index) => (
                    <TableRow
                      key={row.name}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell align="center">{index + 1}</TableCell>
                      <TableCell component="th" scope="row" width='50%'>
                        {row.textSrc}
                      </TableCell>
                      <TableCell align="left" width='50%'>{row.textTarget}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid2>
        <Grid2 sm={12} md={4}>
          <Paper>Translation Result</Paper>
        </Grid2>

      </Grid2>

    </>
  )
}

export default Translating
