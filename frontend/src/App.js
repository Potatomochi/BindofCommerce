import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';

import * as ROUTES from "./constants/routes";
import AdminRoute from './components/AdminRoute';
import PrivateRoute from './components/PrivateRoute';
import SellerRoute from './components/SellerRoute';
import {Seller,Cart,Product,Home,Order,OrderHistory,OrderList, PaymentMethod,PlaceOrder,ProductEdit,ProductList,SignUp,SignIn,ShippingAddress,Search,UserEdit,UserList,AdminUserEdit, StripePre, StripePost, StripeUserCreation, UserDashboard, CheckOutSuccess} from './pages';
function App() {
  return (

          <BrowserRouter>
          
          <Route path={ROUTES.SELLER_PROFILE} component={Seller}></Route>
          <Route path={ROUTES.CHECKOUT_SUCESS} component={CheckOutSuccess}></Route>
          <Route path={ROUTES.CART} component={Cart}></Route>
          <Route path={ROUTES.PRODUCT_PROFILE} component={Product} exact></Route>
          <Route path={ROUTES.EDIT_PRODUCT} component={ProductEdit} exact></Route>
          <Route path={ROUTES.SIGN_IN} component={SignIn}></Route>
          <Route path={ROUTES.SIGN_UP} component={SignUp}></Route>
          <Route path={ROUTES.SHIPPING} component={ShippingAddress}></Route>
          <Route path={ROUTES.PAYMENT} component={PaymentMethod}></Route>
          <Route path={ROUTES.PLACE_ORDER} component={PlaceOrder}></Route>
          <Route path={ROUTES.ORDER_CONFIRMED} component={Order}></Route>
          <Route path={ROUTES.STRIPE_INITIAL} component={StripePre}></Route>
          <Route path={ROUTES.STRIPE_USER_CREATION} component={StripeUserCreation}></Route>
          <Route path={ROUTES.STRIPE_POST} component={StripePost}></Route>
          <Route path={ROUTES.ORDER_HISTORY} component={OrderHistory}></Route>
          <Route path={ROUTES.SEARCH_NAME} component={Search} exact ></Route>
          <Route path={ROUTES.SEARCH_CATEGORY} component={Search} exact ></Route>
          <Route path={ROUTES.SEARCH_VIEW_CATEGORY_NAME} component={Search}exact></Route>
          <Route path={ROUTES.USER_PROFILE} component={UserDashboard} ></Route>
          <Route path={ROUTES.SEARCH_VIEW_ALL} component={Search} exact></Route>
          <PrivateRoute path={ROUTES.EDIT_USER_PROFILE} component={UserEdit}></PrivateRoute>
          <AdminRoute path={ROUTES.PRODUCT_LIST_ADMIN} component={ProductList} exact></AdminRoute>
          <AdminRoute path={ROUTES.PRODUCT_LIST_PAGINATION} component={ProductList} exact></AdminRoute>
          <AdminRoute path={ROUTES.ORDER_LIST_ADMIN} component={OrderList} exact></AdminRoute>
          <AdminRoute path={ROUTES.USER_LIST} component={UserList}></AdminRoute>
          <AdminRoute path={ROUTES.ADMIN_EDIT_USER} component={AdminUserEdit}></AdminRoute>
          <SellerRoute path={ROUTES.PRODUCT_LIST_SELLER} component={ProductList}></SellerRoute>
          <SellerRoute path={ROUTES.ORDER_LIST_SELLER} component={OrderList}></SellerRoute>
          <Route path={ROUTES.HOME} component={Home} exact></Route>
      
    </BrowserRouter>

  );
}

export default App;
