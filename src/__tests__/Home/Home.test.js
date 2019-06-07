import React from 'react';
import { mount } from 'enzyme';
import toJSON from 'enzyme-to-json';
import { HomePage } from '../../Home';

describe('<HomePage />', () => {
  const props = {
    history: {
      location: {
        pathname: ''
      }
    }
  }
  const wrapper = mount(<HomePage {...props} />);
  it('renders without crashing', () => {
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('should set the filter for category when clicked', () => {
    wrapper.instance().setCategory(1);
    expect(wrapper.state('category_id')).toEqual(1);
  });

  it('should set the filter for department when clicked', () => {
    wrapper.instance().setDepartment('Reg', 1);
    expect(wrapper.state('department')).toEqual('Reg');
    expect(wrapper.state('department_id')).toEqual(1);
  });
});
