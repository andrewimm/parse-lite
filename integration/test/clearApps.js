module.exports = function(client) {
  return client.get('clear', '', {host: 'localhost:1337'});
};
