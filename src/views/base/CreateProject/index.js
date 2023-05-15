import React, { useEffect } from 'react'
import HorizontalLinearStepper from './Stepper'
import { Alert, Box, Button, Divider, FormControl, FormControlLabel, InputLabel, ListSubheader, MenuItem, Paper, Select, Switch, TextField, Typography } from '@mui/material';

import CreateProject from './CreateProject';
import GuildFileOfStep2 from './GuildFileOfStep2';
import { Link } from 'react-router-dom';

const steps = [
  { label: 'Set up Information Of Project', isOptional: false },
  { label: 'Upload File To Project', isOptional: true },
  { label: 'Conduct Translate', isOptional: true },
]


function CreateProjectHome() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [newProject, setNewProject] = React.useState({})
  const [skipped, setSkipped] = React.useState(new Set());


  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
  };

  const handleSkip = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const isStepOptional = (step) => {
    return steps.find((item, index) => index == step)?.isOptional
  }

  const handleBack = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };


  return (
    <div>
      <HorizontalLinearStepper
        steps={steps}
        activeStep={activeStep}
        handleNext={handleNext}
        handleBack={handleBack}
        handleSkip={handleSkip}
        handleReset={handleReset}
        isStepSkipped={isStepSkipped}
        isStepOptional={isStepOptional}
      />
      {activeStep == 0 && <CreateProject setActiveStep={setActiveStep} setNewProject={setNewProject} />}
      {activeStep == 1 && <GuildFileOfStep2 />}
      {activeStep == 2 && <GuildFileOfStep2 />}
      {activeStep == 3 &&
        <>
          <Alert variant="filled" severity="success" sx={{ mt: 5 }}>
            Congratulation — Project {newProject.projectName} is ready!
          </Alert>
          <div style={{ display: 'flex', justifyContent: 'center', margin: 20, fontSize: 24 }}>
            <Link className='custom-link' to={`/project/detail/${newProject.slug}`}>Back to Detail Of {newProject.projectName}</Link>

          </div>
        </>
      }
    </div>
  )
}

export default CreateProjectHome