import { useRef } from "react";
import { useParams } from "react-router-dom";

const ResetPasswordForm = () => {
  const inputRef = useRef(null);
  const {uuid }= useParams();

const resetFormHandler = async (e) => {
  e.preventDefault();
  const newPassword = inputRef.current.value;
  console.log("password input:", newPassword);
  console.log("uuid:", uuid);

  const response = await fetch(
    `http://localhost:3000/user/password/resetPassword/${uuid}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        newPassword,
      }),
    }
  );

  const data = await response.json();
  console.log("response data:", data);
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
      />
      <br />
      <button type="submit">Reset Password</button>
    </form>
  );
};

export default ResetPasswordForm;
