var form = document.getElementById("forgot-password-form" );
form.addEventListener('submit', forgotPassword);


async function forgotPassword(e){
    try{
        e.preventDefault();
        let email = document.getElementById('email').value;
        const response = await axios.post('http://localhost:3000/user/password/forgotPassword', {email});
        if (response.status === 200) {

            window.alert("a email with the password reset link has been sent to your email id")

            window.location.href = 'login.html';
        } else {
            // Handle errors or display a message to the user
            console.error('Password reset failed.');
        }
    
    }
    catch(error){

    }
}