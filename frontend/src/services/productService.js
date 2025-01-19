import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_URL;

export const getProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProductsBySearch = async (searchKeyword) => {
  try {
    const response = await axios.get(`${API_URL}/products/search/`, {
      params: { title: searchKeyword }, // Use `name_like` to perform partial matching
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products by search:', error);
    throw error;
  }
};


export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
};

// New function to add a product
export const addProduct = async (product) => {
  try {
    const response = await axios.post(`${API_URL}/products/create`, product);
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Update product service
export const updateProduct = async (id, item) => {
  const userId = localStorage.getItem('userId')
  try {
    const productData = {
      name: item.name,
      description: item.description,
      price: item.price,
      quantity: item.quantity
    }
    const response = await axios.put(`${API_URL}/products/edit?user_id=${userId}&product_id=${item.id}`, productData);
    return response.data; // Return the updated product data
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};