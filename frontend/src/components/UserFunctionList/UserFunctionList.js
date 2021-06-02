import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'

function UserFunctionList() {
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    return (
        <div>
            <h2>Your Functions</h2>
            <ul>
                <li><Link to="/edit-profile">Edit Profile</Link></li>
                <li><Link to="/order-history">Your Order History</Link></li>
                <li><Link to="/stripe-onboarding">Enable Credit Card Payments</Link></li>
                {userInfo.isSeller && (
                    <>
                <li><Link to="/productlist/seller">Your Products</Link></li>
                <li><Link to="/orderlist/seller">Your Order History</Link></li>
                </>
                )}
                {userInfo.isAdmin&& (
                    <>
                <li><Link to="/productlist">All Products</Link></li>

                </>
                )}

            </ul>
        </div>
    )
}

export default UserFunctionList
