import React from 'react'
import Header from '../components/Header/Header'

function CheckOutSuccess(props) {
    const homeHandler = () => {
        props.history.push('/')
    }
    return (
        <>
        <Header />
        <div className="pageContainer">
            <h2>Thanks for shopping with us!</h2>
            <button className="standardButton" onClick={homeHandler}>Return home!</button>
        </div>
        </>
    )
}

export default CheckOutSuccess
