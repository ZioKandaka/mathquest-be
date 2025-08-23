require('dotenv').config();


module.exports = {
    development: {
        use_env_variable: "jdbc:postgresql://localhost:5432/postgres",
        dialect: 'postgres',
        logging: false,
        define: {
            underscored: true,
            timestamps: true,
            paranoid: true,
            freezeTableName: true
        }
    },
    test: {
        use_env_variable: 'DATABASE_URL',
        dialect: 'postgres',
        logging: false,
        define: { underscored: true, timestamps: true, paranoid: true, freezeTableName: true }
    },
    production: {
        use_env_variable: 'DATABASE_URL',
        dialect: 'postgres',
        logging: false,
        define: { underscored: true, timestamps: true, paranoid: true, freezeTableName: true }
    }
};