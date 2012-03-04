// init() once the page has finished loading.
//window.onload = init;

// globals
var context = 0;
var bufferLoader = 0;
var source1;
var source2;
var source3;
var source4;
var filter1;
var filter2;
var filter3;
var filter4;
var freq1;
var freq2;
var freq3;
var freq4;
var qvalue1 = 0.1;
var qvalue2 = 0.1;
var qvalue3 = 0.1;
var qvalue4 = 0.1;
// var convolver;
var buffer;
var convolver1;
var convolver2;
var convolver3;
var convolver4;
var reverbwet1;
var reverbwet2;
var reverbwet3;
var reverbwet4;
var reverbdry1;
var reverbdry2;
var reverbdry3;
var reverbdry4;

function BufferLoader(url1, url2, url3, url4) {
    this.urlList = new Array();
    this.urlList[0] = url1;
    this.urlList[1] = url2;
    this.urlList[2] = url3;
    this.urlList[3] = url4;

    this.bufferList = new Array();
    this.bufferList[0] = 0;
    this.bufferList[1] = 0;
    this.bufferList[2] = 0;
    this.bufferList[3] = 0;

    this.bufferCount = 4;
    this.loadCount = 0;
}

BufferLoader.prototype.loadAllBuffers = function() {
    this.loadBuffer(0);
    this.loadBuffer(1);
    this.loadBuffer(2);    
    this.loadBuffer(3);    

}

BufferLoader.prototype.loadBuffer = function(i) {
    // Load asynchronously

    var request = new XMLHttpRequest();
    request.open("GET", this.urlList[i], true);
    request.responseType = "arraybuffer";

    var bufferLoader = this;
    request.onload = function() {
        bufferLoader.bufferList[i] = context.createBuffer(request.response, false);
        bufferLoader.loadCount++;
        if (bufferLoader.loadCount == bufferLoader.bufferCount)
            finishedLoading();
    };

    request.onerror = function() {
        alert("error loading");
    };

    request.send();
}

function finishedLoading() {
    // Set buffers on sources
    source1.buffer = bufferLoader.bufferList[0];
    source2.buffer = bufferLoader.bufferList[1];
    source3.buffer = bufferLoader.bufferList[2];
    source4.buffer = bufferLoader.bufferList[3];

    // Try to start sources at the same time
    var time = context.currentTime + 0.020;
    source1.noteOn(time);
    source2.noteOn(time);
    source3.noteOn(time);
    source4.noteOn(time);

}

function gainHandler1(event, ui) {
    var value = ui.value;
    var info = document.getElementById("gain1-value");
    info.innerHTML = "gain1 = " + value;
    gain1.gain.value = value;
}

function gainHandler2(event, ui) {
    var value = ui.value;
    var info = document.getElementById("gain2-value");
    info.innerHTML = "gain2 = " + value;
    gain2.gain.value = value;
}

function gainHandler3(event, ui) {
    var value = ui.value;
    var info = document.getElementById("gain3-value");
    info.innerHTML = "gain3 = " + value;
    gain3.gain.value = value;
}

function gainHandler4(event, ui) {
    var value = ui.value;
    var info = document.getElementById("gain4-value");
    info.innerHTML = "gain4 = " + value;
    gain4.gain.value = value;
}

function filterHandlerQ1(event, ui) {
    var value = ui.value;
    var info = document.getElementById("qvalue1-value");
    info.innerHTML = "qvalue1 = " + value;
    console.log(value);
    filter1.Q.value = value;
}

function filterHandlerQ2(event, ui) {
    var value = ui.value;
    var info = document.getElementById("qvalue2-value");
    info.innerHTML = "qvalue2 = " + value;
    // console.log(value);
    filter2.Q.value = value;
}

function filterHandlerFreq1(event, ui) {
    var value = ui.value;
    var info = document.getElementById("frequency1-value");
    info.innerHTML = "frequency1 = " + value;
    // console.log(value);
    filter1.frequency.value = value;
}

function filterHandlerFreq2(event, ui) {
    var value = ui.value;
    var info = document.getElementById("frequency2-value");
    info.innerHTML = "frequency2 = " + value;
    // console.log(value);
    filter2.frequency.value = value;
}

function pannerHandler1(event, ui) {
    var value = ui.value;
    var info = document.getElementById("panner1-value");
    info.innerHTML = "panner1 = " + value;
    // console.log(value);
    panner1.setPosition(value, 0.5, 0.5);
}

function reverbHandler1(event, ui) {
    var value = ui.value;
    var info = document.getElementById("reverb1-value");
    info.innerHTML = "reverb1 = " + value;
    // console.log(value);
    reverbdry1.gain.value = value;
    reverbwet1.gain.value = 1.0 - value;
}

function randmus() {
	
	var freq = Math.random()*400;
	var t=setTimeout("randmus()",50);
	filter1.frequency.value = freq;
    // console.log(freq);
}

var kInitialReverbLevel = 0.6;


function setReverbImpulseResponse(url) {
    // Load impulse response asynchronously
//    var buffer;
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = function() { 
        convolver1.buffer = context.createBuffer(request.response, false);
    }

    request.send();
}


function sound_init() {
    context = new webkitAudioContext();
	
	// create input instances
    source1 = context.createBufferSource();
    source2 = context.createBufferSource();
    source3 = context.createBufferSource();
    source4 = context.createBufferSource();


	// comment this out for one shot events
    source1.loop = true;
    source2.loop = true;
    source3.loop = false;
    source4.loop = true;

    // audio stages begin here
    gain1 = context.createGainNode();
    gain2 = context.createGainNode();
    gain3 = context.createGainNode();
    gain4 = context.createGainNode();
    
    gain1.gain.value  = 1.5;
    gain2.gain.value  = 0;

    source1.connect(gain1);
    source2.connect(gain2);
    source3.connect(gain3);
    source4.connect(gain4);
    
    // bandpass filter
    filter1 = context.createBiquadFilter();
    filter2 = context.createBiquadFilter();
    filter3 = context.createBiquadFilter();
	filter4 = context.createBiquadFilter();

    filter1.type = 2;
    filter2.type = 2;
    filter3.type = 2;
    filter4.type = 2;

    filter1.freq = 400;
    filter2.freq = 400;
    filter3.freq = 400;
    filter4.freq = 400;

	filter1.Q.value = 1.0;
	filter2.Q.value = 1.0;
	filter3.Q.value = 1.0;
	filter4.Q.value = 1.0;

	// parameter 'naturalizer' introduces jitter to params
	randmus();
	
	gain1.connect(filter1);
    gain2.connect(filter2);
    gain3.connect(filter3);
    gain4.connect(filter4);

	// reverb
    reverbdry1 = context.createGainNode();
    reverbdry2 = context.createGainNode();
    reverbdry3 = context.createGainNode();
    reverbdry4 = context.createGainNode();

    reverbwet1 = context.createGainNode();
    reverbwet2 = context.createGainNode();
    reverbwet3 = context.createGainNode();
    reverbwet4 = context.createGainNode();

    //dryGainNode1.gain.value = 1.0;
    //wetGainNode1.gain.value = 2.0;
    convolver1 = context.createConvolver();
    convolver2 = context.createConvolver();
    convolver3 = context.createConvolver();
    convolver4 = context.createConvolver();

    setReverbImpulseResponse('sounds/mysounds/diffusor2.wav');
    
    // panning
    panner1 = context.createPanner();
    panner2 = context.createPanner();
    panner3 = context.createPanner();
    panner4 = context.createPanner();

    panner1.setPosition(0.5, 0.5, 0.5);
    panner2.setPosition(0.5, 0.5, 0.5);
    panner3.setPosition(0.5, 0.5, 0.5);
    panner4.setPosition(0.5, 0.5, 0.5);

    panner1.distanceModel = 2;
    panner2.distanceModel = 2;
    panner3.distanceModel = 2;
    panner4.distanceModel = 2;

	filter1.connect(panner1);
	filter2.connect(panner2);
	filter3.connect(panner3);
	filter4.connect(panner4);

	// panner2 = context.createPanner();
	// panner2.setPosition(0.5, 0.5, 0.5);
	// panner2.connect(panner1);
	// panner2.distanceModel = 2;
	panner1.connect(convolver1);
	panner2.connect(convolver2);
	panner3.connect(convolver3);
	panner4.connect(convolver4);
	
	// panner2.connect(convolver1);
    
	// output
	convolver1.connect(reverbwet1);
	convolver2.connect(reverbwet2);
	convolver3.connect(reverbwet3);
	convolver4.connect(reverbwet4);

	//filter1.connect(context.destination);

	// panner2.connect(context.destination);
    reverbwet1.gain.value = kInitialReverbLevel;
	reverbwet2.gain.value = kInitialReverbLevel;
    reverbwet3.gain.value = kInitialReverbLevel;
    reverbwet4.gain.value = kInitialReverbLevel;

	reverbwet1.connect(context.destination);
	reverbwet2.connect(context.destination);
	reverbwet3.connect(context.destination);
	reverbwet4.connect(context.destination);

	panner1.connect(reverbdry1);
	panner2.connect(reverbdry2);
	panner3.connect(reverbdry3);
	panner4.connect(reverbdry4);
	
	reverbdry1.connect(context.destination);
	reverbdry2.connect(context.destination);
	reverbdry3.connect(context.destination);
	reverbdry4.connect(context.destination);
	
    bufferLoader = new BufferLoader(
    	"audio/ambient/ambient-uboat.wav",
        "audio/avatar/cauldron.wav",
        "audio/twevent/residue-signal.wav",
        "audio/birds/nightingale-song.wav");

    // finishedLoading() will be called when we're done
    bufferLoader.loadAllBuffers();
}
