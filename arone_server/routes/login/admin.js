/**
 * Created by gxu on 10/13/16.
 */
'use strict';

// curl -X POST
// -H "Content-Type: application/json"
// -d '{"pin":"arone2016"}'
//  http://127.0.0.1:9999/login/admin
function loginAdmin(opts, req, res) {
    var submitPwd = req.body.password;
    console.log("input cred: " + req.body);

    opts.logger.info('/login/admin', {
        headers: req.headers,
        query: req.body
    });

    var admin = opts.config['admin'];
    var passcode = admin['passcode'];
    console.log("admin passcode should be: " + passcode);
    if (submitPwd == passcode) {
        res.cookie("login", true);
        res.status(200).send({
            login: true,
            token: 'aaaaabbbbb'
        });
    } else {
        return res.status(400).send({
            error: new Error('Invalid Passcode')
        });
    }
}

module.exports = loginAdmin;
