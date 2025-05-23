import { useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ResetPasswordForm = () => {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { uuid } = useParams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetFormHandler = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    const newPassword = inputRef.current.value;
    console.log("password input:", newPassword);
    console.log("uuid:", uuid);

    try {
      const response = await fetch(
        `http://localhost:3000/user/password/resetPassword/${uuid}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newPassword }),
        }
      );
      const data = await response.json();
      console.log("response data:", data);
      window.alert("password updated");
      navigate("/")
    } catch (error) {
      console.error("Reset failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={resetFormHandler}>
      <label htmlFor="new-password">Enter new password</label>
      <br />
      <input
        id="new-password"
        type="password"
        ref={inputRef}
        placeholder="New Password"
        required
      />
      <br />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Resetting..." : "Reset Password"}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
