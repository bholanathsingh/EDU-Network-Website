
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Ride = require('../models/ride');


router.route('/addride')
.post(function(req,res){ 
   Ride.addRide(req.body,function(err,ride){
       if(err)
       res.send({success:false,data:err});

       res.send({success:true,data:ride}); 
   })

});


router.route('/addridepoint')
.post(function(req,res){ 
    User.getUser({ UserName: req.body.UserId }, function (error, user) {
        if (error)
            res.send({success:false,data:err});
        if(user)    
        {
            var finalRidePoints=[]; 
            req.body.Locations.forEach(function (location) {
                finalRidePoints.push({RideId:location.RideId,UserId:user.UserName,YearMakeModel:user.YearMakeModel[0],
                    Speed:location.Speed,Weather:location.Weather, MilesDrive:location.MilesDrive,City:location.City,
                    State:location.State,Country:location.Country,Location:{type: "Point",coordinates:location.Coordinates},Status:location.Status});
            });
            // save data into database 
           if(finalRidePoints.length>0)
           {
            Ride.insertMany(finalRidePoints,function(err,ride){
                if(err)
                res.send({success:false,data:err});
         
                res.send({success:true,data:[]}); 
            })
           }
           else
            res.json({ success: false, data: {"message":'user not exist for this ride'} });
        }
        else
            res.json({ success: false, data: {"message":'user not exist for this ride'} });
    })
});




router.route('/getrides')
.get(function(req,res){
   Ride.getRides(req.body,function(err,rides){
       if(err)
       res.send({success:false,data:err});

       res.send({success:true,data:rides});
   })

});

module.exports = router;