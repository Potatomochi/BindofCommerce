import React from 'react';
import StarOutlineIcon from '@material-ui/icons/StarOutline';
import StarHalfIcon from '@material-ui/icons/StarHalf';
import StarIcon from '@material-ui/icons/Star';

export default function Rating(props) {
  const { rating, numReviews, caption } = props;
  return (
    <div className="rating">
      <span>
        <i
          className={
            rating >= 1
              ? <StarIcon />
              : rating >= 0.5
              ? <StarHalfIcon />
              : <StarOutlineIcon />
          }
        ></i>
      </span>
      <span>
        <i
          className={
            rating >= 2
              ? <StarIcon />
              : rating >= 1.5
              ? <StarHalfIcon />
              : <StarOutlineIcon />
          }
        ></i>
      </span>
      <span>
        <i
          className={
            rating >= 3
              ? <StarIcon />
              : rating >= 2.5
              ? <StarHalfIcon />
              : <StarOutlineIcon />
          }
        ></i>
      </span>
      <span>
        <i
          className={
            rating >= 4
              ? <StarIcon />
              : rating >= 3.5
              ? <StarHalfIcon />
              : <StarOutlineIcon />
          }
        ></i>
      </span>
      <span>
        <i
          className={
            rating >= 5
              ? <StarIcon />
              : rating >= 4.5
              ? <StarHalfIcon />
              : <StarOutlineIcon />
          }
        ></i>
      </span>
      {caption ? (
        <span>{caption}</span>
      ) : (
        <span>{numReviews + ' reviews'}</span>
      )}
    </div>
  );
}
