const request = require("request");
const convert = require("xml-js");
const xml = require("xml");
const fs = require("fs");
const fileType = require('file-type');

class BuzzExpert {
    
    constructor(opts) {
        this._token = null;
        this._login = opts.login;
        this._password = opts.password;
        this._label = opts.label;
    }

    _encodeMediaToBase64FormattedObject(media) {
        let buf, mime;
        switch(media.type) {
            case 'text':
                buf = new Buffer(media.content);
                mime = 'plain/text';
                break;
            case 'file': 
                buf = fs.readFileSync(media.content);
                mime = fileType(buf).mime;
                break;
            default: 
                throw new Error("No type for media to convert to base 64.");
        }
        if (buf.byteLength > 500000) {
            throw new Error("Media > 60ko");
        } else {
            const base64Str = buf.toString('base64');
            return { media: 'data:' + mime + ';base64,' + base64Str };
        }
    }

    connect(callback) {
        const self = this;
        const options = { 
            method: 'POST',
            url: 'http://web.buzz-expert.fr/api/token',
            headers: { 
                'cache-control': 'no-cache',
                'Content-Type': 'text/xml' 
            },
            body: 'request=<?xml version="1.0" encoding="UTF-8"?>\n<request>\n\t<login>' + this._login + '</login>\n\t<password>' + this._password + '</password>\n</request>' 
        };
    
        request(options, function (error, response, body) {
            if(error){ return callback(error);}
            let xml = convert.xml2js(body, {compact:false});
            self._token = xml.elements[0].elements[2].elements[1].elements[0].text;
            return callback(null);
        });
    }

    sendMMS (number, medias, callback) {
        if (!this._token) throw new Error("You must login first!");

        let label = {};
        let messageType = (medias[0].type === "text" && medias[0].content.length >= 160 && medias.length === 1 ) ? "SMS" : "MMS";
        
        label[(messageType === "SMS") ? 'oadc' : 'label'] = this._label;  
        
        let message = { request: [
                            { token: this._token },
                            { type: messageType },
                            { number: number },
                            { medias: medias.map((media) => this._encodeMediaToBase64FormattedObject(media)) },
                            { options: [
                                { type: "MARKETING" },
                                label
                                ]
                            }
                        ]
                    };
        let messageXML = "request=" + xml(message, { declaration : true});
    
        var requestOptions = { 
            method: 'POST',
            url: 'http://web.buzz-expert.fr/api/push',
            headers: { 
                'cache-control': 'no-cache',
                'Content-Type': 'text/xml' 
            },
            body: messageXML
        };
        
        request(requestOptions, function (error, response, body) {
            if (error) throw new Error(error);
            let answerXML = convert.xml2js(body, {compact:false});
            let status = JSON.stringify(answerXML.elements[0].elements[2].elements[0].elements[0].text);
            if (status = "ko") {
                return callback("Le message n'a pas été envoyé, retour status KO");
            } else if (status = "ok") {
                callback(null, body);
            }
        });
    }
}

module.exports = BuzzExpert;