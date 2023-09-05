window.addEventListener("DOMContentLoaded", () => {
    fetchAppointmentData();
});

document.getElementById("expenseTracker").addEventListener("submit", function dosubmit(e) {
    e.preventDefault();
    const money = document.getElementById("expenseAmount").value;
    const decreptn = document.getElementById("description").value;
    const categry = document.getElementById("category").value;
    const userId = JSON.parse(localStorage.getItem('userId'));

    var id = generateKey();
    var expenseData = {
        id: id,
        userId: userId,
        money: money,
        description: decreptn,
        category: categry

    };

    console.log("data bring sent", expenseData)
    axios.post("http://localhost:3000/user/expense", expenseData).then((res) => {
        console.log("data  response after submit", res.data);
        displayExpenseItems(res.data)
        document.getElementById("expenseTracker").reset();
    })
});

function generateKey() {
    return "key_" + Math.random().toString(36).slice(2, 11);
}

function editExpenseItem(event) {
    // const expenseData = JSON.parse(localStorage.getItem(key));
    // // Remove the expense item from local storage
    // localStorage.removeItem(key);
    var li = event.target.parentElement;
    var id = li.getAttribute('data-key');
    axios.get(`http://localhost:3000/user/expense/edit/${id}`).then((res) => {
        document.getElementById('expenseAmount').value = res.data.money;
        document.getElementById('description').value = res.data.description;
        document.getElementById('category').value = res.data.category;

        axios.delete(`http://localhost:3000/user/expense/${id}`).then(() => {
            li.remove();
        })
    })

}
function removeExpenseItem(event) {
    var li = event.target.parentElement;
    var id = li.getAttribute('data-key');
    axios.delete(`http://localhost:3000/user/expense/${id}`)
        .then(() => {
            li.remove(); // Remove the corresponding <li> element from the UI
        })
        .catch((error) => {
            console.log(error);
        });
}


function displayExpenseItems(expenseData) {
    var li = document.createElement('li');
    li.className = 'list-group-item';
    id = expenseData.id;
    li.setAttribute('data-key', id);
    li.textContent = `${expenseData.description} - ${expenseData.money} (${expenseData.category})`;

    var editButton = document.createElement('button');
    editButton.className = 'btn btn-sm btn-primary mx-2';
    editButton.type = "button";
    editButton.textContent = 'Edit';
    editButton.addEventListener('click', editExpenseItem);
    li.appendChild(editButton);

    var removeButton = document.createElement('button');
    removeButton.className = 'btn btn-sm btn-danger';
    removeButton.type = "button";
    removeButton.textContent = 'Remove';
    removeButton.addEventListener('click', removeExpenseItem);
    li.appendChild(removeButton);

    var expenseList = document.getElementById('users');
    expenseList.appendChild(li);

}
function fetchAppointmentData() {
    const userId = JSON.parse(localStorage.getItem('userId'));
    console.log("***",userId)
    axios.get(`http://localhost:3000/user/expense/${userId}`)
        .then((response) => {
            console.log(response);
            for (var i = 0; i < response.data.length; i++) {
                displayExpenseItems(response.data[i]);
            }
        })
        .catch((error) => {
            console.log(error);
        });
}