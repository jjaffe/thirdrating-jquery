/**
 * Url: https://github.com/jjaffe/thirdrating-jquery
 * Author: Jonathan Jaffe
 * Copyright: 2014, thirdrating(tm). All rights reserved.
 * License: MIT
 * */
;(function ( $, window, undefined ) {
    
  $.fn.thirdrating = function(methodOrOptions) {
      
    var plugin = this;
    plugin.settings = {};
    
    // constants
    var CONST = {
        
        thirdRatingUrl: "http://the.thirdrating.com/api"
        
    };
    
    // set defaults
    var defaults = {
                
            showWho: true,
            showLastChange: true,
            showDescription: true,
            showLastUpdateDateTime: true,
            allowLink: true,
            // future feature will be auto refresh, but for now limit to refresh method
            //autoRefresh: false,
            //refreshInterval: 1,
            beforeRefresh: function () {},
            afterRefresh: function () {},
            onError: function () {}
                
        };
        
    // makes call out to thirdrating(tm)
    function refreshMarks(marks, onComplete) {
        
        // we actually make a POST out
        $.ajax({
            url: CONST.thirdRatingUrl + '/latestrating',
            method: 'POST',
            headers: {'X-API-KEY': plugin.settings.apiKey},
            data: {marks: marks}
        })
            // process returned data on success
            .done(function (data) {
                
                
                
            })
            // trigger event on failure
            .fail(plugin.settings.onError);
        
    }
    
    // we want to make a single call to the server each time to return information for all ratings referenced
    function fetchMarksForElements(elems) {
        
        // initialize array of marks
        var marks = [];
        
        elems.each(function () {
            
            // cache our element
            var elem = $(this);
            marks.push(elem.data('mark'));
            
        });
        
        // trigger our before refresh
        plugin.settings.beforeRefresh();
        
        // call our refresh - returns indexed data
        refreshMarks(marks, function onComplete(index, data) {
            
            
            
        });
        
    }

    var methods = {
        
        init : function(options) {
            
            // get our settings
            plugin.settings = $.extend({}, defaults, options );

            // if we are missing an API key, then throw an exception
            if (plugin.settings.apiKey === undefined) 
                throw new Error('missing api key');

            // call our fetch
            fetchMarksForElements(plugin);
            
            // make chainable
            return plugin;
            
        },
        refresh : function( ) { 
            
            // call our fetch
            fetchMarksForElements(plugin);
            
            // make chainable
            return plugin;
            
        }
        //update : function( content ) {  }
    };

    if ( methods[methodOrOptions] ) {
            return methods[ methodOrOptions ].apply( this, Array.prototype.slice.call( arguments, 1 ));
        } else if ( typeof methodOrOptions === 'object' || ! methodOrOptions ) {
            // Default to "init"
            return methods.init.apply( this, arguments );
        } else {
            $.error( 'Method ' +  methodOrOptions + ' does not exist on jQuery.thirdrating' );
        }      
      
  };
  
}(jQuery, window));