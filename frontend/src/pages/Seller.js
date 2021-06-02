import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { listProducts } from '../actions/productActions';
import { detailsUser } from '../actions/userActions';
import Card from '../components/Card/Card';
import Header from '../components/Header/Header';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import Rating from '../components/Rating';


function Seller(props) {
    const sellerId = props.match.params.id;
    const userDetails = useSelector((state) => state.userDetails);
    const { loading, error, user } = userDetails;

    const productList = useSelector((state) => state.productList);
    const {
      loading: loadingProducts,
      error: errorProducts,
      products,
    } = productList;
  
    const dispatch = useDispatch();
    useEffect(() => {
      if(!user){
      dispatch(detailsUser(sellerId));
    }
      dispatch(listProducts({ seller: sellerId }));
    }, [dispatch, sellerId , user]);
    return (
      <>
      <Header />
        <div className="row top">
        <div className="col-1">
          {loading ? (
            <LoadingBox></LoadingBox>
          ) : error ? (
            <MessageBox variant="danger">{error}</MessageBox>
          ) : (<>
            {user ? (<ul className="blackCard card-body">
              <li>
                <div className="row start">
                  <div className="p-1">
                    <img
                      className="small"
                      src={user.seller.logo}
                      alt={user.seller.name}
                    ></img>
                  </div>
                  <div className="p-1">
                    <h1>{user.seller.name}</h1>
                  </div>
                </div>
              </li>
              <li>
                <Rating
                  rating={user.seller.rating}
                  numReviews={user.seller.numReviews}
                ></Rating>
              </li>
              <li>
                <a href={`mailto:${user.email}`}>Contact Seller</a>
              </li>
              <li>{user.seller.description}</li>
            </ul>) : (<h2>Please sign in to see details of the seller!</h2>)}

            </>
          )}
        </div>
        <div className="col-3">
          {loadingProducts ? (
            <LoadingBox></LoadingBox>
          ) : errorProducts ? (
            <MessageBox variant="danger">{errorProducts}</MessageBox>
          ) : (
            <>
              {products.length === 0 && <MessageBox>No Product Found</MessageBox>}
              <div className="row center">
                {products.map((product) => (
                  <Card key={product._id} product={product}></Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      </>
    )
}

export default Seller
