import React, { Component } from 'react';
import axios from 'axios';
import { Input, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import StarRatings from 'react-star-ratings';
import { withToastManager } from 'react-toast-notifications';
import moment from 'moment';
import Spinner from '../Spinner';
import Navbar from '../Navbar';
import './styles.scss';

export class SingleProduct extends Component {
  state = {
    product: {},
    size: '',
    quantity: 1,
    thumbnail: '',
    color: '',
    isLoading: false,
    cart_id: '',
    productIncart: [],
    total_price: '0.00',
    totalRating: 0,
    reviews: [],
    reviewRating: 4,
    reviewString: '',
    nickname: '',
    isModalOpen: false,
    disableButton: false,
    isUserLoggedIn: false,
    disableReviewButton: false,
    itemsInCartName: []
  }

  async componentDidMount() {
    this.setState({ isLoading: true })
    const { match: { params: { id } } } = this.props;
    const response = await axios.get(`https://backendapi.turing.com/products/${id}`);
    const getUser = await localStorage.getItem('user');
    if (!getUser) {
      this.setState({ isUserLoggedIn: false });
    } else {
      this.setState({ isUserLoggedIn: true });
    }
    try {
      const ratings = await axios.get(`https://backendapi.turing.com/products/${id}/reviews`);
      let initialValue = 0;
      const totalRating = ratings.data.reduce((acc, currentVal) => {
        return acc + currentVal.rating;
      }, initialValue);
      const averageRating = ratings.data.length === 0 ? 0 : totalRating / ratings.data.length;
      const convertToInteger = Number(averageRating).toFixed(1);
      this.setState({ totalRating: convertToInteger, reviews: ratings.data })
    } catch (error) {
      console.error(error)
    }
    const getCartID = await localStorage.getItem('cartId');
    if (!getCartID) {
      const cartID = await axios.get('https://backendapi.turing.com/shoppingcart/generateUniqueId');
      localStorage.setItem('cartId', cartID.data.cart_id);
      this.setState({ cart_id: cartID.data.cart_id })
    } else {
      const response = await axios.get(`https://backendapi.turing.com/shoppingcart/${getCartID}`);
      const totalPrice = await axios.get(`https://backendapi.turing.com/shoppingcart/totalAmount/${getCartID}`);
      const namesOfItemsInCart = response.data.map(item => item.name);
      this.setState({ cart_id: getCartID, productIncart: response.data, total_price: totalPrice.data.total_amount, itemsInCartName: namesOfItemsInCart })
    }
    this.setState({ product: response.data, thumbnail: response.data.thumbnail, isLoading: false })
  }

  setSize = (size) => {
    this.setState({ size });
  }

  setQuantity = (type) => {
    const { quantity } = this.state;
    if (type === 'decrement' && quantity > 1) {
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
    this.setState({ disableButton: true })
    const { cart_id, product, size, color, quantity } = this.state;
    const { toastManager } = this.props;
    const data = { cart_id, product_id: product.product_id, attributes: `${size}, ${color}` };
    try {
      const getCartID = await localStorage.getItem('cartId');
      const shoppingCartItems = await axios.post('https://backendapi.turing.com/shoppingcart/add', data);
      const lastItem = shoppingCartItems.data[shoppingCartItems.data.length - 1];
      const updateData = { quantity };
      const updateQuantity = await axios.put(`https://backendapi.turing.com/shoppingcart/update/${lastItem.item_id}`, updateData);
      const totalPrice = await axios.get(`https://backendapi.turing.com/shoppingcart/totalAmount/${getCartID}`);
      const namesOfItemsInCart = updateQuantity.data.map(item => item.name);
      this.setState({ productIncart: updateQuantity.data, total_price: totalPrice.data.total_amount, isModalOpen: true, disableButton: false, itemsInCartName: namesOfItemsInCart })
    } catch (error) {
      toastManager.add('An error occurred', { appearance: 'error', autoDismiss: true })
    }
  }

  setRating = (newRating, name) => {
    this.setState({ reviewRating: newRating })
  }

  setReview = (event) => {
    const inputValue = event.target.value;
    this.setState({ reviewString: inputValue });
  }

  setNickname = (event) => {
    const inputValue = event.target.value;
    this.setState({ nickname: inputValue })
  }

  submitReview = async() => {
    this.setState({ disableReviewButton: true })
    const { match: { params: { id } }, toastManager } = this.props;
    const { reviewString, reviewRating, reviews } = this.state;
    const user = await localStorage.getItem('user');
    const parsedUser = JSON.parse(user);
    const data = { product_id: id, review: reviewString, rating: Number(reviewRating) };
    try {
      const url = `https://backendapi.turing.com/products/${id}/reviews`;
      const options = {
        method: 'POST',
        url,
        data,
        headers: {
          'USER-KEY': `${parsedUser.accessToken}`,
          'Content-type': 'application/json'
        }
      }
      await axios(options);
      const newReviewData = {
        name: parsedUser.customer.name,
        review: reviewString,
        rating: Number(reviewRating),
        created_on: new Date()
      }
      toastManager.add('Review added successfully', { appearance: 'success' })
      const newReviewsInState = [newReviewData, ...reviews];
      this.setState({ reviews: newReviewsInState, reviewString: '', nickname: '', disableReviewButton: false });
    } catch (error) {
      toastManager.add('Error while adding review', { appearance: 'error', autoDismiss: true })
    }
  }

  toggleModalVisibility = (isModalOpen) => {
    this.setState({ isModalOpen });
  }

  renderModal = () => {
    const { isModalOpen } = this.state;
    const { history } = this.props;
    return (
      <Modal isOpen={isModalOpen} toggle={() => this.toggleModalVisibility(false)}>
        <ModalHeader>Checkout</ModalHeader>
        <ModalBody>
          Product added to your cart.
        </ModalBody>
        <ModalFooter>
          <button
            style={{
              height: 40,
              width: 250,
              backgroundColor: '#f7436b',
              borderRadius: 20,
              color: '#FFF',
              borderColor: '#f7436b',
              boxShadow: '0.5rem 0.5rem 3rem rgba(0,0,0,0.2)',
              fontFamily: 'Montserrat'
            }}
            onClick={() => {
              this.toggleModalVisibility(false);
              history.push('/');
              }}
          >
            Continue Shopping
          </button>
          <button
            style={{
              height: 40,
              width: 150,
              backgroundColor: '#f7436b',
              borderRadius: 20,
              color: '#FFF',
              borderColor: '#f7436b',
              boxShadow: '0.5rem 0.5rem 3rem rgba(0,0,0,0.2)',
              fontFamily: 'Montserrat'
            }}
            onClick={() => history.push('/cart')}
          >
            Go to cart
          </button>
        </ModalFooter>
      </Modal>
    )
  }

  render() {
    const {
      product: {
        description,
        image,
        image_2,
        price,
        name
      },
      quantity,
      thumbnail,
      color,
      size,
      isLoading,
      productIncart,
      total_price,
      totalRating,
      reviews,
      reviewRating,
      disableButton,
      isUserLoggedIn,
      disableReviewButton,
      itemsInCartName
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
        <div className="single-products-container">
          <div className="image-wrapper-container">
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
                className="responsive-style-image"
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
                className="responsive-style-image"
                onClick={() => this.changeMainImage(image_2)}
              />}
            </div>
          </div>
          <div className="single-product-detail">
            <span style={{ color: '#A9A9A9', fontFamily: 'Montserrat' }}>Home</span>
            <span style={{ marginLeft: 5, marginRight: 5, color: '#A9A9A9', fontSize: 7 }}>&#9830;</span>
            <span style={{ color: '#A9A9A9', fontFamily: 'Montserrat' }}>All categories</span>
            <span style={{ marginLeft: 5, marginRight: 5, color: '#A9A9A9', fontSize: 7 }}>&#9830;</span>
            <span style={{ color: '#A9A9A9', fontFamily: 'Montserrat' }}>Men's Clothing & Accessories</span>
            <div>
              <StarRatings
                numberOfStars={5}
                rating={Number(totalRating)}
                starRatedColor="#FFA500"
                starDimension="25px"
                starSpacing="5px"
              />
            </div>
            <p style={{
              marginTop: 10,
              fontFamily: 'Montserrat',
              fontWeight: 'bold',
              }}
              >{description}</p>
            <p style={{ color: 'red', fontWeight: 'bold', fontFamily: 'Montserrat' }}>${price}</p>
            <div>
              <p style={{ fontFamily: 'Montserrat' }}>Color</p>
              <div style={{ display: 'flex' }}>
                <div style={{
                  backgroundColor: 'red',
                  boxShadow: color === 'red' ? '0 0px 2px 4px rgb(16,114,181)' : '',
                }}
                className="color-choice"
                  onClick={() => this.setColor('red')}
                />
                <div
                  style={{
                  backgroundColor: 'blue',
                  marginLeft: 15,
                  boxShadow: color === 'blue' ? '0 0px 2px 4px rgb(16,114,181)' : '',
                }}
                  className="color-choice"
                  onClick={() => this.setColor('blue')}
                />
                <div
                  style={{
                  backgroundColor: 'green',
                  marginLeft: 15,
                  boxShadow: color === 'green' ? '0 0px 2px 4px rgb(16,114,181)' : '',
                }}
                  className="color-choice"
                  onClick={() => this.setColor('green')}
                />
                <div
                  style={{
                  backgroundColor: 'orange',
                  marginLeft: 15,
                  boxShadow: color === 'orange' ? '0 0px 2px 4px rgb(16,114,181)' : '',
                }}
                  className="color-choice"
                  onClick={() => this.setColor('orange')}
                />
                <div
                  style={{
                  backgroundColor: 'purple',
                  marginLeft: 15,
                  boxShadow: color === 'purple' ? '0 0px 2px 4px rgb(16,114,181)' : '',
                }}
                  className="color-choice"
                  onClick={() => this.setColor('purple')}
                />
              </div>
            </div>
            <div style={{ marginTop: 10 }}>
              <p style={{ fontFamily: 'Montserrat' }}>Size</p>
              <div style={{ display: 'flex' }}>
                <p style={{
                  backgroundColor: size === 'S' ? 'red' : '#DCDCDC',
                  color: size === 'S' ? '#FFF' : 'black',
                }}
                className="size-style-left"
                onClick={() => this.setSize('S')}
                >S</p>
                <p style={{
                  backgroundColor: size === 'M' ? 'red' : '#DCDCDC',
                  color: size === 'M' ? '#FFF' : 'black',
                }}
                className="size-style"
                onClick={() => this.setSize('M')}
                >M</p>
                <p style={{
                  backgroundColor: size === 'L' ? 'red' : '#DCDCDC',
                  color: size === 'L' ? '#FFF' : 'black',
                }}
                className="size-style"
                onClick={() => this.setSize('L')}
                >L</p>
                <p style={{
                  backgroundColor: size === 'XL' ? 'red' : '#DCDCDC',
                  color: size === 'XL' ? '#FFF' : 'black',
                }}
                className="size-style"
                onClick={() => this.setSize('XL')}
                >XL</p>
                <p style={{
                  backgroundColor: size === 'XXL' ? 'red' : '#DCDCDC',
                  color: size === 'XXL' ? '#FFF' : 'black',
                }}
                className="size-style"
                onClick={() => this.setSize('XXL')}
                >XXL</p>
              </div>
            </div>
            <div>
              <p style={{ fontFamily: 'Montserrat' }}>Quantity</p>
              <div style={{ display: 'flex' }}>
              <div style={{
                  width: 20,
                  height: 20,
                  backgroundColor: '#D3D3D3',
                  borderRadius: '50%',
                  textAlign: 'center',
                  marginRight: 10,
                  cursor: 'pointer'
                }}>
                  <p
                    style={{ marginTop: -3 }}
                    onClick={() => this.setQuantity('decrement')}
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
                  marginRight: 10,
                  fontFamily: 'Montserrat'
                }}>{quantity}</p>
                <div style={{
                  width: 20,
                  height: 20,
                  backgroundColor: '#D3D3D3',
                  borderRadius: '50%',
                  textAlign: 'center',
                  marginRight: 10,
                  cursor: 'pointer'
                }}>
                  <p
                    style={{ marginTop: -3 }}
                    onClick={() => this.setQuantity('increment')}
                  >
                    +
                  </p>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', marginTop: 15 }}>
              <button
                style={{
                  height: 40,
                  width: itemsInCartName.includes(name) ? 200 : 150,
                  backgroundColor: disableButton || itemsInCartName.includes(name) ? 'gray' : '#f7436b',
                  borderRadius: 20,
                  color: '#FFF',
                  borderColor: itemsInCartName.includes(name) || disableButton ? 'gray' : '#f7436b',
                  boxShadow: '0.5rem 0.5rem 3rem rgba(0,0,0,0.2)',
                  fontFamily: 'Montserrat',
                  cursor: disableButton || itemsInCartName.includes(name) ? 'not-allowed' : 'pointer'
                }}
                onClick={this.addToCart}
                disabled={disableButton}
              >
                {disableButton ? '....'
                  : !disableButton && itemsInCartName.includes(name) ? 'Item added to cart'
                  : 'Add to cart'
                  }
              </button>
              <div style={{
                marginLeft: 'auto',
                display: 'flex',
                marginTop: 5
                }}
                >
                <i className="far fa-heart" style={{
                  marginRight: 10,
                  color: '#f7436b',
                  marginTop: 5,
                  cursor: 'pointer'
                }}></i>
                <p style={{ color: '#A9A9A9', fontFamily: 'Montserrat' }}>Add to wishlist</p>
              </div>
            </div>
          </div>
        </div>
        <div className="reviews-container">
          <div style={{
            maxHeight: 400,
            overflowY: 'scroll',
          }}>
            <h5 style={{ marginBottom: 20, fontFamily: 'Montserrat' }}>Product Reviews</h5>
            {
              reviews.map((review, index) => (
                <div key={index} style={{ display: 'flex' }}>
                  <div>
                    <StarRatings
                      numberOfStars={5}
                      rating={Number(review.rating)}
                      starRatedColor="#FFA500"
                      starDimension="15px"
                      starSpacing="5px"
                    />
                    <p style={{
                      marginTop: 20,
                      fontWeight: 'bold',
                      fontFamily: 'Montserrat'
                    }}>{review.name}</p>
                    <p style={{
                      marginTop: -15,
                      fontSize: 12,
                      color: '#A9A9A9',
                      fontFamily: 'Montserrat'
                    }}>{moment(review.created_on).startOf('day').fromNow()}</p>
                  </div>
                  <p style={{ marginLeft: 200, marginTop: 5, fontFamily: 'Montserrat' }}>{review.review}</p>
                </div>
              ))
            }
          </div>
          <hr />
            {isUserLoggedIn && (
              <div>
                <h5 style={{ fontFamily: 'Montserrat', marginTop: 25 }}>Add a Review</h5>
                <div className="star-wrapper">
                  <label style={{ fontFamily: 'Montserrat' }}>Choose a nickname</label>
                  <input
                    type="text"
                    name="nickname"
                    value={this.state.nickname}
                    onChange={this.setNickname}
                    className="input-text-style"
                  />
                </div>
                <div className="star-wrapper">
                  <label style={{ fontFamily: 'Montserrat' }}>Your review</label>
                  <Input
                    type="textarea"
                    name="text"
                    id="text"
                    onChange={this.setReview}
                    value={this.state.reviewString}
                    className="input-text-box-style"
                  />
                </div>
                <div className="star-wrapper">
                  <p style={{ fontFamily: 'Montserrat' }}>Overall rating</p>
                  <div className="star-rating-style">
                    <StarRatings
                      numberOfStars={5}
                      rating={Number(reviewRating)}
                      starRatedColor="#FFA500"
                      starHoverColor="#FFA500"
                      starDimension="20px"
                      starSpacing="5px"
                      name="review"
                      changeRating={this.setRating}
                    />
                  </div>
                </div>
                <button style={{
                  backgroundColor: disableReviewButton ? 'gray' : '#f7436b',
                  boxShadow: '0.5rem 0.5rem 3rem rgba(0,0,0,0.2)',
                  cursor: disableReviewButton ? 'not-allowed' : 'pointer'
                }}
                className="button-style-review"
                  onClick={this.submitReview}
                >
                  {disableReviewButton ? '.....' : 'Submit'}
                </button>
            </div>
          )}
          {!isUserLoggedIn && <p className="not-logged-in">You need to be logged in to post reviews. <span onClick={() => this.props.history.push('/login')} className="log-in-link">Log in now</span></p>}
          {this.renderModal()}
        </div>
      </div>
    )
  }
}

const SingleProductWithToast = withToastManager(SingleProduct);

export default SingleProductWithToast;
