var Todo = Todo || {};

//the collection
Todo.TodoCollection = Backbone.Collection.extend({
    model: Todo.TodoModel,
    //if your tasks are stored in a database - set the RESTful URL here
    //url : "/tasks" //is a prime example
    
    //you could bind to this - or just use the length as below
    completed: function () {
        return _.select(this.models, function (model) {
            return model.get("completed") === true;
        });
    },
    incomplete: function () {
        return _.select(this.models, function (model) {
            return model.get("completed") === false;
        });
    }
});