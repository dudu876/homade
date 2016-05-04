/**
 * Created by Dudu on 04/05/2016.
 */
var multer = require('multer');
var fs = require('fs');

var _this = this;

var storage;
var upload;
var _mealId;
exports.init = function(imageDirPath) {
    if (!fs.existsSync(imageDirPath)){
        fs.mkdirSync(imageDirPath);
    }
    storage = multer.diskStorage({ //multers disk storage settings
        destination: function (req, file, cb) {
            //cb(null, '../Client/meal_uploads/')
            cb(null, imageDirPath);
        },
        filename: function (req, file, cb) {
            var datetimestamp = Date.now();
            //cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
            cb(null, _mealId)
        }
    });
    upload = multer({ //multer settings
        storage: storage
    }).single('file');
};

exports.setMealId = function(mealId) {
    _mealId = mealId;
}

/** API path that will upload the files */
exports.uploadFile = function(req, res) {
    if (!_mealId) {
        setTimeout(function() {
            _this.uploadFile(req,res);
        },500);
    }
    else {
        upload(req,res,function(err){
            if(err){
                res.json({error_code:1,err_desc:err});
                return;
            }
            res.json({error_code:0,err_desc:null});
        })
    }

};