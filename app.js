// 3D Command Center for Conglomerate Engineering Management
// Main application script

// Initialize global variables
let container, stats;
let camera, scene, renderer, cssRenderer, controls;
let raycaster, mouse;
let nodes = [];
let connections = [];
let TWEEN;

// Configuration parameters
const config = {
    nodeSize: 0.5,
    nodeColor: 0x4fc3f7,
    selectedNodeColor: 0xff9800,
    connectionColor: 0x4fc3f7,
    backgroundIntensity: 0.5,
    autoRotate: true,
    showAxes: false
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    // Make sure TWEEN is available globally
    TWEEN = window.TWEEN;
    
    // Initialize only when DOM is fully loaded to ensure all scripts are available
    init();
    animate();
});

// Initialize the 3D environment
function init() {
    try {
        // Cache DOM elements
        container = document.getElementById('container');
        
        // Set up scene
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a1a);
        
        // Set up camera
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 20);
        
        // Set up lighting
        addLighting();
        
        // Set up renderers
        setupRenderers();
        
        // Add orbit controls
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 5;
        controls.maxDistance = 50;
        controls.autoRotate = config.autoRotate;
        controls.autoRotateSpeed = 0.5;
        
        // Set up raycaster for interaction
        raycaster = new THREE.Raycaster();
        mouse = new THREE.Vector2();
        
        // Add event listeners
        window.addEventListener('resize', onWindowResize, false);
        window.addEventListener('click', onClick, false);
        window.addEventListener('mousemove', onMouseMove, false);
        
        // Create 3D elements
        createNetworkNodes();
        
        // Set up stats monitor
        setupStats();
        
        // Set up GUI
        setupGUI();
        
        // Set camera navigation function
        window.cameraNavigation = moveCamera;
        
        // Hide loading indicator
        setTimeout(() => {
            const loadingElement = document.getElementById('loading');
            if (loadingElement) {
                loadingElement.classList.add('hidden');
            }
        }, 1500);
    } catch (e) {
        console.error("Error initializing 3D environment:", e);
        document.body.innerHTML += `<div style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); background:rgba(0,0,0,0.8); padding:20px; color:white; border-radius:10px;">
            <h2>Error Loading 3D Environment</h2>
            <p>${e.message}</p>
            <p>Please try a different browser or check your internet connection.</p>
        </div>`;
    }
}

// Set up statistics monitor
function setupStats() {
    try {
        stats = new Stats();
        stats.domElement.style.position = 'absolute';
        stats.domElement.style.top = '0px';
        container.appendChild(stats.dom || stats.domElement);
    } catch (e) {
        console.warn('Stats initialization failed:', e);
        // Create dummy stats object
        stats = { update: function() {} };
    }
}

// Set up lighting
function addLighting() {
    // Ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Directional light (sun-like)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 7.5);
    dirLight.castShadow = true;
    scene.add(dirLight);
    
    // Point lights
    const pointLight1 = new THREE.PointLight(0x4fc3f7, 1, 50);
    pointLight1.position.set(0, 10, 0);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xff9800, 1, 50);
    pointLight2.position.set(10, -10, 0);
    scene.add(pointLight2);
}

// Set up WebGL and CSS3D renderers
function setupRenderers() {
    // WebGL renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    
    // CSS3D renderer - Check if available
    if (typeof THREE.CSS3DRenderer === 'function') {
        try {
            cssRenderer = new THREE.CSS3DRenderer();
            cssRenderer.setSize(window.innerWidth, window.innerHeight);
            cssRenderer.domElement.style.position = 'absolute';
            cssRenderer.domElement.style.top = '0';
            cssRenderer.domElement.style.pointerEvents = 'none';
            container.appendChild(cssRenderer.domElement);
        } catch (e) {
            console.warn('CSS3DRenderer failed to initialize:', e);
            // Create a fallback for CSS3DRenderer
            cssRenderer = {
                render: function() {},
                setSize: function() {}
            };
        }
    } else {
        console.warn('THREE.CSS3DRenderer not available, using fallback');
        // Create a fallback for CSS3DRenderer
        cssRenderer = {
            render: function() {},
            setSize: function() {}
        };
    }
}

// Create network nodes and connections
function createNetworkNodes() {
    // Create a group to hold all nodes
    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);
    
    // Define node data
    const nodeData = [
        { id: 1, name: 'Engineering Hub', position: { x: -5, y: 2, z: -10 }, color: 0x4fc3f7, size: 1.0 },
        { id: 2, name: 'Finance Center', position: { x: 5, y: 2, z: -10 }, color: 0xff9800, size: 1.0 },
        { id: 3, name: 'Operations Command', position: { x: 0, y: 5, z: -15 }, color: 0x4caf50, size: 1.0 },
        { id: 4, name: 'HR Department', position: { x: -5, y: -2, z: -10 }, color: 0xe91e63, size: 0.8 },
        { id: 5, name: 'Analytics Suite', position: { x: 5, y: -2, z: -10 }, color: 0x9c27b0, size: 0.8 },
        { id: 6, name: 'Project Alpha', position: { x: -8, y: 0, z: -15 }, color: 0x4fc3f7, size: 0.6 },
        { id: 7, name: 'Project Beta', position: { x: -2, y: 0, z: -15 }, color: 0x4fc3f7, size: 0.6 },
        { id: 8, name: 'Budget Control', position: { x: 8, y: 0, z: -15 }, color: 0xff9800, size: 0.6 },
        { id: 9, name: 'Resource Allocation', position: { x: 2, y: 0, z: -15 }, color: 0x4caf50, size: 0.6 },
        { id: 10, name: 'Team Dashboard', position: { x: -4, y: -5, z: -12 }, color: 0xe91e63, size: 0.6 },
        { id: 11, name: 'Data Insights', position: { x: 4, y: -5, z: -12 }, color: 0x9c27b0, size: 0.6 },
        { id: 12, name: 'Command Center', position: { x: 0, y: 0, z: -5 }, color: 0xffffff, size: 1.2 }
    ];
    
    // Define connections between nodes
    const connectionData = [
        { from: 12, to: 1 },
        { from: 12, to: 2 },
        { from: 12, to: 3 },
        { from: 12, to: 4 },
        { from: 12, to: 5 },
        { from: 1, to: 6 },
        { from: 1, to: 7 },
        { from: 2, to: 8 },
        { from: 3, to: 9 },
        { from: 4, to: 10 },
        { from: 5, to: 11 }
    ];
    
    // Create nodes
    nodeData.forEach(data => {
        const node = createNode(data);
        nodeGroup.add(node);
        nodes.push(node);
    });
    
    // Create connections
    connectionData.forEach(conn => {
        const fromNode = nodes.find(n => n.userData.id === conn.from);
        const toNode = nodes.find(n => n.userData.id === conn.to);
        
        if (fromNode && toNode) {
            const connection = createConnection(fromNode, toNode);
            nodeGroup.add(connection);
            connections.push(connection);
        }
    });
    
    // Add floating particles
    addParticles();
}

// Create a single node
function createNode(data) {
    // Create a group for the node
    const nodeGroup = new THREE.Group();
    nodeGroup.position.set(data.position.x, data.position.y, data.position.z);
    nodeGroup.userData = {
        id: data.id,
        name: data.name,
        type: 'node',
        originalColor: data.color,
        originalPosition: { ...data.position }
    };
    
    // Create the main sphere
    const geometry = new THREE.SphereGeometry(data.size * config.nodeSize, 32, 32);
    const material = new THREE.MeshPhongMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.9,
        shininess: 100
    });
    const sphere = new THREE.Mesh(geometry, material);
    nodeGroup.add(sphere);
    
    // Add glow effect
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: data.color,
        transparent: true,
        opacity: 0.2
    });
    const glowSphere = new THREE.Mesh(
        new THREE.SphereGeometry(data.size * config.nodeSize * 1.2, 32, 32),
        glowMaterial
    );
    nodeGroup.add(glowSphere);
    
    // Add label - check if CSS3DObject is available
    if (typeof THREE.CSS3DObject === 'function') {
        try {
            const labelDiv = document.createElement('div');
            labelDiv.className = 'tooltip';
            labelDiv.textContent = data.name;
            labelDiv.style.opacity = '0';
            
            const label = new THREE.CSS3DObject(labelDiv);
            label.position.set(0, data.size * config.nodeSize * 1.5, 0);
            nodeGroup.add(label);
        } catch (e) {
            console.warn('CSS3DObject failed to initialize:', e);
            // Add a fallback label using sprite
            createFallbackLabel(nodeGroup, data);
        }
    } else {
        // Create a fallback label using sprite
        createFallbackLabel(nodeGroup, data);
    }
    
    // Add animation
    animateNode(nodeGroup);
    
    // Add node to the class property
    nodeGroup.className = 'node';
    
    return nodeGroup;
}

// Create a fallback label using sprite
function createFallbackLabel(nodeGroup, data) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 64;
    
    context.fillStyle = 'rgba(0, 0, 0, 0.7)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    context.font = '24px Arial';
    context.fillStyle = '#4fc3f7';
    context.textAlign = 'center';
    context.fillText(data.name, 128, 40);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({ 
        map: texture,
        transparent: true,
        opacity: 0.7
    });
    
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(2, 0.5, 1);
    sprite.position.set(0, data.size * config.nodeSize * 1.5, 0);
    sprite.visible = false;  // Initially hidden
    sprite.userData = { isLabel: true };
    nodeGroup.add(sprite);
}

// Create a connection between nodes
function createConnection(fromNode, toNode) {
    // Calculate start and end points
    const startPoint = fromNode.position.clone();
    const endPoint = toNode.position.clone();
    
    // Create curve for the connection
    const mid = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5);
    mid.z -= Math.random() * 2; // Add some randomness to the curve
    
    const curve = new THREE.QuadraticBezierCurve3(
        startPoint,
        mid,
        endPoint
    );
    
    // Create the tube geometry
    const tubeGeometry = new THREE.TubeGeometry(
        curve,
        20,
        0.05,
        8,
        false
    );
    
    // Calculate color based on nodes
    const colorFrom = new THREE.Color(fromNode.userData.originalColor);
    const colorTo = new THREE.Color(toNode.userData.originalColor);
    const connectionColor = colorFrom.clone().lerp(colorTo, 0.5);
    
    // Create material with gradient
    const material = new THREE.MeshPhongMaterial({
        color: connectionColor,
        transparent: true,
        opacity: 0.6,
        shininess: 50
    });
    
    // Create mesh
    const tube = new THREE.Mesh(tubeGeometry, material);
    tube.userData = {
        type: 'connection',
        from: fromNode.userData.id,
        to: toNode.userData.id
    };
    
    // Add the connection class
    tube.className = 'connection';
    
    return tube;
}

// Add particle system for background effect
function addParticles() {
    const particleCount = 500;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    // Create particles with random positions
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 100;
        positions[i3 + 1] = (Math.random() - 0.5) * 100;
        positions[i3 + 2] = (Math.random() - 0.5) * 100;
        
        // Create slight color variations
        const colorChoice = Math.random();
        if (colorChoice < 0.3) {
            colors[i3] = 0.3; // R
            colors[i3 + 1] = 0.7; // G
            colors[i3 + 2] = 0.9; // B
        } else if (colorChoice < 0.6) {
            colors[i3] = 0.9; // R
            colors[i3 + 1] = 0.6; // G
            colors[i3 + 2] = 0.2; // B
        } else {
            colors[i3] = 0.2; // R
            colors[i3 + 1] = 0.8; // G
            colors[i3 + 2] = 0.5; // B
        }
        
        // Random sizes
        sizes[i] = Math.random() * 0.1 + 0.05;
    }
    
    // Set attributes
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particles.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    // Create particle material
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.6
    });
    
    // Create particle system
    const particleSystem = new THREE.Points(particles, particleMaterial);
    scene.add(particleSystem);
    
    // Animate particles
    function animateParticles() {
        const positions = particles.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            
            // Slow continuous movement
            positions[i3 + 1] += Math.sin(Date.now() * 0.001 + i) * 0.01;
            positions[i3] += Math.cos(Date.now() * 0.001 + i) * 0.01;
            positions[i3 + 2] += Math.sin(Date.now() * 0.0007 + i) * 0.01;
            
            // Reset particles that go too far
            const distance = Math.sqrt(
                positions[i3] ** 2 + 
                positions[i3 + 1] ** 2 + 
                positions[i3 + 2] ** 2
            );
            
            if (distance > 50) {
                positions[i3] = (Math.random() - 0.5) * 100;
                positions[i3 + 1] = (Math.random() - 0.5) * 100;
                positions[i3 + 2] = (Math.random() - 0.5) * 100;
            }
        }
        
        particles.attributes.position.needsUpdate = true;
        requestAnimationFrame(animateParticles);
    }
    
    animateParticles();
}

// Add subtle animation to nodes
function animateNode(node) {
    const initialY = node.position.y;
    const speed = 0.0005 + Math.random() * 0.0005;
    const amplitude = 0.1 + Math.random() * 0.1;
    
    function animate() {
        node.position.y = initialY + Math.sin(Date.now() * speed) * amplitude;
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Set up dat.GUI for interactive controls
function setupGUI() {
    const gui = new dat.GUI({ autoPlace: false });
    gui.width = 250;
    
    const controlsFolder = gui.addFolder('Display Controls');
    controlsFolder.add(config, 'autoRotate').name('Auto Rotate').onChange(value => {
        controls.autoRotate = value;
    });
    controlsFolder.add(config, 'showAxes').name('Show Axes').onChange(value => {
        toggleAxes(value);
    });
    controlsFolder.addColor(config, 'nodeColor').name('Node Color').onChange(value => {
        updateNodesColor(value);
    });
    controlsFolder.open();
    
    const cameraFolder = gui.addFolder('Camera');
    cameraFolder.add(camera.position, 'z', 5, 50).name('Zoom');
    cameraFolder.add(controls, 'autoRotateSpeed', 0, 5).name('Rotation Speed');
    
    // Position GUI in the top left
    const guiContainer = document.createElement('div');
    guiContainer.style.position = 'absolute';
    guiContainer.style.top = '10px';
    guiContainer.style.right = '10px';
    guiContainer.appendChild(gui.domElement);
    document.body.appendChild(guiContainer);
}

// Toggle axes helper
function toggleAxes(visible) {
    // Remove existing axes if present
    const existingAxes = scene.getObjectByName('axesHelper');
    if (existingAxes) {
        scene.remove(existingAxes);
    }
    
    if (visible) {
        const axesHelper = new THREE.AxesHelper(10);
        axesHelper.name = 'axesHelper';
        scene.add(axesHelper);
    }
}

// Update node colors
function updateNodesColor(color) {
    nodes.forEach(node => {
        if (node.children[0] && node.children[0].material) {
            node.children[0].material.color.set(color);
        }
        if (node.children[1] && node.children[1].material) {
            node.children[1].material.color.set(color);
        }
    });
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    cssRenderer.setSize(window.innerWidth, window.innerHeight);
}

// Handle mouse click events
function onClick(event) {
    event.preventDefault();
    
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update the picking ray with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);
    
    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    // Handle node clicks
    if (intersects.length > 0) {
        const object = findParentWithUserData(intersects[0].object);
        
        if (object && object.userData && object.userData.type === 'node') {
            // Display node info
            showNodeInfo(object);
            
            // Highlight the node
            highlightNode(object);
        }
    }
}

// Find parent object with userData
function findParentWithUserData(object) {
    let currentObj = object;
    
    while (currentObj && (!currentObj.userData || !currentObj.userData.type)) {
        currentObj = currentObj.parent;
    }
    
    return currentObj;
}

// Show information about the node
function showNodeInfo(node) {
    console.log(`Node clicked: ${node.userData.name}`);
    
    // Create info panel
    const infoPanel = document.createElement('div');
    infoPanel.className = 'panel';
    infoPanel.style.top = '100px';
    infoPanel.style.left = '20px';
    infoPanel.style.width = '300px';
    
    // Panel content
    infoPanel.innerHTML = `
        <div class="panel-header">
            <div class="panel-title">${node.userData.name}</div>
            <button class="close-btn">×</button>
        </div>
        <div class="panel-content">
            <p><strong>ID:</strong> ${node.userData.id}</p>
            <p><strong>Status:</strong> Online</p>
            <p><strong>Connected to:</strong> ${getConnectedNodes(node.userData.id).join(', ')}</p>
            <p><strong>Last updated:</strong> ${new Date().toLocaleString()}</p>
            <button id="focus-btn" class="action-btn">Focus View</button>
        </div>
    `;
    
    document.body.appendChild(infoPanel);
    
    // Add event listeners
    const closeBtn = infoPanel.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(infoPanel);
    });
    
    const focusBtn = infoPanel.querySelector('#focus-btn');
    focusBtn.addEventListener('click', () => {
        moveCamera(node.userData.originalPosition);
    });
}

// Get list of connected node names
function getConnectedNodes(nodeId) {
    const connectedNames = [];
    
    connections.forEach(conn => {
        if (conn.userData.from === nodeId) {
            const target = nodes.find(n => n.userData.id === conn.userData.to);
            if (target) {
                connectedNames.push(target.userData.name);
            }
        } else if (conn.userData.to === nodeId) {
            const source = nodes.find(n => n.userData.id === conn.userData.from);
            if (source) {
                connectedNames.push(source.userData.name);
            }
        }
    });
    
    return connectedNames;
}

// Highlight a node
function highlightNode(node) {
    // Reset all nodes to original color
    nodes.forEach(n => {
        if (n.children[0] && n.children[0].material) {
            n.children[0].material.color.set(n.userData.originalColor);
            n.children[0].material.emissive = new THREE.Color(0x000000);
        }
    });
    
    // Highlight selected node
    if (node.children[0] && node.children[0].material) {
        node.children[0].material.color.set(config.selectedNodeColor);
        node.children[0].material.emissive = new THREE.Color(config.selectedNodeColor).multiplyScalar(0.5);
    }
    
    // Highlight connections
    connections.forEach(conn => {
        if (conn.userData.from === node.userData.id || conn.userData.to === node.userData.id) {
            conn.material.color.set(config.selectedNodeColor);
            conn.material.opacity = 0.8;
        } else {
            const fromNode = nodes.find(n => n.userData.id === conn.userData.from);
            const toNode = nodes.find(n => n.userData.id === conn.userData.to);
            
            if (fromNode && toNode) {
                const colorFrom = new THREE.Color(fromNode.userData.originalColor);
                const colorTo = new THREE.Color(toNode.userData.originalColor);
                const connectionColor = colorFrom.clone().lerp(colorTo, 0.5);
                conn.material.color.set(connectionColor);
                conn.material.opacity = 0.6;
            }
        }
    });
}

// Handle mouse move events
function onMouseMove(event) {
    event.preventDefault();
    
    // Calculate mouse position
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update the picking ray
    raycaster.setFromCamera(mouse, camera);
    
    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children, true);
    
    // Reset cursor style
    document.body.style.cursor = 'default';
    
    // Hide all tooltips (CSS3D)
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(tooltip => {
        tooltip.style.opacity = '0';
    });
    
    // Hide all sprite labels (fallback)
    nodes.forEach(node => {
        node.traverse(child => {
            if (child.userData && child.userData.isLabel) {
                child.visible = false;
            }
        });
    });
    
    // Show tooltip on hover
    if (intersects.length > 0) {
        const object = findParentWithUserData(intersects[0].object);
        
        if (object && object.userData && object.userData.type === 'node') {
            document.body.style.cursor = 'pointer';
            
            // Show tooltip - try CSS3D first
            let foundCSS3DTooltip = false;
            object.traverse(child => {
                if (child instanceof THREE.CSS3DObject) {
                    child.element.style.opacity = '1';
                    foundCSS3DTooltip = true;
                }
            });
            
            // If no CSS3D tooltip found, use sprite label
            if (!foundCSS3DTooltip) {
                object.traverse(child => {
                    if (child.userData && child.userData.isLabel) {
                        child.visible = true;
                    }
                });
            }
        }
    }
}

// Camera movement with TWEEN
function moveCamera(targetPosition) {
    // Create a copy of current camera position
    const startPosition = {
        x: camera.position.x,
        y: camera.position.y,
        z: camera.position.z
    };
    
    // Calculate target position (adjusted for viewing)
    const target = {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z + 15 // Position camera 15 units away from the target
    };
    
    // Create the tween
    const tween = new TWEEN.Tween(startPosition)
        .to(target, 2000)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
            camera.position.set(startPosition.x, startPosition.y, startPosition.z);
            camera.lookAt(targetPosition.x, targetPosition.y, targetPosition.z);
        })
        .onComplete(() => {
            controls.target.set(targetPosition.x, targetPosition.y, targetPosition.z);
        })
        .start();
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update controls
    controls.update();
    
    // Update statistics
    if (stats) {
        stats.update();
    }
    
    // Update TWEEN animations
    if (window.TWEEN) {
        window.TWEEN.update();
    }
    
    // Render scene
    renderer.render(scene, camera);
    
    // Only render CSS if the renderer is properly initialized
    if (cssRenderer && typeof cssRenderer.render === 'function') {
        try {
            cssRenderer.render(scene, camera);
        } catch (e) {
            console.warn('CSS3DRenderer render failed:', e);
        }
    }
}
