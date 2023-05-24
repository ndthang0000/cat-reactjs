import { Box, Button, ButtonGroup, CircularProgress, Paper } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axiosInstance from '../../axios'



function MachineTranslating({ rowChoose, sentences, target, projectId, fileId, setFetchNew, handleApplyCopyTarget, handleApplyTranslateTarget }) {
  const [machineSuggest, setMachineSuggest] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCopyTarget = () => {
    handleApplyCopyTarget(machineSuggest)
  }

  const getCurrentDataSentence = () => {
    return sentences.find(item => item.index == rowChoose) || {}
  }

  const fetchMachineTranslate = async () => {
    if (getCurrentDataSentence().machineTranslate) {
      setMachineSuggest(getCurrentDataSentence().machineTranslate)
      return
    }
    try {
      const dataSentence = getCurrentDataSentence().textSrc
      if (!dataSentence) return
      setLoading(true)
      const data = await axiosInstance.post('/translate/machine-translate/sentence',
        {
          sentence: dataSentence,
          target
        }
      )
      setLoading(false)
      if (data.data.status) {
        getCurrentDataSentence().machineTranslate = data.data.data
        setMachineSuggest(data.data.data)
      }
    } catch (err) {
      setLoading(false)
    }
  }

  const handleApplySentence = async () => {
    try {
      setLoading(true)
      const data = await axiosInstance.post('/translate/apply-machine-for-all-one',
        {
          projectId,
          fileId,
          sentenceId: getCurrentDataSentence()?.id
        }
      )
      //setFetchNew(state => !state)
      handleApplyTranslateTarget(data.data.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMachineTranslate()
  }, [rowChoose])

  return (
    <Paper variant='outline' elevation={2} >
      {loading ?
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}><CircularProgress /></div>
        :
        <div>
          <span>{machineSuggest}</span>
          {
            getCurrentDataSentence().status == 'TRANSLATING' ||
            <div style={{ display: 'flex' }}>
              {/* <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  '& > *': {
                    m: 1,
                  },
                }}
              >
                <ButtonGroup size="small" aria-label="small button group">
                  <Button key="one" variant='outlined' color='primary'>Apply</Button>,
                  <Button key="two" color='successs'>Copy to Target</Button>,
                </ButtonGroup>
              </Box> */}
              <Button
                color="secondary"
                variant='outlined'
                sx={{ marginTop: 2, display: 'block' }}
                onClick={handleApplySentence}
              >

                Apply
              </Button>
              <Button
                color="warning"
                variant='outlined'
                sx={{ marginTop: 2, display: 'block' }}
                onClick={handleCopyTarget}
              >

                Copy to Target
              </Button>
            </div>


          }

        </div>
      }
    </Paper >
  )
}

export default MachineTranslating