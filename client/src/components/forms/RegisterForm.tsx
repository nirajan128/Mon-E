import { useState } from "react";
import InputLabel from "../shared/InputLabel";
import LoadingSpinner from "../shared/LoadingSpinner";
import ErrorAlertStatus from "../shared/ErrorAlert";

export default function RegisterForm() {
  // State for handling form inputs
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    firstName:"",
    lastName:"",
    confirmPassword:""
  });
  const [errorMessage, setErrorMessage] = useState<string | null>();
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    console.log("Form Submitted:", inputValue);
    
    //2. get the input values
    const {email,password,firstName,lastName, confirmPassword} = inputValue

    //3. if confitm password does not match
    if(inputValue.confirmPassword !== inputValue.password){
      setErrorMessage("Password does not match");
      setLoading(false);
      return;
    }

    if (!email || !password || !firstName || !lastName || !confirmPassword) {
      setErrorMessage("All fields are required!");
      setLoading(false); // Stop loading on error
      return;
    }

    //4. create a fetch request to the server and pass the usercred as json body
    try {
      const response = await fetch("http://localhost:5000/api/user/register",{
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({email,firstName,lastName,password}) //sends thedata in the body as JSON
      })

      //5. get the data response
      /* const parseResponse = await response.json(); */

      //6. Check the resposne
      if(response.ok){
        setErrorMessage(null);
        alert("User Succesfully registered")
      }else{
        setErrorMessage("Error while registering")
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("An error occurred during registration.");
    }finally{
      setLoading(false); //stop the loading, regardless of the outcome
    }
  };

  // Show loading spinner when isLoading is true
  if (loading) {
    return <LoadingSpinner />; 
  }

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
          <button className="btn btn-primary bgAccent text-dark mt-3" disabled={loading}>
            {loading ? "Logging in..." : "Register"}
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
