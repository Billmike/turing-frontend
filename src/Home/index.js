import React from 'react';
import Slider from 'react-slick';
import { Carousel, CarouselItem, CarouselControl, CarouselIndicators, CarouselCaption } from 'reactstrap';
import axios from 'axios';
import { Emojione } from 'react-emoji-render';
import Cards from '../Cards';
import Navbar from '../Navbar';
import Spinner from '../Spinner';
import {
  getCartItems,
  getCartPrice,
  fetchProducts,
  searchProducts
} from '../utils/apiCalls';
import Categories from '../Categories';
import Filters from '../Filters';
import Paginate from 'react-paginate';
import image1 from '../assets/bags.jpg';
import image2 from '../assets/lines.jpg';
import image3 from '../assets/dooley.jpg';
import './style.css';

const ITEMS = [
  {
    src: image1,
    altText: 'Slide 1',
    caption: 'Slide 1'
  },
  {
    src: image2,
    altText: 'Slide 1',
    caption: 'Slide 1'
  },
  {
    src: image3,
    altText: 'Slide 1',
    caption: 'Slide 1'
  }
]

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
    category_id: '',
    activeIndex: 0
  }

  async componentDidMount() {
    const { page } = this.state;
    this.setState({ isLoading: true });
    const getCartID = await localStorage.getItem('cartId');
    if (!getCartID) {
      this.setState({ productIncart: [] })
    } else {
      const cartItem = await getCartItems(getCartID);
      const totalPrice = await getCartPrice(getCartID);
      this.setState({ productIncart: cartItem.data, total_price: totalPrice.data.total_amount });
    }
    this.fetchProducts(page);
  }

  fetchProducts = async (page) => {
    const response = await fetchProducts(page);
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
      const response = await fetchProducts(page);
      this.setState({ products: response.data.rows, isLoading: false, pageCount: Math.ceil(response.data.count / 12), hasSearched: false, searchedProducts: [] })
    } else if (searchTerm.length > 3) {
      this.setState({ isLoading: true })
      const foundProducts = await searchProducts(searchTerm);
      this.setState({ searchedProducts: foundProducts.data.rows, isLoading: false, pageCount: foundProducts.data.count > 12 ? Math.ceil(foundProducts.data.count / 12) : 1 })
    }
  }

  setCategory = async (category_id) => {
    this.setState({ page: 1, category_id, department: '' }, () => {
      this.fetchCategories(category_id, this.state.page)
    })
  }

  setDepartment = async (value, department_id) => {
    this.setState({ department: value, page: 1, department_id, category: '' }, () => {
      this.fetchDepartments(department_id, this.state.page)
    });
  }

  setDepartmentFilter = (department_id) => {
    this.setState({ page: 1, department_id, category: '' }, () => {
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

  onExiting = () => {
    this.animating = true;
  }

  onExited = () => {
    this.animating = false;
  }

  next = () => {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === ITEMS.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous = () => {
    if (this.animating) return;
    const previousIndex = this.state.activeIndex === 0 ? ITEMS.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: previousIndex });
  }

  goToIndex = (newIndex) => {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
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
      department,
      activeIndex
    } = this.state;

    const slides = ITEMS.map(item => (
      <CarouselItem
        onExiting={this.onExiting}
        onExited={this.onExited}
        key={item.src}
      >
        <img src={item.src} alt={item.altText} className="carousel-style-class" />

      </CarouselItem>
    ))

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
        <Carousel
          activeIndex={activeIndex}
          next={this.next}
          previous={this.previous}
        >
          <CarouselIndicators activeIndex={activeIndex} items={ITEMS} onClickHandler={this.goToIndex} />
          {slides}
          <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
          <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
        </Carousel>
        { isLoading && <Spinner /> }
        {/* {!isLoading && <Categories category={this.state.category} setCategory={this.setCategory} />} */}
        {!isLoading && <Filters hasSearched={hasSearched} searchedProducts={searchedProducts} filterCategory={this.setCategory} setDepartmentFilter={this.setDepartmentFilter} />}
        {!isLoading && <div className="products-card-wrap" style={{ display: 'flex', flexWrap: 'wrap' }}>
        {/* <Filters hasSearched={hasSearched} searchedProducts={searchedProducts} filterCategory={this.setCategory} setDepartmentFilter={this.setDepartmentFilter} /> */}
          {
            hasSearched && searchedProducts.length > 0 ?
            searchedProducts.map((product, index) => (
              <Cards
                key={index + 100}
                {...product}
                history={history}
              />
            )):
            hasSearched && searchedProducts.length === 0 ? (
              <div className="no-product-found">
                <p>No products found</p>
                <Emojione size={55} text=":disappointed_relieved:" />
              </div>
              )
            : products.map((product) => (
              <Cards key={product.product_id} {...product} history={history} />
            ))
          }
        </div>}
        {!isLoading && <Paginate
          onPageChange={this.handlePageClick}
          previousLabel="<"
          nextLabel=">"
          breakLabel={"..."}
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
