import React, { Fragment, useEffect, useState } from 'react';
import MetaData from './layouts/MetaData';
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from '../actions/productActions';
import Loader from './layouts/Loader';
import Product from "./product/Product";
import { toast } from 'react-toastify';
import Pagination from 'react-js-pagination';
import CarouselPage from "./layouts/CarouselPage.js";
import Cardproduct from './product/Roundcardproduct.js';
import Squarecardproduct from './product/Squarecardproduct.js';
import '../componentes/style/ExtraStyle.css'


export default function Home() {
    const dispatch = useDispatch();
    const { products, loading, error, productsCount, resPerPage, } = useSelector((state) => state.productsState);
    const [currentPage, setCurrentPage] = useState(1);

    // Function to set the page number for pagination
    const setCurrentPageNo = (pageNo) => {
      setCurrentPage(pageNo);
    };

    useEffect(() => {
      if (error) {
        toast.error(error, {
          position: "bottom-center"
        });
        return;
      }

      // Fetch products for the current page
      dispatch(getProducts(null, null, null, null, currentPage));

    }, [error, dispatch, currentPage]);

    return (
      <Fragment>
        {loading ? <Loader /> : 
          <Fragment>
            <MetaData title={'Buy Best Products'} />
            <h1 id="product_heading" style={{textAlign:'center'}}>RLRV Shop Products</h1>
            
            {currentPage === 1 && <Squarecardproduct/>}<br></br>
            {/* Show CarouselPage only on the first page */}
            {currentPage === 1 && <CarouselPage />}<br></br>
            {currentPage === 1 && <Cardproduct />}
            
            <section id="products" className="container mt-5">
              <div className="row">
                {products && products.length > 0 ? (
                  products.map(product => (
                    <Product col={3} key={product._id} product={product} />
                  ))
                ) : (
                  <h2>No products found.</h2>
                )}
              </div>
            </section>

            {productsCount > 0 && resPerPage > 0 && (
              <div className='d-flex justify-content-center mt-5'>
                <Pagination
                  activePage={currentPage}
                  onChange={setCurrentPageNo}
                  totalItemsCount={productsCount}
                  itemsCountPerPage={resPerPage}
                  nextPageText={'Next'}
                  prevPageText={'Prev'}
                  firstPageText={'First'}
                  lastPageText={'Last'}
                  itemClass={'page-item'} // Bootstrap page design
                  linkClass={'page-link'} // Bootstrap link design
                />
              </div>
            )}
            
          </Fragment>
        }
      </Fragment>
    );
}

