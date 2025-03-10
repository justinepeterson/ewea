const { waterfall } = require('async');
const { warn, debug } = require('@lykmapipo/logger');
const { connect, syncIndexes, Predefine } = require('../src/database');

const ensureConnection = next => {
  debug('Start Seeding Data');
  return connect(error => next(error));
};

const ensureIndexes = next => {
  debug('Start Syncing Indexes');
  return syncIndexes((error, results) => {
    if (error) {
      warn('Fail Syncing Indexes', error);
    } else {
      debug('Finish Syncing Indexes', results);
    }
    next();
  });
};

const seed = next => {
  return Predefine.seed(next);
};

const tasks = [ensureConnection, ensureIndexes, seed];

waterfall(tasks, (error, results) => {
  if (error) {
    warn('Fail Seeding Data', error);
  } else {
    debug('Finish Seeding Data', results);
  }
  process.exit(0);
});
