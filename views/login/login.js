window.addEventListener('load', ()=>{
    document.getElementById('userlogin').reset();
});


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
        if (response.status === 202) {
            console.log("token",response.data.token);
            localStorage.setItem('userId', JSON.stringify(response.data.token));
            showAlert('Success ' + response.data.message, 'success');

            document.getElementById("userlogin").reset();


            window.location.href = '../Ui/index.html';
        }
        else if (response.status === 201) {
            showAlert('sorry ' + response.data.message, 'error');
        }
    } catch (error) {
        //console.error('Error:', error);
    }
}
function showAlert(message, type) {
    // Display an alert with the specified message
    alert(message);
}

