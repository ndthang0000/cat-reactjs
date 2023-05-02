import React, { useEffect, useState } from 'react'
import queryString from 'query-string';




import { useLocation, useNavigate } from 'react-router-dom'

import DOMAIN from 'src/domain'

import axios from 'axios'

import axiosInstance from '../../axios'

import { useSelector, useDispatch } from 'react-redux'


import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Overview from './OverviewProject';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

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
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const DetailProject = () => {

  const params = useLocation().pathname.split('/')
  const lastParam = params[params.length - 1]
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [project, setProject] = useState({})
  const [fetchNew, setFetchNew] = useState(false)
  const isAuthenticate = useSelector((state) => state.isAuthenticate)



  const [value, setValue] = React.useState(0);

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };




  useEffect(() => {
    const checkToken = async () => {
      const getLocalToken = localStorage.getItem('token')
      if (!getLocalToken) {
        return navigate('/login')
      }
      try {
        const config = {
          headers: { Authorization: `Bearer ${getLocalToken}` },
        };
        const data = await axios.get(`${DOMAIN}/auth/check-token`, config)
        dispatch({ type: 'login', userInformation: data.data.user })
      }
      catch (err) {
        localStorage.removeItem('token')
        return navigate('/login')
      }
    }
    if (!isAuthenticate) {
      checkToken()

    }
  }, [])

  useEffect(() => {
    const getDetailProject = async () => {
      const data = await axiosInstance.get(`${DOMAIN}/project/detail/${lastParam}`)
      if (data.data.status) {
        setProject(data.data.data)
      }
    }
    getDetailProject()
  }, [fetchNew])


  return (
    <>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChangeTab} aria-label="basic tabs example">
            <Tab label="Overview" {...a11yProps(0)} />
            <Tab label="Activity" {...a11yProps(1)} />
            <Tab label="Member" {...a11yProps(2)} />
            <Tab label="Item Three" {...a11yProps(3)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Overview project={project} setFetchNew={setFetchNew} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          Member
        </TabPanel>
        <TabPanel value={value} index={2}>
          Item Three
        </TabPanel>
        <TabPanel value={value} index={3}>
          Item Three
        </TabPanel>
      </Box>



    </>
  )
}

export default DetailProject
