import React from 'react';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { EditProfile } from '../../EditProfile';

describe('<UserProfile />', () => {
  const props = {
    history: {
      location: {
        pathname: ''
      }
    }
  }
  it('renders without crashing', () => {
    const wrapper = mount(<EditProfile {...props} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('should update the address of the user', () => {
    const value = 'No 1, Birmingham Road';
    const wrapper = mount(<EditProfile {...props} />);
    wrapper.find('#address_2').at(0).simulate('change', {
      target: {
        name: 'address_2',
        value
      }
    });
    const newUser = { address_2: 'No 1, Birmingham Road' }
    expect(wrapper.state('userObj')).toEqual(newUser);
  })
});
