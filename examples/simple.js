var img2attach = require('./index');
var nodemailer = require('nodemailer');

var html = "<img src='./1.png'>" + 
"<img src='http://www.google.com/'>";

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'user',
        pass: 'pass'
    }
});

img2attach(html)
    .then(function (data) {
        console.log('html', data.html);

        var mailOptions = {
            to: 'serge.dmitriev@gmail.com', 
            subject: 'Hello',
            html: data.html,
            attachments: data.attachments
        };
        
        transporter.sendMail(mailOptions, function (error, info) {      
            console.log('Message sent: ' + info.response);
        });
    })
    .fail(function (err) {
        console.log('fail', err);
    });