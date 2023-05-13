import { Alert, Avatar, Stack } from '@mui/material'
import Button from '@mui/material/Button'
import React, { useEffect, useState } from 'react'
import FileUpload from 'react-mui-fileuploader'
import Paper from '@mui/material/Paper'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import moment from 'moment/moment'
import axiosInstance from '../../axios'
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { CProgress } from '@coreui/react'

const Overview = ({ project, setFetchNew }) => {
  const [filesToUpload, setFilesToUpload] = useState([])
  const isShowBackdrop = useSelector((state) => state.isShowBackdrop)
  const dispatch = useDispatch()

  const handleFilesChange = (files) => {
    setFilesToUpload([...files])
  }

  const handleFileUploadError = (files) => { }

  const handleRemoveFile = (context) => { }

  const handleUploadFileToServer = async () => {
    try {
      dispatch({ type: 'set-backdrop' })
      const formData = new FormData()

      filesToUpload.forEach((file) => {
        formData.append(`files`, file)
      })

      //formData.append('files', filesToUpload)
      formData.append('projectId', project.projects.id)
      const data = await axiosInstance.post('/project/upload-file', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      setFetchNew((state) => !state)
      dispatch({ type: 'set-backdrop' })
    } catch (error) {
      dispatch({ type: 'set-backdrop' })
    }
  }

  const [expanded, setExpanded] = React.useState(false)

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false)
  }

  return (
    <>
      <Paper elevation={6} sx={{ padding: 3 }}>
        <Alert severity="info">We only support DOCX file !!! </Alert>
        <div>
          {project.projects &&
            project.projects.files.map((item, index) => (
              <Accordion
                key={index}
                expanded={expanded === `panel${index + 1}`}
                onChange={handleAccordionChange(`panel${index + 1}`)}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Avatar variant="rounded" src={item.icon} sx={{ marginRight: 3 }}>
                  </Avatar>
                  <Typography sx={{ width: '33%', flexShrink: 0 }} variant='h6'>
                    {item.nameFile}
                  </Typography>
                  <Typography sx={{ color: 'text.secondary', width: '50%' }} variant='subtitle2' >Last updated: {moment(item.updatedAt).fromNow()}</Typography>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginRight: 10 }}
                  // onClick={(e) => { handleChangeTab(e, 3); setFileIsTranslating(item.id) }}
                  >
                    <Link to={`/project/translate/${project.projects.slug}/${item.id}`}>

                      <Avatar
                        variant="rounded"
                        src='https://images-storage-bucket.s3.ap-southeast-1.amazonaws.com/upload/avatar/icon/translation.png'
                        sx={{ marginRight: 3 }}
                      />
                    </Link>
                  </div>
                  {/* <Link to={'./example'} style={{ display: 'block', textDecoration: 'none', color: '#000', width: '33%', flexShrink: 0 }}>
                    <Typography
                      variant="h6"
                      className="hover-text-decoration"
                    >
                      {item.nameFile}
                    </Typography>
                  </Link> */}

                  <Typography sx={{ width: '20%', flexShrink: 0 }}>
                    <Typography sx={{ width: '75%' }}>
                      <div className="clearfix">
                        <div className="float-start">
                          <strong>50%</strong>
                          {/* <strong>{item.percentComplete}%</strong> */}
                        </div>
                        <div className="float-end">
                          <strong className="text-medium-emphasis">100%</strong>
                        </div>
                      </div>
                      <CProgress
                        thin
                        color="yellow"
                        // color={convertStatusProject(item.status)}
                        // value={item.percentComplete}
                        value="50"
                      />
                    </Typography>
                  </Typography>
                  <Typography
                    sx={{ color: 'text.secondary', width: '33%', flexShrink: 0.7 }}
                    variant="subtitle2"
                  >
                    Last updated: {moment(item.updatedAt).fromNow()}
                  </Typography>
                  {/* <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      width: '100%',
                      marginRight: 10,
                    }}
                  >
                    <Avatar
                      variant="rounded"
                      src="https://images-storage-bucket.s3.ap-southeast-1.amazonaws.com/upload/avatar/icon/translation.png"
                      sx={{ marginRight: 3 }}
                    />
                  </div> */}

                </AccordionSummary>
                <AccordionDetails className="d-flex justify-content-between align-items-end">
                  <div>
                    <Typography>Language: EN-VI{/* Language: {item.language} */}</Typography>
                    <Typography>Quantity Sentence: {item.quantitySentence}</Typography>
                    <Typography>Created At: {moment(item.createdAt).format('LLL')}</Typography>
                  </div>
                  <div>
                    <Button variant="outlined" onClick={handleRemoveFile}>
                      Delete
                    </Button>
                  </div>
                </AccordionDetails>
              </Accordion>
            ))}
        </div >
        <FileUpload
          getBase64={false}
          multiFile={true}
          disabled={false}
          title="Upload file to project"
          header="[Drag to drop]"
          leftLabel="or"
          rightLabel="to select files"
          buttonLabel="click here"
          buttonRemoveLabel="Remove all"
          maxFileSize={10}
          maxUploadFiles={0}
          maxFilesContainerHeight={357}
          errorSizeMessage={'fill it or remove it to use the default error message'}
          onFilesChange={handleFilesChange}
          onError={handleFileUploadError}
          BannerProps={{ elevation: 0, variant: 'outlined' }}
          showPlaceholderImage={true}
          PlaceholderGridProps={{ md: 4 }}
          LabelsGridProps={{ md: 8 }}
          onContextReady={handleRemoveFile}
          ContainerProps={{
            elevation: 0,
            variant: 'outlined',
            sx: { p: 1 },
          }}
        />
        <Stack direction="row" alignItems="center" spacing={2} justifyContent="center">
          <Button variant="contained" component="label" onClick={handleUploadFileToServer}>
            Upload
          </Button>
        </Stack>
      </Paper >
    </>
  )
}

export default Overview
