import React, { Component } from 'react';
import axios from 'axios';
import toastr from 'toastr';
import { Button, Form, FormGroup, Label, Input, FormText, Alert } from 'reactstrap';
import Navbar from '../Navbar';
import { withToastManager } from 'react-toast-notifications';
import FacebookLogin from 'react-facebook-login';
import { validateSignin } from '../utils/validator';
import '../utils/toastrconfig';
import './style.scss';

class Login extends Component {
  state = {
    email: '',
    password: '',
    errors: {},
    productIncart: [],
    total_price: '0.00',
    cart_id: '',
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
    const newErrors = { ...errors, [event.target.name]: '' }
    this.setState({ [event.target.name]: event.target.value, errors: newErrors })
  }

  loginUser = async (event) => {
    event.preventDefault();
    this.setState({ disabledButton: true })
    const { email, password } = this.state;
    const { toastManager } = this.props;

    const { errors, isValid } = validateSignin(email, password);

    if (!isValid) {
      return this.setState({ errors, disabledButton: false });
    }

    const { history } = this.props;
    const data = { email, password };
    try {
      const response = await axios.post('https://backendapi.turing.com/customers/login', data);
      const stringifyResponse = JSON.stringify(response.data);
      localStorage.setItem('user', stringifyResponse);
      this.setState({ disabledButton: false })
      history.push('/');
      toastManager.add('Login successful!', { appearance: 'success' });
    } catch (error) {
      toastManager.add('Login error', { appearance: 'error' })
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
      toastManager.add('Login successful', { appearance: 'success' })
    } catch (error) {
      console.log('what is the error', error.response);
      toastManager.add('Signup error', { appearance: 'error' });
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
          appId="466642734096700"
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
        <div className="login-container">
          <h5 className="sign-up-text">Login</h5>
          <Form className="form-class">
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
        <p className="new-account">New to our platform?
            <span
              onClick={() => history.push('/signup')}
              style={{ color: '#de3624', cursor: 'pointer', marginLeft: 5 }}>
              Sign up
            </span>
          </p>
          <button
            className="signup-button-class"
            onClick={this.loginUser}
            disabled={disabledButton}
          >
            {disabledButton ? '.....' : 'Login'}
          </button>
          <p className="or">or</p>
          <div style={{ alignSelf: 'center' }}>
            {fbContent}
          </div>
      </Form>
        </div>
      </div>
    )
  }
}

const LoginFormWithToast = withToastManager(Login);

export default LoginFormWithToast;
