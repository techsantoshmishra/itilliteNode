const Events = sequelize.define('event', {
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
  eventpalce: {
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
module.exports = Events