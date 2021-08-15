import { bindActionCreators } from 'redux';
import AddPost from '../components/AddPost';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Dialog from '@material-ui/core/Dialog';
import {Typography, Button, TextField, Grid} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton';
import { DataGrid } from '@material-ui/data-grid';
import XContract from './../artifacts/contracts/XContract.sol/XContract.json'
import text  from './../contract_address.json';
import {ethers} from 'ethers'
import {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/styles';
import SendIcon from '@material-ui/icons/Send';
import Avatar from '@material-ui/core/Avatar';
// import EditPost from '../../pages2/EditPost/EditPost';
import PropTypes from 'prop-types';
import { useAuth } from "../helper/AuthContext"
// import SinglePost from '../../pages2/SinglePost/SinglePost';

function DealDialog(props) {
    const classes = useStyles();
    const { currentBCAccount} = useAuth()
    const [price, setPrice] = useState()
    const [offer, setOffer] = useState()
    const { onClose, selectedItem, open} = props;
    
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

    async function sendPrice (){
      const response = await fetch("/sendPrice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          'user_key': currentBCAccount.privateKey,
          'pubkeyOfRequest': selectedItem.pubkey,
          'price': price,
          'id': selectedItem.id
        }),
      })
      console.log(selectedItem)
      let result
      let newPosts = []
      await response.json().then((message) => {
        // result = message["data"]
        
      });
    };
  
    return (
      <Dialog aria-labelledby="alert-dialog-title" fullWidth maxWidth='xs' onClose={handleClose} open={open}>
          <DialogTitle  style={{ backgroundColor: 'green', color: 'white' }} id="alert-dialog-title">
            Current min offer price
          </DialogTitle>
          <DialogContent>
              <DialogContentText>
                <Typography fullWidth margin="dense" style={{ alignSelf: 'flex-start'}} variant="subtitle1">{selectedItem.description}</Typography>
                <Typography fullWidth margin="dense" style={{ alignSelf: 'flex-start'}} variant="subtitle1">{price}</Typography>
                {/* <Typography fullWidth margin="dense" style={{ alignSelf: 'flex-start'}} variant="subtitle1">{bidder}</Typography> */}
              </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" size="small" onClick={sendPrice}> Accept </Button>
         
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
    })
};
export default (DealDialog);