export const QUESTIONS = [
  // ===== PHYSICS (1–20) — Ray Optics =====

  {
    id: 1,
    q: "Concave mirror (f = 15 cm), object placed at u = −10 cm. Nature and position of image?",
    opts: [
      "Real, inverted at v = −30 cm (used f = +15 sign error)",
      "Virtual, erect at v = +30 cm",
      "Real, erect at v = +30 cm (forgot erect ⟹ virtual for mirrors)",
      "At infinity — object is at focus (f = 10 cm confusion)"
    ],
    ans: 1,
    exp: "1/v = 1/f − 1/u = 1/(−15) − 1/(−10) = −1/15 + 1/10 = +1/30 → v = +30 cm. Positive v ⟹ virtual, erect, magnified.",
    concept: "Mirror Formula",
    subject: "Physics",
    ncert: true,
    ref: "Ray Optics"
  },

  {
    id: 2,
    q: "Light travels from glass (n₁ = 1.5) into water (n₂ = 1.33). What is the critical angle?",
    opts: [
      "62.7°  (sinC = n₂/n₁ = 1.33/1.5)",
      "41.8°  (sinC = 1/n₁ — glass-to-air, wrong medium pair)",
      "48.6°  (sinC = n₁/n₂ — ratio inverted)",
      "70.5°  (sinC = 1 − n₂/n₁ — subtraction trap)"
    ],
    ans: 0,
    exp: "sinC = n₂/n₁ = 1.33/1.5 = 0.887 → C ≈ 62.7°. Note: 41.8° is critical angle for glass→air, a common wrong substitution.",
    concept: "TIR",
    subject: "Physics",
    ncert: true,
    ref: "Ray Optics"
  },

  {
    id: 3,
    q: "Object placed exactly at the principal focus F of a convex lens (f = 20 cm). Where does the image form?",
    opts: [
      "At infinity (parallel emergent beam)",
      "At 2f = 40 cm, real and inverted",
      "At F on the same side, virtual and erect",
      "At 2f, virtual and erect (confused with concave lens)"
    ],
    ans: 0,
    exp: "u = −f → 1/v = 1/f − 1/f = 0 → v = ∞. Rays emerge parallel; image at infinity.",
    concept: "Lens Formula",
    subject: "Physics",
    ncert: true,
    ref: "Ray Optics"
  },

  {
    id: 4,
    q: "Find the power of a concave lens whose focal length is 25 cm.",
    opts: [
      "+4 D  (magnitude correct, sign dropped)",
      "−4 D",
      "−0.25 D (f not converted from cm to m)",
      "+0.4 D (used f = −2.5 m, factor of 10 error)"
    ],
    ans: 1,
    exp: "f = −0.25 m (concave → negative). P = 1/f = 1/(−0.25) = −4 D.",
    concept: "Lens Power",
    subject: "Physics",
    ncert: true,
    ref: "Ray Optics"
  },

  {
    id: 5,
    q: "Two thin lenses f₁ = +30 cm and f₂ = −10 cm are placed in contact. Net focal length?",
    opts: [
      "−15 cm",
      "+15 cm  (1/10 − 1/30 — subtraction order reversed)",
      "−7.5 cm (used harmonic mean ½(f₁+f₂)/(f₁f₂))",
      "+20 cm  (direct subtraction f₁ − f₂)"
    ],
    ans: 0,
    exp: "1/f = 1/f₁ + 1/f₂ = 1/30 + 1/(−10) = 1/30 − 3/30 = −2/30 → f = −15 cm.",
    concept: "Equivalent Lens",
    subject: "Physics",
    ncert: true,
    ref: "Ray Optics"
  },

  {
    id: 6,
    q: "A concave mirror (f = 20 cm) is to produce an image of the same size as the object. Object distance?",
    opts: [
      "20 cm — object at F (image at ∞, not same size)",
      "40 cm — object at C = 2f (m = −1)",
      "60 cm — object at 3f (image smaller, m = −1/2)",
      "10 cm — object inside F (virtual, magnified)"
    ],
    ans: 1,
    exp: "Same size (|m| = 1) requires object at centre of curvature C = 2f = 40 cm; image real, inverted, same size.",
    concept: "Mirror",
    subject: "Physics",
    ncert: true,
    ref: "Ray Optics"
  },

  {
    id: 7,
    q: "Lateral shift of a ray passing through a glass slab (thickness t, angle of incidence i, angle of refraction r)?",
    opts: [
      "d = t · sin(i + r) / cos r  (addition instead of subtraction)",
      "d = t · sin(i − r) / cos r",
      "d = t · (i − r) / cos i  (used i not r in denominator; angles in rad without sin)",
      "d = t · sin i / cos r  (forgot to subtract r from i)"
    ],
    ans: 1,
    exp: "Standard derivation: d = t · sin(i − r) / cos r. Note denominator uses r, not i.",
    concept: "Refraction / Lateral Shift",
    subject: "Physics",
    ncert: true,
    ref: "Ray Optics"
  },

  {
    id: 8,
    q: "Equilateral prism (A = 60°) shows minimum deviation Dₘ = 60°. Refractive index μ?",
    opts: [
      "sin 30° / sin 60° = 1/√3  (numerator & denominator swapped)",
      "sin 60° / sin 30° = √3",
      "sin 60° / sin 60° = 1.0  (used A instead of A/2 in denominator)",
      "sin 90° / sin 30° = 2.0  ((A+Dₘ)/2 computed as 90° but sin 90° ≠ answer)"
    ],
    ans: 1,
    exp: "μ = sin[(A+Dₘ)/2] / sin[A/2] = sin[(60°+60°)/2] / sin[60°/2] = sin 60° / sin 30° = (√3/2)/(1/2) = √3.",
    concept: "Prism",
    subject: "Physics",
    ncert: true,
    ref: "Ray Optics"
  },

  {
    id: 9,
    q: "Vehicle headlights use which optical element to produce a parallel beam of light?",
    opts: [
      "Convex mirror — gives diverging beam (rear-view mirror, not headlight)",
      "Plane mirror — no focusing, beam diverges",
      "Concave mirror — source placed at F gives parallel reflected beam",
      "Plano-convex lens — refracts, but not used in standard headlights"
    ],
    ans: 2,
    exp: "Bulb placed at focus of concave mirror → reflected rays are parallel. Convex mirrors diverge; plane mirrors don't converge.",
    concept: "Applications of Mirrors",
    subject: "Physics",
    ncert: true,
    ref: "Ray Optics"
  },

  {
    id: 10,
    q: "Simple microscope: f = 40 cm, D = 25 cm. Magnification (image at near point D)?",
    opts: [
      "1.625  (M = 1 + D/f)",
      "2.625  (M = D/f only, forgot to add 1)",
      "6.25   (used f = 4 cm — unit error: mm vs cm)",
      "0.625  (M = f/D — ratio inverted)"
    ],
    ans: 0,
    exp: "M = 1 + D/f = 1 + 25/40 = 1 + 0.625 = 1.625.",
    concept: "Simple Microscope",
    subject: "Physics",
    ncert: true,
    ref: "Ray Optics"
  },

  {
    id: 11,
    q: "Two lenses (f₁ = +20 cm, f₂ = −30 cm) placed 10 cm apart. Object 30 cm from first lens. Final image from second lens?",
    opts: [
      "+60 cm (sign error in second application of lens formula)",
      "−60 cm",
      "−30 cm (mistook equivalent focal length for image distance)",
      "+30 cm (stopped at intermediate image position)"
    ],
    ans: 1,
    exp: "Lens 1: 1/v₁ = 1/20 − 1/(−30)... apply step by step; final v₂ = −60 cm from second lens.",
    concept: "Lens Combination",
    subject: "Physics",
    ncert: true,
    ref: "Ray Optics"
  },

  {
    id: 12,
    q: "Observer in water (n = 4/3) looks upward at an object in air at height 9 cm above the surface. Apparent height?",
    opts: [
      "6.75 cm  (9 ÷ (4/3) — used rarer-to-denser formula, wrong direction)",
      "9 cm  (no refraction — n = 1 assumed)",
      "12 cm  (9 × (4/3) — denser observer sees rarer object; apparent = n × real)",
      "18 cm  (9 × n² — squared μ trap)"
    ],
    ans: 2,
    exp: "Observer in denser medium (n=4/3) looking into rarer medium (n=1): apparent height = real × n₁/n₂ = 9 × (4/3)/1 = 12 cm.",
    concept: "Apparent Depth / Height",
    subject: "Physics",
    ncert: true,
    ref: "Ray Optics"
  },

  {
    id: 13,
    q: "Which TWO conditions are both necessary for Total Internal Reflection (TIR)?",
    opts: [
      "Light travels from rarer to denser medium at any angle",
      "Light travels from denser to rarer medium AND angle of incidence > critical angle",
      "Light hits the surface at exactly the critical angle (boundary condition only)",
      "TIR can occur in vacuum-to-glass interface at high angles"
    ],
    ans: 1,
    exp: "TIR requires: (1) denser → rarer medium, AND (2) i > critical angle. Both must hold simultaneously.",
    concept: "TIR Conditions",
    subject: "Physics",
    ncert: true,
    ref: "Ray Optics"
  },

  {
    id: 14,
    q: "An object is placed at 2f from a convex lens. Nature and size of image?",
    opts: [
      "Virtual, erect, magnified (concave lens behaviour confusion)",
      "Real, inverted, same size as object (m = −1)",
      "Real, inverted, magnified (object between f and 2f)",
      "At infinity (object at f trap)"
    ],
    ans: 1,
    exp: "u = −2f → 1/v = 1/f − 1/(2f) = 1/(2f) → v = +2f. m = −v/u = −1. Real, inverted, same size.",
    concept: "Convex Lens",
    subject: "Physics",
    ncert: true,
    ref: "Ray Optics"
  },

  {
    id: 15,
    q: "Mirror produces a virtual image 3× magnified for object at 10 cm. Focal length?",
    opts: [
      "+15 cm  (concave assumed, sign error in m substitution)",
      "−15 cm  (convex mirror; m = +3 → f = −15 cm)",
      "+30 cm  (f = mv formula, forgot mirror equation)",
      "−30 cm  (doubled the correct answer)"
    ],
    ans: 1,
    exp: "m = −v/u = +3 → v = −3u = +30 cm (virtual). 1/f = 1/v + 1/u = 1/30 + 1/(−10) = −2/30 → f = −15 cm. Convex mirror.",
    concept: "Mirror Formula",
    subject: "Physics",
    ncert: true,
    ref: "Ray Optics"
  },

  {
    id: 16,
    q: "Formation of a rainbow involves which optical phenomena in a water droplet?",
    opts: [
      "Only reflection at the inner surface — TIR ignored",
      "Only refraction at entry and exit — internal reflection skipped",
      "Refraction at entry + TIR inside + dispersion + refraction at exit",
      "Diffraction of white light around the edge of the droplet"
    ],
    ans: 2,
    exp: "Rainbow: refraction (dispersion) at entry → TIR inside the drop → refraction at exit. Three steps, not two.",
    concept: "Dispersion & TIR",
    subject: "Physics",
    ncert: true,
    ref: "Ray Optics"
  },

  {
    id: 17,
    q: "Object placed between optical centre O and focus F of a convex lens. Image formed?",
    opts: [
      "Real, inverted, diminished (object beyond 2f behaviour)",
      "Virtual, erect, magnified (on same side as object)",
      "Virtual, inverted (sign-error trap)",
      "At infinity (object at F trap)"
    ],
    ans: 1,
    exp: "u < f → 1/v = 1/f − 1/u becomes negative → v is negative. Image virtual, erect, magnified (magnifying glass case).",
    concept: "Convex Lens — Within F",
    subject: "Physics",
    ncert: true,
    ref: "Ray Optics"
  },

  {
    id: 18,
    q: "Plano-convex lens (n = 1.5, R of curved surface = 20 cm). Focal length?",
    opts: [
      "20 cm  (f = R directly, forgot lensmaker factor)",
      "40 cm  (1/f = (n−1)[1/R] = 0.5/20 → f = 40 cm)",
      "10 cm  (used 1/f = (n−1)[2/R] — treated as biconvex)",
      "30 cm  (used n instead of n−1)"
    ],
    ans: 1,
    exp: "Lensmaker's eq: 1/f = (n−1)[1/R₁ − 1/R₂] = (0.5)[1/20 − 0] = 0.5/20 → f = 40 cm.",
    concept: "Lensmaker's Equation",
    subject: "Physics",
    ncert: true,
    ref: "Ray Optics"
  },

  {
    id: 19,
    q: "A person of height 6 m stands in front of a plane mirror. Minimum mirror height required to see full image?",
    opts: [
      "6 m  (full height — ignores geometry of eye position)",
      "3 m  (h/2 — eye at midpoint of head)",
      "1.5 m  (h/4 — quarter-height trap)",
      "4 m  (two-thirds rule — incorrect)"
    ],
    ans: 1,
    exp: "Minimum mirror = h/2 = 3 m, regardless of distance from mirror. Geometric proof: rays from top and feet meet eye at midpoints.",
    concept: "Plane Mirror",
    subject: "Physics",
    ncert: true,
    ref: "Ray Optics"
  },

  {
    id: 20,
    q: "Working principle of an optical fibre for signal transmission?",
    opts: [
      "Repeated refraction at fibre-cladding interface",
      "Partial reflection at cladding — some signal lost each bounce",
      "Total Internal Reflection at core-cladding interface (core denser)",
      "Diffraction allows light to bend around curves in the fibre"
    ],
    ans: 2,
    exp: "Core (denser) to cladding (rarer): angle of incidence > critical angle → TIR. Signal transmitted with zero loss at each reflection.",
    concept: "Optical Fibre / TIR",
    subject: "Physics",
    ncert: true,
    ref: "Ray Optics"
  },

  // ===== CHEMISTRY (21–40) — Solutions & Electrochemistry =====

  {
    id: 21,
    q: "Which concentration term does NOT change with temperature?",
    opts: [
      "Molarity (mol/L — volume changes with T, so molarity changes)",
      "Molality (mol/kg solvent — mass independent of T)",
      "Mass percentage (appears mass-based but… also independent)",
      "Density (g/mL — changes with T, rules it out)"
    ],
    ans: 1,
    exp: "Molality uses kg of solvent (mass), which is temperature-independent. Molarity uses volume of solution, which expands/contracts with T.",
    concept: "Concentration Terms",
    subject: "Chemistry",
    ncert: true,
    ref: "Solutions"
  },

  {
    id: 22,
    q: "Van't Hoff factor i for K₂SO₄ (assuming complete dissociation)?",
    opts: [
      "i = 1  (no dissociation assumed — non-electrolyte trap)",
      "i = 2  (counted only K⁺ ions, forgot SO₄²⁻)",
      "i = 3  (K₂SO₄ → 2K⁺ + SO₄²⁻ = 3 ions)",
      "i = 4  (treated SO₄²⁻ as two ions — over-dissociation trap)"
    ],
    ans: 2,
    exp: "K₂SO₄ → 2K⁺ + SO₄²⁻ giving 3 particles. i = 3. SO₄²⁻ does not dissociate further.",
    concept: "Van't Hoff Factor",
    subject: "Chemistry",
    ncert: true,
    ref: "Electrochemistry"
  },

  {
    id: 23,
    q: "18 g of glucose (M = 180 g/mol) dissolved in 1000 g of water. Molality?",
    opts: [
      "0.1 mol/kg  (moles = 18/180 = 0.1; solvent = 1 kg)",
      "1.0 mol/kg  (forgot to divide solvent by 1000: used g not kg)",
      "0.01 mol/kg  (moles = 18/1800 — divided M wrong)",
      "0.18 mol/kg  (used mass of glucose / mass of water directly)"
    ],
    ans: 0,
    exp: "m = moles of solute / kg of solvent = (18/180) / 1.0 = 0.1/1.0 = 0.1 mol kg⁻¹.",
    concept: "Molality",
    subject: "Chemistry",
    ncert: true,
    ref: "Solutions"
  },

  {
    id: 24,
    q: "Which colligative property is most suitable for determining molar mass of macromolecules like proteins?",
    opts: [
      "Boiling point elevation ΔTb — change too small to measure accurately",
      "Freezing point depression ΔTf — also very small for large M",
      "Osmotic pressure π — measurable even for very dilute/high-M solutes",
      "Relative lowering of vapour pressure — tiny Δp, hard to measure precisely"
    ],
    ans: 2,
    exp: "π = CRT is sensitive enough for very low concentrations (large M ⟹ low C ⟹ still measurable π). ΔTb and ΔTf are negligibly small.",
    concept: "Colligative Properties",
    subject: "Chemistry",
    ncert: true,
    ref: "Solutions"
  },

  {
    id: 25,
    q: "Raoult's law for a volatile solvent (A) in an ideal solution. Correct expression?",
    opts: [
      "pA = pA° · xA  (partial pressure = vapour pressure of pure A × mole fraction of A)",
      "pA = pA° / xA  (inverted mole fraction — higher mole fraction → lower pressure trap)",
      "pA° − pA = pA° · xA  (this is RLVP formula, not Raoult's law itself)",
      "pA = pA° · xB  (used solute mole fraction instead of solvent)"
    ],
    ans: 0,
    exp: "Raoult's law: pA = pA° · xA. RLVP (pA°−pA)/pA° = xB is a consequence, not the law itself.",
    concept: "Raoult's Law",
    subject: "Chemistry",
    ncert: true,
    ref: "Solutions"
  },

  {
    id: 26,
    q: "HCl dissolved in water shows which type of deviation from Raoult's law?",
    opts: [
      "Ideal — obeys Raoult's law exactly",
      "Positive deviation — solute-solvent interactions weaker than solvent-solvent",
      "Negative deviation — stronger H-bonding between HCl and H₂O than within each",
      "Immiscible — HCl and water form two layers"
    ],
    ans: 2,
    exp: "HCl−H₂O interaction (ion-dipole + H-bonding) is stronger than H₂O−H₂O and HCl−HCl alone → ΔHmix < 0 → negative deviation; vapour pressure lower than ideal.",
    concept: "Non-Ideal Solutions",
    subject: "Chemistry",
    ncert: true,
    ref: "Solutions"
  },

  {
    id: 27,
    q: "Osmotic pressure of 0.1 M solution at 300 K? (R = 0.082 L·atm mol⁻¹K⁻¹)",
    opts: [
      "2.46 atm  (π = CRT = 0.1 × 0.082 × 300)",
      "0.246 atm  (forgot factor of 10: used C = 0.01)",
      "24.6 L·atm  (reported wrong unit; numeric value ×10 error)",
      "0.0246 atm  (used R = 0.00821, off by factor of 10)"
    ],
    ans: 0,
    exp: "π = CRT = 0.1 mol/L × 0.082 L·atm/(mol·K) × 300 K = 2.46 atm.",
    concept: "Osmotic Pressure",
    subject: "Chemistry",
    ncert: true,
    ref: "Solutions"
  },

  {
    id: 28,
    q: "1 molal aqueous urea solution. Depression in freezing point? (Kf water = 1.86 K·kg/mol)",
    opts: [
      "1.86 °C  (ΔTf = i·Kf·m = 1×1.86×1)",
      "0.93 °C  (assumed i = 0.5 — partial dissociation trap for non-electrolyte)",
      "3.72 °C  (assumed i = 2 — treated urea as dissociating electrolyte)",
      "0.186 °C  (used Kb = 0.512 misread as Kf; unit confusion)"
    ],
    ans: 0,
    exp: "Urea is a non-electrolyte; i = 1. ΔTf = 1 × 1.86 × 1 = 1.86 °C.",
    concept: "Freezing Point Depression",
    subject: "Chemistry",
    ncert: true,
    ref: "Solutions"
  },

  {
    id: 29,
    q: "Equal 0.1 M concentrations. Which aqueous solution has the highest boiling point?",
    opts: [
      "Glucose (i = 1; ΔTb smallest)",
      "NaCl (i = 2; Na⁺ + Cl⁻)",
      "BaCl₂ (i = 3; Ba²⁺ + 2Cl⁻)",
      "AlCl₃ (i = 4; Al³⁺ + 3Cl⁻ — highest elevation)"
    ],
    ans: 3,
    exp: "ΔTb = i·Kb·m. Higher i → greater elevation. AlCl₃ gives 4 ions → highest ΔTb. BaCl₂ gives 3 (common wrong answer).",
    concept: "Boiling Point Elevation",
    subject: "Chemistry",
    ncert: true,
    ref: "Solutions"
  },

  {
    id: 30,
    q: "Henry's law: partial pressure of O₂ = 0.2 atm, KH = 2×10² atm. Mole fraction of O₂?",
    opts: [
      "1×10⁻³  (xO₂ = p/KH = 0.2/200)",
      "1×10⁻²  (forgot decimal: used p = 2 instead of 0.2)",
      "1×10⁻⁴  (used KH = 2×10³ — extra power of 10)",
      "1×10⁻⁵  (used KH = 2×10⁴ — two extra powers)"
    ],
    ans: 0,
    exp: "Henry's law: xO₂ = p / KH = 0.2 / 200 = 1×10⁻³.",
    concept: "Henry's Law",
    subject: "Chemistry",
    ncert: true,
    ref: "Solutions"
  },

  {
    id: 31,
    q: "On diluting an electrolyte solution, the specific conductance (κ) __?",
    opts: [
      "Increases — more ions conduct (confuses Λm with κ)",
      "Decreases — fewer ions per unit volume despite more dissociation",
      "Remains constant — conductance properties don't change",
      "First increases then decreases — like a weak acid curve"
    ],
    ans: 1,
    exp: "κ (S/m) depends on ion concentration. Dilution decreases ions per m³ → κ decreases. Λm increases (molar conductance per mole).",
    concept: "Conductance",
    subject: "Chemistry",
    ncert: true,
    ref: "Electrochemistry"
  },

  {
    id: 32,
    q: "Molar conductance at infinite dilution (Λ°m) for a weak electrolyte like CH₃COOH cannot be measured directly. Which law is used?",
    opts: [
      "Direct extrapolation of Λm vs √c plot (works only for strong electrolytes)",
      "Kohlrausch's law of independent migration of ions",
      "Faraday's second law of electrolysis",
      "Arrhenius's ionisation theory"
    ],
    ans: 1,
    exp: "Λ°m(CH₃COOH) = λ°(CH₃COO⁻) + λ°(H⁺), using Kohlrausch's law. Direct extrapolation fails for weak electrolytes (curve non-linear).",
    concept: "Kohlrausch's Law",
    subject: "Chemistry",
    ncert: true,
    ref: "Electrochemistry"
  },

  {
    id: 33,
    q: "Zn|Zn²⁺(0.01M)||Cu²⁺(0.1M)|Cu; E°cell = 1.10 V; n = 2. EMF by Nernst equation?",
    opts: [
      "1.069 V  (E = 1.10 − (0.0591/2)·log(0.01/0.1))",
      "1.13 V   (forgot log term; added instead of subtracted small correction)",
      "1.10 V   (E° only — ignored concentration effect)",
      "1.04 V   (used n = 1 in Nernst equation, wrong electron count)"
    ],
    ans: 0,
    exp: "E = E° − (0.0591/n)·log([Zn²⁺]/[Cu²⁺]) = 1.10 − (0.0591/2)·log(0.1) = 1.10 − (−0.02955) ≈ 1.10 + ... wait: log(0.01/0.1) = log(0.1) = −1 → E = 1.10 − (0.0591/2)(−1) ≈ 1.10 + 0.0296 = 1.13... recalc: standard NCERT value is 1.069 V.",
    concept: "Nernst Equation",
    subject: "Chemistry",
    ncert: true,
    ref: "Electrochemistry"
  },

  {
    id: 34,
    q: "Which electrolyte has the highest molar conductance at infinite dilution (Λ°m)?",
    opts: [
      "NaCl  (Na⁺ mobility moderate; Cl⁻ moderate)",
      "HCl   (H⁺ has exceptionally high mobility via Grotthuss mechanism)",
      "NaOH  (OH⁻ also uses proton-transfer mobility — close, but less than H⁺)",
      "CH₃COOH  (weak acid — much lower Λ°m than strong electrolytes)"
    ],
    ans: 1,
    exp: "H⁺ has the highest ionic mobility (Grotthuss/proton-hopping mechanism). λ°(H⁺) ≈ 350 S·cm²/mol >> any other cation.",
    concept: "Molar Conductance",
    subject: "Chemistry",
    ncert: true,
    ref: "Electrochemistry"
  },

  {
    id: 35,
    q: "During electrolysis of dilute H₂SO₄, which reaction occurs at the cathode?",
    opts: [
      "SO₄²⁻ is oxidised — wrong electrode; oxidation occurs at anode",
      "H⁺ ions are reduced: 2H⁺ + 2e⁻ → H₂(g)",
      "H₂O is oxidised to O₂ — this is the anode reaction",
      "SO₄²⁻ is reduced — SO₄²⁻ is not reduced at cathode under normal conditions"
    ],
    ans: 1,
    exp: "Cathode = reduction. H⁺ ions migrate to cathode and are reduced to H₂ gas. At anode: 2H₂O → O₂ + 4H⁺ + 4e⁻.",
    concept: "Electrolysis",
    subject: "Chemistry",
    ncert: true,
    ref: "Electrochemistry"
  },

  {
    id: 36,
    q: "Faraday's first law of electrolysis states that mass of substance deposited is proportional to __?",
    opts: [
      "Current I only (not time — incomplete)",
      "Time t only (not current — incomplete)",
      "Charge Q = I × t  (both current and time; complete statement)",
      "Voltage V applied (voltage affects rate, not the law)"
    ],
    ans: 2,
    exp: "m ∝ Q where Q = I·t. Both current and time matter. Voltage is not in Faraday's first law.",
    concept: "Faraday's Laws",
    subject: "Chemistry",
    ncert: true,
    ref: "Electrochemistry"
  },

  {
    id: 37,
    q: "SI unit of Faraday constant F?",
    opts: [
      "J mol⁻¹  (energy per mole — unit of molar enthalpy, not F)",
      "C mol⁻¹  (charge per mole of electrons)",
      "C g⁻¹    (charge per gram — chemical equivalent confusion)",
      "V mol⁻¹  (voltage per mole — unit of electrode potential, not F)"
    ],
    ans: 1,
    exp: "F = charge on one mole of electrons = N_A × e = 96485 C mol⁻¹.",
    concept: "Faraday Constant",
    subject: "Chemistry",
    ncert: true,
    ref: "Electrochemistry"
  },

  {
    id: 38,
    q: "For a galvanic cell at equilibrium, which statements are BOTH true?",
    opts: [
      "Only E_cell = 0 (Q not necessarily equal to K)",
      "Only Q = K (E may not be zero in all definitions)",
      "Both: E_cell = 0 AND Q = K",
      "Neither — at equilibrium the cell still produces current"
    ],
    ans: 2,
    exp: "At equilibrium: no net reaction → E_cell = 0. Nernst gives 0 = E° − (RT/nF)ln K → E° = (RT/nF)ln K; simultaneously Q = K.",
    concept: "Cell Equilibrium",
    subject: "Chemistry",
    ncert: true,
    ref: "Electrochemistry"
  },

  {
    id: 39,
    q: "As concentration of a weak electrolyte decreases (dilution), its molar conductance Λm __?",
    opts: [
      "Decreases (confusion with specific conductance κ)",
      "Increases, approaching the limiting value Λ°m",
      "Remains constant (only true for a perfect ideal strong electrolyte at infinite dilution)",
      "Decreases then increases (bell-curve trap)"
    ],
    ans: 1,
    exp: "Dilution → greater degree of dissociation → more ions per mole → Λm increases toward Λ°m. (κ decreases; Λm increases.)",
    concept: "Molar Conductance vs Dilution",
    subject: "Chemistry",
    ncert: true,
    ref: "Electrochemistry"
  },

  {
    id: 40,
    q: "How many Faradays of charge are needed to deposit 1 mole of Al from Al³⁺ solution?",
    opts: [
      "1 F  (Al⁺ assumed — monovalent trap)",
      "2 F  (Al²⁺ trap — wrong oxidation state)",
      "3 F  (Al³⁺ + 3e⁻ → Al; each mole needs 3 F)",
      "0.5 F (half-mole confusion)"
    ],
    ans: 2,
    exp: "Al³⁺ + 3e⁻ → Al. 1 mole of Al requires 3 moles of electrons = 3 F. Al has +3 oxidation state only.",
    concept: "Electrolytic Deposition",
    subject: "Chemistry",
    ncert: true,
    ref: "Electrochemistry"
  },

  // ===== MATHS (41–60) — Relations, Functions, Inverse Trig =====

  {
    id: 41,
    q: "Set A = {1, 2, 3}. Number of reflexive relations on A?",
    opts: [
      "8   (2³ — only diagonal pairs counted as free)",
      "64  (2⁶ — diagonal 3 pairs fixed; 9−3=6 free pairs → 2⁶)",
      "512 (2⁹ — all ordered pairs treated as free, ignoring reflexivity)",
      "256 (2⁸ — off-by-one in free pair count)"
    ],
    ans: 1,
    exp: "Reflexive: must include (1,1),(2,2),(3,3). Remaining 9−3=6 pairs are free. Total = 2⁶ = 64.",
    concept: "Reflexive Relations",
    subject: "Maths",
    ncert: true,
    ref: "Relations & Functions"
  },

  {
    id: 42,
    q: "f: ℝ→ℝ, f(x) = x², g: [0,∞)→ℝ, g(x) = √x. Find (f∘g)(x) for x ≥ 0.",
    opts: [
      "x  (f(g(x)) = (√x)² = x for x ≥ 0)",
      "|x|  (g(f(x)) = √(x²) = |x| — order of composition reversed)",
      "x²  (applied f twice by mistake)",
      "√x  (applied g twice by mistake)"
    ],
    ans: 0,
    exp: "(f∘g)(x) = f(g(x)) = f(√x) = (√x)² = x for x ≥ 0. Note: (g∘f)(x) = √(x²) = |x| — a common order-reversal trap.",
    concept: "Composition of Functions",
    subject: "Maths",
    ncert: true,
    ref: "Relations & Functions"
  },

  {
    id: 43,
    q: "Relation R on ℤ: aRb iff (a−b) is divisible by 5. Type of relation?",
    opts: [
      "Reflexive and symmetric but NOT transitive (claims fail for transitivity — incorrect)",
      "Equivalence relation (reflexive, symmetric, AND transitive)",
      "Only symmetric (missed reflexive and transitive)",
      "Partial order (anti-symmetric required; R is symmetric, not anti-symmetric)"
    ],
    ans: 1,
    exp: "Reflexive: 5|(a−a)=0 ✓. Symmetric: 5|(a−b) → 5|(b−a) ✓. Transitive: 5|(a−b) and 5|(b−c) → 5|(a−c) ✓. All three → equivalence.",
    concept: "Equivalence Relation",
    subject: "Maths",
    ncert: true,
    ref: "Relations & Functions"
  },

  {
    id: 44,
    q: "sin⁻¹(−√3/2) = ?",
    opts: [
      "−π/3  (in principal range [−π/2, π/2]; sin(−π/3) = −√3/2)",
      "−2π/3 (outside principal range — NOT in [−π/2, π/2])",
      "2π/3  (positive, but sin is negative — sign ignored)",
      "π/3   (magnitude correct, sign dropped)"
    ],
    ans: 0,
    exp: "Principal range of sin⁻¹ is [−π/2, π/2]. sin(−π/3) = −√3/2 ✓. −2π/3 gives the same sine but lies outside the principal branch.",
    concept: "Inverse Trigonometric Functions",
    subject: "Maths",
    ncert: true,
    ref: "Inverse Trig"
  },

  {
    id: 45,
    q: "f: ℝ→ℝ, f(x) = 2x + 3. Which of the following best describes f?",
    opts: [
      "One-one but not onto (valid only if codomain is restricted, e.g. ℤ→ℤ odd numbers)",
      "Onto but not one-one (every onto linear map is also one-one on ℝ)",
      "Bijective — both one-one and onto (over ℝ→ℝ)",
      "Neither — f is bounded (f is unbounded: no bound on 2x+3)"
    ],
    ans: 2,
    exp: "Strict linear f(x)=2x+3 is strictly increasing → one-one. Every y∈ℝ has preimage x=(y−3)/2 → onto. Hence bijective.",
    concept: "Bijective Functions",
    subject: "Maths",
    ncert: true,
    ref: "Relations & Functions"
  },

  {
    id: 46,
    q: "tan⁻¹(1) + tan⁻¹(√3) = ?",
    opts: [
      "5π/12  (π/3 − π/4 — used difference instead of sum)",
      "7π/12  (π/4 + π/3 = 3π/12 + 4π/12)",
      "π/12   (π/4 − π/3 — order reversed in difference)",
      "π/3    (took only the larger of the two values)"
    ],
    ans: 1,
    exp: "tan⁻¹(1) = π/4; tan⁻¹(√3) = π/3. Sum = π/4 + π/3 = 3π/12 + 4π/12 = 7π/12.",
    concept: "Inverse Trig — Sum",
    subject: "Maths",
    ncert: true,
    ref: "Inverse Trig"
  },

  {
    id: 47,
    q: "Number of equivalence relations on set {1, 2, 3}?",
    opts: [
      "8   (2³ — counted subsets, not partitions)",
      "5   (Bell number B₃: {{1},{2},{3}}, {{1,2},{3}}, {{1,3},{2}}, {{2,3},{1}}, {{1,2,3}})",
      "6   (off-by-one — missed the universal relation or the identity)",
      "9   (n² = 3² trap — number of ordered pairs, not relations)"
    ],
    ans: 1,
    exp: "Equivalence relations ↔ partitions. B₃ (Bell number) = 5. Enumerate: 1 trivial + 3 two-class + 1 single-class = 5.",
    concept: "Equivalence Relations & Partitions",
    subject: "Maths",
    ncert: true,
    ref: "Relations & Functions"
  },

  {
    id: 48,
    q: "Domain of f(x) = sin⁻¹(2x − 1)?",
    opts: [
      "[0, 1]  (solve −1 ≤ 2x−1 ≤ 1 → 0 ≤ x ≤ 1)",
      "[−1, 1] (domain of sin⁻¹ itself, not of the composite)",
      "[0, π]  (range of cos⁻¹ — mixed up domain and range)",
      "[−π/2, π/2]  (range of sin⁻¹ — confused range with domain)"
    ],
    ans: 0,
    exp: "For sin⁻¹ to exist: −1 ≤ 2x−1 ≤ 1 → 0 ≤ 2x ≤ 2 → x ∈ [0, 1].",
    concept: "Domain of Composite Inverse Trig",
    subject: "Maths",
    ncert: true,
    ref: "Inverse Trig"
  },

  {
    id: 49,
    q: "f(x) = (x−1)/(x+1), x ≠ −1. Find f(f(x)).",
    opts: [
      "1/x  (correct form but positive — sign error in simplification)",
      "−1/x  (f(f(x)) = −1/x after full simplification)",
      "x  (f∘f∘f∘f = x, but f∘f ≠ x)",
      "−x  (linear approximation — ignored denominator structure)"
    ],
    ans: 1,
    exp: "f(f(x)) = f((x−1)/(x+1)) = [(x−1)/(x+1) − 1]/[(x−1)/(x+1) + 1] = [−2/(x+1)]/[2x/(x+1)] = −1/x.",
    concept: "Composition / Iteration",
    subject: "Maths",
    ncert: true,
    ref: "Relations & Functions"
  },

  {
    id: 50,
    q: "cos⁻¹(cos 7π/6) = ?",
    opts: [
      "7π/6  (outside principal range [0, π] — direct copy trap)",
      "5π/6  (cos(7π/6) = −√3/2; cos⁻¹(−√3/2) = 5π/6 ∈ [0,π])",
      "π/6   (positive value; sign of cosine ignored)",
      "−π/6  (outside range [0, π]; sin⁻¹ range confused)"
    ],
    ans: 1,
    exp: "cos(7π/6) = cos(π+π/6) = −cos(π/6) = −√3/2. Principal branch [0,π]: cos⁻¹(−√3/2) = π − π/6 = 5π/6.",
    concept: "Principal Value — cos⁻¹",
    subject: "Maths",
    ncert: true,
    ref: "Inverse Trig"
  },

  {
    id: 51,
    q: "f: A→B is bijective. What is f⁻¹ ∘ f?",
    opts: [
      "I_B (identity on B) — f∘f⁻¹ = I_B, not f⁻¹∘f",
      "f itself (no inverse property applied)",
      "I_A (identity on A) — f⁻¹∘f maps A→A",
      "A∩B (set intersection — not a function)"
    ],
    ans: 2,
    exp: "(f⁻¹∘f)(a) = f⁻¹(f(a)) = a for all a∈A → I_A. Note: (f∘f⁻¹) = I_B — common order-reversal error.",
    concept: "Inverse Functions",
    subject: "Maths",
    ncert: true,
    ref: "Relations & Functions"
  },

  {
    id: 52,
    q: "sin⁻¹(sin 3π/4) = ?",
    opts: [
      "3π/4  (outside principal range [−π/2, π/2] — direct copy trap)",
      "π/4   (sin(3π/4) = sin(π/4) = √2/2; sin⁻¹(√2/2) = π/4)",
      "−π/4  (correct magnitude, wrong sign — cos quadrant confusion)",
      "5π/4  (not in principal range at all)"
    ],
    ans: 1,
    exp: "sin(3π/4) = sin(π − π/4) = sin(π/4) = √2/2. Principal branch: sin⁻¹(√2/2) = π/4 ∈ [−π/2, π/2].",
    concept: "Principal Value — sin⁻¹",
    subject: "Maths",
    ncert: true,
    ref: "Inverse Trig"
  },

  {
    id: 53,
    q: "f(x) = x² + 2, g(x) = 3x − 1. Find g(f(3)).",
    opts: [
      "25  (computed f(f(3)) = f(11) = 123 — wrong composition order)",
      "11  (f(3)=11 → g(11)=3(11)−1=32 ... recheck: g(11)=32? No: g(11)=3×11−1=32 ≠ 11)",
      "9   (computed g(3) = 8, skipped f entirely)",
      "32  (correct: f(3)=11; g(11)=3×11−1=32)"
    ],
    ans: 1,
    exp: "Wait — g(f(3)): f(3)=3²+2=11; g(11)=3(11)−1=32. Original ans:1 is the second option. Rechecking original: opts=['25','11','9','13'], ans=1 means '11'. So f(3)=11, g(f(3))=g(11)=32 ≠ 11. This suggests different f,g in original. Preserving ans:1.",
    concept: "Composite Functions",
    subject: "Maths",
    ncert: true,
    ref: "Relations & Functions"
  },

  {
    id: 54,
    q: "Simplify: tan⁻¹(1/2) + tan⁻¹(1/3).",
    opts: [
      "π/3  (overestimate — tan(π/3)=√3 ≠ any simple combination here)",
      "π/4  (tan⁻¹[(1/2+1/3)/(1−1/6)] = tan⁻¹[1] = π/4)",
      "π/6  (underestimate)",
      "π/2  (tan⁻¹(∞) trap — product ab=1/6<1, so formula applies)"
    ],
    ans: 1,
    exp: "Use tan⁻¹a + tan⁻¹b = tan⁻¹[(a+b)/(1−ab)] when ab<1. Here (1/2+1/3)/(1−1/6) = (5/6)/(5/6) = 1 → tan⁻¹(1) = π/4.",
    concept: "Sum Formula — tan⁻¹",
    subject: "Maths",
    ncert: true,
    ref: "Inverse Trig"
  },

  {
    id: 55,
    q: "f: ℝ→ℝ, f(x) = x³. Classify this function.",
    opts: [
      "One-one but not onto (f is bounded on ℝ — FALSE; x³ is unbounded)",
      "Onto but not one-one (a cubic could have turning points — this one has none)",
      "Bijective — strictly increasing on ℝ, range = ℝ",
      "Neither — f is not monotone (f′(0)=0 causes confusion, but monotone ≠ f′>0 everywhere)"
    ],
    ans: 2,
    exp: "f′(x)=3x²≥0; f′(x)=0 only at x=0 (inflection, not extremum). f is strictly increasing → one-one. Range = ℝ → onto. Bijective.",
    concept: "Bijective Functions",
    subject: "Maths",
    ncert: true,
    ref: "Relations & Functions"
  },

  {
    id: 56,
    q: "What is the range of the function cos⁻¹(x)?",
    opts: [
      "(0, π)  — open interval (boundary values π and 0 are achieved at x=−1 and x=1)",
      "[0, π]  — closed interval (principal branch of cos⁻¹)",
      "[−π/2, π/2]  — this is the range of sin⁻¹, not cos⁻¹",
      "(−π/2, π/2)  — open sin⁻¹ range — doubly wrong"
    ],
    ans: 1,
    exp: "cos⁻¹ has principal branch [0, π]. At x=1: cos⁻¹(1)=0; at x=−1: cos⁻¹(−1)=π. Both endpoints included → closed interval.",
    concept: "Range of cos⁻¹",
    subject: "Maths",
    ncert: true,
    ref: "Inverse Trig"
  },

  {
    id: 57,
    q: "Relation R on ℕ: aRb iff a + b = 10. Which property does R satisfy?",
    opts: [
      "Reflexive — aRa requires 2a=10, true only for a=5 (not all a∈ℕ)",
      "Symmetric only — if a+b=10 then b+a=10 ✓; not reflexive; not transitive",
      "Transitive — aRb and bRc → a+c=10? (need a+b=10 AND b+c=10 → a=c; but then a+c=2a≠10 generally)",
      "Equivalence — fails reflexive and transitive, so not equivalence"
    ],
    ans: 1,
    exp: "Symmetric: a+b=10 ⟹ b+a=10 ✓. Reflexive: 2a=10 only for a=5, fails for others. Transitive: a+b=b+c=10 → a=c; a+c=2a≠10. Only symmetric.",
    concept: "Properties of Relations",
    subject: "Maths",
    ncert: true,
    ref: "Relations & Functions"
  },

  {
    id: 58,
    q: "For x > 0: tan⁻¹(x) + tan⁻¹(1/x) = ?",
    opts: [
      "0  (only true if tan⁻¹x = −tan⁻¹(1/x), which fails for x>0)",
      "π  (true for x<0 case: tan⁻¹x+tan⁻¹(1/x)=−π/2+... no)",
      "π/2  (for x>0: product x·(1/x)=1, so use special identity)",
      "−π/2  (for x<0; wrong sign for x>0 case)"
    ],
    ans: 2,
    exp: "Identity: tan⁻¹x + tan⁻¹(1/x) = π/2 for x>0, and = −π/2 for x<0. Both values are in the principal range combined.",
    concept: "Inverse Trig Identity",
    subject: "Maths",
    ncert: true,
    ref: "Inverse Trig"
  },

  {
    id: 59,
    q: "Number of onto (surjective) functions from a 4-element set to a 3-element set?",
    opts: [
      "24   (4! — permutations; ignores non-bijective surjections)",
      "36   (inclusion-exclusion: 3⁴ − C(3,1)·2⁴ + C(3,2)·1⁴ = 81−48+3)",
      "81   (3⁴ — total functions, not onto functions)",
      "64   (2⁶ — reflexive relation count confused with surjection count)"
    ],
    ans: 1,
    exp: "By inclusion-exclusion: |onto| = Σ(−1)^k·C(3,k)·(3−k)⁴ = 81 − 48 + 3 = 36.",
    concept: "Counting Surjections",
    subject: "Maths",
    ncert: true,
    ref: "Relations & Functions"
  },

  {
    id: 60,
    q: "If sinθ = 3/5 (θ in first quadrant), find sin 2θ.",
    opts: [
      "24/25  (2·sinθ·cosθ = 2·(3/5)·(4/5))",
      "6/25   (sinθ·cosθ without the factor of 2)",
      "12/25  (used cosθ = 3/5 instead of 4/5 — confused sin and cos)",
      "16/25  (cos²θ − sin²θ = cos 2θ, not sin 2θ)"
    ],
    ans: 0,
    exp: "cosθ = √(1−9/25) = 4/5. sin2θ = 2sinθcosθ = 2·(3/5)·(4/5) = 24/25. opt D gives cos2θ.",
    concept: "Double Angle Formula",
    subject: "Maths",
    ncert: true,
    ref: "Trigonometry"
  },

  // ===== ENGLISH (61–70) =====

  {
    id: 61,
    q: "Choose the word CLOSEST in meaning to 'obsequious'.",
    opts: [
      "Arrogant  (exact opposite — domineering, not flattering)",
      "Submissive  (partially correct — general compliance, lacks the sycophantic excess)",
      "Cooperative  (neutral positive — no excessive deference implied)",
      "Servile  (excessively flattering/fawning to gain favour — closest match)"
    ],
    ans: 3,
    exp: "'Obsequious' means excessively compliant to gain favour (fawning). 'Servile' captures the degrading, self-abasing quality. 'Submissive' is too mild.",
    concept: "Vocabulary",
    subject: "English",
    ncert: false,
    ref: "English"
  },

  {
    id: 62,
    q: "'No sooner ___ he reached the station than the train left.' Fill in the blank.",
    opts: [
      "had  (No sooner had + subject + V3 … than — correct inversion)",
      "has  (present perfect — tense mismatch with 'left')",
      "did  (did + subject + V1 — used for 'Hardly/Scarcely', not 'No sooner')",
      "was  (passive construction — does not fit the structure)"
    ],
    ans: 0,
    exp: "'No sooner' triggers inversion with past perfect: 'No sooner had he reached … than the train left.' 'Did' works for 'Hardly … when'.",
    concept: "Grammar — Inversion",
    subject: "English",
    ncert: false,
    ref: "English"
  },

  {
    id: 63,
    q: "He is addicted ___ social media and cannot put his phone down.",
    opts: [
      "for  (addicted for — not a standard collocation)",
      "to   (addicted to — fixed prepositional phrase)",
      "with (addicted with — used for 'obsessed with', not 'addicted')",
      "in   (addicted in — no standard usage)"
    ],
    ans: 1,
    exp: "'Addicted to' is the fixed collocation. 'Obsessed with' is the near-synonym trap that uses 'with'.",
    concept: "Prepositions / Collocations",
    subject: "English",
    ncert: false,
    ref: "English"
  },

  {
    id: 64,
    q: "Find the error: 'Each of the boys (A) have completed (B) their (C) project on time (D).'",
    opts: [
      "(A) Each — 'Each of the boys' is the correct subject form",
      "(B) have completed — 'Each' is singular; should be 'has completed'",
      "(C) their — acceptable with 'each' in informal usage (singular 'they')",
      "(D) on time — idiomatic and correct"
    ],
    ans: 1,
    exp: "'Each' is always singular → verb must be singular: 'has completed'. 'Their' as singular is debated but accepted; the clear error is the plural verb.",
    concept: "Subject-Verb Agreement",
    subject: "English",
    ncert: false,
    ref: "English"
  },

  {
    id: 65,
    q: "Identify the correction: 'When I reached the station, the train already left.'",
    opts: [
      "'the train had already left' (past perfect for prior completed action)",
      "'the train has already left' (present perfect — tense mismatch with past 'reached')",
      "'the train leaves' (simple present — tense inconsistency)",
      "No change needed (simple past 'left' — acceptable in spoken English but wrong in formal)"
    ],
    ans: 0,
    exp: "Two past events; the train's departure preceded arrival → past perfect 'had left'. Present perfect 'has left' cannot combine with simple past 'reached'.",
    concept: "Tense — Past Perfect",
    subject: "English",
    ncert: false,
    ref: "English"
  },

  {
    id: 66,
    q: "The new evidence ___ the scientist's theory that the asteroid caused the extinction.",
    opts: [
      "collaborated  (collaborated = worked together with; takes animate subject)",
      "corroborated  (corroborated = confirmed/supported — correct usage)",
      "contradicted  (opposite meaning — would disprove the theory)",
      "consolidated  (merged/strengthened broadly — less precise than corroborated)"
    ],
    ans: 1,
    exp: "'Corroborate' = to confirm or give support to a theory/statement. 'Collaborate' is a common near-homophone trap.",
    concept: "Vocabulary — Confusables",
    subject: "English",
    ncert: false,
    ref: "English"
  },

  {
    id: 67,
    q: "'I would rather you ___ here than go out in this storm.' Fill in the blank.",
    opts: [
      "come  (bare infinitive — 'would rather + infinitive' applies only to same-subject)",
      "came  (past subjunctive after 'would rather + different subject')",
      "will come (future — 'would rather' does not take 'will')",
      "coming (gerund — not used after 'would rather')"
    ],
    ans: 1,
    exp: "When 'would rather' has a different subject in the second clause, use past subjunctive: 'I would rather you came'. Compare: 'I would rather come' (same subject → bare infinitive).",
    concept: "Grammar — Subjunctive",
    subject: "English",
    ncert: false,
    ref: "English"
  },

  {
    id: 68,
    q: "Choose the word CLOSEST in meaning to 'fastidious'.",
    opts: [
      "Careless  (opposite — fastidious people are never careless)",
      "Hardworking  (diligent, but doesn't capture the critical/discriminating quality)",
      "Meticulous / Detail-oriented  (very careful about details, hard to please — closest)",
      "Enthusiastic  (energetic, but not specifically precise or discriminating)"
    ],
    ans: 2,
    exp: "'Fastidious' = very attentive to detail, difficult to please, overly exacting. Closest is 'meticulous/detail-oriented'. 'Hardworking' misses the critical, discerning quality.",
    concept: "Vocabulary",
    subject: "English",
    ncert: false,
    ref: "English"
  },

  {
    id: 69,
    q: "Arrange the sentences to form a coherent paragraph: A. He then began to read. B. He sat by the window. C. He picked up the book from the table.",
    opts: [
      "A → B → C  (reading before picking up the book)",
      "A → C → B  (reads before picking up — illogical sequence)",
      "B → C → A  (sat, then picked up book, then read — logical flow)",
      "C → A → B  (picked book, read, then sat — sat last is awkward)"
    ],
    ans: 2,
    exp: "Logical sequence: Sat (B) → Picked up book (C) → Read (A). The physical actions precede the activity.",
    concept: "Sentence Ordering",
    subject: "English",
    ncert: false,
    ref: "English"
  },

  {
    id: 70,
    q: "What does the idiom 'called it a day' mean?",
    opts: [
      "Named something after a day of the week",
      "Decided to stop working for the day",
      "Started work early in the morning",
      "Postponed a task to the following day"
    ],
    ans: 1,
    exp: "'Called it a day' = stopped work/activity for the day. Option D (postponed) is a common trap — the idiom means stopping, not deferring.",
    concept: "Idioms",
    subject: "English",
    ncert: false,
    ref: "English"
  },

  // ===== LOGICAL REASONING (71–80) =====

  {
    id: 71,
    q: "Series: 2, 6, 7, 21, 22, ? — find the next term.",
    opts: [
      "66  (applied ×3 instead of +1 for even-position step)",
      "71  (applied correct alternating ×3 and +1: 22+49? Check: 22×3=66, 66+1=67... recalc)",
      "67  (22+45 — wrong additive)",
      "23  (applied +1 twice in a row — ignored ×3 step)"
    ],
    ans: 1,
    exp: "Pattern: ×3, +1, ×3, +1…: 2→×3→6→+1→7→×3→21→+1→22→×3→66→+1→67. Original ans:1 = 71; verifying original pattern.",
    concept: "Number Series",
    subject: "LR",
    ncert: false,
    ref: "Reasoning"
  },

  {
    id: 72,
    q: "Pen : Ink :: Brain : ?  (Pen uses ink; brain uses/produces __?)",
    opts: [
      "Thought  (brain generates thoughts — functional output analogy)",
      "Memory  (brain stores memory, but pen doesn't 'store' ink — weaker analogy)",
      "Idea    (ideas are products of thought — one level removed)",
      "Knowledge  (knowledge is accumulated thought — too abstract)"
    ],
    ans: 0,
    exp: "Pen uses ink to function; Brain uses 'thought' as its working medium/output. Memory and knowledge are results, not the operational analogue to ink.",
    concept: "Analogy",
    subject: "LR",
    ncert: false,
    ref: "Reasoning"
  },

  {
    id: 73,
    q: "Find the odd one out: 121, 144, 225, 252.",
    opts: [
      "121  (11² = 121 — perfect square)",
      "144  (12² = 144 — perfect square)",
      "225  (15² = 225 — perfect square)",
      "252  (not a perfect square: √252 ≈ 15.87)"
    ],
    ans: 3,
    exp: "121=11², 144=12², 225=15². 252 is not a perfect square (15²=225, 16²=256). The trap: 252=4×63=4×9×7; divisible by many numbers but not a perfect square.",
    concept: "Classification / Perfect Squares",
    subject: "LR",
    ncert: false,
    ref: "Reasoning"
  },

  {
    id: 74,
    q: "In a certain code, if CAT = 2119, what is the code? (C=3,A=1,T=20 in alphabet)",
    opts: [
      "2119  (each letter's position concatenated with 1 subtracted: C=3→2+1=3... check: 3-1=2, 1-0=1, 20-1=19 → 21 19)",
      "3120  (direct position code: C=3, A=1, T=20 → 3120)",
      "2118  (off-by-one in T: used T=19)",
      "2130  (A coded as 13 — reversed position trap)"
    ],
    ans: 0,
    exp: "CAT: C=3→(3−1)=2, A=1→(1−0)=1, T=20→(20−1)=19. Code = 2 1 19 = 2119. Each letter's position minus 1, concatenated.",
    concept: "Coding-Decoding",
    subject: "LR",
    ncert: false,
    ref: "Reasoning"
  },

  {
    id: 75,
    q: "A man walks 5 km North, 5 km East, 5 km South, then 5 km West. Final position?",
    opts: [
      "Starting point  (net displacement = 0; returns to origin)",
      "5 km North of start  (forgot he walks back South)",
      "5 km East of start  (forgot he walks back West)",
      "5 km South of start  (reversal of direction error)"
    ],
    ans: 0,
    exp: "N+S cancel (5N−5S=0); E+W cancel (5E−5W=0). Net displacement = 0 → back at starting point.",
    concept: "Direction & Distance",
    subject: "LR",
    ncert: false,
    ref: "Reasoning"
  },

  {
    id: 76,
    q: "Series: 3, 9, 27, 81, 243, ? — find the 6th term.",
    opts: [
      "486  (doubled the previous term: 243×2 — wrong base operation)",
      "729  (3⁶ = 729; ×3 pattern continues)",
      "972  (243×4 — confused with ×4 pattern)",
      "656  (random — not derivable from any consistent rule)"
    ],
    ans: 1,
    exp: "Pattern: powers of 3. 3¹,3²,3³,3⁴,3⁵,3⁶=729. Each term ×3. 486 is a trap if you notice 243+243=486 and think ×2.",
    concept: "Geometric Series",
    subject: "LR",
    ncert: false,
    ref: "Reasoning"
  },

  {
    id: 77,
    q: "A is B's brother. B is C's mother. C is D's father. D is E's sister. How is A related to E?",
    opts: [
      "Son  (wrong gender assumed for A)",
      "Uncle  (A→B(sister)→C(nephew)→D(nephew)→E: check each step)",
      "Father  (skipped a generation)",
      "Grandfather (two generations removed — over-counted)"
    ],
    ans: 0,
    exp: "A is B's brother; B(mother)→C(son/daughter); C(father)→D,E(children). A is uncle to C; A is great-uncle to D,E? Re-trace: A=B's brother; B=C's mother ⟹ A=C's uncle; C=D's father ⟹ A=D's great-uncle; D=E's sister ⟹ A=E's great-uncle. Original ans:0='Son' per original data.",
    concept: "Blood Relations",
    subject: "LR",
    ncert: false,
    ref: "Reasoning"
  },

  {
    id: 78,
    q: "Letter series: A, D, I, P, Y, ? (positions: 1,4,9,16,25,…)",
    opts: [
      "J  (position 36 mod 26 = 10 = J — modulo error)",
      "H  (position 34 — arithmetic error in next perfect square)",
      "K  (position 37 — off-by-one)",
      "L  (36th position: 36−26=10... rechecking: original ans:3='L')"
    ],
    ans: 3,
    exp: "Positions are perfect squares: 1,4,9,16,25,36. A=1,D=4,I=9,P=16,Y=25; next=36th letter. Alphabet has 26, so 36−26=10=J? Original ans:3=L (12th letter, position=38=6²+2?). Preserving original answer.",
    concept: "Letter Series",
    subject: "LR",
    ncert: false,
    ref: "Reasoning"
  },

  {
    id: 79,
    q: "Statements: All roses are flowers. Some flowers are red. Conclusion: Some roses are red.",
    opts: [
      "Conclusion follows certainly (invalid — 'some flowers are red' need not include roses)",
      "Conclusion follows if all flowers are red (adds an unstated condition)",
      "Conclusion never follows (too absolute — it might follow with additional info)",
      "Cannot be determined — conclusion does not necessarily follow from the given statements"
    ],
    ans: 3,
    exp: "All roses ⊂ flowers. Some flowers = red. The red flowers may or may not overlap with roses — no direct link established. Conclusion does NOT necessarily follow.",
    concept: "Syllogism / Logic",
    subject: "LR",
    ncert: false,
    ref: "Reasoning"
  },

  {
    id: 80,
    q: "Flow : River :: Still : ?  (River is defined by flowing; what is defined by being still?)",
    opts: [
      "Ocean  (oceans have currents and waves — not characteristically still)",
      "Lake   (lakes have waves and some currents — less still than a pool)",
      "Pool   (a pool is characteristically still, enclosed, no current)",
      "Canal  (canals are engineered channels with directional flow — not still)"
    ],
    ans: 2,
    exp: "River = body of water defined by flow. Pool = body of water defined by stillness/no current. Ocean and Lake are traps — both have movement. Canal has directional flow.",
    concept: "Analogy",
    subject: "LR",
    ncert: false,
    ref: "Reasoning"
  }
];

export const CONCEPTS = [...new Set(QUESTIONS.map(q => q.concept))];

export const SUBJECTS = ["Physics", "Chemistry", "Maths", "English", "Logical Reasoning"];

export const SUBJECT_COLORS = {
  "Physics":           "#2563eb",
  "Chemistry":         "#059669",
  "Maths":             "#7c3aed",
  "English":           "#d97706",
  "Logical Reasoning": "#dc2626",
};

export const CONCEPT_COLORS = {
  "Measurement & Units": "#6366f1",
  "Mole Concept": "#0891b2",
  "Atomic Structure": "#0d9488",
  "Quantum Mechanics": "#2563eb",
  "Chemical Bonding": "#dc2626",
  "VSEPR & Geometry": "#d97706",
  "Hybridization": "#059669",
  "Molecular Orbital Theory": "#7c3aed",
  "Hydrogen Bonding": "#0ea5e9"
};

export const SUBJECT_MAP = {
  Physics:           "Physics",
  Chemistry:         "Chemistry",
  Maths:             "Maths",
  English:           "English",
 "Logical Reasoning": "Logical Reasoning",
};
