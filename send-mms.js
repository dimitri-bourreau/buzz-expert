const request = require("request");
const xml = require("xml");

let login = null,
    password = null,
    token = null;

function connectToApi(login, password, callback){
    var options = { method: 'POST',
        url: 'http://web.buzz-expert.fr/api/token',
        headers: { 
            'cache-control': 'no-cache',
            'Content-Type': 'text/xml' 
        },
        body: 'request=<?xml version="1.0" encoding="UTF-8"?>\n<request>\n\t<login>0606707612</login>\n\t<password>soucti626</password>\n</request>' 
    };
  
    request(options, function (error, response, body) {
        if(error){ new Error(error);}
       
        let token = "";
        return callback(null, token);
    });
};

function sendMMS(token, number, medias, callback){
    // No oadc but label
    // Everything to base 64 : btoa()
};

function sendMessage(medias, contact, type, label, callback){
    if(err){return new Error(err);}
    connectToApi(login, password, (err, token) => {
        if(err){return new Error(err);}
        sendMMS(token, number, medias, (err) => {
            if(err){return new Error(err);}
            callback(null);
        });
    });
};

module.exports = {
    sendMessage
}