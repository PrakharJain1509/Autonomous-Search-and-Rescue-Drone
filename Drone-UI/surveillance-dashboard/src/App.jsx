import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, CircularProgress, useTheme } from '@mui/material';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const DetectionStatus = ({ status }) => {
  const theme = useTheme();
  return (
    <Box sx={{
      p: 2,
      borderRadius: 1,
      bgcolor: status === 'Human Detected' ? theme.palette.error.light : theme.palette.success.light,
      color: theme.palette.common.white,
      textAlign: 'center'
    }}>
      <Typography variant="h6">{status}</Typography>
      <ToastContainer
  position="bottom-right"
  autoClose={5000}
  hideProgressBar={false}
  newestOnTop={false}
  closeOnClick
  rtl={false}
  pauseOnFocusLoss
  draggable
  pauseOnHover
/>
    </Box>
  );
};

const MediaView = ({ title, data }) => (
  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    <CardContent sx={{ flexGrow: 1 }}>
      <Typography gutterBottom variant="h5" component="div">
        {title}
      </Typography>
      <div className="img-container">
        {data ? (
          <img
            src={`data:image/png;base64,${data}`}
            alt={title}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain'
            }}
          />
        ) : (
          <Typography variant="body1" color="text.secondary">
            Waiting for feed...
          </Typography>
        )}
      </div>
    </CardContent>
  </Card>
);

export default function App() {
  const [sensorData, setSensorData] = useState({ image: null, thermal: null, audio: null });
  const [connectionStatus, setConnectionStatus] = useState('Connecting...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8765');

    const handleMessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setSensorData(prev => ({
          image: data.image || prev.image,
          thermal: data.thermal || prev.thermal,
          audio: data.audio || 'No audio data'
        }));
        setLoading(false);
      } catch (error) {
        toast.error('Failed to parse sensor data');
      }
    };

    const handleError = (error) => {
      toast.error(`WebSocket error: ${error.message}`);
      setConnectionStatus('Connection Error');
      setLoading(false);
    };

    ws.addEventListener('open', () => {
      setConnectionStatus('Connected');
      toast.success('Live feed connected');
    });

    ws.addEventListener('message', handleMessage);
    ws.addEventListener('error', handleError);
    ws.addEventListener('close', () => {
      setConnectionStatus('Disconnected');
      toast.warn('Connection lost');
    });

    return () => {
      ws.removeEventListener('message', handleMessage);
      ws.removeEventListener('error', handleError);
      ws.close();
    };
  }, []);

  return (
    <Box sx={{ p: 3, minHeight: '100vh', bgcolor: 'background.default' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Security Monitoring System
        <Typography variant="subtitle1" color="text.secondary">
          Status: {connectionStatus}
        </Typography>
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <MediaView title="Visual Feed" data={sensorData.image} />
        </Grid>

        <Grid item xs={12} md={6}>
          <MediaView title="Thermal Imaging" data={sensorData.thermal} />
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>Audio Analysis</Typography>
              {sensorData.audio ? (
                <DetectionStatus status={sensorData.audio} />
              ) : (
                <CircularProgress size={24} />
              )}
              <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                Last update: {new Date().toLocaleTimeString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}