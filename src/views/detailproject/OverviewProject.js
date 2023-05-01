import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import React, { useEffect, useState } from 'react'
import FileUpload from 'react-mui-fileuploader';
import Paper from '@mui/material/Paper';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const Overview = () => {

  const [filesToUpload, setFilesToUpload] = useState([])

  const handleFilesChange = (files) => {
    // Update chosen files
    setFilesToUpload([...files])
  };

  const handleFileUploadError = (files) => {
  };

  const uploadFiles = () => {

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
          <Accordion expanded={expanded === 'panel1'} onChange={handleAccordionChange('panel1')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>
                General settings
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>I am an accordion</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
                Aliquam eget maximus est, id dignissim quam.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel2'} onChange={handleAccordionChange('panel2')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Users</Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                You are currently not an owner
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus,
                varius pulvinar diam eros in elit. Pellentesque convallis laoreet
                laoreet.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel3'} onChange={handleAccordionChange('panel3')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3bh-content"
              id="panel3bh-header"
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>
                Advanced settings
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>
                Filtering has been entirely disabled for whole web server
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
                amet egestas eros, vitae egestas augue. Duis vel est augue.
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion expanded={expanded === 'panel4'} onChange={handleAccordionChange('panel4')}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel4bh-content"
              id="panel4bh-header"
            >
              <Typography sx={{ width: '33%', flexShrink: 0 }}>Personal data</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
                amet egestas eros, vitae egestas augue. Duis vel est augue.
              </Typography>
            </AccordionDetails>
          </Accordion>
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
          onContextReady={context => {
            // access to component context here
          }}
          ContainerProps={{
            elevation: 0,
            variant: "outlined",
            sx: { p: 1 }
          }}
        />
        <Stack direction="row" alignItems="center" spacing={2} justifyContent='center'>
          <Button variant="contained" component="label">
            Upload
          </Button>
        </Stack>
      </Paper>


    </>
  )
}

export default Overview
