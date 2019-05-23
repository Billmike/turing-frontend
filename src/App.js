import React from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import Homepage from './Home';
import SingleProduct from './SingleProduct';
import Signup from './Signup';
import Login from './Login';
import Cart from './Cart';
import './App.css';

function App() {
  return (
    <>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route path="/product/:id" component={SingleProduct} />
          <Route path="/signup" component={Signup} />
          <Route path="/login" component={Login} />
          <Route path="/cart" component={Cart} />
        </Switch>
      </BrowserRouter>
    </>
  );
}

export default App;
