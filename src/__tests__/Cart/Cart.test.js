import React from 'react';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { Cart } from '../../Cart';

describe('<Cart />', () => {
  const props = {
    history: {
      location: {
        pathname: ''
      }
    }
  };
  const wrapper = mount(<Cart {...props} />);

  it('should mount without crashing', () => {
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
