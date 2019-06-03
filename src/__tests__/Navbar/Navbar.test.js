import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Navbar from '../../Navbar';

describe('<Navbar />', () => {

  const props = {
    productIncart: [],
    cartPrice: '0.00',
    searchProducts: [],
    searchTerm: '',
    history: {
      location: {
        pathname: ''
      }
    },
    setDepartment: jest.fn(),
    department: ''
  }
  it('renders without crashing', () => {
    const wrapper = shallow(<Navbar {...props} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});