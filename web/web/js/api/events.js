/**
 * @author chris a <cobie8a@yahoo.com>
 * original code date - February 2013
 *
 * events.js contains all events
 */

core.namespace('viewer.api.evt');

viewer.api.evt.Map = ( function() {
    var log = viewer.frmwk.Logger.set('evt.Zoom');

    function ApiEvents() {
        this.listeners = {};        //empty for now
    }

    ApiEvents.prototype = {
        constructor: ApiEvents,
        addListener: function(evtType, listener) {
            if(typeof this.listeners[evtType]=='undefined')
                this.listeners[evtType] = [];
            this.listeners[evtType].push(listener);
        },
        fire: function(event, eventSource) {
            if(typeof event=='string')      event = {type:event, source:eventSource};   //create new evt obj
            if(!event.target)               event.target = this;

            if(undefined==event.type || !event.type)
                throw new Error('event missing \'type\' property');

            if(this.listeners[event.type] instanceof Array) {
                var listeners = this.listeners[event.type];
                for(var i=0; i<listeners.length; i++)
                    listeners[i].call(this, event);
            }
        },
        removeListener: function(evtType, listener) {
            if(this.listeners[evtType] instanceof Array) {
                var listeners = this.listeners[evtType];
                for(var i=0; i<listeners.length; i++) {
                    if(listeners[i]==listener) {
                        listeners.splice(i, 1);
                        break;
                    }
                }
            }
        }
    };

    var MapEvents = core.createClass({
        _eventObj: undefined,
        _eventType: undefined,
        _eventDispatch: undefined,

        constructor: function() {
            this._eventDispatch = new ApiEvents();
            this._eventDispatch.addListener('viewerEvent', this._handleViewerEvent);
        },
        notifyListeners: function(eventObj, eventType) {
            this._eventObj = eventObj;
            this._eventType = eventType;

            this._eventDispatch.fire('viewerEvent', eventType);

            log('event of type ' + this._eventType + ' occurred');
        },
        getEventObject: function()  {   return this._eventObj;  },
        getEventType: function()    {   return this._eventType; },
        _handleViewerEvent: function(e) {
            alert('viewer event occurred - ' + e.source);
        }
    });
    return new MapEvents();
} )();