import React, { Fragment, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { addExperience } from '../../actions/profile'

function AddExperience({ addExperience, history }) {
    const [formData, setFormData] = useState({
        company: '',
        title: '',
        location: '',
        from: '',
        to: '',
        current: false,
        description: '',
    });

    const [toDateDisabled, toggleDisabled] = useState(false);

    const { company, title, location, from, to, current, description } = formData;

    function handleChange(event) {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    function handleSubmit(event) {
        event.preventDefault();
        addExperience(formData, history);
    }

    return (
        <Fragment>
            <h1 class="large text-primary">
                Add An Experience
            </h1>

            <p class="lead">
                <i class="fas fa-code-branch"></i> Add any developer/programming
                positions that you have had in the past
            </p>
            <small>* = required field</small>

            <form class="form" onSubmit={handleSubmit} >

                <div class="form-group">
                <input type="text" placeholder="* Job Title" name="title" value={title} onChange={handleChange} required />
                </div>

                <div class="form-group">
                <input type="text" placeholder="* Company" name="company" value={company} onChange={handleChange} required />
                </div>

                <div class="form-group">
                <input type="text" placeholder="Location" name="location" value={location} onChange={handleChange} />
                </div>

                <div class="form-group">
                <h4>From Date</h4>
                <input type="date" name="from" value={from} onChange={handleChange} />
                </div>

                <div class="form-group">
                <p><input type="checkbox" checked={current} name="current" value={current} onChange={() => {
                    setFormData({ ...formData, current: !current })
                    toggleDisabled(!toDateDisabled)
                }}  /> {' '}Current Job</p>
                </div>

                <div class="form-group">
                <h4>To Date</h4>
                <input type="date" name="to" value={to} onChange={handleChange} disabled={toDateDisabled ? 'disabled' : ''} />
                </div>

                <div class="form-group">
                <textarea
                    name="description"
                    cols="30"
                    rows="5"
                    placeholder="Job Description"
                    value={description} 
                    onChange={handleChange}
                ></textarea>
                </div>

                <input type="submit" class="btn btn-primary my-1" />

                <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>

            </form>
        </Fragment>
    )
}

export default connect(null, { addExperience })(AddExperience)