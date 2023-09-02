var form = document.getElementById('userlogin');
form.addEventListener('submit', saveLoginData);

function saveLoginData(e){
    e.preventDefault();
    let name = document.getElementById('username').value;
    let email = document.getElementById('email').value;
    let password = document.getElementById('password').value;

    let userLoginData = {
        name: name,
        email: email,
        password: password
    }

    console.log(userLoginData);
    axios.post('http://localhost:3000/user/login', userLoginData)
}