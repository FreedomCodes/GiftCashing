/*jslint node: true */
'use strict';

const
  express = require('express'),
  router = express.Router({
    mergeParams: true
  }),
  _ = require('lodash'),
  User = require('../models/user'),
  middleware = require('../middleware');

router.get('/', (req, res) => {
  // TODO: This search logic needs a refactor.
  // We should just receive generic query parameter and search that text in different fields,
  // instead a specific query parameter
  req.query = _.pick(req.query, ['firstName', 'aliasFullName']);
  
  let firstName;
  if (req.query.firstName) {
    firstName = { $regex: new RegExp(req.query.firstName, 'ig') };
  }
  
  let aliasFullName;
  if (req.query.aliasFullName) {
    aliasFullName = { $regex: new RegExp(req.query.aliasFullName, 'ig') };
  }
  
  if (!(aliasFullName || firstName)) {
    return res.send();
  }
  
  if (!aliasFullName) aliasFullName = firstName;
  if (!firstName) firstName = aliasFullName;
  
  let query = {
    $or: [{ firstName }, { aliasFullName }]
  };
  
  User.find(query)
      .then(foundUsers => {
        let data = _.map(foundUsers, item => {
          return {
            // TODO: Specify the with data (normal name or alias) we should return here.
            value: (
              item.aliasFullName
            ),
            id: item._id,
            profilePic: item.profilePic
          };
        });
        res.send(data, { 'Content-Type': 'application/json' }, 200);
      })
      .catch(err => {
        res.send(
          JSON.stringify(err),
          { 'Content-Type': 'application/json' },
          404
        );
      });
});

module.exports = router;