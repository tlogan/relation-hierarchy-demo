dragoman.state = function() {

  var db = dragoman.database(); 

  var io_handlers = [];

  var notify_handlers = function(on_state_change, obj) {
    _.forEach(io_handlers, function(handler) {
      handler[on_state_change](obj);
    });
  };

  var new_org = dragoman.organization(
    'new',
    '',
    dragoman.query(
      dragoman.query_phrase(db.query_types.groups,[db.conj_qwords.done]), 
      dragoman.query_phrase(db.query_types.filters,[db.conj_qwords.done]), 
      dragoman.query_phrase(
        db.query_types.preview, 
        [db.open_attr_qwords.body, db.conj_qwords.done] 
      )
    )
  );


  var organizations = [];

  var set_organizations = function(_orgs) {
    organizations = _orgs;
    notify_handlers('on_organizations_change', organizations);
    notify_handlers('on_current_org_change', current_org);

  };

  var current_org = null;
  var set_current_org = function(_current_org, part_changed) {
    current_org = _current_org;

    if (part_changed == 'name') {
      notify_handlers('on_current_org_name_change', current_org.name);
    } else {
      notify_handlers('on_current_org_change', current_org);
    }

  };

  var qword_selection = null;
  var set_qword_selection = function(_qword_selection) {
    qword_selection = _qword_selection;
    notify_handlers('on_qword_selection_change', qword_selection);
  };

  //interface
  var subscribe = function(io_handler) {
    io_handler.on_current_org_change(current_org);
    io_handler.on_new_org_change(new_org);
    io_handler.on_qword_selection_change(new_org);
    io_handler.on_organizations_change(organizations);

    io_handlers.push(io_handler);
  };

  var create_new_organization = function() {
    set_current_org(new_org);
  };

  var change_qword_selection = function(position, query_type) {

    if (current_org == null) {
      alert('error: current_org is null in change_qword_selection');
    }

    var qwords = current_org.query[query_type].selection(position);
    set_qword_selection(dragoman.qword_selection(position, query_type, qwords)); 

  };

  var replace_qword = function(qword, position, query_type_id) {

    var query_phrase = current_org.query[query_type_id];
    var old_qwords = query_phrase.qwords;
    if (qword != old_qwords[position]) {
      var query_type = db.query_types[query_type_id]; 

      var new_qwords = db.new_qwords(query_type, old_qwords, qword, position);

      var new_query = dragoman.query(
        current_org.query.groups, 
        current_org.query.filters, 
        current_org.query.preview 
      );
      new_query[query_type_id] = dragoman.query_phrase(query_type, new_qwords);

      var org = dragoman.organization(
        current_org.id,
        current_org.name,
        new_query
      );

      set_current_org(org);

    }

    set_qword_selection(null); 

  };

  var save_organization = function() {

    if (current_org.id == new_org.id) {

      var id = 'org_' + organizations.length; 
      var org = dragoman.organization(
        id,
        current_org.name,
        current_org.query
      );
      var _organizations = _.flatten([organizations, org]);
      set_organizations(_organizations);
      set_current_org(org);

    } else {

      var index = current_org.id.substring(4);
      var start = organizations.slice(0, index);
      var end = organizations.slice(index + 1);

      var _organizations = _.flatten([start, current_org, end]);
      set_organizations(_organizations);

    }


  };

  var change_current_org_name = function(name) {
    var org = dragoman.organization(
      current_org.id,
      name,
      current_org.query
    );

    set_current_org(org, 'name');

  };

  var cancel_organization = function() {

    set_current_org(null);

  };


  var org_contents = [];
  var set_org_contents = function(_org_contents) {
    org_contents = _org_contents;
    notify_handlers('on_org_contents_change', org_contents);
  };

  var view_organization = function() {

    if (current_org == null) {
      console.log('error: current_org is null in view_current_organization');
    }

    var parent_dirs = [];

    var first_level_contents = db.get_org_content(current_org, parent_dirs);

    set_org_contents(first_level_contents);

  };

  var change_current_org = function(org) {
    set_current_org(org);
  };

  return {
    subscribe: subscribe,
    create_new_organization: create_new_organization,
    change_qword_selection: change_qword_selection,
    replace_qword: replace_qword,
    change_current_org_name: change_current_org_name,
    save_organization: save_organization,
    view_organization: view_organization,
    cancel_organization: cancel_organization,
    change_current_org: change_current_org
  };

}();
