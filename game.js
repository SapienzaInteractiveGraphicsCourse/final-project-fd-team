var canvas = document.getElementById('canvas');
let divFps = document.getElementById("fps");

//var engine = null;
var scene = null;
var sceneToRender = null;

var createDefaultEngine = function() { return new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true,  disableWebGL2Support: false}); };


var engine = new BABYLON.Engine(canvas, true);
let engineScale = Math.min(window.devicePixelRatio,1.5);
//loading screen
var boolgamestart = false;
var boolgameend = false;

//loading screen
var loadingScreenDiv = window.document.getElementById("loadingScreen");

function customLoadingScreen() {
}
customLoadingScreen.prototype.displayLoadingUI = function () {
    loadingScreenDiv.style.display = "inline";
    loadingScreenDiv.style.backgroundColor = "black";
    loadingScreenDiv.style.color = "white";
    loadingScreenDiv.innerHTML = "Loading:     " + (100 - scene.getWaitingItemsCount()) + "%";
};
customLoadingScreen.prototype.hideLoadingUI = function () {
    loadingScreenDiv.style.display = "none";
};
var loadingScreen = new customLoadingScreen();
engine.loadingScreen = loadingScreen;

        
var clicks = 0;

//**********************MENU SCENE**********************************
var createScenemenu = function () {
  
	var scenemenu = new BABYLON.Scene(engine);
    scenemenu.createDefaultEnvironment();
    scenemenu.clearColor = new BABYLON.Color3(0.8, 0.7,0, 0.2);
    var menulight = new BABYLON.PointLight("spot1", new BABYLON.Vector3(-20, 5, 10), scenemenu);
    menulight.diffuse = new BABYLON.Color3(0, 1, 1);
    menulight.specular = new BABYLON.Color3(0, 0, 0);
    menulight.intensity = 1;
    var camera1 = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(-40, 10, 0), scenemenu);
    camera1.radius = 15;
    camera1.heightOffset = 5;
    camera1.rotationOffset = 0;
    camera1.cameraAcceleration = 0.1;
    camera1.maxCameraSpeed = 100;
    camera1.lowerRadiusLimit = 0;
    camera1.lowerHeightOffsetLimit = 0;
    camera1.upperHeightOffsetLimit = 80;
    camera1.attachControl(canvas, true);
			  
	createGUI(scenemenu, 0);
	var backgroundmusic = new BABYLON.Sound("backgroundmusic", "music/pirati.mp3", scenemenu, null, {volume: 0.1, loop:true, autoplay:true});


    return scenemenu;
}


const buildHouse = (px,py,pz) => {
    const box = buildBox(px,py,pz);
    const roof = buildRoof(px,py,pz);

   return BABYLON.Mesh.MergeMeshes([box, roof], true, false, null, false, true);
   
}





const buildBox = (px,py,pz) => {
    //texture
    
    const boxMat = new BABYLON.StandardMaterial("boxMat");
    boxMat.diffuseTexture = new BABYLON.Texture("textures/arm2.jpg", scene);
    
    boxMat.specularTexture = new BABYLON.Texture("textures/arm2.jpg", scene)
    

    //options parameter to set different images on each side
    const faceUV = [];

    faceUV[0] = new BABYLON.Vector4(0.6, 0.0, 1.0, 1.0); //rear face
    faceUV[1] = new BABYLON.Vector4(0.0, 0.0, 0.4, 1.0); //front face
    faceUV[2] = new BABYLON.Vector4(0.4, 0, 0.6, 1.0); //right side
    faceUV[3] = new BABYLON.Vector4(0.4, 0, 0.6, 1.0); //left side
   
    // top 4 and bottom 5 not seen so not set

    /**** World Objects *****/
    const box = BABYLON.MeshBuilder.CreateBox("box", {size: 300, height: 300, wrap: true});
    box.material = boxMat;
    //box.position=new BABYLON.Vector3(-900, 10, -1300);
    box.position=new BABYLON.Vector3(px, py, pz);
    

    //door and windows
    var doorMaterial2 = new BABYLON.StandardMaterial("doorMat2", scene);
        doorMaterial2.diffuseTexture = new BABYLON.Texture("textures/legno3.jpg", scene);
        doorMaterial2.specularTexture = new BABYLON.Texture("textures/legno3.jpg", scene);



    const boxdoor = BABYLON.MeshBuilder.CreateBox("boxdoor", {size: 100, height:100, wrap: true});
    boxdoor.material = doorMaterial2;
  
    
    boxdoor.position=new BABYLON.Vector3(px-110, py-55, pz);
  
   
    const winMat = new BABYLON.StandardMaterial("winMat");
    winMat.diffuseTexture = new BABYLON.Texture("textures/legno.jpg", scene);

    const yellowMat2 = new BABYLON.StandardMaterial("yellowMat2");
    yellowMat2.emissiveColor = BABYLON.Color3.Yellow();

    const boxwin1 = BABYLON.MeshBuilder.CreateBox("boxwin1", {size: 30, height:30, wrap: true});
    
   
  
    
    boxwin1.position=new BABYLON.Vector3(px-150, py+50, pz+100);

 

    const boxwin2 = BABYLON.MeshBuilder.CreateBox("boxwin2", {size: 30, height:30, wrap: true});
    
   
    boxwin2.position=new BABYLON.Vector3(px-150, py+50, pz+50);

    const boxwin3 = BABYLON.MeshBuilder.CreateBox("boxwin3", {size: 30, height:30, wrap: true});
   
  
    boxwin3.position=new BABYLON.Vector3(px-150, py+50, pz-50);
    
    const boxwin4 = BABYLON.MeshBuilder.CreateBox("boxwin4", {size: 30, height:30, wrap: true});
   
    boxwin4.position=new BABYLON.Vector3(px-150, py+50, pz-100);


    if (currentLevel==1) {
        boxwin1.material = winMat;
        boxwin2.material = winMat;
        boxwin3.material = winMat;
        boxwin4.material = winMat;
    } else {
        boxwin1.material = yellowMat2;
        boxwin2.material = yellowMat2;
        boxwin3.material = yellowMat2;
        boxwin4.material = yellowMat2;
    }   
   
    
    

    return BABYLON.Mesh.MergeMeshes([box, boxdoor, boxwin1,boxwin2, boxwin3, boxwin4 ], true, false, null, false, true);;
}


// px,py,pz coordinate della casa non del tetto

const buildRoof = (px,py,pz) => {
    
    //texture
    const roofMat = new BABYLON.StandardMaterial("roofMat");
    roofMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/roof.jpg");

    const roof = BABYLON.MeshBuilder.CreateCylinder("roof", {diameter: 400, height:360, tessellation: 3});
    roof.material = roofMat;
    roof.position=new BABYLON.Vector3(px, py+190, pz);
    roof.rotation.z = Math.PI / 2;
    roof.scaling.x = 0.75;
   

    return roof;
}

const buildrobot = () => {

    const head1 = buildrobhead();
   
    return head1;
   
}


const buildrobhead = () => {
    
   

    var head1 = BABYLON.Mesh.CreateSphere("head1", 10, 40, scene);

    head1.position.x=-1110;
    head1.position.y=-10;
    head1.position.z=1000;
   

    return head1;
}

const buildrobbody = () => {
    

    const body1 = BABYLON.MeshBuilder.CreateCylinder("body1", {size:50 , height:50, wrap: true});
   
    body1.position=new BABYLON.Vector3(-3000,10, 0);
    
    
   

    return body1;
}


const buildarms = () => {
    
    
    var leftarm11 = BABYLON.MeshBuilder.CreateCylinder("leftarm11", {diameterTop:7, diameterBottom: 7, height: 10, tessellation: 96}, scene);
    leftarm11.rotation.x = Math.PI/2;
    leftarm11.position = new BABYLON.Vector3(0, 0, -15);

    var rightarm11 = BABYLON.MeshBuilder.CreateCylinder("rightarm1", {diameterTop:7, diameterBottom: 7, height: 10, tessellation: 96}, scene);
    rightarm11.rotation.x = Math.PI/2;
    rightarm11.position = new BABYLON.Vector3(0, 0, 15);

    return BABYLON.Mesh.MergeMeshes([leftarm11, rightarm11], true, false, null, false, true);;
}


var bulletsRate;  
var bulletsRange;  
var winCountLVL1;   
var winCountLVL2; 
var sphspeed;   
      

//**************************WIN SCENE**************************
var createwinScene = function () {

	var winScene = new BABYLON.Scene(engine);
		winScene.clearColor = new BABYLON.Color3(0.00, 0.75, 1.00);
    var winmusic = new BABYLON.Sound("winmusic", "music/win.wav", winScene, null, {volume: 0.1, autoplay:true});
	
	var cameraWin= new BABYLON.UniversalCamera("CamWin", new BABYLON.Vector3(0, 0, 1), winScene);
		cameraWin.attachControl(canvas, true);

    createGUI(winScene, 5);


    return winScene;

}

//******************************************************************

var createScene = function () {
    var scene = new BABYLON.Scene(engine);
    
    //physics

    var gravityVector = new BABYLON.Vector3(0,-20, 0);
    var physicsPlugin = new BABYLON.CannonJSPlugin();
    scene.enablePhysics(gravityVector, physicsPlugin);
    scene.collisionsEnabled = true;
    var physicsViewer = new BABYLON.Debug.PhysicsViewer();
    var physicsHelper = new BABYLON.PhysicsHelper(scene); 

    
    
   var camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(-40, 10, 0), scene);
    camera.radius = 150;
    camera.heightOffset = 50;
    camera.rotationOffset = 270;
    camera.cameraAcceleration = 0.1;
    camera.maxCameraSpeed = 100;
    camera.lowerRadiusLimit = 50;
    camera.upperRadiusLimit = 190;
    camera.lowerHeightOffsetLimit = 0;
    camera.upperHeightOffsetLimit = 180;
    camera.lowerRotationOffsetLimit = 10;
    camera.upperRotationOffsetLimit = 320;
    camera.minZ = 0;
    //camera.maxZ = 3570;
    camera.attachControl(canvas, true);
    camera.checkCollisions = true;

    


    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 100, 0),scene);
    light.position = new BABYLON.Vector3(-3800, 100, -200);
    light.diffuse = new BABYLON.Color3(1, 1, 1);
    light.specular = new BABYLON.Color3(0, 0, 0);
    light.intensity = 0.8;
    light.setEnabled(false);

    const light1 = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(0, -1, 0.2),scene);
    light1.position = new BABYLON.Vector3(-3800, 100, -200);
    light1.diffuse = new BABYLON.Color3(1, 1, 1);
    light1.specular = new BABYLON.Color3(0, 0, 0);
    light1.intensity = 0.5;
    light1.setEnabled(false);


    

    const light2 = new BABYLON.DirectionalLight("light2", new BABYLON.Vector3(0, -1, 1),scene);
    light2.position = new BABYLON.Vector3(0, 100, -200);
    light2.diffuse = new BABYLON.Color3(1, 1, 1);
    light2.specular = new BABYLON.Color3(0, 0, 0);
    light2.intensity = 0.85;
    light2.setEnabled(false);


    //Skybox
    const skybox = BABYLON.Mesh.CreateBox("skyBox", 5500.0, scene);
    skybox.position = new BABYLON.Vector3(-1050, 0, 0);
    const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", scene);
    skyboxMaterial.backFaceCulling = false;
    skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/lightBlueSkyBox/lightBlueSky", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    skybox.material = skyboxMaterial;
    var backgroundmusic2 = new BABYLON.Sound("backgroundmusic", "music/water.wav", scene, null, {volume: 0.05, loop:true, autoplay:true});



    var sphericLaserShotSound = new BABYLON.Sound("sphericLaserShotSound", "music/sphericLaserShot.wav", scene, null, {volume: 0.2});
    var levelup = new BABYLON.Sound("levelup", "music/levelup.wav", scene, null, {volume: 0.2});
    var box = BABYLON.MeshBuilder.CreateBox("box",{ height: 300, width: 100, depth: 5000}, scene);
    box.visibility = 0;
    
    box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 1000, friction:100, restitution: 0}, scene);
    box.position = new BABYLON.Vector3(1495, 100, 0);

    
    boolgameend = false;

    if(difficulty == 0){
		winCountLVL1 = 2;  
        winCountLVL2 = 4; 
        bulletsRange = 4500;
        bulletsRate = 400;
        sphspeed = 0.3;

    } else if(difficulty == 1){
        winCountLVL1 = 3;  
        winCountLVL2 = 5; 
        bulletsRange = 4000;
        bulletsRate = 400;
        sphspeed = 0.4;
    } else if(difficulty == 2){
        winCountLVL1 = 4; 
        winCountLVL2 = 6;  
        bulletsRange = 3500;
        bulletsRate = 400;
        sphspeed = 0.5;

    }

       

    
    //ROBOT

    

        //build robot cleaner
        

         //head material
         var headMaterial = new BABYLON.StandardMaterial("headMat", scene);
         headMaterial.diffuseTexture = new BABYLON.Texture("textures/testa.jpg", scene);
         headMaterial.specularTexture = new BABYLON.Texture("textures/testa.jpg", scene);

        //body material
        var bodyMaterial = new BABYLON.StandardMaterial("bodyMat", scene);
        bodyMaterial.diffuseTexture = new BABYLON.Texture("textures/steel2.jpg", scene);
        bodyMaterial.specularTexture = new BABYLON.Texture("textures/steel2.jpg", scene);
        
        //legs material
        var legMaterial = new BABYLON.StandardMaterial("legMat", scene);
        legMaterial.diffuseTexture = new BABYLON.Texture("textures/steel2.jpg", scene);
        legMaterial.specularTexture = new BABYLON.Texture("textures/steel2.jpg", scene);

        //foot material
        var footMaterial = new BABYLON.StandardMaterial("footMat", scene);
        footMaterial.diffuseTexture = new BABYLON.Texture("textures/casa.jpg", scene);
        footMaterial.specularTexture = new BABYLON.Texture("textures/casa.jpg", scene);

        var cleanbox = BABYLON.MeshBuilder.CreateBox("cleanbox",{ height: 65, width: 55, depth: 57}, scene);
        cleanbox.visibility = 0;
        

        var head0 = BABYLON.Mesh.CreateSphere("head0", 15, 25, scene);
        head0.position = new BABYLON.Vector3(70, 23, 0);
        var a = BABYLON.CSG.FromMesh(head0);

        var totbody = BABYLON.MeshBuilder.CreateBox("anibot",{ height: 24, width: 10, depth: 20}, scene);
        totbody.position = new BABYLON.Vector3(70, 23, 0);


        var b = BABYLON.CSG.FromMesh(totbody);

        //csg
        var cleaner = b.intersect(a).toMesh("c", null, scene);

        cleaner.position.x = 0;
        cleaner.position.z = 0;
        cleaner.position.y = 6;
        cleaner.parent = cleanbox;
        cleanbox.physicsImpostor = new BABYLON.PhysicsImpostor(cleanbox, BABYLON.PhysicsImpostor.BoxImpostor, {mass: 50,friction:1.5,  restitution: 0}, scene);
        cleanbox.position.x = -3250;
        cleanbox.position.z = 0;
        cleanbox.position.y = 500;
        cleanbox.physicsImpostor.physicsBody.inertia.setZero();
        cleanbox.physicsImpostor.physicsBody.invInertia.setZero();
        cleanbox.physicsImpostor.physicsBody.invInertiaWorld.setZero();
        cleanbox.checkCollisions=true;

        head0.dispose();
        totbody.dispose();
        cleaner.material=bodyMaterial;

        cleaner.checkCollisions = true;


       

        //build cleaner head
        var cleanhead = BABYLON.Mesh.CreateSphere("head", 42, 10, scene);
        cleanhead.parent=cleaner;
        cleanhead.position.y = 13;
        cleanhead.material=headMaterial;

        //cleaner eyes
        var cleaneyemat = new BABYLON.StandardMaterial("eyemat", scene);
        cleaneyemat.emissiveColor=new BABYLON.Vector3(0,1,1);

        var cleaneye = BABYLON.Mesh.CreateSphere("cleaneye", 2, 2, scene);
        cleaneye.parent = cleanhead;
        cleaneye.position = new BABYLON.Vector3(3,3, 2);
        cleaneye.material=cleaneyemat;


        var cleaneye2 = BABYLON.Mesh.CreateSphere("cleaneye2", 2, 2, scene);
        cleaneye2.parent = cleanhead;
        cleaneye2.position = new BABYLON.Vector3(3,3, -2);
        cleaneye2.material=cleaneyemat;


        //build cleaner left leg
       
        var cleanlleg1 = BABYLON.MeshBuilder.CreateCylinder("leg1",{diameterTop:8, diameterBottom: 7, height: 8, tessellation: 96}, scene);
        cleanlleg1.parent=cleaner;
        cleanlleg1.position.y=-15;
        cleanlleg1.position.z=5;
        cleanlleg1.material=legMaterial;
        var cleanlknee = BABYLON.Mesh.CreateSphere("knee", 3, 3, scene);
        cleanlknee.parent=cleanlleg1;
        cleanlknee.position.y = -4;
        cleanlknee.material=headMaterial;
        
        
        var cleanlleg2 = BABYLON.MeshBuilder.CreateCylinder("leg1",{diameterTop:6, diameterBottom: 6, height: 8, tessellation: 96}, scene);
        cleanlleg2.parent=cleanlknee;
        cleanlleg2.position.y = -5;
        cleanlleg2.material=legMaterial;
        const cleanlfoot = BABYLON.MeshBuilder.CreateSphere("lfoot", {diameterX: 8, diameterY: 4, diameterZ: 4});
        cleanlfoot.parent=cleanlleg2;
        cleanlfoot.position.y = -6;
        cleanlfoot.material=footMaterial;


        //build cleaner right leg
       
        var cleanrleg1 = BABYLON.MeshBuilder.CreateCylinder("rleg1",{diameterTop:8, diameterBottom: 7, height: 8, tessellation: 96}, scene);
        cleanrleg1.parent=cleaner;
        cleanrleg1.position.y=-15;
        cleanrleg1.position.z=-5;
        cleanrleg1.material=legMaterial;
        var cleanrknee = BABYLON.Mesh.CreateSphere("rknee", 3, 3, scene);
        cleanrknee.parent=cleanrleg1;
        cleanrknee.position.y = -4;
        cleanrknee.material=headMaterial;
        
        var cleanrleg2 = BABYLON.MeshBuilder.CreateCylinder("leg1",{diameterTop:6, diameterBottom: 6, height: 8, tessellation: 96}, scene);
        cleanrleg2.parent=cleanrknee;
        cleanrleg2.position.y = -5;
        cleanrleg2.material=legMaterial;
        const cleanrfoot = BABYLON.MeshBuilder.CreateSphere("lfoot", {diameterX: 8, diameterY: 4, diameterZ: 4});
        cleanrfoot.parent=cleanrleg2;
        cleanrfoot.position.y = -6;
        cleanrfoot.material=footMaterial;

        //build cleaner left arm
        var cleanlarm1 = BABYLON.MeshBuilder.CreateCylinder("leftarm1", {diameterTop:4, diameterBottom: 4, height: 4, tessellation: 96}, scene);
        cleanlarm1.rotation.y = Math.PI/2;
        cleanlarm1.parent = cleaner;
        cleanlarm1.position = new BABYLON.Vector3(0, 0, -11);
        cleanlarm1.material=legMaterial;

        var cleanlarm2 = new BABYLON.MeshBuilder.CreateCapsule("capsule", {radius:2, capSubdivisions: 1, height:15, tessellation:4, topCapSubdivisions:12});
        cleanlarm2.parent = cleanlarm1;
        cleanlarm2.rotation.x = -Math.PI/2;
        cleanlarm2.position = new BABYLON.Vector3(0, 1, 6);
        cleanlarm2.material=legMaterial;


         //build cleaner right arm
        var cleanrarm1 = BABYLON.MeshBuilder.CreateCylinder("rightarm1", {diameterTop:4, diameterBottom: 4, height: 4, tessellation: 96}, scene);
        cleanrarm1.rotation.y = Math.PI/2;   
        cleanrarm1.parent = cleaner;
        cleanrarm1.position = new BABYLON.Vector3(0, 0, 11);
        cleanrarm1.material=legMaterial;
 
        var cleanrarm2 = new BABYLON.MeshBuilder.CreateCapsule("capsule", {radius:2, capSubdivisions: 1, height:15, tessellation:4, topCapSubdivisions:12});
        cleanrarm2.parent = cleanrarm1;
        cleanrarm2.rotation.x = -Math.PI/2;
        cleanrarm2.position = new BABYLON.Vector3(0, 1, 6);
        cleanrarm2.material=legMaterial;
        
        //wheel face UVs
        const wheelUV = [];
        wheelUV[0] = new BABYLON.Vector4(0, 0, 1, 1);
        wheelUV[1] = new BABYLON.Vector4(0, 0.5, 0, 0.5);
        wheelUV[2] = new BABYLON.Vector4(0, 0, 1, 1);

        const wheelMat = new BABYLON.StandardMaterial("wheelMat");
        wheelMat.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/wheel.png");

        if (currentLevel==2) wheelMat.emissiveColor = BABYLON.Color3.Yellow();

        

       
        //base hover
        const bhover = BABYLON.MeshBuilder.CreateSphere("hover", {diameterX: 20, diameterY: 40, diameterZ: 5},scene);
        bhover.parent=cleaner;
        bhover.position.x = 6;
        bhover.position.z = 0;
        bhover.position.y = -33;
        bhover.rotation.x=-Math.PI/2;
        
        //wheels
        wheelRB = BABYLON.MeshBuilder.CreateCylinder("wheelRB", {diameter: 10, height: 4, faceUV: wheelUV},scene);
        wheelRB.material = wheelMat;
        wheelRB.position.x = 0;
        wheelRB.position.z = 0;
        wheelRB.position.y = 19;
        wheelRB.parent=bhover;
       

        wheelLB = wheelRB.clone("wheelLB");
        wheelLB.position.y = -19;
        wheelLB.parent=bhover;


        
        

        //build braccio hover
        var brhover = BABYLON.MeshBuilder.CreateCylinder("brhover", {diameterTop:2, diameterBottom: 2, height: 34, tessellation: 96}, scene);
        brhover.rotation.x = Math.PI/2;
        brhover.parent=bhover;

        brhover.position = new BABYLON.Vector3(7, 0, 17);
        
        //build manubrio hover
        const mhover = BABYLON.MeshBuilder.CreateSphere("mhover", {diameterX: 3, diameterY: 25, diameterZ: 3},scene);
        mhover.parent=brhover;
        mhover.position.x = 0;
        mhover.position.z = 0;
        mhover.position.y = 17;
        mhover.rotation.x=Math.PI/2;

        //lamp mhover
        const lamphover = new BABYLON.SpotLight("lamphover", BABYLON.Vector3.Zero(), new BABYLON.Vector3(1, 0, 0), Math.PI, 1, scene);
        lamphover.diffuse = BABYLON.Color3.Yellow();
        
        const yellowMat3 = new BABYLON.StandardMaterial("yellowMat");
        yellowMat3.emissiveColor = BABYLON.Color3.Yellow();
        yellowMat3.maxSimultaneousLights = 5;

        var toruscolor = new BABYLON.StandardMaterial("toruscolor", scene);
        toruscolor.diffuseTexture =  new BABYLON.Texture("textures/torus.jpg", scene);

        const torus2 = BABYLON.MeshBuilder.CreateTorus("torus2", {thickness: 3, diameter: 3});
        torus2.parent = mhover;
        torus2.position = new BABYLON.Vector3(2, 0, 0);
        torus2.material=toruscolor;
        torus2.rotation.z=Math.PI/2;

        //back light 
        const torusb = BABYLON.MeshBuilder.CreateTorus("torus2", {thickness: 1.5, diameter: 5.5});
        torusb.parent = bhover;
        torusb.position = new BABYLON.Vector3(-10, 0, 0);
        torusb.material=toruscolor;
        torusb.rotation.z=Math.PI/2;

        meshShotStartPosition = BABYLON.MeshBuilder.CreateSphere("meshShotStartPosition", {diameterX: 0.1, diameterY: 0.1, diameterZ: 0.1}, scene);
		
        meshShotStartPosition.parent=torus2;
        meshShotStartPosition.rotation.z=-Math.PI/2;
		
        var luce = new BABYLON.StandardMaterial("luce", scene);
        luce.emissiveColor = new BABYLON.Color3(0,0,0);
        
        var lightb = BABYLON.Mesh.CreateSphere("lightb", 32, 5, scene);
        lightb.parent = torusb;
        lightb.position = new BABYLON.Vector3(0, 0, 0);
        lightb.material=luce;

        var ext1hover = BABYLON.MeshBuilder.CreateCylinder("ext1hover", {diameterTop:2, diameterBottom: 2, height: 10, tessellation: 96}, scene);
        
        ext1hover.parent=bhover;
        ext1hover.position.x=-11;
        ext1hover.position.y = 16;
        ext1hover.rotation.z=Math.PI/2;
       
        var particleSystem = new BABYLON.ParticleSystem("particles", 300 , scene, null, true);
        particleSystem.particleTexture = new BABYLON.Texture("textures/surface2.png", scene, true, false, BABYLON.Texture.TRILINEAR_SAMPLINGMODE);
        
        particleSystem.startSpriteCellID = 0;
        particleSystem.endSpriteCellID = 31;
        particleSystem.spriteCellHeight = 256;
        particleSystem.spriteCellWidth = 128;
        particleSystem.spriteCellChangeSpeed = 4;
    
        particleSystem.minScaleX = 5.0;
        particleSystem.minScaleY = 6.0;
        particleSystem.maxScaleX = 5.0;
        particleSystem.maxScaleY = 6.0;
    
        particleSystem.addSizeGradient(0, 0, 0);
        particleSystem.addSizeGradient(1, 1, 1);
    
        particleSystem.translationPivot = new BABYLON.Vector2(0.1, 0.8);
    
    
    
        // Where the particles come from
        var radius = 1;
        var angle = Math.PI;
        var cylinEm = new BABYLON.ConeParticleEmitter(radius, angle);
    
        particleSystem.particleEmitterType = cylinEm;
        particleSystem.emitter= ext1hover;
    
        
        particleSystem.minLifeTime = 4.0;
        particleSystem.maxLifeTime = 4.0;
    
        // Color gradient
        particleSystem.addColorGradient(1, new BABYLON.Color4(1, 1, 1, 0));
        particleSystem.addColorGradient(0.5, new BABYLON.Color4(1, 1, 1, 70/255));
        particleSystem.addColorGradient(1.0, new BABYLON.Color4(1, 1, 1, 0));
    
        // Emission rate
        particleSystem.emitRate = 6 ;
    
        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD;
    
        // gravity
        particleSystem.gravity = new BABYLON.Vector3(0, 0, 0);
    
        // Speed
        particleSystem.minEmitPower = 0;
        particleSystem.maxEmitPower = 1 ;
        particleSystem.updateSpeed = 0.3;
        
    
        particleSystem.start();
        
        ext2hover = ext1hover.clone("ext1hover");
        ext2hover.position.y = -16;
        ext2hover.parent=bhover;



        if (currentLevel==1) {
            light.setEnabled(true);
            light1.setEnabled(false);
            light2.setEnabled(true);
        } else {
            light.setEnabled(false);
            light1.setEnabled(true);
            light2.setEnabled(false);
          

        }  


    var a = 0;

    
    camera.lockedTarget = cleaner;
    //mapping commands
    var map = {};
    scene.actionManager = new BABYLON.ActionManager(scene);

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
    map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";

    }));

    scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
    map[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown ";
    }));


    var counter = 0;
    var hits10=false;
    var hits11=false;
    var hits12=false;
    var hits14=false;
    var hits15=false;
    var hits16=false;
    var hits18=false;
    var hits19=false;
    var hits20=false;
    var hits21=false;

    

    var advancedTextureCounter = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        var labelcou = new BABYLON.GUI.TextBlock();
        labelcou.height = "13px";
        labelcou.color = "yellow";
        labelcou.fontStyle = "italic";
        labelcou.fontFamily = "Verdana";

        if (difficulty == 0 && currentLevel == 1){
            labelcou.text = counter.toString() + "/2 score";
        } else if (difficulty == 0 && currentLevel == 2) {
            labelcou.text = counter.toString() + "/4";
        }

        if (difficulty == 1 && currentLevel == 1){
            labelcou.text = counter.toString() + "/3";
        } else if (difficulty == 1 && currentLevel == 2) {
            labelcou.text = counter.toString() + "/5";
        }

        if (difficulty == 2 && currentLevel == 1){
            labelcou.text = counter.toString() + "/4";
        } else if (difficulty == 2 && currentLevel == 2) {
            labelcou.text = counter.toString() + "/6";
        }
    
    advancedTextureCounter.addControl(labelcou);
     
	
    scene.registerAfterRender(function () {

        if (difficulty == 0 && currentLevel == 1){
            labelcou.text = counter.toString() + "/2";
        } else if (difficulty == 0 && currentLevel == 2) {
            labelcou.text = counter.toString() + "/4";
        }

        if (difficulty == 1 && currentLevel == 1){
            labelcou.text = counter.toString() + "/3";
        } else if (difficulty == 1 && currentLevel == 2) {
            labelcou.text = counter.toString() + "/5";
        }

        if (difficulty == 2 && currentLevel == 1){
            labelcou.text = counter.toString() + "/4";
        } else if (difficulty == 2 && currentLevel == 2) {
            labelcou.text = counter.toString() + "/6";
        }
    
   
    if (currentLevel==2) {
      
        if (light1.intensity >0) light1.intensity -= 0.0001;
    }

    if ((currentLevel ==2 ) && (light1.intensity <0.3)) {
        
        mhover.material = yellowMat3;
        lamphover.parent = mhover;
    }

    currentTime = new Date().getTime();
   
    if ((map[" "] || map[" "]) && (currentTime >= nextBulletTime)) {
       
            Bullet(bulletsRate, bulletsRange);
    
        
    }
   
    
    if ((map["w"] || map["W"])) {

        luce.emissiveColor =new BABYLON.Color3.Blue();
        lightb.material=luce;

        if ((brhover.intersectsMesh(torusf,false)) || (bhover.intersectsMesh(church2,false)) || (bhover.intersectsMesh(church1,false)) || (bhover.intersectsMesh(pic0,false)) || (bhover.intersectsMesh(pic1,false)) || (bhover.intersectsMesh(house1,false)) || (bhover.intersectsMesh(house2,false))
            || (bhover.intersectsMesh(pic2,false)) || (bhover.intersectsMesh(pic3,false)) || (bhover.intersectsMesh(pic4,false)) || (bhover.intersectsMesh(pic5,false)) || (bhover.intersectsMesh(pic6,false))
            || (bhover.intersectsMesh(pic7,false)) || (bhover.intersectsMesh(pic8,false)) || (bhover.intersectsMesh(pic9,false)) || (bhover.intersectsMesh(pic10,false)) || (bhover.intersectsMesh(pic11,false))
            || (bhover.intersectsMesh(pic12,false)) || (bhover.intersectsMesh(pic13,false)) || (bhover.intersectsMesh(trunk1,false)) || (bhover.intersectsMesh(trunk2,false)) || (bhover.intersectsMesh(trunk3,false))
            || (bhover.intersectsMesh(trunk4,false)) || (bhover.intersectsMesh(trunk5,false)) || (bhover.intersectsMesh(trunk6,false)) || (bhover.intersectsMesh(trunk7,false)) || (bhover.intersectsMesh(trunk8,false))
            || (bhover.intersectsMesh(trunk9,false)) || (bhover.intersectsMesh(trunk10,false)) || (bhover.intersectsMesh(trunk11,false)) || (bhover.intersectsMesh(trunk12,false)) || (bhover.intersectsMesh(trunk13,false))
            || (bhover.intersectsMesh(trunk14,false)) || (bhover.intersectsMesh(trunk15,false)) || (bhover.intersectsMesh(trunk16,false))
            || (bhover.intersectsMesh(leftcol1,false)) || (bhover.intersectsMesh(leftcol2,false)) || (bhover.intersectsMesh(rightcol1,false)) || (bhover.intersectsMesh(rightcol2,false))
            || (bhover.intersectsMesh(lamp2shape,false)) || (bhover.intersectsMesh(lamp4shape,false)) || (bhover.intersectsMesh(sleftcol1,false)) || (bhover.intersectsMesh(sleftcol2,false))
            || (bhover.intersectsMesh(srightcol1,false)) || (bhover.intersectsMesh(srightcol2,false))){
                
                
        } else { 
            
            if ((map[" "] || map[" "]) && (currentTime >= nextBulletTime)) {
       
                Bullet(bulletsRate, bulletsRange);
        
            
            }
    
        cleaner.translate(BABYLON.Axis.X, 0.75, BABYLON.Space.LOCAL);
       
        wheelRB.rotation.y += 0.2;
        wheelLB.rotation.y += 0.2;
        }
    
    } 

    
    else if ((map["s"] || map["S"])) {
        if ((cleaner.intersectsMesh(torusf,false)) || (ext1hover.intersectsMesh(church2,false)) || (ext1hover.intersectsMesh(church1,false)) || (ext1hover.intersectsMesh(pic0,false)) || (ext1hover.intersectsMesh(pic1,false)) || (ext1hover.intersectsMesh(house1,false)) || (ext1hover.intersectsMesh(house2,false))
        || (ext1hover.intersectsMesh(pic2,false)) || (ext1hover.intersectsMesh(pic3,false)) || (ext1hover.intersectsMesh(pic4,false)) || (ext1hover.intersectsMesh(pic5,false)) || (ext1hover.intersectsMesh(pic6,false))
        || (ext1hover.intersectsMesh(pic7,false)) || (ext1hover.intersectsMesh(pic8,false)) || (ext1hover.intersectsMesh(pic9,false)) || (ext1hover.intersectsMesh(pic10,false)) || (ext1hover.intersectsMesh(pic11,false))
        || (ext1hover.intersectsMesh(pic12,false)) || (ext1hover.intersectsMesh(pic13,false)) || (ext1hover.intersectsMesh(trunk1,false)) || (ext1hover.intersectsMesh(trunk2,false)) || (ext1hover.intersectsMesh(trunk3,false))
        || (ext1hover.intersectsMesh(trunk4,false)) || (ext1hover.intersectsMesh(trunk5,false)) || (ext1hover.intersectsMesh(trunk6,false)) || (ext1hover.intersectsMesh(trunk7,false)) || (ext1hover.intersectsMesh(trunk8,false))
        || (ext1hover.intersectsMesh(trunk9,false)) || (ext1hover.intersectsMesh(trunk10,false)) || (ext1hover.intersectsMesh(trunk11,false)) || (ext1hover.intersectsMesh(trunk12,false)) || (ext1hover.intersectsMesh(trunk13,false))
        || (ext1hover.intersectsMesh(trunk14,false)) || (ext1hover.intersectsMesh(trunk15,false)) || (ext1hover.intersectsMesh(trunk16,false))
        || (ext1hover.intersectsMesh(leftcol1,false)) || (ext1hover.intersectsMesh(leftcol2,false)) || (ext1hover.intersectsMesh(rightcol1,false)) || (ext1hover.intersectsMesh(rightcol2,false))
        || (ext1hover.intersectsMesh(lamp2shape,false)) || (ext1hover.intersectsMesh(lamp4shape,false)) || (ext1hover.intersectsMesh(sleftcol1,false)) || (ext1hover.intersectsMesh(sleftcol2,false))
        || (ext1hover.intersectsMesh(srightcol1,false)) || (ext1hover.intersectsMesh(srightcol2,false)) || 
        (ext2hover.intersectsMesh(torusf,false)) || (ext2hover.intersectsMesh(church2,false)) || (ext2hover.intersectsMesh(church1,false)) || (ext2hover.intersectsMesh(pic0,false)) || (ext2hover.intersectsMesh(pic1,false)) || (ext2hover.intersectsMesh(house1,false)) || (ext2hover.intersectsMesh(house2,false))
        || (ext2hover.intersectsMesh(pic2,false)) || (ext2hover.intersectsMesh(pic3,false)) || (ext2hover.intersectsMesh(pic4,false)) || (ext2hover.intersectsMesh(pic5,false)) || (ext2hover.intersectsMesh(pic6,false))
        || (ext2hover.intersectsMesh(pic7,false)) || (ext2hover.intersectsMesh(pic8,false)) || (ext2hover.intersectsMesh(pic9,false)) || (ext2hover.intersectsMesh(pic10,false)) || (ext2hover.intersectsMesh(pic11,false))
        || (ext2hover.intersectsMesh(pic12,false)) || (ext2hover.intersectsMesh(pic13,false)) || (ext2hover.intersectsMesh(trunk1,false)) || (ext2hover.intersectsMesh(trunk2,false)) || (ext2hover.intersectsMesh(trunk3,false))
        || (ext2hover.intersectsMesh(trunk4,false)) || (ext2hover.intersectsMesh(trunk5,false)) || (ext2hover.intersectsMesh(trunk6,false)) || (ext2hover.intersectsMesh(trunk7,false)) || (ext2hover.intersectsMesh(trunk8,false))
        || (ext2hover.intersectsMesh(trunk9,false)) || (ext2hover.intersectsMesh(trunk10,false)) || (ext2hover.intersectsMesh(trunk11,false)) || (ext2hover.intersectsMesh(trunk12,false)) || (ext2hover.intersectsMesh(trunk13,false))
        || (ext2hover.intersectsMesh(trunk14,false)) || (ext2hover.intersectsMesh(trunk15,false)) || (ext2hover.intersectsMesh(trunk16,false))
        || (ext2hover.intersectsMesh(leftcol1,false)) || (ext2hover.intersectsMesh(leftcol2,false)) || (ext2hover.intersectsMesh(rightcol1,false)) || (ext2hover.intersectsMesh(rightcol2,false))
        || (ext2hover.intersectsMesh(lamp2shape,false)) || (ext2hover.intersectsMesh(lamp4shape,false)) || (ext2hover.intersectsMesh(sleftcol1,false)) || (ext2hover.intersectsMesh(sleftcol2,false))
        || (ext2hover.intersectsMesh(srightcol1,false)) || (ext2hover.intersectsMesh(srightcol2,false))
        ){
            
    } else {

        
        luce.emissiveColor = new BABYLON.Color3.Red();
        lightb.material=luce;
    
        cleaner.translate(BABYLON.Axis.X, -4, BABYLON.Space.LOCAL);   
        
        wheelRB.rotation.y -= 0.3;
        wheelLB.rotation.y -= 0.3;
        }
    
    } 
    
    else if ((map["a"] || map["A"])) {

        if ((brhover.intersectsMesh(torusf,false)) || (bhover.intersectsMesh(church2,false)) || (bhover.intersectsMesh(church1,false)) || (bhover.intersectsMesh(pic0,false)) || (bhover.intersectsMesh(pic1,false)) || (bhover.intersectsMesh(house1,false)) || (bhover.intersectsMesh(house2,false))
        || (bhover.intersectsMesh(pic2,false)) || (bhover.intersectsMesh(pic3,false)) || (bhover.intersectsMesh(pic4,false)) || (bhover.intersectsMesh(pic5,false)) || (bhover.intersectsMesh(pic6,false))
        || (bhover.intersectsMesh(pic7,false)) || (bhover.intersectsMesh(pic8,false)) || (bhover.intersectsMesh(pic9,false)) || (bhover.intersectsMesh(pic10,false)) || (bhover.intersectsMesh(pic11,false))
        || (bhover.intersectsMesh(pic12,false)) || (bhover.intersectsMesh(pic13,false)) || (bhover.intersectsMesh(trunk1,false)) || (bhover.intersectsMesh(trunk2,false)) || (bhover.intersectsMesh(trunk3,false))
        || (bhover.intersectsMesh(trunk4,false)) || (bhover.intersectsMesh(trunk5,false)) || (bhover.intersectsMesh(trunk6,false)) || (bhover.intersectsMesh(trunk7,false)) || (bhover.intersectsMesh(trunk8,false))
        || (bhover.intersectsMesh(trunk9,false)) || (bhover.intersectsMesh(trunk10,false)) || (bhover.intersectsMesh(trunk11,false)) || (bhover.intersectsMesh(trunk12,false)) || (bhover.intersectsMesh(trunk13,false))
        || (bhover.intersectsMesh(trunk14,false)) || (bhover.intersectsMesh(trunk15,false)) || (bhover.intersectsMesh(trunk16,false))
        || (bhover.intersectsMesh(leftcol1,false)) || (bhover.intersectsMesh(leftcol2,false)) || (bhover.intersectsMesh(rightcol1,false)) || (bhover.intersectsMesh(rightcol2,false))
        || (bhover.intersectsMesh(lamp2shape,false)) || (bhover.intersectsMesh(lamp4shape,false)) || (bhover.intersectsMesh(sleftcol1,false)) || (bhover.intersectsMesh(sleftcol2,false))
        || (bhover.intersectsMesh(srightcol1,false)) || (bhover.intersectsMesh(srightcol2,false))){
    } else{
   
        cleaner.rotate(BABYLON.Axis.Y, -0.05, BABYLON.Space.LOCAL);
   
        }
    }
    else if ((map["d"] || map["D"])) {
        if ((brhover.intersectsMesh(torusf,false)) || (bhover.intersectsMesh(church2,false)) || (bhover.intersectsMesh(church1,false)) || (bhover.intersectsMesh(pic0,false)) || (bhover.intersectsMesh(pic1,false)) || (bhover.intersectsMesh(house1,false)) || (bhover.intersectsMesh(house2,false))
        || (bhover.intersectsMesh(pic2,false)) || (bhover.intersectsMesh(pic3,false)) || (bhover.intersectsMesh(pic4,false)) || (bhover.intersectsMesh(pic5,false)) || (bhover.intersectsMesh(pic6,false))
        || (bhover.intersectsMesh(pic7,false)) || (bhover.intersectsMesh(pic8,false)) || (bhover.intersectsMesh(pic9,false)) || (bhover.intersectsMesh(pic10,false)) || (bhover.intersectsMesh(pic11,false))
        || (bhover.intersectsMesh(pic12,false)) || (bhover.intersectsMesh(pic13,false)) || (bhover.intersectsMesh(trunk1,false)) || (bhover.intersectsMesh(trunk2,false)) || (bhover.intersectsMesh(trunk3,false))
        || (bhover.intersectsMesh(trunk4,false)) || (bhover.intersectsMesh(trunk5,false)) || (bhover.intersectsMesh(trunk6,false)) || (bhover.intersectsMesh(trunk7,false)) || (bhover.intersectsMesh(trunk8,false))
        || (bhover.intersectsMesh(trunk9,false)) || (bhover.intersectsMesh(trunk10,false)) || (bhover.intersectsMesh(trunk11,false)) || (bhover.intersectsMesh(trunk12,false)) || (bhover.intersectsMesh(trunk13,false))
        || (bhover.intersectsMesh(trunk14,false)) || (bhover.intersectsMesh(trunk15,false)) || (bhover.intersectsMesh(trunk16,false))
        || (bhover.intersectsMesh(leftcol1,false)) || (bhover.intersectsMesh(leftcol2,false)) || (bhover.intersectsMesh(rightcol1,false)) || (bhover.intersectsMesh(rightcol2,false))
        || (bhover.intersectsMesh(lamp2shape,false)) || (bhover.intersectsMesh(lamp4shape,false)) || (bhover.intersectsMesh(sleftcol1,false)) || (bhover.intersectsMesh(sleftcol2,false))
        || (bhover.intersectsMesh(srightcol1,false)) || (bhover.intersectsMesh(srightcol2,false))){
    } else {
    
        cleaner.rotate(BABYLON.Axis.Y, 0.05, BABYLON.Space.LOCAL);
        }
    } else {
        luce.emissiveColor = new BABYLON.Color3.White();
        lightb.material=luce;
    
    }
    
    
    
    

    });



        
           
            const ground = BABYLON.MeshBuilder.CreateBox("ground",{width:11000, height:20, depth:8000}, scene);
            ground.receiveShadows = true;
            
            ground.position = new BABYLON.Vector3(-2500, -100, 0);
            ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution:0.9}, scene);
            ground.checkCollisions = true;
            const groundMat = new BABYLON.StandardMaterial("groundMat");
            groundMat.diffuseTexture = new BABYLON.Texture("textures/sampie.jpeg", scene);
            groundMat.diffuseTexture.uScale = 30;
            groundMat.diffuseTexture.vScale = 30;
            groundMat.specularTexture = new BABYLON.Texture("textures/sampie.jpeg", scene);
            ground.material = groundMat; //Place the material property of the ground
           




    var water = new BABYLON.WaterMaterial("water", scene);
    water.bumpTexture = new BABYLON.Texture("textures/waterbump.png", scene);



    // Water properties
    water.windForce = -15;
    water.waveHeight = 0.1;
    water.windDirection = new BABYLON.Vector2(1, 1);
    water.waterColor = new BABYLON.Color3(0.1, 0.1, 0.6);
    water.colorBlendFactor = 0.1;
    water.bumpHeight = 0.3;
    water.waveLength = 0.15;


    // Add skybox and ground to the reflection and refraction
    water.addToRenderList(skybox);
    
    const shadowGenerator = new BABYLON.ShadowGenerator(1024, light1);
    shadowGenerator.useBlurExponentialShadowMap = true;
    shadowGenerator.addShadowCaster(cleaner);

    const shadowGenerator2 = new BABYLON.ShadowGenerator(1024, light2);
    shadowGenerator2.useBlurExponentialShadowMap = true;
    shadowGenerator2.addShadowCaster(cleaner);
    shadowGenerator2.setDarkness(0.9);


            var fountainb = new BABYLON.StandardMaterial("fountainb", scene);
            
            fountainb.diffuseTexture = new BABYLON.Texture("textures/arm.jpg", scene);
            
            fountainb.specularTexture = new BABYLON.Texture("textures/arm.jpg", scene)
           
            
            //base fontana
            const sphere = BABYLON.MeshBuilder.CreateCylinder("sphere", {height:6,diameterTop:30.0,diameterBottom:30.0, tessellation: 8});
            sphere.position.x=-2500;
            sphere.position.z=0;
            sphere.position.y=-80;
            sphere.material=fountainb;
            sphere.checkCollisions = true;

            

            const sphere1 = BABYLON.MeshBuilder.CreateCylinder("sphere1", {height:10.0,diameterTop:10.0,diameterBottom:10.0});
            sphere1.position.x=-2500;
            sphere1.position.z=0;
            sphere1.position.y=-75;
            sphere1.material=fountainb;
            sphere1.checkCollisions = true;

            //cerchio largo

            var torusf = BABYLON.Mesh.CreateTorus("torus", 200, 10, 20, scene);
            torusf.position = new BABYLON.Vector3(-2500, -65, 0);
            torusf.material=fountainb;
            torusf.checkCollisions = true;

            

            //base cerchio largo
            const sphere2 = BABYLON.MeshBuilder.CreateSphere("sphere2", {slice: 0.25, diameterX:280.0, diameterZ:280, diameterY:0, sideOrientation: BABYLON.Mesh.DOUBLESIDE});
            sphere2.position.x=-2500;
            sphere2.position.z=0;
            sphere2.position.y=-68;
            sphere2.material=water;
            sphere2.checkCollisions = true;

            //alzata 2
            const sphere3 = BABYLON.MeshBuilder.CreateCylinder("sphere3", {height:40.0,diameterTop:0.0,diameterBottom:10.0});
            sphere3.position.x=-2500;
            sphere3.position.z=0;
            sphere3.position.y=-60;
            sphere3.material=fountainb;
            sphere3.checkCollisions = true;

            //cerchio medio

            var torusf2 = BABYLON.Mesh.CreateTorus("torus", 100, 10, 20, scene);
            torusf2.position = new BABYLON.Vector3(-2500, -50, 0);
            torusf2.material=fountainb;
            torusf2.checkCollisions = true;

            

            //base cerchio medio
            const sphere4 = BABYLON.MeshBuilder.CreateSphere("sphere4", {slice: 0.25, diameterX:120.0, diameterZ:120, diameterY:0, sideOrientation: BABYLON.Mesh.DOUBLESIDE});
            sphere4.position.x=-2500;
            sphere4.position.z=0;
            sphere4.position.y=-50;
            sphere4.material=water;
            sphere4.checkCollisions = true;

           
            
            // Create a particle system
            var particleSystem = new BABYLON.ParticleSystem("particles", 100000, scene);
        
            //Texture of each particle
            particleSystem.particleTexture = new BABYLON.Texture("textures/flare.png", scene);
        
            // Where the particles come from
            //particleSystem.emitter = new BABYLON.Vector3(0, 10, 0); // the starting object, the emitter
            particleSystem.emitter = new BABYLON.Vector3(-2500,-40, 0); 
            particleSystem.minEmitBox = new BABYLON.Vector3(-1, 0, 0); // Starting all from
            particleSystem.maxEmitBox = new BABYLON.Vector3(1, 0, 0); // To...
        
            // Colors of all particles
            particleSystem.color1 = new BABYLON.Color4(0.7, 0.8, 1.0, 1.0);
            particleSystem.color2 = new BABYLON.Color4(0.2, 0.5, 1.0, 1.0);
            particleSystem.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.0);
        
            // Size of each particle (random between...
            particleSystem.minSize = 0.1;
            particleSystem.maxSize = 0.5;
        
            // Life time of each particle (random between...
            particleSystem.minLifeTime = 2;
            particleSystem.maxLifeTime = 3.5;
        
            // Emission rate
            particleSystem.emitRate = 2500;
        
            // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
            particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        
            // Set the gravity of all particles
            particleSystem.gravity = new BABYLON.Vector3(0, -9.81, 0);
        
            // Direction of each particle after it has been emitted
            particleSystem.direction1 = new BABYLON.Vector3(-2, 8, 2);
            particleSystem.direction2 = new BABYLON.Vector3(2, 8, -2);
        
            // Angular speed, in radians
            particleSystem.minAngularSpeed = 0;
            particleSystem.maxAngularSpeed = Math.PI;
        
            // Speed
            particleSystem.minEmitPower = 1;
            particleSystem.maxEmitPower = 3;
            particleSystem.updateSpeed = 0.025;

        
            // Start the particle system
            particleSystem.start();

            //sphere management  
            
            var blueMat = new BABYLON.StandardMaterial("blueMat", scene);
            //blueMat.diffuseColor = new BABYLON.Color3.Blue();
            blueMat.diffuseTexture = new BABYLON.Texture("textures/inquinamento.jpg", scene);
            blueMat.specularTexture = new BABYLON.Texture("textures/inquinamento.jpg", scene);

            var redMat = new BABYLON.StandardMaterial("redMat", scene);
            //redMat.diffuseColor = new BABYLON.Color3.Red();
            redMat.diffuseTexture = new BABYLON.Texture("textures/mare.jpg", scene);
            redMat.specularTexture = new BABYLON.Texture("textures/mare.jpg", scene);

            var greenMat = new BABYLON.StandardMaterial("blueMat", scene);
            greenMat.diffuseTexture = new BABYLON.Texture("textures/inq3.jpg", scene);
            greenMat.specularTexture = new BABYLON.Texture("textures/inq3.jpg", scene);

            var inq15Mat = new BABYLON.StandardMaterial("i15Mat", scene);
            inq15Mat.diffuseTexture = new BABYLON.Texture("textures/inq3.jpg", scene);
            inq15Mat.specularTexture = new BABYLON.Texture("textures/inq3.jpg", scene);

            var inq18Mat = new BABYLON.StandardMaterial("i18Mat", scene);
            inq18Mat.diffuseTexture = new BABYLON.Texture("textures/inq5.jpg", scene);
            inq18Mat.specularTexture = new BABYLON.Texture("textures/inq5.jpg", scene);

            var inq20Mat = new BABYLON.StandardMaterial("i20Mat", scene);
            inq20Mat.diffuseTexture = new BABYLON.Texture("textures/inq6.jpg", scene);
            inq20Mat.specularTexture = new BABYLON.Texture("textures/inq6.jpg", scene);
             
       
            var sphere10 = BABYLON.Mesh.CreateSphere("sphere10", 10, 40, scene);
            sphere10.position = new BABYLON.Vector3(-1880, 0, 350);

            sphere10.updateFacetData();
            var positions = sphere10.getFacetLocalPositions();
            var normals = sphere10.getFacetLocalNormals();

            var lines = [];
            for (var i = 0; i < positions.length; i++) {
                var line = [ positions[i], positions[i].add(normals[i]) ];
                lines.push(line);
            }
            var lineSystem = BABYLON.MeshBuilder.CreateLineSystem("ls", {lines: lines}, scene);
            lineSystem.color = BABYLON.Color3.Green();
            lineSystem.parent=sphere10;
            sphere10.material=blueMat;

            sphere12 = sphere10.clone("sphere12");
            sphere12.position.z = 900;
            sphere12.material=redMat;

             //plastic
             var sphere11 = BABYLON.Mesh.CreateSphere("sphere11", 10, 40, scene);
             sphere11.position = new BABYLON.Vector3(-1400, -10, 600);

             sphere11.updateFacetData();
             var positions11 = sphere11.getFacetLocalPositions();
             var normals11 = sphere11.getFacetLocalNormals();

            var lines11 = [];
            for (var i = 0; i < positions11.length; i++) {
                var line11 = [ positions11[i], positions11[i].add(normals11[i]) ];
                lines11.push(line11);
            }
            var lineSystem11 = BABYLON.MeshBuilder.CreateLineSystem("ls", {lines: lines11}, scene);
            lineSystem11.color = BABYLON.Color3.Red();
            lineSystem11.parent=sphere11;
             
             
             sphere11.material=greenMat;

             var sphere14 = BABYLON.Mesh.CreateSphere("sphere11", 10, 40, scene);

             sphere14.position = new BABYLON.Vector3(-2500, -50, -1000);

             sphere14.updateFacetData();
             var positions14 = sphere14.getFacetLocalPositions();
             var normals14 = sphere14.getFacetLocalNormals();

            var lines14 = [];
            for (var i = 0; i < positions11.length; i++) {
                var line14 = [ positions14[i], positions14[i].add(normals14[i]) ];
                lines14.push(line14);
            }
            var lineSystem14 = BABYLON.MeshBuilder.CreateLineSystem("ls", {lines: lines14}, scene);
            lineSystem14.color = BABYLON.Color3.White();
            lineSystem14.parent=sphere14;
             
             
            sphere14.material=greenMat;

            sphere15 = sphere14.clone("sphere15");
            sphere15.position = new BABYLON.Vector3(-1800, -50, -1100);
            sphere15.material=inq15Mat;

            sphere16 = sphere11.clone("sphere16");
            sphere16.position = new BABYLON.Vector3(-1700, 0, -500);
            sphere16.material=redMat;

            if (difficulty == 1) {
                var sphere18 = BABYLON.Mesh.CreateSphere("sphere18", 10, 40, scene);
                sphere18.position = new BABYLON.Vector3(-1900, -10, -500);
            

                sphere18.updateFacetData();
                var positions18 = sphere18.getFacetLocalPositions();
                var normals18 = sphere18.getFacetLocalNormals();

                var lines18 = [];
                for (var i = 0; i < positions18.length; i++) {
                    var line18 = [ positions18[i], positions18[i].add(normals18[i]) ];
                    lines18.push(line18);
                }
                var lineSystem18 = BABYLON.MeshBuilder.CreateLineSystem("ls", {lines: lines18}, scene);
                lineSystem18.color = BABYLON.Color3.Teal();
                lineSystem18.parent=sphere18;
                sphere18.material=inq18Mat;

                sphere19 = sphere18.clone("sphere19");
                sphere19.position = new BABYLON.Vector3(-1600, -20, -1000);
                sphere19.material=inq18Mat;


            } else if (difficulty == 2) {

                var sphere18 = BABYLON.Mesh.CreateSphere("sphere18", 10, 40, scene);
                sphere18.position = new BABYLON.Vector3(-1900, -10, -1000);
            

                sphere18.updateFacetData();
                var positions18 = sphere18.getFacetLocalPositions();
                var normals18 = sphere18.getFacetLocalNormals();

                var lines18 = [];
                for (var i = 0; i < positions18.length; i++) {
                    var line18 = [ positions18[i], positions18[i].add(normals18[i]) ];
                    lines18.push(line18);
                }
                var lineSystem18 = BABYLON.MeshBuilder.CreateLineSystem("ls", {lines: lines18}, scene);
                lineSystem18.color = BABYLON.Color3.Teal();
                lineSystem18.parent=sphere18;
                sphere18.material=inq18Mat;

                sphere19 = sphere18.clone("sphere19");
                sphere19.position = new BABYLON.Vector3(-1600, -20, -1000);
                sphere19.material=inq18Mat;

                var sphere20 = BABYLON.Mesh.CreateSphere("sphere20", 10, 40, scene);
                sphere20.position = new BABYLON.Vector3(-1900, -10, 900);
            

                sphere20.updateFacetData();
                var positions20 = sphere20.getFacetLocalPositions();
                var normals20 = sphere20.getFacetLocalNormals();

                var lines20 = [];
                for (var i = 0; i < positions20.length; i++) {
                    var line20 = [ positions20[i], positions20[i].add(normals20[i]) ];
                    lines20.push(line20);
                }
                var lineSystem20 = BABYLON.MeshBuilder.CreateLineSystem("ls", {lines: lines20}, scene);
                lineSystem20.color = BABYLON.Color3.Yellow();
                lineSystem20.parent=sphere20;
                sphere20.material=inq20Mat;

                sphere21 = sphere20.clone("sphere21");
                sphere21.position = new BABYLON.Vector3(-2800, -20, 0);
                sphere21.material=inq20Mat;

            }

        
            scene.enablePhysics();
        
            sphere10.physicsImpostor = new BABYLON.PhysicsImpostor(sphere10, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
           
            sphere11.physicsImpostor = new BABYLON.PhysicsImpostor(sphere11, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
            sphere12.physicsImpostor = new BABYLON.PhysicsImpostor(sphere12, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
            sphere14.physicsImpostor = new BABYLON.PhysicsImpostor(sphere14, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
            sphere15.physicsImpostor = new BABYLON.PhysicsImpostor(sphere15, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
            sphere16.physicsImpostor = new BABYLON.PhysicsImpostor(sphere16, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
            if (difficulty == 1) {
                sphere18.physicsImpostor = new BABYLON.PhysicsImpostor(sphere18, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
                sphere19.physicsImpostor = new BABYLON.PhysicsImpostor(sphere19, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
            } else if (difficulty == 2) {
                sphere18.physicsImpostor = new BABYLON.PhysicsImpostor(sphere18, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
                sphere19.physicsImpostor = new BABYLON.PhysicsImpostor(sphere19, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
                sphere20.physicsImpostor = new BABYLON.PhysicsImpostor(sphere20, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
                sphere21.physicsImpostor = new BABYLON.PhysicsImpostor(sphere21, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
            }
            
            ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, scene);
            
            scene.registerBeforeRender(function () {
                sphere10.translate(BABYLON.Axis.Z, 0.2, BABYLON.Space.LOCAL);
                var enemyDir = sphere10.getAbsolutePosition().subtract(cleaner.getAbsolutePosition());
                enemyDir.y = cleaner.getDirection(new BABYLON.Vector3(0, 0, 1)).y;
                enemyDir.z = -enemyDir.z;
                enemyDir.x = -enemyDir.x;
                sphere10.setDirection(enemyDir);
                sphere10.rotate(enemyDir, sphspeed);
                
                sphere11.translate(BABYLON.Axis.Z, 0.2, BABYLON.Space.LOCAL);
                var enemyDir2 = sphere11.getAbsolutePosition().subtract(cleaner.getAbsolutePosition());
                enemyDir2.y = cleaner.getDirection(new BABYLON.Vector3(0, 0, 1)).y;
                enemyDir2.z = -enemyDir2.z;
                enemyDir2.x = -enemyDir2.x;
                sphere11.setDirection(enemyDir2);
                sphere11.rotate(enemyDir2, sphspeed);

                sphere12.translate(BABYLON.Axis.Z, 0.2, BABYLON.Space.LOCAL);
                var enemyDir3 = sphere12.getAbsolutePosition().subtract(cleaner.getAbsolutePosition());
                enemyDir3.y = cleaner.getDirection(new BABYLON.Vector3(0, 0, 1)).y;
                enemyDir3.z = -enemyDir3.z;
                enemyDir3.x = -enemyDir3.x;
                sphere12.setDirection(enemyDir3);
                sphere12.rotate(enemyDir3, sphspeed);

                sphere14.translate(BABYLON.Axis.Z, 0.2, BABYLON.Space.LOCAL);
                var enemyDir4 = sphere14.getAbsolutePosition().subtract(cleaner.getAbsolutePosition());
                enemyDir4.y = cleaner.getDirection(new BABYLON.Vector3(0, 0, 1)).y;
                enemyDir4.z = -enemyDir4.z;
                enemyDir4.x = -enemyDir4.x;
                sphere14.setDirection(enemyDir4);
                sphere14.rotate(enemyDir4, sphspeed);

                sphere15.translate(BABYLON.Axis.Z, 0.2, BABYLON.Space.LOCAL);
                var enemyDir5 = sphere15.getAbsolutePosition().subtract(cleaner.getAbsolutePosition());
                enemyDir5.y = cleaner.getDirection(new BABYLON.Vector3(0, 0, 1)).y;
                enemyDir5.z = -enemyDir5.z;
                enemyDir5.x = -enemyDir5.x;
                sphere15.setDirection(enemyDir5);
                sphere15.rotate(enemyDir5, sphspeed);

                sphere16.translate(BABYLON.Axis.Z, 0.2, BABYLON.Space.LOCAL);
                var enemyDir6 = sphere16.getAbsolutePosition().subtract(cleaner.getAbsolutePosition());
                enemyDir6.y = cleaner.getDirection(new BABYLON.Vector3(0, 0, 1)).y;
                enemyDir6.z = -enemyDir6.z;
                enemyDir6.x = -enemyDir6.x;
                sphere16.setDirection(enemyDir6);
                sphere16.rotate(enemyDir6, sphspeed);


                if (difficulty == 1) {  

                sphere18.translate(BABYLON.Axis.Z, 0.2, BABYLON.Space.LOCAL);
                var enemyDir7 = sphere18.getAbsolutePosition().subtract(cleaner.getAbsolutePosition());
                enemyDir7.y = cleaner.getDirection(new BABYLON.Vector3(0, 0, 1)).y;
                enemyDir7.z = -enemyDir7.z;
                enemyDir7.x = -enemyDir7.x;
                sphere18.setDirection(enemyDir7);
                sphere18.rotate(enemyDir7, sphspeed);

                sphere19.translate(BABYLON.Axis.Z, 0.2, BABYLON.Space.LOCAL);
                var enemyDir8 = sphere19.getAbsolutePosition().subtract(cleaner.getAbsolutePosition());
                enemyDir8.y = cleaner.getDirection(new BABYLON.Vector3(0, 0, 1)).y;
                enemyDir8.z = -enemyDir8.z;
                enemyDir8.x = -enemyDir8.x;
                sphere19.setDirection(enemyDir8);
                sphere19.rotate(enemyDir8, sphspeed);

                } else if (difficulty == 2) {
                sphere18.translate(BABYLON.Axis.Z, 0.2, BABYLON.Space.LOCAL);
                var enemyDir7 = sphere18.getAbsolutePosition().subtract(cleaner.getAbsolutePosition());
                enemyDir7.y = cleaner.getDirection(new BABYLON.Vector3(0, 0, 1)).y;
                enemyDir7.z = -enemyDir7.z;
                enemyDir7.x = -enemyDir7.x;
                sphere18.setDirection(enemyDir7);
                sphere18.rotate(enemyDir7, sphspeed);

                sphere19.translate(BABYLON.Axis.Z, 0.2, BABYLON.Space.LOCAL);
                var enemyDir8 = sphere19.getAbsolutePosition().subtract(cleaner.getAbsolutePosition());
                enemyDir8.y = cleaner.getDirection(new BABYLON.Vector3(0, 0, 1)).y;
                enemyDir8.z = -enemyDir8.z;
                enemyDir8.x = -enemyDir8.x;
                sphere19.setDirection(enemyDir8);
                sphere19.rotate(enemyDir8, sphspeed);

                sphere20.translate(BABYLON.Axis.Z, 0.2, BABYLON.Space.LOCAL);
                var enemyDir10 = sphere20.getAbsolutePosition().subtract(cleaner.getAbsolutePosition());
                enemyDir10.y = cleaner.getDirection(new BABYLON.Vector3(0, 0, 1)).y;
                enemyDir10.z = -enemyDir10.z;
                enemyDir10.x = -enemyDir10.x;
                sphere20.setDirection(enemyDir8);
                sphere20.rotate(enemyDir10, sphspeed);

                sphere21.translate(BABYLON.Axis.Z, 0.2, BABYLON.Space.LOCAL);
                var enemyDir9 = sphere21.getAbsolutePosition().subtract(cleaner.getAbsolutePosition());
                enemyDir9.y = cleaner.getDirection(new BABYLON.Vector3(0, 0, 1)).y;
                enemyDir9.z = -enemyDir9.z;
                enemyDir9.x = -enemyDir9.x;
                sphere21.setDirection(enemyDir9);
                sphere21.rotate(enemyDir9, sphspeed);

                } 



                const spheIntervaId = setInterval(()=>{
			
                    if(!boolgameend){

                        if ((difficulty == 0) &&  ((sphere10.intersectsMesh(cleaner,false)) || (sphere11.intersectsMesh(cleaner,false)) || (sphere12.intersectsMesh(cleaner,false)) || (sphere14.intersectsMesh(cleaner,false)) || (sphere15.intersectsMesh(cleaner,false)) || (sphere16.intersectsMesh(cleaner,false)))) {
                        
                            
                                boolgameend = true;
                                clicks=0;
                                changescene = 4;
                                currentLevel=1;
                                difficulty=1;
                                sphspeed=0.4;
                                gameoverscenevar = createGameOverscene();
                                
                        } else if ((difficulty == 1) && ((sphere10.intersectsMesh(cleaner,false)) || (sphere11.intersectsMesh(cleaner,false)) || (sphere12.intersectsMesh(cleaner,false)) || (sphere14.intersectsMesh(cleaner,false)) || (sphere15.intersectsMesh(cleaner,false)) || (sphere16.intersectsMesh(cleaner,false)) || (sphere18.intersectsMesh(cleaner,false)) || (sphere19.intersectsMesh(cleaner,false)))) {
                            boolgameend = true;
                            clicks=0;
                            changescene = 4;
                            currentLevel=1;
                            difficulty=1;
                            sphspeed=0.4;
                            gameoverscenevar = createGameOverscene();
                        } else if ((difficulty == 2) && ((sphere10.intersectsMesh(cleaner,false)) || (sphere11.intersectsMesh(cleaner,false)) || (sphere12.intersectsMesh(cleaner,false)) || (sphere14.intersectsMesh(cleaner,false)) || (sphere15.intersectsMesh(cleaner,false)) || (sphere16.intersectsMesh(cleaner,false)) || (sphere18.intersectsMesh(cleaner,false)) || (sphere19.intersectsMesh(cleaner,false)) || (sphere20.intersectsMesh(cleaner,false)) || (sphere21.intersectsMesh(cleaner,false)))) {
                            boolgameend = true;
                            clicks=0;
                            changescene = 4;
                            currentLevel=1;
                            difficulty=1;
                            sphspeed=0.4; 
                            gameoverscenevar = createGameOverscene();
                        }
                        
                    }else if(boolgameend){
                        clearInterval(spheIntervaId);
                    }
        
                },15)	
                
               
            });



        // material church

        var churchMaterial = new BABYLON.StandardMaterial("churchMat", scene);
        churchMaterial.diffuseTexture = new BABYLON.Texture("textures/ground.jpg", scene);
        churchMaterial.specularTexture = new BABYLON.Texture("textures/ground.jpg", scene);

        // material roof church
        var roofchurch = new BABYLON.StandardMaterial("roofchurch", scene);
        roofchurch.diffuseTexture = new BABYLON.Texture("https://assets.babylonjs.com/environments/roof.jpg");

        //material cylinder
        var cylMaterial = new BABYLON.StandardMaterial("cylMat", scene);
        cylMaterial.diffuseTexture = new BABYLON.Texture("textures/arm.jpg", scene);
        cylMaterial.specularTexture = new BABYLON.Texture("textures/arm.jpg", scene);

        //material door church
        var doorMaterial = new BABYLON.StandardMaterial("doorMat", scene);
        doorMaterial.diffuseTexture = new BABYLON.Texture("textures/legno3.jpg", scene);
        doorMaterial.specularTexture = new BABYLON.Texture("textures/legno3.jpg", scene);

        //material triangle
        var triMaterial = new BABYLON.StandardMaterial("triMat", scene);
        triMaterial.diffuseTexture = new BABYLON.Texture("textures/casa.jpg", scene);
        triMaterial.specularTexture = new BABYLON.Texture("textures/casa.jpg", scene);

        //material column
        var colMaterial = new BABYLON.StandardMaterial("colMat", scene);
        colMaterial.diffuseColor=new BABYLON.Color3.White(); 
       
        //base chiesa 1
        var church1 = BABYLON.MeshBuilder.CreateBox("church1", { size: 300, height: 300, wrap: true }, scene);
        church1.position=new BABYLON.Vector3(-900, 5, 600);
        church1.material=churchMaterial;
        church1.checkCollisions=true;
        church1.scaling = new BABYLON.Vector3(1.1,1.1,1.1);

        //cilindro su base chiesa 1
        var topChurch1 = BABYLON.MeshBuilder.CreateCylinder("topchurch1", {diameterTop:200,diameterBottom: 200, height: 50}, scene);
        
        topChurch1.position = new BABYLON.Vector3(-900, 195, 600);
        topChurch1.material=cylMaterial;
        topChurch1.scaling = new BABYLON.Vector3(1.1,1.1,1.1);

        // tetto su cilindro
        const roofchu1 = BABYLON.MeshBuilder.CreateSphere("roofchu1", {slice: 0.4, diameter: 200, sideOrientation: BABYLON.Mesh.DOUBLESIDE});
        roofchu1.position = new BABYLON.Vector3(-900, 190, 600);
        roofchu1.material=roofchurch;
        roofchu1.scaling = new BABYLON.Vector3(1.1,1.1,1.1);

        // triangolo su chiesa
        var triChurch1 = BABYLON.MeshBuilder.CreateCylinder("trichurch1", {diameter:150, height: 5,width: 150, tessellation:3}, scene);
        triChurch1.position = new BABYLON.Vector3(-1080, 46, 600);
        triChurch1.rotation.z = Math.PI / 2;
        triChurch1.material=triMaterial;
        triChurch1.scaling = new BABYLON.Vector3(1.1,1.1,1.1);

        // porta chiesa
        var church1D = BABYLON.MeshBuilder.CreateBox("church1", { size: 60}, scene);
        church1D.position=new BABYLON.Vector3(-1040, -60, 600);
        church1D.material=doorMaterial;
        church1D.scaling = new BABYLON.Vector3(1.1,1.1,1.1);

        // colonne
        var leftcol1 = BABYLON.MeshBuilder.CreateCylinder("leftcol1", {diameterTop:7, diameterBottom: 7, height: 190, tessellation: 96}, scene);
        leftcol1.position = new BABYLON.Vector3(-1080, -100, 668);
        leftcol1.material=colMaterial;
        leftcol1.scaling = new BABYLON.Vector3(1.1,1.1,1.1);

        var leftcol2 = BABYLON.MeshBuilder.CreateCylinder("leftcol2", {diameterTop:7, diameterBottom: 7, height: 190, tessellation: 96}, scene);
        leftcol2.position = new BABYLON.Vector3(-1080, -100, 650);
        leftcol2.material=colMaterial;
        leftcol2.scaling = new BABYLON.Vector3(1.1,1.1,1.1);

        var rightcol1 = BABYLON.MeshBuilder.CreateCylinder("rightcol1", {diameterTop:7, diameterBottom: 7, height: 190, tessellation: 96}, scene);
        rightcol1.position = new BABYLON.Vector3(-1080, -100, 533);
        rightcol1.material=colMaterial;
        rightcol1.scaling = new BABYLON.Vector3(1.1,1.1,1.1);

        var rightcol2 = BABYLON.MeshBuilder.CreateCylinder("rightcol2", {diameterTop:7, diameterBottom: 7, height: 190, tessellation: 96}, scene);
        rightcol2.position = new BABYLON.Vector3(-1080, -100, 551);
        rightcol2.material=colMaterial;
        rightcol2.scaling = new BABYLON.Vector3(1.1,1.1,1.1);


        //base chiesa 2
        var church2 = BABYLON.MeshBuilder.CreateBox("church2", { size: 300, height: 300, wrap: true }, scene);
        church2.position=new BABYLON.Vector3(-900, 5, -600);
        church2.material=churchMaterial;
        church2.scaling = new BABYLON.Vector3(1.1,1.1,1.1);


        //cilindro su base chiesa 2
        var topChurch2 = BABYLON.MeshBuilder.CreateCylinder("topchurch2", {diameterTop:200,diameterBottom: 200, height: 50}, scene);
        
        topChurch2.position = new BABYLON.Vector3(-900, 195, -600);
        topChurch2.material=cylMaterial;
        topChurch2.scaling = new BABYLON.Vector3(1.1,1.1,1.1);

        // tetto su cilindro
        const roofchu2 = BABYLON.MeshBuilder.CreateSphere("roofchu1", {slice: 0.4, diameter: 200, sideOrientation: BABYLON.Mesh.DOUBLESIDE});
        roofchu2.position = new BABYLON.Vector3(-900, 190, -600);
        roofchu2.material=roofchurch;
        roofchu2.scaling = new BABYLON.Vector3(1.1,1.1,1.1);

        // triangolo su chiesa
        var triChurch2 = BABYLON.MeshBuilder.CreateCylinder("trichurch2", {diameter:150, height: 5,width: 150, tessellation:3}, scene);
        triChurch2.position = new BABYLON.Vector3(-1080, 46, -600);
        triChurch2.rotation.z = Math.PI / 2;
        triChurch2.material=triMaterial;
        triChurch2.scaling = new BABYLON.Vector3(1.1,1.1,1.1);

        // porta chiesa
        var church2D = BABYLON.MeshBuilder.CreateBox("church2", { size: 60}, scene);
        church2D.position=new BABYLON.Vector3(-1040, -60, -600);
        church2D.material=doorMaterial;
        church2D.rotation.z=Math.PI / 2;
        church2D.scaling = new BABYLON.Vector3(1.1,1.1,1.1);
        

        // colonne
        var sleftcol1 = BABYLON.MeshBuilder.CreateCylinder("sleftcol1", {diameterTop:7, diameterBottom: 7, height: 190, tessellation: 96}, scene);
        sleftcol1.position = new BABYLON.Vector3(-1080, -100, -649);
        sleftcol1.material=colMaterial;
        sleftcol1.scaling = new BABYLON.Vector3(1.1,1.1,1.1);

        var sleftcol2 = BABYLON.MeshBuilder.CreateCylinder("sleftcol2", {diameterTop:7, diameterBottom: 7, height: 190, tessellation: 96}, scene);
        sleftcol2.position = new BABYLON.Vector3(-1080, -100, -667);
        sleftcol2.material=colMaterial;
        sleftcol2.scaling = new BABYLON.Vector3(1.1,1.1,1.1);

        var srightcol1 = BABYLON.MeshBuilder.CreateCylinder("srightcol1", {diameterTop:7, diameterBottom: 7, height: 190, tessellation: 96}, scene);
        srightcol1.position = new BABYLON.Vector3(-1080, -100, -529);
        srightcol1.material=colMaterial;
        srightcol1.scaling = new BABYLON.Vector3(1.1,1.1,1.1);

        var srightcol2 = BABYLON.MeshBuilder.CreateCylinder("rightcol2", {diameterTop:7, diameterBottom: 7, height: 190, tessellation: 96}, scene);
        srightcol2.position = new BABYLON.Vector3(-1080, -100, -547);
        srightcol2.material=colMaterial;
        srightcol2.scaling = new BABYLON.Vector3(1.1,1.1,1.1);

        
         //****************** bullet ***************************

        var nextBulletTime = new Date().getTime();
        var currentTime;
        var forward = new BABYLON.Vector3(1, 0, 0);
        var bulletMat = new BABYLON.StandardMaterial("bulletMat", scene);
            bulletMat.diffuseColor = new BABYLON.Color3.Green();
        
        var Bullet = function (bulletsRate, bulletsRange) {

        var direction = cleaner.getDirection(forward);
        direction.normalize();
                 
        const bullet = BABYLON.Mesh.CreateSphere(`${currentTime}bullet`, 16, 2, scene);
    
        bullet.material = bulletMat;	

        nextBulletTime = new Date().getTime() + bulletsRate;
    
        bullet.position = meshShotStartPosition.getAbsolutePosition().clone();
  

        const bulletAction = scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnEveryFrameTrigger, function (evt) {
        bullet.position.addInPlace(direction);
        }));

        sphericLaserShotSound.play();

        setTimeout(()=>{
            scene.actionManager.unregisterAction(bulletAction);
            bullet.dispose();
            clearInterval(bulletIntervaId);
        }, (bulletsRange/(engine.getFps()/65)))

        const bulletIntervaId = setInterval(()=>{
            
            
            if (bullet.intersectsMesh(sphere10,false) && (!hits10)) {
                sphere10.dispose();
                hits10=true;
                bullet.dispose();
                clearInterval(bulletIntervaId);
                counter +=1; 

            } else if (bullet.intersectsMesh(sphere11,false) && (!hits11)) {
                sphere11.dispose();
                hits11=true;
                bullet.dispose();
                clearInterval(bulletIntervaId);
                counter +=1;

            } else if (bullet.intersectsMesh(sphere12,false) && (!hits12)) {
                sphere12.dispose();
                hits12=true;
                bullet.dispose();
                clearInterval(bulletIntervaId);
                counter +=1;

            } else if (bullet.intersectsMesh(sphere14,false) && (!hits14)) {
                sphere14.dispose();
                hits14=true;
                bullet.dispose();
                clearInterval(bulletIntervaId);
                counter +=1;

            } else if (bullet.intersectsMesh(sphere15,false) && (!hits15)) {
                sphere15.dispose();
                hits15=true;
                bullet.dispose();
                clearInterval(bulletIntervaId);
                counter +=1;

            } else if (bullet.intersectsMesh(sphere16,false) && (!hits16)) {
                sphere16.dispose();
                hits16=true;
                bullet.dispose();
                clearInterval(bulletIntervaId);
                counter +=1;

            } 
            
            if (difficulty == 1 || difficulty == 2) {
                if (bullet.intersectsMesh(sphere18,false) && (!hits18)) {
                    sphere18.dispose();
                    hits18=true;
                    bullet.dispose();
                    clearInterval(bulletIntervaId);
                    counter +=1;
                } else if (bullet.intersectsMesh(sphere19,false) && (!hits19)) {
                    sphere19.dispose();
                    hits19=true;
                    bullet.dispose();
                    clearInterval(bulletIntervaId);
                    counter +=1;
                }
            }

            if (difficulty == 2) { 
                if (bullet.intersectsMesh(sphere20,false) && (!hits20)) {
                    sphere20.dispose();
                    hits20=true;
                    bullet.dispose();
                    clearInterval(bulletIntervaId);
                    counter +=1;
                } else if (bullet.intersectsMesh(sphere21,false) && (!hits21)) {
                    sphere21.dispose();
                    hits21=true;
                    bullet.dispose();
                    clearInterval(bulletIntervaId);
                    counter +=1;
                }

            }
            
        
            if ((currentLevel==1) && (counter == winCountLVL1)) { 
                levelup.play();
                advancedTexture.addControl(imagelevel, 0, 0);
                bullet.material = yellowMat;
                currentLevel =2;
                sphspeed += 0.3;
                
                    
                
                setTimeout(function(){

                  

                    advancedTexture.removeControl(imagelevel, 0, 0);
                    nextscene = createScene();
                    changescene = 1;

                }, 4000);
                
                
            } else if ((currentLevel==2) && (counter == winCountLVL2)) { 
                    
               

                boolgameend = true;
                clicks=0;
                currentLevel=1;

                winningScenevar = createwinScene();
                changescene = 5;
                counter=1;   

         
                
                
            } 
        

        },10)


}   


var imagelevel = new BABYLON.GUI.Image("levelup", "textures/index.png");
		imagelevel.position = new BABYLON.Vector3(0, 4,0);
		imagelevel.scaling = new BABYLON.Vector3(0.01,0.01,0.01);
		imagelevel.width = "384px";
		imagelevel.height = "120px";
		imagelevel.populateNinePatchSlicesFromImage = true;
		imagelevel.bottom = "100px";
		imagelevel.top = "-120px";


        //build houses
        const house1 = buildHouse(-900,10,-1300) ;
        house1.checkCollisions=true;
        const house2 = buildHouse(-900,5,1300) ;
        house2.checkCollisions=true;

        
        
        //******************************build lamps*******************************++
        
        const lampLight = new BABYLON.SpotLight("lampLight", BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, -1, 0), Math.PI, 1, scene);
        lampLight.diffuse = BABYLON.Color3.Yellow();

        const yellowMat = new BABYLON.StandardMaterial("yellowMat");
        yellowMat.emissiveColor = BABYLON.Color3.Yellow();
        yellowMat.maxSimultaneousLights = 5;

        var bulletMaterialSphere = new BABYLON.StandardMaterial("bulletMaterial", scene);
        bulletMaterialSphere.emissiveColor = BABYLON.Color3.Teal();

        //lamp2
        const lampanch2 = BABYLON.MeshBuilder.CreateSphere("lampanch2", {slice: 0.4, diameter: 35, sideOrientation: BABYLON.Mesh.DOUBLESIDE});
        lampanch2.position = new BABYLON.Vector3(-1110, 18, 750);

        var bulb2 = BABYLON.Mesh.CreateSphere("bulb2", 10, 30, scene);
        bulb2.position = new BABYLON.Vector3(-1110, 18, 750);  
        bulb2.material = yellowMat;
        lampLight.parent = bulb2;
        var lamp2shape = BABYLON.MeshBuilder.CreateCylinder("shape2", {diameterTop:6, diameterBottom: 7, height: 230, tessellation: 96}, scene);
        lamp2shape.position = new BABYLON.Vector3(-1110, -80, 750);


        
        
        
        //lamp4
        const lampLight4 = new BABYLON.SpotLight("lampLight", BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, -1, 0), Math.PI, 1, scene);
        lampLight4.diffuse = BABYLON.Color3.Yellow();
        const lampanch4 = BABYLON.MeshBuilder.CreateSphere("lampanch4", {slice: 0.4, diameter: 35, sideOrientation: BABYLON.Mesh.DOUBLESIDE});
        lampanch4.position = new BABYLON.Vector3(-1110, 18, -400);

        var bulb4 = BABYLON.Mesh.CreateSphere("bulb3", 10, 30, scene);
        bulb4.position = new BABYLON.Vector3(-1110, 18, -400);
        bulb4.material = yellowMat;
        lampLight4.parent = bulb4;
        var lamp4shape = BABYLON.MeshBuilder.CreateCylinder("shape4", {diameterTop:6, diameterBottom: 7, height: 230, tessellation: 96}, scene);
        lamp4shape.position = new BABYLON.Vector3(-1110, -80, -400);

        
        
        var treeMaterial = new BABYLON.StandardMaterial("treeMat", scene);
        treeMaterial.diffuseTexture = new BABYLON.Texture("textures/cespuglio.png", scene);
        treeMaterial.specularTexture = new BABYLON.Texture("textures/cespuglio.png", scene); 
        
        var trunkMaterial = new BABYLON.StandardMaterial("trunkMat", scene);
        trunkMaterial.diffuseTexture = new BABYLON.Texture("textures/legno3.jpg", scene);
        trunkMaterial.specularTexture = new BABYLON.Texture("textures/legno3.jpg", scene);    
        for(j=0; j<2; j++){
            
            const px=-1500;
            const py= 200;
            var pz;

            pz= 1600-(j*3200);

            for(i=0; i<8; i++){

                const tree1 = BABYLON.MeshBuilder.CreateCylinder("tree1", {diameter:250, height: 25,width: 250, tessellation:3}, scene);
                tree1.position = new BABYLON.Vector3(px-(i*260), py, pz);
                tree1.rotation.z = Math.PI / 2;
                tree1.rotation.y = Math.PI / 2;
                tree1.material = treeMaterial;
                
                
                const tree2 = BABYLON.MeshBuilder.CreateCylinder("tree2", {diameter:300, height: 25,width: 300, tessellation:3}, scene);
                tree2.position = new BABYLON.Vector3(px-(i*260), py-70, pz);
                tree2.rotation.z = Math.PI / 2;
                tree2.rotation.y = Math.PI / 2;
                tree2.material = treeMaterial;
                
            
            
                var tree3 = BABYLON.MeshBuilder.CreateCylinder("tree3", {diameter:350, height: 25,width: 350, tessellation:3}, scene);
                tree3.position = new BABYLON.Vector3(px-(i*260), py-140, pz);
                tree3.rotation.z = Math.PI / 2;
                tree3.rotation.y = Math.PI / 2;
                tree3.material = treeMaterial;
            
            
            
                var tree4 = BABYLON.MeshBuilder.CreateCylinder("tree4", {diameter:250, height: 25,width: 250, tessellation:3}, scene);
                tree4.position = new BABYLON.Vector3(px-(i*260), py, pz);
                tree4.rotation.z = Math.PI / 2;
                tree4.material = treeMaterial;
            
            
            
                var tree5 = BABYLON.MeshBuilder.CreateCylinder("tree5", {diameter:300, height: 25,width: 300, tessellation:3}, scene);
                tree5.position = new BABYLON.Vector3(px-(i*260), py-70, pz);
                tree5.rotation.z = Math.PI / 2;
                tree5.material = treeMaterial;
            
            
            
                var tree6 = BABYLON.MeshBuilder.CreateCylinder("tree6", {diameter:350, height: 25,width: 350, tessellation:3}, scene);
                tree6.position = new BABYLON.Vector3(px-(i*260), py-140, pz);
                tree6.rotation.z = Math.PI / 2;
                tree6.material = treeMaterial;
                

                
                

            }
        }

        var trunk1 = BABYLON.MeshBuilder.CreateCylinder("trunk1", {diameterTop:20, diameterBottom: 30, height: 110, tessellation: 96}, scene);
                trunk1.material=trunkMaterial;
                trunk1.position = new BABYLON.Vector3(-1500, -70, 1600);

                trunk2 = trunk1.clone("trunk2");
                trunk2.position.x = -1760;

                trunk3 = trunk1.clone("trunk3");
                trunk3.position.x = -2020;

                trunk4 = trunk1.clone("trunk4");
                trunk4.position.x = -2280;

                trunk5 = trunk1.clone("trunk5");
                trunk5.position.x = -2540;

                trunk6 = trunk1.clone("trunk6");
                trunk6.position.x = -2800;

                trunk7 = trunk1.clone("trunk7");
                trunk7.position.x = -3060;

                trunk8 = trunk1.clone("trunk8");
                trunk8.position.x = -3320;

                trunk9 = trunk1.clone("trunk9");
                trunk9.position.z = -1600;

                trunk10 = trunk1.clone("trunk10");
                trunk10.position.z = -1600;
                trunk10.position.x = -1760;

                trunk11 = trunk1.clone("trunk11");
                trunk11.position.z = -1600;
                trunk11.position.x = -2020;

                trunk12 = trunk1.clone("trunk12");
                trunk12.position.z = -1600;
                trunk12.position.x = -2280;

                trunk13 = trunk1.clone("trunk13");
                trunk13.position.z = -1600;
                trunk13.position.x = -2540;

                trunk14 = trunk1.clone("trunk14");
                trunk14.position.z = -1600;
                trunk14.position.x = -2800;

                trunk15 = trunk1.clone("trunk15");
                trunk15.position.z = -1600;
                trunk15.position.x = -3060;

                trunk16 = trunk1.clone("trunk16");
                trunk16.position.z = -1600;
                trunk16.position.x = -3320;





                
        
        
        
        
        
      

            pz = 1500

            var pic0Mat = new BABYLON.StandardMaterial("pic0Mat", scene);
                pic0Mat.diffuseTexture = new BABYLON.Texture("textures/mare.jpg", scene);
                pic0Mat.specularTexture = new BABYLON.Texture("textures/mare.jpg", scene); 
            var pic0 = BABYLON.MeshBuilder.CreateBox("pic0",{ height: 75, width: 150, depth: 20}, scene);
            pic0.position = new BABYLON.Vector3(-1700, -70, pz);
            
            pic0.material = pic0Mat;

            pic7 = pic0.clone("pic7");
            pic7.position.z = -1500;
            pic7.rotation.y = Math.PI / 1;
            


            var pic1Mat = new BABYLON.StandardMaterial("pic1Mat", scene);
                pic1Mat.diffuseTexture = new BABYLON.Texture("textures/inquinamento.jpg", scene);
                pic1Mat.specularTexture = new BABYLON.Texture("textures/inquinamento.jpg", scene); 
            var pic1 = BABYLON.MeshBuilder.CreateBox("pic1",{ height: 75, width: 150, depth: 20}, scene);
            pic1.position = new BABYLON.Vector3(-1950, -70, pz);
            
            pic1.material = pic1Mat;

            pic8 = pic1.clone("pic8");
            pic8.position.z = -1500;
            pic8.rotation.y = Math.PI / 1;

            var pic2Mat = new BABYLON.StandardMaterial("pic2Mat", scene);
                pic2Mat.diffuseTexture = new BABYLON.Texture("textures/inq3.jpg", scene);
                pic2Mat.specularTexture = new BABYLON.Texture("textures/inq3.jpg", scene); 
            var pic2 = BABYLON.MeshBuilder.CreateBox("pic2",{ height: 75, width: 150, depth: 20}, scene);
            pic2.position = new BABYLON.Vector3(-2200, -70, pz);
            
        
            pic2.material = pic2Mat;

            pic9 = pic2.clone("pic9");
            pic9.position.z = -1500;
            pic9.rotation.y = Math.PI / 1;

            var pic3Mat = new BABYLON.StandardMaterial("pic3Mat", scene);
                pic3Mat.diffuseTexture = new BABYLON.Texture("textures/inq4.jpg", scene);
                pic3Mat.specularTexture = new BABYLON.Texture("textures/inq4.jpg", scene); 
            var pic3 = BABYLON.MeshBuilder.CreateBox("pic3",{ height: 75, width: 150, depth: 20}, scene);
            pic3.position = new BABYLON.Vector3(-2450, -70, pz);
           
            
            pic3.material = pic3Mat;

            pic10 = pic3.clone("pic10");
            pic10.position.z = -1500;
            pic10.rotation.y = Math.PI / 1;

            var pic4Mat = new BABYLON.StandardMaterial("pic4Mat", scene);
                pic4Mat.diffuseTexture = new BABYLON.Texture("textures/inq5.jpg", scene);
                pic4Mat.specularTexture = new BABYLON.Texture("textures/inq5.jpg", scene); 
            var pic4 = BABYLON.MeshBuilder.CreateBox("pic4",{ height: 75, width: 150, depth: 20}, scene);
            pic4.position = new BABYLON.Vector3(-2700, -70, pz);
            
        
            pic4.material = pic4Mat;

            pic11 = pic4.clone("pic11");
            pic11.position.z = -1500;
            pic11.rotation.y = Math.PI / 1;

            var pic5Mat = new BABYLON.StandardMaterial("pic5Mat", scene);
                pic5Mat.diffuseTexture = new BABYLON.Texture("textures/inq6.jpg", scene);
                pic5Mat.specularTexture = new BABYLON.Texture("textures/inq6.jpg", scene); 
            var pic5 = BABYLON.MeshBuilder.CreateBox("pic5",{ height: 75, width: 150, depth: 20}, scene);
            pic5.position = new BABYLON.Vector3(-2950, -70, pz);
            
            pic5.material = pic5Mat;

            pic12 = pic5.clone("pic12");
            pic12.position.z = -1500;
            pic12.rotation.y = Math.PI / 1;

            var pic6Mat = new BABYLON.StandardMaterial("pic6Mat", scene);
                pic6Mat.diffuseTexture = new BABYLON.Texture("textures/inq7.jpg", scene);
                pic6Mat.specularTexture = new BABYLON.Texture("textures/inq7.jpg", scene); 
            var pic6 = BABYLON.MeshBuilder.CreateBox("pic6",{ height: 75, width: 150, depth: 20}, scene);
            pic6.position = new BABYLON.Vector3(-3200, -70, pz);
    
        
            pic6.material = pic6Mat;

            pic13 = pic6.clone("pic13");
            pic13.position.z = -1500;
            pic13.rotation.y = Math.PI / 1;
        
    
        
        
        
        
        

        var advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    

        var tree = BABYLON.SceneLoader.ImportMesh("","./assets/trees/", "Tree.babylon", scene, function (meshes) {
            var tree = meshes[0];
            tree.scaling = new BABYLON.Vector3(500, 500, 500);
            tree.position = new BABYLON.Vector3(-400, 0, 0);
            tree.material.opacityTexture = null;
            tree.material.backFaceCulling = false;
        
            for(i=0; i < 4; i++){
                for(j = 0; j <= 5; j++){
                    if(i%2==0){
                        var tree2 = tree.createInstance("");
                        tree2.position.x = -400 + (i*150);
                        tree2.position.z = 250 + (j*250);
                        tree2.position.y = -99;
                        var tree3 = tree.createInstance("");
                        tree3.position.x = -400 + (i*240);
                        tree3.position.z = -250 - (j*250);
                        tree3.position.y = -99;
                    }
                    else{
                        var tree2 = tree.createInstance("");
                        tree2.position.x = -400 + (i*150);
                        tree2.position.z = 180 + (j*150);
                        tree2.position.y = -99;
                        var tree3 = tree.createInstance("");
                        tree3.position.x = -400 + (i*240);
                        tree3.position.z = -280 - (j*150);
                        tree3.position.y = -99;
                    }
                }
        
            }

            for(i=0; i < 3; i++){
                for(j = 0; j <= 5; j++){
                    if(j%2==0){
                    
                        var tree3 = tree.createInstance("");
                        tree3.position.x = -50 + (i*300);
                        tree3.position.z = 250 + (j*150);
                        tree3.position.y = -99;
                    }
                    else{
                        
                        var tree3 = tree.createInstance("");
                        tree3.position.x = -50 + (i*180);
                        tree3.position.z = 250 + (j*150);
                        tree3.position.y = -99;
                    }
                }
        
            }

            for(i=0; i < 3; i++){
                for(j = 0; j <= 5; j++){
                    if(j%2==0){
                    
                        var tree3 = tree.createInstance("");
                        tree3.position.x = -350 + (i*300);
                        tree3.position.z = -250 - (j*150);
                        tree3.position.y = -99;
                    }
                    else{
                        
                        var tree3 = tree.createInstance("");
                        tree3.position.x = -350 + (i*180);
                        tree3.position.z = -250 - (j*150);
                        tree3.position.y = -99;
                    }
                }
        
            }
        
            tree.isVisible = false;
            engine.hideLoadingUI();
        });
        
    
        return scene;

    }; // fine createscene


//***************************PLAYING GUI****************************
var createGUI = function(scene, showScene) {


	
    switch (showScene) {
        case 0:
            var advancedTexture1 = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI1", true, scene);
            advancedTexture1.background = "black";


            var imagemenu1 = new BABYLON.GUI.Image("imagemenu1", "textures/sky.png");
			
	        advancedTexture1.addControl(imagemenu1);

            var imagemenu2 = new BABYLON.GUI.Image("imagemenu2", "textures/terra.png");
            
	        imagemenu2.width = "400px";
            imagemenu2.height = "400px";
            imagemenu2.left = "540px";
	        advancedTexture1.addControl(imagemenu2);

            var title = new BABYLON.GUI.TextBlock();
            title.fontSize = 60;
            title.height = 0.2;
            title.text = "POLLUTION BATTLE";
            title.color = "White";
            title.top = "5px";
            title.fontFamily = "MenuFont";
            title.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
            advancedTexture1.addControl(title);
            
            var buttonimage1 = BABYLON.GUI.Button.CreateImageWithCenterTextButton("terra", "START BATTLE", "textures/play.png");
	        buttonimage1.width = "42%";
	        buttonimage1.height = "42%";
	        buttonimage1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
	        buttonimage1.textBlock.color = "yellow";
            buttonimage1.hoverCursor = "pointer";
	        buttonimage1.top = "-2%";
	        advancedTexture1.addControl(buttonimage1);

            buttonimage1.onPointerMoveObservable.add(function () {
                buttonimage1.background = "grey";
            });
    
            buttonimage1.onPointerOutObservable.add(function () {
                buttonimage1.background = "black";
            });

            var commands = BABYLON.GUI.Button.CreateSimpleButton("commandbutton", "COMMANDS");
            commands.width = "12%";
            commands.height = "9%";
            commands.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            commands.top = "40%";
            commands.textBlock.color = "White";
            commands.background = "black";
            commands.hoverCursor = "pointer";
            commands.left = "-10%";
            advancedTexture1.addControl(commands);

            commands.onPointerMoveObservable.add(function () {
                commands.background = "grey";
            });
    
            commands.onPointerOutObservable.add(function () {
                commands.background = "black";
            });


            var about = BABYLON.GUI.Button.CreateSimpleButton("aboutbutton", "ABOUT THE AUTHOR");
            about.width = "12%";
            about.height = "9%";
            about.right = "-20%";
            about.left = "20%";
            about.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            about.top = "40%";
            about.textBlock.color = "white";
            about.background = "black";
            about.hoverCursor = "pointer";
            about.left = "10%";
            advancedTexture1.addControl(about);

            about.onPointerMoveObservable.add(function () {
                about.background = "grey";
            });
    
            about.onPointerOutObservable.add(function () {
                about.background = "black";
            });

            buttonimage1.onPointerUpObservable.add(function () {       
                comingfromScenemenu = true;
				nextscene = createScene();
				changescene = 1;  
                
                clicks ++;
                            
            });
            var fielddifficulty = new BABYLON.GUI.TextBlock();
				fielddifficulty.fontSize =24;
				fielddifficulty.width = "30%";
				fielddifficulty.height = "5%";
				fielddifficulty.text = "Choose Difficulty:";
				fielddifficulty.color = "White";
				fielddifficulty.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
				fielddifficulty.paddingTop = "25.5%";
				fielddifficulty.paddingBottom = "-25.5%";
				fielddifficulty.paddingRight = "38%";
				fielddifficulty.paddingLeft = "-38%";
				advancedTexture1.addControl(fielddifficulty);
            
            var radiobuttoneasy = new BABYLON.GUI.RadioButton();
				radiobuttoneasy.width = "2%";
				radiobuttoneasy.height = "4%";
				radiobuttoneasy.color = "white";
				radiobuttoneasy.right = "45%";
				radiobuttoneasy.left = "-45%";
				radiobuttoneasy.top = "-10%";
				radiobuttoneasy.bottom = "10%";
				radiobuttoneasy.background = "black";

				
			
			var radiobuttonmedium = new BABYLON.GUI.RadioButton();
				radiobuttonmedium.width = "2%";
				radiobuttonmedium.height = "4%";
				radiobuttonmedium.color = "white";
				radiobuttonmedium.right = "45%";
				radiobuttonmedium.left = "-45%";
				radiobuttonmedium.top = "0%";
				radiobuttonmedium.bottom = "0%";
				radiobuttonmedium.background = "black";
				radiobuttonmedium.isChecked = true;

				

			var radiobuttonhard = new BABYLON.GUI.RadioButton();
				radiobuttonhard.width = "2%";
				radiobuttonhard.height = "4%";
				radiobuttonhard.color = "white";
				radiobuttonhard.right = "45%";
				radiobuttonhard.left = "-45%";
				radiobuttonhard.top = "10%";
				radiobuttonhard.bottom = "-10%";
				radiobuttonhard.background = "black";
				

			radiobuttoneasy.onPointerMoveObservable.add(function () {
				radiobuttoneasy.background = "white";
			});

			radiobuttoneasy.onPointerOutObservable.add(function () {
				radiobuttoneasy.background = "black";
			});

			radiobuttoneasy.onPointerClickObservable.add(function () {
				difficulty = 0;
			});

			radiobuttonmedium.onPointerMoveObservable.add(function () {
				radiobuttonmedium.background = "white";
			});

			radiobuttonmedium.onPointerOutObservable.add(function () {
				radiobuttonmedium.background = "black";
			});

			radiobuttonmedium.onPointerClickObservable.add(function () {
				difficulty = 1;
			});

			radiobuttonhard.onPointerMoveObservable.add(function () {
				radiobuttonhard.background = "white";
			});

			radiobuttonhard.onPointerOutObservable.add(function () {
				radiobuttonhard.background = "black";
			});


			radiobuttonhard.onPointerClickObservable.add(function () {
				difficulty = 2;
			});


			var fieldeasy = new BABYLON.GUI.TextBlock();
				fieldeasy.fontSize =24;
				fieldeasy.width = "7%";
				fieldeasy.height = "5%";
				fieldeasy.text = "Easy";
				fieldeasy.color = "White";
				fieldeasy.top = "-10%";
				fieldeasy.bottom = "10%";
				fieldeasy.right = "39%";
				fieldeasy.left = "-39%";
				fieldeasy.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
				

			var fieldmedium = new BABYLON.GUI.TextBlock();
				fieldmedium.fontSize =24;
				fieldmedium.width = "10%";
				fieldmedium.height = "5%";
				fieldmedium.text = "Medium";
				fieldmedium.color = "White";
				fieldmedium.top = "0%";
				fieldmedium.bottom = "0%";
				fieldmedium.right = "38%";
				fieldmedium.left = "-38%";
				fieldmedium.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

			var fieldhard = new BABYLON.GUI.TextBlock();
				fieldhard.fontSize =24;
				fieldhard.width = "10%";
				fieldhard.height = "5%";
				fieldhard.text = "Hard";
				fieldhard.color = "White";
				fieldhard.top = "10%";
				fieldhard.bottom = "-10%";
				fieldhard.right = "39%";
				fieldhard.left = "-39%";
				fieldhard.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;



			advancedTexture1.addControl(fieldeasy);
			advancedTexture1.addControl(fieldmedium);
			advancedTexture1.addControl(fieldhard);
			advancedTexture1.addControl(radiobuttoneasy);
			advancedTexture1.addControl(radiobuttonmedium);
			advancedTexture1.addControl(radiobuttonhard);
			

            commands.onPointerUpObservable.add(function () {
				
                scenecommandsvar = createScenecommands();
                    changescene = 2;
                   
            });
    
            about.onPointerUpObservable.add(function () {
                    aboutscenevar = createSceneabout();
                    changescene = 3;
                    
            });
            
            
        break
        case 1:
    
        break
            
        case 2:
    
    
            var advancedTexturecommands = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
            

    
            imagemenu2 = new BABYLON.GUI.Image("imagemenu2", "textures/inq6.jpg");
            imagemenu2.cornerRadius = 20;
            advancedTexturecommands.addControl(imagemenu2);
    
    
                var titlecommands = new BABYLON.GUI.TextBlock();
                    titlecommands.fontSize = 80;
                    titlecommands.height = 0.2;
                    titlecommands.text = "COMMANDS";
                    titlecommands.color = "Black";
                    titlecommands.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                    advancedTexturecommands.addControl(titlecommands);
    
                var titlecommands2 = new BABYLON.GUI.TextBlock();
                    titlecommands2.fontSize = 50;
                    titlecommands2.height = 0.2;
                    titlecommands2.text = "Shoot the enemies before one of them touches you!";
                    titlecommands2.color = "Black";
                    titlecommands2.top = "10%";
                    titlecommands2.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                    advancedTexturecommands.addControl(titlecommands2);

                var startf = BABYLON.GUI.Button.CreateSimpleButton("backtomenu", "BACK TO MENU");
                    startf.width = "12%";
                    startf.height = "9%";
                    startf.right = "-10%";
                    startf.fontFamily = "MenuFont";
                    startf.textBlock.color = "white";
                    startf.textBlock.fontFamily = "MenuFont";
                    startf.background = "black";
                    startf.hoverCursor = "pointer";
                    startf.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                    startf.align = "center";
                    startf.top = "42%";


                startf.onPointerMoveObservable.add(function () {
                    startf.background = "grey";
                });
                startf.onPointerOutObservable.add(function () {
                    startf.background = "black";
                });
                              
    
                startf.onPointerUpObservable.add(function () {		
                      comingfromScenecommands = true;
                      scenemenuvar = createScenemenu();
                    changescene = 0;
                  });
    
                advancedTexturecommands.addControl(startf);
    
                var rectanglecomm = new BABYLON.GUI.Rectangle();
                    rectanglecomm.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                    rectanglecomm.width = "61%";
                    rectanglecomm.height = "61%";
                    rectanglecomm.background = "Black";
                    rectanglecomm.alpha = 0.8;
                    rectanglecomm.top = "5%";
                    rectanglecomm.bottom = "-5%";
                    rectanglecomm.cornerRadius = 20;
                    advancedTexturecommands.addControl(rectanglecomm);
    
                  var imagecomm = new BABYLON.GUI.Image("imagecomm", "textures/instruction.png");
                    imagecomm.position = new BABYLON.Vector3(0, 4,0);
                    imagecomm.scaling = new BABYLON.Vector3(0.01,0.01,0.01);
                    imagecomm.width = "60%";
                    imagecomm.height = "60%";
                    imagecomm.populateNinePatchSlicesFromImage = true;
                    imagecomm.top = "5%";
                    imagecomm.bottom = "-5%";
                    advancedTexturecommands.addControl(imagecomm);
    
    
        break
            
        case 3:
                advancedTextureabout = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);
    
                var imagemenu3 = new BABYLON.GUI.Image("imagemenu3", "textures/about.jpeg");
                    advancedTextureabout.addControl(imagemenu3);
    
                
    
                var titleabout = new BABYLON.GUI.TextBlock();
                    titleabout.fontSize = 80;
                    titleabout.height = 0.2;
                    titleabout.text = "ABOUT THE AUTHOR";
                    titleabout.top = "10%";
                    titleabout.color = "white";
                    titleabout.fontFamily = "MenuFont";
                    titleabout.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                    advancedTextureabout.addControl(titleabout);


                var rectanglecomm = new BABYLON.GUI.Rectangle();
                    rectanglecomm.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                    rectanglecomm.width = "45%";
                    rectanglecomm.height = "50%";
                    rectanglecomm.background = "Black";
                    rectanglecomm.alpha = 0.8;
                    rectanglecomm.top = "3%";
                    rectanglecomm.bottom = "-1%";
                    rectanglecomm.cornerRadius = 10;
                    advancedTextureabout.addControl(rectanglecomm);
    
                var abouttext = new BABYLON.GUI.TextBlock();
                    abouttext.text = "I'm a student of Engineering in\n Computer Science at the "+
                    "Sapienza University in Rome.\n During the Interactive Graphics course held by Professor\n Schaerf Marco, "+
                        "I developed a game application \n using Babylonjs libraries. \n"+
                        "\n\n Created and developed by: \n\n Francesca Davidde  \n"
                    abouttext.fontSize = 23;
                    abouttext.width = "80%";
                    abouttext.height = "70%";
                    abouttext.color = "White"
                    abouttext.top = "18%";
                    abouttext.bottom = "-15%";
                    abouttext.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                    advancedTextureabout.addControl(abouttext);
    
    
                var startj = BABYLON.GUI.Button.CreateSimpleButton("backtomenu2", " BACK TO MENU");
                    startj.width = "12%";
                    startj.height = "9%";
                    startj.right = "-10%";
                    startj.fontFamily = "MenuFont";
                    startj.textBlock.color = "white";
                    startj.textBlock.fontFamily = "MenuFont";
                    startj.background = "black";
                    startj.hoverCursor = "pointer";
                    startj.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                    startj.align = "center";
                    startj.top = "40%";


                    startj.onPointerMoveObservable.add(function () {
                        startj.background = "grey";
                    });

                    startj.onPointerOutObservable.add(function () {
                        startj.background = "black";
                    });
                                
    
                startj.onPointerUpObservable.add(function () {
                    comingfromSceneabout = true;
                    scenemenuvar = createScenemenu();
                    changescene = 0;
                });
    
                advancedTextureabout.addControl(startj);
    
    
        break




        case 4:
        advancedTexturegameover = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("LOSEUI", true, scene);
        var imagebackgo = new BABYLON.GUI.Image("imagebackgo", "textures/inquinamento.jpg");
        advancedTexturegameover.addControl(imagebackgo);
        
        var rectangleover = new BABYLON.GUI.Rectangle();
        rectangleover.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        rectangleover.width = "90%";
        rectangleover.height = "50%";
        rectangleover.background = "Black";
        rectangleover.alpha = 0.8;
        rectangleover.top = "3%";
        rectangleover.bottom = "-1%";
        rectangleover.cornerRadius = 10;
        advancedTexturegameover.addControl(rectangleover);

        var gameOver = new BABYLON.GUI.TextBlock();
              gameOver.fontFamily = "GameOverFont";
              gameOver.text = "GAME OVER";
              gameOver.bottom = "5%";
              gameOver.color = "red";
              gameOver.fontSize = 150;
              gameOver.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            advancedTexturegameover.addControl(gameOver);

        var gameOver2 = new BABYLON.GUI.TextBlock();
            gameOver2.fontFamily = "GameOverFont";
            gameOver2.top = "20%";
            gameOver2.text = "...try again to save the planet from pollution!";
            gameOver2.color = "red";
            gameOver2.fontSize = 70;
            gameOver2.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
          advancedTexturegameover.addControl(gameOver2);

        var gotomenurestrtfrom = BABYLON.GUI.Button.CreateSimpleButton("gotomenufromlose", "GO TO MENU");
            gotomenurestrtfrom.width = "12%";
            gotomenurestrtfrom.height = "9%";
            gotomenurestrtfrom.right = "-10%";
            gotomenurestrtfrom.fontFamily = "MenuFont";
            gotomenurestrtfrom.textBlock.color = "white";
            gotomenurestrtfrom.textBlock.fontFamily = "MenuFont";
            gotomenurestrtfrom.background = "black";
            gotomenurestrtfrom.hoverCursor = "pointer";
            gotomenurestrtfrom.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            gotomenurestrtfrom.align = "center";
            gotomenurestrtfrom.top = "40%";
            advancedTexturegameover.addControl(gotomenurestrtfrom);

        gotomenurestrtfrom.onPointerMoveObservable.add(function () {
            gotomenurestrtfrom.background = "grey";
        });

        gotomenurestrtfrom.onPointerOutObservable.add(function () {
            gotomenurestrtfrom.background = "black";
        });


        gotomenurestrtfrom.onPointerUpObservable.add(function () {
            comingfromScenelosing = true;
            scenemenuvar = createScenemenu();
            changescene = 0;

        });

    break
    case 5:

        advancedTexturewin = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("WINUI", true, scene);
        
        var imagebackwin = new BABYLON.GUI.Image("imagebackwin", "textures/marino.jpg");
        advancedTexturewin.addControl(imagebackwin);

        var rectanglewin = new BABYLON.GUI.Rectangle();
        rectanglewin.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
        rectanglewin.width = "95%";
        rectanglewin.height = "70%";
        rectanglewin.background = "Black";
        rectanglewin.alpha = 0.8;
        rectanglewin.bottom = "-1%";
        rectanglewin.cornerRadius = 10;
        advancedTexturewin.addControl(rectanglewin);
    
        var win = new BABYLON.GUI.TextBlock();
            win.fontFamily = "GameOverFont";
            win.text = "Congratulations\n YOU WIN";
            win.top = "-10%";
            win.color = "white";
            win.fontSize = 150;
            advancedTexturewin.addControl(win);

        var win2 = new BABYLON.GUI.TextBlock();
            win2.fontFamily = "GameOverFont";
            win2.top = "20%";
            win2.text = "Thanks for helping save the planet from pollution!";
            win2.color = "white";
            win2.fontSize = 65;
            win2.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
          advancedTexturewin.addControl(win2);


        var gotomenurestrtfromwin = BABYLON.GUI.Button.CreateSimpleButton("gotomenufromwin", "GO TO MENU");
            gotomenurestrtfromwin.width = "12%";
            gotomenurestrtfromwin.height = "9%";
            gotomenurestrtfromwin.fontFamily = "MenuFont";
            gotomenurestrtfromwin.textBlock.color = "white";
            gotomenurestrtfromwin.textBlock.fontFamily = "MenuFont";
            gotomenurestrtfromwin.background = "black";
            gotomenurestrtfromwin.hoverCursor = "pointer";
            gotomenurestrtfromwin.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
            gotomenurestrtfromwin.top = "40%";
            gotomenurestrtfromwin.align = "center";
            advancedTexturewin.addControl(gotomenurestrtfromwin);

              gotomenurestrtfromwin.onPointerMoveObservable.add(function () {
                gotomenurestrtfromwin.background = "grey";
            });

            gotomenurestrtfromwin.onPointerOutObservable.add(function () {
                    gotomenurestrtfromwin.background = "black";
            });


              gotomenurestrtfromwin.onPointerUpObservable.add(function () {
              scenemenuvar = createScenemenu();
              comingfromScenewinning = true;
              changescene = 0;


            });

    break


    }


}




//Main Menu


var difficulty = 1;
var changescene = 0;
var nextscene;
var scenecommandsvar;
var aboutscenevar;
var gameoverscenevar;
var winningScenevar;
var comingfromSceneabout = false;
var comingfromScenecommands = false;
var comingfromScenemenu = false;
var comingfromScenewinning = false;
var comingfromScenelosing = false;
var currentLevel = 1;



var scenemenuvar = createScenemenu();


window.scene = createScene();


engine.runRenderLoop(function() {


	if(changescene == 0){
        
        if(comingfromSceneabout){
          aboutscenevar.dispose();
          comingfromSceneabout = false;
        }
        else if(comingfromScenecommands){
            scenecommandsvar.dispose();
            comingfromScenecommands = false;
            }
            else if (comingfromScenelosing) {
                gameoverscenevar.dispose();
                comingfromScenelosing = false;
            }
            else if (comingfromScenewinning){
                winningScenevar.dispose();
                comingfromScenewinning = false;
             }
        divFps.innerHTML = engine.getFps().toFixed() + " fps";
		

        if(clicks==0){
            if (scene.getWaitingItemsCount() === 0) {
                engine.hideLoadingUI();
                scenemenuvar.render();
            } else {
               engine.displayLoadingUI();
               }
        }                   
        else {
            advancedTexture.dispose();
            scene.render();
        }
        
        

  	}
	else if (changescene == 1){
           
        	if (scene.getWaitingItemsCount() === 0) {
                
            	loadingScreenDiv.style.visibility = "hidden";
            	engine.hideLoadingUI();

            	if(comingfromScenelosing){
              		gameoverscenevar.dispose();
              		comingfromScenelosing = false;
            	}
            	else if(comingfromScenemenu){
                   
              		scenemenuvar.dispose();
              		comingfromScenemenu = false;
            	} 
                
           		nextscene.render();

    			
				
				setTimeout(function(){
              		boolgamestart = true;
            	}, 5000);

        	} else {
            	loadingScreenDiv.style.visibility = "visible";
            	engine.displayLoadingUI();
			}
	}
		
	    else if(changescene == 2){
        	scenemenuvar.dispose();
			scenecommandsvar.render();
		}
		
	    else if (changescene == 3){
        	scenemenuvar.dispose();
			aboutscenevar.render();			
		}
		
		else if (changescene == 4){    	
			nextscene.dispose();
			gameoverscenevar.render();
		}
      	else if (changescene == 5){
			nextscene.dispose();
			winningScenevar.render();
		}

});


//**********************COMMANDS SCENE******************************
var createScenecommands = function () {
    var scenecommands = new BABYLON.Scene(engine);
	
	var cameraCommands = new BABYLON.UniversalCamera("CamCommands", new BABYLON.Vector3(0, 0, 1), scenecommands);
		cameraCommands.attachControl(canvas, true);


    
		createGUI(scenecommands, 2);

    return scenecommands;
}

//******************************************************************

//**************************GAME OVER SCENE**************************
var createGameOverscene = function () {



	
	var gameOverScene = new BABYLON.Scene(engine);
		gameOverScene.clearColor = new BABYLON.Color3(0.00, 0.75, 1.00);
    var gameovermusic = new BABYLON.Sound("gameovermusic", "music/gameover.wav", gameOverScene, null, {volume: 0.1, autoplay:true});

	var cameraGameOver = new BABYLON.UniversalCamera("CamGameOver", new BABYLON.Vector3(0, 0, 1), gameOverScene);
	cameraGameOver.attachControl(canvas, true);

    createGUI(gameOverScene, 4);


    return gameOverScene;

  }
//******************************************************************

//**********************ABOUT SCENE**********************************
var createSceneabout = function () {
    var aboutscene = new BABYLON.Scene(engine);

	var cameraAbout = new BABYLON.UniversalCamera("CamAbout", new BABYLON.Vector3(0, 0, 1), aboutscene);
	cameraAbout.attachControl(canvas, true);

    createGUI(aboutscene, 3);

    return aboutscene;
}


window.addEventListener("resize", function () {
    engine.resize();
});
