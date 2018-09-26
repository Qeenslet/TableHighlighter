/**
 * Highlight table, control the highlighted row with arrow keys
 * tableId - table id
 * color - highlight color
 *
 * The table should have <tbody> tag!!!!
 *
 * to activate call .decorate()
 * to turn off - .removeDecoration()
 * @param tableId
 * @param color
 */
function TableHighlighter(tableId, color){

    var active = false; //active/disabled flag
    var $rows; //rows affected
    var highlited = null; //highlighted row
    var defaultColor = 'yellow'; //default color
    var oldOnclick = []; //saved onclick properties to be restored after object destruction

    /**
     * decoration activation
     */
    this.decorate = function(){
        $rows = $('#' + tableId + '> tbody > tr');
        active = true;
        var self = this;
        $.each($rows, function (key, val) {
            var $elem = $(val);
            oldOnclick[key] = $elem.attr('onclick');
            $elem.attr('onclick', '');
            $elem.on('click.table_highlighter', function () {
                self.highlight(key);
            }.bind(self));
        });
        $(document).on("keydown.table_highlighter", function (event) {
            if (event.which == 38)
            {
                self.shiftFocus(false)
            }
            else if (event.which == 40)
            {
                self.shiftFocus(true)
            }
        }.bind(self))
    }

    /**
     * row highlight
     * @param id
     */
    this.highlight = function (id) {
        if (active && id < $rows.length) {
            if (highlited === id)
            {
                turnOff(id);
                highlited = null;
            }
            else
            {
                turnOff(highlited);
                turnOn(id);
                highlited = id;
            }
        }
    }

    /**
     * @param index
     */
    function turnOn(index) {
        var $tgt = $($rows[index]);
        $tgt.css('background-color', color ? color : defaultColor);
    }

    /**
     * @param index
     */
    function turnOff(index) {
        var $tgt = $($rows[index]);
        $tgt.css('background-color', '');
    }

    /**
     * arrow keys control
     * @param bool
     */
    this.shiftFocus = function(bool) {
        if (highlited !== null && active) {
            var index = highlited;
            var self = this;
            if (!bool && highlited > 0)
            {
                index--;
                self.highlight(index);
            }
            else if (bool && highlited < $rows.length)
            {
                index++;
                self.highlight(index);
            }
        }
    }

    /**
     * removing table decoration
     */
    this.removeDecoration = function(){
        turnOff(highlited);
        active = false;
        highlited = null;
        $.each($rows, function (key, val) {
            var $elem = $(val);
            $elem.off('click.table_highlighter');
            $elem.attr('onclick', oldOnclick[key]);
            $(document).off("keydown.table_highlighter");
        });
    }
}