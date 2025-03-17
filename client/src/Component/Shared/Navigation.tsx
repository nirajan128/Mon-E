import Logo from "./Logo";
function Navigation(){
    return (
        <nav className="navbar navbar-expand-lg w-100">
    <a className="navbar-brand logo" href="#">{<Logo />}</a>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
            <li className="nav-item">
                <a className="nav-link" href="#">Income</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="#">Expenses</a>
            </li>
        </ul>
    </div>
</nav>
    )
}

export default Navigation;