import React, { useState } from 'react';
import SearchIcon from '@material-ui/icons/Search';
import "./SearchBox.css"
export default function SearchBox(props) {
  const [name, setName] = useState('');
  const submitHandler = (e) => {
    e.preventDefault();
    props.history.push(`/search/name/${name}`);
  };
  return (
    <form className="search" onSubmit={submitHandler}>
      <div className="row">
        <input type="text" name="q" id="q" onChange={(e) => setName(e.target.value)}></input>
        <button className="searchButton" type="submit">
          <SearchIcon />
        </button>
      </div>
    </form>
  );
}
