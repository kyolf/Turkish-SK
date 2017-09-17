import React from 'react';

import './header.css';

export default function Header(props) {
  return( 
    <div className="header"> 
      <h1><i className="fa fa-repeat" aria-hidden="true"></i> Yinelemek</h1>
        <h3>Learn Turkish with the help of spaced repetition.</h3>
        {props.currentUser ? 
          <a href={'/api/auth/logout'}>
            <button>Logout</button>
          </a> : 
          <a href={'/api/auth/google'}>
            <button>Login with Google</button>
          </a>}
    </div>
  );
}