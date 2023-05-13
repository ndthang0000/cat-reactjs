import {
  CAvatar,
  CListGroup,
  CListGroupItem
} from '@coreui/react'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  boxShadow: 24,
  p: 4,
}

const Activity = ({ project }) => {
  return (
    <>
      <Paper className="px-4 py-2 mb-3">
        <Typography variant="h6">11/05/2023</Typography>
        <CListGroup flush>
          <CListGroupItem className="d-flex align-items-center px-0">
            <CAvatar size="lg" src="./1.jpg" className="me-3" />

            <div className="flex-grow-1 d-flex flex-column">
              <Typography>
                <strong>Nguyen Duc Thang</strong> add a member to this project
              </Typography>

              <div className="d-flex justify-content-between">
                <Typography sx={{ color: 'text.secondary' }} variant="subtitle2">
                  Pham Thi Nguyet @phamthinguyet
                </Typography>
                <Typography sx={{ color: 'text.secondary' }} variant="subtitle2">
                  10:15
                </Typography>
              </div>
            </div>
          </CListGroupItem>

          <CListGroupItem className="d-flex align-items-center px-0">
            <CAvatar size="lg" src="./1.jpg" className="me-3" />

            <div className="flex-grow-1 d-flex flex-column">
              <Typography>
                <strong>Nguyen Duc Thang</strong> add a member to this project
              </Typography>

              <div className="d-flex justify-content-between">
                <Typography sx={{ color: 'text.secondary' }} variant="subtitle2">
                  Dao Thi Thien Tam @daothithientam
                </Typography>
                <Typography sx={{ color: 'text.secondary' }} variant="subtitle2">
                  07:05
                </Typography>
              </div>
            </div>
          </CListGroupItem>
        </CListGroup>
      </Paper>

      <Paper className="px-4 py-2 mb-3">
        <Typography variant="h6">10/05/2023</Typography>
        <CListGroup flush>
          <CListGroupItem className="d-flex align-items-center px-0">
            <CAvatar size="lg" src="./1.jpg" className="me-3" />

            <div className="flex-grow-1 d-flex flex-column">
              <Typography>
                <strong>Nguyen Duc Thang</strong> create this project
              </Typography>

              <div className="d-flex justify-content-between">
                <Typography sx={{ color: 'text.secondary' }} variant="subtitle2">
                  cat-do-an-tot-nghiep
                </Typography>
                <Typography sx={{ color: 'text.secondary' }} variant="subtitle2">
                  08:24
                </Typography>
              </div>
            </div>
          </CListGroupItem>
        </CListGroup>
      </Paper>
    </>
  )
}

export default Activity
