/**
 * @fileoverview PubSub is the base class for any object that sends/receives messages
 * 
 * @author Tony Parisi
 */
goog.provide('SB.PubSub');

/**
 * @constructor
 */
SB.PubSub = function() {
    this.messageTypes = {};
    this.messageQueue = [];
    this.post = SB.PubSub.postMessages;
}

SB.PubSub.prototype.subscribe = function(message, subscriber, callback) {
    var subscribers = this.messageTypes[message];
    if (subscribers)
    {
        if (this.findSubscriber(subscribers, subscriber) != -1)
        {
            return;
        }
    }
    else
    {
        subscribers = [];
        this.messageTypes[message] = subscribers;
    }

    subscribers.push({ subscriber : subscriber, callback : callback });
}

SB.PubSub.prototype.unsubscribe =  function(message, subscriber, callback) {
    if (subscriber)
    {
        var subscribers = this.messageTypes[message];

        if (subscribers)
        {
            var i = this.findSubscriber(subscribers, subscriber, callback);
            if (i != -1)
            {
                this.messageTypes[message].splice(i, 1);
            }
        }
    }
    else
    {
        delete this.messageTypes[message];
    }
}

SB.PubSub.prototype.publish = function(message) {
    var subscribers = this.messageTypes[message];

    if (subscribers)
    {
        for (var i = 0; i < subscribers.length; i++)
        {
            if (this.post)
            {
                var args = [subscribers[i].callback];
                for (var j = 0; j < arguments.length - 1; j++)
                {
                    args.push(arguments[j + 1]);
                }
                subscribers[i].subscriber.postMessage.apply(subscribers[i].subscriber, args);
            }
            else
            {
                var args = [];
                for (var j = 0; j < arguments.length - 1; j++)
                {
                    args.push(arguments[j + 1]);
                }
                subscribers[i].callback.apply(subscribers[i].subscriber, args);
            }
        }
    }
}

SB.PubSub.prototype.findSubscriber = function (subscribers, subscriber) {
    for (var i = 0; i < subscribers.length; i++)
    {
        if (subscribers[i] == subscriber)
        {
            return i;
        }
    }
    
    return -1;
}

SB.PubSub.prototype.handleMessages = function() {
    var message;
    while (message = this.getMessage())
    {
        if (message.callback)
        {
            message.callback.apply(this, message.args);
        }
    }
}

SB.PubSub.prototype.postMessage = function (callback) {
    var args = [];
    var len = arguments.length - 1;
    var i;
    for (i = 0; i < len; i++)
    {
        args[i] = arguments[i+1];
    }

    this.messageQueue.push({callback : callback, args : args});
}

SB.PubSub.prototype.getMessage = function() {
    if (this.messageQueue.length)
    {
        return this.messageQueue.shift();
    }
    else
    {
        return null;
    }
}

SB.PubSub.prototype.peekMessage = function() {
    return (this.messageQueue.length > 0) ? this.messageQueue[0] : null;
}

SB.PubSub.postMessages = false;
