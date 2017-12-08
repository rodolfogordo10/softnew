app.service("ApiService", function($http) {

    var app = 'http://vilamotasoftapi-net-br.umbler.net/api/';

    this.get = function (module, id, cb) {
        var url = app + module,
            type;

        if (id) {
            url += '/' + id;
        } else if (module.indexOf('public') > 0) {
            type = {
                'responseType': 'arraybuffer'
            };
        }
        $http.get(url, type).then(function mySuccess(response) {
                return cb(null, response.data);
            }, function myError(response) {
                return cb(response.statusText, null);
            });
    };

    this.post = function (module, data, cb) {
        var req = {
            'method'  : 'POST',
            'url'     : app + module,
            'headers' : {
                'Content-Type': 'application/json'
            },
            'data': data
        };

        $http(req).then(function mySuccess(response) {
                return cb(null, response.data);
            }, function myError(response) {
                return cb(response.statusText, null);
            });
    };

    this.put = function (module, data, cb) {
        var req = {
            'method'  : 'PUT',
            'url'     : app + module,
            'headers' : {
                'Content-Type': 'application/json'
            },
            'data': data
        };

        $http(req).then(function mySuccess(response) {
                return cb(null, response.data);
            }, function myError(response) {
                return cb(response.statusText, null);
            });
    };

    this.delete = function (module, id, cb) {
        var req = {
            'method'  : 'DELETE',
            'url'     : app + module + '/' + id,
            'headers' : {
                'Content-Type': 'application/json'
            }
        };

        $http(req).then(function mySuccess(response) {
                return cb(null, response.data);
            }, function myError(response) {
                return cb(response.statusText, null);
            });
    };

});
