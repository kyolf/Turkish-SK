import React from 'react';
import {connect} from 'react-redux';
import * as Cookies from 'js-cookie';

import {fetchVocab, getNextWord, incrementScore} from '../actions';

import './question-page.css';

class QuestionPage extends React.Component {

    componentDidMount() {
        const accessToken = Cookies.get('accessToken');
        this.props.dispatch(fetchVocab(accessToken));
    }

    onSubmit(e){
        e.preventDefault();
        if(this.textInput.value === this.props.vocabWords[this.props.current].engWord){
            console.log("you got it right: ", this.props.vocabWords[this.props.current].engWord);
            this.props.dispatch(incrementScore());
        }
        else{
            console.log("you got it wrong: ", this.props.vocabWords[this.props.current].engWord);
        }
        this.props.dispatch(getNextWord(this.props.current));
        this.textInput.value = '';
    }

    render() {
        // const vocabWords = this.props.vocabWords.map((word, index) =>
        //     <li key={index}>{word.turkWord}</li>
        // );
        console.log(this.props.vocabWords);
        console.log(this.props.current);
        return (
            <div className='question-panel'>
                <div className='score'>Score: {this.props.score}/{this.props.vocabWords.length}</div>

                <form onSubmit={e => this.onSubmit(e)}>
                    <ul className="question-list">
                        <li key={this.props.current}>{this.props.vocabWords.length > 0 ? this.props.vocabWords[this.props.current].turkWord : null}</li>
                    </ul>
                    <input type='text' placeholder='Enter the corresponding English word' 
                        ref={input => this.textInput = input}></input>
                    <button type='submit' >Submit</button>
                </form>
            </div>
        );
    }

}

const mapStateToProps = state => ({
    vocabWords: state.vocabWords,
    current: state.currentWord,
    score: state.score,
});

export default connect(mapStateToProps)(QuestionPage);

