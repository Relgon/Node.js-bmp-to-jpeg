
var formidable = require('formidable'),
    fs = require('fs-extra'),
    f  = require('fs'),
    async = require('async'),
    express = require('express'),
    sizeOf = require('image-size'),
    app = express(),
    port = process.env.PORT || 3000;

var curentImage ="";

app.use(express.static(__dirname + "/public"));
app.set('view engine', 'ejs');
  
app.listen(port, function () {
  console.log('Listening on port ', port)
})

app.post('/admin/upload/image', function (req, res) {

  var form = new formidable.IncomingForm(); 
  form.parse(req, function (error, fields, files) {
  if (!error) {
    var file = files["uploaded_image_file"];
    async.series([function (callback) {
      curentImage=file.name;
      fs.copy(file.path, './public/images/' + file.name, function (error) {
        callback(error);
       });
    },function (callback) {
      fs.remove(file.path, function (error, removed) {
        callback(error, removed);
      });
    }],function (error, results) {
      if (!error) {
        
        res.redirect('/photo');
      }
      else {
        res.redirect('/');
       }
      });
    }
  });
});

app.get('/photo',function(req,res){
  var fullPath="http://localhost:"+port+"/images/"+curentImage,
      dim=sizeOf("public/images/"+curentImage);
      
  res.render('photo');//,{Title:"Test",path:fullPath,dim:dim});
}); 