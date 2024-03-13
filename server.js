const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
require('dotenv').config(); 

const initMiddlewares = require('./middleware/middlewares');
const { basicLogging, detailedLogging } = require('./logger');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(cors()); 
app.use(rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100 
}));

app.use(basicLogging(morgan));
initMiddlewares(app);
app.use(detailedLogging);

app.get('/', (req, res) => {
    res.send('Hallo Welt, dies ist ein Testserver mit erweiterten Logging-Funktionen!');
});

app.listen(PORT, () => {
    console.log(`Server läuft auf Port ${PORT}`);
});
