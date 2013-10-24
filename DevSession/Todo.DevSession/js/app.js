
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

jQuery(function ($) {
    'use strict';

    Todo.App = {
        init: function () {
            this.todos = Todo.Utils.store('todos-jquery');
            this.createTemplates();
            this.render();
        },
        createTemplates: function () {
            this.todoTemplate = _.template($('#todo-template').html());
            this.footerTemplate = _.template($('#footer-template').html());
        },
        render: function () {
            // for perf render each item to an inmemory element
            var $fragment = $("<div></div>");
            _.each(this.todos, function (todo) {
                var model = new Todo.TodoModel(todo);
                var view = new Todo.ItemView({ model: model });
                $fragment.append(view.render().el);
                //$fragment.append(Todo.App.todoTemplate({ todo: todo }));
            });
            $('#todo-list').html($fragment);

            $('#main').toggle(!!this.todos.length); // !! = convert to boolean
            $('#toggle-all').prop('checked', !this.activeTodoCount());
            this.renderFooter();
            Todo.Utils.store('todos-jquery', this.todos);
        },
        renderFooter: function () {
            var todoCount = this.todos.length;
            var activeTodoCount = this.activeTodoCount();
            var footer = {
                activeTodoCount: activeTodoCount,
                activeTodoWord: Todo.Utils.pluralize(activeTodoCount, 'item'),
                completedTodos: todoCount - activeTodoCount
            };

            $('#footer').toggle(!!todoCount); // !! = convert to boolean
            $('#footer').html(this.footerTemplate(footer));
        },
        activeTodoCount: function () {
            var count = 0;

            $.each(this.todos, function (i, val) {
                if (!val.completed) {
                    count++;
                }
            });

            return count;
        },
        // accepts an element from inside the `.item` div and
        // returns the corresponding todo in the todos array
        getTodo: function (elem, callback) {
            var id = $(elem).closest('li').data('id');

            $.each(this.todos, function (i, val) {
                if (val.id === id) {
                    callback.apply(Todo.App, arguments);
                    return false;
                }
            });
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

        Todo.App.todos.push({
            id: Todo.Utils.uuid(),
            title: val,
            completed: false
        });

        $input.val('');
        Todo.App.render();
    });

    // toggle all ticked / unticked
    $('#toggle-all').on('change', function() {
        var isChecked = $(this).prop('checked');

        $.each(Todo.App.todos, function (i, val) {
            val.completed = isChecked;
        });

        Todo.App.render();
    });

    // clear completed
    $('#footer').on('click', '#clear-completed', function() {
        var todos = Todo.App.todos;
        var l = todos.length;

        while (l--) {
            if (todos[l].completed) {
                todos.splice(l, 1); // http://www.w3schools.com/jsref/jsref_splice.asp
            }
        }

        Todo.App.render();
    });

    Todo.App.init();
});
