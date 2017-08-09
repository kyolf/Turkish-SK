import React from 'react';
import {connect} from 'react-redux';
import * as Cookies from 'js-cookie';

import {fetchVocab} from '../actions';

import './question-page.css';

class QuestionPage extends React.Component {

    componentDidMount() {
        const accessToken = Cookies.get('accessToken');
        this.props.dispatch(fetchVocab(accessToken));
    }

    render() {
        // const vocabWords = this.props.vocabWords.map((word, index) =>
        //     <li key={index}>{word.turkWord}</li>
        // );
        console.log(this.props.vocabWords);
        return (
            <div className='question-panel'>
                <div className='score'>Score: 0/10</div>

                <form>
                    <ul className="question-list">
                        <li key={10}>{this.props.vocabWords.length > 0 ? this.props.vocabWords[10].turkWord : null}</li>
                    </ul>
                    <input type='text' placeholder='Enter the corresponding English word'></input>
                    <button type='submit' >Submit</button>
                </form>
            </div>
        );
    }

}

const mapStateToProps = state => ({
    vocabWords: state.vocabWords,
});

export default connect(mapStateToProps)(QuestionPage);

