import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_URL;

export const loginUser = async (username, password) => {
  try {
    const userCred = {
      username,
      password
    }
    // Fetch the user by userName
    const response = await axios.post(`${API_URL}/login`, userCred);
    const user = response.data; // JSON Server returns an array, get the first match
    // Return the user data
    return { accessToken: user.access_token, userId: user.user_id };
  } catch (error) {
    console.error('Login failed:', error);
    throw new Error('Invalid User');
  }
};

// Register function: adds a new user to the users array with a random access token
export const registerUser = async (email, password, username) => {
  try {
    const newUser = {
      username,
      email,
      password,
    };

    const response = await axios.post(`${API_URL}/register`, newUser);
    return response.data; // Return the newly created user with access token
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};


export const changePassword = async (userId, oldPassword, newPassword) => {
  const requestBody = {
    user_id: userId,
    old_password: oldPassword,
    new_password: newPassword,
  };

  try {
    const response = await axios.post(`${API_URL}/change-password`, requestBody);
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error in changePassword service:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to change password');
  }
};