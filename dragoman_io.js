dragoman.io = function(){





  var div = function() {
    return $('<div></div>');
  };
  var mod_height = '50px';
  var blue = '#88c';
  var green = '#9d9'; 
  var dk_gray = '#ccc';
  var gray = '#ddd';
  var blue_gray = '#eef';
  var white = '#fff';

  var panel = function(id) {
    return div().attr('id', id).attr('class', 'panel')
      .css('width', '400px')
      .css('height', '100%')
      .css('background-color', gray)
      .css('display', 'inline-block')
      .css('vertical-align', 'top')
    ;
  };

  var panel_item = function(id) {
    return div().attr('id', id).attr('class', 'panel_item')
      .css('background-color', blue_gray)
      .css('border-bottom', '2px solid ' + dk_gray)
      .css('border-left', '2px solid ' + green)
    ;
  };

  var text_item = function(text) {
    return div() 
      .text(text)
    ;
  };

  var mod_text_item = function(text) {
    return div() 
      .text(text)
      .css('color', blue)
      .css('padding-top', '16px')
      .css('padding-left', '16px')
      .css('padding-bottom', '16px')
    ;
  };

  var table = function() {
    var t = $('<table></table>');
    t.populate = function(rows) {
      _.forEach(rows, function(cells) {
        t.append(
          tr().populate(cells)
        );
      });
      return t;
    };
    return t;
  };

  var tr = function() {
    var tr = $('<tr></tr>');
    tr.populate = function(cells) {
      _.forEach(cells, function(cell) {
        tr.append(
          td().append(cell)
        );
      });
      return tr;
    };
    return tr;
  };

  var td = function() {
    var td = $('<td></td>').css('color', blue);
    td.populate = function(cell) {
      _.forEach(cell, function(item) {
        td.append(item);
      });
      return td;
    };
    return td;
  };


  var mod_panel_item = function(id, text) {
    return panel_item(id)
      .css('cursor', 'pointer')
      .css('height', mod_height)
      .append(mod_text_item(text))
    ;
  };

  var text_input = function(value) {
    return $('<input type="text"/>')
      .attr('value', value)
      .css('font-size', 'inherit')
      .css('padding', '4px')
      .css('outline', 'none')
      .css('border', '1px solid ' + dk_gray)
      .focus(function() {
        $(this).css('border', '1px solid ' + green)
      })
      .blur(function() {
        $(this).css('border', '1px solid ' + dk_gray)
      })
    ;
  };

  var qword_div = function(qword) {
    var d = div() 
      .text(qword.name)
      .css('display', 'inline-block')
      .css('vertical-align', 'top')
      .css('color', white)
      .css('background-color', dk_gray)
      .css('margin-left', '4px')
      .css('padding', '4px')
      .css('cursor', 'pointer')
    ;

    d.qword = qword;

    return d;

  };

  var qword_divs = function(qwords) {

    return _.map(qwords, function(qword) {
      return qword_div(qword);
    });
  };

  var organization_item = function(org) {

    var rows = _.map( [
      ['anchor as', org.anchor ],
      ['group by', org.grouping],
      ['filter where', org.filtering],
      ['display as', org.display]
    ], function(item, index) {
      return [
        [text_item(item[0])
          .css('background-color', green)
          .css('color', white)
          .css('text-align', 'right')
          .css('padding', '4px')],
        (index === 0) 
          ? [text_input(item[1])]
          : qword_divs(item[1])
      ];
    });

    return panel_item('organization')
      .append(mod_text_item('message organization')
        .css('background-color', blue)
        .css('color', white)
      )
      .append(
        table().css('padding-left', '4px')
          .css('padding-top', '4px')
          .css('padding-bottom', '4px')
          .populate(rows)
      )
    ;
  };


  var org_panel = function(org) {
    return panel('organization')
      .append(organization_item(org));
  };

  var body = $('body')
    .css('margin', 0);

  var io = function() {

    var i = $('#io')
      .css('font-family', 'sans-serif')
      .css('color', white)
      .css('background-color', dk_gray)
      .css('height', '100%')
      .append(div().attr('id', 'control_bar')
        .css('height', mod_height)
        .css('background-color', green)
      )
      .append(panel('anchor_panel'))

      ;

    i.remove_panels = function() {
      i.find('div.panel').each(function(index) {
        if (index > 0) {
          $(this).remove();
        }
      }); 
      return i;
    };

    i.add_panel = function(panel) {
      i.append(panel);
      return i;
    };


    return i;

  }();

  var anchor_panel = function() {
    var a = io.find('#anchor_panel');
    a.highlight = function(id) {

      a.find('div.panel_item').each(function(index) {
        var panel_item = $(this);
        if (panel_item.attr('id') == id) {
          panel_item.css('background-color', dk_gray);
        } else {
          panel_item.css('background-color', blue_gray);
        } 
      });
      return a;
    };
    return a;
  }();

  var on_org_data_change = function(org_data) {

    if (org_data != null) {
      io.remove_panels();
      var data = org_data.data;
      var org = org_data.org;
      if (data == null) {
        anchor_panel.highlight(org.id)
        io.add_panel(org_panel(org));
      } else {
        alert('not yet implemented');
      }
    }
    
  };

  var on_new_org_data_change = function(new_org_data) {

    var id = new_org_data.org.id;
    anchor_panel.append(mod_panel_item(id, id)
      .click(function() {
        dragoman.state.create_new_organization()
      })
    );
    
  };

  var handler = {
    on_org_data_change: on_org_data_change,
    on_new_org_data_change: on_new_org_data_change
  };

  var start = function() {

    dragoman.state.subscribe(handler);

  };


  return {
    start: start
  };

}();

