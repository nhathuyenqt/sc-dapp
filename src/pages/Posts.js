import { bindActionCreators } from 'redux';
import AddPost from '../components/AddPost';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Dialog from '@material-ui/core/Dialog';
import {Typography, Button, TextField} from '@material-ui/core'
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
const contractAddress = text['contract_address']

function Posts (props) {
    
    const [postList, setPostList] = useState([])
    const [open, setOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState({id:'', description: '', pubkey:''});
    const [content, setContent] = useState();
    const classes = useStyles();
    const columns = [
      { field: 'id', headerName: 'ID', width: 68, headerClassName: 'super-app-theme--header'},
      {
        field: 'title',
        headerName: 'Title',
        width: 150,
        headerClassName: 'super-app-theme--header'
      },
      {
        field: 'description',
        headerName: 'Description',
        headerClassName: 'super-app-theme--header',
        flex: 1
      },
      // {
      //     field: 'id',
      //     headerName: 'id',
      //     type: 'number',
      //     width: 50,
      //     editable: true,
      //   }
      {
        field: 'action',
        headerName: 'Action', headerClassName: 'super-app-theme--header',
        width: 150,
        renderCell: (params) => (
          <strong>

            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleClickOpen(params)}>
              Offer a price
            </Button>
          </strong>
        ),
        disableClickEventBubbling: true,
      }
    ];

      setTimeout(()=>{
        listenEvents()
      }, 5000);
    
      const handleClickOpen = (params) => {
        console.log(params.row);
        setSelectedItem(params.row)
        setOpen(true);
      };
    
      const handleClose = (value) => {
        setOpen(false);
        setSelectedItem(value);
      };

    async function loadTasks(){
      const response = await fetch("/loadTasks", {
        method: "GET",
        headers: { "Content-Type": "application/json" }
      })
      let result
      let newPosts = []
      await response.json().then((message) => {
        result = message["data"]
        console.log(result)
        result.map((task) => {
          newPosts.push({id : task[0],
            description : task[1],
            pubkey: task[2]
          })
        })
        setPostList(newPosts)
      });
      listenEvents()
      return result      
    }


    async function listenEvents(){

      if (typeof window.ethereum !== 'undefined'){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, XContract.abi, provider);
        contract.on("NewPrice", (id, CL_price, CR_price) => {
          console.log("event ", id, CL_price, CR_price);
        })
        // console.log(contract.events)
        // await contract.events.NewPrice({}).on("data", (e) => console.log(e));
      }
    }

    useEffect(() => {
      
      }, [])

      
        
    
    return (
        <div style={{ height: 400,  marginLeft: 100, marginRight: '100px', alignSelf: 'flex-start'}} className={classes.root}>
        <DataGrid
          rows={postList}
          columns={columns}
          pageSize={4}
        //   checkboxSelection
          disableSelectionOnClick
        />
        <SimpleDialog selectedItem={selectedItem} open={open} onClose={handleClose} content={content}/>
        <Button size ="small" color="primary" onClick={loadTasks} > Load Tasks </Button>
      </div>
  
    );
    
}

const useStyles = makeStyles({
  root: {
    '& .super-app-theme--header': {
      backgroundColor: 'rgba(255, 7, 0, 0.55)',
    },
  },
});
export default (Posts);

function SimpleDialog(props) {
  const classes = useStyles();
  const { currentBCAccount, keypair, loading, balance} = useAuth()
  const [price, setPrice] = useState()
  const { onClose, selectedItem, open} = props;

  const handleClose = () => {
    onClose(selectedItem);
  };

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
    <Dialog aria-labelledby="alert-dialog-title"  onClose={handleClose} open={open}>
        <DialogTitle  style={{ backgroundColor: 'navy', color: 'white' }} id="alert-dialog-title">
          Offer a price
        </DialogTitle>
        <DialogContent>
            <DialogContentText>
              <Typography fullWidth margin="dense" style={{ alignSelf: 'flex-start'}} variant="subtitle1">{selectedItem.description}</Typography>
            </DialogContentText>
              <TextField onChange={e => setPrice(e.target.value)} autoFocus
                        margin="dense"
                        id="name"
                        label="Price"
                        type="number"
                        fullWidth          />
        </DialogContent>
        <DialogActions>
          <IconButton color="primary" component="span" onClick={sendPrice}>
                <SendIcon />
          </IconButton>
        </DialogActions>

    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedItem: PropTypes.shape({
    id: PropTypes.number,
    description: PropTypes.string.isRequired,
    pubkey: PropTypes.string.isRequired
  })
};