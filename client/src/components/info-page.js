import React from 'react';

import './info-page.css';

export default function InfoPage() {
  return (
    <div className='InfoPage'>
      <h1>Why you use our app?</h1>
      <main>
        <section className='info_block'>
          <h2>Beginner Friendly</h2>
          <p>Don't know any Turkish? Don't worry about it! When you get Turkish words wrong, a flash card 
             will show up and show the English meaning that corresponds to the Turkish word!</p>
        </section>
        <section className='info_block middle'>
          <h2>Spaced Repetition</h2>
          <p>Don't be afraid to get answers wrong! Wrong answers will show up more 
           often to ensure that you remember the English meaning of a Turkish word!</p>
        </section>
        <section className='info_block'>
          <h2>Start at where you left off</h2>
          <p>Don't worry about accidentally closing or refreshing the page! The app will
             save your progress everytime you submit an answer!</p>
        </section>
      </main>
    </div>
  );
}
