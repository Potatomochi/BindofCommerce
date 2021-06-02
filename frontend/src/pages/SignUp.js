import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { register } from '../actions/userActions';
import Header from '../components/Header/Header';
import LoadingBox from '../components/LoadingBox';
import MessageBox from '../components/MessageBox';

import "./styles/SignIn.css"

export default function RegisterScreen(props) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSeller, setIsSeller] = useState(false);
  const [businessName , setBusinessName] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [businessURL, setBusinessURL] = useState('');
  const [businessPhone,setBusinessPhone] = useState('');
  const [businessEmail , setBusinessEmail] = useState('');


  const redirect = props.location.search
    ? props.location.search.split('=')[1]
    : '/';

  const userRegister = useSelector((state) => state.userRegister);
  const { userInfo, loading, error } = userRegister;

  const dispatch = useDispatch();
  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Password and confirm password are not match');
    } else {
      dispatch(register(name, email, password, isSeller , businessName,businessDescription, businessEmail,businessPhone,businessURL));
    }
  };
  useEffect(() => {
    if (userInfo) {
      props.history.push(redirect);
    }
  }, [props.history, redirect, userInfo]);
  return (
    <>
    <Header />
    <div className="signContainers">
    
    <div className="formBase">
      <form className="base" onSubmit={submitHandler}>

          <h1>Create Account</h1>

        {loading && <LoadingBox></LoadingBox>}
        {error && <MessageBox variant="danger">{error}</MessageBox>}


          <input
            type="text"
            id="name"
            placeholder="Enter your name"
            required
            onChange={(e) => setName(e.target.value)}
          ></input>



          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            required
            onChange={(e) => setEmail(e.target.value)}
          ></input>


          <input
            type="password"
            id="password"
            placeholder="Enter a password"
            required
            onChange={(e) => setPassword(e.target.value)}
          ></input>


          <input
            type="password"
            id="confirmPassword"
            placeholder="Confirm your password"
            required
            onChange={(e) => setConfirmPassword(e.target.value)}
          ></input>

          <label>Do you intend to sell on our platform?</label>
          <input type="checkbox" onChange={(e) =>setIsSeller(e.target.checked)}></input>
          {isSeller && (
            <>
                <input type="text" id="businessName" placeholder="Enter your Business Name" required onChange={(e) => setBusinessName(e.target.value)} ></input>
                <input type="text" id="businessURL" placeholder="Enter your Business Website" required onChange={(e) => setBusinessURL(e.target.value)}></input>
                <input type="text" id="businessPhone" placeholder="Enter your Business Phone" required onChange={(e) => setBusinessPhone(e.target.value)}></input>
                <input type="text" id="businessEmail" placeholder="Enter your Business Email" required onChange={(e) => setBusinessEmail(e.target.value)}></input>
                <textarea placeholder="Enter your business description" onChange={(e) => setBusinessDescription(e.target.value)} ></textarea>
              </>
          )}
          <button className="primary" type="submit">
            Register
          </button>




            <p>Already have an account?<Link className="formLink" to={`/sign-in?redirect=${redirect}`}> Sign in here.</Link></p>


      </form>
    </div>
    </div>
    </>
  );
}
