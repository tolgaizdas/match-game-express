const express = require("express");
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use('/images', express.static('images'));
app.use('/sounds', express.static('sounds'));


app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
})

app.listen(port, () => {
    console.log(`Server started at http://localhost:${port}`);
})
