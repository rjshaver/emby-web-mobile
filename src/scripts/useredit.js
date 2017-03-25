﻿define(['jQuery', 'loading', 'fnchecked'], function ($, loading) {
    'use strict';

    var currentUser;

    function loadUser(page, user) {

        currentUser = user;

        if (user.Policy.IsDisabled) {
            $('.disabledUserBanner', page).show();
        } else {
            $('.disabledUserBanner', page).hide();
        }

        if (user.ConnectLinkType == 'Guest') {
            $('#fldConnectInfo', page).hide();
            $('#txtUserName', page).prop("disabled", "disabled");
        } else {
            $('#txtUserName', page).prop("disabled", "").removeAttr('disabled');
            $('#fldConnectInfo', page).show();
        }

        $('.lnkEditUserPreferences', page).attr('href', 'mypreferencesmenu.html?userId=' + user.Id);

        LibraryMenu.setTitle(user.Name);

        $('#txtUserName', page).val(user.Name);
        $('#txtConnectUserName', page).val(currentUser.ConnectUserName);

        $('#chkIsAdmin', page).checked(user.Policy.IsAdministrator);

        $('#chkDisabled', page).checked(user.Policy.IsDisabled);
        $('#chkIsHidden', page).checked(user.Policy.IsHidden);
        $('#chkRemoteControlSharedDevices', page).checked(user.Policy.EnableSharedDeviceControl);
        $('#chkEnableRemoteControlOtherUsers', page).checked(user.Policy.EnableRemoteControlOfOtherUsers);

        $('#chkEnableDownloading', page).checked(user.Policy.EnableContentDownloading);

        $('#chkManageLiveTv', page).checked(user.Policy.EnableLiveTvManagement);
        $('#chkEnableLiveTvAccess', page).checked(user.Policy.EnableLiveTvAccess);
        $('#chkEnableContentDeletion', page).checked(user.Policy.EnableContentDeletion);

        $('#chkDisableUserPreferences', page).checked((!user.Policy.EnableUserPreferenceAccess));

        $('#chkEnableMediaPlayback', page).checked(user.Policy.EnableMediaPlayback);
        $('#chkEnableAudioPlaybackTranscoding', page).checked(user.Policy.EnableAudioPlaybackTranscoding);
        $('#chkEnableVideoPlaybackTranscoding', page).checked(user.Policy.EnableVideoPlaybackTranscoding);
        $('#chkEnableVideoPlaybackRemuxing', page).checked(user.Policy.EnablePlaybackRemuxing);

        $('#chkEnableSync', page).checked(user.Policy.EnableSync);
        $('#chkEnableSyncTranscoding', page).checked(user.Policy.EnableSyncTranscoding);
        $('#chkEnableSharing', page).checked(user.Policy.EnablePublicSharing);

        loading.hide();
    }

    function onSaveComplete(page, user) {

        loading.hide();

        var currentConnectUsername = currentUser.ConnectUserName || '';
        var enteredConnectUsername = $('#txtConnectUserName', page).val();

        if (currentConnectUsername == enteredConnectUsername) {
            require(['toast'], function (toast) {
                toast(Globalize.translate('SettingsSaved'));
            });
        } else {

            require(['connectHelper'], function (connectHelper) {
                connectHelper.updateUserLink(ApiClient, user, $('#txtConnectUserName', page).val()).then(function () {

                    loadData(page);
                });
            });
        }
    }

    function saveUser(user, page) {

        user.Name = $('#txtUserName', page).val();

        user.Policy.IsAdministrator = $('#chkIsAdmin', page).checked();

        user.Policy.IsHidden = $('#chkIsHidden', page).checked();
        user.Policy.IsDisabled = $('#chkDisabled', page).checked();
        user.Policy.EnableRemoteControlOfOtherUsers = $('#chkEnableRemoteControlOtherUsers', page).checked();
        user.Policy.EnableLiveTvManagement = $('#chkManageLiveTv', page).checked();
        user.Policy.EnableLiveTvAccess = $('#chkEnableLiveTvAccess', page).checked();
        user.Policy.EnableContentDeletion = $('#chkEnableContentDeletion', page).checked();
        user.Policy.EnableUserPreferenceAccess = !$('#chkDisableUserPreferences', page).checked();
        user.Policy.EnableSharedDeviceControl = $('#chkRemoteControlSharedDevices', page).checked();

        user.Policy.EnableMediaPlayback = $('#chkEnableMediaPlayback', page).checked();
        user.Policy.EnableAudioPlaybackTranscoding = $('#chkEnableAudioPlaybackTranscoding', page).checked();
        user.Policy.EnableVideoPlaybackTranscoding = $('#chkEnableVideoPlaybackTranscoding', page).checked();
        user.Policy.EnablePlaybackRemuxing = $('#chkEnableVideoPlaybackRemuxing', page).checked();

        user.Policy.EnableContentDownloading = $('#chkEnableDownloading', page).checked();

        user.Policy.EnableSync = $('#chkEnableSync', page).checked();
        user.Policy.EnableSyncTranscoding = $('#chkEnableSyncTranscoding', page).checked();
        user.Policy.EnablePublicSharing = $('#chkEnableSharing', page).checked();

        ApiClient.updateUser(user).then(function () {

            ApiClient.updateUserPolicy(user.Id, user.Policy).then(function () {

                onSaveComplete(page, user);
            });
        });
    }

    function onSubmit() {
        var page = $(this).parents('.page');

        loading.show();

        getUser().then(function (result) {
            saveUser(result, page);
        });

        // Disable default form submission
        return false;
    }

    function getUser() {

        var userId = getParameterByName("userId");

        return ApiClient.getUser(userId);
    }

    function loadData(page) {

        loading.show();

        getUser().then(function (user) {

            loadUser(page, user);
        });
    }

    $(document).on('pageinit', "#editUserPage", function () {

        $('.editUserProfileForm').off('submit', onSubmit).on('submit', onSubmit);

        this.querySelector('.sharingHelp').innerHTML = Globalize.translate('OptionAllowLinkSharingHelp', 30);

    }).on('pagebeforeshow', "#editUserPage", function () {

        var page = this;

        loadData(page);

    });

});