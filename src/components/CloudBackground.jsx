import { useEffect, useRef } from "react";
import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function CloudBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Scene & Camera Setup (Jesko Jets perspective)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      32,
      window.innerWidth / window.innerHeight,
      1,
      3000
    );
    camera.position.z = 6000;

    // 2. Color Definition: Deep Sky Blue -> Luxury Midnight Navy
    const skyBlue = new THREE.Color("#1f5383");
    const midnightNavy = new THREE.Color("#091626");
    const currentFogColor = skyBlue.clone();

    scene.background = currentFogColor;
    const fog = new THREE.Fog(currentFogColor, -100, 3000);
    scene.fog = fog;

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Load Cloud Texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("/cloud.png", () => {
      renderer.render(scene, camera);
    });
    texture.magFilter = THREE.LinearFilter;
    texture.minFilter = THREE.LinearMipMapLinearFilter;

    // 5. Custom Atmospheric Volumetric Cloud Shader
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D map;
      uniform vec3 fogColor;
      uniform float fogNear;
      uniform float fogFar;
      varying vec2 vUv;

      void main() {
        float depth = gl_FragCoord.z / gl_FragCoord.w;
        float fogFactor = smoothstep(fogNear, fogFar, depth);
        vec4 texColor = texture2D(map, vUv);
        
        if (texColor.a < 0.01) discard;

        // Soft natural cloud lighting with ambient sky tint
        vec3 sunLitCloud = mix(texColor.rgb * 1.08, fogColor, 0.15);
        vec3 finalColor = mix(sunLitCloud, fogColor, fogFactor * 0.95);
        float finalAlpha = texColor.a * (1.0 - fogFactor * 0.88);

        gl_FragColor = vec4(finalColor, finalAlpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        map: { value: texture },
        fogColor: { value: currentFogColor },
        fogNear: { value: fog.near },
        fogFar: { value: fog.far },
      },
      vertexShader,
      fragmentShader,
      depthWrite: false,
      depthTest: false,
      transparent: true,
    });

    // 6. Generate Realistic Volumetric Cloud Field
    const basePlane = new THREE.PlaneGeometry(64, 64);
    const count = 2000;
    const geometries = [];
    const dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      dummy.position.x = Math.random() * 1200 - 600;
      dummy.position.y = -Math.random() * Math.random() * 260 - 20;
      dummy.position.z = i * (8000 / count);
      dummy.rotation.z = Math.random() * Math.PI;
      dummy.scale.x = dummy.scale.y = Math.random() * Math.random() * 1.8 + 0.6;
      dummy.updateMatrix();

      const cloned = basePlane.clone();
      cloned.applyMatrix4(dummy.matrix);
      geometries.push(cloned);
    }

    const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries);
    const cloudMesh = new THREE.Mesh(mergedGeometry, material);
    scene.add(cloudMesh);

    // Upper Atmospheric Wisps Layer
    const upperGeometries = [];
    for (let i = 0; i < 450; i++) {
      dummy.position.x = Math.random() * 1300 - 650;
      dummy.position.y = Math.random() * 180 + 30;
      dummy.position.z = i * (8000 / 450);
      dummy.rotation.z = Math.random() * Math.PI;
      dummy.scale.x = dummy.scale.y = Math.random() * Math.random() * 2.2 + 0.8;
      dummy.updateMatrix();

      const cloned = basePlane.clone();
      cloned.applyMatrix4(dummy.matrix);
      upperGeometries.push(cloned);
    }
    const upperMergedGeometry = BufferGeometryUtils.mergeGeometries(upperGeometries);
    const upperMesh = new THREE.Mesh(upperMergedGeometry, material);
    scene.add(upperMesh);

    // 7. GSAP ScrollTrigger: Interpolate Environment Colors from Sky Blue to Sandy Beige
    const scrollProxy = { progress: 0 };

    const scrollTrigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        gsap.to(scrollProxy, {
          progress: self.progress,
          duration: 0.6,
          ease: "power1.out",
          onUpdate: () => {
            currentFogColor.lerpColors(skyBlue, midnightNavy, scrollProxy.progress);
            scene.background = currentFogColor;
            fog.color.copy(currentFogColor);
            material.uniforms.fogColor.value.copy(currentFogColor);
          },
        });
      },
    });

    // 8. Continuous Slow, Peaceful Forward Flying Motion
    let animationFrameId;
    let startTime = performance.now();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Slow and graceful flight speed
      const elapsed = (performance.now() - startTime) * 0.009;
      const position = elapsed % 8000;
      camera.position.z = -position + 8000;

      // Gentle natural cockpit sway
      camera.position.x = Math.sin(elapsed * 0.0003) * 30;
      camera.position.y = Math.cos(elapsed * 0.0004) * 12;

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Handling
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      scrollTrigger.kill();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      material.dispose();
      basePlane.dispose();
      mergedGeometry.dispose();
      upperMergedGeometry.dispose();
      texture.dispose();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none -z-10 h-full w-full overflow-hidden"
    />
  );
}
