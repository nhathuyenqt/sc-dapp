import { bindActionCreators } from 'redux';
import AddPost from '../../components/AddPost';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Dialog from '@material-ui/core/Dialog';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import {Typography, Button, TextField, Grid} from '@material-ui/core'
import xtype from 'xtypejs'
import { makeStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import {useState, useEffect} from 'react'
import SendIcon from '@material-ui/icons/Send';
import Avatar from '@material-ui/core/Avatar';
// import EditPost from '../../pages2/EditPost/EditPost';
import PropTypes from 'prop-types';
import { useAuth } from "../../helper/AuthContext"
// import SinglePost from '../../pages2/SinglePost/SinglePost';

function NewPostDialog(props) {
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
      maxWidth: 752,
    },
    demo: {
      backgroundColor: theme.palette.background.paper,
    },
    title: {
      margin: theme.spacing(4, 0, 2),
    },
  }));
    const [dense, setDense] = useState(false);
    const { currentBCAccount, keypair} = useAuth()
    const [post, setPost] = useState()
    const { onClose, open} = props;
    const classes = useStyles();

    const handleClose = () => {
      onClose();
    };

    const test_cases = [
      "My bike is broken, I need someone to come and fix it. I am always available in the afternoon after 5pm.",
      "I need someone to help me cleaning my room in this weekend",
      " I cannot turn on my computer, I need someone come and help fix it asap",
      "I need help with some difficult Maths exercises"
    ]
    let tests = []
    {test_cases.map( (test)=>{
      tests.push(<Button variant="text" color="primary"
          size = "small"
          onClick={() => setPost(test)}
          titleStyle={{
            color: "white",
            fontSize: 16,
          }}
          style={{textTransform: 'none', textAlign:'left'}}
        >
        {test}
      </Button>)
    }
    )}
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
                            value = {post}        
                            multiline = {true} />
                <div className={classes.demo}>
                <List dense={dense}>
                  {tests}
                </List>
              </div>
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