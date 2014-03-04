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

dragoman.organization = function(id, name, query) { return {
  id: id,
  name: name,
  query: query 
};};

dragoman.qword = function(id, text) { return {
  id: id,
  text: text  
};};

dragoman.attr_value_qword = function(attr, value) { return {
  attr: attr,
  value: value  
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

//takes a query phrase of each type
dragoman.query = function(groups_phrase, filters_phrase, preview_phrase) { return {
  groups: groups_phrase,
  filters: filters_phrase,
  preview: preview_phrase
};};

//selection is a function
dragoman.query_type = function(id, selection) { return {
  id: id,
  selection: selection
};};

dragoman.query_phrase = function(query_type, qwords) { 

  var selection = function(position) {
    var prev_qword = qwords[position - 1];
    return query_type.selection(position, prev_qword);
  };
  
  return {
    query_type: query_type,
    qwords: qwords,  
    selection: selection
  };

};
