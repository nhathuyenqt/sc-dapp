import React, { Component } from 'react';
import { Button, ButtonGroup, Container} from 'reactstrap';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { TiTick } from "react-icons/ti";
// import AppNavbar from './AppNavbar';
import {useState, useEffect} from 'react'
import database from './../firebase'
import { Link } from 'react-router-dom';
import { DataGrid } from '@material-ui/data-grid';
import {Typography, List, Grid, CardMedia, TextField} from '@material-ui/core'

const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);
  
  const StyledTableRow = withStyles((theme) => ({
    root: {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

function GroupList(){
    var groups = [];
    const [users, setUsers] = useState([]);
    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
          field: 'fullname',
          headerName: 'Full name',
          width: 150,
          editable: true,
        },
        {
          field: 'address',
          headerName: 'address',
          description: 'This column has a value getter and is not sortable.',
          sortable: false,
          width: 160,
        },
      ];
      
    useEffect(() => {
        fetchUsers();
      }, [])
    // const groupList = groups.map(group => {
    //     const address = `${group.address || ''} ${group.city || ''} ${group.stateOrProvince || ''}`;
    //     return <tr key={group.id}>
    //     <td style={{whiteSpace: 'nowrap'}}>{group.name}</td>
    //     <td>{address}</td>
    //     <td>{group.events.map(event => {
    //         return <div key={event.id}>{new Intl.DateTimeFormat('en-US', {
    //         year: 'numeric',
    //         month: 'long',
    //         day: '2-digit'
    //         }).format(new Date(event.date))}: {event.title}</div>
    //     })}</td>
    //     <td>
    //         <ButtonGroup>
    //         <Button size="sm" color="primary" tag={Link} to={"/groups/" + group.id}>Edit</Button>
    //         <Button size="sm" color="danger" onClick={() => this.remove(group.id)}>Delete</Button>
    //         </ButtonGroup>
    //     </td>
    //     </tr>
    // });

    const fetchUsers = async()=>{
        const response = database.collection('users');
        const newList = []
        const data = await response.get();
        data.docs.forEach(item=>{
            newList.push(item.data())
           })
           setUsers(newList)
    }


        return (
            <div>
              {/* <AppNavbar/> */}
              <Container fluid style={{ paddingLeft: 52, paddingRight: 32 }} >
                <div className="float-right">
                  <Button color="success" tag={Link} to="/users/new">Add user</Button>
                </div>
                <h3>Account List</h3>
                <Table className="mt-4">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell width="20%" align="center">Name</StyledTableCell>
                            <StyledTableCell width="40%" align="center">Address</StyledTableCell>
                            <StyledTableCell width="20%" align="center">Register To SC</StyledTableCell>
                            <StyledTableCell width="20%" align="center"></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                            {users.map((user) => (
                                <StyledTableRow align="right" key={user.fullname}>
                                <StyledTableCell component="th" scope="row">
                                    {user.fullname}
                                </StyledTableCell>
                                <StyledTableCell align="center">{user.address}</StyledTableCell>
                                <StyledTableCell align="center">
                                {user.registerForContract && <TiTick />}
                                
                                </StyledTableCell>
                                <StyledTableCell align="right">{user.registerForContract}
                                    
                                    <ButtonGroup>
                                        {/* <Button size="sm" color="primary" tag={Link} to={"/groups/" + group.id}>Edit</Button> */}
                                        <Button size="sm" color="danger" onClick={() => this.remove(user.fullname)}>Delete</Button>
                                    </ButtonGroup>
                                </StyledTableCell>
                                </StyledTableRow>
                            ))}
                    </TableBody>
      
                </Table>
              </Container>
          
            </div>
          );
}

// class userList extends Component {

//   constructor(props) {
//     super(props);
//     this.state = {users: [], isLoading: true};
//     this.remove = this.remove.bind(this);
//   }

//   componentDidMount() {
//     this.setState({isLoading: true});

//     const snapshot = database.collection('users').get();
//         snapshot.forEach((doc) => {
//         console.log(doc.id, '=>', doc.data());
//         });
//   }

//   async remove(id) {
//     await fetch(`/api/user/${id}`, {
//       method: 'DELETE',
//       headers: {
//         'Accept': 'application/json',
//         'Content-Type': 'application/json'
//       }
//     }).then(() => {
//       let updatedusers = [...this.state.users].filter(i => i.id !== id);
//       this.setState({users: updatedusers});
//     });
//   }

//   render() {
//     const {users, isLoading} = this.state;

//     if (isLoading) {
//       return <p>Loading...</p>;
//     }

//     const userList = users.map(user => {
//       const address = `${user.address || ''} ${user.city || ''} ${user.stateOrProvince || ''}`;
//       return <tr key={user.id}>
//         <td style={{whiteSpace: 'nowrap'}}>{user.name}</td>
//         <td>{address}</td>
//         <td>{user.events.map(event => {
//           return <div key={event.id}>{new Intl.DateTimeFormat('en-US', {
//             year: 'numeric',
//             month: 'long',
//             day: '2-digit'
//           }).format(new Date(event.date))}: {event.title}</div>
//         })}</td>
//         <td>
//           <Buttonuser>
//             <Button size="sm" color="primary" tag={Link} to={"/users/" + user.id}>Edit</Button>
//             <Button size="sm" color="danger" onClick={() => this.remove(user.id)}>Delete</Button>
//           </Buttonuser>
//         </td>
//       </tr>
//     });

//     return (
//       <div>
//         {/* <AppNavbar/> */}
//         <Container fluid>
//           <div className="float-right">
//             <Button color="success" tag={Link} to="/users/new">Add user</Button>
//           </div>
//           <h3>My JUG Tour</h3>
//           <Table className="mt-4">
//             <thead>
//             <tr>
//               <th width="20%">Name</th>
//               <th width="20%">Location</th>
//               <th>Events</th>
//               <th width="10%">Actions</th>
//             </tr>
//             </thead>
//             <tbody>
//             {groupList}
//             </tbody>
//           </Table>
//         </Container>
//       </div>
//     );
//   }
// }

export default GroupList;