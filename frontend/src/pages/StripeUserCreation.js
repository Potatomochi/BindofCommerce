import axios from 'axios';
import React from 'react'
import { useSelector } from 'react-redux';
import Header from '../components/Header/Header'

function StripeUserCreation() {
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    const email = userInfo.email
    const createStripeHandler = async() => {
        const {data} = await axios.post('/create-stripe-account' , {email})
        const relocateURL = data.url
        window.location.replace(relocateURL)
    }
    const updateStripeHandler = async() => {
        const {data} = await axios.post('/edit-stripe-account' , {email})
        const relocateURL = data.url
        window.location.replace(relocateURL)
    }
    return (
        <>
        <Header />
        <div className="pageContainer">
            <div className="row">
                <div className="col-1 centerAlign spacedOut">
                    <h2>New User</h2>
                    <p className="neatParas">If this is your first time using Stripe, you will need a Stripe Connect account which you can create by clicking the button below.</p>
                    <p className="neatParas">Note that you cannot pay with Credit cards, or will not get paid if customers choose to pay by Credit Cards for your products</p>
                    <button className="standardButton" onClick={createStripeHandler}>Create Stripe User</button>
                </div>

                <div className="col-2 centerAlign farRight ">
                    <h2>Existing Stripe User</h2>
                    <p className="neatParas">If you wish to update some details on your Stripe account, you may do so with the button below</p>
                    <button className="standardButton" onClick={updateStripeHandler}>Update Stripe Details</button>
                </div>
            </div>
        </div>
        </>
    )
}

export default StripeUserCreation
