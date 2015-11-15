'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/demo-dev'
  },

  seedDB: true,

  postgres: {
    db: 'postgres://postgres:12345@localhost:5432/Volunteers'
  }
};
