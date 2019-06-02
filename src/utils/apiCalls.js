import axios from 'axios';

export const getCartItems = (cartId) => axios.get(`https://backendapi.turing.com/shoppingcart/${cartId}`);
export const getCartPrice = (cartId) => axios.get(`https://backendapi.turing.com/shoppingcart/totalAmount/${cartId}`);
export const fetchProducts = page => axios.get(`https://backendapi.turing.com/products?page=${page}&limit=${10}`);
export const searchProducts = searchTerm => axios.get(`https://backendapi.turing.com/products/search?query_string=${searchTerm}`);
