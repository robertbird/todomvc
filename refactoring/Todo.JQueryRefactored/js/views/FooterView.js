var Todo = Todo || {};

Todo.FooterView = Backbone.View.extend({
    initialize: function() {
        this.template = _.template($('#footer-template').html());
        this.listenTo(this.collection, "change reset add remove", this.render);
    },
    events: {
        "click #clear-completed" : "clearCompleted"
    },
    render: function () {
        var todoCount = this.collection.length;
        var activeTodoCount = this.collection.incomplete().length;
        var footer = {
            activeTodoCount: activeTodoCount,
            activeTodoWord: Todo.Utils.pluralize(activeTodoCount, 'item'),
            completedTodos: todoCount - activeTodoCount
        };

        //render the template
        var content = this.template(footer);
        //take the rendered HTML and pop it into the DOM
        $(this.el).html(content);
        
        this.$el.toggle(!!todoCount); // !! = convert to boolean

        return this;
    },
    clearCompleted: function (event) {
        //simply pass the completed() array to the collection's remove method
        console.log('clearing');
        console.log(this.collection.completed());
        this.collection.remove(this.collection.completed());
        event.preventDefault();
    }
});