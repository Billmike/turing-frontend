import React from 'react';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { SingleProduct } from '../../SingleProduct';

describe('<SingleProduct />', () => {
  const props = {
    history: {
      location: {
        pathname: ''
      }
    }
  }
  it('renders without crashing', () => {
    const wrapper = mount(<SingleProduct {...props} />);
    wrapper.setState({ isLoading: false })
    expect(toJSON(wrapper)).toMatchSnapshot();
  })
})