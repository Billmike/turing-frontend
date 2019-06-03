import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Card from '../../Cards';

describe('<Cards />', () => {
  const props = {
    thumbnail: 'alsace.gif'
  }
  it('renders without crashing', () => {
   const wrapper = shallow(<Card {...props} />);
   expect(toJSON(wrapper)).toMatchSnapshot();
  })
})