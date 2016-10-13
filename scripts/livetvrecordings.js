define(["components/categorysyncbuttons","cardBuilder","apphost","scripts/livetvcomponents","emby-button","listViewStyle","emby-itemscontainer"],function(categorysyncbuttons,cardBuilder,appHost){function getRecordingGroupHtml(group){var html="";return html+='<div class="listItem">',html+='<button type="button" is="emby-button" class="fab mini autoSize blue" item-icon><i class="md-icon">live_tv</i></button>',html+='<div class="listItemBody two-line">',html+='<a href="livetvitems.html?type=Recordings&groupid='+group.Id+'" class="clearLink">',html+="<div>",html+=group.Name,html+="</div>",html+='<div class="secondary">',html+=1==group.RecordingCount?Globalize.translate("ValueItemCount",group.RecordingCount):Globalize.translate("ValueItemCountPlural",group.RecordingCount),html+="</div>",html+="</a>",html+="</div>",html+="</div>"}function renderRecordingGroups(context,groups){groups.length?context.querySelector("#recordingGroups").classList.remove("hide"):context.querySelector("#recordingGroups").classList.add("hide");var html="";html+='<div class="paperList">';for(var i=0,length=groups.length;i<length;i++)html+=getRecordingGroupHtml(groups[i]);html+="</div>",context.querySelector("#recordingGroupItems").innerHTML=html,Dashboard.hideLoadingMsg()}function enableScrollX(){return browserInfo.mobile&&AppInfo.enableAppLayouts}function renderRecordings(elem,recordings,cardOptions){recordings.length?elem.classList.remove("hide"):elem.classList.add("hide");var recordingItems=elem.querySelector(".recordingItems");enableScrollX()?(recordingItems.classList.add("hiddenScrollX"),recordingItems.classList.remove("vertical-wrap")):(recordingItems.classList.remove("hiddenScrollX"),recordingItems.classList.add("vertical-wrap"));var supportsImageAnalysis=appHost.supports("imageanalysis"),cardLayout=appHost.preferVisualCards||supportsImageAnalysis;recordingItems.innerHTML=cardBuilder.getCardsHtml(Object.assign({items:recordings,shape:enableScrollX()?"autooverflow":"auto",showTitle:!0,showParentTitle:!0,coverImage:!0,lazy:!0,cardLayout:cardLayout,centerText:!cardLayout,vibrant:supportsImageAnalysis,allowBottomPadding:!enableScrollX(),preferThumb:"auto",overlayText:!1},cardOptions||{})),ImageLoader.lazyChildren(recordingItems)}function getBackdropShape(){return enableScrollX()?"overflowBackdrop":"backdrop"}function renderActiveRecordings(context,promise){promise.then(function(result){result.Items.length&&"InProgress"!=result.Items[0].Status&&(result.Items=[]),renderRecordings(context.querySelector("#activeRecordings"),result.Items,{shape:getBackdropShape(),showParentTitle:!1,showTitle:!0,showAirTime:!0,showAirEndTime:!0,showChannelName:!0,cardLayout:!0,vibrant:!0,preferThumb:!0,coverImage:!0})})}function renderLatestRecordings(context,promise){promise.then(function(result){renderRecordings(context.querySelector("#latestRecordings"),result.Items),Dashboard.hideLoadingMsg()})}function renderMovieRecordings(context,promise){promise.then(function(result){renderRecordings(context.querySelector("#movieRecordings"),result.Items,{showYear:!0,showParentTitle:!1})})}function renderEpisodeRecordings(context,promise){promise.then(function(result){renderRecordings(context.querySelector("#episodeRecordings"),result.Items,{showItemCounts:!0,showParentTitle:!1})})}function renderSportsRecordings(context,promise){promise.then(function(result){renderRecordings(context.querySelector("#sportsRecordings"),result.Items,{showYear:!0,showParentTitle:!1})})}function renderKidsRecordings(context,promise){promise.then(function(result){renderRecordings(context.querySelector("#kidsRecordings"),result.Items,{showYear:!0,showParentTitle:!1})})}function onMoreClick(e){var type=this.getAttribute("data-type");switch(type){case"latest":Dashboard.navigate("livetvitems.html?type=Recordings");break;case"movies":Dashboard.navigate("livetvitems.html?type=Recordings&IsMovie=true");break;case"episodes":Dashboard.navigate("livetvitems.html?type=RecordingSeries");break;case"programs":Dashboard.navigate("livetvitems.html?type=Recordings&IsSeries=false&IsMovie=false");break;case"kids":Dashboard.navigate("livetvitems.html?type=Recordings&IsKids=true");break;case"sports":Dashboard.navigate("livetvitems.html?type=Recordings&IsSports=true")}}return function(view,params,tabContent){function enableFullRender(){return(new Date).getTime()-lastFullRender>3e5}var activeRecordingsPromise,sportsPromise,kidsPromise,moviesPromise,seriesPromise,latestPromise,self=this,lastFullRender=0;categorysyncbuttons.init(tabContent);for(var moreButtons=tabContent.querySelectorAll(".more"),i=0,length=moreButtons.length;i<length;i++)moreButtons[i].addEventListener("click",onMoreClick);tabContent.querySelector("#activeRecordings .recordingItems").addEventListener("timercancelled",function(){self.preRender(),self.renderTab()}),self.preRender=function(){activeRecordingsPromise=ApiClient.getLiveTvRecordings({UserId:Dashboard.getCurrentUserId(),IsInProgress:!0,Fields:"CanDelete,PrimaryImageAspectRatio,BasicSyncInfo",EnableTotalRecordCount:!1,EnableImageTypes:"Primary,Thumb,Backdrop"}),enableFullRender()&&(latestPromise=ApiClient.getLiveTvRecordings({UserId:Dashboard.getCurrentUserId(),Limit:enableScrollX()?12:8,IsInProgress:!1,Fields:"CanDelete,PrimaryImageAspectRatio,BasicSyncInfo",EnableTotalRecordCount:!1,EnableImageTypes:"Primary,Thumb,Backdrop"}),moviesPromise=ApiClient.getLiveTvRecordings({UserId:Dashboard.getCurrentUserId(),Limit:enableScrollX()?12:8,IsInProgress:!1,Fields:"CanDelete,PrimaryImageAspectRatio,BasicSyncInfo",EnableTotalRecordCount:!1,IsMovie:!0}),seriesPromise=ApiClient.getLiveTvRecordingSeries({UserId:Dashboard.getCurrentUserId(),Limit:enableScrollX()?12:8,IsInProgress:!1,Fields:"CanDelete,PrimaryImageAspectRatio,BasicSyncInfo",EnableTotalRecordCount:!1,IsSeries:!0}),kidsPromise=ApiClient.getLiveTvRecordings({UserId:Dashboard.getCurrentUserId(),Limit:enableScrollX()?12:8,IsInProgress:!1,Fields:"CanDelete,PrimaryImageAspectRatio,BasicSyncInfo",EnableTotalRecordCount:!1,IsKids:!0}),sportsPromise=ApiClient.getLiveTvRecordings({UserId:Dashboard.getCurrentUserId(),Limit:enableScrollX()?12:8,IsInProgress:!1,Fields:"CanDelete,PrimaryImageAspectRatio,BasicSyncInfo",EnableTotalRecordCount:!1,IsSports:!0}))},self.renderTab=function(){renderActiveRecordings(tabContent,activeRecordingsPromise),enableFullRender()&&(Dashboard.showLoadingMsg(),renderLatestRecordings(tabContent,latestPromise),renderMovieRecordings(tabContent,moviesPromise),renderEpisodeRecordings(tabContent,seriesPromise),renderSportsRecordings(tabContent,sportsPromise),renderKidsRecordings(tabContent,kidsPromise),ApiClient.getLiveTvRecordingGroups({userId:Dashboard.getCurrentUserId()}).then(function(result){renderRecordingGroups(tabContent,result.Items)}),lastFullRender=(new Date).getTime())}}});