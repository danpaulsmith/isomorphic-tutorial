var express = require('express');
var _ = require('underscore');
var httpProxy = require('http-proxy');
var app = express();
var bodyParser = require('body-parser');
var postId = 0;

var posts = [{
id: 24727,
url: "http://blog.teamtreehouse.com/kelly-acquired-skills-needed-pursue-dream-career-android-developer",
title: "Kelly Acquired the Skills She Needed to Pursue a Dream Career as an Android Developer",
date: "2015-03-11 10:52:38",
author: "Faye Bridge",
body: "I can't go back to yesterday because I was a different person then."
},
{
id: 24680,
url: "http://blog.teamtreehouse.com/create-sticky-navigation",
title: "How to Create a Sticky Navigation",
date: "2015-02-05 14:44:13",
author: "Guil Hernandez",
body: "If I had a world of my own, everything would be nonsense. Nothing would be what it is, because everything would be what it isn't. And contrary wise, what is, it wouldn't be. And what it wouldn't be, it would. You see?"
},
{
id: 24690,
url: "http://blog.teamtreehouse.com/hooks-wordpress-actions-filters-examples",
title: "WordPress Hooks: Actions, Filters, and Examples",
date: "2015-02-04 09:57:04",
author: "Zac Gordon",
body: "Who in the world am I? Ah, that's the great puzzle."
},
{
id: 24712,
url: "http://blog.teamtreehouse.com/font-families-hamburger-menus-flux-treehouse-show-episode-126",
title: "Font Families, Hamburger Menus, Flux | The Treehouse Show | Episode 126",
date: "2015-02-03 11:35:10",
author: "Chris Zabriskie",
body: "Curiouser and curiouser!"
},
{
id: 24706,
url: "http://blog.teamtreehouse.com/nested-routes-laravel-4",
title: "Nested Routes in Laravel 4",
date: "2015-02-03 11:27:04",
author: "Hampton Paulk",
body: "If everybody minded their own business, the world would go around a great deal faster than it does."
},
{
id: 24693,
url: "http://blog.teamtreehouse.com/add-navigation-drawer-android",
title: "How to Add a Navigation Drawer in Android",
date: "2015-02-02 14:54:34",
author: "Ben Jakuben",
body: "Contrariwise,' continued Tweedledee, 'if it was so, it might be; and if it were so, it would be; but as it isn't, it ain't. That's logic."
},
{
id: 24707,
url: "http://blog.teamtreehouse.com/new-courses-css-php-ruby",
title: "New Courses: CSS, PHP, and Ruby",
date: "2015-02-02 10:58:02",
author: "Chris Zabriskie",
body: "Alice:How long is forever? White Rabbit:Sometimes, just one second."
},
{
id: 24694,
url: "http://blog.teamtreehouse.com/shaun-combined-passion-helping-youths-realise-full-potential-interest-web",
title: "Shaun Applied His New Web Skills to Helping Youths Realise Their Full Potential",
date: "2015-01-30 09:34:00",
author: "Faye Bridge",
body: "Speak in French when you can’t think of the English for a thing--turn your toes out when you walk---And remember who you are!"
},
{
id: 24674,
url: "http://blog.teamtreehouse.com/want-get-python-join-community",
title: "Want to Get More Out of Python? Join the Community!",
date: "2015-01-28 10:37:22",
author: "Kenneth Love",
body: "But oh my dear, I am tired of being Alice in Wonderland. Does it sound ungrateful? It is. Only I do get tired."
},
{
id: 24677,
url: "http://blog.teamtreehouse.com/skeleton-angularjs-fold-treehouse-show-episode-125",
title: "Skeleton, AngularJS, The Fold | The Treehouse Show | Episode 125",
date: "2015-01-27 09:30:58",
author: "Chris Zabriskie",
body: "Alice: Would you tell me, please, which way I ought to go from here? The Cheshire Cat: That depends a good deal on where you want to get to."
}];

module.exports = app;

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/posts.json', function(req, res) {
  res.send(posts);
});

app.post('/posts.json', function(req, res) {
  var post = req.body;
  if (!post.title || !post.author || !post.body) {
    res.send(400, {success: false, error: "Missing parameters."});
  } else {
    post.id = ++postId;
    post.created_at = new Date().toJSON();
    posts.push(post);
    res.send({success: true});
  }
});

app.get('/posts/:id.json', function(req, res) {
  var id = parseInt(req.params.id, 10);
  var post = _.find(posts, function(p) { return p.id === id });
  if (post) {
    res.send(post);
  } else {
    res.send(404, {error: 'Not found.'});
  }
});


/**
 * On the client, we want to be able to just send API requests to the
 * main web server using a relative URL, so we proxy requests to the
 * API server here.
 */
var proxy = new httpProxy.RoutingProxy();

app.proxyMiddleware = function(apiPort) {
  return function(req, res, next) {
    proxy.proxyRequest(req, res, {
      host: 'localhost',
      port: apiPort
    });
  };
};
