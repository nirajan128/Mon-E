import Logo from "./Logo";
function Navigation(){
    return (
      <div className="navigation col-sm-12 col-md-2">
        <div className="p-2 d-flex w-100 justify-content-center align-items-center h-100">
            <Logo />
        </div>
      </div>
    )
}

export default Navigation;