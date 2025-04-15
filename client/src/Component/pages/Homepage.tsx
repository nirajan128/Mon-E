import "../../App.css"
import Navigation from "../Shared/Navigation";
import SignInForm from "../form/SignInForm";

function HomePage() {
    return(
        <div id="homeContainer" className="container-fluid">
           
            <div className="row" style={{height:"100%"}}>
            <Navigation />
                <div className="col-sm-12 col-md-5 d-flex flex-col justify-content-center align-items-center">
                    <div className="slogan p-1">
                   <h4>Track</h4>
                   <h4>Save</h4>
                    <h4>Grow</h4>
                    </div>
                </div>
                <div className="col-sm-12 col-md-5 d-flex justify-content-center">
                    <SignInForm />
                </div>
            </div>
        </div>
    )
}

export default HomePage;