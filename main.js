// Defines the default character
var defaultCharacter = "c511_01";
// Defines the animations when interacting
var defaultAnimation = "idle";
var onClickAnimation = "action";
var onNextAnimation = "smile";
var overwhelmedAnimation = "rage";
// Checks if the interaction animation is playing
var isClickAnimationPlaying = false;
// Counts the number of clicks and controls the timer for the animation
var clickCount = 0;
var clickTimeout;
// Select the canvas of the Spine player
var canvas = document.querySelector("#player-container");

// Creates the player
var reproductor = new spine41.SpinePlayer("player-container", {
    skelUrl: "image/" + defaultCharacter + "_00.skel",
    atlasUrl: "image/" + defaultCharacter + "_00.atlas",
    animation: defaultAnimation, // Initializes with the default animation
    showControls: false, // Hides the Spine player controls
    alpha: true, // Does not make the background transparent
});

// Initializes the background image
function addImage() {
    document.body.style.backgroundImage = "url('image/logo_nikke.png')";
    document.body.style.backgroundSize = "auto";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center center";
}

// Adds the click event to change the animation
canvas.addEventListener('click', function () {
    if (!isClickAnimationPlaying) {
        clickCount++;
        isClickAnimationPlaying = true;

        reproductor.setAnimation(onClickAnimation, false); // Plays the onClick animation
        reproductor.addAnimation(onNextAnimation, false); // Plays the onNext animation after onClick ends
        reproductor.addAnimation(defaultAnimation, true); // Returns to the animation after onNext ends

        // Sets a 3-second timer to be able to repeat the animation
        setTimeout(function () {
            isClickAnimationPlaying = false;
        }, 3000);

        // Checks if three clicks have been made within 10 seconds
        if (clickCount > 3) {
            reproductor.setAnimation(overwhelmedAnimation, false); // Plays the overwhelmed animation
            reproductor.addAnimation(defaultAnimation, true); // Returns to the default animation
            clickCount = 0; // Resets the counter
        }

        // Resets the counter after 12 seconds from the last click
        clearTimeout(clickTimeout);
        clickTimeout = setTimeout(function () {
            clickCount = 0;
        }, 12000);
    }
});

window.wallpaperPropertyListener = {
    applyUserProperties: function (properties) {
        setTimeout(() => { // After 0.1 seconds reads the properties and applies them
            addImage();

            // Applies the color
            if (properties.schemecolor) {
                var schemeColor = properties.schemecolor.value.split(' ');
                schemeColor = schemeColor.map(function (c) {
                    return Math.ceil(c * 255);
                });
                document.body.style.backgroundColor = 'rgb(' + schemeColor + ')';
            }

            // Applies the movement in X
            if (properties.posX) {
                posX = properties.posX.value;
                canvas.style.left = `${posX}vh`;
            }

            // Applies the size
            if (properties.size) {
                size = properties.size.value;
                canvas.style.height = `${size * 20}vh`;
            }

            // Applies the movement in Y
            if (properties.posY) {
                posY = properties.posY.value;
                canvas.style.top = `${-posY}vh`;
            }
        }, 100);
    }
};
