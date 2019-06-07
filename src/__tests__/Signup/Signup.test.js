import React from 'react';
import { shallow, mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { Signup } from '../../Signup';

const script = document.createElement('script');
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);

describe('<Signup />', () => {
  const props = {
    history: {
      location: {
        pathname: ''
      }
    }
  }
  it('renders without crashing', () => {
    const wrapper = mount(<Signup {...props} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('should set the email to be the value entered on input change', () => {
    const value = 'randomemail@gmail.com';
    const wrapper = mount(<Signup {...props} />);
    wrapper.find('#email').at(0).simulate('change', {
      target: {
        name: 'email',
        value
      }
    });
    expect(wrapper.state('email')).toBe(value);
  });

  it('should set the password to be the value entered on input change', () => {
    const value = 'qwertyuiop';
    const wrapper = mount(<Signup {...props} />);
    wrapper.find('#password').at(0).simulate('change', {
      target: {
        name: 'password',
        value
      }
    });
    expect(wrapper.state('password')).toBe(value);
  });

  it('should set the name to be the value entered on input change', () => {
    const value = 'testname';
    const wrapper = mount(<Signup {...props} />);
    wrapper.find('#name').at(0).simulate('change', {
      target: {
        name: 'name',
        value
      }
    });
    expect(wrapper.state('name')).toBe(value);
  });

  it('render errors if we submit without passing values', () => {
    const wrapper = mount(<Signup {...props} />);
    wrapper.find('.form-class').at(0).simulate('submit');
    expect(wrapper.state('errors')).toBeTruthy();
  })
});
