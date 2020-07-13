const passport = require('passport');
const KeycloakStrategy = require('./Strategy/keycloakStrategy')

class BreweryAuth {
    constructor(config) {
        this.host = config.host;
        this.realm = config.realm;
        this.clientID = config.clientID;
        this.clientSecret = config.clientSecret;
        this.callbackURL = config.callbackURL;
        this.authorizationURL = config.authorizationURL;
        this.tokenURL = config.tokenURL;
        this.userInfoURL = config.userInfoURL;
    }

    authenticate() {
       return (req, res, next) => {
            let authData = '';
            if(!req.session.authData) {
                passport.use('keycloak', new KeycloakStrategy({
                    host: this.host,
                    realm: this.realm,
                    clientID: this.clientID,
                    clientSecret: this.clientSecret,
                    callbackURL: this.callbackURL,
                    authorizationURL: this.authorizationURL,
                    tokenURL: this.tokenURL,
                    userInfoURL: this.userInfoURL
                },
                
                (accessToken, refreshToken, profile, done) => { 
                    const response = {
                        userInfo: profile,
                        tokens: {
                            access_token: accessToken,
                            refresh_token: refreshToken
                        }
                    };
                    if (res && res.statusCode === 200) {
                        authData = response
                        req.session.authData = response
                        return next();
                    } else {
                        req.session = null;
                        return next()
                    }
                }))
              return passport.authenticate('keycloak', null)(req, res, next);
            }
            return next()
        }
    }
}

module.exports = BreweryAuth;