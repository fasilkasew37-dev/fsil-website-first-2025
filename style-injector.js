var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'app-design.css';
document.getElementsByTagName('HEAD')[0].appendChild(link);

window.onload = function() {
    var container = document.createElement('div');
    container.className = 'fwa-container';
    container.innerHTML = `
        <img src="eagle_image.jpg" class="eagle-left">
        <img src="lion_image.jpg" class="lion-center">
        <img src="dove_image.jpg" class="dove-right">
        <div class="fwa-logo-text">
            <span>F</span><span>W</span><span>A</span>
        </div>
    `;
    document.body.prepend(container);
};
