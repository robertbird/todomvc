var Todo = Todo || {};

Todo.ItemView = Backbone.View.extend({
    tagName: "li",
    initialize: function () {
        this.template = _.template($('#todo-template').html());
        //rescope "this" so it's available to the methods requiring it
        //_.bindAll(this, "render", "toggleComplete", "setStatus", "clear", "updateModel");
        //bind the change event to the status toggle
        //this.model.bind("change:status", this.setStatus);
        this.model.bind("change:title change:completed", this.render, this);
    },
    events: {
        // Tick / Untick
        "change .toggle" : "toggle",
        // Edit
        "dblclick label" : "editStart",
        // End Edit - blur on clicking 'Enter'
        "keypress .edit" : "blurOnEnter",
        // End Edit - finished
        "blur .edit" : "editEnd",
        // Delete
        "click .destroy" : "remove"
    },
    render: function () {
        //render the template
        var content = this.template({ todo: this.model.toJSON() });
        //take the rendered HTML and pop it into the DOM
        $(this.el).html(content);
        return this;
    },
    
    toggle: function () {
        this.model.set('completed', !this.model.get('completed'));
        this.render();
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


