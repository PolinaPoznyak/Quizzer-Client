import React from 'react'
import { Grid } from '@mui/material'

export default function Center(props) {
    return (
        <Grid container
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ height: '100%' }}>
            <Grid item xs={1}>
                {props.children}
            </Grid>
        </Grid>
    )
}