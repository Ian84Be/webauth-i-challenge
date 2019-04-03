
const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);

const db = require('./dbConfig.js');

module.exports = {
    name:'steve',
    secret: 'there is only one cookie',
    cookie: {
      maxAge: 1000*60*10, //ten minutes (ms)
      secure: false,
      httpOnly: true,
    },
    resave:false,
    saveUninitialized:false,
    store: new KnexSessionStore({
      knex: db,
      tablename: 'sessions',
      sidfieldname: 'sid',
      createtable:true,
      clearInterval: 1000 * 60 * 30,
    }),
  };
