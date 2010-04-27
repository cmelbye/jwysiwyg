/**
 * WYSIWYG - jQuery plugin 0.9pre
 *
 * Copyright (c) 2008-2010 Juan M Martinez
 * http://plugins.jquery.com/project/jWYSIWYG
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * $Id: $
 */

/*jslint browser: true, forin: true */

(function ($)
{
        var api = {
               internals: {}, // can be called inside plugin run.
               methods: {}, // can be called through $().wysiwyg(name, args).
               defaults: {}, // plugins add defaults to be overriden
               messages: {
                       unknown_method: 'Unknown method'
               } // i18n
        };

        api.buildIFrameHtml = function(content, headTags)
        {
               return '<' + '?xml version="1.0" encoding="UTF-8"?' + '><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">' + headTags + '</head><body style="margin: 0px;">' + content + '</body></html>';
        };

        var innerDocument = function (elts)
        {
                var element = $(elts).get(0);

                if (element.nodeName.toLowerCase() == 'iframe')
                {
                        return element.contentWindow.document;
                        /*
                         return ( $.browser.msie )
                         ? document.frames[element.id].document
                         : element.contentWindow.document // contentDocument;
                         */
                }
                return element;
        };

        var documentSelection = function(elts)
        {
                var element = $(elts).get(0);

                if (element.contentWindow.document.selection)
                {
                        return element.contentWindow.document.selection.createRange().text;
                }
                else
                {
                        return element.contentWindow.getSelection().toString();
                }
        };

        // Plugin framework

        // they register self through registerPlugin here.
        var availablePlugins = {};

        var registerPlugin = function(data)
        {
                availablePlugins[data.name] = data;
                // do more
        };

        var requirePlugin = function(pluginName, callback)
        {
                // by default we suppose that they are preloaded by site.
                callback.call();
        };

        var require = function(listOfPlugins, callback)
        {
                if (!$.isArray(listOfPlugins))
                {
                       listOfPlugins = [listOfPlugins];
                }
                var counter = listOfPlugins.length;
                if (counter == 0)
                {
                        return callback.call();
                }
                var singleCallback = function()
                {
                        counter--;
                        if (counter == 0)
                        {
                                callback.call();
                        }
                });
                for (var i = counter - 1; i >= 0; i--)
                {
                        api.internals.requirePlugin(listOfPlugins[i], singleCallback);
                }
        };

        // Expose internals
        $.extend(api.internals, {
                innerDocument: innerDocument,
                documentSelection: documentSelection,
                require: require,
                requirePlugin: requirePlugin,
                registerPlugin: registerPlugin
        });


        var isWysiwyg = function()
        {
                return this.data('wysiwyg') != null;
        };

        // Expose methods
        $.extend(api.methods, {
                isWysiwyg: isWysiwyg
        });

        var init = function()
        {
                var $this = $(this);
        };

        $.fn.wysiwyg = function (options)
        {
                // construction or call?
                if (!isWysiwyg.call(this))
                {
                        return $(this).each(init);
                }
                var methodName = arguments[0];
                var methodArgs = arguments.length > 1 ? arguments[1] : null;
                if (!(methodName in api.methods))
                {
                        throw api.messages.unknown_method + ': ' + methodName;
                }
                return api.methods[methodName].call(this, methodArgs);
        };

        // expose API
        $.extend($.fn.wysiwyg, api);

})(jQuery);
