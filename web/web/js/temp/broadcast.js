/**
 * @author chris a <cobie8a@yahoo.com>
 * original code date - February 2013
 *
 * broadcast.js is the window.postMessage implementation
 *
 * some guidance in implementation taken from
 * http://benalman.com/projects/jquery-postmessage-plugin/
 *
 * #target_url and target can support div tags through document.getElementById
 */

core.ns('viewer.frmwk');

viewer.frmwk.Broadcast = ( function(){
    var log = viewer.frmwk.Logger.set('Broadcast');
    var _POST_STR = 'postMessage',
        _ADD_EVT_LISTENER_STR = 'addEventListener',
        _REM_EVT_LISTENER_STR = 'removeEventListener',
        _HTML5_UNSUPPORTED_STR = 'HTML5 is not supported',
        _ATTACH_EVT_STR = 'attachEvent',
        _DETACH_EVT_STR = 'detachEvent';

    var Broadcast = core.createClass({
        msg_callback: undefined,
        targetElObj: '',
        sourceElObj: '',

        _message: undefined,
        _target: undefined,
        _source: undefined,
        _callback: undefined,
        _origin: undefined,

        _isDivTagType: undefined,

        constructor: function() {},
        postMessage: function(message, target, source) {
            if(undefined==target || !target)    return;     //user forgot to include param?
            source = source || parent;                              //if param empty, default to window.parent(self)

            this._message = message;
            this._target = target;
            this._source = source;

            this._isDivTagType = this._isParamTypeDiv(target) || this._isParamTypeDiv(source);  //set separately

            log('target is type of ' + typeof target + " " + target.constructor.toString());
            log('source is type of ' + typeof source + " " + source.constructor.toString());

            this.targetElObj = this._isParamTypeDiv(target) ? document.getElementById(target) : target ;
            this.sourceElObj = this._isParamTypeDiv(source) ? document.getElementById(source) : source;

            if(!this._isDivTagType) this._postWindowMessage();
            else                    this._firePostMessageEvent();

            log('postMessage {' + message + ',' + target + ',' + source + '}');
        },
        getMessage: function(callback, origin) {
            if(window[_POST_STR]) {
                if(callback) {                                      //process callback if available
                    this.msg_callback = function(e) {
                        if( (typeof origin==='string' && e.origin!==origin)
                            || (Object.prototype.toString.call(origin)==='[object Function]' && origin(e.origin)===!1) )
                            return !1;
                        callback(e);
                    }
                } else {
                    //TODO - process callback in another way... it is necessary to process 'message' event!
                    this.msg_callback = function(e) {}
                }

                if(window[_ADD_EVT_LISTENER_STR])
                    window[callback ? _ADD_EVT_LISTENER_STR : _REM_EVT_LISTENER_STR]('message', this.msg_callback, !1);
                else
                    window[callback ? _ATTACH_EVT_STR : _DETACH_EVT_STR]('onmessage', this.msg_callback);
            } else {
                this._html5NotSupported();
            }
        },
        _html5NotSupported: function() {
            log(_HTML5_UNSUPPORTED_STR);
            alert(_HTML5_UNSUPPORTED_STR + ' by your browser.  Please switch to a browser with HTML5 support.');
        },
        _isParamTypeDiv: function(el) {
            var elType = el.constructor.toString();

            if(elType.match('Window'))                 return false;       //exit out!
            else if(elType.match('String'))            return true;        //we'll presume they passed in div id
            else if(elType.match('HTMLDivElement'))    return true;
            else                                       return false;
        },
        _postWindowMessage: function() {
            if(window[_POST_STR])
                this.sourceElObj[_POST_STR](this._message, this._target.replace( /([^:]+:\/\/[^\/]+).*/, '$1'));
            else if(this._target && (this._isParamTypeDiv(this._source)) )
                this._source.location = this._target.replace(/#.*$/, '') + '#' + (+new Date) + '&' + this._message;
            else
                this._html5NotSupported();
            log('_postWindowMessage');
        },
        _firePostMessageEvent: function() {
            /**
             * if we fire events, shouldn't it be better to just catch the OL events?  No need to proxy
             * because the events will bubble up from OL anyway up to the root DOM.
             */
            log('_firePostMessageEvent');
        }
    });

    var BroadcastInstance = new Broadcast();
    return BroadcastInstance;
} )();