require('dotenv').config();
const development_cfg = {
  username: process.env.DB_MQ_USERNAME,
  password: process.env.DB_MQ_PASSWORD,
  database: process.env.DB_MQ_DATABASE,
  host: process.env.DB_MQ_HOST,
  dialect: 'postgres',
  logging: false,

  define: {
    underscored: true,
    timestamps: true,
    paranoid: true,
    freezeTableName: true
  }
}

// not yet defined
const test_cfg = {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres',
  logging: false,
  define: { underscored: true, timestamps: true, paranoid: true, freezeTableName: true }
}

// not yet defined
const production_cfg = {
  use_env_variable: 'DATABASE_URL',
  dialect: 'postgres',
  logging: false,
  define: { underscored: true, timestamps: true, paranoid: true, freezeTableName: true }
}

module.exports = {
  development: development_cfg,
  test: test_cfg,
  production: production_cfg
};