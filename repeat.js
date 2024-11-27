var config = {
    text: "automontronic",
    background: "#FFFFFF",
    textColor: "#62c3bd",
    angle: -30,
    verticalSpacing: 20,
    wordSpacing: 10,
    fontSize: 30,
    bleed: 600
};

// Debounce timeout ID
let debounceTimeout;

document.addEventListener("DOMContentLoaded", function () {
    // Add input event listener to all input elements
    document.querySelectorAll("input").forEach(input => {
        input.addEventListener("input", function () {
            getProperties();

            // Clear the previous timeout and set a new one
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
                drawRepeatableText("repeatPreview",.5);
                drawRepeatableText("repeat",1);
            }, 300); // 300 ms debounce delay
        });
    });

    // Select the download link
    const downloadLink = document.getElementById('download');

    // Convert canvas to a data URL and set it as the href of the link
    downloadLink.addEventListener('click', function () {
        const canvas = document.getElementById("repeat");
        const dataURL = canvas.toDataURL('image/png');
        downloadLink.href = dataURL;
    });

    setProperties();
    // Initialize the canvas
    drawRepeatableText("repeatPreview",.5);
    drawRepeatableText("repeat", 1);

    // Update range values on input
    document.querySelectorAll("input[type='range']").forEach(range => {
        range.addEventListener("input", function () {
            range.parentElement.querySelector("span").textContent = range.value;
        });
        range.parentElement.querySelector("span").textContent = range.value;
    });
});

// Draw function
function drawRepeatableText(element, scale) {
    const canvas = document.getElementById(element);
    const ctx = canvas.getContext("2d");

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = config.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set font size and color
    ctx.font = `${Math.ceil(config.fontSize * scale)}px Arial`;
    ctx.fillStyle = config.textColor;

    // Convert angle from degrees to radians
    const angleRad = config.angle * Math.PI / 180;

    // Calculate the height of a single line of text including vertical spacing
    const lineHeight = Math.ceil(config.fontSize * scale) + Math.ceil(config.verticalSpacing * scale);

    // Calculate the width of text drawing area, extending it with bleed
    const bleedWidth = canvas.width + config.bleed * 2;
    const bleedHeight = canvas.height + config.bleed * 2;

    // Get the width of the text
    const textWidth = ctx.measureText(config.text).width;

    // Rotate the canvas to the specified angle
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(angleRad);
    ctx.translate(-canvas.width / 2, -canvas.height / 2);

    // Draw the text in a repeating, staggered pattern covering the bleed area
    for (let y = -config.bleed, row = 0; y < bleedHeight; y += lineHeight, row++) {
        let x = -config.bleed;

        // Offset every other row by half the text width
        if (row % 2 !== 0) {
            x += textWidth / 2;
        }

        // Draw text across the row
        while (x < bleedWidth) {
            ctx.fillText(config.text, x, y);
            x += textWidth + Math.ceil(config.wordSpacing * scale);
        }
    }

    // Restore the canvas rotation
    ctx.restore();
}

// Get updated properties from input fields
function getProperties() {
    config.text = document.getElementById("repeatText").value;
    config.textColor = document.getElementById("repeatColor").value;
    config.background = document.getElementById("repeatBackground").value;
    config.angle = parseFloat(document.getElementById("repeatAngle").value) || 0;
    config.verticalSpacing = parseFloat(document.getElementById("repeatVerticalSpacing").value) || 10;
    config.wordSpacing = parseFloat(document.getElementById("repeatWordSpacing").value) || 5;
    config.fontSize = parseFloat(document.getElementById("repeatWordSize").value) || 5;
}

// Set initial properties in input fields
function setProperties() {
    document.getElementById("repeatText").value = config.text;
    document.getElementById("repeatColor").value = config.textColor;
    document.getElementById("repeatBackground").value = config.background;
    document.getElementById("repeatAngle").value = config.angle;
    document.getElementById("repeatVerticalSpacing").value = config.verticalSpacing;
    document.getElementById("repeatWordSpacing").value = config.wordSpacing;
    document.getElementById("repeatWordSize").value = config.fontSize;
}
