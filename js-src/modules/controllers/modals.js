'use strict';

var $ = require('jquery');
var _ = require('lodash');
var events = require('./events');

module.exports = {
    init: function () {
        $.featherlight.defaults.afterOpen = function () {
            window.componentHandler.upgradeDom();
        };
    },
    openConfirmModal: function (message, successCallback) {
        var $modalContent = $('<div>');
        var $message = $('<div class="message">' + message + '</div>');
        var $buttonsWrapper = $('<div class="buttons">');
        var $cancelButton = $('<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent cancel">Cancel</button>');
        var $okButton = $('<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent ok">Ok</button>');
        $buttonsWrapper.append($cancelButton);
        $buttonsWrapper.append($okButton);
        $modalContent.append($message);
        $modalContent.append($buttonsWrapper);

        $cancelButton.on('click', function () {
            $.featherlight.close();
        });

        $okButton.on('click', function () {
            successCallback();
            $.featherlight.close();
        });

        var featherlightConfig = {
            variant: 'confirm-buttons'
        };
        $.featherlight($modalContent, featherlightConfig);
    },
    openMessageModal: function (message) {
        var $modalContent = $('<div>');
        var $message = $('<div class="message">' + message + '</div>');
        var $buttonsWrapper = $('<div class="buttons">');
        var $okButton = $('<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent ok">Ok</button>');
        $buttonsWrapper.append($okButton);
        $modalContent.append($message);
        $modalContent.append($buttonsWrapper);

        $okButton.on('click', function () {
            $.featherlight.close();
        });

        var featherlightConfig = {
            variant: 'message'
        };
        $.featherlight($modalContent, featherlightConfig);
    },
    openOptionSelectModal: function ($modalContent, buttonText, modalTitle, tabs) {
        var numberOfTabs = 0;
        if (tabs && tabs.length > 0) {
            numberOfTabs = tabs.length;
        }
        var $newModalContent = $modalContent;
        if (tabs) {
            $newModalContent = module.exports.renderTabs(tabs);
        }

        var featherLightConfig = {
            variant: 'option-select has-header has-footer',
            afterOpen: function () {
                $.featherlight.defaults.afterOpen();
                var lastSelectedItem;

                var $header = $('<div class="modal-header"><div class="title">' + modalTitle + '</div></div>');

                var $footer = $('<div class="modal-footer">');
                var $footerInner = $('<div class="modal-footer-inner">');
                var $summary = $('<div class="summary"><span></span></div>');
                var $button = $('<button class="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" disabled>' + buttonText + '</button>');
                $button.on('click', function () {
                    if (lastSelectedItem.selectedUpgradeId) {
                        events.trigger(lastSelectedItem.selectedUpgradeEvent, lastSelectedItem.selectedUpgradeId);
                    }
                    $.featherlight.close();
                });
                $footer.append($footerInner);
                $footerInner.append($summary);
                $footerInner.append($button);

                // Do some trickery to set the max height and allow us to have a fixed footer in the modal
                var $featherlightContent = this.$instance.find('.featherlight-content');
                var $featherlightInner = this.$instance.find('.featherlight-inner');
                var height = $featherlightContent.height();
                $featherlightInner.css('max-height', height + 'px');
                this.$instance.find('.featherlight-content').append($footer);
                this.$instance.find('.featherlight-content').append($header);

                $featherlightInner.on('select', 'li', function (event, eventData) {
                    lastSelectedItem = eventData;
                    $button.removeAttr('disabled');
                    // deselect other list options
                    $(this).closest('ul').find('li').removeClass('selected');
                    $(this).addClass('selected');
                    var $text = '<span>' + eventData.text + '</span>';
                    $summary.html($text);
                });

                $featherlightInner.on('click', '.mdl-tabs__tab', function () {
                    $button.attr('disabled', 'disabled');
                    lastSelectedItem = null;
                    $summary.html('');
                });
            }
        };
        if (numberOfTabs) {
            if (numberOfTabs > 0) {
                featherLightConfig.variant += ' has-tabs';
            }
            if (numberOfTabs > 2) {
                featherLightConfig.variant += ' many-tabs';
            }
        }
        $.featherlight($newModalContent, featherLightConfig);
    },
    renderTabs: function (tabsObject) {
        var $modalContent = $('<div>');

        if (tabsObject.length > 1) {
            // tab link elements
            var $tabsBar = $('<div class="mdl-tabs__tab-bar">');
            _.each(tabsObject, function (tab) {
                var tabId = tab.$content.attr('id');
                var $tabLink = $('<a href="#' + tabId + '" class="mdl-tabs__tab" button-text="' + tab.buttonLabel + '">' + tab.name + '</a>');
                $tabsBar.append($tabLink);
            });
            $tabsBar.find('a').first().addClass('is-active');

            // create DOM structure
            $modalContent.addClass('mdl-tabs mdl-js-tabs mdl-js-ripple-effect');
            $modalContent.prepend($tabsBar);
            tabsObject[0].$content.addClass('is-active');
            _.each(tabsObject, function (tab) {
                tab.$content.addClass('mdl-tabs__panel');
            });
        }

        _.each(tabsObject, function (tab) {
            $modalContent.append(tab.$content);
        });

        return $modalContent;
    },
    openDocsModal: function ($modalContent) {
        var featherLightConfig = {
            variant: 'content-typography'
        };
        $.featherlight($modalContent, featherLightConfig);
    }
};
