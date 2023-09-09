var form = document.getElementById("forgot-password-form" );
form.addEventListener('submit', forgotPassword);


async function forgotPassword(e){
    try{
        e.preventDefault();
        let email = document.getElementById('email').value;
        const response = await axios.post('http://localhost:3000/user/password/forgotPassword', {email});
    }
    catch(error){

    }
}