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
module.exports = Movies