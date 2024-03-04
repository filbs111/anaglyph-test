var redSlider = document.getElementById("red");
var greenSlider = document.getElementById("green");
var blueSlider = document.getElementById("blue");

var redSlider2 = document.getElementById("red2");
var greenSlider2 = document.getElementById("green2");
var blueSlider2 = document.getElementById("blue2");


var colorSliders = [redSlider,greenSlider,blueSlider];
var colorSliders2 = [redSlider2,greenSlider2,blueSlider2];

var thecanvas = document.getElementById("thecanvas");
var ctx = thecanvas.getContext("2d");
var borderSize = 20;

ctx.fillStyle = "#000";
ctx.fillRect(0,0,thecanvas.width, thecanvas.height);


function updateColour(evt){
    var rgbString = colorSliders.map(e=>e.value).join(",");

    console.log("rgb vals: " + rgbString);

    ctx.fillStyle = "rgb(" + rgbString + ")";
    ctx.fillRect(borderSize,borderSize,thecanvas.clientWidth/2-2*borderSize, thecanvas.height-2*borderSize);
}

function updateColour2(evt){
    var rgbString = colorSliders2.map(e=>e.value).join(",");

    console.log("rgb vals 2: " + rgbString);

    ctx.fillStyle = "rgb(" + rgbString + ")";
    ctx.fillRect(thecanvas.clientWidth/2+borderSize,borderSize,thecanvas.clientWidth/2-2*borderSize, thecanvas.height-2*borderSize);
}


colorSliders.forEach(elem=>elem.addEventListener("change", updateColour));
colorSliders2.forEach(elem=>elem.addEventListener("change", updateColour2));




//second canvas. draw squares of "balanced brightness" colours
var thecanvas2 = document.getElementById("thecanvas2");

thecanvas2.width = 300;
thecanvas2.height = 300;
//draw different colour schemes
var ctx2 = thecanvas2.getContext("2d");
ctx2.fillStyle = "#000";
ctx2.fillRect(0,0,thecanvas2.width, thecanvas2.height);

var boxSize = 20;

//"balanced"
ctx2.fillStyle="rgb(255,173,173)";
ctx2.fillRect(50-boxSize/2,50-boxSize/2,boxSize,boxSize);
ctx2.fillStyle="rgb(155,0,255)";
ctx2.fillRect(150-boxSize/2,50-boxSize/2,boxSize,boxSize);
ctx2.fillStyle="rgb(255,186,0)";
ctx2.fillRect(250-boxSize/2,50-boxSize/2,boxSize,boxSize);

// full white
ctx2.fillStyle="rgb(255,255,255)";
ctx2.fillRect(50-boxSize/2,150-boxSize/2,boxSize,boxSize);
ctx2.fillStyle="rgb(105,0,255)";
ctx2.fillRect(150-boxSize/2,150-boxSize/2,boxSize,boxSize);
ctx2.fillStyle="rgb(238,255,0)";
ctx2.fillRect(250-boxSize/2,150-boxSize/2,boxSize,boxSize); //this yellow actually looks brightest. wtf!

// full yellow
ctx2.fillStyle="rgb(255,238,238)";
ctx2.fillRect(50-boxSize/2,250-boxSize/2,boxSize,boxSize);
ctx2.fillStyle="rgb(113,0,255)";
ctx2.fillRect(150-boxSize/2,250-boxSize/2,boxSize,boxSize);
ctx2.fillStyle="rgb(255,255,0)";
ctx2.fillRect(250-boxSize/2,250-boxSize/2,boxSize,boxSize);


var carcanvas = document.getElementById("carcanvas");
var carctx = carcanvas.getContext("2d");
var carcanvas2 = document.getElementById("carcanvas2");
var carctx2 = carcanvas2.getContext("2d");
var carcanvas3 = document.getElementById("carcanvas3");
var carcanvasstereo = document.getElementById("carcanvasstereo");


//load car image
var carImage = new Image();
carImage.onload = function(){
    carcanvas.width=carImage.width;
    carcanvas.height=carImage.height;
    carcanvas2.width=carImage.width;
    carcanvas2.height=carImage.height;
    carctx.drawImage(carImage,0,0);

    //read the imagedata, then draw it into the next canvas with colour mapping
    const imgData = carctx.getImageData(0,0,carImage.width, carImage.height);
    //transform this imagedata.
    let pixels = imgData.data;
    var dataCopy = new Uint8ClampedArray(pixels);
    //simple grayscale.
    // for (var ii = 0; ii < pixels.length; ii += 4) {
    //     let lightness = parseInt((pixels[ii] + pixels[ii + 1] + pixels[ii + 2]) / 3);
    //     pixels[ii] = lightness;
    //     pixels[ii + 1] = lightness;
    //     pixels[ii + 2] = lightness;
    // }
    //grayscale 2
    // for (var ii = 0; ii < pixels.length; ii += 4) {
    //     let lightness = (Math.pow(pixels[ii],2.2) + Math.pow(pixels[ii+1],2.2) + 0.1666*Math.pow(pixels[ii+2],2.2))/2.16666;
    //     lightness = Math.floor(Math.pow(lightness, 0.455));
    //     pixels[ii] = lightness;
    //     pixels[ii + 1] = lightness;
    //     pixels[ii + 2] = lightness;
    // }
    //now try retaining colour info - from yellow through to purple.
    //initially just try with same scaling factors for each colour channel for simplicity.
    //bit of a guess, but works ok.
    // for (var ii = 0; ii < pixels.length; ii += 4) {
    //     let strengths = [Math.pow(pixels[ii],2.2), Math.pow(pixels[ii+1],2.2), Math.pow(pixels[ii+2],2.2)];
    //     var totalStrength = strengths[0]+strengths[1]+strengths[2];
    //     var cyanAmount = (strengths[1]+strengths[2]) /2;
    //     var averageStrength = (strengths[0] + cyanAmount )/2;
    //     //var blueness = (strengths[2]-strengths[1])/totalStrength;   //???
    //     var blueness = (strengths[2]-strengths[1])/(cyanAmount*2);   //???

    //     pixels[ii] = Math.floor(Math.pow(totalStrength/3 , 0.455));
    //     pixels[ii + 1] = Math.floor(Math.pow((1-blueness)*totalStrength/6 , 0.455));
    //     pixels[ii + 2] = Math.floor(Math.pow((1+blueness)*totalStrength/6 , 0.455));
    // }

    //???
    for (var ii = 0; ii < pixels.length; ii += 4) {
        let strengths = [Math.pow(pixels[ii],2.2), Math.pow(pixels[ii+1],2.2), Math.pow(pixels[ii+2],2.2)];
        var totalStrength = strengths[0]+strengths[1]+0.1666*strengths[2];
        var cyanAmount = (strengths[1]+strengths[2]) /2;
        var averageStrength = (strengths[0] + cyanAmount )/2;
        //var blueness = (strengths[2]-strengths[1])/totalStrength;   //???
        var blueness = (strengths[2]-strengths[1])/(cyanAmount*2);   //???

        pixels[ii] = Math.floor(Math.pow(totalStrength/2.16666 , 0.455));
        pixels[ii + 1] = Math.floor(Math.pow((1-blueness)*totalStrength/4.3333 , 0.455));
        pixels[ii + 2] = Math.floor(Math.pow((1+blueness)*totalStrength/4.3333 , 0.455));
    }

    carctx2.putImageData(imgData,0,0);


    //LR shifted version
    //can see ghosting, especially green image seen through red lens.
    //TODO cancel out ghosting.
    var shiftAmount = 100;
    carcanvas3.width=carImage.width - shiftAmount;
    carcanvas3.height=carImage.height;
    var carctx3 = carcanvas3.getContext("2d");

    var outimagedata = new ImageData(carcanvas3.width, carcanvas3.height);
    //^^ doesn't work right? just grab some image (what it contains currently is unimportant)
    //var outimagedata = carctx.getImageData(0,0,carcanvas3.width, carcanvas3.height);

    var outpixels = outimagedata.data;

    var idx = 0;
    var outidx = 0;
    for (var ii = 0; ii < 4*carcanvas3.height; ii+= 4) {
        for (var jj = 0; jj < 4*carcanvas3.width; jj += 4) {
            var idx2=idx+4*shiftAmount;
            
            //out of screen
            // outpixels[outidx] = pixels[idx];
            // outpixels[outidx + 1] = pixels[idx2+1];
            // outpixels[outidx + 2] = pixels[idx2+2];

            //in screen
            outpixels[outidx] = pixels[idx2];
            outpixels[outidx + 1] = pixels[idx+1];
            outpixels[outidx + 2] = pixels[idx+2];

            //offset some crosstalk - guess that most is green-<red.
            //possibly this should be performed before quantisation!
            //outpixels[outidx]= Math.max(0,Math.floor(
            //    Math.pow(Math.pow(outpixels[outidx],2.2) - 0.03*Math.pow(outpixels[outidx + 1],2.2) , 0.455)));


            var rawval=
                Math.pow(outpixels[outidx],2.2) - 0.03*Math.pow(outpixels[outidx + 1],2.2) ;

            var baselineHack = 3400;
            rawval+=baselineHack;
                //TODO note that this will push high values out of range (though perhaps not by much)

            //var outOfRangeVal = 255;    //see where not enough range
            var outOfRangeVal = 0;  //just put black, accept some ghosting in extreme situations, reduce hack baseline.

            outpixels[outidx]=rawval<0 ? outOfRangeVal : Math.pow(Math.max(0,Math.floor(rawval)), 0.455);
                
            outpixels[outidx + 3] = 255;

            idx+=4;
            outidx+=4;
        }
        idx+=4*shiftAmount;
    }
    carctx3.putImageData(outimagedata,0,0);


    carcanvasstereo.width=carImage.width/2; //assume multiple of 2!
    carcanvasstereo.height=carImage.height;
    var carctxstereo = carcanvasstereo.getContext("2d");

    var outimagedatastereo = new ImageData(carcanvasstereo.width, carcanvasstereo.height);
    var outpixelsstereo = outimagedatastereo.data;

    
    idx = 0;

    var idx2=4*carcanvasstereo.width;

    outidx = 0;

    var reversed;
    //reversed=true;
    if (reversed){
        var tmp = idx2;
        idx2=idx;
        idx=tmp;
    }

    for (var ii = 0; ii < 4*carcanvasstereo.height; ii+= 4) {
        for (var jj = 0; jj < 4*carcanvasstereo.width; jj += 4) {
            

            //in screen
            outpixelsstereo[outidx] = pixels[idx2];
            outpixelsstereo[outidx + 1] = pixels[idx+1];
            outpixelsstereo[outidx + 2] = pixels[idx+2];

            var rawval=
                Math.pow(outpixelsstereo[outidx],2.2) - 0.03*Math.pow(outpixelsstereo[outidx + 1],2.2) ;

            var baselineHack = 3300;
            rawval+=baselineHack;
                //TODO note that this will push high values out of range (though perhaps not by much)

            //var outOfRangeVal = 255;    //see where not enough range
            var outOfRangeVal = 0;  //just put black, accept some ghosting in extreme situations, reduce hack baseline.

            outpixelsstereo[outidx]=rawval<0 ? outOfRangeVal : Math.pow(Math.max(0,Math.floor(rawval)), 0.455);
                
            outpixelsstereo[outidx + 3] = 255;

            idx+=4;
            idx2+=4;
            outidx+=4;
        }
        idx+=4*carcanvasstereo.width;
        idx2+=4*carcanvasstereo.width;
    }
    carctxstereo.putImageData(outimagedatastereo,0,0);


};

carImage.src="./picture-3.jpg";
//carImage.src="./picture-4.jpg";


/*TODO 
* "bloom" style baseline (because beyond max separation between L,R images from a bright feature, the baseline is not needed)
* investigate L/R brightness discrepancy for some images.
*/

