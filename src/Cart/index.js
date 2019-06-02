import React, { Component } from 'react';
import toastr from 'toastr';
import axios from 'axios';
import { getCartItems, getCartPrice } from '../utils/apiCalls';
import Navbar from '../Navbar';
import { Table } from 'reactstrap';
import Spinner from '../Spinner';
import './styles.scss';

class Cart extends Component {
  state = {
    productIncart: [],
    total_price: '',
    cartID: '',
    isLoading: false,
    isLoggedIn: false
  }

  async componentDidMount() {
    this.setState({ isLoading: true })
    const getCartID = await localStorage.getItem('cartId');
    const userID = await localStorage.getItem('user');
    if (!userID) {
      this.setState({ isLoggedIn: false })
    } else {
      this.setState({ isLoggedIn: true })
    }
    if (!getCartID) {
      this.setState({ productIncart: [], isLoading: false })
    } else {
      const cartItem = await getCartItems(getCartID);
      const totalPrice = await getCartPrice(getCartID);
      this.setState({ productIncart: cartItem.data, total_price: totalPrice.data.total_amount, isLoading: false });
    }
  }

  changeQuantityCount = async (change, itemID) => {
    const { productIncart } = this.state;
    const getCartID = await localStorage.getItem('cartId');
    const foundItem = productIncart.find(product => product.item_id === itemID);
    let { item_id, quantity, image, product_id } = foundItem;
    let newQty;
    if (change === 'add') {
      newQty = quantity + 1;
    } else if (change === 'remove') {
      newQty = quantity - 1;
    }
    const data = { quantity: newQty };
    const returnedResponse = await axios.put(`https://backendapi.turing.com/shoppingcart/update/${item_id}`, data);
    const totalPrice = await axios.get(`https://backendapi.turing.com/shoppingcart/totalAmount/${getCartID}`);
    const modifiedProductInCart = returnedResponse.data.find(product => product.item_id === item_id);
    const mergedData = { ...modifiedProductInCart, image, product_id };
    const indexOfReplacedElement = productIncart.indexOf(foundItem);
    productIncart[indexOfReplacedElement] = mergedData;
    this.setState({ productIncart, total_price: totalPrice.data.total_amount })
  }

  placeOrder = async() => {
    const getCartID = await localStorage.getItem('cartId');
    const userData = await localStorage.getItem('userData');
    const accessToken = await localStorage.getItem('user');
    const parsedAccessToken = JSON.parse(accessToken);
    const parsedUser = JSON.parse(userData);
    const { shipping_region_id } = parsedUser;
    const data = { cart_id: getCartID, shipping_id: shipping_region_id, tax_id: 2 };
    try {
      const url = 'https://backendapi.turing.com/orders';
      const options = {
        method: 'POST',
        data,
        url,
        headers: {
          'USER-KEY': `${parsedAccessToken.accessToken}`,
          'Content-type': 'application/json'
        }
      }
      const postOrder = await axios(options);
      const cartItem = await axios.get(`https://backendapi.turing.com/shoppingcart/${getCartID}`);
      const totalPrice = await axios.get(`https://backendapi.turing.com/shoppingcart/totalAmount/${getCartID}`)
      this.setState({ productIncart: cartItem.data, total_price: totalPrice.data.total_amount});
    } catch (error) {
      toastr.error('An error occurred.')
    }
  }

  removeProductFromCart = async(itemID) => {
    const getCartID = await localStorage.getItem('cartId');
    await axios.delete(`https://backendapi.turing.com/shoppingcart/removeProduct/${itemID}`);
    const cartItem = await axios.get(`https://backendapi.turing.com/shoppingcart/${getCartID}`);
    const totalPrice = await axios.get(`https://backendapi.turing.com/shoppingcart/totalAmount/${getCartID}`);
    this.setState({ productIncart: cartItem.data, total_price: totalPrice.data.total_amount })
  }

  clearCart = async() => {
    const getCartID = await localStorage.getItem('cartId');
    const response = await axios.delete(`https://backendapi.turing.com/shoppingcart/empty/${getCartID}`);
    this.setState({ productIncart: response.data, total_price: '0.00' })
  }

  render() {
    const { productIncart, total_price, isLoading, isLoggedIn } = this.state;
    const { history } = this.props;
    if (isLoading) {
      return <Spinner />
    }

    return (
      <div>
        <Navbar
          productIncart={productIncart}
          cartPrice={total_price}
          history={history}
        />
        {productIncart.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 150 }}>
            <p style={{ fontSize: 25 }}>You have no items in cart</p>
            <button className="back-to-shop"
            onClick={() => history.push('/')}
          >
              Back to Shop
            </button>
          </div>
          )}
          {productIncart.length > 0 &&
          (
            <div className="product-in-cart-wrapper">
              <p>
                {productIncart.length} item(s) in cart
              </p>
              <button
                onClick={this.clearCart}
                >
                Clear Cart
              </button>
            </div>
          )
          }
        {productIncart.length > 0 && <Table>
        <thead>
          <tr>
            <th className="header-styles">Item</th>
            <th className="header-styles">Size</th>
            <th className="header-styles">Quantity</th>
            <th className="header-styles">Price</th>
          </tr>
        </thead>
        <tbody>
        {
          productIncart.map((product, index) => (
            <tr key={index}>
              <td>
              {product.image &&
              <div style={{ display: 'flex' }}>
              <img
                  src={require(`../assets/product_images/${product.image}`)}
                  alt=""
                  style={{
                    height: 80,
                    width: 80
                  }}
                />
                <div style={{ marginLeft: 15 }}>
                  <p style={{ fontFamily: 'Montserrat' }}>{product.name}</p>
                  <i
                    className="fas fa-times" style={{ color: 'red', marginRight: 10, cursor: 'pointer' }}
                    onClick={() => this.removeProductFromCart(product.item_id)}
                  >
                  </i>
                  <span style={{ fontFamily: 'Montserrat', fontSize: 14 }}>Remove</span>
                </div>
                </div>
                }
              </td>
              <td style={{ fontFamily: 'Montserrat' }}>{product.attributes.split(',')[0] || 'N/A'}</td>
              <td style={{ display: 'flex' }}>
                <div className="decrement">
                  <p
                    onClick={() => this.changeQuantityCount('remove', product.item_id)}
                  >
                    -
                  </p>
                </div>
                <p style={{
                  backgroundColor: '#FFF',
                  borderStyle: 'solid',
                  borderWidth: 'thin',
                  borderColor: '#D3D3D3',
                  borderRadius: '50%',
                  width: 30,
                  textAlign: 'center',
                  marginTop: -3,
                  fontFamily: 'Montserrat'
                }}>{product.quantity}</p>
                <div className="increment">
                  <p
                    onClick={() => this.changeQuantityCount('add', product.item_id)}
                  >
                    +
                  </p>
                </div>
              </td>
              <td style={{ fontFamily: 'Montserrat' }}>${product.subtotal}</td>
            </tr>
          ))
        }
        </tbody>
      </Table>}
        {productIncart.length > 0 && <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <button className="back-to-shop"
            onClick={() => history.push('/')}
          >
            Back to shop
          </button>
          {isLoggedIn ?
          (
            <button
              className={Number(total_price) > 50 ? "cart-checkout-button" : "cart-checkout-button-disabled"}
              disabled={Number(total_price) < 50}
              onClick={() => history.push('/checkout')}
            >
              {Number(total_price) < 50 ? 'Order price needs to be greater than $50' : 'Checkout'}
            </button>
          ) : <p onClick={() => history.push('/login')} className="login-to-checkout">Log in to proceed to checkout</p>}
        </div>}
      </div>
    )
  }
}

export default Cart;
