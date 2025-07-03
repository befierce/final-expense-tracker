import StripePaymentModal from "./StripePaymentModal";
import { useState } from "react";
import { useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { login, logout } from "../store/AuthSlice";
import "./ExpenseTracker.css";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const ExpenseTracker = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const state = useSelector((state) => console.log("-->", state));
  const premium = useSelector((state) => state.premium.premium);
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

  let totalAmountOfUser;

  const logOutHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    dispatch(logout());

    console.log("new state", state);
    navigate("/");
  };

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
    console.log("close button clicked");
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
      const premium = localStorage.getItem("premium")
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
        totalAmountOfUser = responsExtracted.totalAmount;
        const expenseArray = Object.values(data);
        console.log(expenseArray);
        setExpenses(...expenses, expenseArray);
        setIsPremium(true)
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
    <>
      <div className="header-container">
        <h1 className="header">YOUR EXPENSE TRACKER</h1>
        {!isPremiuim && (
          
          <button
            className="premium-button"
            action="get-premium"
            onClick={() => {
              getPremiumHandler();
            }}
          >
            Get Premium
          </button>
        )}
        {isPremiuim && (<h3>premium</h3>)}
        <button type="button" className="logout-button" onClick={logOutHandler}>
          log out
        </button>
      </div>
      <div className="contaier-form-and-expenses">
        <div className="expense-tracker-form-outer-container">
          <form onSubmit={handleSubmit}>
            <div className="input-outer-container">
              <input
                type="text"
                className="amount-input"
                value={money}
                placeholder="Enter Amount"
                onChange={(e) => {
                  // Accept only digits and restrict to 5 digits
                  const val = e.target.value;
                  if (/^\d{0,5}$/.test(val)) {
                    setExpenseAmount(val);
                  }
                }}
                required
              />
            </div>
            <div className="input-outer-container">
              <input
                type="text"
                className="description-input"
                value={description}
                placeholder="Description"
                onChange={(e) => setDescription(e.target.value)}
                maxLength={15}
                required
              />
            </div>
            <div className="categories">
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
            {/* <div className="submit-expense-button-container"> */}
            <button type="submit" className="submit-expense-button">
              Submit
            </button>
            {/* </div> */}
          </form>
        </div>
        <div className="expense-list-container">
          <ul className="expense-list-ul-container">
            {expenses.map((expense) => (
              <li key={expense.id} className="expense-list-item">
                ${expense.money} - {expense.description} - ({expense.category})
                <div className="delete-edit-button-container">
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
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

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
    </>
  );
};

export default ExpenseTracker;
