dragoman.io = function(){

  var div = function() {
    return $('<div></div>');
  };
  var mod_height = '50px';
  var blue = '#77b';
  var green = '#7b7';
  var dk_gray = '#999';
  var gray = '#ddd';
  var blue_gray = '#eef';
  var white = '#fff';

  var vertical_pane = function() {
    return div()
      .css('background-color', gray)
      .css('display', 'inline-block')
      .css('vertical-align', 'top')
  };

  var panel = function(id) {
    return vertical_pane().attr('id', id).attr('class', 'panel')
      .css('width', '400px')
    ;
  };

  var panel_divider = function() {
    return vertical_pane().attr('class', 'panel_divider')
      .css('width', '2px')
  };

  var clicked_anchor_panel_item = null;

  var panel_item = function(id) {
    return div().attr('id', id).attr('class', 'panel_item')
      .css('background-color', blue_gray)
      .css('border-bottom', '2px solid ' + gray)
    ;
  };

  var text_item = function(text) {
    return div().attr('class', 'text_item') 
      .text(text)
    ;
  };

  var mod_text_item = function(text) {
    return text_item(text) 
      .css('color', blue)
      .css('padding-top', '12px')
      .css('padding-left', '16px')
      .css('padding-bottom', '12px')
      .css('padding-right', '12px')
      .css('min-height', '15px')
    ;
  };

  var table = function() {
    return $('<table></table>')
      .css('border-collapse', 'collapse')
      .css('margin', '4px')
      ;
  };

  var tr = function() {
    return $('<tr></tr>')
      .css('margin', '0px')
      ;
  };

  var td = function() {
    return $('<td></td>').css('color', blue)
      .css('vertical-align', 'top')
      .css('padding', '0px')
      ;
  };


  var mod_panel_item = function(id, text) {
    return panel_item(id)
      .css('cursor', 'pointer')
      .append(mod_text_item(text))
    ;
  };

  var text_input = function(value) {
    return $('<input type="text"/>')
      .attr('value', value)
      .css('font-size', 'inherit')
      .css('outline', 'none')
      .css('padding', '3px')
      .css('border', '1px solid ' + dk_gray)
      .focus(function() {
        $(this).css('border', '1px solid ' + green)
      })
      .blur(function() {
        $(this).css('border', '1px solid ' + dk_gray)
      })
    ;
  };


  var clicked_installed_qword_div = null;

  var installed_qword_div = function(qword, position, query_type) {

    return row_button(qword.name) 
      .css('background-color', green)
      .click(function() {
        clicked_installed_qword_div = $(this); 
        dragoman.state.change_qword_selection(position, query_type);
      });
    

  };

  var installed_qword_divs = function(query_type, qwords) {

    return _.map(qwords, function(qword, index) {
      var l = qwords.length;
      return installed_qword_div(qword, index, query_type);
    });

  };

  var table_text_item = function(text) {
    return text_item(text)
      .css('color', dk_gray)
      .css('text-align', 'right')
      .css('margin', '1px')
      .css('padding', '2px 4px');
  };

  var capitalized = function(string) {
    var first = string.substring(0, 1).toUpperCase();
    var rest = string.substring(1);
    return first + rest;
  };

  var edit_org_item = function(org) {

    var rows = _.union(

      [ tr().append(td().append(table_text_item('Name')), 
        td().append(text_input(org.name)
          .keypress(function() {
            dragoman.state.change_current_org_name($(this).val())
          })
          .keyup(function() {
            dragoman.state.change_current_org_name($(this).val())
          })
          .css('margin', '1px')
          .css('margin-left', '2px')
          )) ],

      _.map(org.query, function(query_phrase, query_type_id) {
        var qwords = query_phrase.qwords;
        return tr().append( 
          td().append(table_text_item(capitalized(query_type_id))), 
          td().append(installed_qword_divs(query_type_id, qwords)) 
        );
      })

    );

    return panel_item('edit_org_item')
      .append(mod_text_item('Message Organization Settings')
        .css('background-color', blue)
        .css('color', white)
      )
      .append(
        table().css('padding-left', '4px')
          .css('padding-top', '4px')
          .css('padding-bottom', '4px')
          .append(rows)
      )
      .append(
        div()
          .css('boder', '1px solid black')
          .css('padding-left', '4px')
          .css('padding-top', '4px')
          .css('padding-bottom', '4px')
          .append(
            row_button('Save')
              .click(function() {
                dragoman.state.save_organization();
              })
          )
          .append(
            row_button('View')
              .click(function() {
                dragoman.state.view_organization();
              })
          )
          .append(
            row_button('Cancel')
              .click(function() {
                dragoman.state.cancel_organization();
              })
          )
      )
    ;
  };

  var button = function(text) {
    return text_item(text)
      .css('color', white)
      .css('padding', '2px 4px')
      .css('min-height', '19px')
      .css('min-width', '8px')
      .css('cursor', 'pointer')
      .css('background-color', dk_gray)
    ;
  };

  var row_button = function(text) {
    return button(text)
      .css('display', 'inline-block')
      .css('vertical-align', 'top')
      .css('margin-left', '2px')
      .css('margin-top', '1px')
      .css('margin-bottom', '1px')
    ;
  };


  var edit_org_panel = function(org) {
    return panel('edit_org_panel')
      .css('width', 2 * anchor_panel.width() + 'px')
      .append(edit_org_item(org));
  };


  var body = $('body')
    .css('margin', 0);

  var highlight = function(item) {
    item.css('background-color', blue);
    item.css('color', white);
    return item;
  };

  var anchor_panel = function() {
    var a = panel('anchor_panel');
    a.highlight = function(org) {

      a.find('div.panel_item').each(function(index) {
        var panel_item = $(this);
        var text_item = panel_item.find('div.text_item').first();
        text_item.css('background-color', blue_gray);
        text_item.css('color', blue);
      });

      if (clicked_anchor_panel_item != null) {
        var clicked_text_item = clicked_anchor_panel_item.find('div.text_item');
        highlight(clicked_text_item);
        clicked_anchor_panel_item = null;
      }

      return a;
    };

    a.remove_items = function() {
      a.find('div.panel_item').each(function(index) {
        if (index > 0) {
          $(this).remove();
        }
      }); 
      return a;
    };



    return a;
  }();


  var io = function() {

    var i = $('#io')
      .css('font-family', 'monospace')
      .css('color', white)
      .css('background-color', gray)
      .css('height', '100%')
      .append(div().attr('id', 'control_bar')
        .css('height', mod_height)
        .css('background-color', gray)
      )
      .append(anchor_panel)
      ;

    i.remove_panels = function() {
      i.find('div.panel_divider').each(function(index) {
          $(this).remove();
      }); 
      i.find('div.panel').each(function(index) {
        if (index > 0) {
          $(this).remove();
        }
      }); 
      return i;
    };

    i.add_panel = function(panel) {
      i.append(panel_divider())
      i.append(panel);
      return i;
    };

    return i;

  }();

  var on_current_org_change = function(org) {

    io.remove_panels();
    if (org != null) {
      io.add_panel(edit_org_panel(org));
    }
    
  };

  var saved_org = null;
  var on_saved_org_change = function(org) {
    saved_org = org;
    anchor_panel.highlight(org);
  };

  var on_current_org_name_change = function(name) {
  };

  var on_new_org_change = function(new_org) {

    var id = new_org.id;
    anchor_panel.append(mod_panel_item(id, '')
      .click(function() {
        clicked_anchor_panel_item = $(this);
        dragoman.state.create_new_organization()
      })
    );
    
  };

  var qword_option_div = function(qword, position, query_type) {
    return button(qword.name)
      .css('background-color', white)
      .css('color', dk_gray)
      .mouseleave(function() {
        $(this).css('background-color', white);
      })
      .mouseenter(function() {
        $(this).css('background-color', gray);
      })
      .click(function() {
        dragoman.state.replace_qword(qword, position, query_type); 
      })
    ;

  };

  var replace_qword_selection_div = function(qword_selection) {

    var id = 'qword_selection';
    $('#' + id).remove();

    if (qword_selection != null) {

      var d = div().attr('id', id)
        .css('display', 'inline-block')
        .css('vertical-align', 'top')
        .css('position', 'absolute')
        .css('margin-top', '1px')
        .css('z-index', '100')
        ;

      var position = qword_selection.position;
      var query_type = qword_selection.query_type;
      var qwords = qword_selection.qwords;

      _.forEach(qwords, function(qword) {

        d.append(qword_option_div(qword, position, query_type));

      });
      
      d.insertAfter(clicked_installed_qword_div);

    } 

  };

  var on_qword_selection_change = function(qword_selection) {
    if (edit_org_panel != null) {
      replace_qword_selection_div(qword_selection);
    } 
  };

  var on_organizations_change = function(orgs) {

    anchor_panel.remove_items();

    _.forEach(orgs, function(org) {
      var id = org.id;

      var item = mod_panel_item(id, org.name)
        .click(function() {
          clicked_anchor_panel_item = $(this);
          dragoman.state.change_current_org(org);
          dragoman.state.view_organization();
        });

      if (org == saved_org) {
        highlight(item.find('div.text_item'));
      }

      anchor_panel.append(item);

    });

  };

  var on_root_dir_change = function(root_dir) {

    io.remove_panels();

    console.log('start');
    var files = root_dir.children; 

    while (files != null) {

      var id = '';
      var p = panel(id);
      children = null;
      _.forEach(files, function(file) {

        if (file.file_type == dragoman.file_types.dir) {

          var name_array = _.map(file.pairs, function(pair) {
            return pair.attr_qword.name + ':' + pair.value_qword.name;
          }); 
          var name = name_array.join(' x ');
          var id = _.reduce(file.pairs, function(result, pair) {
            return result + '_' + pair.attr_qword.name + '-eq-' + pair.value_qword.name
          }, 'dir'); 
          var item = mod_panel_item(id, name)
            .click(function() {
              dragoman.state.view_children(file);
            })
          ;
          p.append(item);

          if (children == null && file.children != null) {
            highlight(item.find('div.text_item'));
            children = file.children;
          }

        } else if (file.file_type == dragoman.file_types.leaf){

          var name = file.name;

          var id = 'message_' + file.message.time; 
          var item = mod_panel_item(id, name)
            .click(function() {
              //...
            })
          ;
          p.append(item);

        }

      });

      io.add_panel(p);

      files = children;
    }

  };


  var handler = {
    on_new_org_change: on_new_org_change,
    on_saved_org_change: on_saved_org_change, 
    on_current_org_change: on_current_org_change,
    on_current_org_name_change: on_current_org_name_change,
    on_qword_selection_change: on_qword_selection_change,
    on_organizations_change: on_organizations_change,
    on_root_dir_change: on_root_dir_change
  };

  var start = function() {

    dragoman.state.subscribe(handler);

  };


  return {
    start: start
  };

}();

