const express = require('express');
const axios = require('axios');
const config = require('config');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const auth = require('../../middleware/auth');

const Profile = require('../../models/Profile');
const User = require('../../models/User');
const Post = require('../../models/Post');

router.get('/me', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);

        if(!profile){
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }

        res.json(profile);
    } 
    catch(err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Create and update profile
router.post('/', [ 
        auth, 
        [
            check('status', 'Status is required').not().isEmpty(),
            check('skills', 'Skills is required').not().isEmpty()
        ] 
    ], 
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // destructure the request
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            twitter,
            instagram,
            linkedin,
            facebook,
        } = req.body;

        const profileFields = {};
        profileFields.user = req.user.id;
        if(company) profileFields.comapany = company;
        if(website) profileFields.website = website;
        if(location) profileFields.location = location;
        if(bio) profileFields.bio = bio;
        if(status) profileFields.status = status;
        if(githubusername) profileFields.githubusername = githubusername;
        if(skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim());
        }

        // Build Social object
        profileFields.social = {};
        if(youtube) profileFields.social.youtube = youtube;
        if(twitter) profileFields.social.twitter = twitter;
        if(facebook) profileFields.social.facebook = facebook;
        if(linkedin) profileFields.social.linkedin = linkedin;
        if(instagram) profileFields.social.instagram = instagram;

        try {
            let profile = await Profile.findOne({ user: req.user.id });

            //Update
            if(profile) {
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id }, 
                    { $set: profileFields },
                    { new: true }
                );

                return res.json(profile);
            }

            // Create
            profile = new Profile(profileFields);

            await profile.save();
            res.json(profile);

        }
        catch(err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

    }
);

// get all profiles
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// get a users profile
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar']);
        if(!profile) return res.status(400).json({ msg: "No profile found for this user" });

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        if(err.kind == 'ObjectId') {
            return res.status(400).json({ msg: "No profile found for this user" });
        }

        res.status(500).send('Server Error');
    }
});

// Delete user, profile and posts
router.delete('/', auth, async (req, res) => {
    try {

        // delete user posts
        await Post.deleteMany({ user: req.user.id });

        // delete a profile
        await Profile.findOneAndRemove({ user: req.user.id });

        // delete a user
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'User deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Add experience to profile 
router.put('/experience', [
    auth, 
    [
        check('title', 'Title is required').not().isEmpty(),
        check('company', 'Company is required').not().isEmpty(),
        check('from', 'From date is required').not().isEmpty()
    ]
], 
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        profile.experience.unshift(newExp);

        await profile.save();

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// delete experience
router.delete('/experience/:exp_id', auth, async (req, res) => {

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        // get remove index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// add education to profile 
router.put('/education', [
    auth, 
    [
        check('school', 'School is required').not().isEmpty(),
        check('degree', 'Degree is required').not().isEmpty(),
        check('fieldofstudy', 'Field of Study is required').not().isEmpty(),
        check('from', 'From Date is required').not().isEmpty()
    ]
], 
async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    const {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    } = req.body;

    const education = {
        school,
        degree,
        fieldofstudy,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id })

        profile.education.unshift(education);

        await profile.save();

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// delete education
router.delete('/education/:edu_id', auth, async (req, res) => {

    try {
        const profile = await Profile.findOne({ user: req.user.id });

        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

})

// get github user repos
router.get('/github/:username', async (req, res) => {

    try {
        const uri = encodeURI(
            `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`,
        );

        const headers = {
            'user-agent': 'node.js',
            Authorization: `token ${config.get('githubToken')}`
        };

        const githubResponse = await axios.get(uri, { headers });
        return res.json(githubResponse.data);
        
    } catch (err) {
        console.error(err.message);
        res.status(404).json({ msg: 'No Github Profile found with this username' });
    }

})

module.exports = router;