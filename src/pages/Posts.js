import xtype from 'xtypejs'
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
import { green } from '@material-ui/core/colors';
import SendIcon from '@material-ui/icons/Send';
import VisibilityIcon from '@material-ui/icons/Visibility';
import DealDialog from './components/Deal';
import NewPostDialog from './components/NewPost';
import PropTypes from 'prop-types';
import { useAuth } from "../helper/AuthContext"
const contractAddress = text['contract_address']

function Posts (props) {
    const { currentBCAccount, keypair, loading, balance} = useAuth()
    const [postList, setPostList] = useState([])
    const [yourPostList, setYourPostList] = useState([])
    const [open, setOpen] = useState(false);
    const [openOffer, setOpenOffer] = useState(false);
    const [openNewPost, setOpenNewPost] = useState(false);
    const [selectedItem, setSelectedItem] = useState({id:'', description: '', pubkey:'', state:''});
    const [deal, setDeal] = useState();
    const [minOffer, setMinOffer] = useState();
    const classes = useStyles();
    const State = ['Processing', 'Assigned', 'WaitingPaid', 'Closed', 'Cancel'] ;
    const columns = [
      { field: 'id', headerName: 'ID', width: 68, headerClassName: 'super-app-theme--header'},
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
              variant="outlined" color="secondary"
              size="small"
              onClick={() => handleClickOpen(params)}>
              Offer a price
            </Button>
          </strong>
        ),
        disableClickEventBubbling: true,
      }
    ];

    const columns2 = [
      { field: 'id', headerName: 'ID', width: 68, headerClassName: 'super-app-theme--Filled', sortDescendingFirst : true},
      {
        field: 'description',
        headerName: 'Description',
        headerClassName: 'super-app-theme--Filled',
        flex: 1
      },
      {
        field: 'state',
        headerName: 'State',
        headerClassName: 'super-app-theme--Filled',
        flex: 1
      },
      {
        field: 'minprice',
        headerName: 'Min Price',
        headerClassName: 'super-app-theme--Filled',
        width: 150,
        renderCell: (params) => (
          <strong>
            <IconButton
              style={{ color: green[500] }}
              size="small"
              onClick={() => handleClickLoad(params)}>

              <VisibilityIcon/>
            </IconButton>
          </strong>
        ),
        disableClickEventBubbling: true,
      },
      {
        field: 'action',
        headerName: 'Action', headerClassName: 'super-app-theme--Filled',
        width: 150,
        renderCell: (params) => (
          <strong>

            <Button
              variant="contained"
              color="primary"
              size="small"
              alignItem='center'
              onClick={() => handleClickOpen(params)}>
              Ok
            </Button>
          </strong>
        ),
        disableClickEventBubbling: true,
      }
    ];

    setTimeout(()=>{
      listenEvents()
    }, 5000);
    
    const handleClickLoad = (params) => {
      console.log(params.row);
      setSelectedItem(params.row)
      loadMinOffer();
      
    };

    const handleCloseOffer = (value) => {
      setOpenOffer(false);
      setSelectedItem(value);
      reload();
    };
    const handleClickOpen = (params) => {
      console.log(params.row);
      setSelectedItem(params.row)
      setOpen(true);
    };
  
    const handleClose = (value) => {
      setOpen(false);
      setSelectedItem(value);
    };

    const handlePost = () => {
      setOpenNewPost(true);
    };
    const handleCloseNewPost = () => {
      setOpenNewPost(false);
      reload()
    };

    async function loadTasks(){
      console.log("key ", currentBCAccount.privateKey)
      const response = await fetch("/loadTasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          'user_key': currentBCAccount.privateKey
        })
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
      await listenEvents()
      return result      
    }

    async function loadYourTasks(){
      const response = await fetch("/loadYourTasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          'user_key': currentBCAccount.privateKey
        })
      })
      let result
      let newYourPosts = []
      await response.json().then((message) => {
        result = message["data"]
        console.log(result)
        result.map((task) => {
          newYourPosts.push({id : task[0],
            description : task[1],
            pubkey: task[2],
            state: State[task[3]]
          })
        })
        setYourPostList(newYourPosts)
      });
      await listenEvents()
      return result      
    }

    async function loadMinOffer(){
      const response = await fetch("/loadMinOffer", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            'user_key': currentBCAccount.privateKey,
            'id': selectedItem.id,
            'x': keypair.x
          }),
        })
        
        let result
        let newPosts = []
        await response.json().then((message) => {
          result = message["min_offer"]
          let newdeal = result['deal']
          let raw_price = result['raw_price']
          setDeal(newdeal)
          setMinOffer(raw_price)
        });
      setOpenOffer(true);
  }


    async function listenEvents(){
      
      if (typeof window.ethereum !== 'undefined'){
        console.log('listenEvents')
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
      loadTasks();
      loadYourTasks();
      }, [])
  
    async function reload(){
      loadTasks();
      loadYourTasks();
    }
    
    

    
    return (
        <div style={{ height: '800px',  marginLeft: 100, marginRight: 20}} className={classes.root}>
          <Grid container align-items="center" style={{width: '100%',height: "100%" }}>
              <Grid item xs style={{display: 'flex', alignItems: 'center', justifyContent: 'right'}}>
                <Button size ="small" variant="outlined" color="primary" style={{margin: '10px' }} onClick={handlePost} > ADD POST </Button>
                <Button size ="small" variant="outlined" color="primary" onClick={reload} > RELOAD </Button>
              </Grid>
              <Grid item xs={12} style={{height: "42%"}}>
              <Typography variant="h5" align="center" component="h2" style={{ color: "#ab3402" }}> ALL AVAILABLE TASKS </Typography>
                <DataGrid
                  rows={postList}
                  columns={columns}
                  pageSize={8}
                //   checkboxSelection
                  disableSelectionOnClick
                />
                <SimpleDialog selectedItem={selectedItem} open={open} onClose={handleClose}/>
               
              </Grid>
              <Grid item xs={12} style={{height: "42%"}}>
                <Typography variant="h6" align="center" component="h2" color='textPrimary' style={{ marginTop: '10px'}} > YOUR POSTING </Typography>
                <DataGrid

                  rows={yourPostList}
                  columns={columns2}
                  pageSize={8}
                //   checkboxSelection
                  disableSelectionOnClick
                />
                <DealDialog selectedItem={selectedItem} open={openOffer} onClose={handleCloseOffer} deal={deal} price={minOffer}/>
              </Grid>
              
          </Grid>
          <NewPostDialog open={openNewPost} onClose={handleCloseNewPost}/>
      </div>
  
    );
    
}

const useStyles = makeStyles({
  root: {
    '& .super-app-theme--header': {
      backgroundColor: '#ab3402',
      color:'white',
    },
    '& .super-app-theme--Filled': {
      backgroundColor: '#094a14',
      color:'white',
      fontFamily: 'Vazir',
      fontWeight: 'bold'
    }
  }
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
    handleClose()
  };

  return (
    <Dialog aria-labelledby="alert-dialog-title" fullWidth maxWidth='xs' onClose={handleClose} open={open}>
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



