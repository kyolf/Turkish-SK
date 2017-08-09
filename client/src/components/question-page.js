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
        const vocabWords = this.props.vocabWords.map((word, index) =>
            <li key={index}>{word}</li>
        );

        return (
            <div className='question-panel'>
                <div className='score'>Score: 10/10</div>

                <form>
                    <ul className="question-list">
                        {vocabWords}
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

