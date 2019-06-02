import React, { Component } from 'react';

export default (ComposedComponent) => {
  class RequireAuth extends Component {
    async componentWillMount() {
      const userData = await localStorage.getItem('user');
      if (!userData) {
        this.props.history.push('/');
      }
    }

    render() {
      return (
        <ComposedComponent {...this.props} />
      )
    }
  }

  return RequireAuth;
}
