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

        $.fn.wysiwyg = function (options)
        {
        };

        $.fn.wysiwyg.internals = {
                innerDocument: innerDocument,
                documentSelection: documentSelection
        };

        $.fn.wysiwyg.methods = {
        };

        $.fn.wysiwyg.defaults = {
                html: '<' + '?xml version="1.0" encoding="UTF-8"?' + '><!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en"><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8">STYLE_SHEET</head><body style="margin: 0px;">INITIAL_CONTENT</body></html>',
                formTableHtml: '<form class="wysiwyg"><fieldset><legend>Insert table</legend><label>Count of columns: <input type="text" name="colCount" value="3" /></label><label><br />Count of rows: <input type="text" name="rowCount" value="3" /></label><input type="submit" class="button" value="Insert table" /> <input type="reset" value="Cancel" /></fieldset></form>',
                formImageHtml:'<form class="wysiwyg"><fieldset><legend>Insert Image</legend><label>Image URL: <input type="text" name="url" value="http://" /></label><label>Image Title: <input type="text" name="imagetitle" value="" /></label><label>Image Description: <input type="text" name="description" value="" /></label><input type="submit" class="button" value="Insert Image" /> <input type="reset" value="Cancel" /></fieldset></form>',
                formWidth: 440,
                formHeight: 270,
                tableFiller: 'Lorem ipsum',
                css: { },
                debug: false,
                autoSave: true,
                // http://code.google.com/p/jwysiwyg/issues/detail?id=11
                rmUnwantedBr: true,
                // http://code.google.com/p/jwysiwyg/issues/detail?id=15
                brIE: true,
                messages:
                {
                        nonSelection: 'select the text you wish to link'
                },
                events: { },
                controls: [ ],
                resizeOptions: false
        };
        $.fn.wysiwyg.controlDefinitions = {};
        $.fn.wysiwyg.availablePlugins = {};

        $.fn.wysiwyg.requirePlugin = function(pluginName, callback)
        {
                // by default we suppose that they are preloaded by site.
                callback.call();
        };

        $.fn.wysiwyg.require = function(listOfPlugins, callback)
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
                        $.fn.wysiwyg.requirePlugin(listOfPlugins[i], singleCallback);
                }
        };

})(jQuery);
