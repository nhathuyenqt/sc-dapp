// import './App.css';
// import Header from './components2/Header/Header';
// import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
// import { lazy, Suspense, useEffect } from 'react';
// import { connect, useDispatch } from 'react-redux';
// import { checkAutoLogin } from './services/AuthService';
// import { isAuthenticated } from './store/selectors/AuthSelectors';
// import {compose} from "redux";
// const Home = lazy(() => import('./pages/Home'));
// const createPost = lazy(() => import('./pages2/CreatePost/CreatePost'));
// const SignUp = lazy(() => import('./pages2/SignUp/SignUp'));
// const Login = lazy(() => import('./pages2/Login/Login'));
// // const Posts = lazy(() => import('./components2/Posts/Posts'));

// function App(props) {
//     const dispatch = useDispatch();
//     useEffect(() => {
//         console.log(props);
//         checkAutoLogin(dispatch, props.history);
//     }, []);

//     let routes = (
//         <Switch>
//             <Route path='/signup' component={SignUp} />
//             <Route path='/login' component={Login} />
//             <Route path='/' component={Home} />
//         </Switch>
//     );

//     if (props.isAuthenticated) {
//         routes = (
//             <Switch>
//                 {/* <Route path='/posts' component={Posts} /> */}
//                 <Route path='/createpost' component={createPost} />
//                 <Route path='/' component={Home} exact />
//                 <Redirect to='/' />
//             </Switch>
//         );
//     }

//     return (
//         <div>
//             <Header />
//             <div className='container px-3 mx-auto'>
//                 <Suspense fallback={<div>Loading...</div>}>
//                     {routes}
//                 </Suspense>
//             </div>
//         </div>
//     );
// }

// const mapStateToProps = (state) => {
//     return {
//         isAuthenticated: isAuthenticated(state),
//     };
// };
// const ShowTheLocationWithRouter = withRouter(App);

// export default connect(mapStateToProps)(ShowTheLocationWithRouter);
