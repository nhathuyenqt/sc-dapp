import { bindActionCreators } from 'redux';
import AddPost from '../components/AddPost';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import {Typography, Button, TextField} from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton';
import { DataGrid } from '@material-ui/data-grid';
import XContract from './../artifacts/contracts/XContract.sol/XContract.json'
import text  from './../contract_address.json';
import {ethers} from 'ethers'
import {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import PersonIcon from '@material-ui/icons/Person';
import SendIcon from '@material-ui/icons/Send';
import Avatar from '@material-ui/core/Avatar';
// import EditPost from '../../pages2/EditPost/EditPost';
import PropTypes from 'prop-types';
// import SinglePost from '../../pages2/SinglePost/SinglePost';
const contractAddress = text['contract_address']

function Posts () {
    const [postList, setPostList] = useState([])
    
    const [open, setOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState();
    const classes = useStyles();
    const columns = [
      { field: 'id', headerName: 'ID', width: 68, headerClassName: 'super-app-theme--header' },
      {
        field: 'title',
        headerName: 'Title',
        width: 200,
        headerClassName: 'super-app-theme--header'
      },
      {
        field: 'description',
        headerName: 'Description',
        width: 450,
        headerClassName: 'super-app-theme--header'
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
              onClick={handleClickOpen}
            >
              Offer a price
            </Button>
          </strong>
        ),
        disableClickEventBubbling: true,
      }
    ];
      setTimeout(()=>{
        listenEvents()
      }, 30000);
    
      const handleClickOpen = () => {
        console.log()
        setOpen(true);
      };
    
      const handleClose = (value) => {
        setOpen(false);
        setSelectedValue(value);
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
            description : task[1]
          })
        })
        setPostList(newPosts)
      });
      
      return result
      
      // setLoading(false)
    // const provider = new ethers.providers.Web3Provider(window.ethereum)
    // const contract = new ethers.Contract(contractAddress, XContract.abi, provider)
    // const signer =  provider.getSigner()
    // const [account] = await window.ethereum.request({method: 'eth_requestAccounts'})
    // const acc = signer.getAddress()
    // const b = await contract.ElBalanceOf(y)
    // console.log('address: ', acc)
    // console.log('balance: ', b.toString())
    // setBalance(b.toString())
    // setLoading(false)
    }


    async function listenEvents(){

      if (typeof window.ethereum !== 'undefined'){
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, XContract.abi, provider);
        contract.on("aNewPrice", (msg) => {
          console.log("event ", msg);
        })
      }
    }

    useEffect(() => {
      const tasks = loadTasks()
      
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
        <SimpleDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
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

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  selectedValue: PropTypes.string.isRequired,
};

function SimpleDialog(props) {
  const classes = useStyles();
  const [price, setPrice] = useState()
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleListItemClick = (value) => {
    onClose(value);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Offer a price</DialogTitle>
        <Typography> </Typography>
         <TextField onChange={e => setPrice(e.target.value)} placeholder="Price" variant='outlined'
                  color ="secondary"
                  className={classes.field}
                  defaultValue = {price}
                />
 
        <IconButton color="secondary" aria-label="upload picture" component="span">
              <SendIcon />
        </IconButton>

    </Dialog>
  );
}

SimpleDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,

  selectedValue: PropTypes.string.isRequired,
};