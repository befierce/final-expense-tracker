

import { useState , useEffect} from "react";
// import "bootstrap/dist/css/bootstrap.min.css";

const ExpenseTracker = () => {
  const [expenseAmount, setExpenseAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("groceries");
  const [expenses, setExpenses] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newExpense = { id: Date.now(), expenseAmount, description, category };
    setExpenseAmount("");
    setDescription("");
    setCategory("groceries");

    const token = localStorage.getItem('token');
    const response = await fetch("http://localhost:3000/user/expense",{
        method: "POST",
        headers:{
            "Content-Type":"application/json",
            "Authorization": `Bearer ${JSON.parse(token)}`,       
        },
        body: JSON.stringify(newExpense)
    });
    const result = await response.json();
    console.log("response after saving single data to the server", result);

    localStorage.setItem("userId", result.userId);
  };

  useEffect(()=>{
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    console.log("token token", token)
    const fetchExpenses = async ()=>{
      try{
        const response = await fetch(`http://localhost:3000/user/expense/${userId}`,{
          method:'GET',
          headers:{
            "Content-Type":"application/json",
            "Authorization": `Bearer ${JSON.parse(token)}`       
        }
        });
        const data = await response.json();
        const expensesList = data.result.rows;
        console.log("response from server on refreshing", data.result.rows);
        setExpenses(expensesList);
      }catch(error){
        console.log(response)
      }
    }
    fetchExpenses();
  },[]);


  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-white">YOUR EXPENSE TRACKER</h1>
      <form onSubmit={handleSubmit}>
        <div className="mt-2">
          <label className="text-white">Expense Amount</label>
          <input
            type="number"
            className="form-control"
            value={expenseAmount}
            onChange={(e) => setExpenseAmount(e.target.value)}
            required
          />
        </div>
        <div className="mt-2">
          <label className="text-white">Description</label>
          <input
            type="text"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mt-2">
          <label className="text-white">Category</label>
          <select
            className="form-control"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="groceries">Groceries</option>
            <option value="rent">Rent</option>
            <option value="utilities">Utilities</option>
            <option value="entertainment">Entertainment</option>
          </select>
        </div>
        <div className="mt-3">
          <button type="submit" className="btn btn-primary" >Submit</button>
        </div>
      </form>
      <ul className="list-group mt-3">
        {expenses.map((expense) => (
          <li key={expense.id} className="list-group-item">
            {expense.description} - ${expense.expenseAmount} ({expense.category})
          </li>
        ))}
      </ul>
      <button className="btn btn-success mt-3">Get Premium</button>
      <button className="btn btn-info mt-3">Download Expense</button>
      <button className="btn btn-info mt-3">List Of Downloaded Files</button>
    </div>
  );
};

export default ExpenseTracker;

