import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticlesBackground = () => {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    if (!init) return null;

    return (
        <Particles
            id="tsparticles"
            options={{
                background: {
                    color: {
                        value: "#050b14", // Deep dark blue/black
                    },
                },
                fpsLimit: 120,
                interactivity: {
                    events: {
                        onClick: {
                            enable: true,
                            mode: "push",
                        },
                        onHover: {
                            enable: true,
                            mode: "bubble", // Bubble effect on hover
                        },
                        resize: true,
                    },
                    modes: {
                        push: {
                            quantity: 4,
                        },
                        bubble: {
                            distance: 200,
                            duration: 2,
                            size: 6,
                            opacity: 0.8,
                        },
                    },
                },
                particles: {
                    color: {
                        value: ["#00ffff", "#ff00ff"], // Cyan and Magenta
                    },
                    links: {
                        color: "#00ffff", // Cyan links
                        distance: 150,
                        enable: true,
                        opacity: 0.2,
                        width: 1,
                    },
                    move: {
                        direction: "none",
                        enable: true,
                        outModes: {
                            default: "bounce", // Bounce off canvas edges
                        },
                        random: true,
                        speed: 2, // Faster movement
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 800,
                        },
                        value: 60,
                    },
                    opacity: {
                        value: 0.5,
                    },
                    shape: {
                        type: ["circle", "triangle"], // Mixed shapes
                    },
                    size: {
                        value: { min: 2, max: 4 },
                    },
                },
                detectRetina: true,
            }}
            className="absolute inset-0 -z-10"
        />
    );
};

export default ParticlesBackground;
