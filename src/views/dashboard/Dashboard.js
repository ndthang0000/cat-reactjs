import React, { useEffect, useState } from 'react'
import queryString from 'query-string';

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CPagination,
  CPaginationItem,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { CChartLine } from '@coreui/react-chartjs'
import { getStyle, hexToRgba } from '@coreui/utils'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
  cilFolderOpen,
  cilArrowRight
} from '@coreui/icons'

import { pink } from '@mui/material/colors';

import avatar1 from 'src/assets/images/avatars/1.jpg'
import avatar2 from 'src/assets/images/avatars/2.jpg'
import avatar3 from 'src/assets/images/avatars/3.jpg'
import avatar4 from 'src/assets/images/avatars/4.jpg'
import avatar5 from 'src/assets/images/avatars/5.jpg'
import avatar6 from 'src/assets/images/avatars/6.jpg'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'

import { Link, useNavigate } from 'react-router-dom'

import EastIcon from '@mui/icons-material/East';

import axiosInstance from '../../axios'

import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment/moment'

import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const Dashboard = () => {

  const navigate = useNavigate()
  const isAuthenticate = useSelector((state) => state.isAuthenticate)
  const isShowBackdrop = useSelector((state) => state.isShowBackdrop)
  const dispatch = useDispatch()
  const [projectData, setProjectData] = useState([])
  const [filters, setFilters] = useState(
    {
      page: 1,
      limit: 6,
      type: 'ALL',
      search: ''
    }
  )
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')


  const getProject = async () => {
    try {
      dispatch({ type: 'set-backdrop' })
      const data = await axiosInstance.get(`/project?${queryString.stringify(filters)}`)
      dispatch({ type: 'set-backdrop' })
      if (data.status == 200) {
        setProjectData(data.data.results)
        setTotalPages(data.data.totalPages)
      }
    } catch (error) {
      dispatch({ type: 'set-backdrop' })
    }
  }

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
        const data = await axiosInstance.get(`/auth/check-token`, config)
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
    getProject()
  }, [filters])

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

  const handleOrderPage = (e) => {
    const page = Number(e.target.getAttribute('value'))
    if (page <= 0 || page > totalPages) {
      return
    }
    setFilters({ ...filters, page: Number(e.target.getAttribute('value')) })
  }

  const initPaginate = (currentPage) => {
    let data = []
    let i = currentPage - 1
    if (currentPage == 1) {
      i = 1
    }
    for (; i <= totalPages && i < currentPage + 2; i++) {
      data.push(i)
    }
    return data
  }

  const handleSelectType = async (e) => {
    setFilters({ ...filters, type: e.target.value })
  }

  return (
    <>

      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader >
              Projects
              <div className='mt-2' style={{ justifyContent: 'space-between', display: 'flex' }}>
                <CButtonGroup className="float-start me-3" onClick={handleSelectType}>
                  {['ALL', 'INDIVIDUAL'].map((value) => (
                    <CButton
                      color={value === filters.type ? 'outline-success' : "outline-secondary"}
                      key={value}
                      className="mx-0"
                      active={value === filters.type}
                      value={value}
                    >
                      {value}
                    </CButton>
                  ))}
                </CButtonGroup>
                <div style={{ display: 'flex' }}>
                  <Paper
                    component="form"
                    elevation={2}
                    sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 250, marginRight: 1 }}
                  >
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="Find Project"
                      inputProps={{ 'aria-label': 'search project' }}
                      name='search'
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
                      <SearchIcon onClick={(e) => setFilters({ ...filters, search: search })} />
                    </IconButton>
                    <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />

                  </Paper>
                  <FormControl fullWidth={false}>
                    <InputLabel id="demo-simple-select-label">Sort</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={10}
                      label="Sort"
                    >
                      <MenuItem value={10}>Last update</MenuItem>
                      <MenuItem value={20}>Files</MenuItem>
                      <MenuItem value={30}>Name</MenuItem>
                    </Select>
                  </FormControl>
                </div>

              </div>
            </CCardHeader>
            <CCardBody>
              {/* <CRow>
                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol sm={6}>
                      <div className="border-start border-start-4 border-start-info py-1 px-3">
                        <div className="text-medium-emphasis small">New Clients</div>
                        <div className="fs-5 fw-semibold">9,123</div>
                      </div>
                    </CCol>
                    <CCol sm={6}>
                      <div className="border-start border-start-4 border-start-danger py-1 px-3 mb-3">
                        <div className="text-medium-emphasis small">Recurring Clients</div>
                        <div className="fs-5 fw-semibold">22,643</div>
                      </div>
                    </CCol>
                  </CRow>

                  <hr className="mt-0" />
                  {progressGroupExample1.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                      <div className="progress-group-prepend">
                        <span className="text-medium-emphasis small">{item.title}</span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="info" value={item.value1} />
                        <CProgress thin color="danger" value={item.value2} />
                      </div>
                    </div>
                  ))}
                </CCol>

                <CCol xs={12} md={6} xl={6}>
                  <CRow>
                    <CCol sm={6}>
                      <div className="border-start border-start-4 border-start-warning py-1 px-3 mb-3">
                        <div className="text-medium-emphasis small">Pageviews</div>
                        <div className="fs-5 fw-semibold">78,623</div>
                      </div>
                    </CCol>
                    <CCol sm={6}>
                      <div className="border-start border-start-4 border-start-success py-1 px-3 mb-3">
                        <div className="text-medium-emphasis small">Organic</div>
                        <div className="fs-5 fw-semibold">49,123</div>
                      </div>
                    </CCol>
                  </CRow>

                  <hr className="mt-0" />

                  {progressGroupExample2.map((item, index) => (
                    <div className="progress-group mb-4" key={index}>
                      <div className="progress-group-header">
                        <CIcon className="me-2" icon={item.icon} size="lg" />
                        <span>{item.title}</span>
                        <span className="ms-auto fw-semibold">{item.value}%</span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="warning" value={item.value} />
                      </div>
                    </div>
                  ))}

                  <div className="mb-5"></div>

                  {progressGroupExample3.map((item, index) => (
                    <div className="progress-group" key={index}>
                      <div className="progress-group-header">
                        <CIcon className="me-2" icon={item.icon} size="lg" />
                        <span>{item.title}</span>
                        <span className="ms-auto fw-semibold">
                          {item.value}{' '}
                          <span className="text-medium-emphasis small">({item.percent}%)</span>
                        </span>
                      </div>
                      <div className="progress-group-bars">
                        <CProgress thin color="success" value={item.percent} />
                      </div>
                    </div>
                  ))}
                </CCol>
              </CRow> */}

              <br />

              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell className="text-center">
                      <CIcon icon={cilPeople} />
                    </CTableHeaderCell>
                    <CTableHeaderCell >Project Name</CTableHeaderCell>
                    <CTableHeaderCell >Owner</CTableHeaderCell>
                    <CTableHeaderCell >Progress</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Language</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Files</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Last update</CTableHeaderCell>
                    <CTableHeaderCell className="text-center">Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {projectData.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center">
                        <CAvatar size="lg" src={item.image} status={convertStatusProject(item.status)} />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-medium-emphasis">
                          <Link to={`/project/detail/${item.slug}`}>
                            <strong className='cursor-pointer project-name'>{item.projectName}</strong>
                          </Link>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="small text-medium-emphasis">
                          <strong className='cursor-pointer'>{item.owner.name}</strong>
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div className="clearfix">
                          <div className="float-start">
                            <strong>{item.percentComplete}%</strong>
                          </div>
                          <div className="float-end">
                            <strong className="text-medium-emphasis">100%</strong>
                          </div>
                        </div>
                        <CProgress thin color={convertStatusProject(item.status)} value={item.percentComplete} />
                      </CTableDataCell>

                      <CTableDataCell className="text-center" style={{ fontSize: 14, fontStyle: 'italic' }}>
                        {/* <CIcon size="xl" icon={item.flag} title={item.name} /> */}
                        <div>
                          {item.sourceLanguage}
                          <CIcon icon={cilArrowRight} />
                          {item.targetLanguage}
                        </div>
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                        <div>{item.files.length}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div>{moment(item.updatedAt).fromNow()}</div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <CIcon icon={cilFolderOpen} className='cursor-pointer' />
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              <CPagination size="sm" aria-label="Page navigation example" className='float-end mt-4 cursor-pointer' onClick={handleOrderPage}>
                <CPaginationItem disabled={filters.page == 1 ? true : false} value={filters.page - 1}>Previous</CPaginationItem>
                {initPaginate(filters.page).map((item, index) =>
                  <CPaginationItem active={item == filters.page} key={index} value={item}>{item}</CPaginationItem>
                )}
                <CPaginationItem disabled={filters.page == totalPages ? true : false} value={filters.page + 1}>Next</CPaginationItem>
              </CPagination>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* <WidgetsDropdown /> */}
      {/* <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Traffic
              </h4>
              <div className="small text-medium-emphasis">January - July 2021</div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton color="primary" className="float-end">
                <CIcon icon={cilCloudDownload} />
              </CButton>
              <CButtonGroup className="float-end me-3">
                {['Day', 'Month', 'Year'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={value === 'Month'}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          <CChartLine
            style={{ height: '300px', marginTop: '40px' }}
            data={{
              labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
              datasets: [
                {
                  label: 'My First dataset',
                  backgroundColor: hexToRgba(getStyle('--cui-info'), 10),
                  borderColor: getStyle('--cui-info'),
                  pointHoverBackgroundColor: getStyle('--cui-info'),
                  borderWidth: 2,
                  data: [
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                  ],
                  fill: true,
                },
                {
                  label: 'My Second dataset',
                  backgroundColor: 'transparent',
                  borderColor: getStyle('--cui-success'),
                  pointHoverBackgroundColor: getStyle('--cui-success'),
                  borderWidth: 2,
                  data: [
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                    random(50, 200),
                  ],
                },
                {
                  label: 'My Third dataset',
                  backgroundColor: 'transparent',
                  borderColor: getStyle('--cui-danger'),
                  pointHoverBackgroundColor: getStyle('--cui-danger'),
                  borderWidth: 1,
                  borderDash: [8, 5],
                  data: [65, 65, 65, 65, 65, 65, 65],
                },
              ],
            }}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                x: {
                  grid: {
                    drawOnChartArea: false,
                  },
                },
                y: {
                  ticks: {
                    beginAtZero: true,
                    maxTicksLimit: 5,
                    stepSize: Math.ceil(250 / 5),
                    max: 250,
                  },
                },
              },
              elements: {
                line: {
                  tension: 0.4,
                },
                point: {
                  radius: 0,
                  hitRadius: 10,
                  hoverRadius: 4,
                  hoverBorderWidth: 3,
                },
              },
            }}
          />
        </CCardBody>
        <CCardFooter>
          <CRow xs={{ cols: 1 }} md={{ cols: 5 }} className="text-center">
            {progressExample.map((item, index) => (
              <CCol className="mb-sm-2 mb-0" key={index}>
                <div className="text-medium-emphasis">{item.title}</div>
                <strong>
                  {item.value} ({item.percent}%)
                </strong>
                <CProgress thin className="mt-2" color={item.color} value={item.percent} />
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard> */}

      {/* <WidgetsBrand withCharts /> */}


    </>
  )
}

export default Dashboard
