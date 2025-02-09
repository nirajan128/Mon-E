/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-empty */
import { useState } from "react";
import InputLabel from "../shared/InputLabel";

export default function RegisterForm() {
  // State for handling form inputs
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    firstName:"",
    lastName:"",
    confirmPassword:""
  });

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
    console.log("Form Submitted:", inputValue);

    try {
      
    } catch (error) {
      
    }
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
          {/*  Input */}
          <InputLabel
            type="text"
            name="firstName"
            value={inputValue.firstName}
            valueChange={handleInputChange}
            label="first name"
          />
          <InputLabel
            type="text"
            name="lastName"
            value={inputValue.lastName}
            valueChange={handleInputChange}
            label="last name"
          />


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

           {/* confirmPassword Input */}
           <InputLabel
            type="password"
            name="confirmPassword"
            value={inputValue.confirmPassword}
            valueChange={handleInputChange}
            label="confirm Password"
          />

          {/* Submit Button */}
          <button className="btn btn-primary w-100 py-2 mt-3" type="submit">
            Register
          </button>

          <p className="mt-5 mb-3 text-body-secondary text-center">© 2017–2024</p>
        </form>
      </div>
    </div>
  );
}
