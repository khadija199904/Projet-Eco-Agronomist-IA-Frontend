"use client";

import React from 'react';
import { motion } from 'framer-motion';

const data = [
    { day: 'Lun', health: 85 },
    { day: 'Mar', health: 82 },
    { day: 'Mer', health: 88 },
    { day: 'Jeu', health: 90 },
    { day: 'Ven', health: 86 },
    { day: 'Sam', health: 92 },
    { day: 'Dim', health: 91 },
];

export default function HealthChart() {
    const maxHeight = 100;
    const width = 500;
    const height = 200;
    const padding = 40;

    const points = data.map((d, i) => {
        const x = (i * (width - 2 * padding)) / (data.length - 1) + padding;
        const y = height - (d.health * (height - 2 * padding)) / 100 - padding;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="w-full h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-emerald-950 font-serif">Évolution de la Santé des Cultures</h3>
                <div className="flex items-center gap-4 text-xs font-medium text-stone-500">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-fresh-green" />
                        <span>Indice Santé (%)</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 min-h-0 relative">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                >
                    {/* Grid Lines */}
                    {[0, 25, 50, 75, 100].map((tick) => {
                        const y = height - (tick * (height - 2 * padding)) / 100 - padding;
                        return (
                            <g key={tick}>
                                <line
                                    x1={padding}
                                    y1={y}
                                    x2={width - padding}
                                    y2={y}
                                    stroke="#ecfdf5"
                                    strokeWidth="1"
                                />
                                <text
                                    x={padding - 10}
                                    y={y + 4}
                                    textAnchor="end"
                                    className="text-[10px] fill-stone-400 font-medium"
                                >
                                    {tick}%
                                </text>
                            </g>
                        );
                    })}

                    {/* Area fill */}
                    <motion.path
                        d={`M ${padding},${height - padding} ${points.split(' ').map((p, i) => i === 0 ? `L ${p}` : `L ${p}`).join(' ')} L ${width - padding},${height - padding} Z`}
                        fill="url(#gradient)"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.3 }}
                        transition={{ duration: 1 }}
                    />

                    {/* Line */}
                    <motion.polyline
                        points={points}
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                    />

                    {/* Points */}
                    {data.map((d, i) => {
                        const x = (i * (width - 2 * padding)) / (data.length - 1) + padding;
                        const y = height - (d.health * (height - 2 * padding)) / 100 - padding;
                        return (
                            <motion.circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="4"
                                className="fill-white stroke-emerald-500 stroke-2"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5 + i * 0.1 }}
                            />
                        );
                    })}

                    {/* Labels */}
                    {data.map((d, i) => {
                        const x = (i * (width - 2 * padding)) / (data.length - 1) + padding;
                        return (
                            <text
                                key={i}
                                x={x}
                                y={height - padding + 20}
                                textAnchor="middle"
                                className="text-[10px] fill-stone-500 font-medium"
                            >
                                {d.day}
                            </text>
                        );
                    })}

                    <defs>
                        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#ecfdf5" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        </div>
    );
}
