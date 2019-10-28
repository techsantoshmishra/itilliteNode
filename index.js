
const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const jwt = require('jsonwebtoken');

const passport = require('passport');
const passportJWT = require('passport-jwt');

let ExtractJwt = passportJWT.ExtractJwt;
let JwtStrategy = passportJWT.Strategy;

let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'santoshtest';
 
// lets create our strategy for web token
let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
  console.log('payload received', jwt_payload);
  let user = getUser({ id: jwt_payload.id });

  if (user) {
    next(null, user);
  } else {
    next(null, false);
  }
});
// use the strategy
passport.use(strategy);


const app = express();

// initialize passport with express
app.use(passport.initialize());

// parse application/json
app.use(bodyParser.json());
//parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// initialze an instance of Sequelize
const sequelize = new Sequelize({
  database: 'itilite',
  username: 'root',
  password: 'password',
  dialect: 'mysql',
});

// check the databse connection
sequelize
  .authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(err => console.error('Unable to connect to the database:', err));


// create user model
const User = sequelize.define('user', {
  name: {
    type: Sequelize.STRING,
  },
  password: {
    type: Sequelize.STRING,
  },
});

// Create Movie Model
const Movies = sequelize.define('movies', {
  screenname: {
    type: Sequelize.STRING,
  },
  moviename: {
    type: Sequelize.STRING,
  },
  seatclass: {
    type: Sequelize.STRING,
  },
  showtime: {
    type: Sequelize.DATE,
  },
  showdate: {
    type: Sequelize.DATE(6),
  },
  theatername: {
    type: Sequelize.STRING,
  },
  totalcost: {
    type: Sequelize.DOUBLE,
  },
   servicefee: {
    type: Sequelize.DOUBLE,
  },
   costperticket: {
    type: Sequelize.DOUBLE,
  },
  userid: {
    type: Sequelize.INTEGER
  }
});

// create  Event model
// Create Movie Model
const Event = sequelize.define('events', {
  eventname: {
    type: Sequelize.STRING,
  },
  eventplace: {
    type: Sequelize.STRING,
  },
  eventtime: {
    type: Sequelize.DATE,
  },
  eventdate: {
    type: Sequelize.DATE(6),
  },
  totalcost: {
    type: Sequelize.DOUBLE,
  },
   servicefee: {
    type: Sequelize.DOUBLE,
  },
   costperticket: {
    type: Sequelize.DOUBLE,
  },
  userid: {
    type: Sequelize.INTEGER
  }
});

// create table with user model
User.sync()
  .then(() => console.log('User table created successfully'))
  .catch(err => console.log('oooh, did you enter wrong database credentials?'));
// Create  Table with movies model  
Movies.sync()
  .then( ()=> console.log('Movies table created successfully'))
  .catch(err => console.log('something Wrong'));

// create table with event model
Event.sync()
  .then(()=> console.log("success"))
  .catch(err => console.log("something wrong"));

// create some helper functions to work on the database
const createUser = async ({ name, password }) => {
  return await User.create({ name, password });
};

// create some helper functions to work on the database
const createMovie = async ({ screenname, moviename,seatclass,showtime,showdate,theatername,totalcost,servicefee,costperticket,userid }) => {
  return await Movies.create({ screenname, moviename,seatclass,showtime,showdate,theatername,totalcost,servicefee,costperticket,userid});
};

// Create Event Function
const createEvent = async ({ eventname, eventplace,eventtime,eventdate,totalcost,servicefee,costperticket,userid }) => {
  return await Event.create({ eventname, eventplace,eventtime,eventdate,totalcost,servicefee,costperticket,userid});
};

const getAllUsers = async () => {
  return await User.findAll();
};



const getUser = async obj => {
  return await User.findOne({
    where: obj,
  });
};

// add a basic route
app.get('/', function(req, res) {
  res.json({ message: 'Express is up!' });
});

// get all users
app.get('/users', function(req, res) {
  getAllUsers().then(user => res.json(user));
});
// get submission of the data

app.post('/registeration', function(req,res, next){
  console.log(req.body);
})

// register route
app.post('/register', function(req, res, next) {
  const { name, password } = req.body;
  createUser({ name, password }).then(user =>
    res.json({ user, msg: 'account created successfully' })
  );
});

//login route
app.post('/login', async function(req, res, next) {
  const { name, password } = req.body;
  if (name && password) {
    let user = await getUser({ name: name });
    if (!user) {
      res.status(401).json({ message: 'No such user found' });
    }
    if (user.password === password) {
      // from now on we'll identify the user by the id and the id is the 
      // only personalized value that goes into our token
      let payload = { id: user.id };
      let token = jwt.sign(payload, jwtOptions.secretOrKey);
      res.json({ msg: 'ok', token: token });
    } else {
      res.status(401).json({ msg: 'Password is incorrect' });
    }
  }
});

// protected route
app.get('/protected', passport.authenticate('jwt', { session: false }), function(req, res) {
  res.json('Success! You can now see this without a token.');
});

// start app
app.listen(4000, function() {
  console.log('Express is running on port 3000');
});