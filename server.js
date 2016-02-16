var app = require('express')();
var http = require('http').Server(app);
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/test';

var d;

MongoClient.connect(url, function(err, db) {
	d = db;
});

function saveDonation(donation, db, callback) {
	db.collection('donations').insertOne(donation, function(err, result) {
		console.log("Saved donation" + donation.amount);
		callback(result);
	});
}

function readDonationSums(db, callback) {
    db.collection('donations').aggregate([{
        '$group': {
            '_id' : null,
            'total' : {
                "$sum" : "$amount"
            }
        }
    }], function(err, result) {
        console.log(result);
        callback(result[0].total);
    });
}   i

app.get('/test/:amount', function (req, res) 
{	// MongoClient.connect(url, function(err, db) {
  var donation = {'stripe_id' : '123', 'amount' : Number(req.params.amount)};
  if (!donation.amount) {
		db.close();
  } else {
  	saveDonation(donation, d, function() {
      // db.close();
      console.log("db closed");
  	});	
  }

  res.json({'test' : 'ok'});
});

app.get('/stats/donations/count', function (req, res) {
	// MongoClient.connect(url, function(err, db) {
		d.collection('donations').count(null, function(err, count) {
			res.json({'total_donations' : count});
		});	
	// });
})

app.get('/stats/donations/sum', function(req, res) {
	// MongoClient.connect(url, function(err, db) {
		readDonationSums(d, function(sum) {
			res.json({'donation_sum' : sum});
		});

	// });
});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
