const express = require('express');
const mysql2 = require('mysql2');
const jwt = require('jsonwebtoken');
const cookie_parser = require('cookie-parser');

const dotenv = require('dotenv').config();

const app = express();

app.use(cookie_parser());
app.listen(5001);

let refreshTokens = [];

const authMiddleware = (req, res, next) => {
    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1];
    const token = req.params.at;
    if(!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_AT_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        req.user = user;

        next();
    })
};

app.get('/authorize/:user', (req, res) => {
    let user = req.params.user;
    
    let tokens = {
        at: jwt.sign({ user }, process.env.JWT_AT_SECRET, { expiresIn: '15s' }),
        rt: jwt.sign({ user }, process.env.JWT_RT_SECRET),
    }

    res.cookie('jwt', tokens.rt, { 
        httpOnly: true, 
        secure: true,
        sameSite: 'Strict',
        maxAge: 604800000
    });

    refreshTokens.push(tokens.rt);

    res.json({ at: tokens.at });
});

app.get('/token', (req, res) => {
    let token = req.cookies.jwt;

    if(!refreshTokens.includes(token)) res.sendStatus(401);

    jwt.verify(token, process.env.JWT_RT_SECRET, (err, user) => {
        if(err) return reject(err);

        res.json({ at: jwt.sign({ user }, process.env.JWT_AT_SECRET, { expiresIn: '15s' }) });
    })
})

app.get('/data/:at', authMiddleware, (req, res) => {
    res.json({ data: Math.random() });
});
