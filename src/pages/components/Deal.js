import { bindActionCreators } from 'redux';
import AddPost from '../../components/AddPost';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Dialog from '@material-ui/core/Dialog';
import {Typography, Button, TextField, Grid} from '@material-ui/core'
import xtype from 'xtypejs'
import text  from '../../contract_address.json';
import {ethers} from 'ethers'
import {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/styles';
import SendIcon from '@material-ui/icons/Send';
import Avatar from '@material-ui/core/Avatar';
// import EditPost from '../../pages2/EditPost/EditPost';
import PropTypes from 'prop-types';
import { useAuth } from "../../helper/AuthContext"
// import SinglePost from '../../pages2/SinglePost/SinglePost';

function DealDialog(props) {
    const classes = useStyles();
    const { currentBCAccount} = useAuth()
    const [offer, setOffer] = useState()
    const { onClose, selectedItem, open, deal, price} = props;
    console.log(deal);
    useEffect(() => {
        // console.log(selectedItem);
        // loadMinOffer();
        }, [])

    const handleClose = () => {
      onClose(selectedItem);
    };
    async function loadMinOffer(){
        const response = await fetch("/loadMinOffer", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              'user_key': currentBCAccount.privateKey,
              'id': selectedItem.id
            }),
          })
          console.log(selectedItem)
          let result
          let newPosts = []
          await response.json().then((message) => {
            // result = message["data"]
            
          });
    }

    async function acceptDeal (){
      if (deal != null && selectedItem.state == "Processing"){
        const response = await fetch("/acceptDeal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            'user_key': currentBCAccount.privateKey,
            'requestId': deal[2],
            'dealId': deal[0]
          }),
        })
        
        let result
        let newPosts = []
        await response.json().then((message) => {
          // result = message["data"]
          
        });
      }
      
      handleClose();
    };
  
    return (
      <Dialog aria-labelledby="alert-dialog-title" fullWidth maxWidth='xs' onClose={handleClose} open={open}>
          <DialogTitle  style={{ backgroundColor: 'rgba(220, 241, 229, 0.57)', color: 'rgba(9, 91, 11, 0.86)' }} id="alert-dialog-title">
            <Typography fullWidth margin="dense" variant="h6" >Current Min Offer</Typography>
          </DialogTitle>
          <DialogContent>
              <DialogContentText>
                <Typography fullWidth margin="dense" style={{ alignSelf: 'flex-start'}} variant="subtitle1">Description: "{selectedItem.description}"</Typography>
                <Typography fullWidth margin="dense" style={{ alignSelf: 'flex-start'}} variant="subtitle1">State: {selectedItem.state}</Typography>
                <Typography fullWidth margin="dense" style={{ alignSelf: 'flex-start'}} variant="subtitle1">Current min offered price: {(deal == null)? "No offer" : price}</Typography>
                
                {/* <Typography fullWidth margin="dense" style={{ alignSelf: 'flex-start'}} variant="subtitle1">{bidder}</Typography> */}
              </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained"  color='rgba(9, 91, 11, 0.86)' size="small" onClick={acceptDeal}> {(deal == null || selectedItem.state != "Processing") ? "Close" : "Accept"}  </Button>
          </DialogActions>
  
      </Dialog>
    );
  }
  
  const useStyles = makeStyles({
    root: {
      '& .super-app-theme--header': {
        backgroundColor: 'rgba(255, 7, 0, 0.55)',
      },
      '& .super-app-theme--Filled': {
        backgroundColor: 'rgba(114, 209, 18, 1)',
      }
    }
  });

DealDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedItem: PropTypes.shape({
      id: PropTypes.number,
      description: PropTypes.string.isRequired,
      pubkey: PropTypes.string.isRequired
    }),
    deal: PropTypes.shape({
        dealId: PropTypes.number,
        requestId: PropTypes.number,
        price: PropTypes.shape({
            CL: PropTypes.string,
            CR: PropTypes.string
        }),
        state: PropTypes.number,
        bidder: PropTypes.string   
      })
};
export default (DealDialog);