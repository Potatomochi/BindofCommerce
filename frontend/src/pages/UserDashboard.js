import React from 'react'
import { useSelector } from 'react-redux';
import Header from '../components/Header/Header'
import UserFunctionList from '../components/UserFunctionList/UserFunctionList';

function UserDashboard() {
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;

    return (
        <>
        <Header/>
        <div className="pageContainer">
            <div className="pageInnerFlex">
                <div className="paddingLeft">
                    <UserFunctionList />
                </div>
                <div className="paddingRight">
                    <div className="pageContainer">
                    <h2>Welcome back, {userInfo.name}</h2>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}

export default UserDashboard
