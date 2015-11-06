/**
 * Created by Oskar on 2015-10-23.
 */
String.prototype.hashCode = function () {
    var hash = 0, i, chr, len;
    if (this.length == 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

var newHash = function (n) {
    if (!n) n = 10;
    return Math.random().toString(36).substring(2, n + 2);
};

Array.prototype.last = function() {
    return this[this.length-1];
};