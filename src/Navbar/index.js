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
                <NavLink style={{ fontFamily: 'Montserrat' }} onClick={() => history.push('/cart')}>Your Bag: </NavLink>
              </NavItem>
              <NavItem>
                <NavLink style={{ fontFamily: 'Montserrat' }} onClick={() => history.push('/cart')}>$ {cartPrice ? cartPrice : '0.00'} </NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>

        <Navbar style={{ backgroundColor: 'black' }} light expand="md">
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
          <Nav navbar>
              <NavItem style={{ display: 'flex', flexDirection: 'row' }}>
                <NavLink href="/" style={{ color: '#f7436b', fontFamily: 'Montserrat', fontSize: 20 }}>SHOPMATE</NavLink>
              </NavItem>
            </Nav>
            {history.location.pathname === '/' && <Nav style={{ margin: 'auto' }}>
              <NavItem>
                <NavLink
                  style={{
                    cursor: 'pointer',
                    backgroundColor: department === 'reg' ? 'white' : '',
                    color: department === 'reg' ? 'black' : 'white',
                    paddingLeft: department === 'reg' ? 15 : '',
                    paddingRight: department === 'reg' ? 15 : '',
                    paddingTop: department === 'reg' ? 5 : '',
                    borderRadius: department === 'reg' ? 5 : '',
                    fontFamily: 'Montserrat'
                  }}
                  onClick={() => setDepartment('reg', '1')}
                >
                  Regional
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink style={{
                  backgroundColor: department === 'nat' ? 'white' : '',
                  color: department === 'nat' ? 'black' : '#FFF',
                  paddingLeft: department === 'nat' ? 15 : '',
                  paddingRight: department === 'nat' ? 15 : '',
                  paddingTop: department === 'nat' ? 5 : '',
                  borderRadius: department === 'nat' ? 5 : '',
                  cursor: 'pointer',
                  fontFamily: 'Montserrat'
                  }}
                  onClick={() => setDepartment('nat', '2')}
                  >
                    Nature
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  style={{
                    backgroundColor: department === 'sea' ? 'white' : '',
                    color: department === 'sea' ? 'black' : '#FFF',
                    paddingLeft: department === 'sea' ? 15 : '',
                    paddingRight: department === 'sea' ? 15 : '',
                    paddingTop: department === 'sea' ? 5 : '',
                    borderRadius: department === 'sea' ? 5 : '',
                    cursor: 'pointer',
                    fontFamily: 'Montserrat'
                    }}
                  onClick={() => setDepartment('sea', '3')}
                >
                  Seasonal
                </NavLink>
              </NavItem>
            </Nav>}
            <Nav className="ml-auto" navbar>
              {history.location.pathname === '/' && <NavItem>
                <input
                  name="search"
                  id="search"
                  placeholder="&#x1F50D; Search"
                  value={searchTerm}
                  style={{
                    marginTop: 5,
                    borderRadius: 20,
                    width: 200,
                    marginRight: 80,
                    paddingLeft: 20
                  }}
                  onChange={(event) => searchProducts(event.target.value)}
                />
              </NavItem>}
              <NavItem>
                <NavLink onClick={() => history.push('/cart')} style={{ display: 'flex' }}>
                  <i className="fas fa-shopping-bag" style={{
                    color: '#FFF',
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
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    )
  }
}

export default NavbarComponent;
