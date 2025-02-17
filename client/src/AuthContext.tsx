import { createContext, useState, useEffect, ReactNode } from "react";

// Define the shape of the authentication context
interface AuthContextType {
    token: string | null;
    login: (newToken: string) => void;
    logout: () => void;
}

// Provide a default value with empty functions to prevent `null` errors
export const AuthContext = createContext<AuthContextType>({
    token: null,
    login: () => {},
    logout: () => {},
});

interface AuthProviderProps {
    children: ReactNode; // Define the expected type for children
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    // State to hold authentication token, initialized from localStorage if available
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));

    // Effect to update localStorage when the token state changes
    useEffect(() => {
        if (token) {
            localStorage.setItem("token", token);
        } else {
            localStorage.removeItem("token");
        }
    }, [token]);

    // Function to log in by setting a new token
    const login = (newToken: string) => setToken(newToken);

    // Function to log out by clearing the token
    const logout = () => setToken(null);

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
