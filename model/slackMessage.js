const https = require(`https`);

//オプション情報設定
function createOpt(data)
{
    return {
        hostname: 'hooks.slack.com',
        port: 443,
        path: '/services/TGHQQ3763/BGL79EEBU/jlnv6kOyDDTVWfYJWiNtqtJZ',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };
}
exports.sendMessage = async (param) =>
{
    var data = JSON.stringify(param);
    return new Promise(function (resolve, reject) {
        var req = https.request(createOpt(data), (res) => {
            //console.log(`STATUS: ${res.statusCode}`);
            //console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                //console.log(`BODY: ${chunk}`);
                resolve(chunk);
            });
        });
        req.on('error', (e) => {
          console.error(`problem with request: ${e.message}`);
          reject(e);
        });
        req.write(data);
        req.end();
    });
}
