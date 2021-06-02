import React from 'react'
import { Link } from 'react-router-dom'
import Header from '../components/Header/Header'

function StripePre(props) {

  const  buttonClickHandler = () =>{
        props.history.push("/stripe-user-creation")
    }
    return (
        <>
        <Header />
        <div className="pageContainer">
            <div className="row">
                <div className="col-1 spacedOut">
                    <h2>Credit Card Payments with Bindof</h2>
                    <p className="neatParas">Bindof partners with Stripe to allow fast and secure credit card payments from one user to another. This also means that we use Stripe to pay your gained revenue if you decide to sell on our platform</p>
                    <p className="neatParas">Please note, you will incur small charges from using Stripe as a service for credit card payments. Bindof does NOT charge any extra fees for your transactions.</p>
                    <div>
                    <button className="standardButton" onClick={buttonClickHandler}>Onboard with Stripe</button>
                    </div>
                    <strong><Link to="/">No thanks, I prefer to only use Cash Payments</Link></strong>
                </div>
                <div className="col-2 spacedOut">
                    <img src="http://bindof.com/wp-content/uploads/2019/11/Mainslider-B-04.jpg" className="large" alt="Bindof Onboarding"></img>
                </div>

            </div>
            
        </div>
        </>
    )
}

export default StripePre
