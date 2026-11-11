// Parâmetros de cada estudo visual procedural.
// Todas as imagens são ilustrações originais geradas por computador (CORE 3),
// sem uso de fotografias de terceiros e sem representar veículos/serviços reais da empresa.
const base = {
  uSeed: 0.37, uCamH: 0.55, uPitch: 0.28, uYaw: 0.0, uFov: 0.9, uRoll: 0.0,
  uShape: 0, uBase: [0.004, 0.004, 0.005], uFlake: 0.35, uRough: 0.0,
  uFocus: 2.2, uDof: 0.05, uFilm: 0, uBeads: 0,
  uTubeAngle: 0.35, uTubeSpacing: 1.1, uWarm: 0.0, uEnvGain: 1.0, uWall: 0.0,
  uCurve: 0.09, uCrease: 0.05, uCreaseX: 0.25, uCreaseSlope: 0.18, uEdgeZ: 0.0,
  uExposure: 1.0, uVignette: 0.8,
};

export const scenes = [
  { id: 'hero', w: 2400, h: 1350, alt: 'Estudo visual: pintura preta espelhada refletindo barras de LED de um estúdio',
    p: { ...base, uCamH: 0.33, uPitch: 0.2, uYaw: -0.22, uFov: 0.85, uEdgeZ: 3.4, uWall: 0, uFocus: 1.6, uDof: 0.08, uCurve: 0.2, uCrease: 0.1, uCreaseX: 0.15, uCreaseSlope: 0.12, uTubeAngle: 1.0, uExposure: 1.55 } },
  { id: 'ppf', w: 1600, h: 1200, alt: 'Estudo visual: borda de película de proteção sobre pintura escura',
    p: { ...base, uSeed: 0.71, uCamH: 0.3, uPitch: 0.42, uYaw: 0.25, uFilm: 1, uFocus: 0.75, uDof: 0.12, uCurve: 0.14, uCrease: 0.0, uTubeAngle: 0.15, uTubeSpacing: 0.8, uEdgeZ: 2.2 } },
  { id: 'vitrificacao', w: 1600, h: 1200, alt: 'Estudo visual: gotas de água sobre superfície hidrofóbica',
    p: { ...base, uSeed: 0.13, uShape: 1, uCamH: 0.18, uPitch: 0.5, uBeads: 22, uFocus: 0.32, uDof: 0.25, uFlake: 0.3, uTubeAngle: 0.25, uTubeSpacing: 0.9, uBase: [0.003, 0.004, 0.008] } },
  { id: 'envelopamento', w: 1600, h: 1200, alt: 'Estudo visual: acabamento acetinado em superfície curva',
    p: { ...base, uSeed: 0.55, uShape: 3, uCamH: 0.5, uPitch: 0.3, uRough: 0.22, uFlake: 0.0, uBase: [0.012, 0.012, 0.013], uCurve: 0.2, uCrease: 0.03, uCreaseX: -0.1, uCreaseSlope: -0.25, uEdgeZ: 2.6, uTubeAngle: 0.05, uDof: 0.04, uExposure: 1.25 } },
  { id: 'insulfilm', w: 1600, h: 1200, alt: 'Estudo visual: vidro escurecido com degradê serigrafado',
    p: { ...base, uSeed: 0.91, uShape: 2, uCamH: 0.45, uPitch: 0.55, uYaw: 0.2, uFlake: 0.0, uBase: [0.002, 0.002, 0.003], uFocus: 0.8, uDof: 0.08, uTubeAngle: 0.7, uTubeSpacing: 0.75 } },
  { id: 'polimento', w: 1600, h: 1200, alt: 'Estudo visual: reflexo nítido em pintura grafite metálica',
    p: { ...base, uSeed: 0.29, uCamH: 0.35, uPitch: 0.24, uYaw: 0.4, uBase: [0.012, 0.013, 0.016], uFlake: 1.4, uFocus: 1.2, uDof: 0.06, uCurve: 0.06, uCrease: 0.08, uCreaseX: 0.35, uCreaseSlope: -0.1, uTubeAngle: -0.3, uEdgeZ: 3.0, uWall: 0.6 } },
  { id: 'lavagem', w: 1600, h: 1200, alt: 'Estudo visual: microgotas sobre pintura escura brilhante',
    p: { ...base, uSeed: 0.47, uShape: 1, uCamH: 0.12, uPitch: 0.35, uBeads: 55, uFocus: 0.3, uDof: 0.35, uFlake: 0.5, uTubeAngle: 0.9, uTubeSpacing: 0.7 } },
  { id: 'estudio', w: 1600, h: 1200, alt: 'Estudo visual: linhas de LED refletidas em superfície preta curva',
    p: { ...base, uSeed: 0.83, uCamH: 0.26, uPitch: 0.14, uYaw: 0.35, uFov: 0.8, uEdgeZ: 3.2, uFocus: 1.4, uDof: 0.1, uCurve: 0.3, uCrease: 0.05, uCreaseX: -0.2, uCreaseSlope: 0.3, uTubeAngle: -0.4, uTubeSpacing: 0.9, uExposure: 1.4 } },
];
