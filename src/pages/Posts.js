import { Component } from 'react';
import { connect } from 'react-redux';
import { Link, Route, Switch } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import AddPost from '../components/AddPost';
import SinglePost from '../components/SinglePost';
import { DataGrid } from '@material-ui/data-grid';
// import EditPost from '../../pages2/EditPost/EditPost';
// import SinglePost from '../../pages2/SinglePost/SinglePost';



function Posts () {
    // onCreatePost() {
    //     // this.props.createPostAction();
    // }

    // componentDidMount() {
    //     if (this.props.posts && !this.props.posts.length) {
    //         this.props.getPostsAction();
    //     }
    // }

    // onDeletePost(postId) {
    //     if (window.confirm('Are you sure you want to delete post?')) {
    //         this.props.deletePostAction(postId, this.props.history);
    //     }
    // }   


    const state = {
        posts : [
            {title: 'Hello1', description: 'post 1 haa', action : 'Do it', id:0},
            {title: 'Hello2', description: 'post 2', action : 'Done it', id: 1}
        ],
        postTitle: 'Posts List'
    }
    
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



        // setTimeout(()=>{
        //     console.log('Modifying');
        //     const posts = [...this.state.posts];
        //     posts[0].title ='Hello ne';
        //     this.setState({
        //         posts,
        //     });
        // }, 30000);
        
        // for (let post of this.props.posts) {
        //     posts.push(
        //         <div key={post.id} className=' mt-3 w-1/2'>
        //             <div className='shadow border p-3 mx-3'>
        //                 <div>{post.title}</div>
        //                 <div>{post.description}</div>
        //                 <div>
        //                     <Link
        //                         to={{ pathname: `/posts/${post.id}` }}
        //                         className='text-purple-500'
        //                     >
        //                         View Details
        //                     </Link>
        //                 </div>
        //                 <div>
        //                     <Link
        //                         to={{ pathname: `/posts/edit/${post.id}` }}
        //                         className='text-purple-500'
        //                     >
        //                         Edit Details
        //                     </Link>
        //                 </div>
        //                 <div>
        //                     <button
        //                         className='text-purple-500'
        //                         onClick={() => this.onDeletePost(post.id)}
        //                     >
        //                         Delete Post
        //                     </button>
        //                 </div>
        //             </div>
        //         </div>,
        //     );
        // }
        return (
            <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                padding ={10}
              rows={state.posts}
              columns={columns}
              pageSize={5}
            //   checkboxSelection
              disableSelectionOnClick
            />
          </div>
            // <div className='flex my-3'>
            //     {this.state.posts.map((post) => (
            //         <SinglePost //props ={post}
            //             key = {post.id}
            //             title = {post.title}
            //             description = {post.description}
            //             id = {post.id}
            //             />
            //     ))}
            //     <div class ='my-5'>
            //         <AddPost/>
            //     </div>
            // </div>
        );
    
}


export default (Posts);
