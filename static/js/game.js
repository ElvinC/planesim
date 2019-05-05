import Scene from './scene/Scene.js'
import CustomPlane from './plane/Plane.js';
import {mixColor} from './scene/Color.js';

// global variables
var scene;
var instruments;

// start when loaded
$(document).ready(() => {
    setup()
})

let last_time = 0;

/**
 * Set up game
 */
function setup() {
    scene = new Scene();

    // Flight instruments setup
    var options = {
        width: "18%",
        height: 200,
        size : 200,
        roll : 0,
        pitch : 400,
        heading: 0,
        vario: 0,
        airspeed: 0,
        altitude: 0,
        pressure: 1000,
        showBox : false,
        img_directory : '../static/assets/instruments/'
    }

    // "dict" of instruments
    instruments = {
        attitude: $.flightIndicator('#attitude', 'attitude', options),
        heading: $.flightIndicator('#heading', 'heading', options),
        variometer: $.flightIndicator('#variometer', 'variometer', options),
        airspeed: $.flightIndicator('#airspeed', 'airspeed', options),
        altimeter: $.flightIndicator('#altimeter', 'altimeter', options),
    }

    // create ground sprite
    var floorSprite = new PIXI.extras.TilingSprite(PIXI.Texture.fromImage('../static/assets/sprites/grass.png'), 100000, 100);
    floorSprite.tileScale.x = 0.1;
    floorSprite.tileScale.y = 0.1;
    floorSprite.position.x = -50000
    scene.addChild(floorSprite)

    // Create exhaust particle emitter
    var emitter = new PIXI.particles.Emitter(
        scene.stage,
        [PIXI.Texture.fromImage('../static/assets/sprites/smoke.png')],
        {
            alpha: {
                list: [
                    {
                        value: 0.3,
                        time: 0
                    },
                    {
                        value: 0.1,
                        time: 1
                    }
                ],
                isStepped: false
            },
            scale: {
                list: [
                    {
                        value: 0.03,
                        time: 0
                    },
                    {
                        value: 0.01,
                        time: 1
                    }
                ],
                isStepped: false,
                "minimumScaleMultiplier": 0.0000001,
                "maximumScaleMultiplier": 0.0000003
            },
            color: {
                list: [
                    {
                        value: "ffffff",
                        time: 0,
                    },
                    {
                        value: "ffffff",
                        time: 1
                    }
                ],
                isStepped: false
            },
            speed: {
                list: [
                    {
                        value: 60,
                        time: 0
                    },
                    {
                        value: 20,
                        time: 1
                    }
                ],
                isStepped: false
            },
            startRotation: {
                min: 0,
                max: 360
            },
            rotationSpeed: {
                min: 0,
                max: 0
            },
            lifetime: {
                min: 0.05,
                max: 0.1
            },
            frequency: 0.5,
            spawnChance: 1,
            particlesPerWave: 1,
            emitterLifetime: 0,
            maxParticles: 500,
            pos: {
                x: 0,
                y: 0
            },
            addAtBack: false,
            spawnType: "point",
        }
    );

    window.emitter = emitter;

    
    // draw text and clouds
    for (var i = 0; i < 100; i++) {
        var text = new PIXI.Text(`Distance: ${i * 100}`, {fontFamily : 'Arial', fontSize: 18, fill : 0xffffff, align : 'center'})
        text.position.x = i * 100;
        text.position.y = 5;
        text.scale.x = 0.2
        text.scale.y = 0.2
        scene.addChild(text)

        var cloud = new PIXI.Graphics();
        cloud.beginFill(0xffffff, 0.1)
        cloud.drawEllipse(i*100, - (Math.random() * 400 + 100), 50, 30)
        scene.addChild(cloud)
    }

    // create new plane
    var plane = new CustomPlane(0, 0, scene.keys, instruments = instruments)

    // global plane variable
    window.plane = plane;
    scene.addCustomPhysicalChild(plane);

    // create plane engine sound
    var planesound = new Audio();
    window.planesound = planesound;
    planesound.src = "../static/assets/sound/planesound2.mp3";
    planesound.loop = true;
    var soundStarted = false;

    // start sound after first keypress
    $(window).keydown(function() {
        if (!soundStarted) {
            planesound.play();
            soundStarted = true;
        }
    })

    // settings for sidebar
    var settingFunctions = [
        {
            id: "toggleVector",
            text: "Show vectors",
            element: '<input type="checkbox" id="toggleVector" checked="true" class="tgl tgl-light"><label for="toggleVector" class="tgl-btn"><label>',
            changeFunc: function(e) {
                plane.showVector(this.checked)
            }
        },
        {
            id:"toggleDebug",
            text: "Show debug",
            element: '<input type="checkbox" id="toggleDebug" checked="true" class="tgl tgl-light"><label for="toggleDebug" class="tgl-btn"><label>',
            changeFunc: function(e) {
                $("#HUD").css("display", this.checked ? "block": "none");
                plane.settings.updateHUD = this.checked;
            }
        },
        {
            id:"maxThrust",
            text: "Max thrust",
            element: '<input type="number" id="maxThrust" min="0" value="400000" step="100000">',
            changeFunc: function(e) {
                if (!isNaN(this.value)) {
                    plane.maxThrust = Math.max(parseInt(this.value), 1);
                }
            }
        },
        {
            id:"camZoom",
            text: "Camera zoom",
            element: '<input type="number" id="maxThrust" min="0" max="16" value="8" step="0.5">',
            changeFunc: function(e) {
                const val = parseFloat(this.value);
                if (val > 0.01 && val < 16) {
                    cam.setZoom(val)
                }
            }
        }
    ]

    var options = $("#configOptions")

    for (var set of settingFunctions) {
        var settingsBlock = $('<div class="optionblock"></div>')
        settingsBlock.append('<div class="optionText">'+ set.text +'</div>'  )
        var checkbox = $(set.element)
        checkbox.change(set.changeFunc)
        settingsBlock.append(checkbox)
        options.append(settingsBlock)

    }

    // event listener for options toggle
    $("#toggleOptions").click(function() {
        $(this).toggleClass("is-active")
        if ($(this).hasClass("is-active")) {
            $("#options").addClass("expanded")
        }
        else {
            $("#options").removeClass("expanded")
        }
    })
    // hide options if click away
    /*
    $(scene.renderer.view).click(function(e) {
        $("#options").removeClass("expanded");
        $("#toggleOptions").removeClass("is-active")
    })*/

    // begin render loop
    last_time = performance.now()
    render()
}

let counterthing = 1

/**
 * Render loop
 */
function render() {
    // calculate time difference
    let now = performance.now()
    let dt = Math.min((now - last_time) / 1000, 1/10) // limit min delta t
    last_time = now

    counterthing += 1;
    scene.render()
    // update simulation
    scene.update(dt)
    scene.camera.setPos(-plane.sprite.position.x, -plane.sprite.position.y)

    emitter.update(0.001);
    emitter.updateOwnerPos(plane.sprite.position.x, plane.sprite.position.y)

    // update plane volume and particle emitter
    if (counterthing % 10 == 0) {
        emitter.frequency = (1  / (plane.getThrustFraction()*1000 + 10))
        planesound.volume = Math.min(plane.getThrustFraction(), 1)
    }

    // change background-color with altitude
    var newBGColor = mixColor([135, 206, 235], [0, 0, 3], Math.min(-plane.sprite.position.y / 30000, 1))
    scene.renderer.backgroundColor =  PIXI.utils.rgb2hex(newBGColor)
    
    requestAnimationFrame(render);
}