


// export function logout(history) {
//     localStorage.removeItem('userDetails');
//     history.push('/login');
//     return {
//         type: LOGOUT_ACTION,
//     };
// }

// export function runLogoutTimer(dispatch, timer, history) {
//     setTimeout(() => {
//         dispatch(logout(history));
//     }, timer);
// }

// export function checkAutoLogin(dispatch, history) {
//     const tokenDetailsString = localStorage.getItem('userDetails');
//     let tokenDetails = '';
//     if (!tokenDetailsString) {
//         dispatch(logout(history));
//         return;
//     }

//     tokenDetails = JSON.parse(tokenDetailsString);
//     let expireDate = new Date(tokenDetails.expireDate);
//     let todaysDate = new Date();

//     if (todaysDate > expireDate) {
//         dispatch(logout(history));
//         return;
//     }
//     dispatch(loginConfirmedAction(tokenDetails));

//     const timer = expireDate.getTime() - todaysDate.getTime();
//     runLogoutTimer(dispatch, timer, history);
// }
