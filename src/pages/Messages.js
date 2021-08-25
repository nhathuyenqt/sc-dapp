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
import DealViewQR from './components/DealViewQR';
import Avatar from '@material-ui/core/Avatar';

// import EditPost from '../../pages2/EditPost/EditPost';
import PropTypes from 'prop-types';
import { useAuth } from "../helper/AuthContext"
// import SinglePost from '../../pages2/SinglePost/SinglePost';
const contractAddress = text['contract_address']

function Messages (props) {
    const { currentBCAccount, keypair, loading, balance} = useAuth()
    const [msgList, setMsgList] = useState([]);
    const classes = useStyles();
    const State = ['Processing', 'Assigned', 'WaitingPaid', 'Closed', 'Cancel'] ;
    const [QR, setQR] = useState();
    const [showQR, setShowQR] = useState();
    const columns = [
      { field: 'id', headerName: 'ID', width: 68, headerClassName: 'super-app-theme--header'},
      {
        field: 'content',
        headerName: 'Content',
        headerClassName: 'super-app-theme--header',
        flex: 1,
        color: 'white',
        renderCell: (params) => {
          
          let t = "Your offer for request " + params.row.requestId + " is " + (params.row.code ? "Accepted" : "Rejected");
          return(<strong>
            <Typography variant="subtitle1">
               {t}
            </Typography>
          </strong>)

        }    
        ,
        disableClickEventBubbling: true,
      },
      {
        field: 'detail',
        headerName: 'Detail',
        headerClassName: 'super-app-theme--header',
        width: 150,
        renderCell: (params) => (
          <strong>
            <Button
                variant="contained"
                disabled = {params.row.code? false : true}
                // style={{ color: green[500] }}
                color = 'primary'
                className={classes.button}
                onClick={() => openQR(params.row)}
                startIcon={ <VisibilityIcon/>}
              >
                Show
              </Button>
{/* 
            <IconButton
              style={{ color: green[500] }}
              size="small"
              onClick={() => openQR(params.row)}
              disabled = {params.row.code? false : true}
              >
              
              <VisibilityIcon/>
            </IconButton> */}
          </strong>
        ),
        disableClickEventBubbling: true,
      },
    ];

    setTimeout(()=>{
      listenEvents()
    }, 5000);
    
    const openQR = (item) => {
      console.log(item);
      setQR(item);
      setShowQR(true);
    }

    async function loadMessages(){
      const response = await fetch("/getMessages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            'user_key': currentBCAccount.privateKey,
          }),
        })
        
        let result
        let newMsgs = []
        await response.json().then((message) => {
            message = message['message']
            console.log(message)
            message.map((msg, i) => {
              newMsgs.push({
                id : i,
                code: msg[0],
                requestId: msg[1],
                price: msg[2],
                requestOwner : msg[3],
                recipient : keypair.y
            })
          })
          setMsgList(newMsgs)
        });

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
      loadMessages();
      }, [])
  
    async function reload(){
      loadMessages();
    }
    
    
    return (
        <div style={{ height: '800px',  marginLeft: 100, marginRight: 20}} className={classes.root}>
          <Grid container align-items="center" style={{width: '100%',height: "100%" }}>
              <Grid item xs align-items="right" style={{display: 'flex', alignItems: 'center', justifyContent: 'right'}}>
                <Button size ="small" variant="outlined" color="primary" onClick={reload} > RELOAD </Button>
              </Grid>
              <Grid item xs={12} style={{width: '100%', height: "90%" }}>
                  <DataGrid
                  rows={msgList}
                  columns={columns}
                  sortModel={[{ field: 'id', sort: 'desc' }]}
                  pageSize={8}
                  //   checkboxSelection
                  disableSelectionOnClick/>
              </Grid>
          </Grid>
          <DealViewQR data={QR} open={showQR} onClose={setShowQR}/>
      </div>
    );
    
}

const useStyles = makeStyles({
  root: {
    '& .super-app-theme--header': {
      backgroundColor: '#3b5998',
      color:'white',
      fontFamily: "Comic Sans MS",
      textTransform: 'capitalize'
    }
  }
});
export default (Messages);


