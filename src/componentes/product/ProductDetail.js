import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import { createReview, getProduct } from "../../actions/productActions"
import Loader from '../layouts/Loader';
//import { Carousel } from 'react-bootstrap';
import Zooming from "../layouts/Zooming";
import MetaData from "../layouts/MetaData";
import { addCartItem } from "../../actions/cartActions";
import {clearReviewSubmitted, clearError, clearProduct} from '../../slices/productSlice';
import {Modal} from 'react-bootstrap';
import { toast } from "react-toastify";
import ProductReview from "./ProductReview";


export default function ProductDetail () {
    const { loading, product = {}, isReviewSubmitted, error} = useSelector((state)=>state.productState);
    const { user } = useSelector(state => state.authState);
    const dispatch = useDispatch();
    const { id } = useParams()
    const [quantity, setQuantity] = useState(1);

    const increaseQty = () => {
        const count = document.querySelector('.count')
        if(product.stock ==0 ||  count.valueAsNumber >= product.stock) return;
        const qty = count.valueAsNumber + 1;
        setQuantity(qty);
    }
    const decreaseQty = () => {
        const count = document.querySelector('.count')
        if(count.valueAsNumber == 1 ) return;
        const qty = count.valueAsNumber - 1;
        setQuantity(qty);
    }

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState("");

    const reviewHandler = () => {
        const formData = new FormData();
        formData.append('rating', rating);
        formData.append('comment', comment);
        formData.append('productId', id);
        dispatch(createReview(formData))

    }
    //button to Add toCart
    const [isAnimating, setIsAnimating] = useState(false);

    const handleButtonClick = () => {
      if (!isAnimating) {
        setIsAnimating(true);
        setTimeout(() => {
          setIsAnimating(false);
        }, 10000); // Match the animation duration
      }
    };

    useEffect(()=>{
        if(isReviewSubmitted) {
            handleClose()
            toast('Review Submitted successfully',{
                type: 'success',
                position: "bottom-center",
                onOpen: () => dispatch(clearReviewSubmitted())
            })
            
        }
        if(error)  {
            toast(error, {
                position: "bottom-center",
                type: 'error',
                onOpen: ()=> { dispatch(clearError()) }
            })
            return
        }
        if(!product._id || isReviewSubmitted) {
            dispatch(getProduct(id))
        }

        return () => {
            dispatch(clearProduct())
        }
       
        

    },[dispatch,id,isReviewSubmitted, error])

    

    return (
        <Fragment>
            {loading? <Loader/>:
            <Fragment>
                <MetaData title={product.name} />
                <div className="row f-flex justify-content-around">
                    <div className="col-12 col-lg-5 img-fluid" id="product_image">
                    <div>
                        <Zooming images={product.images?.map((img) => img.image) || []} /> 
                    </div>
                    
                    </div>
                    <div className="col-12 col-lg-5 mt-5">
                    <h3>{product.name}</h3>
                    <p id="product_id">Product # {product._id}</p>

                    <hr/>

                    <div className="rating-outer">
                        <div className="rating-inner" style={{width: `${product.ratings/ 5 * 100}%` }}></div>
                    </div>
                    <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>

                    <hr/>

                    <p id="product_price">₹{product.price}</p>
                    <div className="stockCounter d-inline">
                        <span className="btn btn-danger minus" onClick={decreaseQty} >-</span>

                        <input type="number" className="form-control count d-inline" value={quantity} readOnly />

                        <span className="btn btn-primary plus" onClick={increaseQty}>+</span>
                    </div>
                    <br></br>
                    <br></br>
                    <div className="app-container">
                    <button
                       disabled={product.stock === 0}
                       onClick={() => {
                        handleButtonClick();
                       dispatch(addCartItem(product._id, quantity));
                       toast("Cart Item Added!", {
                       type: "success",
                        position: "bottom-center",
                      });
                      }}
                      className={`order ${isAnimating ? "animate" : ""}`}
                      
                      >
                       <span className="default">Add To Cart</span>
                       <span className="success">
                           Cart added Successfully
                           <svg viewBox="0 0 12 10">
                           <polyline points="1.5 6 4.5 9 10.5 1" />
                             </svg>
                       </span>
                           <div className="box"></div>
                      <div className="truck">
                         <div className="back"></div>
                         <div className="front">
                         <div className="window"></div>
                      </div>
                         <div className="light top"></div>
                        <div className="light bottom"></div>
                     </div>
                        <div className="lines"></div>
                    </button>

                   </div>



                    <hr/>

                    <p>Status: <span className={product.stock > 0 ?'greenColor':'redColor'} id="stock_status">{ product.stock > 0 ?'In Stock':'Out of Stock'}</span></p>

                    <hr/>

                    <h4 className="mt-2">Description:</h4>
                    <p>{product.description}</p>
                    <hr/>
                    <p id="product_seller mb-3">Sold by: <strong>{product.seller}</strong></p>
                    { user ?
                    <button onClick={handleShow} id="review_btn" type="button" className="btn btn-primary mt-4" data-toggle="modal" data-target="#ratingModal">
                                Submit Your Review
                    </button> :
                    <div className="alert alert-danger mt-5"> Login to Post Review</div>
                    }
                    
                    <div className="row mt-2 mb-5">
                        <div className="rating w-50">
                            <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                <Modal.Title>Submit Review</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <ul className="stars" >
                                        {
                                            [1,2,3,4,5].map(star => (
                                                <li 
                                                value={star}
                                                onClick={()=>setRating(star)}
                                                className={`star ${star<=rating?'orange':''}`}
                                                onMouseOver={(e) => e.target.classList.add('yellow')}
                                                onMouseOut={(e) => e.target.classList.remove('yellow')}

                                                ><i className="fa fa-star"></i></li>
                                            ))
                                        }
                                       
                                       
                                    </ul>

                                    <textarea  onChange={(e)=>setComment(e.target.value)} name="review" id="review" className="form-control mt-3">

                                    </textarea>
                                    <button disabled={loading} onClick={reviewHandler}   aria-label="Close" className="btn my-3 float-right review-btn px-4 text-white">Submit</button>
                                </Modal.Body>
                               
                            </Modal>
                        </div>
                    </div>
                            
                </div>

                </div>

                {
                product.reviews && product.reviews.length > 0 ?
                <ProductReview reviews={product.reviews} /> : null
                }
            </Fragment>}
        </Fragment>
    )
}


