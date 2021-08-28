import React from 'react'
import QRCode from "react-qr-code";
import {useState, useRef} from 'react'
import QrReader from 'react-qr-reader';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DealTransfer from './DealTransfer.js';
import {Typography, Button, Card,  CircularProgress, Container, CardActions, Grid, CardContent, TextField} from '@material-ui/core'
import Box from '@material-ui/core/Box';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

function QRscanner(props) {

  const [text, setText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [scanResultFile, setScanResultFile] = useState('');
  const [scanResultWebCam, setScanResultWebCam] =  useState('');
  const [deal, setDeal]  = useState('');
  const [openPay, setOpenPay]  = useState(false);
  const qrRef = useRef();

  const { onClose, open, setData } = props;

  const handleClose = () => {
    onClose();
  };

  const handleClosePay = () => {
    setOpenPay(false);
    // setDeal("");
    onClose();
  };

  const onScanFile = () => {
    qrRef.current.openImageDialog();
  }
  const handleErrorWebCam = (error) => {
    console.log(error);
  }
  const handleScanWebCam = (result) => {
    
    if (result){
        try {
          let deal = JSON.parse(result)
          if (deal.code){
            setDeal(deal);
            setOpenPay(true);
          }
          console.log("DEAL")
        } catch (e) {
          console.log("Recipent")
          setScanResultWebCam(result);
          setData(result);
          onClose();
        }
  
    }
  }

  const handleErrorFile = (error) => {
    console.log(error);
  }
  const handleScanFile = (result) => {
       console.log("View", result);
      if (result) {
          setScanResultFile(result);
          handleScanWebCam(result);
      }
  }

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  return (
    <Dialog aria-labelledby="alert-dialog-title" fullWidth maxWidth='xs' onClose={handleClose} open={open}>
          <AppBar position="static">
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
              <Tab label="Open image" {...a11yProps(0)} />
              <Tab label="Scan by Camera" {...a11yProps(1)} />
            </Tabs>
          </AppBar>
          
          <TabPanel value={value} index={0} style={{width: '100%', height: '100%'}}>
            <div align='center' style={{width: '100%', height: '400px'}}>
              <QrReader
                ref={qrRef}
                delay={300}
                onError={handleErrorFile}
                onScan={handleScanFile}
                style={{width: '100%',  alignItems: 'center', justifyContent: 'center'}}
                legacyMode/>
              <Button variant="contained" size='small' color="secondary" onClick={onScanFile}
                    style={{margin:'10px'}}>Open File</Button>
            </div>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <div style={{width: '100%', height: '400px'}}>
              <QrReader
                  delay={300}
                  style={{width: '100%',  alignItems: 'center', justifyContent: 'center'}}
                  onError={handleErrorWebCam}
                  onScan={handleScanWebCam}
                />
            </div>
          </TabPanel>
          <DealTransfer deal = {deal} open={openPay} onClose={handleClosePay}/>  

          {/* 
          
          <Typography style={{display: 'flex', margin: '5px'}} align='center' gutterBottom variant = "subtitle2"> {scanResultWebCam}</Typography> 
           */}
    </Dialog>
  );
}
  
QRscanner.propTypes = {
   onClose: PropTypes.func.isRequired,
   open: PropTypes.bool.isRequired,
   setData : PropTypes.func.isRequired,
 };

export default QRscanner;

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}