import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { deliverOrder, detailsOrder } from '../actions/orderActions';
import Header from '../components/Header/Header';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';
import {loadStripe} from '@stripe/stripe-js'
import {
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET,
} from '../constants/orderConstants';

function Order(props) {
    const orderId = props.match.params.id;

    const orderDetails = useSelector((state) => state.orderDetails);
    const { order, loading, error } = orderDetails;
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    const email = userInfo.email

    const [stripeData , setStripeData] = useState()
    const orderPay = useSelector((state) => state.orderPay);
    const {
      success: successPay,
    } = orderPay;
    const orderDeliver = useSelector((state) => state.orderDeliver);
    const {
      loading: loadingDeliver,
      error: errorDeliver,
      success: successDeliver,
    } = orderDeliver;
    const dispatch = useDispatch();

    const getStripeData = async() => {
      const {data} = await axios.post("/api/get-stripe-user" , {email})
      setStripeData(data)
    }
    useEffect(() => {
      if (
        !order ||
        successPay ||
        successDeliver ||
        (order && order._id !== orderId)
      ) {
        if(!stripeData){
          getStripeData()
        }
        dispatch({ type: ORDER_PAY_RESET });
        dispatch({ type: ORDER_DELIVER_RESET });
        dispatch(detailsOrder(orderId));

      } else {
        if (!order.isPaid) {
  
        }
      }
    }, [dispatch, orderId, successPay, successDeliver, order,stripeData]);
  

    const deliverHandler = () => {
      dispatch(deliverOrder(order._id));
    };
    const toStripeHandler = () => {
      props.history.push('/stripe-user-creation')
    }

    const submitPayHandler = async() => {
      const {data} = await axios.post("/stripe-checkout", order)

      if (data) {
        const sessionId = data.sessionId
        const {REACT_APP_STRIPE_API_KEY} = process.env
        const stripe = await loadStripe(REACT_APP_STRIPE_API_KEY)
        await stripe.redirectToCheckout({

          sessionId: sessionId,
    
        });
      }


    }

    return loading ? (
        <LoadingBox></LoadingBox>
      ) : error ? (
        <MessageBox variant="danger">{error}</MessageBox>
      ) : (
        <>
        <Header />
        <div>
          <h1>Order {order._id}</h1>
          <div className="row top">
            <div className="col-2">
              <ul>
                <li>
                  <div className="card card-body">
                    <h2>Shipping</h2>
                    <p>
                      <strong>Name:</strong> {order.shippingAddress.fullName} <br />
                      <strong>Address: </strong> {order.shippingAddress.address},
                      {order.shippingAddress.city},{' '}
                      {order.shippingAddress.postalCode},
                      {order.shippingAddress.country}
                    </p>
                    {order.isDelivered ? (
                      <MessageBox variant="success">
                        Delivered at {order.deliveredAt}
                      </MessageBox>
                    ) : (
                      <MessageBox variant="danger">Not Delivered</MessageBox>
                    )}
                  </div>
                </li>
                <li>
                  <div className="card card-body">
                    <h2>Payment</h2>
                    <p>
                      <strong>Method:</strong> {order.paymentMethod}
                    </p>
                    {order.isPaid ? (
                      <MessageBox variant="success">
                        Paid at {order.paidAt}
                      </MessageBox>
                    ) : (
                      <MessageBox variant="danger">Not Paid</MessageBox>
                    )}
                  </div>
                </li>
                <li>
                  <div className="card card-body">
                    <h2>Order Items</h2>
                    <ul>
                      {order.orderedItems.map((item) => (
                        <li key={item.product}>
                          <div className="row">
                            <div>
                              <img
                                src={item.image}
                                alt={item.name}
                                className="small"
                              ></img>
                            </div>
                            <div className="min-30">
                              <Link to={`/product/${item.product}`}>
                                {item.name}
                              </Link>
                            </div>
    
                            <div>
                              {item.qty} x ${item.price} = ${item.qty * item.price}
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </ul>
            </div>
            <div className="col-1">
              <div className="card card-body">
                <ul>
                  <li>
                    <h2>Order Summary</h2>
                  </li>
                  <li>
                    <div className="row">
                      <div>Items</div>
                      <div>${order.itemsPrice.toFixed(2)}</div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div>Shipping</div>
                      <div>${order.shippingPrice.toFixed(2)}</div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div>Tax</div>
                      <div>${order.taxPrice.toFixed(2)}</div>
                    </div>
                  </li>
                  <li>
                    <div className="row">
                      <div>
                        <strong> Order Total</strong>
                      </div>
                      <div>
                        <strong>${order.totalPrice.toFixed(2)}</strong>
                      </div>
                    </div>
                  </li>
                  {!order.isPaid && (<>
                    {order.paymentMethod === "Stripe" ? ( stripeData && ( stripeData.charges_enabled ? (<button className="standardButton" onClick={submitPayHandler}>Checkout</button>) :(<><p>Looks like there are some issues with your account onboarding, click the button below to sort them out!</p>
                        <button className="standardButton" onClick={toStripeHandler}>Stripe Onboarding</button></>))

                    ) : (<p>You have opted to pay by cash, please make arrangements with the seller in order to pay for your order!</p>)}
                    </>
                  )}
                  {userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                    <li>
                      {loadingDeliver && <LoadingBox></LoadingBox>}
                      {errorDeliver && (
                        <MessageBox variant="danger">{errorDeliver}</MessageBox>
                      )}
                      <button
                        type="button"
                        className="primary block"
                        onClick={deliverHandler}
                      >
                        Deliver Order
                      </button>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
        </>
      );
    }

export default Order
