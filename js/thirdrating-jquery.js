/*global window jQuery  */

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
        
        thirdRatingUrl: "http://the.thirdrating.com/api/v1/"
        
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
                
                // ok, our API will guarantee a return order in the same order
                // do quick confirm
                
                if (data.marks.length !== marks.length) {
                    return plugin.settings.onError;
                }
                
                // loop through our results
                for (var m = 0; m < data.marks.length; m++) {
                    
                    // call our handler
                    onComplete(m, data.marks[m]);
                    
                }
                
                // fire event
                plugin.settings.afterRefresh();
                
                
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
            
            /** 
             * data returned will be in the form:
             * 
             * {
             * 
             *      mark: 'name of the mark',
             *      markUrl: 'hyperlink to the mark',
             *      lastRating: nnn,
             *      change: +-1-3 or 0 if neutral rating,
             *      by: {
             *          name: 'Actual Name',
             *          url: 'link to name'
             *      },
             *      on: dateTime UTC format,
             *      note: 'short note of up to 140 characters'
             * 
             * }
             * 
             **/
            
            var elem = elems.eq(index);
            
            // first step, empty the element
            elem.empty();
            
            // construct the mark
            var spanMark = $('span.mark');
            
            var markLink = $('a');
            markLink.text(data.mark);
            markLink.attr('href', data.markUrl);
            
            spanMark.append(markLink);
            
            // construct the rating
            var rating = $('span.last-rating');
            rating.text(data.lastRating);
            
            // construct the trsymbol
            var trSymbol = $('span.tr-symbol');
            trSymbol.append($('span.t'))
                .append($('span.m'))
                .append($('span.b'));
            
            // construct the element
            elem.append(spanMark)
                .append(rating)
                .append(trSymbol);
                
            // show change if specified in params
            if (elem.data('showLastChange') || plugin.settings.showLastChange) {
                
                var lastChange = $('span.last-change');
                lastChange.text(data.lastChange);
                elem.append(lastChange);
                
            }
            
            
            
            
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