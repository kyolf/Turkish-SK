import React from 'react';
import {connect} from 'react-redux';
import * as Cookies from 'js-cookie';

import * as actions from '../actions';

import './question-page.css';

class QuestionPage extends React.Component {
  //Fetch for the list of Vocabs from database 
  componentDidMount() {
    const accessToken = Cookies.get('accessToken');
    this.props.dispatch(actions.fetchVocab(accessToken));
  }

  //Sends the necessary information to the backend in order to do the correctAnswer logic
  onSubmit(e) {
    e.preventDefault();
    const accessToken = Cookies.get('accessToken');
    const userAnswer = this.textInput.value.trim().toLowerCase();
    this.props.dispatch(actions.answerQuestion(userAnswer, this.props.vocabWords, this.props.currentUser, 
      this.props.score, this.props.numSeenWords, accessToken));        
    this.textInput.value = '';
  }

  //renders the Question page based on your input
  render() {
    let display = '';
    if (this.props.lastAnswer) {
      display = 'green';
    }
    else if (this.props.lastAnswer === false) { 
      display = 'red'
    };
    return (
      <div className='question-page'>
        <div className={`question-panel ${display}`}>
          <div className='score'>Score: {this.props.score}/{this.props.numSeenWords}</div>
          <form onSubmit={e => this.onSubmit(e)}>
            <ul className='question-list'>
              <li key={this.props.numSeenWords}>{ this.props.vocabWords.head != null ? this.props.vocabWords.head.turkWord : null}</li>
            </ul>
            <input type='text' placeholder='Enter the corresponding English word' 
              ref={input => this.textInput = input} onChange={e=>this.props.dispatch(actions.resetFeedBack())} required></input>
            <button type='submit' >Submit</button>
          </form>
        </div>
        {this.props.lastAnswer === false ?
        <div className='previous-question'>
          <ul className='question-list'>
            <li key={this.props.numSeenWords-1}>{this.props.previousWord.turkWord} : {this.props.previousWord.engWord}</li>
          </ul>
        </div>
        : null }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  vocabWords: state.vocabWords,
  score: state.score,
  numSeenWords: state.numSeenWords,
  lastAnswer: state.lastAnswer,
  previousWord: state.previousWord,
  currentUser: state.currentUser
});

export default connect(mapStateToProps)(QuestionPage);

