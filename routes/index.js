const passport = require('passport');

const router = require('express').Router();

router.use('/api-docs', require('./swagger'));
router.get('/', (req, res) => {
    //#swagger.tag=['Welcome']
    res.send('Welcome to the Student Manager API!');
});
router.get('/ping', (req, res) => {
    //#swagger.tag=['Ping Pong]
    res.send('pong');
});

router.get('/logout-message', (req, res) => {
    res.send('Logged out');
});

router.get('/login', passport.authenticate('github', (req, res) => { }));

router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/logout-message');
    });
});

router.use('/students', require('./students'));
/*router.use('/',
    (docData = (req, res) => {
        let docData = {
            documentationURL: '',
        };
        res.send(docData);
    }));*/

module.exports = router;
