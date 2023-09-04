var form = document.getElementById('userlogin');
form.addEventListener('submit', login);



async function login(e) {
    try {
        e.preventDefault();
        let name = document.getElementById('username').value;
        let email = document.getElementById('email').value;
        let password = document.getElementById('password').value;

        let userLoginData = {
            name: name,
            email: email,
            password: password
        }
        console.log(userLoginData)
        const response = await axios.post('http://localhost:3000/user/login', userLoginData);
        if(response.status === 202){
            showAlert('Success '+response.data.message,'success');
        }
        else if(response.status === 201){
            showAlert('sorry '+response.data.message,'success');
        }
    } catch (error) {
        //console.error('Error:', error);
    }
}
function showAlert(message, type) {
    // Display an alert with the specified message
    alert(message);
}