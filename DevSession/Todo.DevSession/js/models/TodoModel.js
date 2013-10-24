
var Todo = Todo || {};

Todo.TodoModel = Backbone.Model.extend({
    defaults: {
        id: Todo.Utils.uuid(),
        title: '',
        completed: false
    }
});