
require('dotenv').config();
const bcrypt = require('bcryptjs');
const express = require('express');
const helmet = require('helmet');
const session = require('express-session');

const sessionConfig = require('./data/session-config.js');

const server = express();
server.use(helmet());
server.use(express.json());
server.use(session(sessionConfig));

const restrictedRouter = require('./restricted-router.js');
server.use('/api/restricted', authCheck, restrictedRouter);

const db = require('./data/dbConfig.js');

server.get('/api/users', authCheck, async (req,res) => {
    try {
        const result = await db('users');
        res.status(200).json(result);
    }
    catch(err) {
        res.status(500).json({err});
    }
});

server.post('/api/register', async (req,res) => {
    let user = req.body;
    if (!user.username || !user.password) {
        res.status(400).json({error:'please provide username/password'});
    } else {
        user.password = bcrypt.hashSync(user.password, 8);
        try {
            const result = await db('users').insert(user);
            if (result) {
                const newUser = await db('users').where({'id':result[0]}).first();
                res.status(201).json(newUser);
            }
        }
        catch(err) {
            res.status(500).json(err);
        }
    }
});

server.post('/api/login', async (req,res) => {
    let {username,password} = req.body;
    if (!username || !password) {
        res.status(400).json({error:'please provide username/password'});
    } else {
        try {
            const validUser = await db('users').where({username}).first();
            if (validUser && bcrypt.compareSync(password, validUser.password)) {
                req.session.user = validUser;
                res.status(200).json({message:`${validUser.username} LOGGED IN`});
            } else {
                res.status(401).json({message:'invalid credentials'});
            }
        }
        catch(err) {
            res.status(500).json(err);
        }
    }
});

server.get('/api/logout', async (req,res) => {
    try {
        if (req.session) {
            req.session.destroy(err => {
              if (err) {
                res.status(500).json(err);
              } else {
                res.status(200).json({message: 'logged out'});
              }
            });
          } else {
            res.status(500).json({error: 'no session found'});
          }
    }
    catch (err) {
        res.status(500).json(err);
    }
});

async function authCheck(req,res,next) {
    try {
        if (req.session.user) {
            next();
        } else {
            res.status(401).json({message:'invalid credentials'});
        }
    }
    catch(err) {
        res.status(500).json(err);
    }
}

const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`listen ${port}`);
});
