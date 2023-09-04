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
            showError(response.data.message);
        }
        else if(response.status === 201){
            showSuccess(response.data.message);
        }
    } catch (error) {
        //console.error('Error:', error);
    }
}
function showError(message) {
    // Create a new element for the error message
    var errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.textContent = message;
    form.appendChild(errorMessage);
}
function showSuccess(message) {
    // Create a new element for the success message
    var successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = message;

    // Add the success message to the form
    form.appendChild(successMessage);
}