Parse.Cloud.define('hello', function(req, res) {
  res.success('Hi');
});

Parse.Cloud.define('number', function(req, res) {
  var val = req.params.value;
  var obj = new Parse.Object('Num');
  obj.set({
    value: req.params.hasOwnProperty('value') ? req.params.value : -1,
  });
  obj.save().then(function(o) {
    res.success(o);
  });
});

Parse.Cloud.define('problem', function(req, res) {
  res.error('Oops');
});
