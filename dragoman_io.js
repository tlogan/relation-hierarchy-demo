dragoman.io = function(){

  var div = function(id) {
    return $('<div id="' + id + '"></div>');
  };



  var start = function() {

    var body = $('body')
      .css('margin', 0);

    var mod_height = '50px';

    var panel = function(id) {
      return div(id)
        .css('max-width', '400px')
        .css('height', '100%')
        .css('background-color', '#ddd')
      ;
    };

    var panel_item = function(id, text) {
      return div(id)
        .css('height', mod_height)
        .css('background-color', '#eef')
        .css('border-bottom', '2px solid #ccc')
        .css('cursor', 'pointer')
        .append(function() {
          return $('<div></div>')
            .text(text)
            .css('color', '#88c')
            .css('padding-top', '15')
            .css('padding-left', '15')
          ;
        }())
      ;
    };

    var io = function() {
      return $('#io')
        .css('font-family', 'sans-serif')
        .css('color', '#fff')
        .css('background-color', '#ccc')
        .css('height', '100%')
        .append(function() {
          return div('control_bar')
            .css('height', mod_height)
            .css('background-color', '#9d9')
          ;
        }())
        .append(function() {
          return panel('root')
            .append(panel_item('new', 'new')
              .click(function() {
                alert('you clicked new');
              })
            )
          ;
        }())
      ;
    }();
    
  };


  return {
    start: start
  };

}();

