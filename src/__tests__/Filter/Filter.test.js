import React from 'react';
import { shallow } from 'enzyme';
import toJSON from 'enzyme-to-json';
import Filter from '../../Filters';

describe('<Filter />', () => {
  const props = {
    filterCategory: jest.fn(),
    setDepartmentFilter: jest.fn()
  }
  it('renders without crashing', () => {
    const wrapper = shallow(<Filter />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });

  it('should toggle the category and set the value in state', () => {
    const wrapper = shallow(<Filter {...props} />);
    wrapper.instance().toggleCategory('Animal');
    expect(wrapper.state('collapseTextCategories')).toBe('Animal');
  });

  it('should toggle the department and set the value in state', () => {
    const wrapper = shallow(<Filter {...props} />);
    wrapper.instance().toggleDepartment('Nature');
    expect(wrapper.state('collapseTextDepartment')).toBe('Nature');
  });

  it('should call the toggle() method', () => {
    const wrapper = shallow(<Filter {...props} />);
    wrapper.instance().toggle('category');
    expect(wrapper.state('collapseCategory')).toEqual(true);
    expect(wrapper.state('collapseDepartment')).toEqual(false);

    wrapper.instance().toggle('department');
    expect(wrapper.state('collapseCategory')).toEqual(true);
    expect(wrapper.state('collapseDepartment')).toEqual(true);
  })
})