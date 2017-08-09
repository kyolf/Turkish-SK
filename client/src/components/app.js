import React from 'react';
import * as Cookies from 'js-cookie';
import {connect} from 'react-redux';

import QuestionPage from './question-page';
import LoginPage from './login-page';
import Header from './header';
import {fetchMe} from '../actions';

import './app.css';

class App extends React.Component {

    componentDidMount() {
        // Job 4: Redux-ify all of the state and fetch calls to async actions.
        const accessToken = Cookies.get('accessToken');
        if (accessToken) {
            this.props.dispatch(fetchMe(accessToken));
        }
    }

    render() {

        return( 
          <div className="App">
            <Header currentUser={this.props.currentUser}/>
            { (!this.props.currentUser) ? <LoginPage /> :  <QuestionPage /> }
          </div>
        );
    }
}

const mapStateToProps = state => ({
    currentUser: state.currentUser,
});

export default connect(mapStateToProps)(App);
