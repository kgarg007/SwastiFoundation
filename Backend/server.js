require('dotenv').config()
const express = require('express')
const cors = require('cors')
const volunteer = require('./model/volunteer')
const main = require('./database')
const register = require('./routes/volunteerRegis')

const app  = express();

app.use(cors());
app.use(express.json());


// Routing
app.use('/regis', register);
app.use('/auth', require('./routes/auth'));
app.use('/programs', require('./routes/programs'));
app.use('/stories', require('./routes/stories'));
app.use('/gallery', require('./routes/gallery'));
app.use('/events', require('./routes/events'));
app.use('/blog', require('./routes/blog'));
app.use('/settings', require('./routes/settings'));
app.use('/submissions', require('./routes/submissions'));
app.use('/team', require('./routes/team'));
app.use('/volunteer-team', require('./routes/volunteerTeam'));
app.use('/api/donation', require('./routes/donation'));
const cmsRouter = require('./routes/cms');
app.use('/cms', cmsRouter);
app.use('/api/cms', cmsRouter);
app.use('/api/admin/cms', cmsRouter);
app.use('/admin/cms', cmsRouter);






// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running healthy.', timestamp: new Date() });
});

const initializeCmsPages = require('./utils/seedCmsHelper');

main()
    .then(async () => {
        console.log("DB Connected successfully");
        await initializeCmsPages();

        app.listen(3000, () => {
            console.log("Listening at port 3000");
        });
    })

    .catch((err)=>{
        console.log("Error: "+err.message);
    })