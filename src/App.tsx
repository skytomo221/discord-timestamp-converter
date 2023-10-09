import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import './style.scss';
import convert from './convert';

export default function App() {
  const [input, setInput] = useState('We had a BBQ in <2 days ago>.');
  const [output, setOutput] = useState('We had a BBQ in <t:1696086000:d>.');
  const copyToClipboard = async () => {
    await global.navigator.clipboard.writeText(output);
  };
  const theme = createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#5865f2',
      },
      background: {
        default: '#2f3136',
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box component="main" m={2}>
        <Box className="box">
          <Typography variant="h1" gutterBottom>
            Discord Timestamp Converter
          </Typography>
        </Box>
        <Box className="box">
          <Typography variant="h2" gutterBottom>
            Output
          </Typography>
          {output}
          <Tooltip title="Copy to Clipboard" placement="top" arrow>
            <IconButton
              color="primary"
              size="small"
              onClick={() => copyToClipboard()}
            >
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
        <Box className="box">
          <Typography variant="h2" gutterBottom>
            Input
          </Typography>
          <TextField
            fullWidth
            label="Message"
            multiline
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setInput(event.target.value);
              setOutput(convert(event.target.value));
            }}
            value={input}
            variant="outlined"
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}
