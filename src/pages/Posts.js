import { bindActionCreators } from 'redux';
import AddPost from '../components/AddPost';
import {Typography, Button} from '@material-ui/core'
import { DataGrid } from '@material-ui/data-grid';
import XContract from './../artifacts/contracts/XContract.sol/XContract.json'
import text  from './../contract_address.json';
import {ethers} from 'ethers'
import {useState, useEffect} from 'react'
// import EditPost from '../../pages2/EditPost/EditPost';
// import SinglePost from '../../pages2/SinglePost/SinglePost';
const contractAddress = text['contract_address']
function Posts () {

    const [postList, setPostList] = useState([
            {title: 'Fix Light', description: 'post 1 haa', action : 'Do it', id:0},
            {title: 'Fix Door', description: 'post 2', action : 'Done it', id: 1}
        ])
    
    const columns = [
        { field: 'id', headerName: 'ID', width: 50 },
        {
          field: 'title',
          headerName: 'Title',
          width: 200,
          editable: true,
        },
        {
          field: 'description',
          headerName: 'Description',
          width: 450,
          editable: true,
        },
        {
          field: 'action',
          headerName: 'Action',
        //   type: 'number',
          width: 150,
          editable: true,
        }
        // {
        //     field: 'id',
        //     headerName: 'id',
        //     type: 'number',
        //     width: 50,
        //     editable: true,
        //   }
      ];
        setTimeout(()=>{
          listenEvents()
        }, 30000);
      

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
            newPosts.push({title: "New Post",
            description : task['des'],
            id : task['id']
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
        <div style={{ height: 400, width: '100%' }}>
        <DataGrid
            padding ={10}
          rows={postList}
          columns={columns}
          pageSize={5}
        //   checkboxSelection
          disableSelectionOnClick
        />
        <Button size ="small" color="primary" onClick={loadTasks} > Load Tasks </Button>
      </div>
  
    );
    
}


export default (Posts);
