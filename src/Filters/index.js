import React, { Component } from 'react';
import { Collapse, FormGroup, Label, Input, Form } from 'reactstrap';
import RadioButton from '../RadioButton';
import './styles.scss';

const CATEGORIES = ['French', 'Italian', 'Irish', 'Animal', 'Flower', 'Christmas', 'Valentine\'s'];
const DEPARTMENTS = ['Regional', 'Nature', 'Seasonal'];

class Filter extends Component {
  state = {
    collapseDepartment: false,
    collapseCategory: false,
    collapseTextDepartment: 'Filter by Department',
    collapseTextCategories: 'Filter by Categories'
  }

  toggleCategory = (collapseText = 'Filter by Categories', categoryID = 0) => {
    this.setState({
      collapseCategory: !this.state.collapseCategory,
      collapseTextCategories: collapseText
    }, () => {
      this.props.filterCategory(categoryID)
    })
  }

  toggle = (name) => {
    if (name === 'category') {
      this.setState({ collapseCategory: !this.state.collapseCategory })
    } else {
      this.setState({ collapseDepartment: !this.state.collapseDepartment })
    }
  }

  toggleDepartment = (collapseText = 'Filter by Department', departmentID = 0) => {
    this.setState({ collapseDepartment: !this.state.collapseDepartment, collapseTextDepartment: collapseText }, () => {
      this.props.setDepartmentFilter(departmentID);
    })
  }

  render() {
    const { collapseTextCategories, collapseCategory, collapseDepartment, collapseTextDepartment } = this.state;
    const { searchedProducts, hasSearched } = this.props;
    return (
      <div className="filter-cards-container">
        <div>
          <p

            disabled={searchedProducts && hasSearched}
            onClick={() => this.toggle('category')}
            className={searchedProducts && hasSearched ? "filter-cards-button-disabled" : "filter-cards-button"}
            >
            Filter by Category
          </p>
          <Collapse isOpen={true}>
            <Form>
              <FormGroup tag="fieldset">
              {
                CATEGORIES.map((category, index) => (
                  <RadioButton
                    labelText={category}
                    name="category"
                    toggleClick={this.toggleCategory}
                    index={index}
                    categoryText={collapseTextCategories}
                    />
                ))
              }
              </FormGroup>
            </Form>
          </Collapse>
        </div>
        <div>
          <p
            disabled={searchedProducts && hasSearched}
            onClick={() => this.toggle('department')}
            className={searchedProducts && hasSearched ? "filter-cards-button-disabled" : "filter-cards-button"}>
            Filter by Department
          </p>
          <Collapse isOpen={true}>
          <Form>
              <FormGroup tag="fieldset">
              {
                DEPARTMENTS.map((department, index) => (
                  <RadioButton
                    labelText={department}
                    name="department"
                    toggleClick={this.toggleDepartment}
                    index={index}
                    departmentText={collapseTextDepartment}
                  />
                ))
              }
              </FormGroup>
            </Form>
          </Collapse>
        </div>
      </div>
    )
  }
}

export default Filter;
