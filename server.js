const app = require('./app.js');

const port = process.env.PORT || 5500;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
    console.log(`app listening on ${host}:${port}`)
})
