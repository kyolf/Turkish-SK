import React from 'react';

import './login-page.css';

export default function LoginPage() {
  return (
    <div className='LoginPage'>
      <a href={'/api/auth/google'}>
        <button>
          Login with Google
        </button>
      </a>
    </div>
  );
}
