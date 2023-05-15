import { Box, ImageList, ImageListItem, Paper } from '@mui/material';
import React from 'react'

const imageData = [
  {
    img: 'https://images-storage-bucket.s3.ap-southeast-1.amazonaws.com/upload/avatar/slide/imagelist-1.png',
    title: 'Bed',
  },
  {
    img: 'https://images-storage-bucket.s3.ap-southeast-1.amazonaws.com/upload/avatar/slide/imagelist-2.png',
    title: 'Books',
  },
  {
    img: 'https://images-storage-bucket.s3.ap-southeast-1.amazonaws.com/upload/avatar/slide/imagelist-3.png',
    title: 'Sink',
  },
  {
    img: 'https://images-storage-bucket.s3.ap-southeast-1.amazonaws.com/upload/avatar/slide/imagelist-4.png',
    title: 'Kitchen',
  },
  {
    img: 'https://images-storage-bucket.s3.ap-southeast-1.amazonaws.com/upload/avatar/slide/imagelist-5.png',
    title: 'Blinds',
  },
];

function GuildFileOfStep2() {
  return (
    <Paper className='image-list' sx={{ width: 700, height: 450, overflowY: 'scroll', padding: 2, margin: 'auto', mb: 2 }} elevation={4}>
      <ImageList variant="masonry" cols={2} gap={8}>
        {imageData.map((item) => (
          <ImageListItem key={item.img}>
            <img
              src={`${item.img}?w=248&fit=crop&auto=format`}
              srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
              alt={item.title}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Paper>
  )
}

export default GuildFileOfStep2