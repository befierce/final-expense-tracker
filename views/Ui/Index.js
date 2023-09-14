
let currentPage = 1;
let itemsPerPage = 3

window.addEventListener("DOMContentLoaded", () => {
    fetchAppointmentData(currentPage);
});

function fetchAppointmentData(page) {
    currentPage = page;
    const userId = JSON.parse(localStorage.getItem('userId'));
    console.log(userId)
    axios.get(`http://localhost:3000/user/expense/${userId}?page=${page}`)
        .then((response) => {
            console.log(response);
            const { isPremiumUser } = response.data;
            const result = response.data.result.rows;
            console.log(response.data.result.count);
            const count = response.data.result.count;
            var totalPages = Math.ceil(count / itemsPerPage);
            console.log("totalPages", totalPages)
            const paginationButtons = document.getElementById('paginationButtons');
            paginationButtons.innerHTML = '';
            if (totalPages > 1) {
                if (currentPage > 1) {
                    const previousButton = document.createElement("button");
                    previousButton.id = "previousPageButton";
                    previousButton.className = "btn btn-primary";
                    previousButton.textContent = "Previous";
                    previousButton.addEventListener('click', () => {
                        const expenseList = document.getElementById('users');
                        expenseList.innerHTML = '';
                        fetchAppointmentData(currentPage - 1);
                    })
                    const paginationDiv = document.getElementById("paginationButtons");
                    paginationDiv.appendChild(previousButton);
                }

                if (currentPage < totalPages) {
                    
                    const nextButton = document.createElement("button");
                    nextButton.id = "nextPageButton";
                    nextButton.className = "btn btn-primary";
                    nextButton.textContent = "Next"
                    nextButton.addEventListener('click', () => {
                        const expenseList = document.getElementById('users');
                        expenseList.innerHTML = ''; 
                        fetchAppointmentData(currentPage + 1);
                    })
                    console.log("currentpage", currentPage);
                    const paginationDiv = document.getElementById("paginationButtons");
                    paginationDiv.appendChild(nextButton);
                }
            }















            if (isPremiumUser) {
                const premiumMessage = document.getElementById('premiumMessage');
                if (premiumMessage) {
                   

                    premiumMessage.style.display = 'block';
                    if(currentPage == 1){
                    displayLeaderboardButton();
                }
                }
                const getPremiumButton = document.getElementById('getPremiumButton');
                if (getPremiumButton) {
                    getPremiumButton.style.display = 'none';
                }
            }
            for (var i = 0; i < result.length; i++) {
                displayExpenseItems(result[i]);
            }
        })
        .catch((error) => {
            console.log(error);
        });
}




document.getElementById("expenseTracker").addEventListener("submit", function dosubmit(e) {
    e.preventDefault();
    const money = document.getElementById("expenseAmount").value;
    const decreptn = document.getElementById("description").value;
    const categry = document.getElementById("category").value;
    const userId = JSON.parse(localStorage.getItem('userId'));

    var id = generateKey();
    var expenseData = {
        id: id,
        money: money,
        description: decreptn,
        category: categry

    };

    console.log("data bring sent", expenseData)
    axios.post("http://localhost:3000/user/expense", expenseData, { headers: { "Authorisation": userId } }).then((res) => {
        console.log("data  response after submit", res.data);
        displayExpenseItems(res.data)
        document.getElementById("expenseTracker").reset();
    })
});

function generateKey() {
    return "key_" + Math.random().toString(36).slice(2, 11);
}

function editExpenseItem(event) {
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




document.getElementById('getPremiumButton').onclick = async function (e) {
    const userId = JSON.parse(localStorage.getItem('userId'));
    const res = await axios.get('http://localhost:3000/user/purchase/premium', { headers: { "Authorisation": userId } });
    console.log("response after click on get premium", res)
    var options =
    {
        'key_id': res.data.key_id,
        'order_id': res.data.order.id,

        'handler': async function (response) {
            console.log('Payment successful');
            console.log('Payment ID: ' + response.razorpay_payment_id);
            console.log('Order ID: ' + response.razorpay_order_id);
            console.log('Signature: ' + response.razorpay_signature);

            const premium = await axios.post(`http://localhost:3000/user/purchase/premium`, {
                order_id: options.order_id,
                payment_id: response.razorpay_payment_id
            }, { headers: { 'Authorization': localStorage.getItem('token') } })
            console.log("Before", response);

            handlePaymentSuccess(response);


            const getPremiumButton = document.getElementById('getPremiumButton');
            if (getPremiumButton) {
                getPremiumButton.style.display = 'none';
            }
        }
    }
    const rzp1 = new Razorpay(options);
    rzp1.open();
    e.preventDefault();

    rzp1.on('payment.failed', async function (response) {
        alert("something went wrong");
    })
}

function handlePaymentSuccess(response) {
    // Display "Premium" message
    var premiumMessage = document.getElementById('premiumMessage');
    if (premiumMessage) {
        premiumMessage.style.display = 'block';
        displayLeaderboardButton();
    }
    // displayLeaderboardButton();
}

function displayLeaderboardButton() {
    console.log("display leaderboard envoked")
    const leaderboardButton = document.createElement('button');
    leaderboardButton.id = 'leaderboardButton';
    leaderboardButton.className = 'btn btn-success';
    leaderboardButton.textContent = 'Show Leaderboard';
    leaderboardButton.addEventListener('click', showLeaderboard)

    // Append the "Leaderboard" button to the container where you want to display it
    const container = document.getElementById('leaderboardContainer'); // Replace 'containerId' with the actual container ID
    container.appendChild(leaderboardButton);
}

function showLeaderboard() {
    const userId = JSON.parse(localStorage.getItem('userId'));
    axios.get('http://localhost:3000/user/premium/leaderboard', { headers: { "Authorization": userId } })
        .then(response => {
            const leaderboardContainer = document.getElementById('leaderboardContainer');
            leaderboardContainer.innerHTML = ''; // Clear previous data if any

            // Check if the "leaderboard" property exists and is an array
            if (Array.isArray(response.data.leaderboard)) {
                // Loop through the leaderboard data and create a list of users
                response.data.leaderboard.forEach((user, index) => {
                    const listItem = document.createElement('li');
                    listItem.className = 'list-group-item';
                    listItem.innerHTML = `${index + 1}. ${user.name}: $${user.expenses}`;
                    leaderboardContainer.appendChild(listItem);
                });
            } else {
                console.error('Invalid data format received from the server.');
            }
        })
        .catch(error => {
            console.error(error);
        });
}

function download() {
    const userId = JSON.parse(localStorage.getItem('userId'));
    // console.log(user)
    console.log('downlaod button working');
    axios.get('http://localhost:3000/download', { headers: { 'authorisation': userId } }).then((res) => {
        if (res.status == 200) {
            var a = document.createElement("a");
            a.href = res.data.fileURL;
            a.download = "myexpense.csv";
            a.click();
        } else {
            throw new error(response.data.message);
        }
    }).catch((err) => {
        showError(err);
    })
}


function downloadedData() {
    const userId = JSON.parse(localStorage.getItem('userId'));
    axios.get('http://localhost:3000/user/get/download/data', { headers: { 'authorisation': userId } }).then((res) => {
        const data = res.data;
        displayDownloadedData(data);
    }).catch((error) => {
        console.log(error);
    })
}

function displayDownloadedData(data) {
    const tableBody = document.getElementById('expenseTableBody');

    // Clear any existing rows
    tableBody.innerHTML = '';

    // Loop through the received data and create rows for the table
    data.forEach((item) => {
        const row = tableBody.insertRow();

        // Create cells for date and link
        const dateCell = row.insertCell(0);
        const linkCell = row.insertCell(1);

        // Format the date as needed
        const formattedDate = new Date(item.date).toLocaleString();

        // Populate the cells with data
        dateCell.innerText = formattedDate;

        // Create a link element for the download link
        const linkElement = document.createElement('a');
        linkElement.href = item.url;
        linkElement.innerText = 'Download';
        linkCell.appendChild(linkElement);
    });

    // Display the table
    const expenseTable = document.getElementById('expenseTable');
    expenseTable.style.display = 'table';
}




