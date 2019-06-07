import React from 'react';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { Checkout } from '../../Checkout';

describe('<Checkout />', () => {
  const props = {
    history: {
      location: {
        pathname: ''
      }
    }
  }
  const wrapper = mount(<Checkout {...props} />);

  it('should render without crashing', () => {
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('should update the user\'s address information', () => {
    wrapper.setState({ isLoading: false });
    const value = "No 1, Birmingham Street";
    wrapper.find('#address_1').at(0).simulate('change', {
      target: {
        name: 'address_1',
        value
      }
    });
    const newUser = { address_1: value }
    expect(wrapper.state('userObj')).toEqual(newUser);
  });
});
