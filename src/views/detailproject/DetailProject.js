import React, { useEffect, useState } from 'react'
import queryString from 'query-string'

import { useLocation } from 'react-router-dom'

import axiosInstance from '../../axios'


import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Overview from './OverviewProject'
import Member from './MemberProject'
import Activity from './ActivityProject'
import GeneralProject from './GeneralProject'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}

const DetailProject = () => {
  const params = useLocation().pathname.split('/')
  const lastParam = params[params.length - 1]
  const searchData = queryString.parse(useLocation().search)
  const [project, setProject] = useState({})
  const [fetchNew, setFetchNew] = useState(false)
  const [fileIsTranslating, setFileIsTranslating] = useState('')

  console.log(searchData?.tab)

  const [value, setValue] = useState(Number(searchData?.tab) || 0);
  console.log(value)
  const handleChangeTab = (event, newValue) => {
    setValue(newValue)
  }

  useEffect(() => {
    const getDetailProject = async () => {
      try {
        const data = await axiosInstance.get(`/project/detail/${lastParam}`)
        if (data.data.status) {
          setProject(data.data.data)
        }
      } catch (error) {
        console.log(error)
      }
    }
    getDetailProject()
  }, [fetchNew])

  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChangeTab} aria-label="basic tabs example">
            <Tab label="General" {...a11yProps(-1)} />
            <Tab label="Manage File" {...a11yProps(0)} />
            <Tab label="Member" {...a11yProps(1)} />
            <Tab label="Activity" {...a11yProps(2)} />
            {/* <Tab label="Translating" {...a11yProps(3)} /> */}
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <GeneralProject
            project={project}
            handleChangeTab={handleChangeTab}
            setFetchNew={setFetchNew} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Overview
            project={project}
            setFetchNew={setFetchNew}
            handleChangeTab={handleChangeTab}
            setFileIsTranslating={setFileIsTranslating}
          />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Member project={project} setFetchNew={setFetchNew} />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Activity project={project} />
        </TabPanel>
      </Box>
    </>
  )
}

export default DetailProject
