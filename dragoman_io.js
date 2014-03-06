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


  var installed_qword_div = function(qword, position, query_type) {

    return row_button(qword.text) 
      .attr('id', position + '-' + query_type) 
      .attr('value', qword.id) 
      .css('background-color', green)
      .click(function() {
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


  var anchor_panel = function() {
    var a = panel('anchor_panel');
    a.highlight = function(org) {

      a.find('div.panel_item').each(function(index) {
        var panel_item = $(this);
        var text_item = panel_item.find('div.text_item').first();
        if (org != null && panel_item.attr('id') == org.id) {
          text_item.css('background-color', blue);
          text_item.css('color', white);
        } else {
          text_item.css('background-color', blue_gray);
          text_item.css('color', blue);
        } 
      });
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

    anchor_panel.highlight(org);
    io.remove_panels();
    if (org != null) {
      io.add_panel(edit_org_panel(org));
    }
    
  };

  var on_current_org_name_change = function(name) {
  };

  var on_new_org_change = function(new_org) {

    var id = new_org.id;
    anchor_panel.append(mod_panel_item(id, '')
      .click(function() {
        dragoman.state.create_new_organization()
      })
    );
    
  };

  var qword_option_div = function(qword, position, query_type) {
    return button(qword.text)
      .attr('id', qword.id)
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
      
      d.insertAfter('#' + position + '-' + query_type);

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
      anchor_panel.append(mod_panel_item(id, org.name)
        .click(function() {
          dragoman.state.change_current_org(org);
          dragoman.state.view_organization();
        })
      );
    });

  };

  var on_org_contents_change = function(org_contents) {

    io.remove_panels();
    var i = 1;
    _.forEach(org_contents, function(folders) {

      var p = panel('level_' + i);
      _.forEach(folders, function(folder) {

        var name_array = _.map(folder, function(pair) {
          return pair.value_qword.text;
        }); 

        var name = name_array.join(' x ');

        var id = _.reduce(folder, function(result, pair) {
          return result + '_' + pair.value_qword.id;
        }, ''); 

        var item = mod_panel_item(id, name);
        p.append(item);

      });

      io.add_panel(p);
      i = i + 1;
    });

  };


  var handler = {
    on_new_org_change: on_new_org_change,
    on_current_org_change: on_current_org_change,
    on_current_org_name_change: on_current_org_name_change,
    on_qword_selection_change: on_qword_selection_change,
    on_organizations_change: on_organizations_change,
    on_org_contents_change: on_org_contents_change
  };

  var start = function() {

    dragoman.state.subscribe(handler);

  };


  return {
    start: start
  };

}();

