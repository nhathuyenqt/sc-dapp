import { Component } from 'react';
import './Post.css';
import  useStyles  from '../pages/Styles.js';
import {Typography, Button, AppBar, Spinner, Card, Container, CardActions, Grid, CardContent, CardMedia, TextField} from '@material-ui/core'
import {useState, useEffect} from 'react'

function AddPost() {

    const [newPost, setNewPost] = useState({title: '',
    description: '',
    status: 'active'});


    const addPostHandler = (e) => {
        e.preventDefault();
        console.log(newPost);
    };
    
    // textChange = (title, e) => {
    //     this.setState({
    //         [title]: e.target.value,
    //     });
    // };

    return(
        <div>
            <h2 className='text-2x1 font-bold'> Add Post </h2>
        <form  onSubmit ={addPostHandler}>
            <div className='form-inner'>
            <div className="form-group">
                <label className='block'>Title</label>
                <input
                    type='text'
                    className='block w-1/4 border border-gray-600 focus:outline-none'
                    onChange={e => setNewPost({...newPost, title: e.target.value})}
                />
            </div>
            <div className="form-group">
                <label className='block'>Description</label>
                <textarea  onChange={e => setNewPost({...newPost, description: e.target.value})} value={newPost.description} className='px-3 py-1 block w-full border border-gray-600  focus:outline-none focus:border-red-600'></textarea>
            </div>
            <div className="form-group">
                <label className='block'>Status</label>
                <input
                    type='text'
                    className='block w-1/4 border border-gray-600 focus:outline-none'
                />
            </div>
            <div className='my-3'>
                    <button
                        type='submit'
                        className='bg-indigo-900 text-white px-5 py-2'
                    >
                        Add Post
                    </button>
                </div>
            </div>
        </form>
        </div>
    
    )
    
}

export default AddPost;