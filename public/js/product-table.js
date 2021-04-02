"use strict"

$(document).ready(function(){
    var productTableModule = {
        
        init: function()
        {
            this.setVars();
            this.setEventHandlers();
        },

        setVars: function()
        {
            console.log('Variables set!');
        },

        setEventHandlers: function()
        {
            console.log('Event handlers set!');
        }
    };

    productTableModule.init();
});