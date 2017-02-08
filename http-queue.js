module.factory('get', function ($q, $http) {
    var queue = [];
    var execNext = function () 
    {
      var task = queue[0];
      $http.get(task.url).then(
        function (data) 
        {
          //console.log(Date.now() + " GET  >> " + task.url);
          queue.shift();
          task.d.resolve(data);
          if (queue.length > 0) execNext();
        },
        function (err) {
          task.d.reject(err);
        });
    };
    return function (url) {
        var d = $q.defer();
        queue.push({url: url, d: d});
        if (queue.length === 1) execNext();
        return d.promise;
    };
});
module.factory('post', function ($q, $http) {
    var queue = [];
    var execNext = function () 
    {
      var task = queue[0];
      $http.post(task.url,task.data).then(
        function (data) 
        {
          //console.log(Date.now() + " POST >> " + task.url);
          queue.shift();
          task.d.resolve(data);
          if (queue.length > 0) execNext();
        },
        function (err) 
        {
          task.d.reject(err);
        });
    };
    return function (url, data) {
      var d = $q.defer();
      queue.push({url: url, data: data, d: d});
      if (queue.length === 1) execNext();
      return d.promise;
    };
});
