import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Filter from '../../Filters';

describe('<Filter />', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<Filter />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  })
})