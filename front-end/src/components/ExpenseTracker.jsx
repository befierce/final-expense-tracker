import Button from "./Button.jsx";
import { useState, useEffect } from "react";
// import {loadStripe} from '@stripe/stripe-js';



const ExpenseTracker = () => {
  const [expenseAmount, setExpenseAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("groceries");
  const [expenses, setExpenses] = useState([]);
  const [editingExpense, setEditingExpense] = useState(null)

  async function getPremiumHandler (){
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const response = await fetch("http://localhost:3000/user/purchase/premium",{
      method: "POST",
      headers: {
        "Authorisation": `Bearer ${JSON.parse(token)}`
      }
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newExpense = { id: Date.now(), expenseAmount, description, category };
    setExpenseAmount("");
    setDescription("");
    setCategory("groceries");

    const token = localStorage.getItem('token');
    const response = await fetch("http://localhost:3000/user/expense", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JSON.parse(token)}`,
      },
      body: JSON.stringify(newExpense)
    });

    const result = await response.json();
    console.log("response after saving single data to the server", result);

    // Update the expenses state to include the new expense
    setExpenses((prevExpenses) => [...prevExpenses, result]);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    const fetchExpenses = async () => {
      try {
        const response = await fetch(`http://localhost:3000/user/expense/${userId}`, {
          method: 'GET',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${JSON.parse(token)}`
          }
        });
        const data = await response.json();
        const expensesList = data.result.rows;
        setExpenses(expensesList);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/user/expense/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setExpenses((prevExpenses) => prevExpenses.filter(expense => expense.id !== id));
      } else {
        console.error("Failed to delete expense");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };
    const handleUpdate = async (id) => {
    const expenseToUpdate = expenses.find((expense) => expense.id === id);
    console.log("expense to update", expenseToUpdate)
    if (expenseToUpdate) {
      setEditingExpense(expenseToUpdate);
      setExpenseAmount(expenseToUpdate.money);
      setDescription(expenseToUpdate.description);
      setCategory(expenseToUpdate.category);
    }
  };
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const updatedExpense = {
      id: editingExpense.id,
      expenseAmount, // Ensure this matches the backend's expected key
      description,
      category,
    };
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3000/user/expense/edit/${editingExpense.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
        body: JSON.stringify(updatedExpense),
      });
      const res = await response.json();
      if (response.ok) {
        setExpenses((prevExpenses) => {
          const updatedExpenses = prevExpenses.map((expense) =>
            expense.id === editingExpense.id ? res.result : expense
          );
          return updatedExpenses;
        });
        setEditingExpense(null);
        setExpenseAmount("");
        setDescription("");
        setCategory("groceries");
      } else {
        console.error("Failed to update expense:", res);
      }
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };
  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-white">YOUR EXPENSE TRACKER</h1>
      <form onSubmit={editingExpense ? handleUpdateSubmit : handleSubmit}>
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
          <button type="submit" className="btn btn-primary">{editingExpense ? "Update" : "Submit"}</button>
        </div>
        {editingExpense && (
    <button
      type="button"
      className="btn btn-secondary ms-2"
      onClick={() => {
        setEditingExpense(null); // Cancel edit mode
        setExpenseAmount("");
        setDescription("");
        setCategory("groceries");
      }}
    >
      Cancel
    </button>)}
      </form>
      <ul className="list-group mt-3">
        {expenses.map((expense) => (
          <li key={expense.id} className="list-group-item">
            {expense.description} - ${expense.money} ({expense.category})
            <Button onClick={() => handleDelete(expense.id)}>{"delete"}</Button>
            <Button onClick={() => handleUpdate(expense.id)}>{"update"}</Button>
          </li>
        ))}
      </ul>
      <button className="btn btn-success mt-3" onClick={getPremiumHandler}>Get Premium</button>
      <button className="btn btn-info mt-3">Download Expense</button>
      <button className="btn btn-info mt-3">List Of Downloaded Files</button>
    </div>
  );
};

export default ExpenseTracker;