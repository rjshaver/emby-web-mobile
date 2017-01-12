define(["appSettings","loading","apphost","iapManager","events","shell","globalize","dialogHelper","connectionManager","layoutManager","emby-button"],function(appSettings,loading,appHost,iapManager,events,shell,globalize,dialogHelper,connectionManager,layoutManager){"use strict";function alertText(options){return new Promise(function(resolve,reject){require(["alert"],function(alert){alert(options).then(resolve,reject)})})}function showInAppPurchaseInfo(subscriptionOptions,unlockableProductInfo,dialogOptions){return new Promise(function(resolve,reject){require(["listViewStyle","formDialogStyle"],function(){showInAppPurchaseElement(subscriptionOptions,unlockableProductInfo,dialogOptions,resolve,reject),currentDisplayingResolve=resolve,currentDisplayingResolveResult={}})})}function showPeriodicMessage(feature,settingsKey){return new Promise(function(resolve,reject){appSettings.set(settingsKey,(new Date).getTime()),require(["listViewStyle","emby-button","formDialogStyle"],function(){var dlg=dialogHelper.createDialog({size:"fullscreen-border",removeOnClose:!0,scrollY:!1});dlg.classList.add("formDialog");var html="";html+='<div class="formDialogHeader">',html+='<button is="paper-icon-button-light" class="btnCancelSupporterInfo autoSize" tabindex="-1"><i class="md-icon">&#xE5C4;</i></button>',html+='<h3 class="formDialogHeaderTitle">Emby Premiere',html+="</h3>",html+="</div>",html+='<div class="formDialogContent smoothScrollY">',html+='<div class="dialogContentInner dialog-content-centered">',html+="<h1>"+globalize.translate("sharedcomponents#HeaderDiscoverEmbyPremiere")+"</h1>",html+="<p>"+globalize.translate("sharedcomponents#MessageDidYouKnowCinemaMode")+"</p>",html+="<p>"+globalize.translate("sharedcomponents#MessageDidYouKnowCinemaMode2")+"</p>",html+='<h1 style="margin-top:1.5em;">'+globalize.translate("sharedcomponents#HeaderBenefitsEmbyPremiere")+"</h1>",html+='<div class="paperList">',html+=getSubscriptionBenefits().map(getSubscriptionBenefitHtml).join(""),html+="</div>",html+="<br/>",html+='<div class="formDialogFooter">',html+='<div class="formDialogFooterItem">',html+='<button is="emby-button" type="button" class="raised button-submit block btnGetPremiere block" autoFocus><span>'+globalize.translate("sharedcomponents#HeaderBecomeProjectSupporter")+"</span></button>";var seconds=9;html+='<p class="continueTimeText" style="margin: 1.5em 0 .5em;">'+globalize.translate("sharedcomponents#ContinuingInSecondsValue",seconds)+"</p>",html+="</div>",html+="</div>",html+="</div>",html+="</div>",dlg.innerHTML=html;var i,length,isRejected=!0,timeTextInterval=setInterval(function(){seconds-=1,seconds<=0?(isRejected=!1,dialogHelper.close(dlg)):dlg.querySelector(".continueTimeText").innerHTML=globalize.translate("sharedcomponents#ContinuingInSecondsValue",seconds)},1e3),btnPurchases=dlg.querySelectorAll(".buttonPremiereInfo");for(i=0,length=btnPurchases.length;i<length;i++)btnPurchases[i].addEventListener("click",showExternalPremiereInfo);layoutManager.tv&&centerFocus(dlg.querySelector(".formDialogContent"),!1,!0),dlg.addEventListener("close",function(e){clearInterval(timeTextInterval),layoutManager.tv&&centerFocus(dlg.querySelector(".formDialogContent"),!1,!1),appSettings.set(settingsKey,(new Date).getTime()),isRejected?reject():resolve()}),dlg.querySelector(".btnGetPremiere").addEventListener("click",showPremiereInfo),dialogHelper.open(dlg);var onCancelClick=function(){dialogHelper.close(dlg)},elems=dlg.querySelectorAll(".btnCancelSupporterInfo");for(i=0,length=elems.length;i<length;i++)elems[i].addEventListener("click",onCancelClick)})})}function showPeriodicMessageIfNeeded(feature){if("playback"!==feature)return Promise.resolve();var intervalMs=iapManager.getPeriodicMessageIntervalMs(feature);if(intervalMs<=0)return Promise.resolve();var settingsKey="periodicmessage2-"+feature,lastMessage=parseInt(appSettings.get(settingsKey)||"0");return lastMessage?(new Date).getTime()-lastMessage>intervalMs?connectionManager.currentApiClient().getPluginSecurityInfo().then(function(regInfo){return regInfo.IsMBSupporter?(appSettings.set(settingsKey,(new Date).getTime()),Promise.resolve()):showPeriodicMessage(feature,settingsKey)},function(){return showPeriodicMessage(feature,settingsKey)}):Promise.resolve():(appSettings.set(settingsKey,(new Date).getTime()-intervalMs),Promise.resolve())}function validateFeature(feature,options){return options=options||{},console.log("validateFeature: "+feature),iapManager.isUnlockedByDefault(feature,options).then(function(){return showPeriodicMessageIfNeeded(feature)},function(){var unlockableFeatureCacheKey="featurepurchased-"+feature;if("1"===appSettings.get(unlockableFeatureCacheKey))return showPeriodicMessageIfNeeded(feature);var unlockableProduct=iapManager.getProductInfo(feature);if(unlockableProduct){var unlockableCacheKey="productpurchased-"+unlockableProduct.id;if(unlockableProduct.owned)return appSettings.set(unlockableFeatureCacheKey,"1"),appSettings.set(unlockableCacheKey,"1"),showPeriodicMessageIfNeeded(feature);if("1"===appSettings.get(unlockableCacheKey))return showPeriodicMessageIfNeeded(feature)}var unlockableProductInfo=unlockableProduct?{enableAppUnlock:!0,id:unlockableProduct.id,price:unlockableProduct.price,feature:feature}:null;return iapManager.getSubscriptionOptions().then(function(subscriptionOptions){return subscriptionOptions.filter(function(p){return p.owned}).length>0?Promise.resolve():connectionManager.getRegistrationInfo(iapManager.getAdminFeatureName(feature),connectionManager.currentApiClient()).catch(function(){var dialogOptions={title:globalize.translate("sharedcomponents#HeaderUnlockFeature"),feature:feature};return options.showDialog===!1?Promise.reject():showInAppPurchaseInfo(subscriptionOptions,unlockableProductInfo,dialogOptions)})})})}function cancelInAppPurchase(){var elem=document.querySelector(".inAppPurchaseOverlay");elem&&dialogHelper.close(elem)}function clearCurrentDisplayingInfo(){currentDisplayingProductInfos=[],currentDisplayingResolve=null,currentDisplayingResolveResult={}}function showExternalPremiereInfo(){shell.openUrl("https://emby.media/premiere")}function centerFocus(elem,horiz,on){require(["scrollHelper"],function(scrollHelper){var fn=on?"on":"off";scrollHelper.centerFocus[fn](elem,horiz)})}function showInAppPurchaseElement(subscriptionOptions,unlockableProductInfo,dialogOptions,resolve,reject){function onCloseButtonClick(){rejected=!0,dialogHelper.close(dlg)}cancelInAppPurchase(),currentDisplayingProductInfos=subscriptionOptions.slice(0),unlockableProductInfo&&currentDisplayingProductInfos.push(unlockableProductInfo);var dlg=dialogHelper.createDialog({size:"fullscreen-border",removeOnClose:!0,scrollY:!1});dlg.classList.add("formDialog");var html="";html+='<div class="formDialogHeader">',html+='<button is="paper-icon-button-light" class="btnCloseDialog autoSize" tabindex="-1"><i class="md-icon">&#xE5C4;</i></button>',html+='<h3 class="formDialogHeaderTitle">',html+=dialogOptions.title||"",html+="</h3>",html+="</div>",html+='<div class="formDialogContent smoothScrollY">',html+='<div class="dialogContentInner dialog-content-centered">',html+='<form style="margin:auto;">',html+='<p style="margin-top:1.5em;">',html+=unlockableProductInfo?globalize.translate("sharedcomponents#MessageUnlockAppWithPurchaseOrSupporter"):globalize.translate("sharedcomponents#MessageUnlockAppWithSupporter"),html+="</p>",html+='<p style="margin:1.5em 0 2em;">',html+=globalize.translate("sharedcomponents#MessageToValidateSupporter"),html+="</p>";var i,length,hasProduct=!1;for(i=0,length=subscriptionOptions.length;i<length;i++)hasProduct=!0,html+="<p>",html+='<button is="emby-button" type="button" class="raised button-submit block btnPurchase" data-email="'+(subscriptionOptions[i].requiresEmail!==!1)+'" data-featureid="'+subscriptionOptions[i].id+'"><span>',html+=subscriptionOptions[i].title,html+="</span></button>",html+="</p>";if(unlockableProductInfo){hasProduct=!0;var unlockText=globalize.translate("sharedcomponents#ButtonUnlockWithPurchase");unlockableProductInfo.price&&(unlockText=globalize.translate("sharedcomponents#ButtonUnlockPrice",unlockableProductInfo.price)),html+="<p>",html+='<button is="emby-button" type="button" class="raised secondary block btnPurchase" data-featureid="'+unlockableProductInfo.id+'"><span>'+unlockText+"</span></button>",html+="</p>"}html+="<p>",html+='<button is="emby-button" type="button" class="raised button-cancel block btnRestorePurchase"><span>'+iapManager.getRestoreButtonText()+"</span></button>",html+="</p>",subscriptionOptions.length&&(html+='<h1 style="margin-top:1.5em;">'+globalize.translate("sharedcomponents#HeaderBenefitsEmbyPremiere")+"</h1>",html+='<div class="paperList" style="margin-bottom:1em;">',html+=getSubscriptionBenefits().map(getSubscriptionBenefitHtml).join(""),html+="</div>"),"playback"===dialogOptions.feature&&(html+="<p>",html+='<button is="emby-button" type="button" class="raised button-cancel block btnPlayMinute"><span>'+globalize.translate("sharedcomponents#ButtonPlayOneMinute")+"</span></button>",html+="</p>"),html+="</form>",html+="</div>",html+="</div>",dlg.innerHTML=html,document.body.appendChild(dlg);var btnPurchases=dlg.querySelectorAll(".btnPurchase");for(i=0,length=btnPurchases.length;i<length;i++)btnPurchases[i].addEventListener("click",onPurchaseButtonClick);for(btnPurchases=dlg.querySelectorAll(".buttonPremiereInfo"),i=0,length=btnPurchases.length;i<length;i++)btnPurchases[i].addEventListener("click",showExternalPremiereInfo);dlg.querySelector(".btnPlayMinute").addEventListener("click",function(){currentDisplayingResolveResult.enableTimeLimit=!0,dialogHelper.close(dlg)}),dlg.querySelector(".btnRestorePurchase").addEventListener("click",function(){restorePurchase(unlockableProductInfo)}),loading.hide();var rejected=!1,btnCloseDialogs=dlg.querySelectorAll(".btnCloseDialog");for(i=0,length=btnCloseDialogs.length;i<length;i++)btnCloseDialogs[i].addEventListener("click",onCloseButtonClick);dlg.classList.add("inAppPurchaseOverlay"),layoutManager.tv&&centerFocus(dlg.querySelector(".formDialogContent"),!1,!0),dialogHelper.open(dlg).then(function(){layoutManager.tv&&centerFocus(dlg.querySelector(".formDialogContent"),!1,!1),clearCurrentDisplayingInfo(),rejected&&reject()})}function getSubscriptionBenefits(){var list=[];return list.push({name:globalize.translate("sharedcomponents#HeaderFreeApps"),icon:"check",text:globalize.translate("sharedcomponents#FreeAppsFeatureDescription")}),appHost.supports("sync")&&list.push({name:globalize.translate("sharedcomponents#HeaderOfflineDownloads"),icon:"file_download",text:globalize.translate("sharedcomponents#HeaderOfflineDownloadsDescription")}),list.push({name:globalize.translate("sharedcomponents#CoverArt"),icon:"photo",text:globalize.translate("sharedcomponents#CoverArtFeatureDescription")}),list.push({name:globalize.translate("sharedcomponents#HeaderCinemaMode"),icon:"movie",text:globalize.translate("sharedcomponents#CinemaModeFeatureDescription")}),list.push({name:globalize.translate("sharedcomponents#HeaderCloudSync"),icon:"sync",text:globalize.translate("sharedcomponents#CloudSyncFeatureDescription")}),list}function getSubscriptionBenefitHtml(item){var enableLink=appHost.supports("externalpremium"),html="",cssClass="listItem";return layoutManager.tv&&(cssClass+=" listItem-focusscale"),enableLink?(cssClass+=" listItem-button",html+='<button type="button" class="'+cssClass+' buttonPremiereInfo">'):html+='<div class="'+cssClass+'">',html+='<i class="listItemIcon md-icon">'+item.icon+"</i>",html+='<div class="listItemBody">',html+='<h3 class="listItemBodyText">',html+=item.name,html+="</h3>",html+='<div class="listItemBodyText secondary">',html+=item.text,html+="</div>",html+="</div>",html+=enableLink?"</button>":"</div>"}function onPurchaseButtonClick(){var featureId=this.getAttribute("data-featureid");"true"===this.getAttribute("data-email")?getUserEmail().then(function(email){iapManager.beginPurchase(featureId,email)}):iapManager.beginPurchase(featureId)}function restorePurchase(unlockableProductInfo){var dlg=dialogHelper.createDialog({size:"fullscreen-border",removeOnClose:!0,scrollY:!1});dlg.classList.add("formDialog");var html="";html+='<div class="formDialogHeader">',html+='<button is="paper-icon-button-light" class="btnCloseDialog autoSize" tabindex="-1"><i class="md-icon">&#xE5C4;</i></button>',html+='<h3 class="formDialogHeaderTitle">',html+=iapManager.getRestoreButtonText(),html+="</h3>",html+="</div>",html+='<div class="formDialogContent smoothScrollY">',html+='<div class="dialogContentInner dialog-content-centered">',html+='<p style="margin:2em 0;">',html+=globalize.translate("sharedcomponents#HowDidYouPay"),html+="</p>",html+="<p>",html+='<button is="emby-button" type="button" class="raised button-cancel block btnRestoreSub"><span>'+globalize.translate("sharedcomponents#IHaveEmbyPremiere")+"</span></button>",html+="</p>",unlockableProductInfo&&(html+="<p>",html+='<button is="emby-button" type="button" class="raised button-cancel block btnRestoreUnlock"><span>'+globalize.translate("sharedcomponents#IPurchasedThisApp")+"</span></button>",html+="</p>"),html+="</div>",html+="</div>",dlg.innerHTML=html,document.body.appendChild(dlg),loading.hide(),layoutManager.tv&&centerFocus(dlg.querySelector(".formDialogContent"),!1,!0),dlg.querySelector(".btnCloseDialog").addEventListener("click",function(){dialogHelper.close(dlg)}),dlg.querySelector(".btnRestoreSub").addEventListener("click",function(){dialogHelper.close(dlg),alertText({text:globalize.translate("sharedcomponents#MessageToValidateSupporter"),title:"Emby Premiere"})});var btnRestoreUnlock=dlg.querySelector(".btnRestoreUnlock");btnRestoreUnlock&&btnRestoreUnlock.addEventListener("click",function(){dialogHelper.close(dlg),iapManager.restorePurchase()}),dialogHelper.open(dlg).then(function(){layoutManager.tv&&centerFocus(dlg.querySelector(".formDialogContent"),!1,!1)})}function getUserEmail(){if(connectionManager.isLoggedIntoConnect()){var connectUser=connectionManager.connectUser();if(connectUser&&connectUser.Email)return Promise.resolve(connectUser.Email)}return new Promise(function(resolve,reject){require(["prompt"],function(prompt){prompt({label:globalize.translate("sharedcomponents#LabelEmailAddress")}).then(resolve,reject)})})}function onProductUpdated(e,product){if(product.owned){var resolve=currentDisplayingResolve;resolve&&currentDisplayingProductInfos.filter(function(p){return product.id===p.id}).length&&(cancelInAppPurchase(),resolve(currentDisplayingResolveResult))}}function showPremiereInfo(){return appHost.supports("externalpremium")?(showExternalPremiereInfo(),Promise.resolve()):iapManager.getSubscriptionOptions().then(function(subscriptionOptions){var dialogOptions={title:"Emby Premiere",feature:"sync"};return showInAppPurchaseInfo(subscriptionOptions,null,dialogOptions)})}var currentDisplayingProductInfos=[],currentDisplayingResolve=null,currentDisplayingResolveResult={};return events.on(iapManager,"productupdated",onProductUpdated),{validateFeature:validateFeature,showPremiereInfo:showPremiereInfo}});