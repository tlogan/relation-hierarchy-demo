var dragoman = {};

dragoman.host = function(name) { return {
      name: name
}};

dragoman.account = function(name, host) { return {
    name: name,
    host: host
}};

dragoman.protocol = function(name) { return {
    name: name
}};

dragoman.contact = function(name) { return {
    name: name
}};

dragoman.account_protocol = function(account, protocol) { return {
    account: account, 
    protocol: protocol,
}};

dragoman.subscription = function(subscriber, subscribee) { return {
    subscriber: subscriber, 
    subscribee: subscribee 
}};

dragoman.account_protocol_contact = function(account_protocol, contact) { return {
    account_protocol: account_protocol,
    contact: contact
}};

dragoman.contact = function(name) { return {
    name: name
}};

dragoman.message = function(sender, receiver, time, read, content) { return {
  sender: sender,
  receiver: receiver,
  time: time,
  read: read,
  content: content
}};

