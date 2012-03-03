var cometClient;
var channel;
var chatBox;
var messageDiv;

function sendMessage(msg) {
	if (cometClient && channel) {
		cometClient.publish(channel, msg);
	}
}

function showChatMessage(msg) {
	showMessage(msg, 'chatMsg');
}

function showMessage(msg, cssStyle) {
	// var messageDiv = document.getElementById('messages');
	var span = document.createElement('span');
	span.setAttribute('class', cssStyle); 
	span.setAttribute('className', cssStyle);
	span.appendChild(document.createTextNode(msg))
	messageDiv.appendChild(span); 
	messageDiv.appendChild(document.createElement('br'));
	messageDiv.scrollTop = messageDiv.scrollHeight;
}

function handleChatMessageReceived(msg) {
	showChatMessage(msg);
}

/**
 * Send a chat message to the server
 */
function handleSendChat(e) {
//	showChatMessage(e.type + ', ' + e.target + ', ' + e.which + ', ' + e.keyCode + ', ' + e.srcElement);
	var charCode;
	var target;
	if (e.which) {
		charCode = e.which;
	}
	else if (e.keyCode) {
		charCode = e.keyCode;
	}
	if (e.target) { 
		target = e.target.id;
	}
	else if (e.srcElement) {
		target = e.srcElement.id;
	}
	if (target != 'chatBox'|| charCode != 13) {
		return false;
	}
	else {
	  var msg = chatBox.value;
      if ( (msg != null) && (msg != '')) {
          sendMessage(msg);
          chatBox.value = '';
      }
      chatBox.focus();
	}
	return false;
}

function createChatWidgetsInContainer(chatDiv) {
	/*
	messageDiv = document.createElement('div');
	messageDiv.setAttribute('id', 'messages');
	messageDiv.setAttribute('class', 'scroll');
	chatDiv.append(messageDiv);
	*/
	chatDiv.append('<div id="messages" class="scroll"></div>');
	chatDiv.append('<span>Chat: </span>');
	chatDiv.append('<input type="text" id="chatBox" class="chatBox"/>');
	messageDiv = document.getElementById('messages');
	chatBox = document.getElementById('chatBox');
}


function initChat(chatDivId, gameId, gameSessionId) {
	var chatDiv = $('#' + chatDivId);// document.getElementById(chatDivId);
	createChatWidgetsInContainer(chatDiv);

	var url = 'http://' + window.location.host + '/comet';
	showChatMessage('connecting to: ' + url);
 	cometClient = new Faye.Client(url);
 	var clientAuth = {
 		  // attach an auth token to subscription messages
 		  outgoing: function(message, callback) {
 		    // Again, leave non-subscribe messages alone
 		    if (message.channel !== '/meta/subscribe') {
 		      return callback(message);
 		    }
 		    showChatMessage('subscribing...');
		    // Add ext field if it's not present
		    if (!message.ext) message.ext = {};
		    // Set the auth token
		    message.ext.authToken = authToken;
		    // Carry on and send the message to the server
		    callback(message);
		  }
 	};

 	cometClient.addExtension(clientAuth);
 	parseCookie();
	
	channel = '/' + gameId + (gameSessionId ? ('/' + gameSessionId) : '');
	projectSub = cometClient.subscribe(channel, handleChatMessageReceived);
	projectSub.callback(function() {
		showChatMessage('Subscribed to channel ' + channel);
		// bind the chat function to the prompt		
		$('#chatBox').bind('keyup', handleSendChat);
	});
	projectSub.errback(function(error) {
		  showChatMessage('Subscription failed: ' + error.message);
		});
}

function getCookieValue(c_name) {
	var i,x,y,ARRcookies=document.cookie.split(";");
	for (i=0;i<ARRcookies.length;i++) {
  		x=ARRcookies[i].substr(0,ARRcookies[i].indexOf("="));
  		y=ARRcookies[i].substr(ARRcookies[i].indexOf("=")+1);
  		x=x.replace(/^\s+|\s+$/g,"");
  		if (x==c_name) {
    		return unescape(y);
    	}
  	}
}

function parseCookie() {
	if (document.cookie) {
		authToken = getCookieValue('authToken');
	}
}

