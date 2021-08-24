import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import QRCode from "react-qr-code";
import Switch from '@material-ui/core/Switch';
import QRscanner from './QRscanner.js';
import {useState, useEffect, useRef} from 'react'
import Dialog from '@material-ui/core/Dialog';
import { useAuth } from "../../helper/AuthContext"
import {Typography, Button, TextField, Grid} from '@material-ui/core'
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";

function DealTransfer(props) {

    const { currentBCAccount, keypair} = useAuth()
    const [text, setText] = useState('');
    const { onClose, open, deal } = props;
    const [amtView, setAmtView] = useState(true);
    const [amt, setAmt] = useState(true);

    const handleClose = () => {
        onClose();
    };

    async function encryptTransfer(check){
        setAmtView(check);
        if (deal != null && check == false){

            console.log("DEAL ", deal.price);
            const response = await fetch("/encryptAmount", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  'x' : keypair.x,
                  'CL': deal.price[0],
                  'CR': deal.price[1]
                  
                }),
              })
        
              await response.json().then((message) => {
                console.log(message)
                setAmt(message['amt']);
                
              });
        }


        
    };

    async function acceptDeal (){
    if (deal != null){
        console.log("DEAL ", deal);
    //   const response = await fetch("/acceptDeal", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({
    //       'user_key': currentBCAccount.privateKey,
    //       'requestId': deal[2],
    //       'dealId': deal[0]
    //     }),
    //   })
        
    //   let result
    //   let newPosts = []
    //   await response.json().then((message) => {
    //     // result = message["data"]
        
    //   });
    }
    
    };

    

    return (
        <Dialog aria-labelledby="alert-dialog-title" fullWidth maxWidth='xs' onClose={handleClose} open={open}>
          <DialogTitle  style={{ backgroundColor: 'rgba(220, 241, 229, 0.57)', color: 'rgba(9, 91, 11, 0.86)' }} id="alert-dialog-title">
            <Typography fullWidth margin="dense" variant="h6" >Current Min Offer</Typography>
          </DialogTitle>
          {deal && (<DialogContent>
              <DialogContentText>
                <Typography fullWidth margin="dense" style={{ alignSelf: 'flex-start'}} variant="subtitle1">Description: {(deal != null)? deal.description : " "}</Typography>
                <div style={{display: 'flex'}}>
                    <Grid container align-items="center" spacing={2}>
                    <Grid item>Raw</Grid>
                    <Grid item >
                        <Switch
                            checked={amtView}
                            onChange={e => encryptTransfer(e.target.checked)}
                            name="checkedA"
                            inputProps={{ 'aria-label': 'secondary checkbox' }} />
                    </Grid>
                    <Grid item>Encrypted</Grid>
                    </Grid>
                </div>
                {amtView ?
                    (<Typography variant = "subtitle2" gutterBottom> ({deal.price[0]} {deal.price[1]})</Typography>):
                    (<Typography variant = "subtitle2" gutterBottom> {amt} </Typography>)}
                {/* <Typography fullWidth margin="dense" style={{ alignSelf: 'flex-start'}} variant="subtitle1">Price: {(deal != null)? deal.price : " "}</Typography> */}
                
                {/* <Typography fullWidth margin="dense" style={{ alignSelf: 'flex-start'}} variant="subtitle1">{bidder}</Typography> */}
              </DialogContentText>
          </DialogContent>)}
          <DialogActions>
            <Button variant="contained"  color='primary' size="small" onClick={handleClose}> Close </Button>
            {deal && <Button variant="contained"  color='secondary' size="small" onClick={acceptDeal}> Pay </Button>}
          </DialogActions>
  
      </Dialog>
    );
}
    
DealTransfer.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    deal : PropTypes.shape({
        id: PropTypes.number,
        description: PropTypes.string,
        recipient: PropTypes.string
      })
};

export default (DealTransfer);