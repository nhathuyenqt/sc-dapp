import React from 'react'
import {Typography, Button, TextField, Grid} from '@material-ui/core'
import {Fab, TextareaAutosize} from '@material-ui/core'
import {ArrowBack} from '@material-ui/icons'
import QRCode from "react-qr-code";
import {useState, useEffect, useRef} from 'react'
import QrReader from 'react-qr-reader';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
function QRscanner(props) {

    const [text, setText] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [scanResultFile, setScanResultFile] = useState('');
    const [scanResultWebCam, setScanResultWebCam] =  useState('');
    const qrRef = useRef(null);

    const { onClose, open, setData } = props;

    const handleClose = () => {
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
            setScanResultWebCam(result);
            setData(result);
            onClose();
        }
      }

    return (
      <Dialog aria-labelledby="alert-dialog-title" fullWidth maxWidth='xs' onClose={handleClose} open={open}>
            <DialogTitle  style={{ backgroundColor: 'rgba(220, 241, 229, 0.57)', color: 'rgba(9, 91, 11, 0.86)' }} id="alert-dialog-title">
                <Typography fullWidth margin="dense" variant="subtitle1" >Scan public key of Recipient</Typography>
            </DialogTitle>

              <QrReader
              delay={300}
              style={{width: '100%'}}
              onError={handleErrorWebCam}
              onScan={handleScanWebCam}
                />
              <Typography style={{display: 'flex', margin: '5px'}} align='center' gutterBottom variant = "subtitle2"> {scanResultWebCam}</Typography> 
                  

      </Dialog>
    );
  }
  
QRscanner.propTypes = {
   onClose: PropTypes.func.isRequired,
   open: PropTypes.bool.isRequired,
   setData : PropTypes.func.isRequired
 };

export default QRscanner;