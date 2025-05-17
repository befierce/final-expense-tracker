import StripePaymentModal from "./StripePaymentModal";
import { useState } from "react";
import { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const ExpenseTracker = () => {
  const [money, setExpenseAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("groceries");
  const [expenses, setExpenses] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [isPremiuim, setIsPremium] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getPremiumHandler = async (e) => {
    console.log("premium button clicked");
    setLoading(true);
    const token = localStorage.getItem("token");
    const response = await fetch(
      "http://localhost:3000/user/purchase/premium",
      {
        method: "POST",
        headers: {
          Authorization: `bearer ${token}`,
          "content-type": "Application/json",
        },
      }
    );
    const data = await response.json();
    const { clientSecret } = data;
    setClientSecret(clientSecret);
    setShowPaymentForm(true);
    console.log(clientSecret);
  };

  const handlePaymentSucess = () => {
    setIsPremium(true);
    setShowPaymentForm(false);
  };
  const handleClosePaymentForm = () => {
    console.log("close button clicked")
    setShowPaymentForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const newExpense = { id: Date.now(), money, description, category };
    if (editingId) {
      const response = await fetch(
        `http://localhost:3000/user/expense/edit/${editingId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "content-type": "application/json",
          },
          body: JSON.stringify(newExpense),
        }
      );
      const data = await response.json();
      const updatedExpense = data.result[0];
      const editedId = data.result[0].id;
      console.log("id to be edited", editedId);
      setExpenses((prevExpenses) => {
        return prevExpenses.map((expense) => {
          if (expense.id == editedId) {
            return updatedExpense;
          }
          return expense;
        });
      });
    } else {
      // const newExpense = { id: Date.now(), money, description, category };
      setExpenses([...expenses, newExpense]);
      const endpoint = "http://localhost:3000/user/expense";
      await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
        body: JSON.stringify(newExpense),
      });
    }

    setExpenseAmount("");
    setDescription("");
    setCategory("groceries");
  };
  useEffect(() => {
    const fetchExpenses = async (e) => {
      const token = localStorage.getItem("token");
      const endpoint = "http://localhost:3000/user/expense";
      try {
        const response = await fetch(endpoint, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const responsExtracted = await response.json();
        const data = responsExtracted.result.rows;
        console.log(typeof data);
        const expenseArray = Object.values(data);
        console.log(expenseArray);
        setExpenses(...expenses, expenseArray);
      } catch (error) {
        console.log(error);
      }
    };

    fetchExpenses();
  }, []);

  const editHandler = (expense) => {
    console.log("edit button clicked", expense);
    setEditingId(expense.id);
    setExpenseAmount(expense.money);
    setDescription(expense.description);
    setCategory(expense.category);
  };
  const deleteHandler = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`http://localhost:3000/user/expense/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "Application/json",
        },
      });
      if (response.ok) {
        setExpenses((prevExpenses) => {
          return prevExpenses.filter((expense) => {
            return expense.id != id;
          });
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-white">YOUR EXPENSE TRACKER</h1>
      <form onSubmit={handleSubmit}>
        <div className="mt-2">
          <label className="text-white">Expense Amount</label>
          <input
            type="number"
            className="form-control"
            value={money}
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
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
      <ul className="list-group mt-3">
        {expenses.map((expense) => (
          <li key={expense.id} className="list-group-item">
            ${expense.money} - {expense.description} - ({expense.category})
            <span>
              <button
                className="edit"
                action="edit"
                onClick={() => {
                  editHandler(expense);
                }}
              >
                edit
              </button>
            </span>
            <span>
              <button
                className="delete"
                action="delete"
                onClick={() => {
                  deleteHandler(expense.id);
                }}
              >
                delete
              </button>
            </span>
          </li>
        ))}
      </ul>
      {!isPremiuim && (
        <button
          className="btn btn-success mt-3"
          action="get-premium"
          onClick={() => {
            getPremiumHandler();
          }}
        >
          Get Premium
        </button>
      )}
      {showPaymentForm && (
        <StripePaymentModal
          clientSecret={clientSecret}
          onSuccess={handlePaymentSucess}
          onClose={handleClosePaymentForm}
        />
      )}
      {isPremiuim && (
        <button className="btn btn-info mt-3" action="download-expense">
          Download Expense
        </button>
      )}
      {isPremiuim && (
        <button className="btn btn-info mt-3">List Of Downloaded Files</button>
      )}
    </div>
  );
};

export default ExpenseTracker;
