import React from 'react';

import './login-page.css';

export default function LoginPage() {
    return (
        <div className='LoginPage'>
          <button>
            <a href={'/api/auth/google'}>Login with Google</a>
          </button>
        </div>
    );
}
