'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { useGameStore } from '@/lib/game/store'
import * as THREE from 'three'

interface OceanProps {
  size?: number
  quality?: 'low' | 'medium' | 'high'
}

export function Ocean({ size = 500, quality = 'high' }: OceanProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { player } = useGameStore()
  
  const segments = quality === 'high' ? 150 : quality === 'medium' ? 80 : 32

  // Weather-reactive wave parameters
  const weatherType = player?.weather?.current?.type ?? 'clear'
  const windSpeed = player?.weather?.current?.windSpeed ?? 5

  const waveParams = useMemo(() => {
    const params: Record<string, { bigElevation: number; bigFreq: [number, number]; bigSpeed: number; smallElevation: number; smallFreq: number; smallSpeed: number; depthColor: string; surfaceColor: string; foamColor: string }> = {
      clear:    { bigElevation: 0.15, bigFreq: [2, 1.5], bigSpeed: 0.5, smallElevation: 0.08, smallFreq: 3, smallSpeed: 0.2, depthColor: '#0a2342', surfaceColor: '#1a5f7a', foamColor: '#e0f2fe' },
      cloudy:   { bigElevation: 0.25, bigFreq: [2.5, 1.8], bigSpeed: 0.7, smallElevation: 0.12, smallFreq: 3.5, smallSpeed: 0.3, depthColor: '#0d1f33', surfaceColor: '#2a4f6a', foamColor: '#cbd5e1' },
      rain:     { bigElevation: 0.4, bigFreq: [3, 2], bigSpeed: 1.0, smallElevation: 0.18, smallFreq: 4, smallSpeed: 0.4, depthColor: '#0a1520', surfaceColor: '#1e3a5f', foamColor: '#94a3b8' },
      snow:     { bigElevation: 0.3, bigFreq: [2.5, 2], bigSpeed: 0.8, smallElevation: 0.15, smallFreq: 3.5, smallSpeed: 0.35, depthColor: '#1a2a3a', surfaceColor: '#3a5a7a', foamColor: '#f1f5f9' },
      fog:      { bigElevation: 0.1, bigFreq: [1.5, 1], bigSpeed: 0.3, smallElevation: 0.05, smallFreq: 2.5, smallSpeed: 0.15, depthColor: '#1a2530', surfaceColor: '#2a3a4a', foamColor: '#9ca3af' },
      storm:    { bigElevation: 0.8, bigFreq: [4, 3], bigSpeed: 1.5, smallElevation: 0.3, smallFreq: 5, smallSpeed: 0.6, depthColor: '#050d18', surfaceColor: '#1a2a3a', foamColor: '#64748b' },
      blizzard: { bigElevation: 0.6, bigFreq: [3.5, 2.5], bigSpeed: 1.2, smallElevation: 0.25, smallFreq: 4.5, smallSpeed: 0.5, depthColor: '#1a2535', surfaceColor: '#2a4a5a', foamColor: '#e2e8f0' },
      aurora:   { bigElevation: 0.12, bigFreq: [1.8, 1.2], bigSpeed: 0.4, smallElevation: 0.06, smallFreq: 2.5, smallSpeed: 0.2, depthColor: '#0a1628', surfaceColor: '#1a3a5a', foamColor: '#22c55e' },
      whiteout: { bigElevation: 1.0, bigFreq: [5, 4], bigSpeed: 2.0, smallElevation: 0.4, smallFreq: 6, smallSpeed: 0.8, depthColor: '#1a1a1a', surfaceColor: '#2a2a2a', foamColor: '#ffffff' },
    }
    return params[weatherType] ?? params.clear
  }, [weatherType])

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uBigWavesElevation: { value: waveParams.bigElevation },
      uBigWavesFrequency: { value: new THREE.Vector2(...waveParams.bigFreq) },
      uBigWavesSpeed: { value: waveParams.bigSpeed },
      uSmallWavesElevation: { value: waveParams.smallElevation },
      uSmallWavesFrequency: { value: waveParams.smallFreq },
      uSmallWavesSpeed: { value: waveParams.smallSpeed },
      uSmallWavesIterations: { value: quality === 'high' ? 5 : quality === 'medium' ? 3 : 2 },
      uDepthColor: { value: new THREE.Color(waveParams.depthColor) },
      uSurfaceColor: { value: new THREE.Color(waveParams.surfaceColor) },
      uColorOffset: { value: 0.1 },
      uColorMultiplier: { value: 4 },
      uFogColor: { value: new THREE.Color('#0a1628') },
      uFogNear: { value: 50 },
      uFogFar: { value: 200 },
      uFoamColor: { value: new THREE.Color(waveParams.foamColor) },
      uWindSpeed: { value: windSpeed },
      uWaveChoppiness: { value: weatherType === 'storm' || weatherType === 'blizzard' ? 0.8 : weatherType === 'rain' ? 0.5 : 0.2 },
      uSunDirection: { value: new THREE.Vector3(1, 0.5, 1).normalize() },
      uPlayerPos: { value: new THREE.Vector3(0, 0, 0) },
      uWakeRadius: { value: 8 },
      uWakeIntensity: { value: 0.3 },
    }),
    [quality, waveParams, windSpeed, weatherType]
  )

  useFrame((_, delta) => {
    if (!materialRef.current) return
    const m = materialRef.current.uniforms
    m.uTime.value += delta
    const pos = player?.position
    if (pos) {
      m.uPlayerPos.value.set(pos.x, pos.y, pos.z)
    }
    m.uBigWavesElevation.value += (waveParams.bigElevation - m.uBigWavesElevation.value) * 0.02
    m.uBigWavesFrequency.value.lerp(new THREE.Vector2(...waveParams.bigFreq), 0.02)
    m.uBigWavesSpeed.value += (waveParams.bigSpeed - m.uBigWavesSpeed.value) * 0.02
    m.uSmallWavesElevation.value += (waveParams.smallElevation - m.uSmallWavesElevation.value) * 0.02
    m.uSmallWavesFrequency.value += (waveParams.smallFreq - m.uSmallWavesFrequency.value) * 0.02
    m.uSmallWavesSpeed.value += (waveParams.smallSpeed - m.uSmallWavesSpeed.value) * 0.02
    m.uDepthColor.value.lerp(new THREE.Color(waveParams.depthColor), 0.02)
    m.uSurfaceColor.value.lerp(new THREE.Color(waveParams.surfaceColor), 0.02)
    m.uFoamColor.value.lerp(new THREE.Color(waveParams.foamColor), 0.02)
    m.uWindSpeed.value += (windSpeed - m.uWindSpeed.value) * 0.02
    m.uWaveChoppiness.value += ((weatherType === 'storm' || weatherType === 'blizzard' ? 0.8 : weatherType === 'rain' ? 0.5 : 0.2) - m.uWaveChoppiness.value) * 0.02
  })

  const vertexShader = `
    uniform float uTime;
    uniform float uBigWavesElevation;
    uniform vec2 uBigWavesFrequency;
    uniform float uBigWavesSpeed;
    uniform float uSmallWavesElevation;
    uniform float uSmallWavesFrequency;
    uniform float uSmallWavesSpeed;
    uniform float uSmallWavesIterations;
    uniform float uWaveChoppiness;
    uniform vec3 uPlayerPos;
    uniform float uWakeRadius;
    uniform float uWakeIntensity;
    
    varying float vElevation;
    varying vec3 vPosition;
    varying float vFoam;
    varying vec3 vWorldPosition;
    
    vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
    vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
    vec3 fade(vec3 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

    float cnoise(vec3 P){
      vec3 Pi0 = floor(P);
      vec3 Pi1 = Pi0 + vec3(1.0);
      Pi0 = mod(Pi0, 289.0);
      Pi1 = mod(Pi1, 289.0);
      vec3 Pf0 = fract(P);
      vec3 Pf1 = Pf0 - vec3(1.0);
      vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
      vec4 iy = vec4(Pi0.yy, Pi1.yy);
      vec4 iz0 = Pi0.zzzz;
      vec4 iz1 = Pi1.zzzz;
      vec4 ixy = permute(permute(ix) + iy);
      vec4 ixy0 = permute(ixy + iz0);
      vec4 ixy1 = permute(ixy + iz1);
      vec4 gx0 = ixy0 / 7.0;
      vec4 gy0 = fract(floor(gx0) / 7.0) - 0.5;
      gx0 = fract(gx0);
      vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
      vec4 sz0 = step(gz0, vec4(0.0));
      gx0 -= sz0 * (step(0.0, gx0) - 0.5);
      gy0 -= sz0 * (step(0.0, gy0) - 0.5);
      vec4 gx1 = ixy1 / 7.0;
      vec4 gy1 = fract(floor(gx1) / 7.0) - 0.5;
      gx1 = fract(gx1);
      vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
      vec4 sz1 = step(gz1, vec4(0.0));
      gx1 -= sz1 * (step(0.0, gx1) - 0.5);
      gy1 -= sz1 * (step(0.0, gy1) - 0.5);
      vec4 norm0 = taylorInvSqrt(vec4(dot(gx0, gx0), dot(gy0, gy0), dot(gz0, gz0), dot(gx0, gx0)));
      vec4 gxy0_x = vec4(gx0.x, gy0.x, gz0.x, 0.0) * norm0.x;
      vec4 gxy0_y = vec4(gx0.y, gy0.y, gz0.y, 0.0) * norm0.y;
      vec4 gxy0_z = vec4(gx0.z, gy0.z, gz0.z, 0.0) * norm0.z;
      vec4 gxy0_w = vec4(gx0.w, gy0.w, gz0.w, 0.0) * norm0.w;
      vec4 norm1 = taylorInvSqrt(vec4(dot(gx1, gx1), dot(gy1, gy1), dot(gz1, gz1), dot(gx1, gx1)));
      gx1 *= norm1.x; gy1 *= norm1.y;
      float n000 = dot(vec3(gxy0_x.x, gxy0_x.y, gxy0_x.z), Pf0);
      float n100 = dot(vec3(gxy0_y.x, gxy0_y.y, gxy0_y.z), vec3(Pf1.x, Pf0.yz));
      float n010 = dot(vec3(gxy0_z.x, gxy0_z.y, gxy0_z.z), vec3(Pf0.x, Pf1.y, Pf0.z));
      float n110 = dot(vec3(gxy0_w.x, gxy0_w.y, gxy0_w.z), vec3(Pf1.xy, Pf0.z));
      float n001 = dot(vec3(gx1.x,gy1.x,gz1.x), vec3(Pf0.xy, Pf1.z));
      float n101 = dot(vec3(gx1.y,gy1.y,gz1.y), vec3(Pf1.x, Pf0.y, Pf1.z));
      float n011 = dot(vec3(gx1.z,gy1.z,gz1.z), vec3(Pf0.x, Pf1.yz));
      float n111 = dot(vec3(gx1.w,gy1.w,gz1.w), Pf1);
      vec3 fade_xyz = fade(Pf0);
      vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
      vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
      float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
      return 2.2 * n_xyz;
    }
    
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      
      // Big waves with choppiness
      float bigWave1 = sin(modelPosition.x * uBigWavesFrequency.x + uTime * uBigWavesSpeed) *
                       sin(modelPosition.z * uBigWavesFrequency.y + uTime * uBigWavesSpeed);
      float bigWave2 = sin((modelPosition.x + modelPosition.z) * uBigWavesFrequency.x * 0.5 + uTime * uBigWavesSpeed * 0.8) *
                       uWaveChoppiness;
      float elevation = (bigWave1 + bigWave2) * uBigWavesElevation;
      
      // Small detail waves
      for(float i = 1.0; i <= 5.0; i++) {
        if (i > uSmallWavesIterations) break;
        elevation -= abs(cnoise(vec3(modelPosition.xz * uSmallWavesFrequency * i, uTime * uSmallWavesSpeed)) * uSmallWavesElevation / i);
      }
      
      // Player wake effect
      float distToPlayer = distance(modelPosition.xz, uPlayerPos.xz);
      float wakeEffect = smoothstep(uWakeRadius, 0.0, distToPlayer);
      float wakeWave = sin(atan(modelPosition.z - uPlayerPos.z, modelPosition.x - uPlayerPos.x) * 3.0 + uTime * 2.0) * wakeEffect * uWakeIntensity;
      elevation += wakeWave;
      
      modelPosition.y += elevation;
      
      // Foam calculation (whitecaps on wave crests)
      vFoam = smoothstep(uBigWavesElevation * 0.6, uBigWavesElevation * 1.2, elevation) * (0.3 + uWaveChoppiness * 0.5);
      
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      
      gl_Position = projectedPosition;
      
      vElevation = elevation;
      vPosition = modelPosition.xyz;
      vWorldPosition = modelPosition.xyz;
    }
  `

  const fragmentShader = `
    uniform vec3 uDepthColor;
    uniform vec3 uSurfaceColor;
    uniform vec3 uFoamColor;
    uniform float uColorOffset;
    uniform float uColorMultiplier;
    uniform vec3 uFogColor;
    uniform float uFogNear;
    uniform float uFogFar;
    uniform float uTime;
    uniform vec3 uSunDirection;
    
    varying float vElevation;
    varying vec3 vPosition;
    varying float vFoam;
    varying vec3 vWorldPosition;
    
    void main() {
      // Base water color
      float mixStrength = (vElevation + uColorOffset) * uColorMultiplier;
      vec3 color = mix(uDepthColor, uSurfaceColor, clamp(mixStrength, 0.0, 1.0));
      
      // Foam on crests
      color = mix(color, uFoamColor, vFoam);
      
      // Specular highlights (sun reflection)
      vec3 viewDir = normalize(cameraPosition - vWorldPosition);
      vec3 normal = normalize(vec3(
        dFdx(vElevation) * 2.0,
        1.0,
        dFdy(vElevation) * 2.0
      ));
      vec3 halfDir = normalize(uSunDirection + viewDir);
      float spec = pow(max(dot(normal, halfDir), 0.0), 64.0);
      color += vec3(1.0, 0.95, 0.8) * spec * 0.3;
      
      // Subsurface scattering approximation
      float sss = pow(max(dot(viewDir, -uSunDirection), 0.0), 3.0) * 0.15;
      color += vec3(0.1, 0.4, 0.3) * sss;
      
      // Distance fog
      float dist = length(vPosition.xz);
      float fogFactor = smoothstep(uFogNear, uFogFar, dist);
      color = mix(color, uFogColor, fogFactor * 0.6);
      
      // Alpha for edge transparency
      float alpha = 1.0 - smoothstep(uFogFar * 0.8, uFogFar * 1.2, dist);
      
      gl_FragColor = vec4(color, alpha);
    }
  `

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
      <planeGeometry args={[size, size, segments, segments]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}
