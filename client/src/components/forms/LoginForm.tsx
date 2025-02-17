import { useState, useContext } from "react";
import InputLabel from "../shared/InputLabel";
import { loginUser } from "../../Api";
import { AuthContext } from "../../AuthContext";
import {  useNavigate } from "react-router-dom";
import ErrorAlertStatus from "../shared/ErrorAlert";

export default function LoginForm() {
  // State for handling form inputs
  const [inputValue, setInputValue] = useState({
    email: "",
    password: ""
  });
  const [errorMessage, setErrorMessage] = useState<string | null>();
  const {login} = useContext(AuthContext);
  const navigate = useNavigate();

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValue((prevState) => ({
      ...prevState,
      [name]: value //sets the value for corresponding input name
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const {email, password} = inputValue;
    try {
      const res = await loginUser({email, password});
      login(res.data.token);
      console.log(res.data.token);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      setErrorMessage("Invalid Credenitials")
    }
    console.log("Form Submitted:", inputValue);
    // Perform login action (API call, validation, etc.)
  };

  return (
    <div className="d-flex justify-content-center align-items-center customHeight">
      <div className="bg-body shadow p-4 w-100" style={{ maxWidth: "400px" }}>
        <form onSubmit={handleSubmit}>
          <div className="text-center">
            <img
              className="mb-4"
              src="https://getbootstrap.com/docs/5.3/assets/brand/bootstrap-logo.svg"
              alt="Bootstrap Logo"
              width="72"
              height="57"
            />
            <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
          </div>

          {/* Email Input */}
          <InputLabel
            type="email"
            name="email"
            value={inputValue.email}
            valueChange={handleInputChange}
            label="Email Address"
          />

          {/* Password Input */}
          <InputLabel
            type="password"
            name="password"
            value={inputValue.password}
            valueChange={handleInputChange}
            label="Password"
          />

          {/* Submit Button */}
          <button className="btn btn-primary w-100 py-2 mt-3" type="submit">
            Sign in
          </button>
            {/* Conditionally render AlertStatus component */}
          {errorMessage && (
            <ErrorAlertStatus message={errorMessage} state="alert-danger" />
          )}
          <p className="mt-5 mb-3 text-body-secondary text-center">© 2017–2024</p>
        </form>
      </div>
    </div>
  );
}
