import React from "react";
const SignInForm: React.FC = () => {
  return (
    <div className="container d-flex justify-content-center  align-items-center">
      <div className="card p-4 shadow formContainer" style={{maxWidth:"350px", width:"100%"}}>
        <h3 className="text-center mb-3">Sign In</h3>
        
        {/* Google Sign-In Button */}
        <button className="btn btn-danger w-100 mb-3">
          <i className="bi bi-google me-2"></i> Sign in with Google
        </button>
        
        {/* OR Divider */}
        <div className="d-flex align-items-center my-3">
          <div className="flex-grow-1 border-bottom"></div>
          <span className="mx-2 text-muted">or</span>
          <div className="flex-grow-1 border-bottom"></div>
        </div>
        
        {/* Email & Password Form */}
        <form>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" placeholder="Enter your email" required />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" placeholder="Enter your password" required />
          </div>
          <button type="submit" className="btn btn-primary w-100">Sign In</button>
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
