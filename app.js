// Set up Three.js scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 10);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x1a1a1a); // Set background color for visibility
document.body.appendChild(renderer.domElement);

// CSS3DRenderer for iframes in 3D space
const cssRenderer = new THREE.CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = '0';
cssRenderer.domElement.style.backgroundColor = 'rgba(26, 26, 26, 0.8)'; // Background for CSS renderer
document.body.appendChild(cssRenderer.domElement);

// Ambient and directional lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // General lighting
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Function to create clickable iframe panels
function createIframePanel(url, position) {
    const geometry = new THREE.PlaneGeometry(2, 1.5);
    const material = new THREE.MeshBasicMaterial({ color: 0x3333ff }); // Basic material for testing
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(position.x, position.y, position.z);
    scene.add(plane);

    // Create iframe element
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.width = '400px';
    iframe.style.height = '300px';
    iframe.style.border = 'none';

    // Create CSS3DObject to hold iframe
    const cssObject = new THREE.CSS3DObject(iframe);
    cssObject.position.set(position.x, position.y, position.z);
    cssObject.rotation.y = Math.PI; // Rotate to face the camera
    scene.add(cssObject);
}

// Example clickable panels
createIframePanel("https://www.martineztrade.com", { x: -2, y: 1, z: -5 });
createIframePanel("https://martinezworldwide.wixsite.com/martinezworldwide", { x: 2, y: 1, z: -5 });

// Responsive resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    cssRenderer.render(scene, camera);
    controls.update();
}
animate();


