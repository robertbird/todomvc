var Todo = Todo || {};

Todo.FormView = Backbone.View.extend({
    initialize: function () {
        this.template = $("#formTemplate");
    },
    events: {
        //capture the submit event
        "submit #todo-form": "save"
    },
    render: function () {
        var content = this.template.tmpl();
        $(this.el).html(content);
        return this;
    },
    save: function (event) {
        //save
        //read value from textbox directly. You could also just bind right to the form using the a two-way binding plugin
        var val = this.$("input").val();
        //var model = new Todo.TodoModel({ name: val, id: tasks.length });
        //model.save();
        this.collection.create({ title: val });
        //clear the input
        this.$("input").val("");
        //stop the form from submitting
        event.preventDefault();
    }
});