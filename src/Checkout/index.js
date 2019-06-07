import React, { Component } from 'react';
import axios from 'axios';
import toastr from 'toastr';
import StripeCheckout from 'react-stripe-checkout';
import { withToastManager } from 'react-toast-notifications';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { validateProfile } from '../utils/validator';
import Navbar from '../Navbar';
import Spinner from '../Spinner';
import '../utils/toastrconfig';
import './styles.scss';

const REGIONS = {
  2: 'US/Canada',
  3: 'Europe',
  4: 'Rest of the World'
};

export class Checkout extends Component {
  state = {
    productIncart: [],
    total_price: '0.00',
    cartID: '',
    isLoading: false,
    regions: [],
    userObj: {},
    orderId: 0,
    isButtonDisabled: true,
  }

  async componentDidMount() {
    this.setState({ isLoading: true })
    const getCartID = await localStorage.getItem('cartId');
    const accessToken = await localStorage.getItem('user');
    if (accessToken) {
      const parsedAccessToken = JSON.parse(accessToken);
      try {
        const retrieveUser = await axios.get('https://backendapi.turing.com/customer', {
          headers: {
            'USER-KEY': `${parsedAccessToken.accessToken}`,
            'Content-type': 'application/json'
          }
        });
        const regionsData = await axios.get('https://backendapi.turing.com/shipping/regions');
        this.setState({ userObj: retrieveUser.data, regions: regionsData.data })
      } catch (error) {
        console.log('error retrieving user', error)
      }
    }
    if (!getCartID) {
      this.setState({ productIncart: [], isLoading: false })
    } else {
      const cartItem = await axios.get(`https://backendapi.turing.com/shoppingcart/${getCartID}`);
      const totalPrice = await axios.get(`https://backendapi.turing.com/shoppingcart/totalAmount/${getCartID}`)
      this.setState({ productIncart: cartItem.data, total_price: totalPrice.data.total_amount, isLoading: false });
    }
  }

  updateUserValue = (event) => {
    const { userObj } = this.state;
    const userFieldName = event.target.name;
    const newUser = { ...userObj, [userFieldName]: event.target.value }
    this.setState({ userObj: newUser })
  }

  setRegionAndRegionID = (event) => {
    const { userObj } = this.state;
    const regionValue = REGIONS[event.target.value];
    const newUser = { ...userObj, region: regionValue, shipping_region_id: Number(event.target.value) };
    this.setState({ userObj: newUser, regionId: event.target.value })
  }

  getToken = async(token) => {
    const getCartID = await localStorage.getItem('cartId');
    const { history, toastManager } = this.props;
    const { orderId, total_price } = this.state;
    const approximateAmount = Math.round(Number(total_price));
    const data = {
      stripeToken: token.id,
      order_id: orderId,
      amount: approximateAmount,
      description: 'An order from Shopmate ventures'
    }

    try {
      const url = 'https://backendapi.turing.com/stripe/charge';
      const options = {
        url,
        data,
        method: 'POST'
      };
      await axios(options);
      const cartItem = await axios.get(`https://backendapi.turing.com/shoppingcart/${getCartID}`);
      const totalPrice = await axios.get(`https://backendapi.turing.com/shoppingcart/totalAmount/${getCartID}`);
      this.setState({ productIncart: cartItem.data, total_price: totalPrice.data.total_price });
      history.push('/confirm');
      toastManager.add('Order created successfully', { appearance: 'success', autoDismiss: true });
    } catch (error) {
      toastManager.add('An error occurred.', { appearance: 'error', autoDismiss: true });
    }
  }

  placeOrder = async() => {
    const getCartID = await localStorage.getItem('cartId');
    const accessToken = await localStorage.getItem('user');
    const parsedAccessToken = JSON.parse(accessToken);
    const { userObj: { shipping_region_id, address_1, address_2 }, total_price } = this.state;
    const { toastManager } = this.props;
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
      const fullAddress = address_2 ? `${address_1} ${address_2}` : `${address_1}`;
      const postOrder = await axios(options);
      await localStorage.setItem('orderId', JSON.stringify(postOrder.data.orderId));
      await localStorage.setItem('address', fullAddress);
      this.setState({ orderId: postOrder.data.orderId });
    } catch (error) {
      toastManager.add('An error occurred.', { appearance: 'error', autoDismiss: true });
    }
  }

  validateUserProfile = () => {
    const { userObj: { address_1, city, region, postal_code, country } } = this.state;
    const dataToValidate = { address_1: address_1 || '', city: city || '', region: region || '', postal_code: postal_code || '', country: country || '' };
    const { isValid } = validateProfile(dataToValidate);
    return !isValid;
  }

  render() {
    const {
      productIncart,
      total_price,
      isLoading,
      regions,
      userObj: {
        address_1,
        address_2,
        city,
        country,
        shipping_region,
        postal_code,
        region
      } } = this.state;
    const { history } = this.props;
    const stripePrice = Number(total_price) * 100;
    const payWithCardButtonDisabled = this.validateUserProfile();

    if (isLoading) {
      return <Spinner />
    }

    return (
      <div>
        <Navbar
          history={history}
          cartPrice={total_price}
          productIncart={productIncart}
        />
        <div className="form-container-billing">
          <h5 className="billing-text">Billing Details</h5>
          <Form>
          <FormGroup>
            <Label for="exampleEmail">Address 1</Label>
            <Input
              value={address_1 || ""}
              type="text"
              name="address_1"
              id="address_1"
              placeholder="Address 1"
              onChange={this.updateUserValue}
              />
          </FormGroup>
          <FormGroup>
            <Label for="examplePassword">Address 2</Label>
            <Input
              value={address_2 || ""}
              type="text"
              name="address_2"
              id="address_2"
              placeholder="Address 2"
              onChange={this.updateUserValue}
              />
          </FormGroup>
          <FormGroup>
            <Label for="examplePassword">City</Label>
            <Input
              value={city || ""}
              type="text"
              name="city"
              id="city"
              placeholder="City"
              onChange={this.updateUserValue}
              />
          </FormGroup>
          <FormGroup>
            <Label for="exampleSelect">Region</Label>
            <Input
              type="select"
              name="region"
              id="region"
              onChange={this.setRegionAndRegionID}
            >
              {
                regions && regions.map((regional, index) => (
                  <option value={regional.shipping_region_id} key={index}>
                    {regional.shipping_region}
                  </option>
                ))
              }
            </Input>
          </FormGroup>
          <FormGroup>
            <Label for="examplePassword">Postal Code</Label>
            <Input
              value={postal_code || ""}
              type="text" name="postal_code" id="postal_code" placeholder="Postal Code" onChange={this.updateUserValue} />
          </FormGroup>
          <FormGroup>
            <Label for="examplePassword">Country</Label>
            <Input
              value={country || ""}
              type="text" name="country" id="country" placeholder="Country" onChange={this.updateUserValue} />
          </FormGroup>
          </Form>
          <div onClick={() => this.placeOrder()} className={payWithCardButtonDisabled ? "stripe-checkout-button-disabled" : ""}>
            <StripeCheckout
              token={this.getToken}
              stripeKey="pk_test_NcwpaplBCuTL6I0THD44heRe"
              amount={stripePrice}
              name="SHOPMATE INC."
              label={payWithCardButtonDisabled ? "Fill in all required fields to proceed" : "Pay with your card"}
            />
          </div>
        </div>
      </div>
    )
  }
}

const CheckoutWithToast = withToastManager(Checkout);

export default CheckoutWithToast;
