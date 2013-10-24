
var Todo = Todo || {};

Todo.ItemView = Backbone.View.extend({
    tagName: 'li',
    initialize: function() {
        this.template = _.template($('#todo-template').html());
        this.model.on('change', this.render, this);
    },
    events: {
        
        // Tick / Untick
        "change .toggle" : "onToggleChange",
        // Edit
        "dblclick label" : "editStart",
        // End Edit - blur on clicking 'Enter'
        "keypress .edit" : "blurOnEnter",
        // End Edit - finished
        "blur .edit" : "editEnd",
        // Delete
        "click .destroy" : "remove"
    },
    render: function() {
        var content = this.template({ todo: this.model.toJSON() });
        this.$el.html(content);
        return this;
    },
    
    onToggleChange: function () {
        this.model.set('completed', !this.model.get('completed'));
    },
    
    editStart: function () {
        this.$el.addClass('editing');
        var $input = this.$el.find('.edit');        
        var val = $input.val();
        $input.val(val).focus();
    },
    blurOnEnter: function (e) {
        if (e.which === ENTER_KEY) {
            e.target.blur();
        }
    },
    editEnd: function () {
        this.$el.removeClass('editing');
        var $input = this.$el.find('.edit');      
        var val = $.trim($input.val());

        if (val) {
            // update the model - the change event on the model will cause the render method to fire
            this.model.set('title', val);
        } else {
            this.remove();
        }
    },
    remove: function () {
        this.model.collection.remove(this.model);
    }
    

});
