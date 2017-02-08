﻿define([], function () {
    'use strict';

    function getLocalItem(serverId, itemId) {
        return Promise.resolve();
    }

    function getLocalItemById(id) {
        return Promise.resolve();
    }

    function saveOfflineUser(user) {
        return Promise.resolve();
    }

    function deleteOfflineUser(id) {
        return Promise.resolve();
    }

    function recordUserAction(action) {
        return Promise.resolve();
    }

    function getUserActions(serverId) {
        return Promise.resolve([]);
    }

    function deleteUserAction(action) {
        return Promise.resolve();
    }

    function deleteUserActions(actions) {
        return Promise.resolve();
    }

    function getServerItemIds(serverId) {
        return Promise.resolve([]);
    }

    function getServerItems(serverId) {
        return Promise.resolve([]);
    }

    function getViews(serverId, userId) {
        return Promise.resolve([]);
    }

    function getViewItems(serverId, userId, options) {
        return Promise.resolve([]);
    }

    function removeLocalItem(localItem) {
        return Promise.resolve();
    }

    function addOrUpdateLocalItem(localItem) {
        return Promise.resolve();
    }

    function createLocalItem(libraryItem, serverInfo, jobItem) {
        return Promise.resolve();
    }

    function getSubtitleSaveFileName(localItem, mediaPath, language, isForced, format) {
        return null;
    }

    function getItemFileSize(path) {
        return Promise.resolve();
    }

    function downloadFile(url, localItem) {
        return Promise.resolve();
    }

    function downloadSubtitles(url, fileName) {
        return Promise.resolve();
    }

    function getImageUrl(serverId, itemId, imageType, index) {
        return null;
    }

    function hasImage(serverId, itemId, imageType, index) {
        return Promise.resolve();
    }

    function downloadImage(localItem, url, serverId, itemId, imageType, index) {
        return Promise.resolve();
    }

    function isDownloadFileInQueue(path) {
        return Promise.resolve();
    }

    function translateFilePath(path) {
        return Promise.resolve(path);
    }

    function resyncTransfers() {
        return Promise.resolve();
    }

    return {

        getLocalItem: getLocalItem,
        saveOfflineUser: saveOfflineUser,
        deleteOfflineUser: deleteOfflineUser,
        recordUserAction: recordUserAction,
        getUserActions: getUserActions,
        deleteUserAction: deleteUserAction,
        deleteUserActions: deleteUserActions,
        getServerItemIds: getServerItemIds,
        removeLocalItem: removeLocalItem,
        addOrUpdateLocalItem: addOrUpdateLocalItem,
        createLocalItem: createLocalItem,
        downloadFile: downloadFile,
        downloadSubtitles: downloadSubtitles,
        hasImage: hasImage,
        downloadImage: downloadImage,
        getImageUrl: getImageUrl,
        translateFilePath: translateFilePath,
        getSubtitleSaveFileName: getSubtitleSaveFileName,
        getLocalItemById: getLocalItemById,
        getServerItems: getServerItems,
        getItemFileSize: getItemFileSize,
        isDownloadFileInQueue: isDownloadFileInQueue,
        getViews: getViews,
        getViewItems: getViewItems,
        resyncTransfers: resyncTransfers
    };
});