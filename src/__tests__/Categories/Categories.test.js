import React from 'react';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Categories from '../../Categories';

describe('<Categories />', () => {
  const wrapper = mount(<Categories />);
  it('should render without crashing', () => {
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});