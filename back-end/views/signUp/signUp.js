var form = document.getElementById('userSignUp');
form.addEventListener('submit', signUp);



async function signUp(e) {
    try {
        e.preventDefault();
        let name = document.getElementById('username').value;
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;

        let userSignUpData = {
            name: name,
            email: email,
            password: password
        }

        // console.log(userSignUpData);

        const response = await axios.post('http://localhost:3000/user/signup', userSignUpData);
        if(response.status === 202){
            showAlert(response.data.message,'error');
        }
        else if(response.status === 201){
            console.log(response.data);
            showAlert(response.data.message,'success');
             window.location.href = '../login/login.html';
        }
    } catch (error) {
        //console.error('Error:', error);
    }
}
function showAlert(message, type) {
    // Display an alert with the specified message
    alert(message);
}