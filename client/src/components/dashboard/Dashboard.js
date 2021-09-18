import React, { Fragment, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getCurrentProfile } from '../../actions/profile';
import Spinner from '../layout/Spinner';
import DashboardActions from './DashboardActions';
import Experience from './Experience';
import Education from './Education';
import { deleteAccount } from '../../actions/profile';


function Dashboard({ getCurrentProfile, auth: { user }, profile: { profile, loading }, deleteAccount }) {

    useEffect(() => {
        getCurrentProfile();
    }, [getCurrentProfile])

    return loading && profile === null ? ( <Spinner /> ) : 
    (
        <Fragment>
            <h1 className="large text-primary">Dashboard</h1>
            <p className="lead">
                <i className="fas fa-user"></i> Welcome { user && user.name }
            </p>
            {
                profile !== null ? (
                    <div>
                        <DashboardActions />
                        <Experience experience={profile.experience} />
                        <Education education={profile.education} />

                        <div className="my-2">
                            <button className="btn btn-danger" onClick={() => deleteAccount()}>
                                <i className="fas fa-user-minus"></i> Delete My Account
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <p>You do not have a profile, create one.</p>
                        <Link to="/create-profile" className="btn btn-primary my-1" >
                            Create Profile
                        </Link>
                    </div>
                )
            }
        </Fragment>
    );
};

const mapStateToProps = state => ({
    auth: state.auth,
    profile: state.profile
});

export default connect(mapStateToProps, { getCurrentProfile, deleteAccount })(Dashboard)
