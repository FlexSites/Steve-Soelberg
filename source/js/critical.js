/********************
 * CRITICAL PATH GLOBAL SCRIPT
 * Script that page loading and other scripts depend on
 ********************/

//Generic type validation
(function(w){
    var objectTypes = ['String','Number','Undefined','Object','Function','Boolean'],
        callback = function(type){
            w['is'+type] = function(x){
                return typeof x===type.toLowerCase();
            };
        };
    for(var i = objectTypes.length;i--;){
        callback(objectTypes[i]);
    }
}(window));

//String validation
function isArray(arr){
    return isObject(arr)&&Array.isArray(arr);
}
function isURL(url){
    return isString(url)&&/^(https?:\/\/|\/)/.test(url);
}

//Helper Methods
function define(variable,defaultValue){
    if(isUndefined(this[variable]))this[variable] = isUndefined(defaultValue)?'':defaultValue;
}
function slugify(str){
    return (str||'').replace(/[^a-zA-Z0-9]+/g,'-').toLowerCase();
}
function createCookie(name,value,days){
    var expires = "";
    if(days){
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        expires = "; expires="+date.toGMTString();
    }
    document.cookie = name+"="+value+expires+"; path=/";
}
function changeProtocol(url,isSecure){
    if(!isBoolean(isSecure))return url;
    return (isSecure?'https://':'http://')+location.hostname+(location.port<8000?'':(isSecure?':8443':':8080'))+url;
}
function formatPrice(text){
    return text?(isNumber(text)?text.toString():text).replace(/([0-9,]+)\.(\d{2})/,"<b>$1</b><span>$2</span>"):'';
}
function formatResource(src){
    if(isString(src))return /^\/[^/]/.test(src)?src.replace(/(\D)\.(js|css)/,'$1'+buildNumber+'.$2'):src;
    for(var l = src.length;l--;)src[l] = formatResource(src[l]);
    return src;
}
function keepSessionAlive()
{
    preserveSession = true;
}
function escapeHtml(str){
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

//Global Variables
var timestamp = new Date().getTime();
var noop = function(){
};
var _plugins = {
    affix:['/js/affix.js'],
    datepicker:['/js/datepicker.js','/css/datepicker.css'],
    draggable:['/js/droppable.js'],
    droppable:['/js/droppable.js'],
    dropzone:['/js/dropzone.js','/css/dropzone.css'],
    flexForm:['/js/flex.js'],
    flexslider:['/js/flexSlider.js','/css/flexSlider.css'],
    modal:['/js/modal.js','/styles'+(mobileMode?'/mobile':'')+'/modal.css'],
    mousewheel:['/js/mousewheel.js'],
    nivoSlider:['/js/nivo-slider.js','/css/nivo-slider.css'],
    parallax:['/js/parallax.js'],
    scrollspy:['/js/scrollspy.js'],
    slider:['/js/nouislider.js','/css/nouislider.css'],
    sortable:['/js/sortable.js'],
    ticker:['/js/ticker.js'],
    timepicker:['/js/timepicker.js','/css/timepicker.css'],
    tooltip:['/js/tooltip.js','/css/tooltip.css'],
    typeahead:['/js/typeahead.js']
};
_plugins.datetimepicker = _plugins.timepicker;

// Parse Query Params
(function(){
    var params = {
        add:function(key,value){
            var uri = location.href,newURI,re = new RegExp("([?|&])"+key+"=.*?(&|$)","i");
            if(uri.match(re)){
                newURI = uri.replace(re,'$1'+key+"="+value+'$2');
            }
            else {
                newURI = uri+(uri.indexOf('?')!==-1?"&":"?")+key+"="+value;
            }
            if(newURI!==uri)location.href = newURI;
        }
    };
    if(location.search){
        var properties = location.search.substr(1).split('&');
        for(var i = properties.length;i--;){
            var values = properties[i].split('=');
            params[values[0]] = decodeURIComponent(escapeHtml(values[1]));
        }
    }
    window.params = params;
}());

define('isProduction',true);
define('popupMessage');
define('mobileMode',false);
define('popupMenuFile');
define('buildNumber');
define('loggedIn',false);
define('kioskMode',false);
define('preserveSession',false);
define('isSite',true);
define('forceDesktop',false);
define('unsupported',false);
define('host',location.host);
define('analytics',false);


isFrame = top.location!==self.location;
isSecure = 'https:'===document.location.protocol;

//Error logging
if(isProduction){
    window.onerror = function(msg,file,line){
        if(!unsupported)ga('send','event',isString(file)&&/^(\/|http:\/\/www.rcwilley)/.test(file)?'error':'extError',location.pathname,msg+' | File: '+file+' | Line: '+line,line,{nonInteraction:1});
    };
}

//Define the dev console
if(isUndefined(console)){
    console = {log:noop,warn:noop,error:noop};
}

//Script & Stylesheet Loader
(function(w,d){
    var body = d.getElementsByTagName('body')[0],critical = d.getElementById('critical-js'),styles = d.getElementById('styles-css')
    w.loadJS = function(src,callback){
        loadFile('script',src,callback);
    };
    w.loadCSS = function(src){
        loadFile('link',src);
    };
    w.load = function(file,callback){
        if(!isString(file))for(var i = 0;i<file.length;i++)load(file[i],callback);
        else if(_plugins[file])load(_plugins[file],callback);
        else file.split('.').pop()==='js'?loadJS(file,callback):loadCSS(file,callback);
    };
    function loadFile(type,src,callback){
        var isScript = type==='script',elem = d.createElement(type),listener;
        if(d.getElementById(elem.id = slugify(src.replace(/.*[/]/,''))))return callback&&callback(src);
        if(isScript){
            elem.defer = elem.async = elem.src = formatResource(src);
            if(isFunction(callback)){
                elem.addEventListener('load',listener = function(){
                    callback(src);
                    elem.removeEventListener('load',listener,false);
                },false);
            }
        }
        else {
            elem.href = src;
            elem.type = 'text/css';
            elem.rel = 'stylesheet';
        }
        body.insertBefore(elem,isScript?critical:styles);
    }
}(window,document));

//TODO Replace yepnope with loadJS
//Fallback for backwards compatibility
window.yepnope = loadJS;

//Detect iFrame
if(isFrame)document.getElementsByTagName('html')[0].className += ' iframe';

//Google Analytics
if(analytics && host){
	(function(a,b){
	    a.GoogleAnalyticsObject = b;
	    a[b] = a[b]||function(){
	        (a[b].q = a[b].q||[]).push(arguments);
	    };
	    a[b].l = 1*new Date;
	    load(['//www.google-analytics.com/analytics.js','//www.google-analytics.com/plugins/ua/linkid.js']);
	})(window,"ga");
	
	ga('create',analytics,host);
	ga('require','displayfeatures');
	ga('require','ecommerce','ecommerce.js');
	ga('send','pageview');
}

//Screen size functions
sizes = ['mobile','tablet','desktop','large'],viewMode = sizes[2];
(function(w){
    function callback(type){
        w['is'+type.charAt(0).toUpperCase()+type.slice(1)] = function(){
            return viewMode===type;
        };
    }
    for(var i = sizes.length;i--;){
        callback(sizes[i]);
    }
}(window));
function isFixed(){
    return $(window).height()>700&&!isMobile();
}

//Date Prototype Extension
(function(){
    var monthName = ['January','February','March','April','May','June','July','August','September','October','November','December'],
        dayName = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    Date.prototype.getMonthString = function(month){
        return monthName[this.getMonth()];
    };
    Date.prototype.getDayString = function(day){
        return dayName[this.getDay()];
    };
}());

//jQuery loader
(function(jQsrc){

    var q = [];
    var dq = [];
    var jQl = {};

    loadJS(jQsrc,jQl.boot = function(){
        if(isFunction($.each)){
            $.holdReady(true);
            jQmods();
            $.holdReady(false);
            if(mobileMode)dq.push(formatResource('/js/mobile.js'));
            for(var a = 0;a = dq.shift();)loadJS(a);
            $(function(){
                for(var b = 0;b = q.shift();)b()
            });
        }
        else {
            setTimeout(jQl.boot,50);
        }
    });

    if(isUndefined(window.jQuery)){
        window.jQuery = window.$ = jQl.ready = function(f){
            if(isFunction(f)){
                q.push(f);
            }
            return jQl;
        };
    }

    function jQmods(){
        $.each(_plugins,function(name,files){
            $[name] = $.fn[name] = function(){
                var arg = arguments,that = this;
                setTimeout(function(){
                    if(that.length)
                        load(formatResource(files),function(){
                        	console.log(that,arg);
                            that[name].apply(that,arg);
                        });
                },1);
                return that;
            };
        });
        //Adding error callback for $.getJSON
        $.postJSON = function(url,data){
            var jsonObj = {json:true};
            return $.ajax({
                type:"POST",
                url:url,
                data:isUndefined(data)?jsonObj:isString(data)?'json=true&'+data:$.extend(data,jsonObj),
                dataType:'json'
            }).pipe(
                function(response){
                    if(response.errorMessage){
                        return $.Deferred().reject(response.errorMessage);
                    }
                    return response.result;
                },
                function(error){
                    console.warn(error);
                    return $.Deferred().reject({error:true});
                }
            );
        };
        //Added functionality to jquery .val() to get value of checked input rather than value of selected input.
        var val = $.fn.val;
        $.fn.val = function(value){
            if(this.first().attr('type')==='radio'){
                var name = this.first().attr('name');
                if(value)return this.prop('checked',false).filter('[value="'+value+'"]').prop('checked',true).end();
                else return val.apply(this.filter('[name="'+name+'"]:checked'),arguments);
            }
            else {
                return val.apply(this,arguments);
            }
        };
        //Fixes jQuery focus for our fixed header.
        var focus = $.fn.focus;
        $.fn.focus = function(){
            var offset = $(this).offset();
            if(offset&&offset.top-200<$(window).scrollTop())$(window).scrollTop(offset.top-200);
            return focus.apply(this,arguments);
        };
    }
}(isProduction?'http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js':'/js/jquery.js'));

//Lazy Loading Images
$(function(){
    var $win = $(window),threshold = 1000,heroAspect = 320/980,windowHeight = $win.height(),rowCount = 1,lastOffset = 0,
        load = function(){
            var $that = $(this),
                source = $that.attr('data-src')||$that.attr('src'),
                lazyRow = $that.attr('data-lazyRow'), opts;
            if(source){
                // if(source.substr(0,8)==='//static'){
                //     var opts = {width:Math.ceil(Math.max($that.width(),100)/100)*100};
                //     if($that.data('aspect')!==1&&source.indexOf('/products/')===-1)opts.type = 'crop';
                //     if($that.is('.hero')){
                //         opts.height = opts.width*heroAspect;
                //         opts.type = 'zoom';
                //         opts.cropWidth = 980;
                //         opts.cropHeight = 320;
                //     }
                // }
                $that.attr('src',function(i,val){
                	console.log(isUndefined(opts));
                    if(isUndefined(opts)||getNaturalWidth(val)<opts.width)return replaceImage(source,opts);
                });
            }
            if(lazyRow){
                $(lazyRow = '.lazy'+lazyRow).removeClass(lazyRow.substr(1)).each(load);
            }
            $that.removeAttr('data-src data-bg data-lazyRow data-offset');
        },
        lazy = function(event){
            if(images.length){
                if(event&&event.type==='resize')windowHeight = $win.height();
                var fold = $win.scrollTop()+windowHeight+threshold;
                images = images.filter(function(){
                    var inview = parseInt($(this).attr('data-offset'))<fold&&($(this).is(':visible')||$(this).is('[data-src]'));
                    inview&&load.call(this);
                    return !inview;
                });
            }
        },
        images,
        repaint = function(){
            var paintTime = new Date().getTime();
            images = $('img').filter(function(){
                var $this = $(this),offset = $this.offset().top;
                if(offset<windowHeight||isFrame||$this.hasClass('pixel')){
                    load.call(this);
                    return false;
                }
                else if(Math.abs(offset-lastOffset)>100){
                    $this.attr({'data-offset':lastOffset = offset,'data-lazyRow':++rowCount});
                    return true;
                }
                $this.addClass('lazy'+rowCount);
                return false;
            });
        };
    repaint();
    $win.on('scroll.lazy resize.lazy',lazy).on('repaint',repaint);
    lazy();
});
/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} src
 * @param {Element|Object=} callback
 */
function load3rd(src,callback){
    $(function(){
        load(src,callback);
    });
}
var isFrame = top.location!=self.location;
if(isFrame)document.getElementsByTagName('html')[0].className += ' iframe';
var Popup = Popup||{
    open:function(){
        var args = arguments;
        load('modal',function(){
            Popup.open.apply(Popup,args);
        });
    },
    close:function(){
        load('modal',function(){
            Popup.close.call(Popup);
        });
    }
}

//Unified product markup
function renderProduct(product,size){
    var productHTML = '';
    if(!isUndefined(product)){
        productHTML += '<a href="/'+product.sku+'" class="product r'+(product.savings?' sale':'')+'" id="sku-'+product.sku+'">';
        productHTML += '<img src="'+(product.image?product.image:'//static.rcwilley.com/products/'+product.sku+'/')+'image1~'+(size?size:'100')+'.jpg?r='+product.revision+'" class="image" />';
        productHTML += '<span class="name">'+product.name+'</span>';
        if(product.model)productHTML += '<span class="model">'+product.model+'</span>';
        productHTML += product.price;
        if(product.subPrice)productHTML += '<span class="subPrice">'+product.subPrice+'</span>';
        if(product.rating)productHTML += '<span class="rating"><i class="icon-'+product.rating.replace(".","-")+'-star"></i></span>';
        productHTML += '</a>';
    }
    return productHTML;
}

//Returns image formatted for the image server
function replaceImage(src,opts){
    if(src){
        var parts = src.match(/^(.*\/[^~.]+)(?:[^.]*)([^?]+)(.*)$/),options = '';
        if(opts&&(parts[2]==='.jpg'||parts[2]==='.png')){
            if(!isUndefined(opts.width))options += Math.ceil(Math.max(opts.width,100)/100)*100;
            if(opts.height)options += 'x'+Math.ceil(opts.height);
            if(opts.type)options += opts.type.charAt(0);
            if(opts.cropWidth)options += Math.ceil(opts.cropWidth);
            if(opts.cropHeight)options += 'x'+Math.ceil(opts.cropHeight);
            if(opts.x)options += opts.x;
            if(opts.y)options += 'x'+opts.y;
            if(options.length)options = '~'+options;
        }
        src = parts[1]+options+parts[2]+parts[3];
    }
    return src;
}

function getNaturalWidth(src){
    var width = 0;
    if(isURL(src)){
        if(src.lastIndexOf('~')>0){
            width = src.match(/~(\d+)[xczf.]/)[1];
        }
        else {
            var img = new Image();
            img.src = src;
            width = img.width;
        }
    }
    return width;
}

//Google Tag Manager
//(function(w,l){
//    w[l] = w[l]||[];
//    w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
//    load3rd('//www.googletagmanager.com/gtm.js?id=GTM-5XNBDS');
//})(window,'dataLayer');
