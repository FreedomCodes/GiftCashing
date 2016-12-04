const express = require('express'),
    router = express.Router(),
    faker = require('faker');

var user = {
    name: faker.name.findName(),
    email: faker.internet.email(),
    address: faker.address.streetAddress(),
    bio: faker.lorem.sentence(),
    image: faker.image.avatar()
};

/* GET Gifts page. */
router.get('/', function(req, res, next) {
    res.render('gifts', { title: 'Review Gifts', user: user });
});

router.get('/new', function (req, res, next) {
    console.log(req.params.id);
   res.render('gifts/new', { title: 'New Gift'})
});

module.exports = router;