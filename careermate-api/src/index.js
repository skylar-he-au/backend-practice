const cors = require('cors');
const helmet = require('helmet')
const express = require('express');

const config = require('./utils/config');
const {logger} = require('./utils/logger');
const morganMiddleware = require('./middleware/morgan-middleware');
const rateLimiter = require('./middleware/rateLimite-middleware');
const connectToDb = require('./utils/db');

const app = express();

app.use(helmet());
app.use(cors()); 
app.use(morganMiddleware);
app.use(rateLimiter);
app.use(express.json());



connectToDb()

app.listen(config.PORT, () => {
    logger.info(`server listening on port ${config.PORT}`);
});
