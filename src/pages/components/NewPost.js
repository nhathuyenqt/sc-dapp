import { bindActionCreators } from 'redux';
import AddPost from '../../components/AddPost';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Dialog from '@material-ui/core/Dialog';
import {Typography, Button, TextField, Grid} from '@material-ui/core'
import xtype from 'xtypejs'
import IconButton from '@material-ui/core/IconButton';
import {useState, useEffect} from 'react'
import SendIcon from '@material-ui/icons/Send';
import Avatar from '@material-ui/core/Avatar';
// import EditPost from '../../pages2/EditPost/EditPost';
import PropTypes from 'prop-types';
import { useAuth } from "../../helper/AuthContext"
// import SinglePost from '../../pages2/SinglePost/SinglePost';

function NewPostDialog(props) {

    const { currentBCAccount, keypair} = useAuth()
    const [post, setPost] = useState()
    const { onClose, open} = props;

    const handleClose = () => {
      onClose();
    };
    
    async function newPost() {
        const response = await fetch("/newPost", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            'privateKey': currentBCAccount.privateKey,
            'pubkey' : keypair.y,
            'content': post
          }),
        })
        handleClose();
    }
       
      
    return (
        <Dialog aria-labelledby="alert-dialog-title" fullWidth maxWidth='xs' onClose={handleClose} open={open}>
            <DialogTitle  style={{ backgroundColor: 'navy', color: 'white' }} id="alert-dialog-title">
                Create a new task
            </DialogTitle>
            <DialogContent>
                <TextField onChange={e => setPost(e.target.value)} autoFocus
                            margin="dense"
                            label="Description"
                            fullWidth         
                            multiline = {true} />
            </DialogContent>
            <DialogActions>
            <IconButton color="primary" component="span" onClick={newPost}>
                    <SendIcon />
            </IconButton>
            </DialogActions>
    
        </Dialog>
    );
    }
      
// NewPostDialog.propTypes = {
//     onClose: PropTypes.func.isRequired,
//     open: PropTypes.bool.isRequired,
//     description: PropTypes.string.isRequired,
// };
export default (NewPostDialog);