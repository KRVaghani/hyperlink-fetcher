var express = require('express');
var app = express();
const got = require('got');
const cheerio = require('cheerio');
// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// set the view engine to ejs
app.set('view engine', 'ejs');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// set the home page route
app.get('/', function(req, res) {

	// ejs render automatically looks in the views folder
	res.render('index');
});

const links = [];
const extractLinks = async (url) => {
	
	try {
	  // Fetching HTML
	  const response = await got(url);
	  const html = response.body;
  
	  // Using cheerio to extract <a> tags
	  const $ = cheerio.load(html);
  
	  const linkObjects = $('a');
	  // this is a mass object, not an array
	  
	  // Collect the "href" and "title" of each link and add them to an array
	 
	  linkObjects.each((index, element) => {
		links.push({
		  text: $(element).text(), // get the text
		  href: $(element).attr('href'), // get the href attribute
		});
	  });
	
	//   console.warn(links);
	  // do something else here with these links, such as writing to a file or saving them to your database
	} catch (error) {
	  console.log(error.response.body);
	}
	console.log(links);
	return links;
  };
  

app.get('/list',(req,res)=>{
	let query = req.query.search;
	
	let obj = extractLinks(query);
	// console.log(obj);
	res.render('my',{query:query,obj:obj});
	
})
app.listen(port, function() {
	console.log('Our app is running on http://localhost:' + port);
});