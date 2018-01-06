const convict = require('convict')

// Define a schema
const config = convict({
  env: {
    doc: 'The application environment.',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  ip: {
    doc: 'The IP address to bind.',
    format: 'ipaddress',
    default: '0.0.0.0',
    env: 'IP'
  },
  port: {
    doc: 'The port to bind.',
    format: 'port',
    default: 3030,
    env: 'PORT'
  },
  db: {
    url: {
      doc: 'Database host name/IP',
      format: '*',
      default: 'mongodb://localhost:27017/mint',
      env: 'DB_URL',
    },
  }
});

module.exports = config
