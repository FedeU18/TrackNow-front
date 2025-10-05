import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function SitemarkIcon() {
  return (
    <Box sx={{ height: 40, mr: 2, display: 'flex', alignItems: 'center' }}>
      <Typography 
        variant="h6" 
        component="span"
        sx={{ 
          fontWeight: 'bold',
          color: 'primary.main',
          fontSize: '1.25rem'
        }}
      >
        Track Now
      </Typography>
    </Box>
  );
}
