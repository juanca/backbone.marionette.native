Backbone = require('backbone');

/**
 * Tests for Backbone to ensure that it works as expected when depending on Backbone.Native.
 */

// Capture the Backbone global so when the tests run they use the correct version of Backbone.
(function(Backbone){
    "use strict";

    describe('Backbone ' + Backbone.VERSION, function(){
        var stable;

        beforeEach(function(){
            stable = ('$' in Backbone);
            Backbone.Native = require('../backbone.native.entry.js');

            if (stable){
                Backbone.$ = Backbone.Native;
            } else {
                Backbone.setDomLibrary(Backbone.Native);
            }
        });
    });
})(Backbone);
