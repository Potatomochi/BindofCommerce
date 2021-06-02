import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {Link, Route } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { listProductCategories } from '../../actions/productActions';
import { signout } from '../../actions/userActions';
import LoadingBox from '../LoadingBox';
import MessageBox from '../MessageBox';
import SearchBox from '../SearchBox';
import CloseIcon from '@material-ui/icons/Close';


import "../../index.css";
import "./Header.css";

function Header() {
    const cart = useSelector((state) => state.cart);
    const { cartItems } = cart;

    const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
    const dispatch = useDispatch();
  
    const productCategoryList = useSelector((state) => state.productCategoryList);
    const {
      loading: loadingCategories,
      error: errorCategories,
      categories,
    } = productCategoryList;
    useEffect(() => {
      dispatch(listProductCategories());
    }, [dispatch]);
    
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    const signoutHandler = () => {
        dispatch(signout());
      };
    return (
        <>
        <div className="headerContainer">
        <div className="brandingLeft">
          <div className="sidebarContainer">
            <button type="button" className="open-sidebar" onClick={sidebarIsOpen ? (() => setSidebarIsOpen(false)) : (() => setSidebarIsOpen(true))}>
              <MenuIcon fontSize="large"/>
            </button>
          </div>
            <div>
            <Link className="brand" to="/">
              <img src="http://bindof.com/wp-content/uploads/2019/11/Bindof-White-Big.png" className="headerLogo" alt="Bindof"/>
            </Link>
            </div>
        </div>
        <div className="searchBar">
          <Route
            render={({ history }) => (
              <SearchBox history={history}></SearchBox>
            )}
          ></Route>
        </div>
        

        <div className="headerRightContainer">
        <Link to="/cart" className="headerLink">
          <div className="cartIcon">
          <ShoppingCartIcon fontSize="large"/>
          
          {cartItems.length > 0 && (
            <span className="badge">{cartItems.length}</span>
          )}
          </div>
        </Link>
        {userInfo ? (
            <div className="dropdown">
              <button className="dropbtn">{userInfo.name}<span className="iconExpand"><ExpandMoreIcon/></span></button>
              <div className="dropdown-content">
              <Link to="/user-dashboard" className="dropdownLink">Your Dashboard</Link>
              <Link to="/order-history" className="dropdownLink">Order History</Link>
              <Link to="/" onClick={signoutHandler} className="dropdownLink">Sign Out</Link>
              </div>
            </div>
        ) : (
          <div className="signIn">
          <Link to="/sign-in" className="headerLink">Sign In</Link>
          </div>
        )}
        </div>
      </div>
    
      <aside className={sidebarIsOpen ? 'open' : ''}>
          <ul className="categories">
            <li>
              <strong>Categories</strong>
              <button
                onClick={() => setSidebarIsOpen(false)}
                className="close-sidebar"
                type="button"
              >
                  <CloseIcon />
              </button>
            </li>
            {loadingCategories ? (
              <LoadingBox></LoadingBox>
            ) : errorCategories ? (
              <MessageBox variant="danger">{errorCategories}</MessageBox>
            ) : (
              categories.map((c) => (
                <li key={c}>
                  <Link
                    to={`/search/category/${c}`}
                    onClick={() => setSidebarIsOpen(false)}
                  >
                    {c}
                  </Link>
                </li>
              ))
            )}
          </ul>
        </aside>
      </>
    )
}

export default Header


// {userInfo && userInfo.isSeller && (
//   <div className="dropdown">
//     <Link to="#admin" className="headerLink">
//         Seller <i className="fa fa-caret-down"></i>
//     </Link>
//     <ul className="dropdown-content">
//     <li>
//       <Link to="/productlist/seller">Products</Link>
//     </li>
//     <li>
//       <Link to="/orderlist/seller">Orders</Link>
//     </li>
//   </ul>
// </div>
// )}

// {userInfo && userInfo.isAdmin && (
//   <div className="dropdown">
//     <Link to="#admin" className="headerLink">
//       Admin <i className="fa fa-caret-down"></i>
//     </Link>
//     <ul className="dropdown-content">
//       <li>
//         <Link to="/dashboard">Dashboard</Link>
//       </li>
//       <li>
//         <Link to="/productlist">Products</Link>
//       </li>
//       <li>
//         <Link to="/orderlist">Orders</Link>
//       </li>
//       <li>
//         <Link to="/userlist">Users</Link>
//       </li>
//     </ul>
//   </div>
// )}