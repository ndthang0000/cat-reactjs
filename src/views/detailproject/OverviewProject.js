import { Avatar, Stack } from '@mui/material';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react'
import FileUpload from 'react-mui-fileuploader';
import Paper from '@mui/material/Paper';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import moment from 'moment/moment';
import axiosInstance from '../../axios'
import { toast } from 'react-toastify';


const Overview = ({ project, setFetchNew }) => {

  const [filesToUpload, setFilesToUpload] = useState([])

  const handleFilesChange = (files) => {
    setFilesToUpload([...files])
  };

  const handleFileUploadError = (files) => {
  };

  const handleRemoveFile = (context) => {
    console.log(context)
  }

  const handleUploadFileToServer = async () => {
    const formData = new FormData();

    filesToUpload.forEach(file => {
      formData.append(`files`, file);
    });

    //formData.append('files', filesToUpload)
    formData.append('projectId', project.projects.id)
    const data = await axiosInstance.post('/project/upload-file',
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        }
      }
    )
    toast.success(data.data.message, { autoClose: 3000 })
    setFetchNew(state => !state)
  }

  const [expanded, setExpanded] = React.useState(false);

  const handleAccordionChange =
    (panel) => (event, isExpanded) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <>
      <Paper elevation={6} sx={{ padding: 3 }} >
        <div>
          {project.projects && project.projects.files.map((item, index) =>
            <Accordion key={index} expanded={expanded === `panel${index + 1}`} onChange={handleAccordionChange(`panel${index + 1}`)}>
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
                <Typography sx={{ color: 'text.secondary', width: '33%' }} variant='subtitle2' >Last updated: {moment(item.updatedAt).fromNow()}</Typography>
                <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginRight: 10 }}>
                  <Avatar variant="rounded" src='https://images-storage-bucket.s3.ap-southeast-1.amazonaws.com/upload/avatar/icon/translation.png' sx={{ marginRight: 3 }} />

                </div>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Quantity Sentence: {item.quantitySentence}
                </Typography>
                <Typography>
                  Created At: {moment(item.createdAt).format('LLL')}
                </Typography>
              </AccordionDetails>
            </Accordion>
          )}
        </div>
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
          BannerProps={{ elevation: 0, variant: "outlined" }}
          showPlaceholderImage={true}
          PlaceholderGridProps={{ md: 4 }}
          LabelsGridProps={{ md: 8 }}
          onContextReady={handleRemoveFile}
          ContainerProps={{
            elevation: 0,
            variant: "outlined",
            sx: { p: 1 }
          }}
        />
        <Stack direction="row" alignItems="center" spacing={2} justifyContent='center'>
          <Button variant="contained" component="label" onClick={handleUploadFileToServer}>
            Upload
          </Button>
        </Stack>
      </Paper>


    </>
  )
}

export default Overview
