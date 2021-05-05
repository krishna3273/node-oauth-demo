const googleStrategy=require('passport-google-oauth20').Strategy
const GitHubStrategy = require('passport-github2').Strategy;
const mongoose=require('mongoose')
const GoogleUser=require('../models/GoogleUser')
const GithubUser=require('../models/GithubUser')

module.exports={
    google:function(passport){
        passport.use(new googleStrategy({
            clientID:process.env.GOOGLE_CLIENT_ID,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET,
            callbackURL:'/auth/google/callback'
        },async (accessToken,refreshToken,profile,done)=>{
            try {
                let user=await GoogleUser.findOne({googleId:profile.id})
                if(user){
                    done(null,user)
                }
                else{
                    const newUser={
                        googleId:profile.id,
                        displayName:profile.displayName,
                        firstName:profile.name.givenName,
                        lastName:profile.name.familyName,
                        image:profile.photos[0].value
                    }
                    user=await GoogleUser.create(newUser)
                    done(null,user)
                }
            } catch (error) {
                console.log(error);
            }
        }))


        passport.serializeUser((user, done)=>{
            done(null, user.id);
        });
        
        passport.deserializeUser((id, done)=>{
            GoogleUser.findById(id, (err, user)=> done(err, user));
        });
    },
    github:function(passport){
        passport.use(new GitHubStrategy({
            clientID:process.env.GITHUB_CLIENT_ID,
            clientSecret:process.env.GITHUB_CLIENT_SECRET,
            callbackURL:'/auth/github/callback'
        },async (accessToken,refreshToken,profile,done)=>{
            console.log(profile);
            try{
                let user=await GithubUser.findOne({githubId:profile.id})
                if(user){
                    done(null,user)
                }
                else{
                    displayName=profile.displayName
                    if(displayName===null) displayName=profile.username
                    const newUser={
                        githubId:profile.id,
                        displayName:displayName,
                        username:profile.username,
                        image:profile.photos[0].value
                    }
                    user=await GithubUser.create(newUser)
                    done(null,user)
                }
            } catch (error) {
                console.log(error);
            }
        }))
        passport.serializeUser((user, done)=>{
            done(null, user.id);
        });
        
        passport.deserializeUser((id, done)=>{
            GithubUser.findById(id, (err, user)=> done(err, user));
        });
    }
}