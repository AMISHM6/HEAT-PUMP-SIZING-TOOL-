import React from "react";

const SVGS = [
  "/air_to_water_heat_pump.svg",
  "/air_to_air_heat_pump_correct.svg",
  "/water_to_water_heat_pump.svg",
  "/ground_source_heat_pump.svg",
];

const SLOTS = [
  [2, 5], [10, 3], [18, 8], [26, 2], [34, 7], [42, 4], [50, 10], [58, 3], [66, 8], [74, 5], [82, 2], [90, 7],
  [4, 20], [12, 26], [20, 18], [28, 30], [36, 22], [44, 28], [52, 16], [60, 24], [68, 32], [76, 20], [88, 26],
  [6, 38], [14, 44], [22, 36], [30, 48], [38, 40], [46, 52], [54, 44], [62, 50], [70, 38], [78, 46], [86, 42],
  [3, 58], [11, 64], [19, 56], [27, 70], [35, 62], [43, 74], [51, 66], [59, 72], [67, 60], [75, 68], [83, 64],
  [8, 78], [16, 84], [24, 76], [32, 88], [40, 80], [48, 86], [56, 78], [64, 84], [72, 76], [80, 82], [92, 74],
  [5, 14], [25, 12], [45, 34], [65, 54], [85, 18], [15, 52], [55, 8], [75, 36], [33, 58], [48, 22],
];

const MACHINES = SLOTS.map(([left, top], i) => ({
  src: SVGS[i % SVGS.length],
  left: `${left}%`,
  top: `${top}%`,
  size: 48 + (i % 6) * 12,
  duration: 5 + (i % 5),
  delay: (i % 9) * 0.4,
}));

export default function BackgroundMachines() {
  return (
    <div className="bg-machines" aria-hidden="true">
      {MACHINES.map((m, i) => (
        <img
          key={i}
          className="bg-machine"
          src={m.src}
          alt=""
          style={{
            left: m.left,
            top: m.top,
            width: m.size,
            height: m.size,
            animationDuration: `${m.duration}s`,
            animationDelay: `${m.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
