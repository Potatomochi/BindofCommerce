import React from 'react'
import { Link } from 'react-router-dom';
import "./Card.css";
import "../../pages/styles/defaultStyles.css"
function Card(props) {
    const { product } = props;
    return (
        <div key={product._id} className="product-card">
        <Link to={`/product/${product._id}`} className="standard-link">
        <img className="product-card-img" src={product.image} alt={product.name} />
        </Link>
        <div className="informations-container">
          <Link to={`/product/${product._id}`}>
            <h2 className="title">{product.name}</h2>
          </Link>
          <p className="sub-title">{product.description}</p>
          <p className="price">${product.price}</p>
            <div className="productcard-seller">
              <Link to={`/seller/${product.seller._id}`} className="standard-link">
                {product.seller.name}
              </Link>
            </div>

        </div>
      </div>
        
    )
}

export default Card
