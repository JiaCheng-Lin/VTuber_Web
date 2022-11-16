//Import Helper Functions from Kalidokit
const remap = Kalidokit.Utils.remap;
const clamp = Kalidokit.Utils.clamp;
const lerp = Kalidokit.Vector.lerp;

// /* THREEJS WORLD SETUP */
// let currentVrm;

// yaw roll pitch
let yaw=0, roll=0, pitch=0, eye_l=1, eye_r=1, pupil_x=0, pupil_y=0, mouth_y=0;

// for smoothing 
let pre_yaw=0, pre_roll=0, pre_pitch=0, pre_eye_l=1, pre_eye_r=1, pre_pupil_x=0, pre_pupil_y=0, pre_mouth_y=0;


// // renderer
// const renderer = new THREE.WebGLRenderer({alpha:true});
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setPixelRatio(window.devicePixelRatio);
// document.body.appendChild(renderer.domElement);

// // camera
// const orbitCamera = new THREE.PerspectiveCamera(35,window.innerWidth / window.innerHeight,0.1,1000);
// orbitCamera.position.set(0.0, 1.4, 0.7);

// // controls
// const orbitControls = new THREE.OrbitControls(orbitCamera, renderer.domElement);
// orbitControls.screenSpacePanning = true;
// orbitControls.target.set(0.0, 1.4, 0.0);
// orbitControls.update();

// // scene
// const scene = new THREE.Scene();

//// light
// const light = new THREE.DirectionalLight(0xffffff);
// light.position.set(1.0, 1.0, 1.0).normalize();
// scene.add(light);

// // Main Render Loop
// const clock = new THREE.Clock();

// function animate() {
//   requestAnimationFrame(animate);

//   if (currentVrm) {
//     // Update model to render physics
//     currentVrm.update(clock.getDelta());
//   }
//   renderer.render(scene, orbitCamera);
// }
// animate();

/* VRM CHARACTER SETUP */

// // Import Character VRM
// const loader = new THREE.GLTFLoader();
// loader.crossOrigin = "anonymous";
// // Import model from URL, add your own model here
// loader.load(
//   "https://cdn.glitch.com/29e07830-2317-4b15-a044-135e73c7f840%2FAshtra.vrm?v=1630342336981",

//   gltf => {
//     THREE.VRMUtils.removeUnnecessaryJoints(gltf.scene);

//     THREE.VRM.from(gltf).then(vrm => {
//       scene.add(vrm.scene);
//       currentVrm = vrm;
//       currentVrm.scene.rotation.y = Math.PI; // Rotate model 180deg to face camera
//     });
//   },

//   progress =>
//     console.log(
//       "Loading model...",
//       100.0 * (progress.loaded / progress.total),
//       "%"
//     ),

//   error => console.error(error)
// );

// // Animate Rotation Helper function
// const rigRotation = (
//   name,
//   rotation = { x: 0, y: 0, z: 0 },
//   dampener = 1,
//   lerpAmount = 0.3
// ) => {
//   if (!currentVrm) {return}
//   const Part = currentVrm.humanoid.getBoneNode(
//     THREE.VRMSchema.HumanoidBoneName[name]
//   );
//   if (!Part) {return}
  
//   let euler = new THREE.Euler(
//     rotation.x * dampener,
//     rotation.y * dampener,
//     rotation.z * dampener
//   );
//   let quaternion = new THREE.Quaternion().setFromEuler(euler);
//   Part.quaternion.slerp(quaternion, lerpAmount); // interpolate

// };

// // Animate Position Helper Function
// const rigPosition = (
//   name,
//   position = { x: 0, y: 0, z: 0 },
//   dampener = 1,
//   lerpAmount = 0.3
// ) => {
//   if (!currentVrm) {return}
//   const Part = currentVrm.humanoid.getBoneNode(
//     THREE.VRMSchema.HumanoidBoneName[name]
//   );
//   if (!Part) {return}
//   let vector = new THREE.Vector3(
//     position.x * dampener,
//     position.y * dampener,
//     position.z * dampener
//   );
//   Part.position.lerp(vector, lerpAmount); // interpolate
// };

// let oldLookTarget = new THREE.Euler()
// const rigFace = (riggedFace) => {
//     if(!currentVrm){return}
//     rigRotation("Neck", riggedFace.head, 0.7);
//     console.log("riggedFace", riggedFace.head.degrees)

//     roll = riggedFace.head.degrees.z
//     yaw = riggedFace.head.degrees.y
//     pitch = riggedFace.head.degrees.x

//     // Blendshapes and Preset Name Schema
//     const Blendshape = currentVrm.blendShapeProxy;
//     const PresetName = THREE.VRMSchema.BlendShapePresetName;
  
//     // Simple example without winking. Interpolate based on old blendshape, then stabilize blink with `Kalidokit` helper function.
//     // for VRM, 1 is closed, 0 is open.
//     riggedFace.eye.l = lerp(clamp(1 - riggedFace.eye.l, 0, 1),Blendshape.getValue(PresetName.Blink), .5)
//     riggedFace.eye.r = lerp(clamp(1 - riggedFace.eye.r, 0, 1),Blendshape.getValue(PresetName.Blink), .5)
//     riggedFace.eye = Kalidokit.Face.stabilizeBlink(riggedFace.eye,riggedFace.head.y)
//     Blendshape.setValue(PresetName.Blink, riggedFace.eye.l);
    
//     // Interpolate and set mouth blendshapes
//     Blendshape.setValue(PresetName.I, lerp(riggedFace.mouth.shape.I,Blendshape.getValue(PresetName.I), .5));
//     Blendshape.setValue(PresetName.A, lerp(riggedFace.mouth.shape.A,Blendshape.getValue(PresetName.A), .5));
//     Blendshape.setValue(PresetName.E, lerp(riggedFace.mouth.shape.E,Blendshape.getValue(PresetName.E), .5));
//     Blendshape.setValue(PresetName.O, lerp(riggedFace.mouth.shape.O,Blendshape.getValue(PresetName.O), .5));
//     Blendshape.setValue(PresetName.U, lerp(riggedFace.mouth.shape.U,Blendshape.getValue(PresetName.U), .5));

//     //PUPILS
//     //interpolate pupil and keep a copy of the value
//     let lookTarget =
//       new THREE.Euler(
//         lerp(oldLookTarget.x , riggedFace.pupil.y, .4),
//         lerp(oldLookTarget.y, riggedFace.pupil.x, .4),
//         0,
//         "XYZ"
//       )
//     oldLookTarget.copy(lookTarget)
//     currentVrm.lookAt.applyer.lookAt(lookTarget);
// }



/* VRM Character Animator */
// const animateVRM = (vrm, results) => {
const animateVRM = (results) => {
  if (!results) {
    return;
  } 
  // if (!vrm) {
  //   return;
  // }   
  // Take the results from `Holistic` and animate character based on its Face, Pose, and Hand Keypoints.
  let riggedPose, riggedLeftHand, riggedRightHand, riggedFace;

  const faceLandmarks = results.faceLandmarks;
  // Pose 3D Landmarks are with respect to Hip distance in meters
  // const pose3DLandmarks = results.ea;
  // // Pose 2D landmarks are with respect to videoWidth and videoHeight
  // const pose2DLandmarks = results.poseLandmarks;
  // // Be careful, hand landmarks may be reversed
  // const leftHandLandmarks = results.rightHandLandmarks;
  // const rightHandLandmarks = results.leftHandLandmarks;

  // Animate Face
  if (faceLandmarks) {
    riggedFace = Kalidokit.Face.solve(faceLandmarks, {
      runtime:"mediapipe",
      video:videoElement,
      smoothBlink: true, // smooth left and right eye blink delays
      blinkSettings: [0.25, 0.5], // adjust upper and lower bound blink sensitivity
    });
    // console.log("riggedFace", riggedFace.head.degrees)

    roll = riggedFace.head.degrees.z;
    yaw = riggedFace.head.degrees.y;
    pitch = riggedFace.head.degrees.x;
    eye_l = riggedFace.eye.l; 
    eye_r = riggedFace.eye.r; 
    pupil_x = riggedFace.pupil.x;
    pupil_y = riggedFace.pupil.y;
    mouth_y = riggedFace.mouth.y;

    // smooth value
    if(pre_roll!=0&&pre_yaw!=0&&pre_pitch!=0) { // not the first time
      roll = lerp(pre_roll, roll, .4); 
      yaw = lerp(pre_yaw, yaw, .4); 
      pitch = lerp(pre_pitch, pitch, .4); 
      eye_l = lerp(pre_eye_l, eye_l, .4);
      eye_r = lerp(pre_eye_r, eye_r, .4);
      pupil_x = lerp(pre_pupil_x, pupil_x, .4);
      pupil_y = lerp(pre_pupil_y, pupil_y, .4); 
      console.log(pupil_y, pre_pupil_y, riggedFace.pupil.y);
      mouth_y = lerp(pre_mouth_y, mouth_y, .4); 
    }
    pre_roll = roll;
    pre_yaw = yaw;
    pre_pitch = pitch;
    pre_eye_l = eye_l; 
    pre_eye_r = eye_r ; 
    pre_pupil_x = pupil_x;
    pre_pupil_y = pupil_y;
    pre_mouth_y = mouth_y;


    // // no wink, more natural 
    if(eye_l>0.4&&eye_r>0.4) {
      eye_l=1;
      eye_r=1;
    }
    else {
      eye_l=0;
      eye_r=0;
    }
    
    
    // console.log("riggedFace", riggedFace);
  //  rigFace(riggedFace)
  }


  // // Animate Pose
  // if (pose2DLandmarks && pose3DLandmarks) {
  //   riggedPose = Kalidokit.Pose.solve(pose3DLandmarks, pose2DLandmarks, {
  //     runtime: "mediapipe",
  //     video:videoElement,
  //   });
  //   rigRotation("Hips", riggedPose.Hips.rotation, 0.7);
  //   rigPosition(
  //     "Hips",
  //     {
  //       x: -riggedPose.Hips.position.x, // Reverse direction
  //       y: riggedPose.Hips.position.y + 1, // Add a bit of height
  //       z: -riggedPose.Hips.position.z // Reverse direction
  //     },
  //     1,
  //     0.07
  //   );

  //   rigRotation("Chest", riggedPose.Spine, 0.25, .3);
  //   rigRotation("Spine", riggedPose.Spine, 0.45, .3);

  //   rigRotation("RightUpperArm", riggedPose.RightUpperArm, 1, .3);
  //   rigRotation("RightLowerArm", riggedPose.RightLowerArm, 1, .3);
  //   rigRotation("LeftUpperArm", riggedPose.LeftUpperArm, 1, .3);
  //   rigRotation("LeftLowerArm", riggedPose.LeftLowerArm, 1, .3);

  //   rigRotation("LeftUpperLeg", riggedPose.LeftUpperLeg, 1, .3);
  //   rigRotation("LeftLowerLeg", riggedPose.LeftLowerLeg, 1, .3);
  //   rigRotation("RightUpperLeg", riggedPose.RightUpperLeg, 1, .3);
  //   rigRotation("RightLowerLeg", riggedPose.RightLowerLeg, 1, .3);
  // }

  // // Animate Hands
  // if (leftHandLandmarks) {
  //   riggedLeftHand = Kalidokit.Hand.solve(leftHandLandmarks, "Left", {
  //     runtime:"mediapipe",
  //     video:videoElement
  //  });
  //   rigRotation("LeftHand", {
  //     // Combine pose rotation Z and hand rotation X Y
  //     z: riggedPose.LeftHand.z,
  //     y: riggedLeftHand.LeftWrist.y,
  //     x: riggedLeftHand.LeftWrist.x
  //   });
  //   rigRotation("LeftRingProximal", riggedLeftHand.LeftRingProximal);
  //   rigRotation("LeftRingIntermediate", riggedLeftHand.LeftRingIntermediate);
  //   rigRotation("LeftRingDistal", riggedLeftHand.LeftRingDistal);
  //   rigRotation("LeftIndexProximal", riggedLeftHand.LeftIndexProximal);
  //   rigRotation("LeftIndexIntermediate", riggedLeftHand.LeftIndexIntermediate);
  //   rigRotation("LeftIndexDistal", riggedLeftHand.LeftIndexDistal);
  //   rigRotation("LeftMiddleProximal", riggedLeftHand.LeftMiddleProximal);
  //   rigRotation("LeftMiddleIntermediate", riggedLeftHand.LeftMiddleIntermediate);
  //   rigRotation("LeftMiddleDistal", riggedLeftHand.LeftMiddleDistal);
  //   rigRotation("LeftThumbProximal", riggedLeftHand.LeftThumbProximal);
  //   rigRotation("LeftThumbIntermediate", riggedLeftHand.LeftThumbIntermediate);
  //   rigRotation("LeftThumbDistal", riggedLeftHand.LeftThumbDistal);
  //   rigRotation("LeftLittleProximal", riggedLeftHand.LeftLittleProximal);
  //   rigRotation("LeftLittleIntermediate", riggedLeftHand.LeftLittleIntermediate);
  //   rigRotation("LeftLittleDistal", riggedLeftHand.LeftLittleDistal);
  // }
  // if (rightHandLandmarks) {
  //   riggedRightHand = Kalidokit.Hand.solve(rightHandLandmarks, "Right");
  //   rigRotation("RightHand", {
  //     // Combine Z axis from pose hand and X/Y axis from hand wrist rotation
  //     z: riggedPose.RightHand.z,
  //     y: riggedRightHand.RightWrist.y,
  //     x: riggedRightHand.RightWrist.x
  //   });
  //   rigRotation("RightRingProximal", riggedRightHand.RightRingProximal);
  //   rigRotation("RightRingIntermediate", riggedRightHand.RightRingIntermediate);
  //   rigRotation("RightRingDistal", riggedRightHand.RightRingDistal);
  //   rigRotation("RightIndexProximal", riggedRightHand.RightIndexProximal);
  //   rigRotation("RightIndexIntermediate",riggedRightHand.RightIndexIntermediate);
  //   rigRotation("RightIndexDistal", riggedRightHand.RightIndexDistal);
  //   rigRotation("RightMiddleProximal", riggedRightHand.RightMiddleProximal);
  //   rigRotation("RightMiddleIntermediate", riggedRightHand.RightMiddleIntermediate);
  //   rigRotation("RightMiddleDistal", riggedRightHand.RightMiddleDistal);
  //   rigRotation("RightThumbProximal", riggedRightHand.RightThumbProximal);
  //   rigRotation("RightThumbIntermediate", riggedRightHand.RightThumbIntermediate);
  //   rigRotation("RightThumbDistal", riggedRightHand.RightThumbDistal);
  //   rigRotation("RightLittleProximal", riggedRightHand.RightLittleProximal);
  //   rigRotation("RightLittleIntermediate", riggedRightHand.RightLittleIntermediate);
  //   rigRotation("RightLittleDistal", riggedRightHand.RightLittleDistal);
  // }
};

function getData() {
  /*
  array = some file
  this file only contain this
  {id:1,name:'Alpha'},
  {id:2,name:'Beta'}
  */
  var data = [roll, pitch, yaw, eye_l, eye_r, pupil_x, pupil_y, mouth_y];
  // console.log("roll, pitch, yaw: ",data);
  return data;
}

/* SETUP MEDIAPIPE HOLISTIC INSTANCE */
let videoElement = document.querySelector(".input_video"),
  guideCanvas = document.querySelector('canvas.guides');


const onResults = (results) => {
  // Draw landmark guides
  drawResults(results)
  // Animate model
  animateVRM(results);
  // animateVRM(currentVrm, results);
}

// create mediapipe holistic instance
const holistic = new Holistic({
    locateFile: file => {
      return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic@0.5.1635989137/${file}`;
    }
  });

  // set facemesh config
  // https://google.github.io/mediapipe/solutions/holistic.html#model_complexity
  holistic.setOptions({
    modelComplexity: 1, // 0, 1, 2, 
    smoothLandmarks: true,
    enableSegmentation: false,
    smoothSegmentation: false,
    refineFaceLandmarks: true,
    minDetectionConfidence: 0.7,
    minTrackingConfidence: 0.7,
  });
  // Pass holistic a callback function
  holistic.onResults(onResults);

const drawResults = (results) => {
  guideCanvas.width = videoElement.videoWidth;
  guideCanvas.height = videoElement.videoHeight;
  let canvasCtx = guideCanvas.getContext('2d');
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, guideCanvas.width, guideCanvas.height);
  // Use `Mediapipe` drawing functions
  // drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, {
  //     color: "#00cff7",
  //     lineWidth: 4
  //   });
    // drawLandmarks(canvasCtx, results.poseLandmarks, {
    //   color: "#ff0364",
    //   lineWidth: 2
    // });
    
      
    drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_TESSELATION, {
      color: "#C0C0C070",
      lineWidth: 1
    });
    // drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYE, {color: '#FF3030'});
    // drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_EYEBROW, {color: '#FF3030'});
    // drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_RIGHT_IRIS, {color: '#FF3030'});
    // drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYE, {color: '#30FF30'});
    // drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_EYEBROW, {color: '#30FF30'});
    // drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LEFT_IRIS, {color: '#30FF30'});
    // drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_FACE_OVAL, {color: '#E0E0E0'});
    // drawConnectors(canvasCtx, results.faceLandmarks, FACEMESH_LIPS, {color: '#E0E0E0'});
    
    
    if(results.faceLandmarks && results.faceLandmarks.length === 478){
      //draw pupils
      drawLandmarks(canvasCtx, [results.faceLandmarks[468],results.faceLandmarks[468+5]], {
        color: "#ffe603",
        lineWidth: 2
      });
    }
    drawConnectors(canvasCtx, results.leftHandLandmarks, HAND_CONNECTIONS, {
      color: "#eb1064",
      lineWidth: 5
    });
    drawLandmarks(canvasCtx, results.leftHandLandmarks, {
      color: "#00cff7",
      lineWidth: 2
    });
    drawConnectors(canvasCtx, results.rightHandLandmarks, HAND_CONNECTIONS, {
      color: "#22c3e3",
      lineWidth: 5
    });
    drawLandmarks(canvasCtx, results.rightHandLandmarks, {
      color: "#ff0364",
      lineWidth: 2
    });
}

// Use `Mediapipe` utils to get camera - lower resolution = higher fps
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await holistic.send({image: videoElement});
  },
  width: 640,
  height: 480
});
camera.start();