# Absolute UI — Visual Diagrams

All diagrams are written in **Mermaid** so they render natively on GitHub, in the docs site (MDX), in Obsidian, and in most markdown viewers. No external tools required.

---

## 1. System architecture (layers)

```mermaid
graph TB
    subgraph "Consumer app"
        APP[React Native App]
    end

    subgraph "Absolute UI"
        PERS[Personalities<br/>Aurora · Obsidian · Frost · Sunset]
        PRIM[Primitives<br/>GlassSurface · Button · Card · Sheet · NavBar · ...]
        A11Y[A11y layer<br/>APCA · DynamicType · ReducedMotion · FocusRing]
        PERF[Perf layer<br/>Worklets · FlashList · InteractionManager]
        TOK[Tokens<br/>Style Dictionary]
    end

    subgraph "Native / platform"
        IOS[iOS 26<br/>UIGlassEffect]
        AND[Android<br/>Blur + Specular fallback]
        REA[Reanimated 3]
        UNI[Unistyles 3]
    end

    APP --> PERS
    PERS --> PRIM
    PRIM --> A11Y
    PRIM --> PERF
    PRIM --> TOK
    A11Y --> UNI
    PERF --> REA
    PRIM --> IOS
    PRIM --> AND

    style PERS fill:#1e3a8a,stroke:#60a5fa,color:#fff
    style PRIM fill:#0f766e,stroke:#5eead4,color:#fff
    style A11Y fill:#7c2d12,stroke:#fb923c,color:#fff
    style PERF fill:#581c87,stroke:#c084fc,color:#fff
    style TOK fill:#164e63,stroke:#67e8f9,color:#fff
```

---

## 2. Agent & skill orchestration

```mermaid
graph LR
    DEV[Developer]

    subgraph "Planning skills"
        PLAN[Plan agent]
        EXP[Explore agent]
    end

    subgraph "Build skills"
        FD[frontend-design]
        VCP[vercel-composition-patterns]
        VRN[vercel-react-native-skills]
    end

    subgraph "Quality subagents"
        PA[perf-auditor]
        AA[a11y-auditor]
        PP[pixel-perfect]
        TA[test-automator]
    end

    subgraph "Review skills"
        CRD[review-delta]
        CRP[review-pr]
        SIM[simplify]
    end

    subgraph "Release skills"
        DV[deploy-to-vercel]
        SP[social-post-generator]
        AP[add-to-portfolio]
        AO[add-to-obsidian]
    end

    DEV --> PLAN --> EXP
    EXP --> FD
    FD --> VCP --> VRN
    VRN --> TA
    TA --> AA
    AA --> PP
    PP --> PA
    PA --> CRD --> CRP --> SIM
    SIM --> DV
    DV --> SP --> AP --> AO

    style PA fill:#581c87,stroke:#c084fc,color:#fff
    style AA fill:#7c2d12,stroke:#fb923c,color:#fff
    style PP fill:#164e63,stroke:#67e8f9,color:#fff
    style TA fill:#0f766e,stroke:#5eead4,color:#fff
```

---

## 3. New-component workflow (end-to-end)

```mermaid
flowchart TD
    START([New component idea]) --> ISSUE[Open issue<br/>+ Figma link]
    ISSUE --> PLAN[Run Plan + Explore]
    PLAN --> FIG[Figma MCP<br/>extract design + tokens]
    FIG --> CODE[Write component<br/>guided by skills]

    CODE --> HOOK{Save hook}
    HOOK -->|fails| FIX[Fix a11y / types]
    FIX --> CODE
    HOOK -->|passes| STORY[Storybook stories<br/>+ MDX docs]

    STORY --> TEST[test-automator<br/>scaffolds tests]
    TEST --> PUSH[Push branch]
    PUSH --> RD[review-delta auto]
    RD --> PR[Open PR]

    PR --> CI{CI gates}
    CI --> PERF[perf-auditor]
    CI --> PIX[pixel-perfect]
    CI --> A11[a11y-auditor]
    CI --> RP[review-pr]

    PERF --> GATE{All green?}
    PIX --> GATE
    A11 --> GATE
    RP --> GATE

    GATE -->|no| FIX2[Fix issues]
    FIX2 --> CODE
    GATE -->|yes| SIMP[simplify pass]
    SIMP --> MERGE([Merge to main])

    style HOOK fill:#7c2d12,stroke:#fb923c,color:#fff
    style CI fill:#581c87,stroke:#c084fc,color:#fff
    style GATE fill:#581c87,stroke:#c084fc,color:#fff
    style MERGE fill:#065f46,stroke:#6ee7b7,color:#fff
```

---

## 4. Test pyramid (5 layers)

```mermaid
graph TB
    L5[Layer 5 — E2E<br/>Maestro · ~10min · nightly]
    L4[Layer 4 — Perf regression<br/>Reassure + Flashlight · ~3min]
    L3[Layer 3 — Visual regression<br/>Chromatic / Playwright · ~2min]
    L2[Layer 2 — Unit / integration<br/>Jest + RNTL · ~60s]
    L1[Layer 1 — Static<br/>Biome + tsc + jsx-a11y · ~5s]

    L1 --> L2 --> L3 --> L4 --> L5

    style L1 fill:#064e3b,stroke:#6ee7b7,color:#fff
    style L2 fill:#065f46,stroke:#6ee7b7,color:#fff
    style L3 fill:#0f766e,stroke:#5eead4,color:#fff
    style L4 fill:#155e75,stroke:#67e8f9,color:#fff
    style L5 fill:#1e40af,stroke:#93c5fd,color:#fff
```

---

## 5. CI pipeline

```mermaid
flowchart LR
    PUSH[git push / PR] --> STATIC[Static<br/>biome · tsc · a11y-lint]
    STATIC --> UNIT[Unit + integration<br/>jest]
    UNIT --> VIS[Visual regression<br/>chromatic]
    VIS --> PERF[Perf regression<br/>reassure]
    PERF --> FLASH[Flashlight<br/>on-device FPS/CPU/mem]
    FLASH --> BUNDLE[Bundle-size diff]
    BUNDLE --> ADV[review-delta<br/>advisory]
    ADV --> E2E[Maestro E2E<br/>nightly + pre-release]
    E2E --> MERGE{Merge gate}

    MERGE -->|green| MAIN([main])
    MERGE -->|red| BLOCK([Blocked])

    style STATIC fill:#064e3b,stroke:#6ee7b7,color:#fff
    style UNIT fill:#065f46,stroke:#6ee7b7,color:#fff
    style VIS fill:#0f766e,stroke:#5eead4,color:#fff
    style PERF fill:#155e75,stroke:#67e8f9,color:#fff
    style FLASH fill:#155e75,stroke:#67e8f9,color:#fff
    style E2E fill:#1e40af,stroke:#93c5fd,color:#fff
    style MAIN fill:#065f46,stroke:#6ee7b7,color:#fff
    style BLOCK fill:#7f1d1d,stroke:#fca5a5,color:#fff
```

---

## 6. Release flow

```mermaid
sequenceDiagram
    actor Dev
    participant Main as main branch
    participant CI
    participant NPM as npm registry
    participant Vercel as Vercel docs
    participant Social as X / LinkedIn
    participant Obsidian as Obsidian vault

    Dev->>Main: Merge feature PRs
    Dev->>CI: Trigger nightly full suite
    CI-->>Dev: Green on iOS + Android
    Dev->>Main: changeset version + commit
    Dev->>CI: Release workflow
    CI->>CI: build · test · pack
    CI->>NPM: publish with provenance
    CI->>Vercel: deploy docs site
    Dev->>Social: social-post-generator drafts
    Dev->>Obsidian: add-to-obsidian ship note
    Dev->>Dev: add-to-portfolio
    Note over Dev,Obsidian: Monitor 48h<br/>Roll forward on regressions
```

---

## 7. Phased roadmap (Gantt)

```mermaid
gantt
    title Absolute UI — Phased delivery
    dateFormat YYYY-MM-DD
    axisFormat %b %d

    section Phase 0 — Foundation
    Scaffold + tokens + themes       :p0a, 2026-04-15, 10d
    Subagents + hooks + CI           :p0b, after p0a, 7d
    Code-review graph + Storybook    :p0c, after p0b, 5d

    section Phase 1 — Core primitives
    GlassSurface + Button            :p1a, after p0c, 7d
    GlassCard + Sheet                :p1b, after p1a, 7d
    A11y + perf baselines            :p1c, after p1b, 4d

    section Phase 2 — Navigation
    NavBar + TabBar                  :p2a, after p1c, 7d
    Modal + Toast                    :p2b, after p2a, 7d

    section Phase 3 — Inputs
    Input + Picker                   :p3a, after p2b, 7d
    Switch + Slider                  :p3b, after p3a, 7d

    section Phase 4 — Launch
    Polish 4 personalities           :p4a, after p3b, 7d
    Docs site + benchmarks           :p4b, after p4a, 5d
    npm publish + announce           :p4c, after p4b, 3d
```

---

## 8. Competitive landscape (2×2)

```mermaid
quadrantChart
    title Design system positioning
    x-axis Generic aesthetic --> Distinctive aesthetic
    y-axis Web-first --> Mobile-first
    quadrant-1 Mobile + Distinctive
    quadrant-2 Web + Distinctive
    quadrant-3 Web + Generic
    quadrant-4 Mobile + Generic
    Base UI: [0.15, 0.2]
    Radix: [0.2, 0.15]
    shadcn/ui: [0.35, 0.2]
    HeroUI: [0.65, 0.25]
    Mantine: [0.4, 0.2]
    React Native Paper: [0.3, 0.8]
    gluestack-ui: [0.45, 0.78]
    Tamagui: [0.5, 0.75]
    NativeBase: [0.35, 0.72]
    Expo UI: [0.6, 0.9]
    Absolute UI: [0.9, 0.92]
```

---

## 9. A11y contract per primitive

```mermaid
mindmap
  root((A11y contract))
    Perception
      APCA contrast Lc ≥ 60
      Dynamic Type scaling
      Reduced Transparency fallback
      No color-only state
    Operation
      44×44pt hit target
      Keyboard / switch control
      Focus ring visible
      Reduced Motion fallback
    Understanding
      Role + accessible label
      State announcements
      Error messaging
    Robustness
      VoiceOver script passes
      TalkBack script passes
      Zoom 200% layout
      RTL support
```

---

## 10. Performance budget

```mermaid
graph LR
    subgraph "Budgets enforced in CI"
        B1[Scroll FPS<br/>≥ 120]
        B2[Frame time p95<br/>< 16ms]
        B3[Primitive size<br/>< 50KB gz]
        B4[Cold start<br/>< 1.5s]
        B5[Reassure delta<br/>±5%]
        B6[Flashlight drop<br/>≤ 3 pts]
    end

    B1 --> GATE{Merge gate}
    B2 --> GATE
    B3 --> GATE
    B4 --> GATE
    B5 --> GATE
    B6 --> GATE

    GATE -->|all pass| OK([✓ Merge])
    GATE -->|any fail| NO([✗ Block])

    style GATE fill:#581c87,stroke:#c084fc,color:#fff
    style OK fill:#065f46,stroke:#6ee7b7,color:#fff
    style NO fill:#7f1d1d,stroke:#fca5a5,color:#fff
```

---

## Rendering notes

- **GitHub / GitLab / Obsidian:** render natively, no config.
- **VS Code:** install the "Markdown Preview Mermaid Support" extension.
- **Docs site (Next.js):** use `@mermaid-js/mermaid` via MDX.
- **Export to PNG/SVG:** `npx @mermaid-js/mermaid-cli -i DIAGRAMS.md -o diagrams/` (run once before release).
