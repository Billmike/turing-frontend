import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import axios from 'axios';
import toastr from 'toastr';
import Navbar from '../Navbar';
import { withToastManager } from 'react-toast-notifications';
import { validateProfile } from '../utils/validator';
import './styles.scss';

const REGIONS = {
  2: 'US/Canada',
  3: 'Europe',
  4: 'Rest of the World'
};

export class UserInformation extends Component {
  state = {
    productInCart: [],
    total_price: '',
    userObj: {},
    regions: [],
    regionId: 1,
    errors: {},
    disableButton: false
  }

  async componentDidMount() {
    const getCartID = await localStorage.getItem('cartId');
    const accessToken = await localStorage.getItem('user');
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
      console.error(error)
    }
    if (!getCartID) {
      this.setState({ productInCart: [] })
    } else {
      const cartItem = await axios.get(`https://backendapi.turing.com/shoppingcart/${getCartID}`);
      const totalPrice = await axios.get(`https://backendapi.turing.com/shoppingcart/totalAmount/${getCartID}`)
      this.setState({ productInCart: cartItem.data, total_price: totalPrice.data.total_amount });
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

  updateUserProfile = async() => {
    this.setState({ disableButton: true })
    const { userObj: {
      address_1,
      address_2,
      city,
      region,
      postal_code,
      country,
    shipping_region_id } } = this.state;
      const dataToValidate = {
        address_1,
        address_2,
        city,
        region,
        postal_code,
        country,
      }
    const { toastManager, history } = this.props;
    const { errors, isValid } = validateProfile(dataToValidate);

    if (!isValid) {
      return this.setState({ errors, disableButton: false })
    }

    const accessToken = await localStorage.getItem('user');
    const parsedAccessToken = JSON.parse(accessToken);
    const data = { address_1, address_2, city, region, postal_code, country, shipping_region_id };
    try {
      const url = 'https://backendapi.turing.com/customers/address';
      const options = {
        method: 'PUT',
        headers: {
          'USER-KEY': `${parsedAccessToken.accessToken}`,
          'Content-type': 'application/json'
        },
        data: data,
        url,
      };
      const updatedUser = await axios(options);
      localStorage.setItem('userData', JSON.stringify(updatedUser.data))
      this.setState({ userObj: {}, errors: {}, disableButton: false });
      toastManager.add('Update successful', { appearance: 'success', autoDismiss: true });
      history.push('/user')
    } catch (error) {
      this.setState({ disableButton: false, errors: {} })
      if (error.response.data.error) {
        toastManager.add(`${error.response.data.error.message}`, { appearance: 'error', autoDismiss: true } );
      } else {
        toastManager.add('Unable to update your profile at this moment', { appearance: 'error', autoDismiss: true })
      }
    }
  }

  render() {
    const { productInCart, total_price, regions, userObj, regionId, errors, disableButton } = this.state;
    const { history } = this.props;
    return (
      <div>
        <Navbar
          productIncart={productInCart}
          cartPrice={total_price}
          history={history}
        />
        <Form style={{
          display: 'flex',
          flexDirection: 'column',
          margin: 'auto',
          width: '30%',
          marginTop: 30
        }}>
          <p style={{
            textAlign: 'center',
            fontSize: 20,
            fontWeight: '600'
          }}>User Profile</p>
          <FormGroup>
            <Label className="label-style" for="exampleEmail">Address 1</Label>
            <Input
              onChange={this.updateUserValue}
              value={userObj.address_1 || ''}
              type="text" name="address_1"
              id="address_1"
              placeholder="Address 1"
              className={errors.address_1 ? 'input-field-profile-error' : ''}
              />
            {errors.address_1 && <p className="profile-field-error">Address 1 is required</p>}
          </FormGroup>
          <FormGroup>
            <Label className="label-style" for="examplePassword">Address 2</Label>
            <Input
              className={errors.address_2 ? 'input-field-profile-error' : ''}
              onChange={this.updateUserValue}
              value={userObj.address_2 || ''}
              type="text"
              name="address_2"
              id="address_2"
              placeholder="Address 2"
              />
            {errors.address_2 && <p className="profile-field-error">Address 2 is required</p>}
          </FormGroup>
          <FormGroup>
            <Label className="label-style" for="examplePassword">City</Label>
            <Input
              className={errors.city ? 'input-field-profile-error' : ''}
              onChange={this.updateUserValue}
              value={userObj.city || ''}
              type="text"
              name="city"
              id="city"
              placeholder="City"
              />
            {errors.city && <p className="profile-field-error">City is required</p>}
          </FormGroup>
          <FormGroup>
            <Label className="label-style" for="exampleSelect">Region</Label>
            <Input
              className={errors.region ? 'input-field-profile-error' : ''}
              onChange={this.setRegionAndRegionID}
              type="select"
              name="region"
              id="region"
            >
              {
                regions && regions.map((region, index) => (
                  <option value={region.shipping_region_id} key={index}>
                    {region.shipping_region}
                  </option>
                ))
              }
              {errors.region && <p className="profile-field-error">Region is required.</p>}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label className="label-style" for="examplePassword">Postal Code</Label>
            <Input
              className={errors.address_1 ? 'input-field-profile-error' : ''}
              onChange={this.updateUserValue}
              value={userObj.postal_code || ''}
              type="text"
              name="postal_code"
              id="postal_code"
              placeholder="Postal Code"
              />
            {errors.postal_code && <p className="profile-field-error">Postal code is required</p>}
          </FormGroup>
          <FormGroup>
            <Label className="label-style" for="examplePassword">Country</Label>
            <Input
              className={errors.country ? 'input-field-profile-error' : ''}
              onChange={this.updateUserValue}
              value={userObj.country || ''}
              type="text"
              name="country"
              id="country"
              placeholder="Country"
              />
            {errors.country && <p className="profile-field-error">Country is required.</p>}
          </FormGroup>
          <Button
            className={disableButton ? "update-profile-submit-button-disabled" : "update-profile-submit-button"}
            onClick={this.updateUserProfile}
            disabled={disableButton}
          >
            {disableButton ? '........' : 'Update Profile'}
          </Button>
        </Form>
      </div>
    )
  }
}

const UserInformationWithToast = withToastManager(UserInformation);

export default UserInformationWithToast;
