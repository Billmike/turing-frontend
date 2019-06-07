import React from 'react';
import { Switch, Route, BrowserRouter, HashRouter } from 'react-router-dom';
import Homepage from './Home';
import SingleProduct from './SingleProduct';
import Signup from './Signup';
import Login from './Login';
import Cart from './Cart';
import UserInformation from './UserInformation';
import Checkout from './Checkout';
import RequireAuth from './utils/RequireAuth';
import OrderConfirmation from './OrderConfirmation';
import NotFoundPage from './NotFoundPage';
import UserProfile from './UserProfile';
import { toast } from 'react-toastify';
import { ToastProvider } from 'react-toast-notifications';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

toast.configure();

function App() {
  return (
    <HashRouter>
      <ToastProvider>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={Homepage} />
            <Route path="/product/:id" component={SingleProduct} />
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/cart" component={Cart} />
            <Route path="/checkout" component={RequireAuth(Checkout)} />
            <Route path="/confirm" component={RequireAuth(OrderConfirmation)} />
            <Route path="/user" component={RequireAuth(UserProfile)} />
            <Route path="/edit-profile" component={RequireAuth(UserInformation)} />
            <Route component={NotFoundPage} />
          </Switch>
        </BrowserRouter>
      </ToastProvider>
    </HashRouter>
  );
}

export default App;
