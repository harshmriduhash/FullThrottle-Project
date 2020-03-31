const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const JSON_DATA = require('./sample-data.json');

// A utility logging middleware to log all incoming requests
// could be replaced with winston or morgan on production
const loggerMiddleware = (req, res, next) => {
  const log = `[${new Date().toISOString()}] ${req.method}:${req.url} ${res.statusCode}`;
  console.log(log);
  next();
};

// utility function to check is text is present in pattern
const containsText = (text, pattern) => {
  return pattern && text && pattern.toLowerCase().includes(text.toLowerCase());
}

app.use(loggerMiddleware);

app.use('/api/users', (req, res) => {
  // using Mock api to send sample json here
  const { search = '', skip = 0, limit = 10000 } = req.query;
  console.info(`Request Query Params - ${JSON.stringify(req.query)}`);
  let data = Object.assign({}, JSON_DATA);
  if (search && search.length > 0) {
    data.members = data.members.filter(member => containsText(search, member.id) || containsText(search, member.real_name));
  }

  // apply skip and limit
  data.members = data.members.slice(skip, skip + limit);
  return res.json(data).status(200);
});

// to render static content from build folder
app.use(express.static('build'));

app.listen(PORT, () => console.log(`listening on port ${PORT}!`));
