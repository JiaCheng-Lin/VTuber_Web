const lerp = Kalidokit.Vector.lerp;

// yaw roll pitch
let yaw=0, roll=0, pitch=0, eye_l=1, eye_r=1, pupil_x=0, pupil_y=0, mouth_y=0;

// for smoothing 
let pre_yaw=0, pre_roll=0, pre_pitch=0, pre_eye_l=1, pre_eye_r=1, pre_pupil_x=0, pre_pupil_y=0, pre_mouth_y=0;


// start camera using mediapipe camera utils
const startCamera = () => {
  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await facemesh.send({ image: videoElement });
    },
    width: 640,
    height: 480
  });
  camera.start();
};


const videoElement = document.querySelector(".input_video");
const canvasElement = document.querySelector('canvas.guides');
const canvasCtx = canvasElement.getContext('2d');

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height);
  if (results.multiFaceLandmarks) {
    for (const landmarks of results.multiFaceLandmarks) {
      drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION,
                     {color: '#C0C0C070', lineWidth: 1});
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYE, {color: '#FF3030'});
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_EYEBROW, {color: '#FF3030'});
      drawConnectors(canvasCtx, landmarks, FACEMESH_RIGHT_IRIS, {color: '#FF3030'});
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYE, {color: '#30FF30'});
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_EYEBROW, {color: '#30FF30'});
      drawConnectors(canvasCtx, landmarks, FACEMESH_LEFT_IRIS, {color: '#30FF30'});
      drawConnectors(canvasCtx, landmarks, FACEMESH_FACE_OVAL, {color: '#E0E0E0'});
      drawConnectors(canvasCtx, landmarks, FACEMESH_LIPS, {color: '#E0E0E0'});
    }
  }
  canvasCtx.restore();
  animateLive2DModel(results.multiFaceLandmarks[0])
}


const animateLive2DModel = points => {
  if (!points) return;

  let riggedFace;

  if (points) {
    // use kalidokit face solver
    riggedFace = Kalidokit.Face.solve(points, {
      runtime: "mediapipe",
      video: videoElement
    });

    // console.log(riggedFace)
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

    console.log(roll, yaw, pitch)
    // console.log(pupil_x, pupil_y)

    // // no wink, more natural 
    if(eye_l>0.4&&eye_r>0.4) {
      eye_l=1;
      eye_r=1;
    }
    else {
      eye_l=0;
      eye_r=0;
    }
  }
};

function getData() {
  var data = [roll, pitch, yaw, eye_l, eye_r, pupil_x, pupil_y, mouth_y];
  // console.log("roll, pitch, yaw: ",data);
  return data;
}

const faceMesh = new FaceMesh({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
}});
faceMesh.setOptions({
  maxNumFaces: 5,
  refineLandmarks: true,
  minDetectionConfidence: 0.6,
  minTrackingConfidence: 0.6
});
faceMesh.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await faceMesh.send({image: videoElement});
  },
  width: 640,
  height: 480
});
camera.start();