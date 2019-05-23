import React, { Component } from 'react';
import axios from 'axios';
import './style.css';

class Login extends Component {
  state = {
    email: '',
    password: ''
  }

  setUserData = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  loginUser = async () => {
    const { email, password } = this.state;
    const { history } = this.props;
    const data = { email, password };
    try {
      const response = await axios.post('https://backendapi.turing.com/customers/login', data);
      const stringifyResponse = JSON.stringify(response.data);
      localStorage.setItem('user', stringifyResponse);
      history.push('/');
    } catch (error) {
      console.log('error', error);
    }
  }

  render() {
    const { history } = this.props;
    return (
      <div>
        <div className="container">
          <h5 className="sign-up-text">Login</h5>
          <div className="input-field-wrapper">
            <label className="label">Email</label>
            <input
              name="email"
              placeholder="Enter your email"
              type="email"
              className="input-field"
              onChange={this.setUserData}
            />
          </div>
          <div className="input-field-wrapper">
            <label className="label">Password</label>
            <input
              name="password"
              placeholder="Enter your password"
              type="password"
              className="input-field"
              onChange={this.setUserData}
            />
          </div>
          <p>New to our platform?
            <span
              onClick={() => history.push('/signup')}
              style={{ color: '#de3624', cursor: 'pointer', marginLeft: 5 }}>
              Sign up
            </span>
          </p>
          <button
            className="button-class"
            onClick={this.loginUser}
          >
            Login
          </button>
        </div>
      </div>
    )
  }
}

export default Login;
