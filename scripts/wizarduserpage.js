define(["jQuery","loading"],function($,loading){"use strict";function getApiClient(){return ApiClient}function onUpdateUserComplete(result){if(loading.hide(),result.UserLinkResult){var msgKey=result.UserLinkResult.IsPending?"MessagePendingEmbyAccountAdded":"MessageEmbyAccountAdded";Dashboard.alert({message:Globalize.translate(msgKey),title:Globalize.translate("HeaderEmbyAccountAdded"),callback:function(){Dashboard.navigate("wizardlibrary.html")}})}else Dashboard.navigate("wizardlibrary.html")}function submit(form){loading.show();var apiClient=getApiClient();apiClient.ajax({type:"POST",data:{Name:form.querySelector("#txtUsername").value,ConnectUserName:form.querySelector("#txtConnectUserName").value},url:apiClient.getUrl("Startup/User"),dataType:"json"}).then(onUpdateUserComplete,function(){showEmbyConnectErrorMessage(form.querySelector("#txtConnectUserName").value)})}function showEmbyConnectErrorMessage(username){var msg;username?(msg=Globalize.translate("ErrorAddingEmbyConnectAccount1",'<a href="https://emby.media/connect" target="_blank">https://emby.media/connect</a>'),msg+="<br/><br/>"+Globalize.translate("ErrorAddingEmbyConnectAccount2","apps@emby.media")):msg=Globalize.translate("DefaultErrorMessage"),Dashboard.alert({message:msg})}function onSubmit(){var form=this;return submit(form),!1}$(document).on("pageinit","#wizardUserPage",function(){$(".wizardUserForm").off("submit",onSubmit).on("submit",onSubmit)}).on("pageshow","#wizardUserPage",function(){loading.show();var page=this,apiClient=getApiClient();apiClient.getJSON(apiClient.getUrl("Startup/User")).then(function(user){page.querySelector("#txtUsername").value=user.Name||"",page.querySelector("#txtConnectUserName").value=user.ConnectUserName||"",loading.hide()})})});