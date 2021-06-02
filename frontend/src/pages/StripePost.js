import axios from 'axios';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import Header from '../components/Header/Header'
import {loadStripe} from '@stripe/stripe-js'




function StripePost (props) {
    const userSignin = useSelector((state) => state.userSignin);
    const { userInfo } = userSignin;
    const email = userInfo.email
    const [stripeData, setStripeData] = useState()
    const [requirements , setRequirements] = useState({})
    const [accountNumber , setAccountNumber] = useState('');
    const [bankCode , setBankCode] = useState('');
    const [branchCode, setBranchCode] = useState('')

    const [accountType , setAccountType] = useState('');
    const [accountName , setAccountName] = useState(''); 


    const stripeRetriveData = async () =>{
        const {data} = await axios.post('/api/get-stripe-user' , {email})
        setStripeData(data)
        setRequirements(data.requirements)
    }


    if(!stripeData){
        stripeRetriveData()
    }

    const createBankAccount = async(e) => {
        e.preventDefault()
        
        const {REACT_APP_STRIPE_API_KEY} = process.env
        const stripe = await loadStripe(REACT_APP_STRIPE_API_KEY)
        const {token, error} = await stripe.createToken('bank_account', {
            country: 'sg',
            currency: 'sgd',
            routing_number: branchCode + '-' + bankCode,
            account_number: accountNumber,
            account_holder_name: accountName,
            account_holder_type: accountType,
          });
        if(token){
            const {data} = await axios.post("/api/stripe-create-bank-account" , {email, token})
            if(data){
                props.history.push('/stripe-onboarding-success')
            }
        }if(error){
            alert(error)
        }
    }

    const returnHomeHandler = async () =>{
        props.history.push('/')
    }
    const goBackHandler = async () => {
        props.history.push('/stripe-user-creation')
    }
    return (
        <>
        <Header />
        <div className="pageContainer">
            {userInfo.isSeller ? ( 
                stripeData && (
                stripeData.external_accounts.total_count === 0 ? (
                    <div>
                        <h2>Nicely Done</h2>
                        <p>One last step, Stripe requires your bank account details so they know where to transfer your earnings to. If you don't do this step, you will see the missing 'external-account' error in the requirements list below.</p>
                    <div className="formBase">
                        <form className="base" onSubmit={createBankAccount}>
                            <h1>Bank Account Details</h1>
                            <label>Account Number</label>
                            <input type="text" id="accountNumber" value={accountNumber} placeholder="Enter the number of your account" onChange={(e) => setAccountNumber(e.target.value)}></input>
                            <label>Account Name</label>
                            <input type="text" id="accountName" value={accountName} placeholder="Enter the name of the Account Holder" onChange={(e) => setAccountName(e.target.value)}></input>
                            <label>Branch Code</label>
                            <input type="text" id="Branch Code" value={branchCode} placeholder="Enter your Branch Code" onChange={(e) => setBranchCode(e.target.value)}></input>
                            <label>Bank Code</label>
                            <input type="text" id="Bank Code" value={bankCode} placeholder="Enter your Bank Code" onChange={(e) => setBankCode(e.target.value)}></input>
                            <label>Country of Account</label>
                            <div className="select formSelect">
                                <select>
                                    <option value="sg">Singapore</option>
                                </select>
                            </div>
                            <label>Account Type</label>
                            <div className="select formSelect">
                                <select onChange={(e) => setAccountType(e.target.value)}>
                                    <option value="individual">Individual</option>
                                    <option value="company">Company</option>
                                </select>
                            </div>
                           <button type="submit">Submit</button>
                        </form>
                        </div>
                    <button onClick={createBankAccount}>stuff</button>
                        </div>
                ) : ( <div>
                    <h2>Nicely done,</h2>
                    <p> you have finished setting up your Bank Account, we can now transfer your earnings into your bank account! </p>
                    <button className="standardButton" onClick={returnHomeHandler}>Return Home</button>
                    </div>)
            )) : 
            (stripeData.charges_enabled ? (<>
            <h2>Nice Job</h2>
                <p> You are all set to pay with credit cards!</p>
                <button className="standardButton" onClick={returnHomeHandler}>Return Home</button>
                </>) :(
                    <>
                    <h2>Whoops</h2>
                    <p>Looks like you have some problems with your Stripe account.</p>
                    <button className="standardButton" onClick={goBackHandler}>Return to onboarding</button>
                    </>
                )) 
            
            }
            {requirements.currently_due && (requirements.currently_due.length !== 0  ? (<><p>Looks like you still lack some key details :</p>
            <ul>
                {requirements.currently_due && (requirements.currently_due.map((x) =>(<li>{x}</li>)))}
            </ul></>) : (<></>))}

            
        </div>
        </>
    )
}

export default StripePost
