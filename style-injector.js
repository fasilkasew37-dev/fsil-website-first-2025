window.onload = function() {
    var container = document.createElement('div');
    container.style.cssText = "display:flex; justify-content:center; align-items:center; position:relative; height:350px; background-color:#0080ff; width:100%;";
    container.innerHTML = `
        <img src="eagle_image.jpg" style="width:100px; height:100px; border-radius:50%; position:absolute; left:10%; z-index:1; object-fit:cover;">
        <div style="position:relative; z-index:3;">
            <img src="lion_image.jpg" style="width:160px; height:160px; border-radius:50%; border:5px solid white; outline:8px solid yellow; box-shadow:0 0 0 15px red, 0 0 0 25px darkblue; object-fit:cover;">
        </div>
        <img src="dove_image.jpg" style="width:100px; height:100px; border-radius:50%; position:absolute; right:10%; z-index:1; object-fit:cover;">
    `;
    document.body.prepend(container);
};
