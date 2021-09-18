import React, { Fragment, useState } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux';
import { addEducation } from '../../actions/profile'

function AddEducation({ addEducation, history }) {
    const [formData, setFormData] = useState({
        school: '',
        degree: '',
        fieldofstudy: '',
        from: '',
        current: false,
        to: '',
        description: '',
    });

    const [toDateDisabled, toggleDisabled] = useState(false);

    const { school, degree, fieldofstudy, from, current, to, description } = formData;

    function handleChange(event) {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    function handleSubmit(event) {
        event.preventDefault();
        addEducation(formData, history);
    }

    return (
        <Fragment>
            <h1 className="large text-primary">
                Add Your Education
            </h1>

            <p className="lead">
                <i className="fas fa-graduation-cap"></i> Add any school, bootcamp, etc that
                you have attended
            </p>
            <small>* = required field</small>

            <form className="form" onSubmit={handleSubmit}>

                <div className="form-group">
                <input
                    type="text"
                    placeholder="* School or Bootcamp"
                    name="school"
                    value={school}
                    onChange={handleChange}
                    required
                />
                </div>

                <div className="form-group">
                <input
                    type="text"
                    placeholder="* Degree or Certificate"
                    name="degree"
                    value={degree}
                    onChange={handleChange}
                    required
                />
                </div>

                <div className="form-group">
                <input type="text" placeholder="Field Of Study" name="fieldofstudy" value={fieldofstudy} onChange={handleChange} />
                </div>

                <div className="form-group">
                <h4>From Date</h4>
                <input type="date" name="from" value={from} onChange={handleChange} />
                </div>

                <div className="form-group">
                <p>
                    <input type="checkbox" checked={current} name="current" value={current} onChange={() => {
                        setFormData({ ...formData, current: !current })
                        toggleDisabled(!toDateDisabled)
                    }} /> Current School or Bootcamp
                </p>
                </div>

                <div className="form-group">
                <h4>To Date</h4>
                <input type="date" name="to" value={to} onChange={handleChange} disabled={toDateDisabled ? 'disabled' : ''} />
                </div>

                <div className="form-group">
                <textarea
                    name="description"
                    cols="30"
                    rows="5"
                    placeholder="Program Description"
                    value={description} 
                    onChange={handleChange}
                ></textarea>
                </div>

                <input type="submit" className="btn btn-primary my-1" />

                <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>

            </form>
        </Fragment>
    )
}

export default connect(null, { addEducation })(AddEducation)
