import { useState, useEffect, useRef, useCallback, useMemo, createContext, useContext } from "react";
import { FaJava, FaAmazon, FaMicrosoft, FaGithub, FaLinkedinIn, FaFileAlt, FaEnvelope, FaPhoneAlt, FaPaperPlane, FaPause, FaPlay, FaTerminal } from "react-icons/fa";
import { LaptopVisual, InternVisual3D, FaceVisual, RobotVisual } from "./components/ExperienceVisuals";
import {
  SiPython,
  SiJavascript,
  SiReact,
  SiNodedotjs,
  SiTypescript,
  SiDart,
  SiFlutter,
  SiAngular,
  SiMysql,
  SiScala,
  SiFlask,
  SiHtml5,
  SiCss,
  SiGooglecloud,
  SiDocker,
  SiKubernetes,
  SiTensorflow,
  SiFirebase,
  SiNeo4J,
  SiMongodb,
  SiGrafana,
  SiGit,
  SiJenkins,
  SiGitlab,
  SiFigma,
  SiBlender,
  SiFastapi,
  SiPostgresql,
  SiRedis,
  SiStreamlit,
  SiScikitlearn,
  SiPrometheus,
  SiDatabricks
} from "react-icons/si";
import { FaBrain, FaUsersCog, FaVrCardboard, FaCubes } from "react-icons/fa";
import { RocketIcon, ClockIcon, BrainIcon, BoxIcon, StarBadgeIcon, ChartIcon, GradCapIcon, HandSignIcon } from "./components/ThemedIcons";
import resumePdf from "./Nishant_Chaudhary_Resume.pdf";

const ThemeContext = createContext();
const useTheme = () => useContext(ThemeContext);

const themes = {
  dark: {
    bg: "#09090b",
    surface: "rgba(255,255,255,0.02)",
    surfaceHover: "rgba(255,255,255,0.05)",
    border: "rgba(255,255,255,0.06)",
    borderHover: "rgba(255,255,255,0.15)",
    text: "#ffffff",
    textSecondary: "rgba(255,255,255,0.6)",
    textMuted: "rgba(255,255,255,0.3)",
    textHeader: "rgba(255,255,255,0.9)",
    accent: "#00ffc8",
    accent2: "#7850ff",
    scanline: "rgba(0,255,200,0.008)",
    particle1: "0,255,200",
    particle2: "120,80,255",
    glow1: "rgba(0,255,200,",
    glow2: "rgba(120,80,255,",
    cardBg: "rgba(255,255,255,0.02)",
    navBg: "rgba(9,9,11,0.85)",
    selection: "#00ffc840",
  },
  light: {
    bg: "#f5f5f0",
    surface: "rgba(0,0,0,0.02)",
    surfaceHover: "rgba(0,0,0,0.05)",
    border: "rgba(0,0,0,0.08)",
    borderHover: "rgba(0,0,0,0.2)",
    text: "#1a1a2e",
    textSecondary: "rgba(0,0,0,0.6)",
    textMuted: "rgba(0,0,0,0.3)",
    textHeader: "rgba(255,255,255,0.9)",
    accent: "#00997a",
    accent2: "#5a30cc",
    scanline: "rgba(0,150,120,0.01)",
    particle1: "0,153,122",
    particle2: "90,48,204",
    glow1: "rgba(0,153,122,",
    glow2: "rgba(90,48,204,",
    cardBg: "rgba(255,255,255,0.7)",
    navBg: "rgba(245,245,240,0.85)",
    selection: "#00997a40",
  },
};

const useResponsive = () => {
  const [width, setWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1200);
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return {
    isMobile: width < 640,
    isTablet: width >= 640 && width < 1024,
    isDesktop: width >= 1024,
    width,
  };
};

const InteractiveBackground = () => {
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ clientX: -1000, clientY: -1000, px: -1000, py: -1000, speed: 0 });
  const trailRef = useRef([]);
  const { mode, motionOK } = useTheme();
  const t = themes[mode];
  const { isMobile } = useResponsive();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !motionOK) return;
    const ctx = canvas.getContext("2d");
    let particles = [];
    let ripples = [];
    let meteors = [];
    let attractors = [];
    let frame = 0;
    const PARTICLE_COUNT = isMobile ? 50 : 140;
    const MAX_TRAIL = 30;
    const MAX_RIPPLES = 8;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = Math.max(document.body.scrollHeight, window.innerHeight * 5);
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: (Math.random() - 0.5) * 0.6,
        baseR: Math.random() * 2.5 + 0.5,
        r: 0,
        color: Math.random() > 0.5 ? 1 : 2,
        phase: Math.random() * Math.PI * 2,
        freq: 0.005 + Math.random() * 0.01,
        orbitRadius: 0,
        orbitAngle: Math.random() * Math.PI * 2,
        trail: [],
      });
    }

    for (let i = 0; i < (isMobile ? 2 : 5); i++) {
      attractors.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        strength: 0.02 + Math.random() * 0.03,
        radius: 200 + Math.random() * 200,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const spawnMeteor = () => {
      if (meteors.length < 3) {
        const side = Math.random();
        meteors.push({
          x: side > 0.5 ? -50 : canvas.width + 50,
          y: Math.random() * canvas.height * 0.5,
          vx: (side > 0.5 ? 1 : -1) * (3 + Math.random() * 4),
          vy: 2 + Math.random() * 3,
          life: 1,
          length: 60 + Math.random() * 100,
          width: 1 + Math.random() * 2,
        });
      }
    };

    const addRipple = (x, y, maxR) => {
      if (ripples.length < MAX_RIPPLES) {
        ripples.push({ x, y, r: 0, maxR: maxR || 200, life: 1 });
      }
    };

    const draw = () => {
      frame++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Convert viewport coords to document coords every frame so the trail
      // stays glued to the cursor even while scrolling (scroll changes the
      // document position under a stationary cursor).
      const m = mouseRef.current;
      const hasMouse = m.clientX > -999;
      const mx = hasMouse ? m.clientX : -1000;
      const my = hasMouse ? m.clientY + window.scrollY : -1000;
      if (hasMouse) {
        const frameDist = m.px > -999 ? Math.sqrt((mx - m.px) ** 2 + (my - m.py) ** 2) : 0;
        m.speed = m.speed * 0.7 + frameDist * 0.3;
        m.px = mx;
        m.py = my;
      }
      const mSpeed = m.speed;

      if (mx > 0 && my > 0) {
        trailRef.current.push({ x: mx, y: my, life: 1 });
        if (trailRef.current.length > MAX_TRAIL) trailRef.current.shift();
      }

       if (mx > 0 && my > 0 && !isMobile) {
        const cappedSpeed = Math.min(mSpeed, 25);

        const fieldLines = 6;
        for (let i = 0; i < fieldLines; i++) {
          const angle = (i / fieldLines) * Math.PI * 2 + frame * 0.008;
          const innerR = 30 + Math.sin(frame * 0.02 + i) * 10;
          const outerR = 80 + cappedSpeed * 1.5 + Math.sin(frame * 0.015 + i * 0.5) * 20;
          ctx.beginPath();
          ctx.arc(mx, my, innerR + (outerR - innerR) * 0.5, angle - 0.3, angle + 0.3);
          ctx.strokeStyle = `${t.glow1}${Math.min(0.12, 0.05 + cappedSpeed * 0.002)})`;
          ctx.lineWidth = 1.5;
          ctx.stroke();
        }
        const glowRadius = 100 + cappedSpeed * 2;
        const grd = ctx.createRadialGradient(mx, my, 0, mx, my, glowRadius);
        grd.addColorStop(0, `${t.glow1}${Math.min(0.06, 0.03 + cappedSpeed * 0.001)})`);
        grd.addColorStop(0.4, `${t.glow2}${0.012})`);
        grd.addColorStop(1, `${t.glow1}0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(mx, my, glowRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      if (trailRef.current.length > 1 && !isMobile) {
        for (let i = 1; i < trailRef.current.length; i++) {
          const p = trailRef.current[i - 1];
          const c = trailRef.current[i];
          const alpha = (i / trailRef.current.length) * 0.4;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(c.x, c.y);
          ctx.strokeStyle = `${t.glow1}${alpha})`;
          ctx.lineWidth = (i / trailRef.current.length) * 3;
          ctx.stroke();
        }
        trailRef.current.forEach(p => { p.life -= 0.03; });
        trailRef.current = trailRef.current.filter(p => p.life > 0);
      }

      ripples.forEach(rip => {
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
        ctx.strokeStyle = `${t.glow1}${rip.life * 0.3})`;
        ctx.lineWidth = 2 * rip.life;
        ctx.stroke();
        rip.r += 3;
        rip.life -= 0.015;
      });
      ripples = ripples.filter(r => r.life > 0);

      if (frame % 180 === 0) spawnMeteor();
      meteors.forEach(m => {
        const grad = ctx.createLinearGradient(
          m.x, m.y, m.x - m.vx * m.length * 0.3, m.y - m.vy * m.length * 0.3
        );
        grad.addColorStop(0, `${t.glow1}${m.life * 0.6})`);
        grad.addColorStop(1, `${t.glow1}0)`);
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - m.vx * m.length * 0.3, m.y - m.vy * m.length * 0.3);
        ctx.strokeStyle = grad;
        ctx.lineWidth = m.width;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(m.x, m.y, Math.max(0.1, 3 * m.life), 0, Math.PI * 2);
        ctx.fillStyle = `${t.glow1}${m.life * 0.8})`;
        ctx.fill();
        m.x += m.vx;
        m.y += m.vy;
        m.life -= 0.003;
      });
      meteors = meteors.filter(m => m.life > 0 && m.x > -200 && m.x < canvas.width + 200);

      const connectionMaxCheck = isMobile ? 80 : particles.length;
      particles.forEach((p, i) => {
        p.r = Math.max(0.1, p.baseR + Math.sin(frame * p.freq + p.phase) * 1);

        attractors.forEach(a => {
          a.phase += 0.001;
          const ax = a.x + Math.sin(a.phase) * 100;
          const ay = a.y + Math.cos(a.phase * 0.7) * 100;
          const dx = ax - p.x;
          const dy = ay - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < a.radius && dist > 10) {
            const force = a.strength * (1 - dist / a.radius);
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        });

        const dx = mx - p.x;
        const dy = my - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 300 && dist > 5) {
          const force = 0.15 * (1 - dist / 300);
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
          const perpX = -dy / dist;
          const perpY = dx / dist;
          p.vx += perpX * force * 0.5;
          p.vy += perpY * force * 0.5;
          if (dist < 80) {
            p.orbitRadius = dist;
            p.orbitAngle += 0.03;
            const targetX = mx + Math.cos(p.orbitAngle) * p.orbitRadius;
            const targetY = my + Math.sin(p.orbitAngle) * p.orbitRadius;
            p.vx += (targetX - p.x) * 0.02;
            p.vy += (targetY - p.y) * 0.02;
          }
        }

        if (dist < 100 && mSpeed > 8 && Math.random() < 0.02) {
          addRipple(p.x, p.y, 80);
        }

        p.vx *= 0.985;
        p.vy *= 0.985;
        const maxV = 3;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > maxV) {
          p.vx = (p.vx / speed) * maxV;
          p.vy = (p.vy / speed) * maxV;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -50) p.x = canvas.width + 50;
        if (p.x > canvas.width + 50) p.x = -50;
        if (p.y < -50) p.y = canvas.height + 50;
        if (p.y > canvas.height + 50) p.y = -50;

        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > 8) p.trail.shift();

        const glow = dist < 250 ? 1 - dist / 250 : 0;
        const baseAlpha = 0.25 + Math.sin(frame * p.freq + p.phase) * 0.1;
        const colorStr = p.color === 1 ? t.particle1 : t.particle2;

        if (p.trail.length > 1 && speed > 0.5) {
          for (let ti = 1; ti < p.trail.length; ti++) {
            const ta = (ti / p.trail.length) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p.trail[ti - 1].x, p.trail[ti - 1].y);
            ctx.lineTo(p.trail[ti].x, p.trail[ti].y);
            ctx.strokeStyle = `rgba(${colorStr},${ta})`;
            ctx.lineWidth = p.r * (ti / p.trail.length);
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.1, p.r + glow * 4), 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${colorStr},${baseAlpha + glow * 0.6})`;
        ctx.fill();

        if (glow > 0.3) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(0.1, p.r + glow * 12), 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(${colorStr},${glow * 0.15})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }

        const jEnd = Math.min(i + 30, connectionMaxCheck);
        for (let j = i + 1; j < jEnd; j++) {
          if (j >= particles.length) break;
          const p2 = particles[j];
          const d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
          const maxDist = 130 + glow * 80;
          if (d < maxDist) {
            const lineAlpha = 0.06 * (1 - d / maxDist) + glow * 0.08;
            const d2 = Math.sqrt((mx - p2.x) ** 2 + (my - p2.y) ** 2);
            const nearMouse = (dist < 200 || d2 < 200);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            if (nearMouse) {
              const lineGrad = ctx.createLinearGradient(p.x, p.y, p2.x, p2.y);
              lineGrad.addColorStop(0, `rgba(${t.particle1},${lineAlpha})`);
              lineGrad.addColorStop(1, `rgba(${t.particle2},${lineAlpha})`);
              ctx.strokeStyle = lineGrad;
              ctx.lineWidth = 1.2;
            } else {
              ctx.strokeStyle = `rgba(${t.particle1},${lineAlpha * 0.5})`;
              ctx.lineWidth = 0.6;
            }
            ctx.stroke();
          }
        }
      });

      if (!isMobile) {
        for (let h = 0; h < 4; h++) {
          const hx = (canvas.width * (h + 1)) / 5 + Math.sin(frame * 0.003 + h * 2) * 80;
          const hy = (frame * 0.15 + h * canvas.height * 0.25) % canvas.height;
          const hr = 20 + Math.sin(frame * 0.01 + h) * 8;
          ctx.beginPath();
          for (let s = 0; s <= 6; s++) {
            const a = (s / 6) * Math.PI * 2 + frame * 0.005;
            const px = hx + Math.cos(a) * hr;
            const py = hy + Math.sin(a) * hr;
            s === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.strokeStyle = `rgba(${t.particle2},0.06)`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    };
    draw();

    const handleClick = (e) => {
      addRipple(e.clientX, e.clientY + window.scrollY, 250);
      particles.forEach(p => {
        const dx = p.x - (e.clientX);
        const dy = p.y - (e.clientY + window.scrollY);
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200 && dist > 0) {
          const force = (1 - dist / 200) * 5;
          p.vx += (dx / dist) * force;
          p.vy += (dy / dist) * force;
        }
      });
    };

    const handleMouse = (e) => {
      mouseRef.current.clientX = e.clientX;
      mouseRef.current.clientY = e.clientY;
    };

    const handleTouch = (e) => {
      if (e.touches.length > 0) {
        mouseRef.current.clientX = e.touches[0].clientX;
        mouseRef.current.clientY = e.touches[0].clientY;
      }
    };

    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("click", handleClick);
    window.addEventListener("touchmove", handleTouch, { passive: true });

    const resizeInterval = setInterval(resize, 2000);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("click", handleClick);
      window.removeEventListener("touchmove", handleTouch);
      clearInterval(resizeInterval);
    };
  }, [mode, isMobile, motionOK]);

  if (!motionOK) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
};

const FadeInSection = ({ children, delay = 0 }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const { motionOK } = useTheme();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const shown = visible || !motionOK;
  return (
    <div
      ref={ref}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(50px)",
        transition: motionOK ? `all 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s` : "none",
      }}
    >
      {children}
    </div>
  );
};

const GlitchText = ({ text }) => {
  const [glitch, setGlitch] = useState(false);
  const { motionOK } = useTheme();

  useEffect(() => {
    if (!motionOK) return;
    const interval = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 200);
    }, 4000);
    return () => clearInterval(interval);
  }, [motionOK]);

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <span style={{ position: "relative", zIndex: 2 }}>{text}</span>
      {glitch && (
        <>
          <span style={{
            position: "absolute", top: "-2px", left: "3px",
            color: "#00ffc8", zIndex: 1, clipPath: "inset(20% 0 30% 0)",
            opacity: 0.8,
          }}>{text}</span>
          <span style={{
            position: "absolute", top: "2px", left: "-3px",
            color: "#7850ff", zIndex: 1, clipPath: "inset(50% 0 10% 0)",
            opacity: 0.8,
          }}>{text}</span>
        </>
      )}
    </span>
  );
};

const TypeWriter = ({ texts, speed = 80 }) => {
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const { motionOK } = useTheme();

  useEffect(() => {
    if (!motionOK) return;
    const current = texts[textIndex];
    const timeout = setTimeout(() => {
      if (!deleting) {
        if (charIndex < current.length) {
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setDeleting(true), 1800);
        }
      } else {
        if (charIndex > 0) {
          setCharIndex(charIndex - 1);
        } else {
          setDeleting(false);
          setTextIndex((textIndex + 1) % texts.length);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, textIndex, texts, speed, motionOK]);

  if (!motionOK) {
    return (
      <span>
        {texts[0]}
        <span style={{ borderRight: "2px solid #00ffc8", marginLeft: "2px" }}>&nbsp;</span>
      </span>
    );
  }

  return (
    <span>
      {texts[textIndex].substring(0, charIndex)}
      <span style={{
        borderRight: "2px solid #00ffc8",
        animation: "blink 1s step-end infinite",
        marginLeft: "2px",
      }}>&nbsp;</span>
    </span>
  );
};

const SkillOrb = ({ name, color, isMobile }) => {
  const [hovered, setHovered] = useState(false);
  const { mode } = useTheme();
  const t = themes[mode];
  const isAwsSkill = name.startsWith("AWS (Bedrock");

  const getTechIcon = (label) => {
    const key = label.toLowerCase();
    if (key.includes("java / spring")) return FaJava;
    if (key === "java" || key.startsWith("java ")) return FaJava;
    if (key.includes("python")) return SiPython;
    if (key.includes("javascript")) return SiJavascript;
    if (key.includes("react")) return SiReact;
    if (key.includes("node.js") || key.includes("nodejs")) return SiNodedotjs;
    if (key.includes("typescript")) return SiTypescript;
    if (key.includes("dart")) return SiDart;
    if (key.includes("flutter")) return SiFlutter;
    if (key.includes("angular")) return SiAngular;
    if (key === "sql") return SiMysql;
    if (key.includes("scala")) return SiScala;
    if (key.includes("fastapi")) return SiFastapi;
    if (key.includes("flask")) return SiFlask;
    if (key.includes("databricks")) return SiDatabricks;
    if (key.includes("postgres")) return SiPostgresql;
    if (key.includes("redis")) return SiRedis;
    if (key.includes("streamlit")) return SiStreamlit;
    if (key.includes("scikit")) return SiScikitlearn;
    if (key.includes("prometheus")) return SiPrometheus;
    if (key.includes("llm") || key.includes("rag")) return FaBrain;
    if (key.includes("html")) return SiHtml5;
    if (key.includes("css")) return SiCss;
    if (key.includes("aws")) return FaAmazon;
    if (key.includes("google cloud")) return SiGooglecloud;
    if (key.includes("microsoft azure") || key === "azure") return FaMicrosoft;
    if (key.includes("docker")) return SiDocker;
    if (key.includes("kubernetes")) return SiKubernetes;
    if (key.includes("tensorflow")) return SiTensorflow;
    if (key.includes("firebase")) return SiFirebase;
    if (key.includes("neo4j")) return SiNeo4J;
    if (key.includes("mongodb")) return SiMongodb;
    if (key.includes("grafana")) return SiGrafana;
    if (key === "git") return SiGit;
    if (key.includes("jenkins")) return SiJenkins;
    if (key.includes("gitlab")) return SiGitlab;
    if (key.includes("figma")) return SiFigma;
    if (key.includes("blender")) return SiBlender;
    if (key.includes("machine learning")) return FaBrain;
    if (key.includes("agile")) return FaUsersCog;
    if (key.includes("ar / vr") || key.includes("ar/vr")) return FaVrCardboard;
    if (key.includes("model context protocol") || key.includes("crewai")) return FaCubes;
    return null;
  };

  const Icon = getTechIcon(name);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 16px",
        maxWidth: isMobile && isAwsSkill ? "100%" : undefined,
        borderRadius: "40px",
        border: `1px solid ${hovered ? color : t.border}`,
        background: hovered ? `${color}15` : t.surface,
        cursor: "default",
        transition: "all 0.4s ease",
        transform: hovered ? "translateY(-3px) scale(1.05)" : "translateY(0)",
        boxShadow: hovered ? `0 8px 30px ${color}20` : "none",
      }}
    >
      <span style={{
        width: "6px", height: "6px", borderRadius: "50%",
        background: color,
        boxShadow: `0 0 ${hovered ? 12 : 6}px ${color}`,
        transition: "all 0.3s",
        flexShrink: 0,
      }} />
      {Icon && (
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", color, fontSize: 14 }}>
          <Icon />
        </span>
      )}
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "12px",
        color: hovered ? t.text : t.textSecondary,
        letterSpacing: "0.5px",
        transition: "color 0.3s",
        whiteSpace: isMobile && isAwsSkill ? "normal" : "nowrap",
        overflowWrap: isMobile && isAwsSkill ? "anywhere" : "normal",
      }}>{name}</span>
    </div>
  );
};

const StatCard = ({ value, suffix, label, isMobile }) => {
  const { mode, motionOK } = useTheme();
  const t = themes[mode];
  const ref = useRef(null);
  const [display, setDisplay] = useState(0);
  const [hovered, setHovered] = useState(false);
  const started = useRef(false);

  useEffect(() => {
    if (!motionOK || typeof IntersectionObserver === "undefined") {
      setDisplay(value);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const duration = 1600;
          const tick = (now) => {
            const p = Math.min(1, (now - startTime) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(Math.round(value * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          // rAF pauses in hidden tabs, so pin the final value as a fallback
          setTimeout(() => setDisplay(value), duration + 200);
        }
      },
      { threshold: 0.4 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, motionOK]);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: isMobile ? "18px 16px" : "24px 20px",
        borderRadius: "14px",
        border: `1px solid ${hovered ? `${t.accent}50` : t.border}`,
        background: hovered ? t.surfaceHover : t.cardBg,
        overflow: "hidden",
        cursor: "default",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? `0 16px 40px rgba(0,0,0,0.25), 0 0 20px ${t.accent}15` : "none",
      }}
    >
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "2px",
        background: `linear-gradient(90deg, ${t.accent}, ${t.accent2})`,
        transform: hovered ? "scaleX(1)" : "scaleX(0.35)",
        transformOrigin: "left",
        transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        opacity: hovered ? 1 : 0.6,
      }} />
      <div style={{
        fontFamily: "'Syne', sans-serif",
        fontSize: isMobile ? "26px" : "34px", fontWeight: 800,
        background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})`,
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        lineHeight: 1.1,
      }}>{display}{suffix}</div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: isMobile ? "9px" : "10px", color: hovered ? t.textSecondary : t.textMuted,
        letterSpacing: "1.5px", textTransform: "uppercase", marginTop: "8px",
        transition: "color 0.3s", lineHeight: 1.5,
      }}>{label}</div>
    </div>
  );
};

const TimelineCard = ({ role, company, period, location, bullets, tech }) => {
  const [hovered, setHovered] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const { mode } = useTheme();
  const t = themes[mode];
  const { isMobile } = useResponsive();
  const cardRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const center = rect.top + rect.height / 2;
      const distanceFromCenter = Math.abs(center - vh / 2);
      let p = 1 - distanceFromCenter / (vh / 1.2);
      if (p < 0) p = 0;
      if (p > 1) p = 1;
      setScrollProgress(p);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const variant =
    role.toLowerCase().includes("ar/vr") || company.toLowerCase().includes("tata")
      ? "arvr"
      : "default";

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        padding: isMobile ? "24px 20px" : "32px",
        borderRadius: "16px",
        border: `1px solid ${t.border}`,
        background: hovered ? t.surfaceHover : t.cardBg,
        transition: "all 0.5s ease",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.15)" : "none",
        cursor: "default",
      }}
    >
      <div style={{
        position: "absolute", top: isMobile ? "24px" : "32px", left: "0",
        width: "3px", height: hovered ? "60px" : "40px",
        background: `linear-gradient(180deg, ${t.accent}, transparent)`,
        borderRadius: "2px",
        transition: "height 0.4s ease",
      }} />
      <div style={{ marginLeft: isMobile ? "12px" : "16px" }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px", color: t.accent,
          letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px",
        }}>{period}</div>
        <h3 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: isMobile ? "18px" : "22px", fontWeight: 700, color: t.text,
          margin: "0 0 4px 0",
        }}>{role}</h3>
        <div style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: isMobile ? "13px" : "15px", color: t.textSecondary, marginBottom: "4px",
        }}>{company} · {location}</div>
        {tech && (
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "11px", color: t.accent2, marginBottom: "16px", letterSpacing: "0.5px",
            lineHeight: 1.6,
          }}>{tech}</div>
        )}
        <ul style={{ margin: 0, paddingLeft: "16px", listStyleType: "none" }}>
          {bullets.map((b, i) => (
            <li key={i} style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: isMobile ? "13px" : "14px", color: t.textSecondary,
              lineHeight: "1.7", marginBottom: "8px",
              position: "relative", paddingLeft: "12px",
            }}>
              <span style={{
                position: "absolute", left: 0, top: "10px",
                width: "4px", height: "4px", borderRadius: "50%",
                background: `${t.accent}80`,
              }} />
              {b}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const ProjectCard = ({ title, tech, bullets, icon, date, link, live }) => {
  const [hovered, setHovered] = useState(false);
  const { mode, motionOK } = useTheme();
  const t = themes[mode];
  const { isMobile } = useResponsive();

  // With a live URL there are two destinations, so the card stops being one
  // big link and offers a button each instead.
  const splitLinks = Boolean(live && link);

  const cardStyle = {
    display: "flex",
    flexDirection: "column",
    padding: isMobile ? "24px 20px" : "32px",
    borderRadius: "16px",
    border: `1px solid ${hovered ? `${t.accent}40` : t.border}`,
    background: hovered ? t.surfaceHover : t.cardBg,
    transition: "all 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
    transform: hovered && motionOK ? "translateY(-6px)" : "translateY(0)",
    boxShadow: hovered ? "0 24px 60px rgba(0,0,0,0.2)" : "none",
    cursor: link && !splitLinks ? "pointer" : "default",
    position: "relative",
    overflow: "hidden",
    minHeight: isMobile ? "260px" : "320px",
    height: "100%",
    textDecoration: "none",
    color: "inherit",
  };

  const inner = (
    <>
      <div style={{
        position: "absolute", top: "-10px", right: "-10px",
        opacity: hovered ? 0.2 : 0.08,
        transition: "opacity 0.5s", filter: "blur(1px)",
      }}>{icon && icon({ size: isMobile ? 80 : 110 })}</div>
      {date && (
        <div style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px", color: t.accent,
          letterSpacing: "2px", textTransform: "uppercase", marginBottom: "8px",
        }}>{date}</div>
      )}
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "11px", color: t.accent2, letterSpacing: "1px", marginBottom: "12px",
      }}>{tech}</div>
      <h3 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: isMobile ? "18px" : "22px", fontWeight: 700, color: t.text,
        margin: "0 0 16px 0",
      }}>{title}</h3>
      <div style={{ flexGrow: 1 }}>
        {bullets.map((b, i) => (
          <p key={i} style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: isMobile ? "13px" : "14px", color: t.textSecondary,
            lineHeight: "1.7", margin: "0 0 8px 0",
          }}>{b}</p>
        ))}
      </div>
      {splitLinks ? (
        <div style={{ display: "flex", gap: "10px", marginTop: "18px", flexWrap: "wrap" }}>
          <a
            href={live}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${title} live demo`}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase",
              padding: "8px 14px", borderRadius: "8px",
              border: `1px solid ${t.accent}55`,
              background: `${t.accent}12`,
              color: t.accent,
              textDecoration: "none",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = `${t.accent}22`; e.currentTarget.style.borderColor = t.accent; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = `${t.accent}12`; e.currentTarget.style.borderColor = `${t.accent}55`; }}
          >
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: t.accent,
              boxShadow: `0 0 ${hovered ? 10 : 5}px ${t.accent}`,
              animation: motionOK ? "pulse 2s ease-in-out infinite" : "none",
              flexShrink: 0,
            }} />
            live demo ↗
          </a>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${title} repository on GitHub`}
            style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase",
              padding: "8px 14px", borderRadius: "8px",
              border: `1px solid ${t.border}`,
              background: t.surface,
              color: t.textSecondary,
              textDecoration: "none",
              transition: "all 0.3s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = t.text; e.currentTarget.style.borderColor = t.borderHover; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = t.textSecondary; e.currentTarget.style.borderColor = t.border; }}
          >
            <FaGithub style={{ fontSize: "14px" }} /> repo
          </a>
        </div>
      ) : link && (
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          marginTop: "16px",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase",
          color: hovered ? t.accent : t.textMuted,
          transition: "color 0.3s",
        }}>
          <span style={{
            width: "6px", height: "6px", borderRadius: "50%",
            background: t.accent,
            boxShadow: `0 0 ${hovered ? 10 : 5}px ${t.accent}`,
            animation: motionOK ? "pulse 2s ease-in-out infinite" : "none",
            flexShrink: 0,
          }} />
          <FaGithub style={{ fontSize: "14px" }} />
          <span>// click for repo</span>
          <span style={{
            display: "inline-block",
            transform: hovered ? "translateX(6px)" : "translateX(0)",
            transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
          }}>→</span>
        </div>
      )}
    </>
  );

  const events = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onFocus: () => setHovered(true),
    onBlur: () => setHovered(false),
  };

  return link && !splitLinks ? (
    <a href={link} target="_blank" rel="noopener noreferrer" aria-label={`${title} repository on GitHub`} style={cardStyle} {...events}>
      {inner}
    </a>
  ) : (
    <div style={cardStyle} {...events}>
      {inner}
    </div>
  );
};

const NavDot = ({ label, active, onClick }) => {
  const [hovered, setHovered] = useState(false);
  const { mode } = useTheme();
  const t = themes[mode];

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      aria-label={`Go to ${label} section`}
      style={{
        display: "flex", alignItems: "center", gap: "12px",
        cursor: "pointer", padding: "6px 0",
        background: "none", border: "none",
      }}
    >
      <div style={{
        width: active ? "12px" : "8px",
        height: active ? "12px" : "8px",
        borderRadius: "50%",
        background: active ? t.accent : t.textMuted,
        boxShadow: active ? `0 0 12px ${t.accent}` : "none",
        transition: "all 0.3s",
      }} />
      <span style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "11px",
        color: hovered || active ? t.accent : t.textMuted,
        letterSpacing: "1.5px", textTransform: "uppercase",
        opacity: hovered || active ? 1 : 0,
        transform: hovered || active ? "translateX(0)" : "translateX(-10px)",
        transition: "all 0.3s", whiteSpace: "nowrap",
      }}>{label}</span>
    </button>
  );
};

const MobileMenuButton = ({ open, onClick }) => {
  const { mode } = useTheme();
  const t = themes[mode];
  return (
    <button
      onClick={onClick}
      style={{
        background: "none", border: "none", cursor: "pointer",
        padding: "8px", display: "flex", flexDirection: "column",
        gap: open ? "0px" : "5px", width: "32px", height: "32px",
        justifyContent: "center", alignItems: "center",
        position: "relative", zIndex: 201,
      }}
      aria-label="Toggle menu"
    >
      <span style={{
        display: "block", width: "22px", height: "2px",
        background: t.text, borderRadius: "1px",
        transition: "all 0.3s ease",
        transform: open ? "rotate(45deg) translateY(0px)" : "none",
        position: open ? "absolute" : "relative",
      }} />
      <span style={{
        display: "block", width: "22px", height: "2px",
        background: t.text, borderRadius: "1px",
        transition: "all 0.3s ease",
        opacity: open ? 0 : 1,
      }} />
      <span style={{
        display: "block", width: "22px", height: "2px",
        background: t.text, borderRadius: "1px",
        transition: "all 0.3s ease",
        transform: open ? "rotate(-45deg) translateY(0px)" : "none",
        position: open ? "absolute" : "relative",
      }} />
    </button>
  );
};

const Kbd = ({ children, onClick, title }) => {
  const { mode } = useTheme();
  const t = themes[mode];
  const [hovered, setHovered] = useState(false);

  const style = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: "10px",
    color: onClick && hovered ? t.accent : t.textSecondary,
    padding: "2px 6px", borderRadius: "4px",
    border: `1px solid ${onClick && hovered ? `${t.accent}70` : t.border}`,
    background: t.surface,
    transition: "color 0.2s, border-color 0.2s",
  };

  if (!onClick) return <span style={style}>{children}</span>;

  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ ...style, cursor: "pointer", lineHeight: 1.6 }}
    >{children}</button>
  );
};

const CommandPalette = ({ open, onClose, actions }) => {
  const { mode, motionOK } = useTheme();
  const t = themes[mode];
  const { isMobile } = useResponsive();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter(a => (a.label + " " + (a.hint || "")).toLowerCase().includes(q));
  }, [query, actions]);

  useEffect(() => {
    if (open) {
      setQuery("");
      setSelected(0);
      setTimeout(() => inputRef.current && inputRef.current.focus(), 30);
    }
  }, [open]);

  useEffect(() => { setSelected(0); }, [query]);

  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.children[selected];
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [selected]);

  if (!open) return null;

  const run = (action) => {
    onClose();
    action.perform();
  };

  const handleKey = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelected(s => (s + 1) % Math.max(1, filtered.length));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelected(s => (s - 1 + Math.max(1, filtered.length)) % Math.max(1, filtered.length));
    } else if (e.key === "Enter" && filtered[selected]) {
      e.preventDefault();
      run(filtered[selected]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        background: "rgba(0,0,0,0.6)",
        backdropFilter: "blur(6px)",
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        padding: isMobile ? "80px 16px 16px" : "15vh 16px 16px",
        animation: motionOK ? "slideIn 0.2s ease" : "none",
      }}
      role="dialog" aria-modal="true" aria-label="Command palette"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: "560px",
          background: t.bg,
          border: `1px solid ${t.borderHover}`,
          borderRadius: "14px",
          overflow: "hidden",
          boxShadow: `0 30px 90px rgba(0,0,0,0.5), 0 0 40px ${t.accent}10`,
        }}
      >
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          padding: "16px 20px",
          borderBottom: `1px solid ${t.border}`,
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: t.accent, fontSize: "14px",
          }}>❯</span>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Type a command or search..."
            aria-label="Search commands"
            style={{
              flex: 1, background: "none", border: "none", outline: "none",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "14px", color: t.text,
              caretColor: t.accent,
            }}
          />
          <Kbd onClick={onClose} title="Close command palette">esc</Kbd>
        </div>
        <div ref={listRef} style={{ maxHeight: "320px", overflowY: "auto", padding: "8px" }}>
          {filtered.length === 0 && (
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px", color: t.textMuted,
              padding: "20px", textAlign: "center",
            }}>no results found</div>
          )}
          {filtered.map((a, i) => (
            <div
              key={a.id}
              onClick={() => run(a)}
              onMouseEnter={() => setSelected(i)}
              style={{
                display: "flex", alignItems: "center", gap: "12px",
                padding: "12px 14px", borderRadius: "8px",
                cursor: "pointer",
                background: i === selected ? `${t.accent}12` : "transparent",
                borderLeft: `2px solid ${i === selected ? t.accent : "transparent"}`,
                transition: "background 0.15s",
              }}
            >
              <span style={{
                color: i === selected ? t.accent : t.textMuted,
                fontSize: "13px", display: "flex", alignItems: "center", width: "16px",
              }}>{a.icon}</span>
              <span style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "14px",
                color: i === selected ? t.text : t.textSecondary,
                flex: 1,
              }}>{a.label}</span>
              {a.hint && (
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px", color: t.textMuted,
                  letterSpacing: "1px", textTransform: "uppercase",
                }}>{a.hint}</span>
              )}
            </div>
          ))}
        </div>
        <div style={{
          display: "flex", gap: "16px", alignItems: "center",
          padding: "10px 20px",
          borderTop: `1px solid ${t.border}`,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "10px", color: t.textMuted,
        }}>
          <span><Kbd>↑</Kbd> <Kbd>↓</Kbd> navigate</span>
          <span><Kbd>↵</Kbd> select</span>
        </div>
      </div>
    </div>
  );
};

const GREETING_FRAMES = [
  [
    "  _   _ ___ ",
    " | | | |_ _|",
    " | |_| || | ",
    " |  _  || | ",
    " |_| |_|___|",
    "",
    "*      \\o     ",
    "        |\\    ",
    "       / \\    ",
  ].join("\n"),
  [
    "  _   _ ___ ",
    " | | | |_ _|",
    " | |_| || | ",
    " |  _  || | ",
    " |_| |_|___|",
    "",
    "        o/    *",
    "       /|      ",
    "       / \\     ",
  ].join("\n"),
  [
    "  _   _ ___ ",
    " | | | |_ _|",
    " | |_| || | ",
    " |  _  || | ",
    " |_| |_|___|",
    "",
    "       \\o/     ",
    "        |       ",
    "       / \\      ",
  ].join("\n"),
];

const isGreetingCommand = (value) => {
  const normalized = value
    .toLowerCase()
    .trim()
    .replace(/’/g, "'")
    .replace(/[!?.,:;]+$/g, "")
    .replace(/\s+/g, " ");

  // Matches greetings such as: hi, hiiii, hello there, heyyy,
  // good morning, what's up, howdy, namaste, hola, etc.
  return /^(?:h+i+|he+l+o+|he+y+|hiya|howdy|yo+|sup|wass?up|greetings?|namaste|namaskar|hola|bonjour|ciao|(?:good\s+)?(?:morning|afternoon|evening)|good\s+night|what(?:'s| is)?\s+up)\b/i.test(normalized);
};

const AsciiGreeting = ({ motionOK }) => {
  const [frame, setFrame] = useState(motionOK ? 0 : 2);

  useEffect(() => {
    if (!motionOK) {
      setFrame(2);
      return undefined;
    }

    let step = 0;
    const intervalId = window.setInterval(() => {
      step += 1;
      setFrame(step % GREETING_FRAMES.length);

      // Wave a few times, then leave the final greeting visible.
      if (step >= 11) window.clearInterval(intervalId);
    }, 190);

    return () => window.clearInterval(intervalId);
  }, [motionOK]);

  return (
    <div
      role="img"
      aria-label="An ASCII character waving hello"
      style={{ margin: "6px 0 8px" }}
    >
      <pre
        aria-hidden="true"
        style={{
          margin: 0,
          display: "inline-block",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "12px",
          lineHeight: 1.15,
          color: "#00ffc8",
          textShadow: "0 0 10px rgba(0,255,200,0.45)",
          whiteSpace: "pre",
          userSelect: "none",
        }}
      >
        {GREETING_FRAMES[frame]}
      </pre>
    </div>
  );
};

const Terminal = ({ open, onClose, scrollTo, toggleTheme, toggleMotion }) => {
  const { mode, motionOK } = useTheme();
  const t = themes[mode];
  const { isMobile } = useResponsive();
  const [lines, setLines] = useState([
    { type: "out", text: "nishcodes terminal v1.1 - type 'help' to get started." },
    { type: "hint", text: "recruiter shortcut: try 'sudo ...' 👀" },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [histIndex, setHistIndex] = useState(-1);
  const inputRef = useRef(null);
  const bodyRef = useRef(null);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current && inputRef.current.focus(), 30);
  }, [open]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [lines, open]);

  if (!open) return null;

  const print = (entries) => setLines(prev => [...prev, ...entries]);

  const COMMANDS = {
    help: () => [
      "available commands:",
      "  whoami        who is this guy",
      "  about         a short intro",
      "  projects      list projects with repo links",
      "  experience    where I've worked",
      "  skills        my tech stack",
      "  education     where I studied",
      "  resume        open my resume",
      "  contact       how to reach me",
      "  github        open my GitHub",
      "  linkedin      open my LinkedIn",
      "  motion        toggle animations",
      "  sudo ...  recruiter shortcut 👀",
      "  goto <section>  jump to a section",
      "  clear         clear the terminal",
      "  exit          close the terminal",
    ],
    whoami: () => ["Nishant Chaudhary - AI Developer @ ORIX, MS CS @ Indiana University."],
    about: () => [
      "I build systems that make people more capable.",
      "Currently: RAG pipelines over 85K+ documents at ORIX.",
      "Previously: Software Engineer at Nomura, medical imaging + AR/VR at TCS.",
    ],
    projects: () => [
      "Relay    - LLM cost gateway                nishant2306.github.io/relay",
      "Argus    - LLM eval platform               nishant2306.github.io/argus",
      "Cue      - AI workspace agent              github.com/Siriapps/Cue",
      "DIVDASH  - D&I analytics dashboard         github.com/Nishant2306/DiveDash",
      "DISHA    - student-mentor platform         github.com/satty26/disha",
      "AID      - assistive interface for deaf    (private)",
    ],
    experience: () => [
      "2026–now   AI Developer Intern      ORIX (Remote)",
      "2024–2025  Software Engineer        Nomura Holdings",
      "2024       Software Dev Intern      Nomura Holdings",
      "2023       Software Dev Intern      Tata Consultancy Services",
    ],
    skills: () => [
      "languages   Python, Java, C++, TypeScript, JavaScript, SQL, Scala",
      "frameworks  Spring Boot, FastAPI, React, Node.js, Angular, Flutter, Flask",
      "cloud       Azure (AI, Databricks), GCP, Docker, Kubernetes, CI/CD",
      "ai/ml       RAG, vector search, LLM evaluation, HDBSCAN, PyTorch, CrewAI",
      "infra       PostgreSQL, pgvector, Redis Stack, Neo4j, Prometheus, Grafana",
    ],
    education: () => [
      "2025–2027  MS Computer Science   Indiana University (GPA 3.76/4.0)",
      "2020–2024  B.Tech CSE            IIIT Pune (GPA 8.04/10)",
    ],
    contact: () => [
      "email      nishantchaudhary0512@gmail.com",
      "phone      +1 (930) 904-4657",
      "linkedin   linkedin.com/in/nishant-chaudhary-9a250521a",
    ],
    resume: () => {
      window.open(resumePdf, "_blank", "noopener");
      return ["opening resume..."];
    },
    github: () => {
      window.open("https://github.com/Nishant2306", "_blank", "noopener");
      return ["opening github..."];
    },
    linkedin: () => {
      window.open("https://www.linkedin.com/in/nishant-chaudhary-9a250521a/", "_blank", "noopener");
      return ["opening linkedin..."];
    },
    theme: () => {
      toggleTheme();
      return ["theme toggled."];
    },
    motion: () => {
      toggleMotion();
      return ["animations toggled."];
    },
    date: () => [new Date().toString()],
  };

  const runCommand = (raw) => {
    const cmd = raw.trim();
    if (!cmd) return;
    setCmdHistory(prev => [...prev, cmd]);
    setHistIndex(-1);
    const echo = { type: "in", text: cmd };
    const lower = cmd.toLowerCase();

    if (isGreetingCommand(cmd)) {
      print([
        echo,
        { type: "wave" },
        { type: "out", text: "Hi there! Thanks for stopping by." },
        { type: "hint", text: "Type 'help' to explore — or try 'sudo hire-me' if you have an opportunity." },
      ]);
      return;
    }

    if (lower === "clear") {
      setLines([]);
      return;
    }
    if (lower === "exit" || lower === "quit") {
      setLines(prev => [...prev, echo, { type: "out", text: "bye. 👋" }]);
      setTimeout(onClose, 400);
      return;
    }
    if (lower.startsWith("goto ")) {
      const section = lower.slice(5).trim();
      const valid = ["about", "experience", "achievement", "projects", "skills", "education", "contact", "hero"];
      if (valid.includes(section)) {
        scrollTo(section);
        print([echo, { type: "out", text: `navigating to ${section}...` }]);
      } else {
        print([echo, { type: "out", text: `unknown section: ${section}. try: ${valid.join(", ")}` }]);
      }
      return;
    }
    if (lower === "sudo hire-me" || lower === "sudo hire me") {
      print([
        echo,
        { type: "out", text: "[sudo] validating recruiter permissions..." },
        { type: "success", text: "permission granted. ✔" },
        { type: "out", text: "email nishantchaudhary0512@gmail.com to complete the process." },
      ]);
      return;
    }
    if (lower.startsWith("sudo")) {
      print([echo, { type: "out", text: "nice try. this incident will be reported. (try 'sudo hire-me')" }]);
      return;
    }
    const fn = COMMANDS[lower];
    if (fn) {
      const out = fn();
      print([echo, ...out.map(text => ({ type: "out", text }))]);
    } else {
      print([echo, { type: "out", text: `command not found: ${cmd}. type 'help' for the list.` }]);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      runCommand(input);
      setInput("");
    } else if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (cmdHistory.length) {
        const ni = histIndex === -1 ? cmdHistory.length - 1 : Math.max(0, histIndex - 1);
        setHistIndex(ni);
        setInput(cmdHistory[ni]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (histIndex >= 0) {
        const ni = histIndex + 1;
        if (ni >= cmdHistory.length) { setHistIndex(-1); setInput(""); }
        else { setHistIndex(ni); setInput(cmdHistory[ni]); }
      }
    }
  };

  return (
    <div
      onClick={() => inputRef.current && inputRef.current.focus()}
      style={{
        position: "fixed",
        left: "50%", transform: "translateX(-50%)",
        bottom: isMobile ? "12px" : "28px",
        width: isMobile ? "calc(100vw - 24px)" : "min(720px, calc(100vw - 48px))",
        height: isMobile ? "55vh" : "400px",
        background: mode === "dark" ? "rgba(6,6,10,0.96)" : "rgba(20,20,30,0.97)",
        border: `1px solid ${t.accent}30`,
        borderRadius: "12px",
        boxShadow: `0 30px 80px rgba(0,0,0,0.6), 0 0 40px ${t.accent}12`,
        backdropFilter: "blur(16px)",
        zIndex: 290,
        display: "flex", flexDirection: "column",
        overflow: "hidden",
      }}
      role="dialog" aria-label="Interactive terminal"
    >
      <div style={{
        display: "flex", alignItems: "center", gap: "8px",
        padding: "10px 14px",
        borderBottom: `1px solid rgba(255,255,255,0.08)`,
        background: "rgba(255,255,255,0.03)",
      }}>
        {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
          <span key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />
        ))}
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "11px", color: "rgba(255,255,255,0.5)",
          marginLeft: "8px", flex: 1,
        }}>nishant@portfolio: ~</span>
        <button
          onClick={onClose}
          aria-label="Close terminal"
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "rgba(255,255,255,0.5)", fontSize: "14px",
            fontFamily: "'JetBrains Mono', monospace", padding: "2px 6px",
          }}
        >✕</button>
      </div>
      <div ref={bodyRef} style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>
        {lines.map((l, i) => {
          if (l.type === "wave") {
            return <AsciiGreeting key={`wave-${i}`} motionOK={motionOK} />;
          }

          const lineColor =
            l.type === "in"
              ? "#00ffc8"
              : l.type === "hint"
                ? "#c7a7ff"
                : l.type === "success"
                  ? "#7dffb2"
                  : "rgba(255,255,255,0.7)";

          return (
            <div key={i} style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px", lineHeight: 1.8,
              whiteSpace: "pre-wrap", wordBreak: "break-word",
              color: lineColor,
            }}>
              {l.type === "in" ? `❯ ${l.text}` : l.text}
            </div>
          );
        })}
      </div>
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "10px 16px",
        borderTop: "1px solid rgba(255,255,255,0.08)",
      }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          color: "#00ffc8", fontSize: "13px",
        }}>❯</span>
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          spellCheck={false}
          autoComplete="off"
          aria-label="Terminal command input"
          style={{
            flex: 1, background: "none", border: "none", outline: "none",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: "13px", color: "#fff",
            caretColor: "#00ffc8",
          }}
        />
      </div>
    </div>
  );
};

export default function Portfolio() {
  const [mode, setMode] = useState("dark");
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollY, setScrollY] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [motionOK, setMotionOK] = useState(() => {
    if (typeof window === "undefined") return true;
    const saved = localStorage.getItem("motion");
    if (saved === "on") return true;
    if (saved === "off") return false;
    return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  const { isMobile, isTablet, isDesktop, width } = useResponsive();

  const toggle = useCallback(() => setMode(m => m === "dark" ? "light" : "dark"), []);
  const toggleMotion = useCallback(() => {
    setMotionOK(m => {
      localStorage.setItem("motion", m ? "off" : "on");
      return !m;
    });
  }, []);
  const t = themes[mode];

  useEffect(() => {
    const onKeyDown = (e) => {
      const tag = e.target.tagName;
      const typing = tag === "INPUT" || tag === "TEXTAREA" || e.target.isContentEditable;
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setTerminalOpen(false);
        setPaletteOpen(o => !o);
        return;
      }
      if (typing) return;
      if (e.key === "`") {
        e.preventDefault();
        setPaletteOpen(false);
        setTerminalOpen(o => !o);
      } else if (e.key === "Escape") {
        setPaletteOpen(false);
        setTerminalOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const sections = ["hero", "about", "experience", "achievement", "projects", "skills", "education", "contact"];

  const sectionPx = isMobile ? "20px" : isTablet ? "32px" : "48px";
  const sectionPy = isMobile ? "80px" : "120px";

  useEffect(() => {
    setTimeout(() => setLoaded(true), 300);

    const onScroll = () => {
      setScrollY(window.scrollY);
      const sectionEls = sections.map(s => document.getElementById(s));
      const current = sectionEls.reduce((acc, el) => {
        if (el && el.getBoundingClientRect().top < window.innerHeight / 2) return el.id;
        return acc;
      }, 'hero');
      setActiveSection(current);

    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: motionOK ? "smooth" : "auto" });
    setMobileMenuOpen(false);
  };

  const skillCategories = [
    {
      title: "LANGUAGES & FRAMEWORKS",
      skills: [
        { name: "Java / Spring Boot", color: "#00ffc8" },
        { name: "Python", color: "#7850ff" },
        { name: "C++", color: "#00599c" },
        { name: "FastAPI", color: "#009688" },
        { name: "JavaScript", color: "#FFD700" },
        { name: "React.js", color: "#00d4ff" },
        { name: "Node.js", color: "#00ffc8" },
        { name: "TypeScript", color: "#3178c6" },
        { name: "Dart / Flutter", color: "#7850ff" },
        { name: "Angular", color: "#dd0031" },
        { name: "SQL", color: "#00ffc8" },
        { name: "Scala", color: "#dc322f" },
        { name: "RESTful APIs", color: "#FFD700" },
        { name: "Flask", color: "#00d4ff" },
        { name: "HTML / CSS", color: "#e34c26" },
      ],
    },
    {
      title: "CLOUD & TECHNOLOGIES",
      skills: [
        { name: "AWS (Bedrock, SageMaker, Lambda, EC2, S3)", color: "#FF9900" },
        { name: "Google Cloud Platform", color: "#4285f4" },
        { name: "Microsoft Azure", color: "#00bcf2" },
        { name: "Azure Databricks", color: "#FF3621" },
        { name: "PostgreSQL / pgvector", color: "#4169E1" },
        { name: "Redis Stack / RedisVL", color: "#DC382D" },
        { name: "Docker", color: "#00d4ff" },
        { name: "Kubernetes", color: "#326ce5" },
        { name: "PyTorch", color: "#ee4c2c" },
        { name: "TensorFlow", color: "#ff6f00" },
        { name: "HDBSCAN", color: "#4285f4" },
        { name: "Firebase", color: "#FFD700" },
        { name: "Neo4j", color: "#00ffc8" },
        { name: "MongoDB", color: "#47A248" },
        { name: "Grafana", color: "#F46800" },
        { name: "Prometheus", color: "#E6522C" },
        { name: "Streamlit", color: "#FF4B4B" },
        { name: "scikit-learn", color: "#F7931E" },
        { name: "CrewAI", color: "#7850ff" },
      ],
    },
    {
      title: "TOOLS & PLATFORMS",
      skills: [
        { name: "Git", color: "#f05032" },
        { name: "CI/CD (Jenkins, GitLab, GitHub Actions)", color: "#00ffc8" },
        { name: "Ansible", color: "#ee0000" },
        { name: "Distributed Systems", color: "#00d4ff" },
        { name: "Pact Broker", color: "#7850ff" },
        { name: "Machine Learning", color: "#FFD700" },
        { name: "LLM Evaluation", color: "#FFD700" },
        { name: "Prompt Engineering", color: "#00ffc8" },
        { name: "RAG / Vector Search", color: "#7850ff" },
        { name: "A/B Testing", color: "#00d4ff" },
        { name: "Observability (OpenTelemetry)", color: "#f5a623" },
        { name: "Agile / Scrum", color: "#00d4ff" },
        { name: "AR / VR", color: "#7850ff" },
        { name: "Blender", color: "#e87d0d" },
        { name: "Model Context Protocol", color: "#00ffc8" },
        { name: "Figma / UI-UX", color: "#a259ff" },
      ],
    },
  ];

  const LINKEDIN_URL = "https://www.linkedin.com/in/nishant-chaudhary-9a250521a/";
  const GITHUB_URL = "https://github.com/Nishant2306";

  const navItems = ['About', 'Experience', 'Achievement', 'Projects', 'Skills', 'Education', 'Contact'];

  const paletteActions = [
    { id: "terminal", label: "Open Terminal", hint: "` key", icon: <FaTerminal />, perform: () => setTerminalOpen(true) },
    ...navItems.map(s => ({
      id: `goto-${s.toLowerCase()}`,
      label: `Go to ${s}`,
      hint: "section",
      icon: "#",
      perform: () => scrollTo(s.toLowerCase()),
    })),
    { id: "github", label: "Open GitHub", hint: "link", icon: <FaGithub />, perform: () => window.open(GITHUB_URL, "_blank", "noopener") },
    { id: "linkedin", label: "Open LinkedIn", hint: "link", icon: <FaLinkedinIn />, perform: () => window.open(LINKEDIN_URL, "_blank", "noopener") },
    { id: "resume", label: "Open Resume", hint: "pdf", icon: <FaFileAlt />, perform: () => window.open(resumePdf, "_blank", "noopener") },
    { id: "email", label: "Send an Email", hint: "contact", icon: <FaEnvelope />, perform: () => { window.location.href = "mailto:nishantchaudhary0512@gmail.com"; } },
    { id: "motion", label: motionOK ? "Pause Animations" : "Play Animations", hint: "accessibility", icon: motionOK ? <FaPause /> : <FaPlay />, perform: toggleMotion },
    // { id: "theme", label: mode === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme", hint: "theme", icon: "◐", perform: toggle },
  ];

  return (
    <ThemeContext.Provider value={{ mode, toggle, motionOK, toggleMotion }}>
      <div style={{
        background: t.bg,
        color: t.text,
        minHeight: "100vh",
        position: "relative",
        overflowX: "hidden",
        transition: "background 0.6s ease, color 0.6s ease",
      }}>
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500;700&family=Syne:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
          @keyframes blink { 50% { border-color: transparent; } }
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
          @keyframes pulse { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
          @keyframes gridShift { 0% { background-position: 0 0; } 100% { background-position: 60px 60px; } }
          @keyframes rocketPulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
          @keyframes slideIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes ctrlKBreathe {
            0%, 100% { box-shadow: 0 0 0 0 ${t.accent}00; border-color: ${t.border}; color: ${t.textSecondary}; }
            50% { box-shadow: 0 0 14px 1px ${t.accent}38; border-color: ${t.accent}70; color: ${t.accent}; }
          }
          ::selection { background: ${t.selection}; color: ${t.text}; }
          * { scrollbar-width: thin; scrollbar-color: ${t.accent}50 ${t.bg}; box-sizing: border-box; }
          *::-webkit-scrollbar { width: 8px; }
          *::-webkit-scrollbar-track { background: ${mode === "dark" ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"}; border-radius: 4px; }
          *::-webkit-scrollbar-thumb { background: linear-gradient(180deg, ${t.accent}60, ${t.accent2}60); border-radius: 4px; border: 1px solid ${t.accent}15; transition: background 0.3s; }
          *::-webkit-scrollbar-thumb:hover { background: linear-gradient(180deg, ${t.accent}90, ${t.accent2}90); box-shadow: 0 0 8px ${t.accent}40; }
          *::-webkit-scrollbar-thumb:active { background: linear-gradient(180deg, ${t.accent}, ${t.accent2}); }
          html { scroll-behavior: ${motionOK ? "smooth" : "auto"}; }
          a:focus-visible, button:focus-visible, input:focus-visible {
            outline: 2px solid ${t.accent};
            outline-offset: 3px;
            border-radius: 4px;
          }
        `}</style>
        <InteractiveBackground />
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          pointerEvents: "none", zIndex: 1,
          background: `repeating-linear-gradient(0deg, transparent, transparent 2px, ${t.scanline} 2px, ${t.scanline} 4px)`,
        }} />
        <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} actions={paletteActions} />
        <Terminal
          open={terminalOpen}
          onClose={() => setTerminalOpen(false)}
          scrollTo={scrollTo}
          toggleTheme={toggle}
          toggleMotion={toggleMotion}
        />
        <button
          onClick={toggleMotion}
          aria-label={motionOK ? "Pause background animations" : "Play background animations"}
          title={motionOK ? "Pause animations" : "Play animations"}
          style={{
            position: "fixed",
            left: isMobile ? "14px" : "20px",
            bottom: isMobile ? "14px" : "20px",
            zIndex: 120,
            width: "38px", height: "38px",
            borderRadius: "50%",
            border: `1px solid ${t.border}`,
            background: t.navBg,
            backdropFilter: "blur(12px)",
            color: t.textSecondary,
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "11px",
            transition: "all 0.3s",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = t.accent; e.currentTarget.style.borderColor = `${t.accent}60`; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = t.textSecondary; e.currentTarget.style.borderColor = t.border; }}
        >
          {motionOK ? <FaPause /> : <FaPlay style={{ marginLeft: "2px" }} />}
        </button>
        {isDesktop && (
          <nav style={{
            position: "fixed", right: "32px", top: "50%",
            transform: "translateY(-50%)", zIndex: 100,
            display: "flex", flexDirection: "column", gap: "8px",
            alignItems: "flex-end",
          }}>
            {sections.map(s => (
              <NavDot
                key={s} label={s}
                active={activeSection === s}
                onClick={() => scrollTo(s)}
              />
            ))}
          </nav>
        )}
        <div style={{
          position: "fixed", top: 0, left: 0, height: "2px",
          width: `${Math.min(100, (scrollY / Math.max(1, (typeof document !== "undefined" ? document.documentElement.scrollHeight : 1) - (typeof window !== "undefined" ? window.innerHeight : 0))) * 100)}%`,
          background: `linear-gradient(90deg, ${t.accent}, ${t.accent2})`,
          boxShadow: `0 0 10px ${t.accent}80`,
          zIndex: 200,
          pointerEvents: "none",
        }} />
        <header style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 150,
          padding: isMobile ? '16px 20px' : isTablet ? '20px 32px 20px 48px' : '20px 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: t.navBg,
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid ' + t.border,
          transition: 'all 0.4s',
        }}
        >
          <div style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "20px", fontWeight: 800, letterSpacing: "-0.5px",
          }}>
            <span style={{ color: t.accent }}>N</span>
            <span style={{ color: t.textSecondary }}>.</span>
          </div>
          {!isMobile && (
            <div style={{ display: "flex", gap: isTablet ? "20px" : "32px", alignItems: "center" }}>
              {navItems.map(s => (
                <button
                  key={s}
                  onClick={() => scrollTo(s.toLowerCase())}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase",
                    color: t.textHeader, cursor: "pointer", transition: "color 0.3s",
                    background: "none", border: "none", padding: 0,
                  }}
                  onMouseEnter={e => e.target.style.color = t.accent}
                  onMouseLeave={e => e.target.style.color = t.textHeader}
                >{s}</button>
              ))}
              <button
                onClick={() => setPaletteOpen(true)}
                aria-label="Open command palette"
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px", letterSpacing: "1px",
                  color: t.textSecondary,
                  background: t.surface,
                  border: `1px solid ${t.border}`,
                  borderRadius: "6px",
                  padding: "5px 10px",
                  cursor: "pointer",
                  transition: "all 0.3s",
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  // Draws a slow, low-key eye toward the palette shortcut.
                  animation: motionOK ? "ctrlKBreathe 3.6s ease-in-out infinite" : "none",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.animation = "none";
                  e.currentTarget.style.color = t.accent;
                  e.currentTarget.style.borderColor = `${t.accent}60`;
                  e.currentTarget.style.boxShadow = `0 0 14px 1px ${t.accent}38`;
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = t.textSecondary;
                  e.currentTarget.style.borderColor = t.border;
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.animation = motionOK ? "ctrlKBreathe 3.6s ease-in-out infinite" : "none";
                }}
              >CTRL K</button>
            </div>
          )}
          {isMobile && (
            <MobileMenuButton open={mobileMenuOpen} onClick={() => setMobileMenuOpen(!mobileMenuOpen)} />
          )}
        </header>
        {isMobile && mobileMenuOpen && (
          <div style={{
            position: "fixed", inset: 0, zIndex: 140,
            background: mode === "dark" ? "rgba(9,9,11,0.95)" : "rgba(245,245,240,0.95)",
            backdropFilter: "blur(20px)",
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: "32px",
            animation: "slideIn 0.3s ease",
          }}>
            {navItems.map((s, i) => (
              <button
                key={s}
                onClick={() => scrollTo(s.toLowerCase())}
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "28px", fontWeight: 600,
                  color: t.text, cursor: "pointer",
                  transition: "color 0.3s",
                  background: "none", border: "none", padding: 0,
                  opacity: motionOK ? 0 : 1,
                  animation: motionOK ? `slideIn 0.4s ease ${i * 0.08}s forwards` : "none",
                }}
              >{s}</button>
            ))}
          </div>
        )}

        <section id="hero" style={{
          minHeight: "100vh", display: "flex", alignItems: "center",
          justifyContent: "center", position: "relative", padding: `0 ${sectionPx}`,
        }}>
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `linear-gradient(${t.accent}08 1px, transparent 1px), linear-gradient(90deg, ${t.accent}08 1px, transparent 1px)`,
            backgroundSize: isMobile ? "40px 40px" : "60px 60px",
            animation: motionOK ? "gridShift 20s linear infinite" : "none",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
          }} />

          <div style={{ textAlign: "center", maxWidth: "900px", position: "relative", zIndex: 2 }}>
            <div style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(30px)",
              transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s",
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: isMobile ? "11px" : "13px", color: t.accent,
                letterSpacing: isMobile ? "2px" : "4px", textTransform: "uppercase", marginBottom: "24px",
              }}>&lt; Hello World /&gt;</div>
            </div>

            <div style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(30px)",
              transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s",
            }}>
              <h1 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: isMobile ? "" : "clamp(48px, 7vw, 88px)",
                fontWeight: 800,
                lineHeight: 1.05, margin: "0 0 24px 0",
                letterSpacing: isMobile ? "-1px" : "-2px",
              }}>
                <GlitchText text="Nishant" /><br />
                <span style={{
                  background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  display: "inline-block",
                  padding: isMobile ? "0 14px" : 0,
                }}>Chaudhary</span>
              </h1>
            </div>

            <div style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(30px)",
              transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 0.8s",
            }}>
              <div style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: isMobile ? "16px" : "20px", color: t.textSecondary,
                marginBottom: "16px", fontWeight: 300,
                minHeight: isMobile ? "28px" : "32px",
              }}>
                <TypeWriter texts={[
                  "AI Developer Intern @ ORIX",
                  "Full-Stack Software Engineer",
                  "Cloud & AI Enthusiast",
                  "MS CS @ Indiana University",
                  "Former Software Engineer @ Nomura",
                  "AR/VR Developer",
                ]} />
              </div>
            </div>

            <div style={{
              opacity: loaded ? 1 : 0,
              transform: loaded ? "translateY(0)" : "translateY(30px)",
              transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1) 1.1s",
              display: "flex", gap: "12px", justifyContent: "center", marginTop: "40px",
              flexWrap: "wrap",
            }}>
              <a href="mailto:nishantchaudhary0512@gmail.com" style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: isMobile ? "12px" : "13px",
                padding: isMobile ? "12px 24px" : "14px 32px",
                borderRadius: "8px", border: "none",
                background: `linear-gradient(135deg, ${t.accent}, ${mode === "dark" ? "#00d4a0" : "#00b38a"})`,
                color: mode === "dark" ? "#09090b" : "#fff",
                fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase",
                cursor: "pointer", textDecoration: "none", transition: "all 0.3s",
                boxShadow: `0 0 30px ${t.accent}30`,
                display: "inline-flex", alignItems: "center", gap: "8px",
              }}><FaPaperPlane style={{ fontSize: "14px" }} /> Get in Touch</a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: isMobile ? "12px" : "13px",
                padding: isMobile ? "12px 24px" : "14px 32px",
                borderRadius: "8px",
                border: `1px solid ${t.borderHover}`,
                background: t.surface, color: t.textSecondary,
                letterSpacing: "1px", textTransform: "uppercase",
                cursor: "pointer", textDecoration: "none", transition: "all 0.3s",
                display: "inline-flex", alignItems: "center", gap: "8px",
              }}><FaLinkedinIn style={{ fontSize: "14px" }} /> LinkedIn ↗</a>
              <a
                href={resumePdf}
                target="_blank"
                rel="noopener noreferrer"
                
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: isMobile ? "12px" : "13px",
                  padding: isMobile ? "12px 24px" : "14px 32px",
                  borderRadius: "8px",
                  border: `1px solid ${t.borderHover}`,
                  background: t.surface,
                  color: t.textSecondary,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  textDecoration: "none",
                  transition: "all 0.3s",
                  display: "inline-flex", alignItems: "center", gap: "8px",
                }}
              >
                <FaFileAlt style={{ fontSize: "14px" }} /> Resume ↗
              </a>
              <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: isMobile ? "12px" : "13px",
                padding: isMobile ? "12px 24px" : "14px 32px",
                borderRadius: "8px",
                border: `1px solid ${t.borderHover}`,
                background: t.surface, color: t.textSecondary,
                letterSpacing: "1px", textTransform: "uppercase",
                cursor: "pointer", textDecoration: "none", transition: "all 0.3s",
                display: "inline-flex", alignItems: "center", gap: "8px",
              }}><FaGithub style={{ fontSize: "14px" }} /> GitHub ↗</a>
            </div>
          </div>

          {/* <div style={{
            position: "absolute", bottom: isMobile ? "24px" : "48px", left: "50%",
            transform: "translateX(-50%)",
            display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
            animation: motionOK ? "float 3s ease-in-out infinite" : "none",
          }}>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "10px", color: t.textMuted,
              letterSpacing: "3px", textTransform: "uppercase",
              textAlign: "center",
            }}>{isMobile ? "Scroll to explore" : "Scroll · Click anywhere for ripples"}</span>
            <div style={{
              width: "1px", height: "40px",
              background: `linear-gradient(180deg, ${t.accent}80, transparent)`,
            }} />
          </div> */}
        </section>

        <section id="about" style={{
          padding: `${sectionPy} ${sectionPx}`,
          maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 2,
        }}>
          <FadeInSection>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px", color: t.accent,
              letterSpacing: "4px", textTransform: "uppercase", marginBottom: "16px",
            }}>// About Me</div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: isMobile ? "clamp(28px, 8vw, 36px)" : "clamp(32px, 4vw, 48px)",
              fontWeight: 700,
              margin: "0 0 24px 0", letterSpacing: "-1px",
            }}>
              Building systems that make<br />
              people <span style={{
                background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>more capable</span>.
            </h2>
            <div style={{
              display: "flex", flexWrap: "wrap", gap: "10px",
              marginBottom: isMobile ? "32px" : "48px",
            }}>
              {["AI Systems", "Distributed Systems", "Developer Infrastructure"].map((tag, i) => (
                <span key={i} style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase",
                  color: t.textSecondary,
                  padding: "6px 14px", borderRadius: "20px",
                  border: `1px solid ${t.border}`,
                  background: t.surface,
                  display: "inline-flex", alignItems: "center", gap: "8px",
                }}>
                  <span style={{
                    width: "5px", height: "5px", borderRadius: "50%",
                    background: i % 2 === 0 ? t.accent : t.accent2,
                    boxShadow: `0 0 6px ${i % 2 === 0 ? t.accent : t.accent2}`,
                  }} />
                  {tag}
                </span>
              ))}
            </div>
          </FadeInSection>

          <FadeInSection delay={0.2}>
            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
              gap: isMobile ? "24px" : "48px",
            }}>
              <div>
                <p style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: isMobile ? "16px" : "18px", color: t.text,
                  lineHeight: 1.8, margin: "0 0 20px 0", fontWeight: 300,
                  borderLeft: `2px solid ${t.accent}`,
                  paddingLeft: isMobile ? "16px" : "24px",
                }}>
                  I've always been drawn to problems where technology can remove friction and help people do their best work. That curiosity has shaped every stage of my journey, from building medical imaging and AR/VR tools for surgical planning at <span style={{ color: t.accent }}>Tata Consultancy Services</span>, to modernizing enterprise platforms at <span style={{ color: t.accent }}>Nomura</span>, and now designing AI systems at <span style={{ color: t.accent }}>ORIX</span> that turn hundreds of daily documents into searchable knowledge and natural-language workflows.
                </p>
                <p style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: isMobile ? "14px" : "15px", color: t.textSecondary,
                  lineHeight: 1.85, margin: 0,
                }}>
                  Currently I'm pursuing a Master's in Computer Science at Indiana University Bloomington while exploring the intersection of <span style={{ color: t.text }}>AI, distributed systems, and developer infrastructure</span>. I enjoy building software where machine learning, cloud infrastructure, and thoughtful engineering come together, not as isolated technologies but as dependable systems that people can trust every single day.
                </p>
              </div>
              <div>
                <p style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: isMobile ? "14px" : "15px", color: t.textSecondary,
                  lineHeight: 1.85, margin: "0 0 20px 0",
                }}>
                  What excites me most is not simply using the latest technology. It's understanding a problem deeply enough to build the right solution. Whether that means shrinking a process from weeks to minutes, designing <span style={{ color: t.accent2 }}>production-ready RAG pipelines</span>, or creating tools that help engineers evaluate and ship LLMs with confidence, I love turning complex ideas into products that deliver <span style={{ color: t.text }}>measurable impact</span>.
                </p>
                <p style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: isMobile ? "14px" : "15px", color: t.textSecondary,
                  lineHeight: 1.85, margin: 0,
                }}>
                  That same curiosity carries well beyond my day-to-day work. I'm constantly experimenting with new AI systems, competing in hackathons, mentoring aspiring developers, and building side projects that push me to learn something new. I believe the best engineers <span style={{ color: t.text }}>never stop learning</span>, and every project, whether at work or on a weekend, is another chance to build something useful and leave the people who use it a little better off than before.
                </p>
              </div>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)",
              gap: isMobile ? "12px" : "16px",
              marginTop: isMobile ? "40px" : "56px",
            }}>
              <StatCard value={2} suffix="+" label="Years Industry Experience" isMobile={isMobile} />
              <StatCard value={85} suffix="K+" label="Documents Indexed" isMobile={isMobile} />
              <StatCard value={100} suffix="+" label="Engineering Hours Saved" isMobile={isMobile} />
              <StatCard value={91} suffix="%" label="API Cost Reduction" isMobile={isMobile} />
            </div>
          </FadeInSection>
        </section>

        <section id="experience" style={{
          padding: `${sectionPy} ${sectionPx}`,
          maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 2,
        }}>
          <FadeInSection>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px", color: t.accent,
              letterSpacing: "4px", textTransform: "uppercase", marginBottom: "16px",
            }}>// Experience</div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: isMobile ? "clamp(28px, 8vw, 36px)" : "clamp(32px, 4vw, 48px)",
              fontWeight: 700,
              margin: "0 0 48px 0", letterSpacing: "-1px",
            }}>
              Where I've <span style={{ color: t.accent2 }}>shipped</span> code.
            </h2>
          </FadeInSection>

          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <FadeInSection delay={0.1}>
              <div style={{ position: "relative" }}>
                <TimelineCard
                  role="AI Developer Intern" company="ORIX"
                  period="May 2026 – Present" location="Remote, USA"
                  tech="Azure AI Search · Document Intelligence · Databricks · Python · RAG · LLMs"
                  bullets={[
                    "Architected an event-driven Azure ingestion pipeline handling 300–400 daily documents into an 85,000+ document knowledge base via AI Document Intelligence, MarkItDown, and semantic chunking.",
                    "Engineered a Retrieval-Augmented Generation (RAG) agent over that corpus with hybrid vector and keyword retrieval, reranking, and prompt orchestration, replacing manual search for the operations team.",
                    "Partnered with loan-portfolio analysts to deliver a natural-language analytics layer on Azure Databricks that compiles plain-English questions into SQL over millions of rows, taking query authoring from 10 minutes to under 20 seconds.",
                  ]}
                />
                {isDesktop && motionOK && (
                  <div style={{
                    position: "absolute",
                    top: "50%",
                    right: "-30px",
                    transform: "translateY(-50%) translateX(55%)",
                    width: "280px",
                    height: "280px",
                    opacity: 0.85,
                    pointerEvents: "none",
                  }}>
                    <RobotVisual />
                  </div>
                )}
              </div>
            </FadeInSection>

            <FadeInSection delay={0.2}>
              <div style={{ position: "relative" }}>
                <TimelineCard
                  role="Software Engineer" company="Nomura Holdings"
                  period="July 2024 – July 2025" location="Mumbai, India"
                  tech="Java · Spring Boot · React.js · Node.js · Python · Neo4j · Docker · Kubernetes"
                  bullets={[
                    "Owned the Angular to React migration of a 40+ page enterprise portal, re-architecting state management and caching to cut page load time by 84% for 200+ daily users across global desks.",
                    "Built Java Spring Boot microservices and REST APIs for Nomura's internal developer platform, delivering an auto-onboarding service that reduced application setup from 3 weeks to 5 minutes, saving 100+ engineering hours per team.",
                    "Modeled 100+ production applications and their dependencies as a Neo4j graph, then optimized graph traversal and Python batch processing to reduce API latency by 20% at enterprise scale.",
                    "Launched an AI assistant over the graph alongside a rebuilt admin console with usage analytics and monitoring, giving platform owners self-serve visibility across the application estate.",
                  ]}
                />
                {isDesktop && motionOK && (
                  <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "-30px",
                    transform: "translateY(-50%) translateX(-55%)",
                    width: "280px",
                    height: "280px",
                    opacity: 0.85,
                    pointerEvents: "none",
                  }}>
                    <LaptopVisual />
                  </div>
                )}
              </div>
            </FadeInSection>

            <FadeInSection delay={0.3}>
              <div style={{ position: "relative" }}>
                <TimelineCard
                  role="Software Developer Intern" company="Nomura Holdings"
                  period="January 2024 – June 2024" location="Mumbai, India"
                  tech="Java · Pact Broker · CI/CD · React.js"
                  bullets={[
                    "Authored unit and integration suites for Java APIs and introduced Pact Broker contract testing across services, lifting coverage from 48% to 83% and catching breaking changes before release.",
                    "Rebuilt the portal as 20+ reusable components, adopted as the shared design layer by teams serving 1,000+ users.",
                  ]}
                />
                {isDesktop && motionOK && (
                  <div style={{
                    position: "absolute",
                    top: "50%",
                    right: "-30px",
                    transform: "translateY(-50%) translateX(55%)",
                    width: "280px",
                    height: "280px",
                    opacity: 0.85,
                    pointerEvents: "none",
                  }}>
                    <InternVisual3D />
                  </div>
                )}
              </div>
            </FadeInSection>

            <FadeInSection delay={0.4}>
              <div style={{ position: "relative" }}>
                <TimelineCard
                  role="Software Developer Intern" company="Tata Consultancy Services"
                  period="May 2023 – July 2023" location="Pune, India"
                  tech="Python · PyTorch · OpenCV · FastAPI · React.js · Blender"
                  bullets={[
                    "Trained a medical imaging pipeline over MRI/CT volumes spanning enhancement, segmentation, feature extraction, tumor localization, and stage classification, reaching 98.5% detection accuracy on lesions down to 2–3 mm.",
                    "Reconstructed the nasal cavity in Blender across 22 anatomical regions and served an AR/VR particle-trajectory simulator through FastAPI to a React interface in under 15 seconds, scoring drug deposition at predicted tumor sites 70% faster than the synchronous build.",
                  ]}
                />
                {isDesktop && motionOK && (
                  <div style={{
                    position: "absolute",
                    top: "50%",
                    left: "-30px",
                    transform: "translateY(-50%) translateX(-55%)",
                    width: "280px",
                    height: "280px",
                    opacity: 0.85,
                    pointerEvents: "none",
                  }}>
                    <FaceVisual />
                  </div>
                )}
              </div>
            </FadeInSection>
          </div>
        </section>

        <section id="achievement" style={{
          padding: `${sectionPy} ${sectionPx}`,
          maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 2,
        }}>
          <FadeInSection>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px", color: t.accent,
              letterSpacing: "4px", textTransform: "uppercase", marginBottom: "16px",
            }}>// Proudest Achievement</div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: isMobile ? "clamp(28px, 8vw, 36px)" : "clamp(32px, 4vw, 48px)",
              fontWeight: 700,
              margin: "0 0 48px 0", letterSpacing: "-1px",
            }}>
              The one I'm <span style={{
                background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>most proud</span> of.
            </h2>
          </FadeInSection>

          <FadeInSection delay={0.15}>
            <div style={{
              position: "relative",
              padding: isMobile ? "28px 20px" : "48px",
              borderRadius: isMobile ? "16px" : "24px",
              border: `1px solid ${t.accent}25`,
              background: `linear-gradient(135deg, ${t.accent}06, ${t.accent2}04)`,
              overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: "24px", right: "32px",
                opacity: 0.2,
                animation: motionOK ? "rocketPulse 3s ease-in-out infinite" : "none",
              }}><RocketIcon size={isMobile ? 40 : 64} /></div>

              <div style={{
                position: "absolute", top: 0, left: isMobile ? "20px" : "48px",
                right: isMobile ? "20px" : "48px",
                height: "2px",
                background: `linear-gradient(90deg, transparent, ${t.accent}, ${t.accent2}, transparent)`,
              }} />

              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "11px", color: t.accent,
                letterSpacing: "3px", textTransform: "uppercase", marginBottom: "20px",
                lineHeight: 1.6,
              }}>NOMURA HOLDINGS · NCD2.0 CI/CD PIPELINE AUTOMATION</div>

              <h3 style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: isMobile ? "20px" : "26px", fontWeight: 700, color: t.text,
                margin: "0 0 24px 0", lineHeight: 1.3,
              }}>
                Turned a 5–10 day manual process<br />
                into a <span style={{ color: t.accent }}>10-second automation</span>.
              </h3>

              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: isMobile ? "24px" : "40px",
              }}>
                <div>
                  <h4 style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px", color: t.accent2,
                    letterSpacing: "2px", textTransform: "uppercase",
                    margin: "0 0 16px 0",
                  }}>THE CHALLENGE</h4>
                  <p style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: isMobile ? "14px" : "15px", color: t.textSecondary,
                    lineHeight: 1.8, margin: "0 0 16px 0",
                  }}>
                    My manager assigned me to help an Executive Director from another team onboard all their products onto Nomura's NCD2.0 CI/CD Pipeline, a platform most teams weren't even aware of. Each project required manual code changes in Java/Python and creating custom YAML configuration files tailored to each project's requirements.
                  </p>
                  <p style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: isMobile ? "14px" : "15px", color: t.textSecondary,
                    lineHeight: 1.8, margin: 0,
                  }}>
                    For a full team's portfolio, this manual process would have taken 5–10 days of tedious, repetitive work.
                  </p>
                </div>

                <div>
                  <h4 style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "12px", color: t.accent2,
                    letterSpacing: "2px", textTransform: "uppercase",
                    margin: "0 0 16px 0",
                  }}>MY SOLUTION</h4>
                  <p style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: isMobile ? "14px" : "15px", color: t.textSecondary,
                    lineHeight: 1.8, margin: "0 0 16px 0",
                  }}>
                    Instead of manually onboarding each project, I collaborated with the NCD2.0 pipeline team, learned the system inside-out, and built a full automation script from scratch. Users could onboard a single project via a simple form (5–7 dropdowns) or bulk-onboard via CSV, just fill it in and hit enter.
                  </p>
                  <p style={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: isMobile ? "14px" : "15px", color: t.textSecondary,
                    lineHeight: 1.8, margin: 0,
                  }}>
                    What took 5–10 days now happened in ~10 seconds per project. I came up with this idea entirely on my own, took 100% ownership of implementation, and every piece of feedback was overwhelmingly positive.
                  </p>
                </div>
              </div>

              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr 1fr" : "1fr 1fr 1fr 1fr",
                gap: isMobile ? "16px" : "24px",
                marginTop: "32px",
                padding: isMobile ? "20px 16px" : "24px",
                borderRadius: "12px",
                background: mode === "dark" ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.5)",
                border: `1px solid ${t.border}`,
              }}>
                {[
                  { icon: "clock", before: "5–10 days", after: "~10 seconds", label: "Per Project" },
                  { icon: "brain", before: "Manual YAML", after: "Smart Form", label: "5–7 Fields" },
                  { icon: "box", before: "One-by-one", after: "CSV Bulk", label: "Mass Onboard" },
                  { icon: "star", before: "Assigned task", after: "Self-initiated", label: "100% Ownership" },
                ].map((m, i) => (
                  <div key={i} style={{ textAlign: "center" }}>
                    <div style={{ marginBottom: "8px" }}>{{
                      clock: <ClockIcon size={isMobile ? 22 : 28} />,
                      brain: <BrainIcon size={isMobile ? 22 : 28} />,
                      box: <BoxIcon size={isMobile ? 22 : 28} />,
                      star: <StarBadgeIcon size={isMobile ? 22 : 28} />,
                    }[m.icon]}</div>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "10px", color: t.textMuted,
                      textDecoration: "line-through", marginBottom: "4px",
                    }}>{m.before}</div>
                    <div style={{
                      fontFamily: "'Syne', sans-serif",
                      fontSize: isMobile ? "14px" : "16px", fontWeight: 700, color: t.accent,
                    }}>{m.after}</div>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "10px", color: t.textMuted, marginTop: "4px",
                      letterSpacing: "0.5px",
                    }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeInSection>
        </section>

        <section id="projects" style={{
          padding: `${sectionPy} ${sectionPx}`,
          maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 2,
        }}>
          <FadeInSection>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px", color: t.accent,
              letterSpacing: "4px", textTransform: "uppercase", marginBottom: "16px",
            }}>// Projects</div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: isMobile ? "clamp(28px, 8vw, 36px)" : "clamp(32px, 4vw, 48px)",
              fontWeight: 700,
              margin: "0 0 48px 0", letterSpacing: "-1px",
            }}>
              Things I've <span style={{ color: t.accent }}>built</span>.
            </h2>
          </FadeInSection>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "24px",
          }}>
            <FadeInSection delay={0.1}>
              <ProjectCard title="Relay – LLM Cost Gateway"
                date="July 2026" link="https://github.com/Nishant2306/relay"
                live="https://nishant2306.github.io/relay/"
                tech="Python · FastAPI · Redis Stack · PostgreSQL · Prometheus · Docker" icon={(props) => <RocketIcon {...props} />} gradient={t.accent}
                bullets={[
                  "OpenAI-compatible LLM gateway with local-embedding semantic caching (95% hit rate, 2.5% false hits on an 80-pair holdout) and complexity-based model routing, cutting simulated API spend 91% over 67k-request load tests.",
                  "Lua token-bucket rate limiting, per-team budgets, and circuit-breaker failover that held zero dropped requests through provider-outage drills at 3.6 ms p50 overhead, tracked in Prometheus and Grafana.",
                ]}
              />
            </FadeInSection>
            <FadeInSection delay={0.2}>
              <ProjectCard title="Argus – LLM Eval Platform"
                date="May 2026" link="https://github.com/Nishant2306/argus"
                live="https://nishant2306.github.io/argus/"
                tech="Python · FastAPI · PostgreSQL · Streamlit · GitHub Actions · HDBSCAN" icon={(props) => <StarBadgeIcon {...props} />} gradient={t.accent2}
                bullets={[
                  "End-to-end tracing for multi-step LLM chains, auto-mining production traces into eval datasets via HDBSCAN clustering plus LLM labeling, adding 143 cases at 92% verified precision.",
                  "80-case adversarial benchmark with a six-flag safety judge and a paired McNemar CI gate that flagged every injected prompt regression before merge, backed by a root-cause analyzer at 81% step-identification accuracy.",
                ]}
              />
            </FadeInSection>
            <FadeInSection delay={0.1}>
              <ProjectCard title="Cue – AI Workspace Agent"
                date="February 2026" link="https://github.com/Siriapps/Cue"
                tech="Gemini · React · MongoDB Atlas · Model Context Protocol" icon={(props) => <BrainIcon {...props} />} gradient={t.accent}
                bullets={[
                  "Chrome extension pairing Gemini with MongoDB Atlas to forecast a user's next five tasks from browsing history, surfaced through a real-time React dashboard.",
                  "Model Context Protocol (MCP) integration orchestrating actions across 9+ Google Workspace tools, plus a multimodal scribe producing meeting summaries and highlight reels.",
                ]}
              />
            </FadeInSection>
            <FadeInSection delay={0.2}>
              <ProjectCard title="DIVDASH"
                date="October 2023" link="https://github.com/Nishant2306/DiveDash"
                tech="React.js · Node.js · Firebase · TensorFlow · AWS Bedrock" icon={(props) => <ChartIcon {...props} />} gradient={t.accent2}
                bullets={[
                  "Diversity & Inclusion metrics dashboard with AWS Bedrock for generative AI insights and NLP-powered summaries.",
                  "Real-time tracking and multilingual visualizations that improved decision-making speed by 30%.",
                ]}
              />
            </FadeInSection>
            <FadeInSection delay={0.1}>
              <ProjectCard title="DISHA"
                date="August 2024" link="https://github.com/satty26/disha"
                tech="Dart · Flutter · AWS SageMaker · Android Studio" icon={(props) => <GradCapIcon {...props} />} gradient="#FFD700"
                bullets={[
                  "Android and web platform connecting 2,000+ students with 500+ professionals using ML models on AWS SageMaker.",
                  "Students posted 5,000+ questions and received multimedia responses from verified experts across domains.",
                ]}
              />
            </FadeInSection>
            <FadeInSection delay={0.2}>
              <ProjectCard title="AID – Assistive Interface for the Deaf"
                date="January 2023"
                tech="Flutter · TensorFlow · Firebase · Blender" icon={(props) => <HandSignIcon {...props} />} gradient="#00d4ff"
                bullets={[
                  "Android app using Flutter, Firebase, and TensorFlow to assist the hearing impaired in public settings.",
                  "Speech-to-sign ML model with 92% accuracy, converting voice to real-time animated hand gestures via Blender.",
                ]}
              />
            </FadeInSection>
          </div>
        </section>

        <section id="skills" style={{
          padding: `${sectionPy} ${sectionPx}`,
          maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 2,
        }}>
          <FadeInSection>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px", color: t.accent,
              letterSpacing: "4px", textTransform: "uppercase", marginBottom: "16px",
            }}>// Skills</div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: isMobile ? "clamp(28px, 8vw, 36px)" : "clamp(32px, 4vw, 48px)",
              fontWeight: 700,
              margin: "0 0 48px 0", letterSpacing: "-1px",
            }}>
              My <span style={{ color: t.accent2 }}>tech</span> arsenal.
            </h2>
          </FadeInSection>

          {skillCategories.map((cat, ci) => (
            <FadeInSection key={ci} delay={ci * 0.15}>
              <div style={{ marginBottom: "40px" }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px", color: t.textMuted,
                  letterSpacing: "3px", marginBottom: "16px",
                }}>{cat.title}</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                  {cat.skills.map((skill, si) => (
                    <SkillOrb key={si} name={skill.name} color={skill.color} isMobile={isMobile} />
                  ))}
                </div>
              </div>
            </FadeInSection>
          ))}
        </section>

        <section id="education" style={{
          padding: `60px ${sectionPx} ${sectionPy}`,
          maxWidth: "1100px", margin: "0 auto", position: "relative", zIndex: 2,
        }}>
          <FadeInSection>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px", color: t.accent,
              letterSpacing: "4px", textTransform: "uppercase", marginBottom: "16px",
            }}>// Education</div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: isMobile ? "clamp(28px, 8vw, 36px)" : "clamp(32px, 4vw, 48px)",
              fontWeight: 700,
              margin: "0 0 48px 0", letterSpacing: "-1px",
            }}>
              Where I <span style={{ color: t.accent }}>learned</span>.
            </h2>
          </FadeInSection>

          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
            gap: "24px",
          }}>
            <FadeInSection delay={0.1}>
              <div style={{
                padding: isMobile ? "24px 20px" : "32px",
                borderRadius: "16px",
                border: `1px solid ${t.border}`, background: t.cardBg,
              }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px", color: t.accent,
                  letterSpacing: "2px", marginBottom: "8px",
                }}>AUG 2025 – MAY 2027</div>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: isMobile ? "18px" : "20px", fontWeight: 700, color: t.text,
                  margin: "0 0 4px 0",
                }}>Indiana University Bloomington</h3>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: isMobile ? "13px" : "14px", color: t.textSecondary,
                }}>Master of Science, Computer Science · GPA: 3.76/4.0</div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px", color: t.textMuted, marginTop: "4px",
                }}>Bloomington, Indiana</div>
              </div>
            </FadeInSection>
            <FadeInSection delay={0.2}>
              <div style={{
                padding: isMobile ? "24px 20px" : "32px",
                borderRadius: "16px",
                border: `1px solid ${t.border}`, background: t.cardBg,
              }}>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px", color: t.accent2,
                  letterSpacing: "2px", marginBottom: "8px",
                }}>AUG 2020 – MAY 2024</div>
                <h3 style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: isMobile ? "18px" : "20px", fontWeight: 700, color: t.text,
                  margin: "0 0 4px 0",
                }}>IIIT Pune</h3>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: isMobile ? "13px" : "14px", color: t.textSecondary,
                }}>B.Tech, Computer Science & Engineering · GPA: 8.04/10</div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px", color: t.textMuted, marginTop: "4px",
                }}>Pune, India</div>
              </div>
            </FadeInSection>
          </div>
        </section>

        <section id="contact" style={{
          padding: `${sectionPy} ${sectionPx} 80px`,
          maxWidth: "1100px",
          margin: "0 auto", position: "relative", zIndex: 2, textAlign: "center",
        }}>
          <FadeInSection>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "12px", color: t.accent,
              letterSpacing: "4px", textTransform: "uppercase", marginBottom: "16px",
            }}>// Contact</div>
            <h2 style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: isMobile ? "clamp(28px, 8vw, 40px)" : "clamp(36px, 5vw, 56px)",
              fontWeight: 800,
              margin: "0 0 24px 0", letterSpacing: "-1px",
            }}>
              Let's build something<br />
              <span style={{
                background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>extraordinary</span>.
            </h2>
            <p style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: isMobile ? "15px" : "18px", color: t.textSecondary,
              maxWidth: "500px", margin: "0 auto 40px", lineHeight: 1.6,
            }}>
              I'm always open to exciting opportunities, collaborations, and conversations about tech.
            </p>

            {isMobile ? (
              <div style={{
                display: "flex", gap: "12px",
                justifyContent: "center", flexWrap: "wrap",
              }}>
                <a href="mailto:nishantchaudhary0512@gmail.com" style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  padding: "14px 20px",
                  borderRadius: "8px",
                  background: `linear-gradient(135deg, ${t.accent}, ${mode === "dark" ? "#00d4a0" : "#00b38a"})`,
                  color: mode === "dark" ? "#09090b" : "#fff",
                  fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase",
                  textDecoration: "none", boxShadow: `0 0 30px ${t.accent}30`, transition: "all 0.3s",
                  wordBreak: "break-all",
                  display: "inline-flex", alignItems: "center", gap: "8px",
                }}><FaEnvelope style={{ fontSize: "14px", flexShrink: 0 }} /> nishantchaudhary0512@gmail.com</a>
                <a href="tel:+19309044657" style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  padding: "14px 20px",
                  borderRadius: "8px",
                  border: `1px solid ${t.borderHover}`, background: t.surface,
                  color: t.textSecondary, letterSpacing: "1px", textDecoration: "none", transition: "all 0.3s",
                  display: "inline-flex", alignItems: "center", gap: "8px",
                }}><FaPhoneAlt style={{ fontSize: "13px" }} /> +1 (930) 904-4657</a>
                <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  padding: "14px 20px",
                  borderRadius: "8px",
                  border: `1px solid ${t.accent2}40`, background: `${t.accent2}08`,
                  color: t.accent2, letterSpacing: "1px", textDecoration: "none", transition: "all 0.3s",
                  display: "inline-flex", alignItems: "center", gap: "8px",
                }}><FaLinkedinIn style={{ fontSize: "14px" }} /> LinkedIn ↗</a>
                <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: "11px",
                  padding: "14px 20px",
                  borderRadius: "8px",
                  border: `1px solid ${t.accent2}40`, background: `${t.accent2}08`,
                  color: t.accent2, letterSpacing: "1px", textDecoration: "none", transition: "all 0.3s",
                  display: "inline-flex", alignItems: "center", gap: "8px",
                }}><FaGithub style={{ fontSize: "14px" }} /> GitHub ↗</a>
                <a
                  href={resumePdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "11px",
                    padding: "14px 20px",
                    borderRadius: "8px",
                    border: `1px solid ${t.accent2}40`, background: `${t.accent2}08`,
                    color: t.accent2, letterSpacing: "1px", textDecoration: "none", transition: "all 0.3s",
                    display: "inline-flex", alignItems: "center", gap: "8px",
                  }}
                >
                  <FaFileAlt style={{ fontSize: "14px" }} /> Resume ↗
                </a>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                  <a href="mailto:nishantchaudhary0512@gmail.com" style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "13px",
                    padding: "16px 36px",
                    borderRadius: "8px",
                    background: `linear-gradient(135deg, ${t.accent}, ${mode === "dark" ? "#00d4a0" : "#00b38a"})`,
                    color: mode === "dark" ? "#09090b" : "#fff",
                    fontWeight: 600, letterSpacing: "1px", textTransform: "uppercase",
                    textDecoration: "none", boxShadow: `0 0 30px ${t.accent}30`, transition: "all 0.3s",
                    display: "inline-flex", alignItems: "center", gap: "8px",
                  }}><FaEnvelope style={{ fontSize: "14px", flexShrink: 0 }} /> nishantchaudhary0512@gmail.com</a>
                  <a href="tel:+19309044657" style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "13px",
                    padding: "16px 36px",
                    borderRadius: "8px",
                    border: `1px solid ${t.borderHover}`, background: t.surface,
                    color: t.textSecondary, letterSpacing: "1px", textDecoration: "none", transition: "all 0.3s",
                    display: "inline-flex", alignItems: "center", gap: "8px",
                  }}><FaPhoneAlt style={{ fontSize: "13px" }} /> +1 (930) 904-4657</a>
                </div>
                <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
                  <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "13px",
                    padding: "16px 36px",
                    borderRadius: "8px",
                    border: `1px solid ${t.accent2}40`, background: `${t.accent2}08`,
                    color: t.accent2, letterSpacing: "1px", textDecoration: "none", transition: "all 0.3s",
                    display: "inline-flex", alignItems: "center", gap: "8px",
                  }}><FaLinkedinIn style={{ fontSize: "14px" }} /> LinkedIn ↗</a>
                  <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: "13px",
                    padding: "16px 36px",
                    borderRadius: "8px",
                    border: `1px solid ${t.accent2}40`, background: `${t.accent2}08`,
                    color: t.accent2, letterSpacing: "1px", textDecoration: "none", transition: "all 0.3s",
                    display: "inline-flex", alignItems: "center", gap: "8px",
                  }}><FaGithub style={{ fontSize: "14px" }} /> GitHub ↗</a>
                  <a
                    href={resumePdf}
                    target="_blank"
                    rel="noopener noreferrer"
                    
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: "13px",
                      padding: "16px 36px",
                      borderRadius: "8px",
                      border: `1px solid ${t.accent2}40`, background: `${t.accent2}08`,
                      color: t.accent2, letterSpacing: "1px", textDecoration: "none", transition: "all 0.3s",
                      display: "inline-flex", alignItems: "center", gap: "8px",
                    }}
                  >
                    <FaFileAlt style={{ fontSize: "14px" }} /> Resume ↗
                  </a>
                </div>
              </div>
            )}
          </FadeInSection>

          <div style={{
            marginTop: isMobile ? "80px" : "120px",
            paddingTop: "40px",
            borderTop: `1px solid ${t.border}`,
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: "center",
            gap: isMobile ? "8px" : "0",
          }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px", color: t.textMuted, letterSpacing: "1px",
            }}>© 2026 Nishant Chaudhary</div>
            {!isMobile && (
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: "10px", color: t.textMuted, letterSpacing: "1px",
              }}>
                press <span style={{ color: t.accent }}>`</span> for terminal · <span style={{ color: t.accent }}>ctrl+k</span> to navigate
              </div>
            )}
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "11px", color: t.textMuted, letterSpacing: "1px",
            }}>Designed & Built with ♡</div>
          </div>
        </section>
      </div>
    </ThemeContext.Provider>
  );
}