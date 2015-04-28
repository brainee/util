(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define('h5.main', [] , factory);
    }
    root.cPublic = factory();
}(this, function () {