const passport = require('passport');

const router = require('express').Router();

router.use('/api-docs', require('./swagger'));
router.get('/', (req, res) => {
    //#swagger.tag=['Hello World]
    res.send('Hello World!');
});
router.get('/ping', (req, res) => {
    //#swagger.tag=['Ping Pong]
    res.send('pong');
});

router.get('/login', passport.authenticate('github', { session: false }), (req, res) => { });

router.get('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
});

router.use('/students', require('./students'));
router.use('/',
    (docData = (req, res) => {
        let docData = {
            documentationURL: '',
        };
        res.send(docData);
    }));

module.exports = router;
