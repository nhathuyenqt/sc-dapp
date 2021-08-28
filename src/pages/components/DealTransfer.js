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

    const { currentBCAccount, keypair, balance} = useAuth()
    const [text, setText] = useState();
    const { onClose, open, deal } = props;
    const [amtView, setAmtView] = useState(true);
    const [amt, setAmt] = useState(true);

    const handleClose = () => {
        onClose();
    };

    const showRaw = (check) =>{
      setAmtView(check);
    }
    
    useEffect(() => {
      encryptTransfer()
    });

    async function encryptTransfer(){
        // setAmtView(check);
        console.log(deal)
        if (deal != null && open){
            console.log("DEAL ", deal);
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

    async function payTheDeal (){

      console.log()
        const response = await fetch("/payTheDeal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            'privateKey': currentBCAccount.privateKey,
            'user_address': currentBCAccount.address,
            'y_sender': keypair.y,
            'y_recipient': deal.recipient,
            'amt':amt,
            'x_sender': keypair.x,
            'requestId': deal.requestId
          }),
        })
          
        let result
        let newPosts = []
        await response.json().then((message) => {
          console.log(message);
          onClose();
        });

    
    };

    

    return (
        <Dialog aria-labelledby="alert-dialog-title" fullWidth maxWidth='xs' style={{height:'500px'}} onClose={handleClose} open={open}>
          <DialogTitle  style={{ backgroundColor: 'rgba(220, 241, 229, 0.57)', color: 'rgba(9, 91, 11, 0.86)' }} id="alert-dialog-title">
            <Typography fullWidth margin="dense" variant="h6" >Pay for the task</Typography>
          </DialogTitle>
          {deal && (<DialogContent>
              <DialogContentText>
              <Typography fullWidth margin="dense" style={{ alignSelf: 'flex-start'}} variant="button" display="block">Post: {deal.requestId}</Typography>
                <Typography fullWidth margin="dense" style={{ alignSelf: 'flex-start'}} variant="button" display="block">Price:</Typography>
                <div style={{display: 'flex', margin:'10px'}}>
                    <Grid container align-items="center" spacing={2}>
                    <Grid item>
                      <Typography variant = "body2" align='center'> Raw </Typography>
                    </Grid>
                    <Grid item >
                        <Switch
                            checked={amtView}
                            onChange={e => showRaw(e.target.checked)}
                            name="checkedA"
                            inputProps={{ 'aria-label': 'secondary checkbox' }} />
                    </Grid>
                    <Grid item>
                      <Typography variant = "body2" align='center'> Encrypted </Typography>
                    </Grid>
                    </Grid>
                </div>
                {amtView ?
                    (<Typography variant = "caption" style={{height:'32px'}}> ({deal.price[0]} {deal.price[1]})</Typography>):
                    (<Typography variant = "h6" align='center'> {amt} </Typography>)}
                {/* <Typography fullWidth margin="dense" style={{ alignSelf: 'flex-start'}} variant="subtitle1">Price: {(deal != null)? deal.price : " "}</Typography> */}
                
                {/* <Typography fullWidth margin="dense" style={{ alignSelf: 'flex-start'}} variant="subtitle1">{bidder}</Typography> */}
              </DialogContentText>
          </DialogContent>)}
          <DialogActions>
            <Button variant="contained"  color='primary' size="small" onClick={handleClose}> Close </Button>
            {deal && <Button variant="contained"  color='secondary' size="small" onClick={payTheDeal}> Pay </Button>}
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