define(["dom","scroller","browser","layoutManager","focusManager","registerElement","css!./emby-tabs","scrollStyles"],function(dom,scroller,browser,layoutManager,focusManager){"use strict";function getBoundingClientRect(elem){return elem.getBoundingClientRect?elem.getBoundingClientRect():{top:0,left:0}}function animtateSelectionBar(bar,start,pos,duration,onFinish){var endTransform=pos?"translateX("+Math.round(pos)+"px)":"none";if(!duration||!bar.animate||layoutManager.tv)return bar.style.transform=endTransform,void(onFinish&&onFinish());var startTransform=start?"translateX("+Math.round(start)+"px)":"none";bar.style.transform=startTransform;var keyframes=[{transform:"translateX("+start+"px)",offset:0},{transform:endTransform,offset:1}];bar.animate(keyframes,{duration:duration,iterations:1,easing:"linear",fill:"forwards"}),setTimeout(onFinish,duration)}function moveSelectionBar(tabs,newButton,oldButton,animate){var selectionBar=tabs.selectionBar;selectionBar&&(selectionBar.style.width=newButton.offsetWidth+"px",selectionBar.classList.remove("hide"));var tabsOffset=getBoundingClientRect(tabs),startOffset=tabs.currentOffset||0;oldButton&&(startOffset=tabs.scroller?tabs.scroller.getCenterPosition(oldButton):getBoundingClientRect(oldButton).left-tabsOffset.left);var endPosition;if(tabs.scroller)endPosition=tabs.scroller.getCenterPosition(newButton);else{var tabButtonOffset=getBoundingClientRect(newButton);endPosition=tabButtonOffset.left-tabsOffset.left}var delay=animate?100:0;tabs.currentOffset=endPosition;var onAnimationFinish=function(){newButton.classList.add(activeButtonClass),selectionBar&&selectionBar.classList.add("hide")};selectionBar?animtateSelectionBar(selectionBar,startOffset,endPosition,delay,onAnimationFinish):onAnimationFinish()}function getFocusCallback(tabs,e){return function(){onClick.call(tabs,e)}}function onFocus(e){layoutManager.tv&&(this.focusTimeout&&clearTimeout(this.focusTimeout),this.focusTimeout=setTimeout(getFocusCallback(this,e),700))}function getTabPanel(tabs,index){var tabsContainer=dom.parentWithClass(tabs,"tabs-container");if(tabsContainer)return tabsContainer.querySelector('.tabContent[data-index="'+index+'"]')}function removeActivePanelClass(tabs,index){var tabPanel=getTabPanel(tabs,index);tabPanel&&tabPanel.classList.remove("is-active")}function fadeInRight(elem){var pct=browser.mobile?"4%":"0.5%",keyframes=[{opacity:"0",transform:"translate3d("+pct+", 0, 0)",offset:0},{opacity:"1",transform:"none",offset:1}];elem.animate(keyframes,{duration:160,iterations:1,easing:"ease-out"})}function triggerBeforeTabChange(tabs,index,previousIndex){tabs.dispatchEvent(new CustomEvent("beforetabchange",{detail:{selectedTabIndex:index,previousIndex:previousIndex}})),null!=previousIndex&&previousIndex!==index&&removeActivePanelClass(tabs,previousIndex);var newPanel=getTabPanel(tabs,index);newPanel&&(newPanel.animate&&fadeInRight(newPanel),newPanel.classList.add("is-active"))}function onClick(e){this.focusTimeout&&clearTimeout(this.focusTimeout);var tabs=this,current=tabs.querySelector("."+activeButtonClass),tabButton=dom.parentWithClass(e.target,buttonClass);if(tabButton&&tabButton!==current){current&&current.classList.remove(activeButtonClass);var previousIndex=current?parseInt(current.getAttribute("data-index")):null;moveSelectionBar(tabs,tabButton,current,!0);var index=parseInt(tabButton.getAttribute("data-index"));triggerBeforeTabChange(tabs,index,previousIndex),setTimeout(function(){tabs.selectedTabIndex=index,tabs.dispatchEvent(new CustomEvent("tabchange",{detail:{selectedTabIndex:index,previousIndex:previousIndex}}))},120),tabs.scroller&&tabs.scroller.toCenter(tabButton,!1)}}function initScroller(tabs){if(!tabs.scroller){var contentScrollSlider=tabs.querySelector(".emby-tabs-slider");contentScrollSlider?(tabs.scroller=new scroller(tabs,{horizontal:1,itemNav:0,mouseDragging:1,touchDragging:1,slidee:contentScrollSlider,smart:!0,releaseSwing:!0,scrollBy:200,speed:120,elasticBounds:1,dragHandle:1,dynamicHandle:1,clickBar:1,hiddenScroll:!0,requireAnimation:!browser.safari}),tabs.scroller.init()):tabs.classList.add("hiddenScrollX")}}function initSelectionBar(tabs){if(browser.animate){var contentScrollSlider=tabs.querySelector(".emby-tabs-slider");if(contentScrollSlider&&"false"!==tabs.getAttribute("data-selectionbar")&&!layoutManager.tv){var elem=document.createElement("div");elem.classList.add("emby-tabs-selection-bar"),contentScrollSlider.appendChild(elem),tabs.selectionBar=elem}}}var EmbyTabs=Object.create(HTMLDivElement.prototype),buttonClass="emby-tab-button",activeButtonClass=buttonClass+"-active";EmbyTabs.createdCallback=function(){this.classList.contains("emby-tabs")||(this.classList.add("emby-tabs"),this.classList.add("focusable"),dom.addEventListener(this,"click",onClick,{passive:!0}),dom.addEventListener(this,"focus",onFocus,{passive:!0,capture:!0}),initSelectionBar(this))},EmbyTabs.focus=function(){var selected=this.querySelector("."+activeButtonClass);selected?focusManager.focus(selected):focusManager.autoFocus(this)},EmbyTabs.refresh=function(){this.scroller&&this.scroller.reload()},EmbyTabs.attachedCallback=function(){initScroller(this);var current=this.querySelector("."+activeButtonClass),currentIndex=current?parseInt(current.getAttribute("data-index")):0,tabButtons=this.querySelectorAll("."+buttonClass),newTabButton=tabButtons[currentIndex];newTabButton&&moveSelectionBar(this,newTabButton,current,!1)},EmbyTabs.detachedCallback=function(){this.scroller&&(this.scroller.destroy(),this.scroller=null),dom.removeEventListener(this,"click",onClick,{passive:!0}),dom.removeEventListener(this,"focus",onFocus,{passive:!0,capture:!0}),this.selectionBar=null},EmbyTabs.selectedIndex=function(selected,triggerEvent){var tabs=this;if(null==selected)return tabs.selectedTabIndex||0;var current=tabs.selectedIndex();tabs.selectedTabIndex=selected;var tabButtons=tabs.querySelectorAll("."+buttonClass);if(current===selected||triggerEvent===!1){triggerBeforeTabChange(tabs,selected,current),tabs.dispatchEvent(new CustomEvent("tabchange",{detail:{selectedTabIndex:selected}}));var currentTabButton=tabButtons[current];moveSelectionBar(tabs,tabButtons[selected],currentTabButton,!1),current!==selected&&currentTabButton&&currentTabButton.classList.remove(activeButtonClass)}else onClick.call(tabs,{target:tabButtons[selected]})},EmbyTabs.triggerBeforeTabChange=function(selected){var tabs=this;triggerBeforeTabChange(tabs,tabs.selectedIndex())},EmbyTabs.triggerTabChange=function(selected){var tabs=this;tabs.dispatchEvent(new CustomEvent("tabchange",{detail:{selectedTabIndex:tabs.selectedIndex()}}))},document.registerElement("emby-tabs",{prototype:EmbyTabs,extends:"div"})});