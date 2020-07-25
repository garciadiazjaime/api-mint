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
    format: '*',
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
  },
  redis: {
    host: {
      doc: 'Redis Host',
      format: '*',
      default: '127.0.0.1',
      env: 'REDIS_PORT_6379_TCP_ADDR',
    },
    port: {
      doc: 'Redis Port',
      format: '*',
      default: '6379',
      env: 'REDIS_PORT_6379_TCP_PORT',
    },
  },
  sendgrid: {
    token: {
      doc: 'Sendgrid Token',
      format: '*',
      default: '',
      env: 'SENDGRID_API_KEY',
    },
  },
  twitter: {
    otoken: {
      doc: 'Oauth Token',
      format: '*',
      default: '',
      env: 'TW_OAUTH_TOKEN',
    },
    osecret: {
      doc: 'Oauth Secret',
      format: '*',
      default: '',
      env: 'TW_OAUTH_SECRET',
    },
    ckey: {
      doc: 'Consumer Key',
      format: '*',
      default: '',
      env: 'TW_CONSUMER_KEY',
    },
    csecret: {
      doc: 'Consumer Secret',
      format: '*',
      default: '',
      env: 'TW_CONSUMER_SECRET',
    }
  }
});

module.exports = config
