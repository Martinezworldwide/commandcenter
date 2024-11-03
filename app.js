// Set up Three.js scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 20); // Camera positioned farther back

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x1a1a1a); // Background color
document.body.appendChild(renderer.domElement);

// CSS3DRenderer for iframes in 3D space
const cssRenderer = new THREE.CSS3DRenderer();
cssRenderer.setSize(window.innerWidth, window.innerHeight);
cssRenderer.domElement.style.position = 'absolute';
cssRenderer.domElement.style.top = '0';
cssRenderer.domElement.style.backgroundColor = 'rgba(26, 26, 26, 0.8)';
document.body.appendChild(cssRenderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// Raycaster for detecting clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// Function to create clickable iframe panels
function createIframePanel(url, position) {
    const geometry = new THREE.PlaneGeometry(0.2, 0.15); // Much smaller panel size
    const material = new THREE.MeshBasicMaterial({ color: 0x3333ff, opacity: 0.5, transparent: true });
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(position.x, position.y, position.z);
    plane.userData = { url }; // Store URL for click interaction
    scene.add(plane);
}

// Click event to open iframe on click
function onMouseClick(event) {
    // Convert mouse position to normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length > 0) {
        const url = intersects[0].object.userData.url;
        if (url) {
            openIframe(url);
        }
    }
}

// Function to open iframe overlay on click
function openIframe(url) {
    const iframeOverlay = document.createElement('iframe');
    iframeOverlay.src = url;
    iframeOverlay.style.position = 'absolute';
    iframeOverlay.style.top = '10%';
    iframeOverlay.style.left = '10%';
    iframeOverlay.style.width = '80%';
    iframeOverlay.style.height = '80%';
    iframeOverlay.style.border = '2px solid black';
    document.body.appendChild(iframeOverlay);

    // Add a close button
    const closeButton = document.createElement('button');
    closeButton.innerText = 'Close';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '5%';
    closeButton.style.right = '5%';
    closeButton.style.padding = '10px';
    closeButton.style.fontSize = '16px';
    closeButton.style.backgroundColor = 'red';
    closeButton.style.color = 'white';
    document.body.appendChild(closeButton);

    closeButton.onclick = () => {
        document.body.removeChild(iframeOverlay);
        document.body.removeChild(closeButton);
    };
}

// Add event listener for mouse click
window.addEventListener('click', onMouseClick, false);

// Example clickable panels
createIframePanel("https://www.martineztrade.com", { x: -1, y: 0, z: -5 });
createIframePanel("https://martinezworldwide.wixsite.com/martinezworldwide", { x: 1, y: 0, z: -5 });

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
}
animate();
