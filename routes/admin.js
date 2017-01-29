/*jshint esversion: 6 */
'use strict';
const express = require('express'),
  router = express.Router({
    mergeParams: true
  }),
  User = require('../models/user'),
  getPaginated = require('../components/getPaginated'),
  middleware = require('../middleware');


/* GET admins listing. */

router.get('/',
  middleware.isLoggedIn,
  (req, res) => {
    let query = {isAdmin: true};
    
    /*switch(req.query.search) {
     default :
     query = {username: new RegExp(req.query.search, 'gi')};
     break;
     }*/
    
    getPaginated(User, 'gifts', query, req, result => {
      result.title ='Admins';
      result.breadcrumbsName = 'Admins';
      result.items = result.items.map(user => {
        user.totalAmountOfGifts = 0;
        if(user.gifts.length > 0) {
          for(let gift of user.gifts) {
            user.totalAmountOfGifts += gift.giftAmount;
          }
        }
        return user;
      });
      res.render('admin/admins/index', result);
    });
  });

module.exports = router;