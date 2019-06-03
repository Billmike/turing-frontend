import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Login from '../../Login';

describe('<Login />', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<Login />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
