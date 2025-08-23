import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import SequelizePkg from 'sequelize';
import config from '../config/config.cjs';


const { Sequelize, DataTypes } = SequelizePkg;
const env = process.env.NODE_ENV || 'development';
const cfg = config[env];


let sequelize;
if (cfg.use_env_variable) {
sequelize = new Sequelize(process.env[cfg.use_env_variable], cfg);
} else {
sequelize = new Sequelize(cfg.database, cfg.username, cfg.password, cfg);
}


const db = {};


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const files = fs.readdirSync(__dirname)
.filter((f) => f !== 'index.js' && f.endsWith('.js'));


for (const file of files) {
const mod = await import(pathToFileURL(path.join(__dirname, file)));
const model = mod.default(sequelize, DataTypes);
db[model.name] = model;
}


Object.keys(db).forEach((name) => {
if (db[name].associate) db[name].associate(db);
});


export { sequelize, Sequelize };
export default db;