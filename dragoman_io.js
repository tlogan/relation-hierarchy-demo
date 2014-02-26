dragoman.io = function(){



  var body = $('body')
    .css('margin', 0);
  var io = $('#io');
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
      .css('color', blue)
      .css('padding-top', '15px')
      .css('padding-left', '15px')
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
      .append(text_item(text))
    ;
  };

  var text_input = function(value) {
    return $('<input type="text"/>')
      .attr('value', value)
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


    var rows = [
      [ ['anchor as'], [text_input(org.anchor)] ],
      [ ['group by'], qword_divs(org.grouping) ],
      [ ['filter where'], qword_divs(org.filtering) ],
      [ ['display as'], qword_divs(org.display) ]
    ];

    return panel_item('organization')
      .css('padding-top', '15px')
      .css('padding-bottom', '15px')
      .append(text_item('message organization:'))
      .append(
        table().css('padding-left', '15px')
          .populate(rows)
      )
    ;
  };


  var add_panel = function(panel) {
    io.append(panel);
  };


  var remove_panels = function() {
    io.find('div.panel').each(function(index) {
      if (index > 0) {
        $(this).remove();
      }
    }) 
  };


  var panels = {
    organization: function(org) {
      return panel('organization')
        .append(organization_item(org));
    }
  };

  var on_sections_change = function(sections) {

    remove_panels();
    _.forEach(sections, function(section, name) {
      add_panel(
        panels[name](section)
      );
    });
    
  };

  var handler = {
    on_sections_change: on_sections_change,
  };

  var start = function() {

    io.css('font-family', 'sans-serif')
      .css('color', white)
      .css('background-color', dk_gray)
      .css('height', '100%')
      .append(div().attr('id', 'control_bar')
        .css('height', mod_height)
        .css('background-color', green)
      )
      .append(panel('root')
        .append(mod_panel_item('new', 'new')
          .click(function() {
            dragoman.state.create_new_organization()
          })
        )
      )
    ;

    dragoman.state.subscribe(handler);

  };


  return {
    start: start
  };

}();

