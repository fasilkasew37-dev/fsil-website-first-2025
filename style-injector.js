window.onload = function() {
    var container = document.createElement('div');
    container.className = 'fwa-container';
    container.innerHTML = `
        <img src="eagle_image.jpg" class="eagle-left">
        <div class="lion-wrapper">
            <img src="lion_image.jpg" class="lion-center">
        </div>
        <img src="dove_image.jpg" class="dove-right">
        <div class="fwa-logo-text">
            <span>F</span><span>W</span><span>A</span>
        </div>
    `;
    document.body.prepend(container);
};

var link = document.createElement('link');
link.rel = 'stylesheet';
link.href = 'app-design.css';
document.head.appendChild(link);
