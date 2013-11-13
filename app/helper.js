module.exports = function (settings, moment, util) {

    var fs = require('fs');
    var _ = require('underscore');

    // functions added to String prototype
    String.prototype.trim = function(){
        return this.replace(/^\s+|\s+$/g, "");
    };

    String.prototype.toCamel = function(){
        return this.replace(/(\-[a-z])/g, function($1){return $1.toUpperCase().replace('-','');});
    };

    String.prototype.toDash = function(){
        return this.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
    };

    String.prototype.repeat = function( num ) {
        return new Array( num + 1 ).join( this );
    };

    return {

        moment: moment,

        util: util,

        _: _,

        settings: settings,

        encBase64: function (s) {
            return new Buffer(s).toString('base64');
        },

        decBase64: function (s) {
            return new Buffer(s, 'base64').toString();
        },

        vernam: {
            enc: function (message, key) {
                var ris = "", len = message.length, m = "", k = "", c;
                for (var i = 0; i < len; i++) {
                    m = message.charCodeAt(i);
                    k = key.charCodeAt(i % key.length);
                    c = m + k;
                    ris += String.fromCharCode(c);
                }
                return ris;
            },
            dec: function (message, key) {
                var ris = "", len = message.length, m = "", k = "", c;
                for (var i = 0; i < len; i++) {
                    m = message.charCodeAt(i);
                    k = key.charCodeAt(i % key.length);
                    c = m - k;
                    ris += String.fromCharCode(c);
                }
                return ris;
            }
        },

        // date formats
        DateToStringSeqWithTimeIncFracSecs: function (date) {
            return moment(date).format('YYYY-MM-DD HH:mm:ss:SSS');
        },
        
        DateToStringSeqWithTimeIncSecs: function (date) {
            return moment(date).format('YYYY-MM-DD HH:mm:ss');
        },

        DateToStringSeqWithTimeNoSecs: function (date) {
            return moment(date).format('YYYY-MM-DD HH:mm');
        },

        DateToStringSeqNoTime: function (date) {
            return moment(date).format('YYYY-MM-DD');
        }

    };
};
