import React, { Component } from 'react';

class Navbar extends Component {

  state = {
    searchTerm: '',
    customer: {},
    accessToken: ''
  }

  componentDidMount() {
    const userData = localStorage.getItem('user');
    if (!userData) {
      return;
    }
    const parsedData = JSON.parse(userData);
    this.setState({ customer: parsedData.customer, accessToken: parsedData.accessToken })
  }

  render() {
    const { productIncart, cartPrice, searchProducts, searchTerm, history, setDepartment, department } = this.props;
    const { accessToken, customer } = this.state;
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'space-around',
      }}>
        <div>
          <p>Hi,
            {
            !accessToken &&
            <>
            <span onClick={() => history.push('/login')} style={{ color: 'red', cursor: 'pointer', marginLeft: 5 }}>Sign in</span>
            <span style={{ marginLeft: 5 }}>or</span>
            <span onClick={() => history.push('/signup')} style={{ color: 'red', cursor: 'pointer', marginLeft: 5 }}>Register</span>
            </>
            }
            { accessToken && <span style={{ marginLeft: 5 }}>{customer.name}</span> }
          </p>
        </div>
        <div style={{
          display: 'flex'
        }}>
          <p style={{ marginRight: 15 }}>Daily Deals</p>
          <p style={{ marginRight: 15 }}>Sell</p>
          <p>Help and Contact</p>
        </div>
        <div style={{
          marginTop: 20
        }}>
          GBP
        </div>
        <div
          style={{ display: 'flex', marginTop: 15, cursor: 'pointer' }}
          onClick={() => history.push('/cart')}
        >
          <div style={{ display: 'flex', marginRight: 10 }}>
            <i className="fas fa-shopping-bag" style={{ marginRight: 10 }}></i>
            <p style={{
              position: 'absolute',
              right: 230,
              top: -7,
              backgroundColor: 'red',
              height: 20,
              width: 20,
              borderRadius: '50%',
              textAlign: 'center',
              color: '#FFF'
            }}>{productIncart.length}</p>
          </div>
          Your Bag: ${cartPrice}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-around', backgroundColor: 'black' }}>
        <p style={{ color: 'red', fontSize: 20 }}>Shopmate</p>
        <div style={{ display: 'flex', color: '#FFF' }}>
          <p
            onClick={() => setDepartment('reg', '1')}
            style={{
              backgroundColor: department === 'reg' ? 'white' : '',
              color: department === 'reg' ? 'black' : '',
              paddingLeft: department === 'reg' ? 15 : '',
              paddingRight: department === 'reg' ? 15 : '',
              paddingTop: department === 'reg' ? 5 : '',
              borderRadius: department === 'reg' ? 5 : '',
              cursor: 'pointer',
              marginRight: 35,
            }}
          >
            Regional
          </p>
          <p
            onClick={() => setDepartment('nat', '2')}
            style={{
              backgroundColor: department === 'nat' ? 'white' : '',
              color: department === 'nat' ? 'black' : '',
              paddingLeft: department === 'nat' ? 15 : '',
              paddingRight: department === 'nat' ? 15 : '',
              paddingTop: department === 'nat' ? 5 : '',
              borderRadius: department === 'nat' ? 5 : '',
              cursor: 'pointer',
              marginRight: 35,
            }}
          >
            Nature
          </p>
          <p
            onClick={() => setDepartment('sea', '3')}
            style={{
              backgroundColor: department === 'sea' ? 'white' : '',
              color: department === 'sea' ? 'black' : '',
              paddingLeft: department === 'sea' ? 15 : '',
              paddingRight: department === 'sea' ? 15 : '',
              paddingTop: department === 'sea' ? 5 : '',
              borderRadius: department === 'sea' ? 5 : '',
              cursor: 'pointer',
              marginRight: 35,
            }}
          >
            Seasonal
          </p>
        </div>
        <div style={{ display: 'flex' }}>
          <input
              name="search"
              id="search"
              placeholder="Search"
              value={searchTerm}
              style={{
                marginTop: 20,
                borderRadius: 20,
                width: 200,
                height: 20,
                marginRight: 40,
                paddingLeft: 20
              }}
              onChange={(event) => searchProducts(event.target.value)}
            />
          <i className="fas fa-shopping-bag" style={{ color: '#FFF', marginTop: 25 }}></i>
          <p style={{
            position: 'absolute',
            top: 50,
            backgroundColor: '#FFF',
            height: 20,
            width: 20,
            borderRadius: '50%',
            color: 'red',
            textAlign: 'center',
            right: 120
          }}>{productIncart.length}</p>
        </div>
      </div>
      </div>
    )
  }
}

export default Navbar;
