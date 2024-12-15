import { Skeleton } from '@mui/material'
import React from 'react'

function Loader() {
  return (
    <Skeleton
            animation="wave"
            variant="square"
            width="100%"
            height={400}
            sx={{ borderRadius: (theme) => theme.shape.borderRadius / 5 }}
          ></Skeleton>
  )
}

export default Loader