module.exports = {
  mongodb: {
    server: 'mongo1',
    port: 27017,
    admin: true,
    auth: [
      {
        authSource: 'admin',
        username: 'root',
        password: 'example'
      }
    ],
    autoReconnect: true,
    poolSize: 4,
    useNewUrlParser: true,
    useUnifiedTopology: true
  },
  site: {
    title: 'Mongo Express',
    logo: '',
    favicon: '',
    css: '',
    js: ''
  },
  options: {
    basicAuth: {
      username: 'root',
      password: 'root1234'
    },
    documentation: false
  }
};
