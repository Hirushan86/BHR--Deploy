import React, { createContext, useContext, useReducer } from "react";
import axios from "axios";

const AuthContext = createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "signIn":
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case "signOut":
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    default:
      return state;
  }
};

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Function to handle user sign-in
  const signIn = async (email, password, navigate) => {
    try {
      const { data } = await axios.post(`${process.env.API_URL}/api/signIn`, {
        email,
        password,
      });

      if (data.isAdmin === true) {
       // Store the token in local storage
      localStorage.setItem('userToken', data.token);

      // Set the token as an authentication header for Axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      // Redirect to the signed-in page
      navigate("/home");
      } else {
        // User is not an admin, display an error message
        console.error("Unauthorised access", "error");
      }

      dispatch({
        type: "signIn",
        payload: {
          user: data,
        },
      });
    } catch (err) {
      if (err.response && err.response.data) {
        console.error(err.response.data.error, "error");
      } else {
        console.error("An error occurred:", err);
      }
    }
  };

// Function to handle user sign-out
const signOut = async () => {
  try {
    await axios.get('/api/sign-out'); // Send a request to server-side sign-out route
    // Clear the token from local storage
    localStorage.removeItem('userToken');
    // Remove the token from Axios headers
    delete axios.defaults.headers.common['Authorization'];
    // Dispatch sign-out action
    dispatch({ type: 'signOut' });
  } catch (err) {
    // Handle any unexpected errors (e.g., network issues) quietly
    console.error("An error occurred during sign-out:", err);
  }
};

  return (
    <AuthContext.Provider value={{ ...state, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

// Create a custom hook to use the AuthContext
export function useAuth() {
  return useContext(AuthContext);
}
