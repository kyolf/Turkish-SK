import React from 'react';
import {connect} from 'react-redux';
import * as Cookies from 'js-cookie';

import * as actions from '../actions';

import './question-page.css';

class QuestionPage extends React.Component {

    componentDidMount() {
        const accessToken = Cookies.get('accessToken');
        this.props.dispatch(actions.fetchVocab(accessToken));
    }

    onSubmit(e){
        e.preventDefault();
        const userAnswer = this.textInput.value.trim().toLowerCase();
        this.props.dispatch(actions.submitAnswer(userAnswer, this.props.vocabWords));
        
        this.textInput.value = '';
    }

    render() {
        console.log(this.props.vocabWords.head);
        return (
            <div className='question-panel'>
                <div className='score'>Score: {this.props.score}/{this.props.numSeenWords}</div>

                <form onSubmit={e => this.onSubmit(e)}>
                    <ul className="question-list">
                        <li key={this.props.numSeenWords}>{ this.props.vocabWords.head != null ? this.props.vocabWords.head.turkWord : null}</li>
                    </ul>
                    <input type='text' placeholder='Enter the corresponding English word' 
                        ref={input => this.textInput = input} required></input>
                    <button type='submit' >Submit</button>
                </form>
            </div>
        );
    }

}

const mapStateToProps = state => ({
    vocabWords: state.vocabWords,
    score: state.score,
    numSeenWords: state.numSeenWords,
});

export default connect(mapStateToProps)(QuestionPage);

