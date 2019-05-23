import React, { Component } from 'react';
import axios from 'axios';
import './style.css';

class Signup extends Component {
  state = {
    name: '',
    email: '',
    password: ''
  }

  setUserData = (event) => {
    this.setState({ [event.target.name]: event.target.value })
  }

  signUpUser = async () => {
    const { name, email, password } = this.state;
    const { history } = this.props;
    const data = { name, email, password };
    try {
      const response = await axios.post('https://backendapi.turing.com/customers', data);
      console.log('signup response', response);
      const saveUserData = JSON.stringify(response.data);
      localStorage.setItem('user', saveUserData);
      history.push('/');
    } catch (error) {
      console.log('error', error)
    }
  }

  render() {
    const { history } = this.props;
    return (
      <div>
        <div className="container">
          <h5 className="sign-up-text">Sign up</h5>
          <div className="input-field-wrapper">
            <label className="label">Name</label>
            <input
              name="name"
              className="input-field"
              placeholder="Enter your Name"
              onChange={this.setUserData}
            />
          </div>
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
          <p>Already have an account?
            <span
              onClick={() => history.push('/login')}
              style={{ color: '#de3624', cursor: 'pointer', marginLeft: 5 }}>
              Login
            </span>
          </p>
          <button
            className="button-class"
            onClick={this.signUpUser}
          >
            Register
          </button>
        </div>
      </div>
    )
  }
}

export default Signup;
