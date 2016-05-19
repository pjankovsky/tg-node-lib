(function () {
    "use strict";
    var getAllConfig, getConfig;

    const aws = require('aws-sdk');
    const dynamodb = new aws.DynamoDB();

    const TABLE_NAME = 'TokenGoodsConfig';

    module.exports = {
        getAllConfig: function () {
            // grab the whole table
            var config = {};
            var err = null;
            dynamodb.scan({
                TableName: 'TokenGoodsConfig'
            }, function (_err, data) {
                if (_err)
                    err = _err;
                else {
                    for (var i = 0; i < data.Items.length; i++) {
                        config[data.Items[i].key.S] = data.Items[i].value.S;
                    }
                }
            });
            return [err, config];
        },
        getConfig: function (configKey) {
            // grab just a single key
            var value = null;
            var err = null;
            dynamodb.getItem({
                Key: {
                    key: {
                        S: String(configKey)
                    }
                },
                TableName: TABLE_NAME
            }, function (_err, data) {
                if (_err)
                    err = _err;
                else {
                    if (typeof data.Item === 'undefined')
                        value = 'Config value not found';
                    else
                        value = data.Item.value.S;
                }
            });
            return [err, value];
        }
    }

}).call(this);
