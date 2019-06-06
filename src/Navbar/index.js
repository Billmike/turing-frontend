import React, { Component } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';
import './styles.scss';

class NavbarComponent extends Component {

  state = {
    searchTerm: '',
    customer: {},
    accessToken: '',
    isOpen: false
  }

  componentDidMount() {
    const userData = localStorage.getItem('user');
    if (!userData) {
      return;
    }
    const parsedData = JSON.parse(userData);
    this.setState({ customer: parsedData.customer, accessToken: parsedData.accessToken })
  }

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen })
  }

  logOut = async() => {
    const { history } = this.props;
    await localStorage.clear();
    if (history.location.pathname === '/') {
      window.location.reload();
    } else {
      history.push('/')
    }
  }

  render() {
    const { productIncart, cartPrice, searchProducts, searchTerm, history, setDepartment, department } = this.props;
    const { accessToken, customer } = this.state;
    return (
      <div>
      <Navbar style={{ backgroundColor: '#FFF' }} light expand="md">
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
          <Nav navbar>
          <p style={{ marginTop: 8, marginLeft: 20, fontFamily: 'Montserrat' }}>Hi</p>
              {
                !accessToken &&
                <>
                <NavItem style={{ display: 'flex', flexDirection: 'row' }}>
                <NavLink onClick={() => history.push('/login')} style={{ color: '#f7436b', fontFamily: 'Montserrat', fontWeight: 'bold', cursor: 'pointer' }}>Sign in</NavLink>
              </NavItem>
              <NavItem style={{ display: 'flex', flexDirection: 'row' }}>
                <p style={{ marginTop: 8, fontFamily: 'Montserrat' }}>Or</p>
                <NavLink onClick={() => history.push('/signup')} style={{ color: '#f7436b', fontFamily: 'Montserrat', fontWeight: 'bold', cursor: 'pointer' }}>Register</NavLink>
              </NavItem>
              </>
              }
              {accessToken && <UncontrolledDropdown nav inNavbar>
                <DropdownToggle style={{ color: '#f7436b' }} nav caret>
                  {customer.name}
                </DropdownToggle>
                <DropdownMenu left>
                  <DropdownItem onClick={() => history.push('/profile')} style={{ color: '#f7436b', fontFamily: 'Montserrat' }}>
                    MY PROFILE
                  </DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem style={{ fontFamily: 'Montserrat' }} onClick={this.logOut}>
                    LOGOUT
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>}
            </Nav>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink onClick={() => history.push('/cart')} style={{ display: 'flex', cursor: 'pointer' }}>
                  <i className="fas fa-shopping-bag" style={{
                    color: 'black',
                    fontSize: 20,
                    position: 'absolute'
                    }}>
                    </i>
                    <div style={{
                        marginTop: -10,
                        zIndex: 10,
                        backgroundColor: '#f7436b',
                        height: 20,
                        width: 20,
                        borderRadius: '50%',
                        textAlign: 'center',
                        color: '#FFF',
                        marginLeft: 10
                      }}>
                    <p style={{ marginTop: 0, fontSize: 14, fontFamily: 'Montserrat' }}>{productIncart.length}</p>
                    </div>
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink style={{ fontFamily: 'Montserrat', cursor: 'pointer' }} onClick={() => history.push('/cart')}>Your Bag: </NavLink>
              </NavItem>
              <NavItem>
                <NavLink style={{ fontFamily: 'Montserrat', cursor: 'pointer' }} onClick={() => history.push('/cart')}>$ {cartPrice ? cartPrice : '0.00'} </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>

        <Navbar style={{ backgroundColor: 'black' }} light expand="md">
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar style={{ justifyContent: 'space-between' }}>
          <Nav navbar>
              <NavItem style={{ display: 'flex', flexDirection: 'row' }}>
                <NavLink href="/" style={{ color: '#f7436b', fontFamily: 'Montserrat', fontSize: 20 }}>SHOPMATE</NavLink>
              </NavItem>
            </Nav>
              {history.location.pathname === '/' && <NavItem>
                <input
                  name="search"
                  id="search"
                  placeholder="&#x1F50D; Search"
                  value={searchTerm}
                  className="search-bar-style"
                  onChange={(event) => searchProducts(event.target.value)}
                />
              </NavItem>}
            <Nav className="" navbar>
              <NavItem>
                <NavLink onClick={() => history.push('/cart')} style={{ display: 'flex', cursor: 'pointer' }}>
                  <i className="fas fa-shopping-bag" style={{
                    color: '#FFF',
                    fontSize: 20,
                    position: 'absolute',
                    }}>
                    </i>
                    <div style={{
                        marginTop: -10,
                        zIndex: 10,
                        backgroundColor: '#f7436b',
                        height: 20,
                        width: 20,
                        borderRadius: '50%',
                        textAlign: 'center',
                        color: '#FFF',
                        marginLeft: 10
                      }}>
                    <p style={{ marginTop: 0, fontSize: 14, fontFamily: 'Montserrat' }}>{productIncart.length}</p>
                    </div>
                </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    )
  }
}

export default NavbarComponent;
