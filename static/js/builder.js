
$(document).ready(function() {
    $(".setting").click(function() {
        $(this).toggleClass("expanded")
    })

    var viewer = $(".viewer")

    var renderer = new PIXI.autoDetectRenderer(1000, 500, {antialias: true});
    renderer.view.style.position;
    renderer.view.style.display = "block";
    renderer.autoResize = true;
    console.log(viewer.height())
    renderer.resize(viewer.width(), viewer.height());
    viewer[0].appendChild(renderer.view);

    window.onresize = function () {
        var w = viewer.width();
        var h = viewer.height();
        renderer.resize(w, h);
        stage.pivot.x = -w / 2;
        stage.pivot.y = -h / 2;
        renderer.view.style.width = "100%";
        renderer.view.style.height = "100%";
        renderer.render(stage);
    };

    stage = new PIXI.Container();
    stage.pivot.x = -viewer.width() / 2;
    stage.pivot.y = -viewer.height() / 2;

    satellite = new PIXI.Graphics();
    satellite.beginFill(0x99ff99);
    satellite.drawRect(-50, -25, 100, 50);
    satellite.endFill();
    stage.addChild(satellite)

    setInterval(function() {
        renderer.render(stage);
    }, 2000)
    
    window.renderer = renderer;
})