import React, { Component } from 'react';
import axios from 'axios';
import toastr from 'toastr';
import { Button, Form, FormGroup, Label, Input, FormText, Alert } from 'reactstrap';
import FacebookLogin from 'react-facebook-login';
import { withToastManager } from 'react-toast-notifications'
import Navbar from '../Navbar';
import { validateSignup } from '../utils/validator';
import '../utils/toastrconfig';
import './style.scss';

export class Signup extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    errors: {

    },
    cart_id: '',
    productIncart: [],
    total_price: '0.00',
    isLoggedIn: false,
    disabledButton: false
  }

  async componentDidMount() {
    const getCartID = await localStorage.getItem('cartId');
    if (!getCartID) {
      const cartID = await axios.get('https://backendapi.turing.com/shoppingcart/generateUniqueId');
      localStorage.setItem('cartId', cartID.data.cart_id);
      this.setState({ cart_id: cartID.data.cart_id })
    } else {
      const response = await axios.get(`https://backendapi.turing.com/shoppingcart/${getCartID}`);
      const totalPrice = await axios.get(`https://backendapi.turing.com/shoppingcart/totalAmount/${getCartID}`);
      this.setState({ cart_id: getCartID, productIncart: response.data, total_price: totalPrice.data.total_amount })
    }
  }

  setUserData = (event) => {
    const { errors } = this.state;
    const newErrors = { ...errors, [event.target.name]: '' };
    this.setState({ [event.target.name]: event.target.value, errors: newErrors })
  }

  signUpUser = async (event) => {
    event.preventDefault();
    this.setState({ disabledButton: true })
    const { name, email, password } = this.state;
    const { history, toastManager } = this.props;
    const { errors, isValid } = validateSignup(name, email, password);

    if (!isValid) {
      return this.setState({ errors, disabledButton: false });
    }

    const data = { name, email, password };
    try {
      const response = await axios.post('https://backendapi.turing.com/customers', data);
      const saveUserData = JSON.stringify(response.data);
      localStorage.setItem('user', saveUserData);
      this.setState({ disabledButton: false })
      history.push('/');
      toastManager.add('Signup successful!', { appearance: 'success', autoDismiss: true });
    } catch (error) {
      if (error.response.data.error) {
        toastManager.add(`${error.response.data.error.message}`, { appearance: 'error', autoDismiss: true } );
        this.setState({ errors: {}, disabledButton: false });
      } else {
        toastManager.add('Unable to signup at this moment', { appearance: 'error', autoDismiss: true });
        this.setState({ errors: {}, disabledButton: false });
      }
    }
  }

  componentClicked = () => console.log('Clicked it')

  responseFacebook = async(response) => {
    const { history, toastManager } = this.props;
    const url = 'https://backendapi.turing.com/customers/facebook';
    const options = {
      url,
      data: {
        access_token: response.accessToken
      },
      method: 'POST',
    }
    try {
      const loginFacebook = await axios(options);
      const saveUserData = JSON.stringify(loginFacebook.data);
      localStorage.setItem('user', saveUserData);
      history.push('/');
      toastManager.add('Signup successful!', { appearance: 'success' })
    } catch (error) {
      if (error.response.data.error) {
        toastManager.add(`${error.response.data.error.message}`, { appearance: 'error', autoDismiss: true } );
      } else {
        toastManager.add('Unable to signup with Facebook at this moment', { appearance: 'error', autoDismiss: true });
      }
    }
  }

  render() {
    let fbContent;
    const { history } = this.props;
    const { errors, productIncart, total_price, isLoggedIn, disabledButton } = this.state;
    if (isLoggedIn) {

    } else {
      fbContent = (
        <FacebookLogin
          appId="352854622106208"
          fields="name,email,picture"
          onClick={() => this.componentClicked()}
          callback={(response) => this.responseFacebook(response)}
          cssClass="kep-login-facebook metro"
          />
      )
    }
    return (
      <div>
        <Navbar
          history={history}
          productIncart={productIncart}
          cartPrice={total_price}
        />
        <div className="signup-container">
          <h5 className="sign-up-text">Sign up</h5>
          <Form className="form-class">
        <FormGroup>
          <Label for="exampleEmail">Name</Label>
          <Input
            type="text"
            name="name"
            id="name"
            placeholder="Name"
            onChange={this.setUserData}
            className={errors.name ? 'error-input-field' : ''}
          />
          {errors.name && <p className="error-text">{errors.name}</p>}
        </FormGroup>
        <FormGroup>
          <Label for="exampleEmail">Email</Label>
          <Input
            className={errors.email ? 'error-input-field' : ''}
            type="email"
            name="email"
            id="email"
            placeholder="Email"
            onChange={this.setUserData}
            />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </FormGroup>
        <FormGroup>
          <Label for="examplePassword">Password</Label>
          <Input
            className={errors.password ? 'error-input-field' : ''}
            type="password"
            name="password"
            id="password"
            placeholder="Password"
            onChange={this.setUserData}
            />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </FormGroup>
        <p className="new-account">Already have an account?
            <span
              onClick={() => history.push('/login')}
              style={{ color: '#de3624', cursor: 'pointer', marginLeft: 5 }}>
              Login
            </span>
          </p>
          <button
            className="signup-button-class"
            onClick={this.signUpUser}
            disabled={disabledButton}
          >
            {disabledButton ? '....' : 'Register'}
          </button>
          <p className="or">Or</p>
          <div style={{ alignSelf: 'center' }}>
            {fbContent}
          </div>
      </Form>
        </div>
      </div>
    )
  }
}

const SignupWithToast = withToastManager(Signup);

export default SignupWithToast;
