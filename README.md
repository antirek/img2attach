# img2attach

Replace images urls from html email content to content-id resources links

Send beautiful HTML emails without external images ;)

## Install

> npm install img2attach [--save]


## Usage

Simple

`````javascript

var img2attach = require('img2attach');

var html = '<img src="http://cs624028.vk.me/v624028538/276f5/2ASEewrS9xk.jpg">';

img2attach(html).then(function (data) {
  console.log('html', data.html);
  console.log('attachments', data.attachments);
  
}).fail(function (err) {
  console.log('error', err);
});

`````

With [nodemailer](https://github.com/andris9/Nodemailer)

`````javascript 

var img2attach = require('img2attach');
var nodemailer = require('nodemailer');

var html = '<img src="http://cs624028.vk.me/v624028538/276f5/2ASEewrS9xk.jpg">';

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

`````


## API 

**img2attach(html)**

html - html string like 
`````html

<p><img src="1.jpg"></p>

`````

return promise (used [Q](https://github.com/kriskowal/q))


**img2attach(html).then(function(data) {})**

data - javascript object

`````javascript

{
  html: '<img src="cid:1">',      //cid - url to content-id attachment
  attachments: [
    { 
      cid: 1,
      src: '1.png',
      encoding: 'base64',
      content: 'encoded_data',   //base64 encoded data
      contentType: 'image/jpg' 
    } 
  ]
};

`````


### RFC
https://www.ietf.org/rfc/rfc2392.txt