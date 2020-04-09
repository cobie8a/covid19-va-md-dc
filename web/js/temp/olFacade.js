/**
 * @author chris a <cobie8a@yahoo.com>
 * original code date - February 2013
 *
 * openlayersImpl is the openlayers event register for all events we are
 * listening to
 *
 * this will primarily reside on the viewer since it requires access to the
 * openlayers libraries.  all of the objects here simply 'notify' events.js
 *
 * note: are interfaces for this facade really necessary?  I would like to have all subclasses call
 * OLFacade on each event trigger as a singular point to call, by which it acts like a dispatcher...
 *
 * note:  this is a mixin...
 */

core.ns('viewer.impl');

viewer.impl.OLFacade = ( function(){
    var log = viewer.frmwk.Logger.set('OLFacade');
    var OLEvents = core.createClass({
        constructor: function() {}
    });
    return new OLEvents();
} )();



//TODO - this needs to be a singleton
viewer.impl.OLFacadeDispatcher = ( function(){
    var log = viewer.frmwk.Logger.set('OLFacadeDispatcher');
    var Dispatcher = core.createClass({
        dispatchControl: viewer.frmwk.Controller,    //pass in a new controller obj
        evtObj: viewer.api.evt.Zoom,

        constructor: function() {
            viewer.impl.OLFacade.registerEvents();
            log('constructor');
        },
        notify: function(evtStr) {
            this.evtObj.fireEvt(evtStr);
            log('notify');
        }
    });
    return new Dispatcher();
} )();



viewer.impl.MapEvents = ( function(){
    var MapEvent = core.createClass({
        mapEvtObj: map.events,
        dispatcher: viewer.impl.OLFacadeDispatcher,

        constructor: function() {
            this.mapEvtObj.on({
                'zoomend': function(e)      {    this.dispatcher.notify('zoomend');  },
                'moveend': function(e)      {    this.dispatcher.notify('moveend');  }
            });
        }
    });
    return new MapEvent();
} )();


/* TODO - enable when ready!
viewer.impl.LayerEvents = ( function(){
    var LayerEvent = core.createClass({
        layerEvtObj: map.events,        //technically a part of map.events object?  support of layers is there
        dispatcher: viewer.impl.OLFacadeDispatcher,

        constructor: function() {
            this.layerEvtObj.on({
                'addlayer': function(e)     {   this.dispatcher.notify('addlayer');     },
                'removelayer': function(e)  {   this.dispatcher.notify('removelayer');  },
                'changelayer': function(e)  {   this.dispatcher.notify('changelayer');  }
            });
        }
    });
    return new LayerEvent();
} )();


viewer.impl.DrawEvents = ( function(){
    var DrawEvent = core.createClass({
        vectorEvtObj: {},       //TODO - set vector layer
        constructor: function() {}
    });
    return new DrawEvent();
} )();
*/