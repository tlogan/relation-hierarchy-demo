var dragoman = {};

dragoman.host = function(name) { return {
      name: name
};};

dragoman.account = function(name, host) { return {
    name: name,
    host: host
};};

dragoman.protocol = function(name) { return {
    name: name
};};

dragoman.contact = function(name) { return {
    name: name
};};

dragoman.account_protocol = function(account, protocol) { return {
    account: account, 
    protocol: protocol,
};};

dragoman.subscription = function(subscriber, subscribee) { return {
    subscriber: subscriber, 
    subscribee: subscribee 
};};

dragoman.account_protocol_contact = function(account_protocol, contact) { return {
    account_protocol: account_protocol,
    contact: contact
};};

dragoman.contact = function(name) { return {
    name: name
};};

dragoman.message = function(sender, receiver, time, read, body) { return {
  sender: sender,
  receiver: receiver,
  time: time,
  read: read,
  body: body 
};};


dragoman.query = function(groups, filters, preview) { return {
  groups: groups,
  filters: filters,
  preview: preview
};};

dragoman.organization = function(id, name, query) { return {
  id: id,
  name: name,
  query: query 
};};

dragoman.qword = function(id, text) { return {
  id: id,
  text: text  
};};

dragoman.attr_qword_value_qwords = function(attr_qword, value_qwords) { return {
  attr_qword: attr_qword,
  value_qwords: value_qwords
};};

dragoman.org_data = function(org, data, options) { return {
  org: org,
  data: data, 
  options: options
};};

dragoman.qword_selection = function(position, query_type, qwords) { return {
    position: position,
    query_type: query_type, 
    qwords: qwords 
};};

