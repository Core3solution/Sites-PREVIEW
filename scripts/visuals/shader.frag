#version 300 es
// CORE 3 — estudos visuais procedurais (ilustrações originais, sem fotografia).
// Superfície de pintura automotiva com verniz refletindo um estúdio de barras de LED.
precision highp float;
uniform vec2 uRes;
uniform float uSeed;
// câmera
uniform float uCamH, uPitch, uYaw, uFov, uRoll;
// forma: 0 capô/ombro, 1 plano com gotas, 2 vidro, 3 teto
uniform int uShape;
uniform vec3 uBase;        // cor de base da pintura (linear)
uniform float uFlake;      // intensidade do metálico
uniform float uRough;      // borrão do reflexo (0 = espelho)
uniform float uFocus;      // distância de foco
uniform float uDof;        // intensidade do desfoque por distância
uniform float uFilm;       // >0: borda de película PPF
uniform float uBeads;      // densidade de gotas (0 = sem)
uniform float uTubeAngle, uTubeSpacing, uWarm, uEnvGain, uWall;
uniform float uCurve, uCrease, uCreaseX, uCreaseSlope, uEdgeZ;
uniform float uExposure, uVignette;
out vec4 fragColor;

float hash(vec2 p){ p=fract(p*vec2(123.34,456.21)+uSeed); p+=dot(p,p+45.32); return fract(p.x*p.y); }
vec2 hash2(vec2 p){ return vec2(hash(p), hash(p+17.7)); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y); }
float fbm(vec2 p){ float s=0., a=.5; for(int i=0;i<5;i++){ s+=a*noise(p); p=p*2.03+7.1; a*=.5; } return s; }

mat2 rot(float a){ float c=cos(a), s=sin(a); return mat2(c,-s,s,c); }

// ---------- ambiente: estúdio escuro com tubos de LED ----------
vec3 tubeCol(float k){ return mix(vec3(1.0,0.98,0.95), vec3(1.0,0.78,0.45), k); }

float segLine(vec2 q, float off, float halfLen, float w, float soft){
  float lx = abs(q.x-off);
  float a = smoothstep(w+soft, w-soft*0.5, lx);
  float b = smoothstep(halfLen+soft*4.0, halfLen-soft*2.0, abs(q.y));
  return a*b;
}
vec3 env(vec3 d, float blur){
  d = normalize(d);
  // estúdio escuro: leve gradiente nas paredes
  vec3 col = vec3(0.0030,0.0032,0.0036);
  col += vec3(0.022,0.022,0.024)*exp(-abs(d.y-0.08)*7.0);
  if(d.y>0.02){
    vec2 q = d.xz/d.y*0.7;
    float dist = length(q);
    q = rot(uTubeAngle)*q;
    float soft = 0.01 + blur*0.5 + dist*0.012;
    // teto do estúdio: linhas de LED longas em dois grupos diagonais (sem grade)
    float tubes = 0.0;
    for(int i=0;i<5;i++){
      float fi = float(i);
      vec2 qa = rot(0.0)*q;
      float off = (fi-2.0)*uTubeSpacing + 0.3*sin(fi*2.1+uSeed*6.0);
      float len = 5.0 + 3.0*hash(vec2(fi,uSeed));
      float cy = 2.0*sin(fi*1.7+uSeed*3.0);
      tubes += segLine(vec2(qa.x, qa.y-cy), off, len, 0.03, soft) * (0.6+0.4*hash(vec2(fi,4.0)));
    }
    for(int i=0;i<3;i++){
      float fi = float(i);
      vec2 qb = rot(0.75)*q;
      float off = (fi-1.0)*uTubeSpacing*1.7 + 0.8;
      float cy = 3.0 + 2.5*fi;
      tubes += segLine(vec2(qb.x, qb.y-cy), off, 2.6, 0.028, soft)*0.7;
    }
    float fade = exp(-dist*0.05);
    col += tubeCol(uWarm)*tubes*6.0*fade;
    col += vec3(0.9,0.92,1.0)*0.02*exp(-dist*0.15);
  }
  if(uWall>0.0){
    float th = atan(d.x,d.z);
    float yy = d.y/max(length(d.xz),1e-3);
    float soft = 0.002 + blur*0.08;
    float bars = 0.0;
    for(int i=0;i<3;i++){
      float c = -0.95 + float(i)*0.82 + 0.15*float(i*i);
      float lx = abs(th-c);
      bars += smoothstep(0.006+soft, 0.006-soft*0.5, lx);
    }
    bars *= smoothstep(-0.25,-0.18+blur*0.1,yy) * smoothstep(0.55,0.48-blur*0.1,yy);
    col += vec3(1.0,0.98,0.95)*bars*uWall*3.0;
  }
  return col*uEnvGain;
}

// ---------- formas ----------
float heightF(vec2 p){
  if(uShape==0 || uShape==3){
    float h = -uCurve*p.x*p.x - 0.010*p.y*p.y;
    float r = p.x - (uCreaseX + uCreaseSlope*p.y);
    h += -uCrease*sqrt(r*r+0.0025);
    h += 0.0006*fbm(p*2.0); // ondulação do verniz (casca de laranja muito sutil)
    return h;
  }
  if(uShape==2){ return -0.004*p.x*p.x; }
  return -0.004*p.x*p.x + 0.0003*fbm(p*3.0);
}

vec3 normalAt(vec2 p){
  float e = 0.002;
  float hx = heightF(p+vec2(e,0)) - heightF(p-vec2(e,0));
  float hz = heightF(p+vec2(0,e)) - heightF(p-vec2(0,e));
  return normalize(vec3(-hx, 2.0*e, -hz));
}

vec3 aces(vec3 x){ return clamp((x*(2.51*x+0.03))/(x*(2.43*x+0.59)+0.14),0.,1.); }

void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag - 0.5*uRes)/uRes.y;
  uv = rot(uRoll)*uv;
  vec3 ro = vec3(0.0, uCamH, 0.0);
  vec3 fw = normalize(vec3(sin(uYaw), -sin(uPitch), cos(uYaw)));
  vec3 rt = normalize(cross(vec3(0,1,0), fw));
  vec3 up = cross(fw, rt);
  vec3 rd = normalize(fw + uFov*(uv.x*rt + uv.y*up));

  vec3 col;
  float t = -ro.y/rd.y;
  bool hit = rd.y < -1e-4;
  vec3 P = ro + rd*t;
  float edge = 1.0;
  if(hit && uEdgeZ>0.0){
    float ez = uEdgeZ + 0.35*P.x*P.x*0.1;
    edge = smoothstep(ez+0.02, ez-0.02, P.z);
  }
  // fundo (além da borda do painel)
  // fundo: estúdio fora de foco, sem elementos reconhecíveis
  vec3 bg = vec3(0.0032,0.0034,0.0038) + vec3(0.010,0.010,0.011)*exp(-abs(rd.y-0.05)*6.0);
  bg += env(rd, 1.2)*0.04*uWall;

  if(hit){
    vec2 p = P.xz;
    float blur = uRough + uDof*abs(t-uFocus)/max(uFocus,0.01);
    vec3 N = normalAt(p);
    vec3 baseC = uBase;
    float filmMask = 0.0;
    float rim = 0.0;
    // película PPF
    if(uFilm>0.0){
      float fe = p.x - (0.15 + 0.22*p.y + 0.06*sin(p.y*1.3));
      filmMask = smoothstep(0.0,0.004,-fe);
      float ln = exp(-abs(fe)*900.0);
      rim = ln;
      N = normalize(N + vec3(0.0, 0.0, 0.0) + filmMask*vec3((noise(p*60.)-0.5)*0.004, 0.0, (noise(p*60.+3.)-0.5)*0.004));
    }
    // gotas d'água (efeito hidrofóbico)
    float drop = 0.0; vec3 dropN = N; float dropEdge = 0.0;
    if(uBeads>0.0){
      vec2 g = p*uBeads;
      vec2 gi = floor(g);
      float best = 1e9;
      for(int j=-1;j<=1;j++) for(int i=-1;i<=1;i++){
        vec2 c = gi+vec2(i,j);
        vec2 o = hash2(c);
        float rr = mix(0.08,0.42,pow(hash(c+3.1),2.2));
        if(hash(c+8.3)<0.18) continue;
        vec2 dv = g - (c + 0.15 + 0.7*o);
        dv.y *= 1.0 + 0.15*hash(c+1.3);
        float d = length(dv);
        if(d<rr && d/rr<best){
          best = d/rr;
          float k = d/rr;
          float hgt = sqrt(max(1.0-k*k,0.0));
          dropN = normalize(vec3(dv.x/rr, hgt*1.1+0.05, dv.y/rr));
          drop = 1.0;
          dropEdge = smoothstep(0.75,1.0,k);
        }
      }
      if(drop>0.5){ N = dropN; blur *= 0.5; }
    }
    vec3 V = -rd;
    vec3 R = reflect(rd, N);
    float ndv = clamp(dot(N,V),0.0,1.0);
    float F = 0.04 + 0.96*pow(1.0-ndv,5.0);
    if(drop>0.5) F = 0.02 + 0.98*pow(1.0-ndv,4.0);
    F += filmMask*0.012;
    vec3 refl = env(R, blur);
    // base metálica (flocos)
    vec2 fc = floor(p*900.0);
    float fl = pow(hash(fc), 30.0)*uFlake*(1.0-clamp(blur*3.0,0.0,1.0));
    vec3 Nf = normalize(N + 0.25*vec3(hash(fc+1.)-.5, 0.0, hash(fc+2.)-.5));
    vec3 flakes = env(reflect(rd,Nf), 0.6)*fl*0.12;
    vec3 diffuseAmb = baseC*(0.02 + 0.6*env(vec3(N.x,1.0,N.z),1.0).g*0.02);
    col = diffuseAmb*(1.0-F) + flakes*(1.0-F) + refl*F;
    if(drop>0.5){
      // gota: lente convexa — reflexo comprimido do teto + brilho especular + borda escura fina
      vec3 dr = env(R, blur*0.3);
      col = dr*(0.10 + 0.9*pow(1.0-ndv,3.0)) + env(refract(rd,N,0.75), 0.4)*0.05;
      col *= 1.0 - 0.45*dropEdge;
    }
    col += rim*(env(R,0.0)*0.35 + vec3(0.05));
    // gradiente cerâmico (vidro com serigrafia)
    if(uShape==2){
      float band = p.x + 0.9;
      vec2 dg = fract(p*vec2(28.0,28.0))-0.5;
      float dsz = clamp(1.0 - band*1.4, 0.0, 0.6);
      float dots = smoothstep(dsz+0.02, dsz-0.02, length(dg));
      float solid = smoothstep(-0.02,0.02,-band);
      float frit = max(dots*step(0.0,band), solid);
      col = mix(col, vec3(0.002)+refl*0.03, frit*0.92);
    }
    col = mix(bg, col, edge);
    // linha de silhueta sutil na borda
    if(uEdgeZ>0.0){ col += vec3(0.6,0.62,0.65)*0.02*exp(-abs(P.z-uEdgeZ)*60.0)*edge; }
  } else {
    col = bg;
  }
  col *= uExposure;
  col = aces(col);
  // vinheta + grão
  vec2 q = frag/uRes;
  col *= mix(1.0, pow(16.0*q.x*q.y*(1.0-q.x)*(1.0-q.y), 0.22), uVignette);
  col = pow(col, vec3(1.0/2.2));
  col += (hash(frag+uSeed*13.)-0.5)/255.0*2.0;
  fragColor = vec4(col,1.0);
}
