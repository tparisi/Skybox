
/**
 * @fileoverview Service locator for various game services.
 */
goog.provide('SB.Services');
goog.require('SB.Config');
goog.require('SB.Time');
goog.require('SB.Input');
goog.require('SB.EventService');
goog.require('SB.GraphicsThreeJS');

SB.Services = {};

SB.Services._serviceMap = 
{ 
		"time" : { object : SB.Time },
		"input" : { object : SB.Input },
		"events" : { object : SB.EventService },
		"graphics" : { object : SB.Config.USE_THREEJS ? SB.GraphicsThreeJS : null },
};

SB.Services.create = function(serviceName)
{
	var serviceType = SB.Services._serviceMap[serviceName];
	if (serviceType)
	{
		var prop = serviceType.property;
		
		if (SB.Services[serviceName])
		{
	        throw new Error('Cannot create two ' + serviceName + ' service instances');
		}
		else
		{
			if (serviceType.object)
			{
				var service = new serviceType.object;
				SB.Services[serviceName] = service;

				return service;
			}
			else
			{
		        throw new Error('No object type supplied for creating service ' + serviceName + '; cannot create');
			}
		}
	}
	else
	{
        throw new Error('Unknown service: ' + serviceName + '; cannot create');
	}
}

SB.Services.registerService = function(serviceName, object)
{
	if (SB.Services._serviceMap[serviceName])
	{
        throw new Error('Service ' + serviceName + 'already registered; cannot register twice');
	}
	else
	{
		var serviceType = { object: object };
		SB.Services._serviceMap[serviceName] = serviceType;
	}
}