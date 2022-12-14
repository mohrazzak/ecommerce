const { Sequelize } = require(`sequelize`);
const sequelize = new Sequelize('roomy', 'root', 'Hmode1422', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
});

// Connect
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB.');
    sequelize.sync();
  } catch (error) {
    console.error('Failed to connect DB: ', error);
  }
})();

module.exports = sequelize;
