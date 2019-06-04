import React from 'react';
import { shallow, mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { Login } from '../../Login';

const script = document.createElement('script');
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);
describe('<Login />', () => {
  const props = {
    history: {
      location: {
        pathname: ''
      }
    }
  }
  it('renders without crashing', () => {
    const wrapper = mount(<Login {...props} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('should set the email to be the value entered on input change', () => {
    const value = 'randomemail@gmail.com';
    const wrapper = mount(<Login { ...props } />);
    wrapper.find('#email').at(0).simulate('change', {
      target: {
        name: 'email',
        value
      }
    });
    expect(wrapper.state('email')).toBe(value);
  });

  it('should set the password to be the value entered on input change', () => {
    const value = 'randompassword';
    const wrapper = mount(<Login {...props} />);
    wrapper.find('#password').at(0).simulate('change', {
      target: {
        name: 'password',
        value
      }
    });
    expect(wrapper.state('password')).toBe(value);
  })
});
