var express = require('express');
var _ = require('underscore');
var httpProxy = require('http-proxy');
var app = express();
var bodyParser = require('body-parser');
var postId = 0;

var posts = [
{
id: 24727,
url: "http://blog.teamtreehouse.com/kelly-acquired-skills-needed-pursue-dream-career-android-developer",
title: "Kelly Acquired the Skills She Needed to Pursue a Dream Career as an Android Developer",
date: "2015-03-11 10:52:38",
author: "Faye Bridge",
thumbnail: "http://blog.teamtreehouse.com/wp-content/uploads/2015/02/Kelly-Shuster-150x150.jpg"
},
{
id: 24680,
url: "http://blog.teamtreehouse.com/create-sticky-navigation",
title: "How to Create a Sticky Navigation",
date: "2015-02-05 14:44:13",
author: "Guil Hernandez",
thumbnail: "http://blog.teamtreehouse.com/wp-content/uploads/2015/01/sticky-150x150.jpg"
},
{
id: 24690,
url: "http://blog.teamtreehouse.com/hooks-wordpress-actions-filters-examples",
title: "WordPress Hooks: Actions, Filters, and Examples",
date: "2015-02-04 09:57:04",
author: "Zac Gordon",
thumbnail: "http://blog.teamtreehouse.com/wp-content/uploads/2015/01/hooks-in-wordpress-150x150.png"
},
{
id: 24712,
url: "http://blog.teamtreehouse.com/font-families-hamburger-menus-flux-treehouse-show-episode-126",
title: "Font Families, Hamburger Menus, Flux | The Treehouse Show | Episode 126",
date: "2015-02-03 11:35:10",
author: "Chris Zabriskie",
thumbnail: "http://blog.teamtreehouse.com/wp-content/uploads/2015/02/Screenshot-2015-02-03-11.34.26-150x150.png"
},
{
id: 24706,
url: "http://blog.teamtreehouse.com/nested-routes-laravel-4",
title: "Nested Routes in Laravel 4",
date: "2015-02-03 11:27:04",
author: "Hampton Paulk",
thumbnail: "http://blog.teamtreehouse.com/wp-content/uploads/2015/02/Screenshot-2015-02-03-11.26.04-150x150.png"
},
{
id: 24693,
url: "http://blog.teamtreehouse.com/add-navigation-drawer-android",
title: "How to Add a Navigation Drawer in Android",
date: "2015-02-02 14:54:34",
author: "Ben Jakuben",
thumbnail: "http://blog.teamtreehouse.com/wp-content/uploads/2015/01/Screen-Shot-2015-01-29-at-4.03.28-PM-150x150.png"
},
{
id: 24707,
url: "http://blog.teamtreehouse.com/new-courses-css-php-ruby",
title: "New Courses: CSS, PHP, and Ruby",
date: "2015-02-02 10:58:02",
author: "Chris Zabriskie",
thumbnail: "http://blog.teamtreehouse.com/wp-content/uploads/2015/02/Screenshot-2015-02-02-10.55.50-150x150.png"
},
{
id: 24694,
url: "http://blog.teamtreehouse.com/shaun-combined-passion-helping-youths-realise-full-potential-interest-web",
title: "Shaun Applied His New Web Skills to Helping Youths Realise Their Full Potential",
date: "2015-01-30 09:34:00",
author: "Faye Bridge",
thumbnail: null
},
{
id: 24674,
url: "http://blog.teamtreehouse.com/want-get-python-join-community",
title: "Want to Get More Out of Python? Join the Community!",
date: "2015-01-28 10:37:22",
author: "Kenneth Love",
thumbnail: "http://blog.teamtreehouse.com/wp-content/uploads/2015/01/8572217654_57c261d9b3_z-150x150.jpg"
},
{
id: 24677,
url: "http://blog.teamtreehouse.com/skeleton-angularjs-fold-treehouse-show-episode-125",
title: "Skeleton, AngularJS, The Fold | The Treehouse Show | Episode 125",
date: "2015-01-27 09:30:58",
author: "Chris Zabriskie",
thumbnail: "http://blog.teamtreehouse.com/wp-content/uploads/2015/01/Screen-Shot-2015-01-27-at-9.30.21-AM-150x150.png"
}
];

// var posts = [{
//   id: ++postId,
//   title: "How to build an isomorphic app.",
//   author: "spike",
//   body: "It's really not that hard!",
//   created_at: "2014-11-05T13:56:15.034Z",
// }, {
//   id: ++postId,
//   title: "Why JavaScript is eating the world.",
//   author: "spike",
//   body: "It's the lingua franca of the web.",
//   created_at: "2014-11-04T17:23:01.329Z",
// }, {
//   id: ++postId,
//   title: "Why JavaScript is eating the world.",
//   author: "spike",
//   body: "It's the lingua franca of the web.",
//   created_at: "2014-11-04T17:23:01.329Z",
// }];

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
