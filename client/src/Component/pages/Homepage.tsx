import "../../App.css"
import Navigation from "../Shared/Navigation";
import Scene from "../Shared/Cube";
function HomePage() {
    return(
        <div id="homeContainer" className="container-fluid">
            <Navigation />
            <div className="row">
                <div className="col-sm-12 col-md-8 d-flex flex-col justify-content-center align-items-center">
                    <div className="slogan p-1">
                   <h4>Track</h4>
                   <h4>Save</h4>
                    <h4>Grow</h4>
                    </div>
                    <div>
                        <Scene />
                    </div>
                </div>
                <div className="col-sm-12 col-md-4"></div>
            </div>
        </div>
    )
}

export default HomePage;