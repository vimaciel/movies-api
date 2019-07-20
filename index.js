const app = require('express')()

require('./startup/routes')(app)
require('./startup/database')()

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}. Environment: ${app.get('env')}...`))