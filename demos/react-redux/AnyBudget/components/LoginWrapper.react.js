import AppWrapper from './AppWrapper.react';
import React from 'react';

export default class LoginWrapper extends React.Component {
  constructor() {
    super();

    this.state = {
      error: null,
      signup: false,
    };

    this.submit = this.submit.bind(this);
    this.keyDown = this.keyDown.bind(this);
    this.toggleSignup = this.toggleSignup.bind(this);
  }

  render() {
    if (this.props.user) {
      return (
        <div>
          <a className='logOut' onClick={this.props.logOut}>
            <svg viewBox='0 0 60 60'>
              <path d="M0,0 L30,0 L30,10 L10,10 L10,50 L30,50 L30,60 L0,60 Z"></path>
              <path d="M20,23 L40,23 L40,10 L60,30 L40,50 L40,37 L20,37 Z"></path>
            </svg>
          </a>
          <AppWrapper />
        </div>
      );
    }
    return (
      <div>
        <h1>AnyBudget</h1>
        <h2>Powered by Parse Lite, React & Redux</h2>
        <div className='loginForm' onKeyDown={this.keyDown}>
          {this.state.error ?
            <div className='row centered errors'>{this.state.error}</div> :
            null}
          <div className='row'>
            <label htmlFor='username'>Username</label>
            <input ref={r => this.username = r} id='username' type='text' />
          </div>
          <div className='row'>
            <label htmlFor='password'>Password</label>
            <input ref={r => this.password = r} id='password' type='password' />
          </div>
          <div className='row centered'>
            <a className='button' onClick={this.submit}>
              {this.state.signup ? 'Sign up' : 'Log in'}
            </a>
          </div>
          <div className='row centered'>
            or&nbsp;
            <a onClick={this.toggleSignup}>
              {this.state.signup ? 'log in' : 'sign up'}
            </a>
          </div>
        </div>
      </div>
    );
  }

  submit() {
    const username = this.username.value;
    const password = this.password.value;
    if (username.length && password.length) {
      if (this.state.signup) {
        this.props.signUp(username, password).then(() => {
          this.setState({error: null});
        }, (err) => {
          console.log(err);
          this.setState({error: 'Invalid account information'});
        });
      } else {
        this.props.logIn(username, password).then(() => {
          this.setState({error: null});
        }, () => {
          this.setState({error: 'Incorrect username or password'});
        });
      }
    } else {
      this.setState({error: 'Please enter all fields'});
    }
  }

  keyDown(e) {
    if (e.keyCode === 13) {
      this.submit();
    }
  }

  toggleSignup() {
    this.setState({signup: !this.state.signup});
  }
}
