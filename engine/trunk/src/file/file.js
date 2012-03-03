/**
 * @fileoverview File Manager - load game assets using Ajax
 * 
 * @author Tony Parisi
 */

goog.provide('SB.File');
goog.require('SB.PubSub');

/**
 * @constructor
 * @extends {SB.PubSub}
 */
SB.File = function()
{
    SB.PubSub.call(this);	
}

goog.inherits(SB.File, SB.PubSub);
        
SB.File.onReadyStateChange = function(xmlhttp, callback)
{
    if (xmlhttp.readyState == 4)
    {
        if (xmlhttp.status == 200)
        {
    		callback(xmlhttp.responseText);
        }    		
    }
}
    	
SB.File.loadFile = function(url, callback)
{
    xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function () { SB.File.onReadyStateChange(xmlhttp, callback); } ;

    xmlhttp.open('GET', url, true);
    xmlhttp.send(null);
    
}
