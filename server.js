const express = require('express');
const app = express();
const mongodb = require('./data/database');
const bodyParser = require("body-parser");
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github').Strategy;
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
}))
app.use(passport.initialize());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-Width, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use(cors(
    {
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        origin: '*',
    }
));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/', require('./routes'));

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
    function (accessToken, refreshToken, profile, done) {
        return done(null, profile);
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    return done(null, user);
});

app.get('/', (req, res) => { res.send(res.send(req.session.user != undefined ? `Logged in as ${req.session.user.displayName}` : 'Logged Out')) });

app.get('/github/callback', passport.authenticate('github', {
    failureRedirect: '/api-docs', session: false
}),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    });


process.on('uncaughtException', (err, origin) => {
    console.log(process.stderr.fd, `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});

mongodb.initDb((err) => {
    if (err) {
        console.log(err);
    } else {
        app.listen(port, () => {
            console.log(`Server running on port ${port}`);
        })
    }
});
