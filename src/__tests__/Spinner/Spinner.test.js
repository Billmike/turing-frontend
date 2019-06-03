import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Spinner from '../../Spinner';

describe('<Spinner />', () => {
  it('renders without crashing', () => {
    const wrapper = shallow(<Spinner />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
