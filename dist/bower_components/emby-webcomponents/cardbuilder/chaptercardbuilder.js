define(["datetime","imageLoader","connectionManager","layoutManager","browser"],function(datetime,imageLoader,connectionManager,layoutManager,browser){"use strict";function buildChapterCardsHtml(item,chapters,options){var className="card scalableCard itemAction chapterCard";layoutManager.tv&&(browser.animate||browser.edge)&&(className+=" card-focusscale");var mediaStreams=((item.MediaSources||[])[0]||{}).MediaStreams||[],videoStream=mediaStreams.filter(function(i){return"Video"===i.Type})[0]||{},shape=options.backdropShape||"backdrop";videoStream.Width&&videoStream.Height&&videoStream.Width/videoStream.Height<=1.34&&(shape=options.squareShape||"square"),className+=" "+shape+"Card",className+=" "+shape+"Card-scalable",(options.block||options.rows)&&(className+=" block");for(var html="",itemsInRow=0,apiClient=connectionManager.getApiClient(item.ServerId),i=0,length=chapters.length;i<length;i++){options.rows&&0===itemsInRow&&(html+='<div class="cardColumn">');var chapter=chapters[i];html+=buildChapterCard(item,apiClient,chapter,i,options,className,shape),itemsInRow++,options.rows&&itemsInRow>=options.rows&&(itemsInRow=0,html+="</div>")}return html}function getImgUrl(item,chapter,index,maxWidth,apiClient){return chapter.ImageTag?apiClient.getScaledImageUrl(item.Id,{maxWidth:maxWidth,tag:chapter.ImageTag,type:"Chapter",index:index}):null}function buildChapterCard(item,apiClient,chapter,index,options,className,shape){var imgUrl=getImgUrl(item,chapter,index,options.width||400,apiClient),cardImageContainerClass="cardImageContainer chapterCardImageContainer";options.coverImage&&(cardImageContainerClass+=" coveredImage");var dataAttributes=' data-action="play" data-isfolder="'+item.IsFolder+'" data-id="'+item.Id+'" data-serverid="'+item.ServerId+'" data-type="'+item.Type+'" data-mediatype="'+item.MediaType+'" data-positionticks="'+chapter.StartPositionTicks+'"',cardImageContainer=imgUrl?'<div class="'+cardImageContainerClass+' lazy" data-src="'+imgUrl+'">':'<div class="'+cardImageContainerClass+'">';imgUrl||(cardImageContainer+='<i class="md-icon cardImageIcon">local_movies</i>');var nameHtml="";nameHtml+='<div class="cardText">'+chapter.Name+"</div>",nameHtml+='<div class="cardText">'+datetime.getDisplayRunningTime(chapter.StartPositionTicks)+"</div>";var cardBoxCssClass="cardBox";layoutManager.tv&&(cardBoxCssClass+=" cardBox-focustransform");var html='<button type="button" class="'+className+'"'+dataAttributes+'><div class="'+cardBoxCssClass+'"><div class="cardScalable"><div class="cardPadder-'+shape+'"></div><div class="cardContent">'+cardImageContainer+'</div><div class="innerCardFooter">'+nameHtml+"</div></div></div></div></button>";return html}function buildChapterCards(item,chapters,options){if(options.parentContainer){if(!document.body.contains(options.parentContainer))return;if(!chapters.length)return void options.parentContainer.classList.add("hide");options.parentContainer.classList.remove("hide")}var html=buildChapterCardsHtml(item,chapters,options);options.itemsContainer.innerHTML=html,imageLoader.lazyChildren(options.itemsContainer)}return{buildChapterCards:buildChapterCards}});