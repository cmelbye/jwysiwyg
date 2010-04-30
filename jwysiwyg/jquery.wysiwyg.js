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
                try
                {
                        return element.contentWindow.document;
                }
                catch (e)
                {
                        return null;
                }
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
                };
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
                return this.editor.data('wysiwyg') != null;
        };

        // Expose methods
        $.extend(api.methods, {
                isWysiwyg: isWysiwyg
        });

        var initFrame;
        var designMode = function($iframe)
        {
                var doc = innerDocument($iframe);
                var attempts = 3;
                var runner;
                runner = function()
                {
                        if (doc !== innerDocument($iframe))
                        {
                                initFrame($iframe);
                                return;
                        }
                        try
                        {
                                doc.designMode = 'on';
                        }
                        catch (e)
                        {
                        }
                        attempts--;
                        if (attempts > 0 && $.browser.mozilla)
                        {
                                setTimeout(runner, 100);
                        }
                };
                runner();
        };

        var initFrame = function($iframe, content)
        {
                var doc = innerDocument($iframe);
                var headTags = '';
                doc.open();
                doc.write(api.buildIFrameHtml(content, headTags));
                doc.close();
                designMode($iframe);
        };

        var createFrame = function($original)
        {
                var newX = $original.outerWidth || 16;
                var newY = $original.outerHeight || 16;
                var $iframe = $(location.protocol == 'https:' ? '<iframe src="javascript:false;"></iframe>' : '<iframe></iframe>');
                newX = newX.toString() + 'px';
                newY = newY.toString() + 'px';
                $iframe.css({
                        width: newX,
                        minHeight: newY
                });
                if ($.browser.msie)
                {
                        $iframe.css('height', newY);
                }
                $iframe.attr('tabindex', $original.attr('tabindex'));
                $iframe.attr('frameborder', '0');
                return $iframe;
        };

        var init = function()
        {
                var $original = $(this);
                var content = '';
                if (/^TEXTAREA$/i.test(this.tagName))
                {
                        content = $original.val();
                }
                var $editor = $('<div></div>').addClass('wysiwyg');
                var $iframe = createFrame($original).appendTo($editor);
                $original.replaceWith($editor);
                initFrame($iframe, content);
        };

        var contextCall = function(method, methodArgs)
        {
                var context = $.extend({
                        editor: this
                }, api.internals);
                mathod.call(context, methodArgs);
        };

        $.fn.wysiwyg = function (options)
        {
                // construction or call?
                if (!isWysiwyg.call({ editor: this }))
                {
                        return this.each(init);
                }
                var methodName = arguments[0];
                var methodArgs = arguments.length > 1 ? arguments[1] : null;
                if (!(methodName in api.methods))
                {
                        throw api.messages.unknown_method + ': ' + methodName;
                }
                return contextCall.call(this, api.methods[methodName], methodArgs);
        };

        // expose API
        $.extend($.fn.wysiwyg, api);

})(jQuery);
