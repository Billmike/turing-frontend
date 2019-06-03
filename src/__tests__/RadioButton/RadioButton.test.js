import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import RadioButton from '../../RadioButton';

describe('<RadioButton />', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<RadioButton />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  })
})