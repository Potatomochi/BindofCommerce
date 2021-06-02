import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createReview, detailsProduct } from '../actions/productActions';
import Header from '../components/Header/Header';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Rating from '../components/Rating';
import { PRODUCT_REVIEW_CREATE_RESET } from '../constants/productConstants';

import "./styles/Product.css";

function Product(props) {
    const dispatch = useDispatch();
    const productId = props.match.params.id;
    const [qty, setQty] = useState(1);
    const productDetails = useSelector((state) => state.productDetails);
    const { loading, error, product } = productDetails;
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;


    const productReviewCreate = useSelector((state) => state.productReviewCreate);
    const {
      loading: loadingReviewCreate,
      error: errorReviewCreate,
      success: successReviewCreate,
    } = productReviewCreate;
  
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
  
    useEffect(() => {
      if (successReviewCreate) {
        window.alert('Review Submitted Successfully');
        setRating('');
        setComment('');
        dispatch({ type: PRODUCT_REVIEW_CREATE_RESET });
      }
      dispatch(detailsProduct(productId));
    }, [dispatch, productId, successReviewCreate]);
    const addToCartHandler = () => {
      props.history.push(`/cart/${productId}?qty=${qty}`);
    };
    const submitHandler = (e) => {
      e.preventDefault();
      if (comment && rating) {
        dispatch(
          createReview(productId, { rating, comment, name: userInfo.name })
        );
      } else {
        alert('Please enter comment and rating');
      }
    };
    return (
      <>
      <Header />
      <div className="pageContainer">
      {loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <div>
          <div className="pageInnerFlex">
            <div className="productLeft">
              <img
                className="large"
                src={product.image}
                alt={product.name}
              ></img>
            </div>

            <div className="productRight">
            <div className="">

                
                  <h1>{product.name}</h1>



 
                
                <h3>Description:</h3>
                  <p>{product.description}</p>


              </div>
            <div className="">
             

                  

                  <h3>Price : ${product.price}</h3>
                  {product.countInStock > 0 && (
                    <>
                  <div className="row productSpan">
                          <div>Qty</div>
                          <div className="select">
                            <select
                              value={qty}
                              onChange={(e) => setQty(e.target.value)}
                            >
                              {[...Array(product.countInStock).keys()].map(
                                (x) => (
                                  <option key={x + 1} value={x + 1}>
                                    {x + 1}
                                  </option>
                                )
                              )}
                            </select>
                          </div>
                  </div>
                  <div className="row ">
                      <div>Status</div>
                      <div>
                        {product.countInStock > 0 ? (
                          <span className="success">In Stock</span>
                        ) : (
                          <span className="danger">Unavailable</span>
                        )}
                      </div>
                    </div>



                    </>
                  )}

                
              

              <button onClick={addToCartHandler} className="newButton"> Add to Cart</button>
              <h3>Sold by:</h3>
                    <h2>
                      <Link to={`/seller/${product.seller._id}`} className="newLink">
                        {product.seller.seller.name}
                      </Link>
                    </h2>
            </div>
            </div>
          </div>
          <div>
            <h2 id="reviews">Reviews </h2>
            <Rating
                    rating={product.rating}
                    numReviews={product.numReviews}
                  ></Rating>
            {product.reviews.length === 0 && (
              <MessageBox>There are no reviews! Why not add one?</MessageBox>
            )}
            <ul>
              {product.reviews.map((review) => (
                <li key={review._id}>
                  <strong>{review.name}</strong>
                  <Rating rating={review.rating} caption=" "></Rating>
                  <p>{review.createdAt.substring(0, 10)}</p>
                  <p>{review.comment}</p>
                </li>
              ))}
              <li>
                {userInfo ? (
                  <div className="reviewBaseContainer">
                  <form className="reviewBase" onSubmit={submitHandler}>
                    <div>
                      <h1 className="formTitle">Write a customer review</h1>
                    </div>

                      <label htmlFor="rating" className="reviewLabel">Rating</label>
                      <div className="select">
                          <select id="standard-select">
                              <option value="">Select...</option>
                              <option value="1">1- Poor</option>
                              <option value="2">2- Fair</option>
                              <option value="3">3- Good</option>
                              <option value="4">4- Very good</option>
                              <option value="5">5- Excelent</option>
                          </select>
                          <span class="focus"></span>
                      </div>


                      <label htmlFor="comment" className="reviewLabel">Comment</label>
                      <div className="commentDescription">
                        <textarea
                          id="comment"
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        ></textarea>
                      </div>

                    <div>

                      <button className="reviewButton" type="submit">
                        Submit
                      </button>
                    </div>
                    <div>
                      {loadingReviewCreate && <LoadingBox></LoadingBox>}
                      {errorReviewCreate && (
                        <MessageBox variant="danger">
                          {errorReviewCreate}
                        </MessageBox>
                      )}
                    </div>
                  </form>
                  </div>
                ) : (
                  <MessageBox>
                    Please <Link to="/signin">Sign In</Link> to write a review
                  </MessageBox>
                )}
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
    </>
    );
}

export default Product
