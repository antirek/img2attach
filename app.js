var img2attach = require('./index');

var html = "<img src='./1.png'>" + 
"<img src='http://www.google.com/'>";


var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'oololo276@gmail.com',
        pass: 'ppaasswwoorrdd'
    }
});

img2attach(html).then(function (data) {
  console.log('html', data.html);


  var mailOptions = {
      to: 'serge.dmitriev@gmail.com', // list of receivers
      subject: 'Hello ✔', // Subject line
      html: data.html,
      attachments: data.attachments
  };

  // send mail with defined transport object
  transporter.sendMail(mailOptions, function (error, info) {
      if(error){
          return console.log(error);
      }
      console.log('Message sent: ' + info.response);

  });
}).fail(function (err) {
  console.log('epic fail', err);
});

