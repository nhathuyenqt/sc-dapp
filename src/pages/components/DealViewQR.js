import PropTypes from 'prop-types';
import QRCode from "react-qr-code";
import QRscanner from './QRscanner.js';
import {useState, useEffect, useRef} from 'react'
import Dialog from '@material-ui/core/Dialog';
import { useAuth } from "../../helper/AuthContext"
import {Typography, Button, TextField, Grid} from '@material-ui/core'
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from "@material-ui/core/DialogContent";

function DealViewQR(props) {

  const { currentBCAccount, keypair} = useAuth()

    const [text, setText] = useState('');

    const { onClose, open, data } = props;

    console.log(props);
  
    const handleClose = () => {
      onClose();
    };
  

  
    return (
      <Dialog aria-labelledby="alert-dialog-title" maxWidth='xs' onClose={handleClose} open={open}>
          {/* <DialogTitle  style={{ backgroundColor: 'rgba(220, 241, 229, 0.57)', color: 'rgba(9, 91, 11, 0.86)' }} id="alert-dialog-title">
              <Typography align = "center"  fullWidth margin="dense" variant="subtitle1" >Scan the deal</Typography>
          </DialogTitle> */}
           <DialogContent>
            <QRCode delay={300} style={{width: '90%'}} value={JSON.stringify(data)}/>
            </DialogContent>
      </Dialog>
    );
  }
  
DealViewQR.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  data : PropTypes.string
};

export default (DealViewQR);