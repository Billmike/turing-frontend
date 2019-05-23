import React, { Component } from 'react';
import axios from 'axios';
import Spinner from '../Spinner';
import Navbar from '../Navbar';

class SingleProduct extends Component {
  state = {
    product: {},
    size: '',
    quantity: 0,
    thumbnail: '',
    color: '',
    isLoading: false,
    cart_id: '',
    productIncart: [],
    total_price: '0.00'
  }

  async componentDidMount() {
    this.setState({ isLoading: true })
    const { match: { params: { id } } } = this.props;
    const response = await axios.get(`https://backendapi.turing.com/products/${id}`);
    const getCartID = await localStorage.getItem('cartId');
    if (!getCartID) {
      const cartID = await axios.get('https://backendapi.turing.com/shoppingcart/generateUniqueId');
      console.log('cart', cartID.data.cart_id)
      localStorage.setItem('cartId', cartID.data.cart_id);
      this.setState({ cart_id: cartID.data.cart_id })
    } else {
      const response = await axios.get(`https://backendapi.turing.com/shoppingcart/${getCartID}`);
      const totalPrice = await axios.get(`https://backendapi.turing.com/shoppingcart/totalAmount/${getCartID}`)
      console.log('response', totalPrice);
      this.setState({ cart_id: getCartID, productIncart: response.data, total_price: totalPrice.data.total_amount })
    }
    this.setState({ product: response.data, thumbnail: response.data.thumbnail, isLoading: false })
  }

  setSize = (size) => {
    this.setState({ size });
  }

  setQuantity = (type) => {
    const { quantity } = this.state;
    if (type === 'decrement' && quantity > 0) {
      this.setState(prevState => ({
        quantity: prevState.quantity - 1
      }))
    } else if (type === 'increment') {
      this.setState(prevState => ({
        quantity: prevState.quantity + 1
      }))
    }
  }

  changeMainImage = (image) => {
    this.setState({ thumbnail: image })
  }

  setColor = (color) => {
    this.setState({ color })
  }

  addToCart = async () => {
    const { cart_id, product, size, color, quantity } = this.state;
    const data = { cart_id, product_id: product.product_id, attributes: `${size}, ${color}` };
    const getCartID = await localStorage.getItem('cartId');
    const shoppingCartItems = await axios.post('https://backendapi.turing.com/shoppingcart/add', data);
    const lastItem = shoppingCartItems.data[shoppingCartItems.data.length - 1];
    const updateData = { quantity };
    const updateQuantity = await axios.put(`https://backendapi.turing.com/shoppingcart/update/${lastItem.item_id}`, updateData);
    const totalPrice = await axios.get(`https://backendapi.turing.com/shoppingcart/totalAmount/${getCartID}`)
    this.setState({ productIncart: updateQuantity.data, total_price: totalPrice.data.total_amount })
  }

  render() {
    console.log('props', this.state)
    const {
      product: {
        description,
        discounted_price,
        image,
        image_2,
        name,
        price,
      },
      quantity,
      thumbnail,
      color,
      size,
      isLoading,
      productIncart,
      total_price
    } = this.state;

    if (isLoading) {
      return <Spinner />
    }

    return (
      <div>
        <Navbar
          history={this.props.history}
          productIncart={productIncart}
          cartPrice={total_price}
          />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {thumbnail && <img
              alt=""
              src={require(`../assets/product_images/${thumbnail}`)}
              style={{
                height: 300,
                width: 300
              }}
            />}
            <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 30 }}>
              {image && <img
                alt=""
                src={require(`../assets/product_images/${image}`)}
                style={{
                  height: 70,
                  width: 70,
                  cursor: 'pointer'
                }}
                onClick={() => this.changeMainImage(image)}
              />}
              {image_2 && <img
                alt=""
                src={require(`../assets/product_images/${image_2}`)}
                style={{
                  height: 70,
                  width: 70,
                  cursor: 'pointer'
                }}
                onClick={() => this.changeMainImage(image_2)}
              />}
            </div>
          </div>
          <div style={{ flexWrap: 'wrap', width: '30%', marginLeft: 30 }}>
            <h4>Home</h4>
            <p>{description}</p>
            <p style={{ color: 'red', fontWeight: 500 }}>${price}</p>
            <div>
              <p>Color</p>
              <div style={{ display: 'flex' }}>
                <div style={{
                  borderRadius: '50%',
                  height: 15,
                  width: 15,
                  backgroundColor: 'red',
                  boxShadow: color === 'red' ? '0 0px 2px 4px rgb(16,114,181)' : '',
                  cursor: 'pointer'
                }}
                  onClick={() => this.setColor('red')}
                />
                <div
                  style={{
                  borderRadius: '50%',
                  height: 15,
                  width: 15,
                  backgroundColor: 'blue',
                  marginLeft: 15,
                  boxShadow: color === 'blue' ? '0 0px 2px 4px rgb(16,114,181)' : '',
                  cursor: 'pointer'
                }}
                  onClick={() => this.setColor('blue')}
                />
                <div
                  style={{
                  borderRadius: '50%',
                  height: 15,
                  width: 15,
                  backgroundColor: 'green',
                  marginLeft: 15,
                  boxShadow: color === 'green' ? '0 0px 2px 4px rgb(16,114,181)' : '',
                  cursor: 'pointer'
                }}
                  onClick={() => this.setColor('green')}
                />
                <div
                  style={{
                  borderRadius: '50%',
                  height: 15,
                  width: 15,
                  backgroundColor: 'orange',
                  marginLeft: 15,
                  boxShadow: color === 'orange' ? '0 0px 2px 4px rgb(16,114,181)' : '',
                  cursor: 'pointer'
                }}
                  onClick={() => this.setColor('orange')}
                />
                <div
                  style={{
                  borderRadius: '50%',
                  height: 15,
                  width: 15,
                  backgroundColor: 'purple',
                  marginLeft: 15,
                  boxShadow: color === 'purple' ? '0 0px 2px 4px rgb(16,114,181)' : '',
                  cursor: 'pointer'
                }}
                  onClick={() => this.setColor('purple')}
                />
              </div>
            </div>
            <div>
              <p>Size</p>
              <div style={{ display: 'flex' }}>
                <p style={{
                  backgroundColor: size === 'S' ? 'red' : '#DCDCDC',
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 5,
                  paddingBottom: 5,
                  fontSize: 12,
                  color: size === 'S' ? '#FFF' : 'black',
                  cursor: 'pointer'
                }}
                onClick={() => this.setSize('S')}
                >S</p>
                <p style={{
                  backgroundColor: size === 'M' ? 'red' : '#DCDCDC',
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 5,
                  paddingBottom: 5,
                  fontSize: 12,
                  marginLeft: 15,
                  cursor: 'pointer',
                  color: size === 'M' ? '#FFF' : 'black',
                }}
                onClick={() => this.setSize('M')}
                >M</p>
                <p style={{
                  backgroundColor: size === 'L' ? 'red' : '#DCDCDC',
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 5,
                  paddingBottom: 5,
                  fontSize: 12,
                  marginLeft: 15,
                  cursor: 'pointer',
                  color: size === 'L' ? '#FFF' : 'black',
                }}
                onClick={() => this.setSize('L')}
                >L</p>
                <p style={{
                  backgroundColor: size === 'XL' ? 'red' : '#DCDCDC',
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 5,
                  paddingBottom: 5,
                  fontSize: 12,
                  marginLeft: 15,
                  cursor: 'pointer',
                  color: size === 'XL' ? '#FFF' : 'black',
                }}
                onClick={() => this.setSize('XL')}
                >XL</p>
                <p style={{
                  backgroundColor: size === 'XXL' ? 'red' : '#DCDCDC',
                  paddingLeft: 10,
                  paddingRight: 10,
                  paddingTop: 5,
                  paddingBottom: 5,
                  fontSize: 12,
                  marginLeft: 15,
                  cursor: 'pointer',
                  color: size === 'XXL' ? '#FFF' : 'black',
                }}
                onClick={() => this.setSize('XXL')}
                >XXL</p>
              </div>
            </div>
            <div>
              <p>Quantity</p>
              <div style={{ display: 'flex' }}>
                <p style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: '#DCDCDC',
                  textAlign: 'center',
                  marginRight: 15,
                  cursor: 'pointer'
                }}
                onClick={() => this.setQuantity('decrement')}
                >-</p>
                <p>{quantity}</p>
                <p style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  backgroundColor: '#DCDCDC',
                  textAlign: 'center',
                  marginLeft: 15,
                  cursor: 'pointer'
                }}
                onClick={() => this.setQuantity('increment')}
                >+</p>
              </div>
            </div>
            <button
              style={{
                height: 40,
                width: 150,
                backgroundColor: 'red',
                borderRadius: 20,
                color: '#FFF'
              }}
              onClick={this.addToCart}
            >
              Add to cart
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default SingleProduct;
