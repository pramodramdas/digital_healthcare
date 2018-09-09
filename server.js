require('dotenv').config();
const { init_web3 } = require('./server-utils/web3-util.js');
init_web3();

const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
//const helmet = require('helmet');
const MetaAuth = require('meta-auth');
const app = express();
const metaAuth = new MetaAuth();
//app.use(helmet());

//web3.eth.defaultAccount = web3.eth.accounts[0];

//console.log(healthCare.checkProfile(0xa113b22d40dc1d5d086003c27a556e597f614e8b));
//console.log(web3.eth.accounts);

app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));

require('./routes/auth-routes')(app, metaAuth);
require('./routes/api-routes')(app);

app.listen(9090, () => console.log("server up and listening at 9090"));

module.exports = app;