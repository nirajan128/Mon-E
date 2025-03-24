import React, {useState, useEffect} from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import ErrorAlertStatus from "../Shared/ErrorAlert";
import InputLabel from "../Shared/InputLabel";
import Spinner from "../Shared/Spinner";

const SignInForm: React.FC = () => {
  const API_BASE_URL = "http://localhost:5000"; // Your Express backend URL
  const navigate = useNavigate();
  const { token, login } = useAuth();

  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

    /* Sets the state on Input value */
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setInputValue((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    };
  
    /* Login functionality */
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setErrorMessage(null); // Reset error state
  
      const { email, password } = inputValue;
  
      try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
          email,
          password,
        });
        const tokenResponse = response.data;
  
        // Login method from AuthContext, stores token & redirects
        login(tokenResponse);
      } catch (error) {
        console.log(error);
        setErrorMessage("Error while logging in. Please try again.");
      } finally {
        setLoading(false);
      }
    };
  
    /* Google Login Redirect */
    const handleGoogleLogin = () => {
      window.location.href = `${API_BASE_URL}/auth/google`; // Redirect to backend
    };
  
    if (loading) {
      return <Spinner />;
    }
  

  return (
    <div className="container d-flex justify-content-center  align-items-center">
      <div className="card p-4 shadow formContainer" style={{maxWidth:"350px", width:"100%"}}>
        <h3 className="text-center mb-3">Sign In</h3>
        
        {/* Google Sign-In Button */}
        <button className="btn btn-danger w-100 mb-3" onClick={handleGoogleLogin}>
          <i className="bi bi-google me-2"></i> Sign in with Google
        </button>
        
        {/* OR Divider */}
        <div className="d-flex align-items-center my-3">
          <div className="flex-grow-1 border-bottom"></div>
          <span className="mx-2 text-muted">or</span>
          <div className="flex-grow-1 border-bottom"></div>
        </div>
        
        {/* Email & Password Form */}
        <form onSubmit={handleSubmit}>
         {/*  <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="Enter your email" required />
          </div> */}
          {/* <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="Enter your password" required />
          </div> */}
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
          <button className="btn btn-primary bgAccent text-dark mt-3 w-100" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* Error Message */}
          {errorMessage && <ErrorAlertStatus message={errorMessage} state="alert-danger" />}
        </form>
        
        {/* Sign Up Link */}
        <p className="text-center mt-3">
          Don’t have an account? <a href="#" className="text-primary">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default SignInForm;
