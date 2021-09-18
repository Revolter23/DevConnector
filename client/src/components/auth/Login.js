import React, { Fragment, useState } from 'react'
import { Link, Redirect } from 'react-router-dom'

import { connect } from 'react-redux';
import { login } from '../../actions/auth';

function Login({login, isAuthenticated}) {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    function valueChange(event) {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    function valueSubmit(event) {
        event.preventDefault();
        login(email, password);
    }

    if(isAuthenticated) {
        return <Redirect to="/dashboard" />
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Sign In</h1>

            <p className="lead"><i className="fas fa-user"></i> Sign In To Your Account</p>

            <form className="form" onSubmit={valueSubmit} >

                <div className="form-group">
                    <input
                        type="email" 
                        placeholder="Email Address" 
                        name="email" 
                        value={email}
                        onChange={valueChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        minLength="6"
                        value={password}
                        onChange={valueChange}
                        required
                    />
                </div>

                <input type="submit" className="btn btn-primary" value="Login" />
            </form>

            <p className="my-1">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
        </Fragment>
    )
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {login})(Login);
