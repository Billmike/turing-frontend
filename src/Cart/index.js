import React, { Component } from 'react';
import axios from 'axios';
import Navbar from '../Navbar';


class Cart extends Component {
  state = {
    productIncart: [],
    total_price: ''
  }

  async componentDidMount() {
    const getCartID = await localStorage.getItem('cartId');
    if (!getCartID) {
      this.setState({ productInCart: [] })
    } else {
      const cartItem = await axios.get(`https://backendapi.turing.com/shoppingcart/${getCartID}`);
      const totalPrice = await axios.get(`https://backendapi.turing.com/shoppingcart/totalAmount/${getCartID}`)
      this.setState({ productIncart: cartItem.data, total_price: totalPrice.data.total_amount });
    }
  }

  render() {
    const { productIncart, total_price } = this.state;
    console.log('PINS', productIncart)
    return (
      <div>
        <Navbar
          productIncart={productIncart}
          cartPrice={total_price}
        />
        <p>{productIncart.length} items in cart</p>
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <p>Items</p>
          <p>Size</p>
          <p>Quantity</p>
          <p>Price</p>
        </div>
        {
          productIncart.map((product, index) => (
            <div>
              <div>
                <img
                  src={require(`../assets/product_images/${product.image}`)}
                  alt=""
                  style={{
                    height: 50,
                    width: 50
                  }}
                />
                <p>{product.name}</p>
              </div>
              <p>{product.attributes.split(',')[0]}</p>
              <p>{product.quantity}</p>
              <p>{product.price}</p>
            </div>
          ))
        }
      </div>
    )
  }
}

export default Cart;
