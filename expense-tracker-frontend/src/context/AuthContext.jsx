// // src/context/AuthContext.js
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { login as apiLogin, register as apiRegister } from '../services/api';

// const AuthContext = createContext();

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export const AuthProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const [loading, setLoading] = useState(true);

// useEffect(() => {
//   const token = localStorage.getItem('token');
//   const userString = localStorage.getItem('user');

//   let user = null;

//   if (userString && userString !== "undefined" && userString !== "null") {
//     try {
//       user = JSON.parse(userString);
//     } catch (err) {
//       console.error("Failed to parse user from localStorage", err);
//       localStorage.removeItem('user'); // remove invalid value
//       user = null;
//     }
//   }

//   setCurrentUser(user);
//   setLoading(false);
// }, []);



//   const register = async (userData) => {
//     try {
//       const response = await apiRegister(userData);
//       const { token, user } = response.data;
      
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(user));
//       setCurrentUser(user);
      
//       return { success: true };
//     } catch (error) {
//       return { 
//         success: false, 
//         message: error.response?.data?.message || 'Registration failed' 
//       };
//     }
//   };

//   const login = async (userData) => {
//     try {
//       const response = await apiLogin(userData);
//       const { token, user } = response.data;
      
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(user));
//       setCurrentUser(user);
      
//       return { success: true };
//     } catch (error) {
//       return { 
//         success: false, 
//         message: error.response?.data?.message || 'Login failed' 
//       };
//     }
//   };

//   const logout = () => {
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     setCurrentUser(null);
//   };

//   const value = {
//     currentUser,
//     register,
//     login,
//     logout
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {!loading && children}
//     </AuthContext.Provider>
//   );
// };




// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as apiLogin, register as apiRegister } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      try {
        setCurrentUser(JSON.parse(user));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      const response = await apiRegister(userData);
      
      // Backend returns: { _id, name, email, token }
      if (response && (response.status === 201 || response.status === 200) && response.data) {
        // Do NOT auto-login after registration. Redirect user to login page instead.
        return { success: true };
      }
      
      return { 
        success: false, 
        message: 'Invalid response from server' 
      };
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

// src/context/AuthContext.js
const login = async (userData) => {
  try {
    const response = await apiLogin(userData);
    console.log('API login response:', response);

    // Check if response.data exists and has a token
    if (response.data && response.data.token) {
      const user = response.data;
      const token = user.token;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setCurrentUser(user);

      return { success: true };
    } else {
      return {
        success: false,
        message: 'Invalid response from server - no token found'
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed'
    };
  }
};


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    register,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};