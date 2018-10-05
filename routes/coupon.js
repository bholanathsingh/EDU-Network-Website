
var express = require('express');
var router = express.Router();
var Coupon = require('../models/coupon');
var AssignedCoupon=require('../models/assignedcoupon');
var User=require('../models/user');
var UserGroup=require('../models/usergroup');


// router.route('/addcoupon')
// .post(function(req,res){
//     // generate id for unique 
//     req.body.Id=(new Date).valueOf() + '-'+req.body.BusinessName;
//     Coupon.addCoupon(req.body,function(err,coupon){
//        if(err)
//        res.json({ success: false, data: err });

//         res.send(coupon);
//    })
// });

router.route('/addcoupon')
.post(function(req,res){
   
    if(req.body.Id=='')
       req.body.Id=(new Date).valueOf() + '-'+req.body.BusinessName;
    
    Coupon.updateCoupon({Id: req.body.Id},req.body,{upsert: true},function(err,coupon){
       if(err)
       res.json({ success: false, data: err });

        res.send({ success: true, data: coupon });
   })
});

router.route('/coupons')
.post(function(req,res){
    Coupon.getCoupons(req.body,function(err,coupons){
       if(err)
       res.json({ success: false, data: err });

       res.send({ success: true, data: coupons });
   })
});

router.route('/recordcount')
.post(function (req, res) {
    Coupon.TotalCountCoupon(req.body.search,function (err, count) {
        if (err)
        res.json({ success: false, data: err });
        
        return res.send({success:true,data:{count:count}});
    });
});


router.route('/searchcoupon')
.post(function (req, res) {
        console.log(req.body);
        
        var query=req.body.search;

        Coupon.getCouponList(query, function (err, coupons) {
            if (err)
               res.json({ success: false, data: err });
            
            return res.json({ success: true, data: coupons });
        }, { "CreatedDate": -1 }, req.body.page, req.body.limit);
});



router.route('/deletecoupon')
.post(function (req, res) {
    console.log('Called Coupon Delete');
    Coupon.removeCoupon(req.body, function (error, coupon) {
            if (error)
                res.json({ success: false, data: err });
                // return the information including token as JSON
                res.json({success: true,coupon:coupon});
        });
});



router.route('/autocoupon')
.post(function (req, res) {
        console.log(req.body);
        Coupon.getCouponAutocomplete(req.body.fields,req.body.query,function (err, coupons) {
            if (err)
                res.json({ success: false, data: err });
            
            return res.json({ success: true, data: coupons });
        }, { "Year": -1 },req.body.limit);
});


router.route('/assigncoupon')
.post(function (req, res) {
        console.log(req.body);

        req.body.users.forEach(function (user) {

          // assigned coupon to user - 
        
        AssignedCoupon.addAssignedCoupon({CouponId:req.body.Coupon.Id,
          CouponType:req.body.Coupon.CouponType,
          LogoUrl:req.body.Coupon.LogoUrl,BusinessName:req.body.Coupon.BusinessName,
          UserId:user,OperationOnCoupon:'Assigned'}
          ,function(err,coupon){});

          // update user with coupon 
          User.updateUser({UserName:user},
            { $set: {UserCoupon:req.body.Coupon}},
          function (err, user){ });
        });

        
        return res.json({ success: true, data: req.body });
});

router.route('/getusers/:couponid')
.get(function (req, res) {
    AssignedCoupon.getFilteredAssignedCoupons({CouponId:req.params.couponid},{ "UserId": -1,"_id": 1 }, function (err, coupons) {
        if (err)
            return res.json({ success: false, data: err }); 
            
        return res.json({ success: true, data: coupons });
    });
})


router.route('/getcoupon/:couponid')
.get(function (req, res) {
    Coupon.getCoupon({Id:req.params.couponid},function (err, coupon) {
        if (err)
            return res.json({ success: false, data: err }); 
            
        return res.json({ success: true, data: coupon });
    });
})


 
router.route('/assigncoupongroup')
.post(function (req, res) {
       // groups -
       req.body.groups.forEach(function (groupname) {
       // get grouped user -
        UserGroup.getUserGroup({UserGroupName: new RegExp('\\b' + groupname + '\\b', 'i')}, function (err, group) {
          
            if(group)
            {
                group.UserId.forEach(function (user) {
 
                    // assigned coupon to user - 
                    AssignedCoupon.addAssignedCoupon({CouponId:req.body.Coupon.Id,
                      CouponType:req.body.Coupon.CouponType,GroupName:groupname,
                      LogoUrl:req.body.Coupon.LogoUrl,BusinessName:req.body.Coupon.BusinessName,
                      UserId:user,OperationOnCoupon:'Assigned'}
                      ,function(err,coupon){});
            
                    // update user with coupon 
                    User.updateUser({UserName:user},
                        { $set: {UserCoupon:req.body.Coupon}},
                      function (err, user){ });
            
                });
            }
          });
        });
        return res.json({ success: true, data: req.body });
});




router.route('/assignedcoupon')
.post(function (req, res) {
        
    AssignedCoupon.getAssignedCoupons(req.body,function(err,assignedcoupon){
    if (err)
        return res.json({ success: false, data: err }); 
            
        return res.json({ success: true, data: assignedcoupon });
    });
});



module.exports = router;