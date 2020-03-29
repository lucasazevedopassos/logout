const convert = require('xml-js')
var querystring = require('querystring');
var https = require('https');


var helpers = {};

helpers.getMember = (firewall, group, key, callback) => {
    var firewall = typeof('string') && firewall.length > 0 ? firewall : false;
    var key = typeof('string') && key.length > 0 ? key : false;
    var group = typeof('string') && group.length > 0 ? group : false;

    if(firewall && key && group){
        const re = /multi\\[\w.]+/gm;

        options = {
            textKey: 'value',
            cdataKey: 'value',
            commentKey: 'value',
            compact: true
        }

        var cmd = '<show><user><group><name>'+group+'</name></group></user></show>'
        cmd = querystring.escape(cmd)
        
        // Configure the request details
        var requestDetails = {
            'protocol' : 'https:',
            'hostname' : firewall,
            'method' : 'GET',
            'path' : '/api/?type=op&cmd='+cmd+'&key='+key,
        };

        var req = https.request(requestDetails,function(res){

            var status =  res.statusCode;
            let data = '';

            res.on('data', d => data += d);

            res.on('end', () => {
                var payloadString = convert.xml2js(data, options);
                if(status == 200 || status == 201){
                    var usersFinal = payloadString.response.result.value.match(re)
                    usersFinal.splice(0,1)
                    callback(undefined, usersFinal);
                } else {
                    callback("Bad HTTP Status code");
                }
            });
        });

        // Bind to the error event so it doesn't get thrown
        req.on('error',function(e){
            callback('Request Error: ' + e);
        });

        // End the request
        req.end();

    } else {
        callback("Missing required parameters.")
    }

    
};

helpers.keyGen = (firewall, username, password, callback) => {
    var firewall = typeof('string') && firewall.length > 0 ? firewall : false;
    var username = typeof('string') && username.length > 0 ? username : false;
    var password = typeof('string') && password.length > 0 ? password : false;

    if(firewall && username && password){

        options = {
            textKey: 'value',
            cdataKey: 'value',
            commentKey: 'value',
            compact: true
        }
        
        // Configure the request details
        var requestDetails = {
            'protocol' : 'https:',
            'hostname' : firewall,
            'method' : 'GET',
            'path' : '/api/?type=keygen&user='+username+'&password='+password
        };

        var req = https.request(requestDetails,function(res){

            var status =  res.statusCode;
            let data = '';

            res.on('data', d => data += d);

            res.on('end', () => {
                var payloadString = convert.xml2js(data, options);
                if((status == 200 || status == 201) && payloadString.response._attributes.status == 'success'){
                    callback(undefined,payloadString.response.result.key.value);
                } else {
                    callback('Error: Bad HTTP Code (201 neither 200)');
                }
            });
        });

        // Bind to the error event so it doesn't get thrown
        req.on('error',function(e){
            callback('Request Error: ' + e);
        });

        // End the request
        req.end();

    } else {
        callback('Missing required parameters')
    }

    
};

helpers.disconnect = (firewall, username, computer, key, gateway, callback) => {
    var firewall = typeof('string') && firewall.length > 0 ? firewall : false;
    var key = typeof('string') && key.length > 0 ? key : false;
    var username = typeof('string') && username.length > 0 ? username : false;
    var computer = typeof('string') && computer.length > 0 ? computer : false;
    var gateway = typeof('string') && gateway.length > 0 ? gateway : false;

    if(firewall && key && username && computer){

        options = {
            textKey: 'value',
            cdataKey: 'value',
            commentKey: 'value',
            compact: true
        }
        var cmd = '<request><global-protect-gateway><client-logout><domain>multi</domain><gateway>'+gateway+'</gateway><user>'+username+'</user><reason>force-logout</reason><computer>'+computer+'</computer></client-logout></global-protect-gateway></request>'
        cmd = querystring.escape(cmd)
        
        // Configure the request details
        var requestDetails = {
            'protocol' : 'https:',
            'hostname' : firewall,
            'method' : 'GET',
            'path' : '/api/?type=op&cmd='+cmd+'&key='+key,
        };
    
        var req = https.request(requestDetails,function(res){
    
            var status =  res.statusCode;
            let data = '';
    
            res.on('data', d => data += d);
    
            res.on('end', () => {
                var payloadString = convert.xml2js(data, options);
                if(status == 200 || status == 201){
                    console.log(payloadString.response.result.response)
                    if(payloadString.response.result.response._attributes.status == 'success') {
                        callback(undefined, {
                            username,
                            computer,
                            status : 'success'
                        });
                    } else {
                        callback('Error: Problems to logout user! API responded diferent from success')
                    }
                    
                } else {
                    callback('Error: Bad HTTP Code');
                }
            });
        });

        // Bind to the error event so it doesn't get thrown
        req.on('error',function(e){
            callback('Error: ' + e);
        });

        // End the request
        req.end();

    } else {
        callback('Missing required parameters')
    }

    
};

helpers.getVPNList = (firewall, key, callback) => {
    var firewall = typeof('string') && firewall.length > 0 ? firewall : false;
    var key = typeof('string') && key.length > 0 ? key : false;

    if(firewall && key){
        options = {
            textKey: 'value',
            cdataKey: 'value',
            commentKey: 'value',
            compact: true
        }
    
        var cmd = '<show><global-protect-gateway><current-user/></global-protect-gateway></show>'
        cmd = querystring.escape(cmd)
        
        // Configure the request details
        var requestDetails = {
            'protocol' : 'https:',
            'hostname' : firewall,
            'method' : 'GET',
            'path' : '/api/?type=op&cmd='+cmd+'&key='+key,
        };
    
        var req = https.request(requestDetails,function(res){
    
            var status =  res.statusCode;
            let data = '';
    
            res.on('data', d => data += d);
    
            res.on('end', () => {
                if(status == 200 || status == 201){
                    var payloadString = convert.xml2js(data, options);
                    var listOfVPN = payloadString.response.result.entry;
                    finalUserArray = [];
                    listOfVPN.forEach((user)=>{
                        finalUserArray.push({
                            'user' : user['username']['value'],
                            'computer' : user.computer.value,
                            'public-ip' : user['public-ip'].value,
                            'login-time' : user['login-time'].value,
                            'client' : user.client.value,
                            'primaryusername' : user['primary-username'].value
                        })
                    })
                    callback(undefined, finalUserArray);
                } else {
                    callback('Error: Bad HTTP Code');
                }
            });
        });
    
        // Bind to the error event so it doesn't get thrown
        req.on('error',function(e){
            callback('Error: ' + e);
        });

        // End the request
        req.end();

    } else {
        callback('Missing required fields!');
    }

    
};

module.exports = helpers;