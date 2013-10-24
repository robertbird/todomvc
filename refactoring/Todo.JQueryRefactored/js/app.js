
var Todo = Todo || {};

var ENTER_KEY = 13;

Todo.Utils = {
    uuid: function () {
        /*jshint bitwise:false */
        var i, random;
        var uuid = '';

        for (i = 0; i < 32; i++) {
            random = Math.random() * 16 | 0;
            if (i === 8 || i === 12 || i === 16 || i === 20) {
                uuid += '-';
            }
            uuid += (i === 12 ? 4 : (i === 16 ? (random & 3 | 8) : random)).toString(16);
        }

        return uuid;
    },
    pluralize: function (count, word) {
        return count === 1 ? word : word + 's';
    },
    store: function (namespace, data) {
        if (arguments.length > 1) {
            return localStorage.setItem(namespace, JSON.stringify(data));
        } else {
            var store = localStorage.getItem(namespace);
            return (store && JSON.parse(store)) || [];
        }
    }
};

//The Router
Todo.Router = Backbone.Router.extend({
    initialize: function () {
        this.todos = Todo.Utils.store('todos-jquery');
        this.todoCollection = new Todo.TodoCollection(this.todos);
        this.todoCollection.on("change add remove reset", this.saveCollection, this);
        var footerView = new Todo.FooterView({ collection: this.todoCollection, el: $('#footer') });
        footerView.render();
    },
    //"" is the default route and always displays. Other possible routes here
    // might be "completed" or "incomplete" which shows a list of those tasks
    routes: {
        "": "index",
        "completed": "completed"
    },
    index: function () {
        var view = new Todo.ListView({ collection: this.todoCollection });
        view.render();
    },
    completed: function () {
        var collection = new Todo.TodoCollection(this.todoCollection.completed());
        var view = new Todo.ListView({ collection: collection });
        view.render();
    },
    saveCollection: function() {
        console.log('saving collection');
        console.log(this.todoCollection.toJSON());
        Todo.Utils.store('todos-jquery', this.todoCollection.toJSON());
    }
});

jQuery(function ($) {
    'use strict';

    Todo.App = {
        init: function () {
        },
        render: function () {
        }
    };
    
    //EVENTS

    // Create new Todo
    $('#new-todo').on('keyup', function(e) {
        var $input = $(this);
        var val = $.trim($input.val());

        if (e.which !== ENTER_KEY || !val) {
            return;
        }

        var model = new Todo.TodoModel({
            id: Todo.Utils.uuid(),
            title: val,
            completed: false
        });
        Todo.App.todoCollection.add(model);

        $input.val('');
        Todo.App.render();
    });

    //create the router...
    var app = new Todo.Router();
    //start recording browser history. Although we don't have that need
    //since we don't navigate between routes
    Backbone.history.start();

    //Todo.App.init();
});
