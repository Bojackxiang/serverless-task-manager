export function TaskBoardIllustration() {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Background cards representing kanban columns */}
      <rect
        x="20"
        y="40"
        width="100"
        height="220"
        rx="12"
        fill="hsl(var(--primary))"
        opacity="0.1"
      />
      <rect
        x="150"
        y="40"
        width="100"
        height="220"
        rx="12"
        fill="hsl(var(--primary))"
        opacity="0.15"
      />
      <rect
        x="280"
        y="40"
        width="100"
        height="220"
        rx="12"
        fill="hsl(var(--primary))"
        opacity="0.2"
      />

      {/* Task cards in first column */}
      <rect
        x="30"
        y="70"
        width="80"
        height="50"
        rx="8"
        fill="hsl(var(--background))"
        stroke="hsl(var(--border))"
        strokeWidth="2"
      />
      <rect
        x="30"
        y="130"
        width="80"
        height="50"
        rx="8"
        fill="hsl(var(--background))"
        stroke="hsl(var(--border))"
        strokeWidth="2"
      />
      <rect
        x="30"
        y="190"
        width="80"
        height="50"
        rx="8"
        fill="hsl(var(--background))"
        stroke="hsl(var(--border))"
        strokeWidth="2"
      />

      {/* Task cards in second column */}
      <rect
        x="160"
        y="70"
        width="80"
        height="50"
        rx="8"
        fill="hsl(var(--primary))"
        opacity="0.9"
      />
      <rect
        x="160"
        y="130"
        width="80"
        height="50"
        rx="8"
        fill="hsl(var(--primary))"
        opacity="0.9"
      />

      {/* Task card in third column */}
      <rect
        x="290"
        y="70"
        width="80"
        height="50"
        rx="8"
        fill="hsl(var(--primary))"
      />

      {/* Checkmark accent */}
      <circle
        cx="330"
        cy="95"
        r="12"
        fill="hsl(var(--background))"
        opacity="0.3"
      />
      <path
        d="M325 95 L328 98 L335 91"
        stroke="hsl(var(--background))"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function CollaborationIllustration() {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Central hub circle */}
      <circle
        cx="200"
        cy="150"
        r="50"
        fill="hsl(var(--primary))"
        opacity="0.2"
      />
      <circle
        cx="200"
        cy="150"
        r="35"
        fill="hsl(var(--primary))"
        opacity="0.4"
      />

      {/* User avatars positioned around the hub */}
      <circle
        cx="120"
        cy="80"
        r="28"
        fill="hsl(var(--primary))"
        opacity="0.8"
      />
      <circle cx="120" cy="80" r="20" fill="hsl(var(--background))" />

      <circle
        cx="280"
        cy="80"
        r="28"
        fill="hsl(var(--primary))"
        opacity="0.7"
      />
      <circle cx="280" cy="80" r="20" fill="hsl(var(--background))" />

      <circle
        cx="320"
        cy="180"
        r="28"
        fill="hsl(var(--primary))"
        opacity="0.9"
      />
      <circle cx="320" cy="180" r="20" fill="hsl(var(--background))" />

      <circle
        cx="80"
        cy="220"
        r="28"
        fill="hsl(var(--primary))"
        opacity="0.6"
      />
      <circle cx="80" cy="220" r="20" fill="hsl(var(--background))" />

      {/* Connection lines */}
      <line
        x1="140"
        y1="95"
        x2="180"
        y2="130"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        opacity="0.4"
        strokeDasharray="4 4"
      />
      <line
        x1="260"
        y1="95"
        x2="220"
        y2="130"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        opacity="0.4"
        strokeDasharray="4 4"
      />
      <line
        x1="295"
        y1="170"
        x2="235"
        y2="155"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        opacity="0.4"
        strokeDasharray="4 4"
      />
      <line
        x1="105"
        y1="205"
        x2="165"
        y2="165"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        opacity="0.4"
        strokeDasharray="4 4"
      />

      {/* Center icon - connection node */}
      <circle cx="200" cy="150" r="8" fill="hsl(var(--primary))" />
    </svg>
  );
}

export function ScalingIllustration() {
  return (
    <svg
      viewBox="0 0 400 300"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Ascending bars representing growth */}
      <rect
        x="50"
        y="180"
        width="50"
        height="80"
        rx="8"
        fill="hsl(var(--primary))"
        opacity="0.4"
      />
      <rect
        x="120"
        y="140"
        width="50"
        height="120"
        rx="8"
        fill="hsl(var(--primary))"
        opacity="0.6"
      />
      <rect
        x="190"
        y="100"
        width="50"
        height="160"
        rx="8"
        fill="hsl(var(--primary))"
        opacity="0.8"
      />
      <rect
        x="260"
        y="60"
        width="50"
        height="200"
        rx="8"
        fill="hsl(var(--primary))"
      />

      {/* Upward arrow overlay */}
      <path
        d="M 80 220 L 140 160 L 200 120 L 260 80 L 285 105"
        stroke="hsl(var(--background))"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />

      {/* Arrow head */}
      <path
        d="M 285 105 L 275 110 M 285 105 L 280 115"
        stroke="hsl(var(--background))"
        strokeWidth="3"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Decorative nodes on the line */}
      <circle
        cx="80"
        cy="220"
        r="5"
        fill="hsl(var(--background))"
        opacity="0.8"
      />
      <circle
        cx="140"
        cy="160"
        r="5"
        fill="hsl(var(--background))"
        opacity="0.8"
      />
      <circle
        cx="200"
        cy="120"
        r="5"
        fill="hsl(var(--background))"
        opacity="0.8"
      />
      <circle
        cx="260"
        cy="80"
        r="5"
        fill="hsl(var(--background))"
        opacity="0.8"
      />

      {/* Cloud shapes representing serverless */}
      <ellipse
        cx="340"
        cy="50"
        rx="30"
        ry="20"
        fill="hsl(var(--primary))"
        opacity="0.2"
      />
      <ellipse
        cx="355"
        cy="45"
        rx="25"
        ry="18"
        fill="hsl(var(--primary))"
        opacity="0.2"
      />
    </svg>
  );
}
