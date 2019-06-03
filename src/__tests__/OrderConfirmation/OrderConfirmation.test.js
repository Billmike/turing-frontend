import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import OrderConfirmation from '../../OrderConfirmation';

describe('<OrderConfirmation />', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<OrderConfirmation />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
