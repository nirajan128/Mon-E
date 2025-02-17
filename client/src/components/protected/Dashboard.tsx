import { useEffect, useState, useContext } from "react";
import { getDashboard } from "../../Api";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const authContext = useContext(AuthContext);
    
    // Ensure authContext is not null
    if (!authContext) {
        throw new Error("AuthContext is not available");
    }

    const { token, logout } = authContext;
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    console.log(token)
    useEffect(() => {
        if (!token) {
            navigate("/login");
            return;
        }
        
        const fetchData = async () => {
            try {
                // Ensure getDashboard expects only a string if required
                const res = await getDashboard(token); // Pass as an object if API expects it
                setMessage(res.data.message);
            } catch (error) {
                console.log(error);
                logout();
                navigate("/login");
            }
        };

        fetchData();
    }, [token, navigate, logout]);

    return (
        <div>
            <h2>Dashboard</h2>
            <p>HI, {message}</p>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

export default Dashboard;
