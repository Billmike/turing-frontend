import React from 'react';
import Slider from 'react-slick';
import axios from 'axios';
import Cards from '../Cards';
import Navbar from '../Navbar';
import Spinner from '../Spinner';
import Categories from '../Categories';
import Paginate from 'react-paginate';
import image1 from '../assets/img1.jpg';
import image2 from '../assets/img2.jpg';
import image3 from '../assets/img3.jpg';
import './style.css';

class HomePage extends React.Component {
  state = {
    products: [],
    isLoading: false,
    productIncart: [],
    total_price: '0.00',
    page: 1,
    pageCount: 1,
    searchTerm: '',
    searchedProducts: [],
    hasSearched: false,
    category: 0,
    department: '',
    department_id: '',
    category_id: ''
  }

  async componentDidMount() {
    const { page } = this.state;
    this.setState({ isLoading: true });
    const getCartID = await localStorage.getItem('cartId');
    if (!getCartID) {
      this.setState({ productIncart: [] })
    } else {
      const cartItem = await axios.get(`https://backendapi.turing.com/shoppingcart/${getCartID}`);
      const totalPrice = await axios.get(`https://backendapi.turing.com/shoppingcart/totalAmount/${getCartID}`)
      this.setState({ productIncart: cartItem.data, total_price: totalPrice.data.total_amount });
    }
    this.fetchProducts(page);
  }

  fetchProducts = async (page) => {
    const response = await axios.get(`https://backendapi.turing.com/products?page=${page}&limit=${12}`);
    this.setState({ products: response.data.rows, isLoading: false, pageCount: Math.ceil(response.data.count / 12) })
  }

  handlePageClick = data => {
    const { selected } = data;
    const { department_id, category_id } = this.state;
    const currentPage = Math.ceil(selected) + 1;
    if (Number(department_id) > 0) {
      return this.fetchDepartments(department_id, currentPage);
    }

    if (Number(category_id) > 0) {
      return this.fetchCategories(category_id, currentPage);
    }
    this.fetchProducts(currentPage);
    this.setState({ page: currentPage })
  }

  searchProducts = async (searchTerm) => {
    const { page } = this.state;
    this.setState({ searchTerm, hasSearched: true, })
    if (searchTerm.length === 0) {
      this.setState({ isLoading: true })
      const response = await axios.get(`https://backendapi.turing.com/products?page=${page}&limit=${12}`);
      this.setState({ searchedProducts: response.data.rows, isLoading: false, pageCount: Math.ceil(response.data.count / 12) })
    } else if (searchTerm.length > 3) {
      this.setState({ isLoading: true })
      const foundProducts = await axios.get(`https://backendapi.turing.com/products/search?query_string=${searchTerm}`);
      this.setState({ searchedProducts: foundProducts.data.rows, isLoading: false, pageCount: 1 })
    }
  }

  setCategory = async (value, category_id) => {
    this.setState({ category: value, page: 1, category_id, department: '' }, () => {
      this.fetchCategories(category_id, this.state.page)
    })
  }

  setDepartment = async (value, department_id) => {
    this.setState({ department: value, page: 1, department_id, category: '' }, () => {
      this.fetchDepartments(department_id, this.state.page)
    });
  }

  fetchCategories = async(category_id, page) => {
    const response = await axios.get(`https://backendapi.turing.com/products/inCategory/${category_id}?page=${page}&limit=${12}`);
    this.setState({ products: response.data.rows, pageCount: Math.ceil(response.data.count / 12) })
  }

  fetchDepartments = async(department_id, page) => {
    const response = await axios.get(`https://backendapi.turing.com/products/inDepartment/${department_id}?page=${page}&limit=${12}`);
    this.setState({ products: response.data.rows, pageCount: Math.ceil(response.data.count / 12) })
  }

  render() {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    const { history } = this.props;
    const {
      products,
      isLoading,
      productIncart,
      total_price,
      searchTerm,
      searchedProducts,
      hasSearched,
      department
    } = this.state;

    return (
      <div>
        <Navbar
          productIncart={productIncart}
          cartPrice={total_price}
          searchProducts={this.searchProducts}
          searchTerm={searchTerm}
          history={history}
          department={department}
          setDepartment={this.setDepartment}
          />
        <Slider {...settings}>
          <div>
            <img src={image1} alt="" style={{ width: '100%', height: 600 }} />
          </div>
          <div>
            <img src={image2} alt="" style={{ width: '100%', height: 600 }} />
          </div>
          <div>
            <img src={image3} alt="" style={{ width: '100%', height: 600 }} />
          </div>
        </Slider>
        { isLoading && <Spinner /> }
        {!isLoading && <Categories category={this.state.category} setCategory={this.setCategory} />}
        {!isLoading && <div style={{ display: 'flex', flexWrap: 'wrap', marginLeft: 350 }}>
          {
            hasSearched && searchedProducts.length > 0 ?
            searchedProducts.map((product) => (
              <Cards
                key={product.product_id}
                {...product}
                history={history}
              />
            )):
            products.map((product) => (
              <Cards key={product.product_id} {...product} history={history} />
            ))
          }
        </div>}
        {!isLoading && <Paginate
          onPageChange={this.handlePageClick}
          previousLabel="<"
          nextLabel=">"
          breakLabel={<a href="">...</a>}
          pageCount={this.state.pageCount}
          containerClassName="pagination-class justify-content-center"
          pageClassName="page-item page-numbers-style"
          pageLinkClassName="page-link"
          nextClassName="page-item next-button"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextLinkClassName="page-link"
          disabledClassName="disabled"
          activeClassName="active"
        />}
      </div>
    )
  }
}

export default HomePage;
