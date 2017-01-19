/**
 * Created by gxu on 11/29/16.
 */
'use strict';
var _ = require('lodash');

module.exports = responseError;

function isAROneErr(err) {
    return err && err.error &&
        _.isString(err.error.type) &&
        err.error.type.indexOf('arone.') === 0;
}

function responseError(obj, err) {
    if (isAROneErr(err)) {
        return err;
    }

    obj = obj || {};
    obj.type = obj.type;
    obj.message = obj.message;
    if (err) {
        obj.error = err;
    }

    return {
        error: obj
    };
}
