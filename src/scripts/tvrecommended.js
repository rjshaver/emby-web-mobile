﻿define(['libraryBrowser', 'dom', 'components/categorysyncbuttons', 'cardBuilder', 'apphost', 'playbackManager', 'mainTabsManager', 'scrollStyles', 'emby-itemscontainer', 'emby-button'], function (libraryBrowser, dom, categorysyncbuttons, cardBuilder, appHost, playbackManager, mainTabsManager) {
    'use strict';

    function getTabs() {
        return [
        {
            name: Globalize.translate('TabSuggestions')
        },
         {
             name: Globalize.translate('TabLatest')
         },
         {
             name: Globalize.translate('TabShows')
         },
         {
             name: Globalize.translate('TabUpcoming')
         },
         {
             name: Globalize.translate('TabGenres')
         },
         {
             name: Globalize.translate('TabNetworks')
         },
         {
             name: Globalize.translate('TabEpisodes')
         }];
    }

    return function (view, params) {

        var self = this;
        var currentTabIndex = parseInt(params.tab || '0');

        function reload() {

            Dashboard.showLoadingMsg();

            loadResume();
            loadNextUp();
        }

        function loadNextUp() {

            var query = {

                Limit: 24,
                Fields: "PrimaryImageAspectRatio,SeriesInfo,DateCreated,BasicSyncInfo",
                UserId: Dashboard.getCurrentUserId(),
                ImageTypeLimit: 1,
                EnableImageTypes: "Primary,Backdrop,Thumb",
                EnableTotalRecordCount: false
            };

            query.ParentId = LibraryMenu.getTopParentId();

            ApiClient.getNextUpEpisodes(query).then(function (result) {

                if (result.Items.length) {
                    view.querySelector('.noNextUpItems').classList.add('hide');
                } else {
                    view.querySelector('.noNextUpItems').classList.remove('hide');
                }

                var container = view.querySelector('#nextUpItems');
                var supportsImageAnalysis = appHost.supports('imageanalysis');

                cardBuilder.buildCards(result.Items, {
                    itemsContainer: container,
                    preferThumb: true,
                    shape: "backdrop",
                    scalable: true,
                    showTitle: true,
                    showParentTitle: true,
                    overlayText: false,
                    centerText: !supportsImageAnalysis,
                    overlayPlayButton: true,
                    cardLayout: supportsImageAnalysis,
                    vibrant: supportsImageAnalysis
                });

                Dashboard.hideLoadingMsg();
            });
        }

        function enableScrollX() {
            return browserInfo.mobile;
        }

        function getThumbShape() {
            return enableScrollX() ? 'overflowBackdrop' : 'backdrop';
        }

        function loadResume() {

            var parentId = LibraryMenu.getTopParentId();

            var screenWidth = dom.getWindowSize().innerWidth;
            var limit = screenWidth >= 1600 ? 5 : 6;

            var options = {

                SortBy: "DatePlayed",
                SortOrder: "Descending",
                IncludeItemTypes: "Episode",
                Filters: "IsResumable",
                Limit: limit,
                Recursive: true,
                Fields: "PrimaryImageAspectRatio,SeriesInfo,UserData,BasicSyncInfo",
                ExcludeLocationTypes: "Virtual",
                ParentId: parentId,
                ImageTypeLimit: 1,
                EnableImageTypes: "Primary,Backdrop,Thumb",
                EnableTotalRecordCount: false
            };

            ApiClient.getItems(Dashboard.getCurrentUserId(), options).then(function (result) {

                if (result.Items.length) {
                    view.querySelector('#resumableSection').classList.remove('hide');
                } else {
                    view.querySelector('#resumableSection').classList.add('hide');
                }

                var allowBottomPadding = !enableScrollX();

                var container = view.querySelector('#resumableItems');

                var supportsImageAnalysis = appHost.supports('imageanalysis');
                var cardLayout = supportsImageAnalysis;

                cardBuilder.buildCards(result.Items, {
                    itemsContainer: container,
                    preferThumb: true,
                    shape: getThumbShape(),
                    scalable: true,
                    showTitle: true,
                    showParentTitle: true,
                    overlayText: false,
                    centerText: !cardLayout,
                    overlayPlayButton: true,
                    allowBottomPadding: allowBottomPadding,
                    cardLayout: cardLayout,
                    vibrant: supportsImageAnalysis
                });
            });
        }

        self.initTab = function () {

            var tabContent = self.tabContent;

            var resumableItemsContainer = tabContent.querySelector('#resumableItems');

            if (enableScrollX()) {
                resumableItemsContainer.classList.add('hiddenScrollX');
                resumableItemsContainer.classList.remove('vertical-wrap');
            } else {
                resumableItemsContainer.classList.remove('hiddenScrollX');
                resumableItemsContainer.classList.add('vertical-wrap');
            }

            categorysyncbuttons.init(tabContent);
        };

        self.renderTab = function () {
            reload();
        };

        function onBeforeTabChange(e) {
            preLoadTab(view, parseInt(e.detail.selectedTabIndex));
        }

        function onTabChange(e) {
            loadTab(view, parseInt(e.detail.selectedTabIndex));
        }

        function initTabs() {

            var tabsReplaced = mainTabsManager.setTabs(view, currentTabIndex, getTabs);

            if (tabsReplaced) {
                var viewTabs = document.querySelector('.tabs-viewmenubar');

                viewTabs.addEventListener('beforetabchange', onBeforeTabChange);
                viewTabs.addEventListener('tabchange', onTabChange);
                libraryBrowser.configurePaperLibraryTabs(view, viewTabs, view.querySelectorAll('.pageTabContent'), [0, 1, 2, 4, 5, 6]);

                if (!viewTabs.triggerBeforeTabChange) {
                    viewTabs.addEventListener('ready', function () {
                        viewTabs.triggerBeforeTabChange();
                    });
                }
            }
        }

        var tabControllers = [];
        var renderedTabs = [];

        function getTabController(page, index, callback) {

            var depends = [];

            switch (index) {

                case 0:
                    break;
                case 1:
                    depends.push('scripts/tvlatest');
                    break;
                case 2:
                    depends.push('scripts/tvshows');
                    break;
                case 3:
                    depends.push('scripts/tvupcoming');
                    break;
                case 4:
                    depends.push('scripts/tvgenres');
                    break;
                case 5:
                    depends.push('scripts/tvstudios');
                    break;
                case 6:
                    depends.push('scripts/episodes');
                    break;
                default:
                    break;
            }

            require(depends, function (controllerFactory) {
                var tabContent;
                if (index == 0) {
                    tabContent = view.querySelector('.pageTabContent[data-index=\'' + index + '\']');
                    self.tabContent = tabContent;
                }
                var controller = tabControllers[index];
                if (!controller) {
                    tabContent = view.querySelector('.pageTabContent[data-index=\'' + index + '\']');
                    controller = index ? new controllerFactory(view, params, tabContent) : self;
                    tabControllers[index] = controller;

                    if (controller.initTab) {
                        controller.initTab();
                    }
                }

                callback(controller);
            });
        }

        function preLoadTab(page, index) {

            getTabController(page, index, function (controller) {
                if (renderedTabs.indexOf(index) == -1) {
                    if (controller.preRender) {
                        controller.preRender();
                    }
                }
            });
        }

        function loadTab(page, index) {

            currentTabIndex = index;

            getTabController(page, index, function (controller) {
                if (renderedTabs.indexOf(index) == -1) {
                    renderedTabs.push(index);
                    controller.renderTab();
                }
            });
        }

        function onPlaybackStop(e, state) {

            if (state.NowPlayingItem && state.NowPlayingItem.MediaType == 'Video') {

                renderedTabs = [];
                mainTabsManager.getTabsElement().triggerTabChange();
            }
        }

        if (enableScrollX()) {
            view.querySelector('#resumableItems').classList.add('hiddenScrollX');
        } else {
            view.querySelector('#resumableItems').classList.remove('hiddenScrollX');
        }

        function onWebSocketMessage(e, data) {

            var msg = data;

            if (msg.MessageType === "UserDataChanged") {

                if (msg.Data.UserId == Dashboard.getCurrentUserId()) {

                    renderedTabs = [];
                }
            }

        }

        view.addEventListener('viewbeforeshow', function (e) {

            initTabs();

            if (!view.getAttribute('data-title')) {

                var parentId = params.topParentId;

                if (parentId) {

                    ApiClient.getItem(Dashboard.getCurrentUserId(), parentId).then(function (item) {

                        view.setAttribute('data-title', item.Name);
                        LibraryMenu.setTitle(item.Name);
                    });


                } else {
                    view.setAttribute('data-title', Globalize.translate('TabShows'));
                    LibraryMenu.setTitle(Globalize.translate('TabShows'));
                }
            }

            var tabs = mainTabsManager.getTabsElement();

            if (tabs.triggerBeforeTabChange) {
                tabs.triggerBeforeTabChange();
            }

            Events.on(playbackManager, 'playbackstop', onPlaybackStop);
            Events.on(ApiClient, "websocketmessage", onWebSocketMessage);
        });

        view.addEventListener('viewshow', function (e) {

            mainTabsManager.getTabsElement().triggerTabChange();
        });

        view.addEventListener('viewbeforehide', function (e) {

            Events.off(playbackManager, 'playbackstop', onPlaybackStop);
            Events.off(ApiClient, "websocketmessage", onWebSocketMessage);
        });

        view.addEventListener('viewdestroy', function (e) {

            tabControllers.forEach(function (t) {
                if (t.destroy) {
                    t.destroy();
                }
            });
        });
    };
});