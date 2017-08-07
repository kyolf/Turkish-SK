import React from 'react';

import './header.css';

export default function Header(){
    return( 
         <div className="header"> 
            <h1><i className="fa fa-repeat" aria-hidden="true"></i> Yinelemek</h1>
            <h3>Learn Turkish with the help of spaced repetition.</h3>
            {/* <button>Logout</button> */}
         </div>
    );
}