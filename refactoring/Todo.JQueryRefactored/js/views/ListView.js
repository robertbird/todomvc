var Todo = Todo || {};

//The items that have been entered and/or completed
Todo.ListView = Backbone.View.extend({
    el: '#main',
    initialize: function () {
        //rerender whenever there's a change to the collection
        //if you're pulling data remotely - bind to "fetch" here
        //in our case - this is all in memory
        this.collection.on("add remove update reset", this.render, this);
    },
    events: {
        // toggle all ticked / unticked
        "change #toggle-all" : "toggleAll"
    },
    render: function () {
        //clear out the existing list to avoid "append" duplication
        this.$('#todo-list').empty();
        
        // for perf render each item to an inmemory element
        var $fragment = $("<div></div>");
        this.collection.each(function (todoModel) {
            var view = new Todo.ItemView({ model: todoModel });
            $fragment.append(view.render().el);
        });
        this.$('#todo-list').append($fragment);

        this.$el.toggle(!!this.collection.length); // !! = convert to boolean
        this.$('#toggle-all').prop('checked', !this.collection.incomplete().length);

        return this;
    },
    toggleAll: function(event) {
        var isChecked = $(event.target).prop('checked');
        this.collection.each(function(model) {
            model.set('completed', isChecked);
        });
    }

});