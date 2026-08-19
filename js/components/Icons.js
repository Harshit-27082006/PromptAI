/**
 * SafeWalk AI - Zero-dependency SVG Icon Library
 */

window.SAFEWALK_ICONS = (function() {
  const h = React.createElement;

  function createSvg(pathContent, viewBox = "0 0 24 24", className = "w-5 h-5") {
    return function(props) {
      return h('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: viewBox,
        fill: "none",
        stroke: "currentColor",
        strokeWidth: props.strokeWidth || 2,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: props.className || className,
        ...props
      }, pathContent);
    };
  }

  return {
    Shield: createSvg([
      h('path', { key: 1, d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" })
    ]),
    ShieldAlert: createSvg([
      h('path', { key: 1, d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }),
      h('line', { key: 2, x1: "12", y1: "8", x2: "12", y2: "12" }),
      h('line', { key: 3, x1: "12", y1: "16", x2: "12.01", y2: "16" })
    ]),
    ShieldCheck: createSvg([
      h('path', { key: 1, d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }),
      h('path', { key: 2, d: "m9 12 2 2 4-4" })
    ]),
    AlertTriangle: createSvg([
      h('path', { key: 1, d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" }),
      h('line', { key: 2, x1: "12", y1: "9", x2: "12", y2: "13" }),
      h('line', { key: 3, x1: "12", y1: "17", x2: "12.01", y2: "17" })
    ]),
    AlertOctagon: createSvg([
      h('polygon', { key: 1, points: "7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2" }),
      h('line', { key: 2, x1: "12", y1: "8", x2: "12", y2: "12" }),
      h('line', { key: 3, x1: "12", y1: "16", x2: "12.01", y2: "16" })
    ]),
    MapPin: createSvg([
      h('path', { key: 1, d: "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" }),
      h('circle', { key: 2, cx: "12", cy: "10", r: "3" })
    ]),
    MapPinOff: createSvg([
      h('path', { key: 1, d: "M5.43 5.43A8.06 8.06 0 0 0 4 10c0 6 8 12 8 12a29.94 29.94 0 0 0 5-5.58" }),
      h('path', { key: 2, d: "M19.18 13.52A8.66 8.66 0 0 0 20 10a8 8 0 0 0-8-8 7.9 7.9 0 0 0-2.55.42" }),
      h('line', { key: 3, x1: "2", y1: "2", x2: "22", y2: "22" })
    ]),
    Navigation: createSvg([
      h('polygon', { key: 1, points: "3 11 22 2 13 21 11 13 3 11" })
    ]),
    Compass: createSvg([
      h('circle', { key: 1, cx: "12", cy: "12", r: "10" }),
      h('polygon', { key: 2, points: "16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" })
    ]),
    Clock: createSvg([
      h('circle', { key: 1, cx: "12", cy: "12", r: "10" }),
      h('polyline', { key: 2, points: "12 6 12 12 16 14" })
    ]),
    Phone: createSvg([
      h('path', { key: 1, d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" })
    ]),
    PhoneCall: createSvg([
      h('path', { key: 1, d: "M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" }),
      h('path', { key: 2, d: "M14.05 2a9 9 0 0 1 8 7.94" }),
      h('path', { key: 3, d: "M14.05 6A5 5 0 0 1 18 10" })
    ]),
    Bell: createSvg([
      h('path', { key: 1, d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" }),
      h('path', { key: 2, d: "M10.3 21a1.94 1.94 0 0 0 3.4 0" })
    ]),
    CheckCircle2: createSvg([
      h('circle', { key: 1, cx: "12", cy: "12", r: "10" }),
      h('path', { key: 2, d: "m9 12 2 2 4-4" })
    ]),
    XCircle: createSvg([
      h('circle', { key: 1, cx: "12", cy: "12", r: "10" }),
      h('line', { key: 2, x1: "15", y1: "9", x2: "9", y2: "15" }),
      h('line', { key: 3, x1: "9", y1: "9", x2: "15", y2: "15" })
    ]),
    Volume2: createSvg([
      h('polygon', { key: 1, points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }),
      h('path', { key: 2, d: "M15.54 8.46a5 5 0 0 1 0 7.07" }),
      h('path', { key: 3, d: "M19.07 4.93a10 10 0 0 1 0 14.14" })
    ]),
    VolumeX: createSvg([
      h('polygon', { key: 1, points: "11 5 6 9 2 9 2 15 6 15 11 19 11 5" }),
      h('line', { key: 2, x1: "23", y1: "9", x2: "17", y2: "15" }),
      h('line', { key: 3, x1: "17", y1: "9", x2: "23", y2: "15" })
    ]),
    LightbulbOff: createSvg([
      h('path', { key: 1, d: "M9 18h6" }),
      h('path', { key: 2, d: "M10 22h4" }),
      h('path', { key: 3, d: "M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5" }),
      h('line', { key: 4, x1: "2", y1: "2", x2: "22", y2: "22" })
    ]),
    EyeOff: createSvg([
      h('path', { key: 1, d: "M9.88 9.88a3 3 0 1 0 4.24 4.24" }),
      h('path', { key: 2, d: "M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" }),
      h('path', { key: 3, d: "M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" }),
      h('line', { key: 4, x1: "2", y1: "2", x2: "22", y2: "22" })
    ]),
    Cone: createSvg([
      h('path', { key: 1, d: "m20.9 18.55-8-15.98a1 1 0 0 0-1.8 0l-8 15.98" }),
      h('path', { key: 2, d: "M5.71 14h12.58" }),
      h('path', { key: 3, d: "M2 22h20" })
    ]),
    HelpCircle: createSvg([
      h('circle', { key: 1, cx: "12", cy: "12", r: "10" }),
      h('path', { key: 2, d: "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" }),
      h('line', { key: 3, x1: "12", y1: "17", x2: "12.01", y2: "17" })
    ]),
    Plus: createSvg([
      h('line', { key: 1, x1: "12", y1: "5", x2: "12", y2: "19" }),
      h('line', { key: 2, x1: "5", y1: "12", x2: "19", y2: "12" })
    ]),
    RefreshCw: createSvg([
      h('path', { key: 1, d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }),
      h('path', { key: 2, d: "M21 3v5h-5" }),
      h('path', { key: 3, d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }),
      h('path', { key: 4, d: "M8 16H3v5" })
    ]),
    User: createSvg([
      h('path', { key: 1, d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" }),
      h('circle', { key: 2, cx: "12", cy: "7", r: "4" })
    ]),
    Users: createSvg([
      h('path', { key: 1, d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }),
      h('circle', { key: 2, cx: "9", cy: "7", r: "4" }),
      h('path', { key: 3, d: "M22 21v-2a4 4 0 0 0-3-3.87" }),
      h('path', { key: 4, d: "M16 3.13a4 4 0 0 1 0 7.75" })
    ]),
    ArrowRight: createSvg([
      h('line', { key: 1, x1: "5", y1: "12", x2: "19", y2: "12" }),
      h('polyline', { key: 2, points: "12 5 19 12 12 19" })
    ]),
    CornerDownRight: createSvg([
      h('polyline', { key: 1, points: "15 10 20 15 15 20" }),
      h('path', { key: 2, d: "M4 4v7a4 4 0 0 0 4 4h12" })
    ]),
    Zap: createSvg([
      h('polygon', { key: 1, points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" })
    ]),
    Info: createSvg([
      h('circle', { key: 1, cx: "12", cy: "12", r: "10" }),
      h('line', { key: 2, x1: "12", y1: "16", x2: "12", y2: "12" }),
      h('line', { key: 3, x1: "12", y1: "8", x2: "12.01", y2: "8" })
    ]),
    Moon: createSvg([
      h('path', { key: 1, d: "M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" })
    ]),
    Sun: createSvg([
      h('circle', { key: 1, cx: "12", cy: "12", r: "4" }),
      h('path', { key: 2, d: "M12 2v2" }),
      h('path', { key: 3, d: "M12 20v2" }),
      h('path', { key: 4, d: "m4.93 4.93 1.41 1.41" }),
      h('path', { key: 5, d: "m17.66 17.66 1.41 1.41" }),
      h('path', { key: 6, d: "M2 12h2" }),
      h('path', { key: 7, d: "M20 12h2" }),
      h('path', { key: 8, d: "m6.34 17.66-1.41 1.41" }),
      h('path', { key: 9, d: "m19.07 4.93-1.41 1.41" })
    ]),
    Play: createSvg([
      h('polygon', { key: 1, points: "5 3 19 12 5 21 5 3" })
    ]),
    Pause: createSvg([
      h('rect', { key: 1, x: "6", y: "4", width: "4", height: "16" }),
      h('rect', { key: 2, x: "14", y: "4", width: "4", height: "16" })
    ]),
    FastForward: createSvg([
      h('polygon', { key: 1, points: "13 19 22 12 13 5 13 19" }),
      h('polygon', { key: 2, points: "2 19 11 12 2 5 2 19" })
    ]),
    Activity: createSvg([
      h('polyline', { key: 1, points: "22 12 18 12 15 21 9 3 6 12 2 12" })
    ]),
    Send: createSvg([
      h('line', { key: 1, x1: "22", y1: "2", x2: "11", y2: "13" }),
      h('polygon', { key: 2, points: "22 2 15 22 11 13 2 9 22 2" })
    ]),
    Check: createSvg([
      h('polyline', { key: 1, points: "20 6 9 17 4 12" })
    ]),
    ChevronDown: createSvg([
      h('polyline', { key: 1, points: "6 9 12 15 18 9" })
    ]),
    ChevronUp: createSvg([
      h('polyline', { key: 1, points: "18 15 12 9 6 15" })
    ]),
    Sliders: createSvg([
      h('line', { key: 1, x1: "4", y1: "21", x2: "4", y2: "14" }),
      h('line', { key: 2, x1: "4", y1: "10", x2: "4", y2: "3" }),
      h('line', { key: 3, x1: "12", y1: "21", x2: "12", y2: "12" }),
      h('line', { key: 4, x1: "12", y1: "8", x2: "12", y2: "3" }),
      h('line', { key: 5, x1: "20", y1: "21", x2: "20", y2: "16" }),
      h('line', { key: 6, x1: "20", y1: "12", x2: "20", y2: "3" }),
      h('line', { key: 7, x1: "1", y1: "14", x2: "7", y2: "14" }),
      h('line', { key: 8, x1: "9", y1: "8", x2: "15", y2: "8" }),
      h('line', { key: 9, x1: "17", y1: "16", x2: "23", y2: "16" })
    ])
  };
})();
