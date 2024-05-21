const isSignedIn = (req, res, next) => { // makes sure the user is signed in
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/auth/sign-in');
    }
};

module.exports = isSignedIn