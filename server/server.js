const path = require('path');
const express = require('express');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;
var app = express();

// serve public folder using express.static middleware
app.use(express.static(publicPath));

app.listen(3000, () => {
	console.log(`Server is up on port ${port}`);
})