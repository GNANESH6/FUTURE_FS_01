import React, { useEffect, useRef, useMemo } from "react";
import { 
  FaReact, FaJava, FaGithub, FaGitAlt, FaHtml5, FaCss3Alt, FaLinkedin, FaNodeJs
} from "react-icons/fa";
import { 
  SiMongodb, SiJavascript, SiLeetcode, SiExpress
} from "react-icons/si";

const techList = [
  { id: "react", name: "React", Icon: FaReact, color: "#61dafb" },
  { id: "java", name: "Java", Icon: FaJava, color: "#f89820" },
  { id: "mongodb", name: "MongoDB", Icon: SiMongodb, color: "#47a248" },
  { id: "github", name: "GitHub", Icon: FaGithub, color: "#e6edf3" },
  { id: "git", name: "Git", Icon: FaGitAlt, color: "#f05032" },
  { id: "html", name: "HTML5", Icon: FaHtml5, color: "#e34f26" },
  { id: "css", name: "CSS3", Icon: FaCss3Alt, color: "#1572b6" },
  { id: "js", name: "JavaScript", Icon: SiJavascript, color: "#f7df1e" },
  { id: "leetcode", name: "LeetCode", Icon: SiLeetcode, color: "#ffa116" },
  { id: "linkedin", name: "LinkedIn", Icon: FaLinkedin, color: "#0a66c2" },
  { id: "nodejs", name: "Node.js", Icon: FaNodeJs, color: "#339933" },
  { id: "express", name: "Express", Icon: SiExpress, color: "#ffffff" },
];

const randomRange = (min, max) => Math.random() * (max - min) + min;

export default function CinematicBackground() {
  const requestRef = useRef(null);
  const nodesRef = useRef([]);

  // Generate elements in 3 depth layers
  const elements = useMemo(() => {
    const generated = [];
    let idCounter = 0;
    
    const layers = [
      { depth: 1, count: 1, scaleRange: [1.0, 1.5], blur: 3, opacity: 0.35, speedRange: [0.02, 0.05] }, 
      { depth: 2, count: 1, scaleRange: [0.6, 1.0], blur: 1, opacity: 0.55, speedRange: [0.01, 0.03] }, 
      { depth: 3, count: 1, scaleRange: [0.3, 0.5], blur: 2, opacity: 0.4, speedRange: [0.005, 0.015] } 
    ];

    layers.forEach(layer => {
      for (let c = 0; c < layer.count; c++) {
        techList.forEach((tech) => {
          // Random direction angle
          const angle = randomRange(0, Math.PI * 2);
          const speed = randomRange(layer.speedRange[0], layer.speedRange[1]);

          generated.push({
            ...tech,
            dbId: idCounter++,
            layer: layer.depth,
            x: randomRange(0, 100), // VW %
            y: randomRange(0, 100), // VH %
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            scale: randomRange(layer.scaleRange[0], layer.scaleRange[1]),
            blur: layer.blur,
            opacity: layer.opacity,
            floatDuration: randomRange(15, 30), // Seconds for CSS animation (3D tilt)
            floatDelay: randomRange(-30, 0),
            rotateX: randomRange(-25, 25),
            rotateY: randomRange(-25, 25),
            rotateZ: randomRange(-15, 15)
          });
        });
      }
    });
    return generated;
  }, []);

  // Continuous drift animation loop
  useEffect(() => {
    // Keep a mutable copy of positions for the animation loop
    const positions = elements.map(el => ({ x: el.x, y: el.y, vx: el.vx, vy: el.vy }));

    const animateDrift = () => {
      nodesRef.current.forEach((node, index) => {
        if (!node) return;
        const pos = positions[index];
        
        // Update positions
        pos.x += pos.vx;
        pos.y += pos.vy;

        // Wrap around screen boundaries with some padding
        if (pos.x < -10) pos.x = 110;
        if (pos.x > 110) pos.x = -10;
        if (pos.y < -10) pos.y = 110;
        if (pos.y > 110) pos.y = -10;

        // Apply direct DOM transform for high performance
        node.style.left = `${pos.x}vw`;
        node.style.top = `${pos.y}vh`;
      });
      requestRef.current = requestAnimationFrame(animateDrift);
    };

    requestRef.current = requestAnimationFrame(animateDrift);

    return () => cancelAnimationFrame(requestRef.current);
  }, [elements]);

  return (
    <div 
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        overflow: "hidden",
        pointerEvents: "none",
        perspective: "1200px",
        background: "linear-gradient(135deg, #0b0f19 0%, #161d2e 100%)" // Match portfolio global bg colors
      }}
    >
      <style>
        {`
          @keyframes subtleFloat {
            0% { transform: translateY(0px) rotate3d(1, 1, 1, 0deg); }
            50% { transform: translateY(-30px) rotate3d(1, 1, 1, 10deg); }
            100% { transform: translateY(0px) rotate3d(1, 1, 1, 0deg); }
          }
          .tech-node-3d {
            pointer-events: none;
            transform-style: preserve-3d;
            border-radius: 20px;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.06);
            box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            display: flex;
            align-items: center;
            justify-content: center;
          }
          .tech-node-3d::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 20px;
            background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%);
            opacity: 0.8;
          }
        `}
      </style>

      <div style={{ position: "absolute", inset: 0, zIndex: 1, pointerEvents: "none" }}>
        {elements.map((el, index) => {
          const IconComponent = el.Icon;
          return (
            <div
              key={el.dbId}
              ref={(node) => (nodesRef.current[index] = node)}
              style={{
                position: "absolute",
                left: `${el.x}vw`,
                top: `${el.y}vh`,
                zIndex: 10 - el.layer,
                willChange: "left, top"
              }}
            >
              <div
                className="tech-node-3d"
                style={{
                  width: "70px",
                  height: "70px",
                  color: el.color,
                  opacity: el.opacity,
                  filter: el.blur > 0 ? `blur(${el.blur}px)` : 'none',
                  transform: `scale(${el.scale}) rotateX(${el.rotateX}deg) rotateY(${el.rotateY}deg) rotateZ(${el.rotateZ}deg)`,
                  animation: `subtleFloat ${el.floatDuration}s infinite ease-in-out`,
                  animationDelay: `${el.floatDelay}s`,
                }}
              >
                <div style={{ width: "50%", height: "50%", display: "flex", alignItems: "center", justifyContent: "center", transform: "translateZ(20px)" }}>
                  <IconComponent style={{ width: "100%", height: "100%", filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.5))" }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
