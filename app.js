// Set up Three.js scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// CSS3DRenderer for iframes in 3D space
const cssRenderer = new THREE.CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = '0';
document.body.appendChild(cssRenderer.domElement);

// Lighting
const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(10, 10, 10);
scene.add(light);

// Create clickable panels with iframes
function createIframePanel(url, position) {
    // Three.js plane for visual reference
    const geometry = new THREE.PlaneGeometry(3, 2);
    const material = new THREE.MeshBasicMaterial({ color: 0x3333ff, opacity: 0.5, transparent: true });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(position.x, position.y, position.z);
    scene.add(plane);

    // Create iframe element
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.width = '600px';
    iframe.style.height = '400px';
    iframe.style.border = 'none';

    // Create CSS3DObject to hold iframe
    const cssObject = new THREE.CSS3DObject(iframe);
    cssObject.position.set(position.x, position.y, position.z);
    cssObject.rotation.y = Math.PI; // Rotate to face the camera
    scene.add(cssObject);
}

// Example panels with links
createIframePanel("https://example1.com", { x: -3, y: 1, z: -5 });
createIframePanel("https://example2.com", { x: 3, y: 1, z: -5 });

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    cssRenderer.render(scene, camera);
}
animate();

