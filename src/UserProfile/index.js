import React, { Component } from 'react';
import axios from 'axios';
import { withToastManager } from 'react-toast-notifications';
import Spinner from '../Spinner';
import Navbar from '../Navbar';
import './styles.scss';

export class UserProfile extends Component {
  state = {
    productInCart: [],
    total_price: '0.00',
    isLoading: false,
    userObj: {}
  }

  async componentDidMount() {
    this.setState({ isLoading: true });
    const { toastManager, history } = this.props;
    const getUserObject = await localStorage.getItem('user');
    const getCartID = await localStorage.getItem('cartId');
    const parsedUser = JSON.parse(getUserObject);

    try {
      const retrievedUser = await axios.get('https://backendapi.turing.com/customer', {
        headers: {
          'USER-KEY': `${parsedUser.accessToken}`,
          'Content-type': 'application/json'
        }
      });
      if (!getCartID) {
        this.setState({ productInCart: [] });
      } else {
        const cartItem = await axios.get(`https://backendapi.turing.com/shoppingcart/${getCartID}`);
        const totalPrice = await axios.get(`https://backendapi.turing.com/shoppingcart/totalAmount/${getCartID}`)
        this.setState({ productInCart: cartItem.data, total_price: totalPrice.data.total_amount });
      }
      this.setState({ userObj: retrievedUser.data, isLoading: false })
    } catch (error) {
      toastManager.add('Unable to retrieve user details', { appearance: 'error', autoDismiss: true });
      history.push('/');
    }
  }

  render() {
    const {
      productInCart,
      total_price,
      isLoading,
      userObj: {
        address_1,
        address_2,
        city,
        region,
        postal_code,
        country
      }
    } = this.state;
    const { history } = this.props;

    if (isLoading) {
      return <Spinner />
    }

    return (
      <div>
        <Navbar
          productIncart={productInCart}
          cartPrice={total_price}
          history={history}
        />
        <div className="profile-user-container">
          <h5>User Profile</h5>
          <hr />
          <div className="fields-wrapper-container">
            <div>
              <p className="bold-table-header">Address 1</p>
              <p className="opaque-field-values">{address_1 || 'Fill in your address'}</p>
            </div>
            <div className="left-field-auto">
              <p className="bold-table-header">Address 2</p>
              <p className="opaque-field-values">{address_2 || 'Tell us where you are from'}</p>
            </div>
          </div>
          <div className="fields-wrapper-container">
            <div>
              <p className="bold-table-header">City</p>
              <p className="opaque-field-values">{city || 'Fill in your city'}</p>
            </div>
            <div className="left-field-auto">
              <p className="bold-table-header">Region</p>
              <p className="opaque-field-values">{region || 'Tell us where you are from'}</p>
            </div>
          </div>
          <div className="fields-wrapper-container">
            <div>
              <p className="bold-table-header">Postal Code</p>
              <p className="opaque-field-values">{postal_code || 'What\'s your postal code?'}</p>
            </div>
            <div className="left-field-auto">
              <p className="bold-table-header">Country</p>
              <p className="opaque-field-values">{country || 'Tell us where you are from'}</p>
            </div>
          </div>
          <div onClick={() => history.push('/edit-profile')} className="edit-button-style">
            <i class="far fa-edit"></i>
          </div>
        </div>
      </div>
    )
  }
}

const UserProfileWithToast = withToastManager(UserProfile);

export default UserProfileWithToast;
