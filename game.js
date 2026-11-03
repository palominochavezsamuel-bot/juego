"use strict";

const canvas = document.querySelector("#game");
const context = canvas.getContext("2d");
const message = document.querySelector("#game-message");
const messageKicker = document.querySelector("#message-kicker");
const messageTitle = document.querySelector("#message-title");
const messageCopy = document.querySelector("#message-copy");
const actionButton = document.querySelector("#action-button");
const secondaryAction = document.querySelector("#secondary-action");
const touchButtons = document.querySelectorAll(".touch-button");
const touchControls = document.querySelector(".touch-controls");
const levelMenu = document.querySelector("#level-menu");
const levelCards = document.querySelectorAll(".level-card");
const startLevelButton = document.querySelector("#start-level-button");
const infiniteModeButton = document.querySelector("#infinite-mode-button");
const walletBalance = document.querySelector("#wallet-balance");
const shopStatus = document.querySelector("#shop-status");
const upgradeCards = document.querySelectorAll(".upgrade-card");
const cosmeticCards = document.querySelectorAll(".cosmetic-card");
const achievementCards = document.querySelectorAll(".achievement-card");
const progressStatus = document.querySelector("#progress-status");
const bestScoreLabel = document.querySelector("#best-score");
const audioButton = document.querySelector("#audio-button");
const vibrationButton = document.querySelector("#vibration-button");
const pauseButton = document.querySelector("#pause-button");
const instructionsButton = document.querySelector("#instructions-button");
const helpDialog = document.querySelector("#help-dialog");
const closeHelpButton = document.querySelector("#close-help");
const reducedEffectsButton = document.querySelector("#reduced-effects-button");
const controlsSettingsButton = document.querySelector("#controls-settings-button");
const controlsDialog = document.querySelector("#controls-dialog");
const closeControlsButton = document.querySelector("#close-controls");
const bindingStatus = document.querySelector("#binding-status");
const bindingButtons = document.querySelectorAll("[data-bind-action]");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const HORIZON_Y = 188;
const GROUND_Y = 432;
const LANE_CENTERS = [300, 480, 660];
const JUMP_DURATION = 0.9;
const JUMP_HEIGHT = 125;
const RAGE_FIRST_DELAY = 18;
const RAGE_INTERVAL = 28;
const RAGE_DURATION = 5.5;
const RAGE_SHOT_COUNT = 4;
const INFINITE_WORLD_DURATION = 35;
const WORLD_MECHANIC_WARNING = 2.4;
const WORLD_MECHANIC_DURATION = 4;
const WORLD_MECHANIC_INTERVAL = 25;
const BOSSES = {
  3: { name: "TITÁN ÍGNEO", color: "#ff6742" },
  6: { name: "NÚCLEO GUARDIÁN", color: "#ffbd58" },
  9: { name: "DEVORADOR ESTELAR", color: "#f18bff" },
};
const ECONOMY_KEY = "neon-run-economy";
const ACHIEVEMENT_VERSION = 2;
const REDUCED_EFFECTS_KEY = "neon-run-reduced-effects";
const CONTROL_BINDINGS_KEY = "neon-run-control-bindings";
const DEFAULT_CONTROLS = {
  ArrowLeft: "left", KeyA: "left",
  ArrowRight: "right", KeyD: "right",
  ArrowUp: "jump", Space: "jump", KeyW: "jump",
  ArrowDown: "slide", KeyS: "slide",
};
const WORLD_MECHANICS = [
  { title: "TRÁFICO ACELERADO", warning: "¡SE ACELERA EL TRÁFICO!", style: "city" },
  { title: "GRAVEDAD INVERTIDA", warning: "¡CAMBIARÁ LA GRAVEDAD!", style: "void" },
  { title: "LLUVIA DE METEOROS", warning: "¡LLUVIA DE METEOROS!", style: "solar" },
  { title: "CORRIENTE MARINA", warning: "¡LA CORRIENTE ACERCA MONEDAS!", style: "aquatic" },
  { title: "RAÍCES CRISTALINAS", warning: "¡CUIDADO CON LAS RAÍCES!", style: "forest" },
  { title: "CINTA MECÁNICA", warning: "¡LA CINTA SE ACELERA!", style: "machine" },
  { title: "HIELO RESBALADIZO", warning: "¡EL SUELO SE CONGELA!", style: "ice" },
  { title: "VIENTO DEL DESIERTO", warning: "¡EL VIENTO ATRAE MONEDAS!", style: "desert" },
  { title: "ESPEJO CÓSMICO", warning: "¡CONTROLES EN ESPEJO!", style: "cosmic" },
];
const UPGRADES = [
  { key: "startShield", cost: 80, name: "Escudo inicial", description: "Empieza cada carrera con 8 s de escudo." },
  { key: "startMagnet", cost: 100, name: "Imán inicial", description: "Atrae monedas durante 8 s al empezar." },
  { key: "extraLife", cost: 150, name: "Vida extra", description: "Empieza todas las carreras con 4 vidas." },
];
const SKINS = [
  { key: "prism", cost: 60, name: "PRISMA", color: "#f18bff" },
  { key: "solar", cost: 90, name: "SOLAR", color: "#ffe66d" },
  { key: "specter", cost: 120, name: "ESPECTRO", color: "#c59bff" },
];
const ACHIEVEMENTS = [
  { key: "firstLevel", title: "DOMINADOR DE NIVELES", description: "Completa 9 niveles (puedes repetirlos).", metric: "levels", target: 9, reward: 50 },
  { key: "coinCollector", title: "TESORO NEÓN", description: "Recoge 250 monedas en total.", metric: "coins", target: 250, reward: 75 },
  { key: "longRunner", title: "MARATÓN NEÓN", description: "Corre 10.000 m en total.", metric: "distance", target: 10000, reward: 100 },
  { key: "bossBreaker", title: "CAZADOR DE JEFES", description: "Derrota 5 jefes (puedes repetirlos).", metric: "bosses", target: 5, reward: 150 },
  { key: "flawless", title: "INTACTO", description: "Completa 3 niveles sin recibir golpes.", metric: "flawless", target: 3, reward: 150 },
];
const DIMENSIONS = [
  { name: "CIUDAD NEÓN", style: "city", sky: ["#11132f", "#21183c", "#101326"], buildings: "#171a37", windows: "#54f6ec", road: "#0b1021", lane: "#ff4fc8", runner: "#54f6ec", pursuer: "#ff4fc8" },
  { name: "VACÍO VIOLETA", style: "void", sky: ["#100a29", "#302054", "#100d20"], buildings: "#241839", windows: "#c59bff", road: "#100d20", lane: "#a987ff", runner: "#d8c5ff", pursuer: "#a987ff" },
  { name: "TORMENTA SOLAR", style: "solar", sky: ["#401322", "#a83b22", "#261126"], buildings: "#3d1c3e", windows: "#ffb65c", road: "#1b1020", lane: "#ff9d59", runner: "#ffe66d", pursuer: "#ff4e35" },
  { name: "MUNDO ACUÁTICO", style: "aquatic", sky: ["#062438", "#087b91", "#102936"], buildings: "#123b49", windows: "#54f6ec", road: "#0b1c2a", lane: "#4df5e0", runner: "#55e8d2", pursuer: "#ff617d" },
  { name: "BOSQUE CRISTALINO", style: "forest", sky: ["#08291f", "#176044", "#10251c"], buildings: "#124331", windows: "#9aff78", road: "#0b2119", lane: "#d2ff74", runner: "#a8ff79", pursuer: "#ed6dff" },
  { name: "CIUDAD MECÁNICA", style: "machine", sky: ["#141c27", "#35444b", "#141a20"], buildings: "#26353d", windows: "#ffbd58", road: "#111a20", lane: "#4de1d2", runner: "#ffbd58", pursuer: "#ff684d" },
  { name: "REINO GLACIAR", style: "ice", sky: ["#122d52", "#397bab", "#12233e"], buildings: "#315879", windows: "#a9f5ff", road: "#10253d", lane: "#7ceaff", runner: "#aff7ff", pursuer: "#d77bff" },
  { name: "DESIERTO CARMESÍ", style: "desert", sky: ["#49233d", "#b65545", "#321a2e"], buildings: "#75413f", windows: "#ffc46b", road: "#291a25", lane: "#ff865f", runner: "#ffc46b", pursuer: "#65f0cd" },
  { name: "NÚCLEO CÓSMICO", style: "cosmic", sky: ["#090d2b", "#201c56", "#0c1027"], buildings: "#24204d", windows: "#90a5ff", road: "#0b1021", lane: "#f18bff", runner: "#90a5ff", pursuer: "#ff63b8" },
];
const LEVELS = [
  { name: "CIUDAD NEÓN", objective: { type: "coins", label: "REÚNE MONEDAS", unit: "monedas", target: 20 } },
  { name: "VACÍO VIOLETA", objective: { type: "dodges", label: "ESQUIVA PELIGROS", unit: "peligros", target: 15 } },
  { name: "TORMENTA SOLAR", objective: { type: "powerups", label: "RECOGE PODERES", unit: "poderes", target: 5 } },
  { name: "MUNDO ACUÁTICO", objective: { type: "distance", label: "RECORRE DISTANCIA", unit: "m", target: 600 } },
  { name: "BOSQUE CRISTALINO", objective: { type: "coins", label: "REÚNE MONEDAS", unit: "monedas", target: 35 } },
  { name: "CIUDAD MECÁNICA", objective: { type: "dodges", label: "ESQUIVA PELIGROS", unit: "peligros", target: 22 } },
  { name: "REINO GLACIAR", objective: { type: "powerups", label: "RECOGE PODERES", unit: "poderes", target: 10 } },
  { name: "DESIERTO CARMESÍ", objective: { type: "distance", label: "RECORRE DISTANCIA", unit: "m", target: 900 } },
  { name: "NÚCLEO CÓSMICO", objective: { type: "coins", label: "REÚNE MONEDAS", unit: "monedas", target: 60 } },
];

const game = {
  state: "menu",
  mode: "level",
  lastTime: 0,
  animationTime: 0,
  elapsed: 0,
  level: 1,
  selectedLevel: 1,
  levelObjectiveProgress: 0,
  levelCompletedThisFrame: false,
  score: 0,
  bonusPoints: 0,
  coins: 0,
  lives: 3,
  lane: 1,
  playerX: LANE_CENTERS[1],
  jumpTime: 0,
  jumpGraceTime: 0,
  slideTime: 0,
  shieldTime: 0,
  magnetTime: 0,
  turboTime: 0,
  invulnerability: 0,
  hitFlash: 0,
  feedbackText: "",
  feedbackColor: "#54f6ec",
  feedbackTime: 0,
  dimensionIndex: 0,
  previousDimensionIndex: 0,
  dimensionBlendTime: 0,
  mechanicState: "idle",
  mechanicTimer: 0,
  nextMechanicAt: 12,
  bossState: "inactive",
  bossHealth: 0,
  nextBossAttackIn: 0,
  hitsTaken: 0,
  achievementDistancePending: 0,
  rageTime: 0,
  rageShotIn: 0,
  rageShotsRemaining: 0,
  nextRageAt: RAGE_FIRST_DELAY,
  obstacleIn: 2.5,
  coinIn: 2.5,
  powerupIn: 6.5,
  shotIn: 4.5,
  obstacles: [],
  coinsOnRoad: [],
  powerups: [],
  shots: [],
  particles: [],
  musicTimer: 0,
  musicStep: 0,
};

let bestScore = loadBestScore();
let unlockedLevel = loadUnlockedLevel();
let economy = loadEconomy();
let audioContext = null;
let masterGain = null;
let soundEnabled = true;
let vibrationEnabled = true;
let reducedEffects = loadReducedEffects();
let customBindings = loadCustomBindings();
let bindingAction = null;
const vibrationSupported = typeof navigator.vibrate === "function";

function loadReducedEffects() {
  try {
    const stored = window.localStorage.getItem(REDUCED_EFFECTS_KEY);
    if (stored === null) return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (stored !== "true" && stored !== "false") throw new Error("La preferencia guardada no es válida.");
    return stored === "true";
  } catch (error) {
    bindingStatus.textContent = "NO SE PUDO LEER LA PREFERENCIA VISUAL";
    console.error("No se pudo leer la preferencia de efectos reducidos.", error);
    return false;
  }
}

function loadCustomBindings() {
  try {
    const stored = window.localStorage.getItem(CONTROL_BINDINGS_KEY);
    if (stored === null) return {};
    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Los controles personalizados no son válidos.");
    }
    const bindings = {};
    const usedCodes = new Set();
    for (const [action, code] of Object.entries(parsed)) {
      if (!["left", "right", "jump", "slide"].includes(action)
        || typeof code !== "string"
        || !/^(Arrow(Left|Right|Up|Down)|Space|Key[A-Z]|Digit[0-9])$/.test(code)
        || usedCodes.has(code)) {
        throw new Error("Una tecla personalizada no es válida.");
      }
      bindings[action] = code;
      usedCodes.add(code);
    }
    return bindings;
  } catch (error) {
    bindingStatus.textContent = "NO SE PUDIERON LEER LOS CONTROLES";
    console.error("No se pudieron leer los controles personalizados.", error);
    return {};
  }
}

function updateReducedEffectsButton() {
  reducedEffectsButton.textContent = `REDUCIR DESTELLOS: ${reducedEffects ? "SÍ" : "NO"}`;
  reducedEffectsButton.setAttribute("aria-pressed", String(reducedEffects));
  document.body.classList.toggle("reduce-motion", reducedEffects);
}

function updateBindingButtons() {
  for (const button of bindingButtons) {
    const action = button.dataset.bindAction;
    const code = customBindings[action];
    const label = code ? code.replace("Arrow", "") : "POR DEFECTO";
    button.textContent = `${button.dataset.label} · ${label}`;
  }
}

function saveCustomBindings() {
  try {
    window.localStorage.setItem(CONTROL_BINDINGS_KEY, JSON.stringify(customBindings));
    updateBindingButtons();
    return true;
  } catch (error) {
    bindingStatus.textContent = "NO SE PUDIERON GUARDAR LOS CONTROLES";
    console.error("No se pudieron guardar los controles personalizados.", error);
    return false;
  }
}

function loadBestScore() {
  try {
    const storedScore = window.localStorage.getItem("neon-run-best-score");
    if (storedScore === null) {
      bestScoreLabel.textContent = "RÉCORD: 0 PTS";
      return 0;
    }
    const score = Number(storedScore);
    if (!Number.isSafeInteger(score) || score < 0) throw new Error("El récord guardado no es válido.");
    bestScoreLabel.textContent = `RÉCORD: ${score} PTS`;
    return score;
  } catch (error) {
    bestScoreLabel.textContent = "RÉCORD NO DISPONIBLE";
    console.error("No se pudo leer el récord local de Neon Run.", error);
    return 0;
  }
}

function saveBestScore(score) {
  if (score <= bestScore) return;
  try {
    window.localStorage.setItem("neon-run-best-score", String(score));
    bestScore = score;
    bestScoreLabel.textContent = `RÉCORD: ${bestScore} PTS`;
  } catch (error) {
    bestScoreLabel.textContent = `RÉCORD ${score} PTS · NO GUARDADO`;
    console.error("No se pudo guardar el récord local de Neon Run.", error);
  }
}

function loadEconomy() {
  try {
    const storedEconomy = window.localStorage.getItem(ECONOMY_KEY);
    if (storedEconomy === null) {
      return {
        coins: 0,
        upgrades: {},
        ownedSkins: {},
        activeSkin: "default",
        achievements: { version: ACHIEVEMENT_VERSION, stats: {}, unlocked: {} },
      };
    }

    const parsed = JSON.parse(storedEconomy);
    if (!Number.isSafeInteger(parsed.coins) || parsed.coins < 0 || !parsed.upgrades || typeof parsed.upgrades !== "object") {
      throw new Error("Los datos guardados de monedas no son válidos.");
    }

    const upgrades = {};
    for (const upgrade of UPGRADES) {
      const purchased = parsed.upgrades[upgrade.key] ?? false;
      if (typeof purchased !== "boolean") throw new Error("Una mejora guardada no es válida.");
      upgrades[upgrade.key] = purchased;
    }
    if (parsed.ownedSkins !== undefined
      && (!parsed.ownedSkins || typeof parsed.ownedSkins !== "object" || Array.isArray(parsed.ownedSkins))) {
      throw new Error("Los aspectos guardados no son válidos.");
    }
    const ownedSkins = {};
    for (const skin of SKINS) {
      const owned = parsed.ownedSkins?.[skin.key] ?? false;
      if (typeof owned !== "boolean") throw new Error("Un aspecto guardado no es válido.");
      ownedSkins[skin.key] = owned;
    }
    const activeSkin = parsed.activeSkin ?? "default";
    if (activeSkin !== "default" && (!SKINS.some((skin) => skin.key === activeSkin) || !ownedSkins[activeSkin])) {
      throw new Error("El aspecto equipado no está disponible.");
    }
    const storedAchievements = parsed.achievements ?? { version: 1, stats: {}, unlocked: {} };
    if (!storedAchievements.stats || typeof storedAchievements.stats !== "object"
      || Array.isArray(storedAchievements.stats)
      || !storedAchievements.unlocked || typeof storedAchievements.unlocked !== "object"
      || Array.isArray(storedAchievements.unlocked)) {
      throw new Error("Los logros guardados no son válidos.");
    }
    const storedAchievementVersion = storedAchievements.version ?? 1;
    if (!Number.isInteger(storedAchievementVersion)
      || storedAchievementVersion < 1
      || storedAchievementVersion > ACHIEVEMENT_VERSION) {
      throw new Error("La versión de los logros guardados no es válida.");
    }
    const achievements = { version: ACHIEVEMENT_VERSION, stats: {}, unlocked: {} };
    for (const achievement of ACHIEVEMENTS) {
      const progress = storedAchievements.stats[achievement.metric] ?? 0;
      const storedUnlocked = storedAchievements.unlocked[achievement.key] ?? false;
      if (!Number.isFinite(progress) || progress < 0 || typeof storedUnlocked !== "boolean") {
        throw new Error("El progreso de un logro no es válido.");
      }
      achievements.stats[achievement.metric] = Math.max(
        achievements.stats[achievement.metric] ?? 0,
        progress,
      );
      achievements.unlocked[achievement.key] = storedAchievementVersion === ACHIEVEMENT_VERSION
        ? storedUnlocked
        : progress >= achievement.target;
    }
    return { coins: parsed.coins, upgrades, ownedSkins, activeSkin, achievements };
  } catch (error) {
    shopStatus.textContent = "NO SE PUDO LEER TU MONEDERO";
    console.error("No se pudo leer el monedero local de Neon Run.", error);
    return {
      coins: 0,
      upgrades: {},
      ownedSkins: {},
      activeSkin: "default",
      achievements: { version: ACHIEVEMENT_VERSION, stats: {}, unlocked: {} },
    };
  }
}

function updateEconomyUi() {
  walletBalance.textContent = `${economy.coins} MONEDAS`;
  for (const card of upgradeCards) {
    const upgrade = UPGRADES.find((item) => item.key === card.dataset.upgrade);
    if (!upgrade) continue;
    const button = card.querySelector(".upgrade-buy");
    const owned = economy.upgrades[upgrade.key] === true;
    button.disabled = owned || economy.coins < upgrade.cost;
    button.textContent = owned ? "COMPRADO" : `COMPRAR · ${upgrade.cost}`;
    card.classList.toggle("is-owned", owned);
  }
  for (const card of cosmeticCards) {
    const skin = SKINS.find((item) => item.key === card.dataset.skin);
    if (!skin) continue;
    const owned = economy.ownedSkins[skin.key] === true;
    const equipped = economy.activeSkin === skin.key;
    const button = card.querySelector(".cosmetic-select");
    button.disabled = !owned && economy.coins < skin.cost;
    button.textContent = equipped ? "EQUIPADO" : owned ? "EQUIPAR" : `COMPRAR · ${skin.cost}`;
    card.classList.toggle("is-owned", owned);
    card.classList.toggle("is-equipped", equipped);
  }
  for (const card of achievementCards) {
    const achievement = ACHIEVEMENTS.find((item) => item.key === card.dataset.achievement);
    if (!achievement) continue;
    const unlocked = economy.achievements.unlocked[achievement.key] === true;
    const progress = economy.achievements.stats[achievement.metric] ?? 0;
    card.classList.toggle("is-unlocked", unlocked);
    card.querySelector(".achievement-progress").textContent = unlocked
      ? `COMPLETADO · +${achievement.reward} MONEDAS`
      : `${Math.min(achievement.target, Math.floor(progress))}/${achievement.target}`;
  }
}

function saveEconomy(
  coins,
  upgrades,
  ownedSkins = economy.ownedSkins,
  activeSkin = economy.activeSkin,
  achievements = economy.achievements,
) {
  try {
    window.localStorage.setItem(ECONOMY_KEY, JSON.stringify({ coins, upgrades, ownedSkins, activeSkin, achievements }));
    economy = { coins, upgrades, ownedSkins, activeSkin, achievements };
    updateEconomyUi();
    return true;
  } catch (error) {
    shopStatus.textContent = "NO SE PUDO GUARDAR EL MONEDERO";
    console.error("No se pudo guardar el monedero local de Neon Run.", error);
    return false;
  }
}

function updateAchievementProgress(metric, amount = 1) {
  const stats = { ...economy.achievements.stats };
  stats[metric] = (stats[metric] ?? 0) + amount;
  const unlocked = { ...economy.achievements.unlocked };
  const newlyUnlocked = ACHIEVEMENTS.filter((achievement) =>
    achievement.metric === metric
    && !unlocked[achievement.key]
    && stats[metric] >= achievement.target,
  );
  const reward = newlyUnlocked.reduce((total, achievement) => total + achievement.reward, 0);
  for (const achievement of newlyUnlocked) unlocked[achievement.key] = true;
  const achievements = { version: ACHIEVEMENT_VERSION, stats, unlocked };
  const saved = saveEconomy(economy.coins + reward, economy.upgrades, economy.ownedSkins, economy.activeSkin, achievements);
  if (saved && newlyUnlocked.length > 0) {
    const names = newlyUnlocked.map((achievement) => achievement.title).join(", ");
    shopStatus.textContent = `¡LOGRO: ${names}! +${reward} MONEDAS.`;
    showFeedback(`¡LOGRO! +${reward} MONEDAS`, "#ffe66d");
  }
  return saved;
}

function collectWalletCoin() {
  const stats = { ...economy.achievements.stats, coins: (economy.achievements.stats.coins ?? 0) + 1 };
  const unlocked = { ...economy.achievements.unlocked };
  const newlyUnlocked = ACHIEVEMENTS.filter((achievement) =>
    achievement.metric === "coins"
    && !unlocked[achievement.key]
    && stats.coins >= achievement.target,
  );
  const reward = newlyUnlocked.reduce((total, achievement) => total + achievement.reward, 0);
  for (const achievement of newlyUnlocked) unlocked[achievement.key] = true;
  const achievements = { version: ACHIEVEMENT_VERSION, stats, unlocked };
  const saved = saveEconomy(
    economy.coins + 1 + reward,
    economy.upgrades,
    economy.ownedSkins,
    economy.activeSkin,
    achievements,
  );
  if (saved && newlyUnlocked.length > 0) {
    shopStatus.textContent = `¡LOGRO: ${newlyUnlocked[0].title}! +${reward} MONEDAS.`;
    showFeedback(`¡LOGRO! +${reward} MONEDAS`, "#ffe66d");
  }
  if (!saved) showFeedback("MONEDA NO GUARDADA", "#ff8d8d");
}

function buyUpgrade(key) {
  if (game.state !== "menu") return;
  const upgrade = UPGRADES.find((item) => item.key === key);
  if (!upgrade || economy.upgrades[key]) return;
  if (economy.coins < upgrade.cost) {
    shopStatus.textContent = `Te faltan ${upgrade.cost - economy.coins} monedas para ${upgrade.name}.`;
    return;
  }

  const upgrades = { ...economy.upgrades, [key]: true };
  if (!saveEconomy(economy.coins - upgrade.cost, upgrades)) return;
  shopStatus.textContent = `¡${upgrade.name} comprada! Se activa en tus próximas carreras.`;
}

function buyOrEquipSkin(key) {
  if (game.state !== "menu") return;
  const skin = SKINS.find((item) => item.key === key);
  if (!skin) return;
  if (economy.ownedSkins[skin.key]) {
    if (!saveEconomy(economy.coins, economy.upgrades, economy.ownedSkins, skin.key)) return;
    shopStatus.textContent = `Aspecto ${skin.name} equipado.`;
    return;
  }
  if (economy.coins < skin.cost) {
    shopStatus.textContent = `Te faltan ${skin.cost - economy.coins} monedas para ${skin.name}.`;
    return;
  }
  const ownedSkins = { ...economy.ownedSkins, [skin.key]: true };
  if (!saveEconomy(economy.coins - skin.cost, economy.upgrades, ownedSkins, skin.key)) return;
  shopStatus.textContent = `Aspecto ${skin.name} comprado y equipado.`;
}

function loadUnlockedLevel() {
  try {
    const storedLevel = window.localStorage.getItem("neon-run-unlocked-level");
    const level = storedLevel === null ? 1 : Number(storedLevel);
    if (!Number.isInteger(level) || level < 1 || level > LEVELS.length) {
      throw new Error("El progreso de niveles guardado no es válido.");
    }
    return level;
  } catch (error) {
    progressStatus.textContent = "PROGRESO NO DISPONIBLE";
    console.error("No se pudo leer el progreso local de Neon Run.", error);
    return 1;
  }
}

function saveUnlockedLevel(level) {
  const nextUnlocked = Math.min(LEVELS.length, Math.max(unlockedLevel, level));
  if (nextUnlocked === unlockedLevel) return;
  unlockedLevel = nextUnlocked;
  try {
    window.localStorage.setItem("neon-run-unlocked-level", String(nextUnlocked));
    renderLevelMenu();
  } catch (error) {
    progressStatus.textContent = "NO SE PUDO GUARDAR EL DESBLOQUEO";
    console.error("No se pudo guardar el progreso local de Neon Run.", error);
    renderLevelMenu();
  }
}

function renderLevelMenu() {
  if (game.selectedLevel > unlockedLevel) {
    game.selectedLevel = unlockedLevel;
    game.level = unlockedLevel;
    setDimension(unlockedLevel - 1);
  }
  for (const card of levelCards) {
    const level = Number(card.dataset.level);
    const available = level <= unlockedLevel;
    card.disabled = !available;
    card.style.setProperty("--world-glow", DIMENSIONS[level - 1].windows);
    card.classList.toggle("is-selected", level === game.selectedLevel);
    card.querySelector(".level-lock").textContent = available
      ? level === game.selectedLevel ? "SELECCIONADO" : "DISPONIBLE"
      : "BLOQUEADO";
  }
  startLevelButton.textContent = `JUGAR NIVEL ${game.selectedLevel}`;
  if (progressStatus.textContent !== "PROGRESO NO DISPONIBLE"
    && progressStatus.textContent !== "NO SE PUDO GUARDAR EL DESBLOQUEO") {
    progressStatus.textContent = "Completa el objetivo para desbloquear el siguiente mundo.";
  }
}

function selectLevel(level) {
  if (level > unlockedLevel) return;
  game.selectedLevel = level;
  game.level = level;
  setDimension(level - 1);
  game.levelObjectiveProgress = 0;
  renderLevelMenu();
}

function updateAudioButton() {
  audioButton.textContent = soundEnabled ? "SONIDO: SÍ" : "SONIDO: NO";
  audioButton.setAttribute("aria-pressed", String(soundEnabled));
}

function updateVibrationButton() {
  vibrationButton.disabled = !vibrationSupported;
  vibrationButton.textContent = vibrationSupported
    ? `VIBRACIÓN: ${vibrationEnabled ? "SÍ" : "NO"}`
    : "VIBRACIÓN: —";
  vibrationButton.setAttribute("aria-pressed", String(vibrationEnabled && vibrationSupported));
}

function maxLives() {
  return 3 + Number(economy.upgrades.extraLife === true);
}

function vibrate(pattern) {
  if (!vibrationEnabled || !vibrationSupported) return;
  const started = navigator.vibrate(pattern);
  if (started === false) {
    vibrationEnabled = false;
    updateVibrationButton();
  }
}

function initializeAudio() {
  if (!soundEnabled) return false;
  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextConstructor) {
    soundEnabled = false;
    audioButton.textContent = "AUDIO NO DISP.";
    audioButton.setAttribute("aria-pressed", "false");
    return false;
  }

  if (!audioContext) {
    try {
      audioContext = new AudioContextConstructor();
      masterGain = audioContext.createGain();
      masterGain.gain.value = 0.18;
      masterGain.connect(audioContext.destination);
    } catch (error) {
      soundEnabled = false;
      audioButton.textContent = "AUDIO NO DISP.";
      audioButton.setAttribute("aria-pressed", "false");
      console.error("No se pudo iniciar el audio de Neon Run.", error);
      return false;
    }
  }

  if (audioContext.state === "suspended") {
    audioContext.resume().catch((error) => {
      soundEnabled = false;
      updateAudioButton();
      console.error("El navegador no permitió activar el audio.", error);
    });
  }
  return true;
}

function playTone(frequency, duration, waveform = "triangle", volume = 0.08) {
  if (!soundEnabled || !audioContext || !masterGain) return;
  const oscillator = audioContext.createOscillator();
  const envelope = audioContext.createGain();
  const start = audioContext.currentTime;
  oscillator.type = waveform;
  oscillator.frequency.setValueAtTime(frequency, start);
  envelope.gain.setValueAtTime(0.0001, start);
  envelope.gain.exponentialRampToValueAtTime(volume, start + 0.015);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  oscillator.connect(envelope);
  envelope.connect(masterGain);
  oscillator.start(start);
  oscillator.stop(start + duration);
}

function playEffect(effect) {
  const effects = {
    jump: [560, 0.12, "triangle", 0.1],
    slide: [250, 0.14, "sawtooth", 0.06],
    coin: [880, 0.1, "sine", 0.08],
    powerup: [1040, 0.2, "triangle", 0.1],
    hit: [120, 0.24, "sawtooth", 0.12],
    portal: [660, 0.42, "sine", 0.08],
    level: [1040, 0.3, "square", 0.1],
  };
  const [frequency, duration, waveform, volume] = effects[effect];
  playTone(frequency, duration, waveform, volume);
}

function updateMusic(delta) {
  if (!soundEnabled || !audioContext || game.state !== "running") return;
  game.musicTimer += delta;
  const beatLength = 0.17;
  const notes = [523, 659, 784, 1047, 784, 659, 880, 1175, 988, 784, 659, 523, 659, 880, 1047, 784];
  while (game.musicTimer >= beatLength) {
    game.musicTimer -= beatLength;
    const step = game.musicStep % notes.length;
    playTone(notes[step], 0.14, step % 4 === 0 ? "sawtooth" : "square", 0.065);
    if (step % 4 === 0) playKick();
    if (step % 2 === 1) playTone(2200, 0.035, "square", 0.018);
    if (step % 8 === 0) playTone(notes[(step + 4) % notes.length] / 2, 0.15, "triangle", 0.04);
    game.musicStep += 1;
  }
}

function playKick() {
  if (!soundEnabled || !audioContext || !masterGain) return;
  const oscillator = audioContext.createOscillator();
  const envelope = audioContext.createGain();
  const start = audioContext.currentTime;
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(145, start);
  oscillator.frequency.exponentialRampToValueAtTime(48, start + 0.13);
  envelope.gain.setValueAtTime(0.0001, start);
  envelope.gain.exponentialRampToValueAtTime(0.22, start + 0.01);
  envelope.gain.exponentialRampToValueAtTime(0.0001, start + 0.15);
  oscillator.connect(envelope);
  envelope.connect(masterGain);
  oscillator.start(start);
  oscillator.stop(start + 0.16);
}

function resetGame(level = game.selectedLevel, startingLives = maxLives(), mode = "level") {
  Object.assign(game, {
    state: "running",
    mode,
    selectedLevel: level,
    elapsed: 0,
    level,
    levelObjectiveProgress: 0,
    levelCompletedThisFrame: false,
    score: 0,
    bonusPoints: 0,
    coins: 0,
    lives: Math.min(startingLives, maxLives()),
    lane: 1,
    playerX: LANE_CENTERS[1],
    jumpTime: 0,
    jumpGraceTime: 0,
    slideTime: 0,
    shieldTime: economy.upgrades.startShield ? 8 : 0,
    magnetTime: economy.upgrades.startMagnet ? 8 : 0,
    turboTime: 0,
    invulnerability: 0,
    hitFlash: 0,
    feedbackText: "",
    feedbackTime: 0,
    feedbackColor: "#54f6ec",
    dimensionIndex: level - 1,
    previousDimensionIndex: level - 1,
    dimensionBlendTime: 0,
    mechanicState: "idle",
    mechanicTimer: 0,
    nextMechanicAt: 12,
    bossState: "inactive",
    bossHealth: 0,
    nextBossAttackIn: 0,
    hitsTaken: 0,
    achievementDistancePending: 0,
    rageTime: 0,
    rageShotIn: 0,
    rageShotsRemaining: 0,
    nextRageAt: RAGE_FIRST_DELAY,
    obstacleIn: 2.5,
    coinIn: 2.5,
    powerupIn: 6.5,
    shotIn: 4.5,
    obstacles: [],
    coinsOnRoad: [],
    powerups: [],
    shots: [],
    particles: [],
    musicTimer: 0,
    musicStep: 0,
  });
  message.classList.add("is-hidden");
  secondaryAction.hidden = true;
  levelMenu.hidden = true;
  touchControls.classList.remove("is-hidden");
  pauseButton.disabled = false;
  pauseButton.textContent = "PAUSAR";
  initializeAudio();
  playEffect("powerup");
}

function startGame(level = game.selectedLevel, mode = "level") {
  if (game.state === "running") return;
  const carryLives = mode === "level" && game.mode === "level" && game.state === "complete" && level === game.level + 1;
  resetGame(level, carryLives ? game.lives : maxLives(), mode);
}

function startInfiniteRun() {
  startGame(game.selectedLevel, "infinite");
}

function endGame() {
  if (game.state !== "running") return;
  game.score = calculateScore();
  game.state = "over";
  pauseButton.disabled = true;
  levelMenu.hidden = true;
  touchControls.classList.add("is-hidden");
  saveBestScore(game.score);
  messageKicker.textContent = "SEÑAL PERDIDA";
  messageTitle.textContent = "TE ALCANZÓ";
  messageCopy.textContent = game.mode === "infinite"
    ? `Carrera infinita · ${Math.floor(game.elapsed * 10)} m · Puntuación: ${game.score} · Monedas: ${game.coins}.`
    : `Nivel ${game.level} · Distancia: ${Math.floor(game.elapsed * 10)} m · Puntuación: ${game.score} · Monedas: ${game.coins}. ¿Otra carrera?`;
  actionButton.textContent = game.mode === "infinite" ? "REINTENTAR CARRERA" : "REINTENTAR NIVEL";
  secondaryAction.textContent = "MENÚ DE NIVELES";
  secondaryAction.hidden = false;
  message.classList.remove("is-hidden");
}

function completeLevel() {
  if (game.state !== "running") return;
  const completedLevel = game.level;
  game.levelObjectiveProgress = currentObjective().target;
  game.levelCompletedThisFrame = true;
  game.lives = Math.min(maxLives(), game.lives + 1);
  game.score = calculateScore();
  saveBestScore(game.score);
  updateAchievementProgress("levels");
  if (game.hitsTaken === 0) updateAchievementProgress("flawless");
  game.state = "complete";
  pauseButton.disabled = true;
  touchControls.classList.add("is-hidden");

  const nextLevel = completedLevel + 1;
  if (nextLevel <= LEVELS.length) {
    game.selectedLevel = nextLevel;
    saveUnlockedLevel(nextLevel);
  }

  messageKicker.textContent = "OBJETIVO COMPLETADO";
  messageTitle.textContent = completedLevel < LEVELS.length
    ? `¡NIVEL ${completedLevel} SUPERADO!`
    : "¡CAMPAÑA COMPLETADA!";
  messageCopy.textContent = completedLevel < LEVELS.length
    ? `${LEVELS[nextLevel - 1].name} está desbloqueado.`
    : "Completaste los nueve mundos. Puedes volver a jugarlos o correr sin fin.";
  actionButton.textContent = completedLevel < LEVELS.length ? "SIGUIENTE NIVEL" : "REJUGAR NIVEL 9";
  secondaryAction.textContent = "MENÚ DE NIVELES";
  secondaryAction.hidden = false;
  message.classList.remove("is-hidden");
  playEffect("level");
  playEffect("portal");
  vibrate([30, 25, 30, 25, 60]);
}

function showLevelMenu() {
  game.state = "menu";
  game.mode = "level";
  game.level = game.selectedLevel;
  game.levelObjectiveProgress = 0;
  game.elapsed = 0;
  game.score = 0;
  game.coins = 0;
  game.lives = 3;
  game.lane = 1;
  game.playerX = LANE_CENTERS[1];
  game.jumpTime = 0;
  game.jumpGraceTime = 0;
  game.slideTime = 0;
  game.shieldTime = 0;
  game.magnetTime = 0;
  game.turboTime = 0;
  game.invulnerability = 0;
  game.hitFlash = 0;
  game.feedbackTime = 0;
  game.rageTime = 0;
  game.rageShotIn = 0;
  game.rageShotsRemaining = 0;
  game.nextRageAt = RAGE_FIRST_DELAY;
  game.mechanicState = "idle";
  game.mechanicTimer = 0;
  game.nextMechanicAt = 12;
  game.bossState = "inactive";
  game.bossHealth = 0;
  game.nextBossAttackIn = 0;
  game.hitsTaken = 0;
  game.achievementDistancePending = 0;
  setDimension(game.selectedLevel - 1);
  game.obstacles = [];
  game.coinsOnRoad = [];
  game.powerups = [];
  game.shots = [];
  game.particles = [];
  message.classList.add("is-hidden");
  secondaryAction.hidden = true;
  levelMenu.hidden = false;
  touchControls.classList.add("is-hidden");
  pauseButton.disabled = true;
  pauseButton.textContent = "PAUSAR";
  renderLevelMenu();
}

function setDimension(index) {
  const nextIndex = index % DIMENSIONS.length;
  if (nextIndex !== game.dimensionIndex) {
    game.previousDimensionIndex = game.dimensionIndex;
    game.dimensionIndex = nextIndex;
    game.dimensionBlendTime = reducedEffects ? 0 : 1.8;
  }
}

function showFeedback(text, color = "#54f6ec") {
  game.feedbackText = text;
  game.feedbackColor = color;
  game.feedbackTime = 1.15;
}

function startRageAttack() {
  game.rageTime = RAGE_DURATION;
  game.rageShotsRemaining = RAGE_SHOT_COUNT;
  game.rageShotIn = 0.3;
  game.nextRageAt = game.elapsed + RAGE_INTERVAL;
  game.shotIn = Math.max(game.shotIn, 2.2);
  showFeedback("¡EL PERSEGUIDOR ENTRA EN RABIA!", "#ff594f");
  playEffect("hit");
  vibrate([45, 25, 45, 25, 90]);
}

function currentWorldMechanic() {
  return WORLD_MECHANICS[game.dimensionIndex % WORLD_MECHANICS.length];
}

function updateWorldMechanic(delta) {
  if (game.mechanicState === "warning") {
    game.mechanicTimer -= delta;
    if (game.mechanicTimer <= 0) {
      game.mechanicState = "active";
      game.mechanicTimer = WORLD_MECHANIC_DURATION;
      showFeedback(currentWorldMechanic().title, DIMENSIONS[game.dimensionIndex].windows);
      playEffect("portal");
    }
  } else if (game.mechanicState === "active") {
    game.mechanicTimer -= delta;
    if (game.mechanicTimer <= 0) game.mechanicState = "idle";
  } else if (game.elapsed >= game.nextMechanicAt) {
    game.mechanicState = "warning";
    game.mechanicTimer = WORLD_MECHANIC_WARNING;
    game.nextMechanicAt = game.elapsed + WORLD_MECHANIC_INTERVAL;
    showFeedback(currentWorldMechanic().warning, DIMENSIONS[game.dimensionIndex].windows);
  }
}

function startBossEncounter() {
  if (!BOSSES[game.level] || game.bossState !== "inactive") return;
  game.bossState = "active";
  game.bossHealth = 3;
  game.nextBossAttackIn = 1.6;
  showFeedback(`¡JEFE: ${BOSSES[game.level].name}!`, BOSSES[game.level].color);
  playEffect("hit");
  vibrate([45, 30, 45]);
}

function damageBoss() {
  if (game.bossState !== "active") return;
  game.bossHealth -= 1;
  game.bonusPoints += 100;
  createParticles(WIDTH / 2, HORIZON_Y + 85, BOSSES[game.level].color, 16);
  playEffect("level");
  if (game.bossHealth > 0) {
    showFeedback(`¡GOLPE AL JEFE! ${game.bossHealth} RESTANTES`, BOSSES[game.level].color);
    return;
  }
  game.bossState = "defeated";
  updateAchievementProgress("bosses");
  showFeedback("¡JEFE DERROTADO!", "#ffe66d");
  completeLevel();
}

function currentObjective() {
  return LEVELS[game.level - 1].objective;
}

function calculateScore() {
  const levelMultiplier = 1 + Math.min(0.5, (game.level - 1) * 0.05);
  const distanceScore = Math.floor(game.elapsed * 10 * levelMultiplier * (game.turboTime > 0 ? 2 : 1));
  return distanceScore + game.coins * 50 + game.bonusPoints;
}

function addObjectiveProgress(type, amount = 1) {
  if (game.mode !== "level" || game.levelCompletedThisFrame) return;
  const objective = currentObjective();
  if (objective.type !== type) return;
  game.levelObjectiveProgress = Math.min(objective.target, game.levelObjectiveProgress + amount);
  if (game.levelObjectiveProgress < objective.target) return;
  if (BOSSES[game.level]) {
    startBossEncounter();
    return;
  }
  completeLevel();
}

function togglePause() {
  if (game.state === "running") {
    game.state = "paused";
    pauseButton.textContent = "CONTINUAR";
    messageKicker.textContent = "PAUSA";
    messageTitle.textContent = "TOMA UN RESPIRO";
    messageCopy.textContent = "Continúa la carrera o vuelve al menú de inicio.";
    actionButton.textContent = "CONTINUAR";
    secondaryAction.textContent = "MENÚ DE INICIO";
    secondaryAction.hidden = false;
    message.classList.remove("is-hidden");
  } else if (game.state === "paused") {
    game.state = "running";
    pauseButton.textContent = "PAUSAR";
    secondaryAction.hidden = true;
    message.classList.add("is-hidden");
  }
}

function randomLane() {
  return Math.floor(Math.random() * LANE_CENTERS.length);
}

function laneChange(direction) {
  if (game.state !== "running") return;
  const mechanic = game.mechanicState === "active" ? currentWorldMechanic() : null;
  if (mechanic?.style === "aquatic" || mechanic?.style === "cosmic") direction *= -1;
  game.lane = Math.max(0, Math.min(LANE_CENTERS.length - 1, game.lane + direction));
}

function jump() {
  if (game.state !== "running" || game.jumpTime > 0 || game.slideTime > 0) return;
  game.jumpTime = JUMP_DURATION;
  game.jumpGraceTime = 0;
  showFeedback("¡SALTO!");
  playEffect("jump");
  vibrate(18);
  createParticles(game.playerX, GROUND_Y - 4, "#54f6ec", 8);
}

function slide() {
  if (game.state !== "running" || game.slideTime > 0 || game.jumpTime > 0) return;
  game.slideTime = 0.68;
  showFeedback("¡DESLIZ!");
  playEffect("slide");
  vibrate([14, 18, 14]);
}

function performAction(action) {
  if (game.state === "paused") return;
  if (game.state !== "running") {
    if (game.state === "over" && game.mode === "infinite") startInfiniteRun();
    else startGame();
    return;
  }

  const invertedGravity = game.mechanicState === "active" && currentWorldMechanic().style === "void";
  if (action === "left") laneChange(-1);
  if (action === "right") laneChange(1);
  if (action === "jump") invertedGravity ? slide() : jump();
  if (action === "slide") invertedGravity ? jump() : slide();
}

function createParticles(x, y, color, count) {
  if (reducedEffects) return;
  for (let index = 0; index < count; index += 1) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 25 + Math.random() * 110;
    game.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 35,
      life: 0.3 + Math.random() * 0.35,
      color,
    });
  }
}

function takeHit(x, y) {
  if (game.invulnerability > 0) return;
  game.hitsTaken += 1;
  if (game.shieldTime > 0) {
    game.shieldTime = 0;
    game.invulnerability = 0.65;
    game.hitFlash = 0.25;
    showFeedback("EL ESCUDO BLOQUEÓ EL GOLPE");
    playEffect("hit");
    vibrate([22, 32, 22]);
    createParticles(x, y, "#54f6ec", 14);
    return;
  }

  game.lives -= 1;
  game.invulnerability = 1.05;
  game.hitFlash = 0.36;
  showFeedback(`¡IMPACTO! ${game.lives} VIDAS`, "#ff4fc8");
  playEffect("hit");
  vibrate([70, 35, 110]);
  createParticles(x, y, "#ff4fc8", 18);
  if (game.lives <= 0) endGame();
}

function spawnObstacle() {
  const mechanic = game.mechanicState === "active" ? currentWorldMechanic() : null;
  let type = Math.random() < 0.58 ? "crate" : "barrier";
  if (mechanic?.style === "solar") type = "meteor";
  if (mechanic?.style === "forest") type = "root";
  game.obstacles.push({
    lane: randomLane(),
    progress: 0,
    type,
    hit: false,
  });
}

function spawnCoins() {
  const lane = randomLane();
  for (let index = 0; index < 4; index += 1) {
    game.coinsOnRoad.push({ lane, progress: index * 0.085, collected: false });
  }
}

function spawnPowerup() {
  const types = ["shield", "magnet", "turbo"];
  game.powerups.push({
    lane: randomLane(),
    progress: 0,
    type: types[Math.floor(Math.random() * types.length)],
    collected: false,
  });
}

function projectLane(lane, progress) {
  const depth = Math.max(0, Math.min(progress, 1));
  return 480 + (LANE_CENTERS[lane] - 480) * depth;
}

function projectY(progress) {
  return HORIZON_Y + Math.max(0, Math.min(progress, 1)) * (GROUND_Y - HORIZON_Y);
}

function powerupColor(type) {
  if (type === "shield") return "#54f6ec";
  if (type === "magnet") return "#ffe66d";
  return "#ff4fc8";
}

function jumpOffset() {
  if (game.jumpTime <= 0) return 0;
  const progress = 1 - game.jumpTime / JUMP_DURATION;
  return Math.sin(progress * Math.PI) * JUMP_HEIGHT;
}

function update(delta) {
  if (game.state !== "running") return;

  game.elapsed += delta;
  game.dimensionBlendTime = Math.max(0, game.dimensionBlendTime - delta);
  game.levelCompletedThisFrame = false;
  game.achievementDistancePending += delta * 10;
  if (game.achievementDistancePending >= 10) {
    const distance = Math.floor(game.achievementDistancePending);
    game.achievementDistancePending -= distance;
    updateAchievementProgress("distance", distance);
  }
  addObjectiveProgress("distance", delta * 10);
  if (game.state !== "running") return;
  game.score = calculateScore();
  updateWorldMechanic(delta);
  const activeMechanic = game.mechanicState === "active" ? currentWorldMechanic() : null;
  const laneResponse = activeMechanic?.style === "machine" ? 6 : 11;
  game.playerX += (LANE_CENTERS[game.lane] - game.playerX) * Math.min(1, delta * laneResponse);
  if (game.jumpTime > 0) {
    game.jumpTime = Math.max(0, game.jumpTime - delta);
    if (game.jumpTime === 0) game.jumpGraceTime = 0.24;
  } else {
    game.jumpGraceTime = Math.max(0, game.jumpGraceTime - delta);
  }
  game.slideTime = Math.max(0, game.slideTime - delta);
  game.shieldTime = Math.max(0, game.shieldTime - delta);
  game.magnetTime = Math.max(0, game.magnetTime - delta);
  game.turboTime = Math.max(0, game.turboTime - delta);
  game.invulnerability = Math.max(0, game.invulnerability - delta);
  game.hitFlash = Math.max(0, game.hitFlash - delta);
  game.feedbackTime = Math.max(0, game.feedbackTime - delta);
  game.rageTime = Math.max(0, game.rageTime - delta);
  const difficulty = 1 + Math.min(0.55, (game.level - 1) * 0.07);
  let worldSpeed = (0.43 + Math.min(0.2, game.elapsed * 0.0015)) * difficulty;

  if (game.mode === "infinite") {
    const worldIndex = (game.level - 1 + Math.floor(game.elapsed / INFINITE_WORLD_DURATION)) % DIMENSIONS.length;
    if (worldIndex !== game.dimensionIndex) {
      setDimension(worldIndex);
      game.mechanicState = "idle";
      game.nextMechanicAt = game.elapsed + 12;
      showFeedback(DIMENSIONS[worldIndex].name, DIMENSIONS[worldIndex].windows);
      playEffect("portal");
    }
  }

  if (activeMechanic?.style === "city") worldSpeed *= 1.18;
  if (activeMechanic?.style === "machine") worldSpeed *= 1.12;
  if (activeMechanic?.style === "ice") worldSpeed *= 1.15;

  if (game.rageTime === 0 && game.elapsed >= game.nextRageAt) startRageAttack();
  if (game.bossState === "active") {
    game.nextBossAttackIn -= delta;
    if (game.nextBossAttackIn <= 0) {
      game.obstacles.push({
        lane: randomLane(),
        progress: 0,
        type: Math.random() < 0.5 ? "crate" : "barrier",
        hit: false,
        bossAttack: true,
      });
      game.nextBossAttackIn = 2.25;
    }
  }
  if (game.rageTime > 0) {
    game.rageShotIn -= delta;
    if (game.rageShotsRemaining > 0 && game.rageShotIn <= 0) {
      game.shots.push({ lane: game.lane, progress: 0.06, hit: false, rage: true });
      game.rageShotsRemaining -= 1;
      game.rageShotIn = 0.78;
    }
  } else {
    game.shotIn -= delta;
    if (game.shotIn <= 0) {
      game.shots.push({ lane: game.lane, progress: 0.06, hit: false, rage: false });
      game.shotIn = Math.max(2.2, 3.8 - game.elapsed * 0.006) / difficulty;
    }
  }

  game.obstacleIn -= delta;
  if (game.obstacleIn <= 0) {
    spawnObstacle();
    game.obstacleIn = (Math.max(1.2, 1.8 - game.elapsed * 0.004) / difficulty) + Math.random() * 0.35;
  }

  game.coinIn -= delta;
  if (game.coinIn <= 0) {
    spawnCoins();
    game.coinIn = 3 + Math.random() * 1.3;
  }

  game.powerupIn -= delta;
  if (game.powerupIn <= 0) {
    spawnPowerup();
    game.powerupIn = Math.max(5.5, 7.5 + Math.random() * 2 - (game.level - 1) * 0.15);
  }

  for (const obstacle of game.obstacles) {
    obstacle.progress += worldSpeed * delta;
    if (obstacle.progress < 0.91 || obstacle.hit) continue;

    if (obstacle.lane !== game.lane) {
      obstacle.hit = true;
      if (obstacle.bossAttack) damageBoss();
      else addObjectiveProgress("dodges");
      if (game.state !== "running") return;
      continue;
    }

    const needsJump = ["crate", "root", "meteor"].includes(obstacle.type);
    const avoided =
      (needsJump && (jumpOffset() > 28 || game.jumpGraceTime > 0)) ||
      (obstacle.type === "barrier" && game.slideTime > 0);
    obstacle.hit = true;
    if (avoided) {
      game.bonusPoints += 25;
      if (obstacle.bossAttack) damageBoss();
      else addObjectiveProgress("dodges");
      if (game.state !== "running") return;
      if (!obstacle.bossAttack) {
        showFeedback(needsJump ? "¡SALTO PERFECTO! +25" : "¡DESLIZ PERFECTO! +25");
      }
      createParticles(game.playerX, GROUND_Y - 28, "#54f6ec", 9);
    } else {
      takeHit(game.playerX, GROUND_Y - 20);
      if (game.state !== "running") return;
    }
  }

  for (const coin of game.coinsOnRoad) {
    coin.progress += worldSpeed * delta;
    const currentMechanicStyle = activeMechanic?.style;
    const pulledByCurrent = currentMechanicStyle === "aquatic" && Math.abs(coin.lane - game.lane) <= 1;
    const pulledByWind = currentMechanicStyle === "desert" && coin.progress >= 0.72;
    if (coin.progress >= 0.9 && !coin.collected
      && (coin.lane === game.lane || game.magnetTime > 0 || pulledByCurrent || pulledByWind)) {
      coin.collected = true;
      game.coins += 1;
      collectWalletCoin();
      addObjectiveProgress("coins");
      playEffect("coin");
      vibrate(9);
      createParticles(projectLane(coin.lane, 1), GROUND_Y - 35, "#ffe66d", 5);
      if (game.state !== "running") return;
    }
  }

  for (const powerup of game.powerups) {
    powerup.progress += worldSpeed * delta;
    if (powerup.progress >= 0.9 && !powerup.collected && powerup.lane === game.lane) {
      powerup.collected = true;
      playEffect("powerup");
      vibrate([24, 35, 24]);
      if (powerup.type === "shield") {
        game.shieldTime = 8;
        showFeedback("ESCUDO ACTIVADO");
      } else if (powerup.type === "magnet") {
        game.magnetTime = 8;
        showFeedback("IMÁN DE MONEDAS", "#ffe66d");
      } else {
        game.turboTime = 7;
        showFeedback("TURBO x2", "#ff4fc8");
      }
      addObjectiveProgress("powerups");
      createParticles(projectLane(powerup.lane, 1), GROUND_Y - 42, powerupColor(powerup.type), 14);
      if (game.state !== "running") return;
    }
  }

  for (const shot of game.shots) {
    shot.progress += worldSpeed * delta * (shot.rage ? 1.55 : 1.24);
    if (shot.progress >= 0.91 && !shot.hit) {
      shot.hit = true;
      if (shot.lane === game.lane) {
        takeHit(game.playerX, GROUND_Y - 28);
        if (game.state !== "running") return;
      } else {
        addObjectiveProgress("dodges");
        if (game.state !== "running") return;
      }
    }
  }

  for (const particle of game.particles) {
    particle.x += particle.vx * delta;
    particle.y += particle.vy * delta;
    particle.vy += 170 * delta;
    particle.life -= delta;
  }

  game.obstacles = game.obstacles.filter((item) => item.progress < 1.08);
  game.coinsOnRoad = game.coinsOnRoad.filter((item) => item.progress < 1.04 && !item.collected);
  game.powerups = game.powerups.filter((item) => item.progress < 1.04 && !item.collected);
  game.shots = game.shots.filter((item) => item.progress < 1.04 && !item.hit);
  game.particles = game.particles.filter((item) => item.life > 0);
  updateMusic(delta);
}

function drawCityBackground(dimension) {
  const skylineOffset = (game.animationTime * 18) % 120;
  for (let index = 0; index < 11; index += 1) {
    const x = index * 120 - skylineOffset;
    const buildingHeight = 75 + ((index * 43) % 82);
    context.fillStyle = dimension.buildings;
    context.fillRect(x, HORIZON_Y - buildingHeight, 92, buildingHeight);
    context.fillStyle = dimension.windows;
    for (let row = 0; row < 4; row += 1) {
      const windowY = HORIZON_Y - buildingHeight + 15 + row * 18;
      context.fillRect(x + 13, windowY, 5, 5);
      context.fillRect(x + 31, windowY, 5, 5);
      context.fillRect(x + 61, windowY, 5, 5);
    }
    if (index % 3 === 0) {
      context.fillStyle = "#ff4fc8";
      context.fillRect(x + 38, HORIZON_Y - buildingHeight - 14, 20, 14);
      context.fillStyle = "#fff4fb";
      context.fillRect(x + 42, HORIZON_Y - buildingHeight - 10, 12, 3);
    }
  }
}

function drawVoidBackground(dimension) {
  for (let index = 0; index < 92; index += 1) {
    const x = (index * 137.5 + 13) % WIDTH;
    const y = (index * 67.7 + 11) % (HORIZON_Y + 24);
    const twinkle = 0.35 + (Math.sin(game.animationTime * 2 + index) + 1) * 0.3;
    context.globalAlpha = twinkle;
    context.fillStyle = index % 8 === 0 ? dimension.windows : "#f4f4ff";
    context.fillRect(x, y, index % 8 === 0 ? 3 : 2, index % 8 === 0 ? 3 : 2);
  }
  context.globalAlpha = 1;

  context.save();
  context.translate(740, 100);
  context.rotate(-0.2);
  context.strokeStyle = `${dimension.windows}99`;
  context.lineWidth = 5;
  context.beginPath();
  context.ellipse(0, 0, 83, 24, 0, 0, Math.PI * 2);
  context.stroke();
  context.fillStyle = dimension.windows;
  context.shadowBlur = 30;
  context.shadowColor = dimension.windows;
  context.beginPath();
  context.arc(0, 0, 36, 0, Math.PI * 2);
  context.fill();
  context.restore();

  for (let index = 0; index < 5; index += 1) {
    const x = (index * 233 + 41 - game.animationTime * (8 + index * 2)) % (WIDTH + 90);
    const y = 93 + (index * 37) % 100;
    const size = 14 + (index % 3) * 6;
    context.fillStyle = `${dimension.windows}44`;
    context.strokeStyle = `${dimension.windows}aa`;
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(x, y - size);
    context.lineTo(x + size * 0.55, y);
    context.lineTo(x, y + size);
    context.lineTo(x - size * 0.55, y);
    context.closePath();
    context.fill();
    context.stroke();
  }
}

function drawSolarBackground(dimension) {
  const sunGlow = context.createRadialGradient(690, 105, 12, 690, 105, 125);
  sunGlow.addColorStop(0, "#fff5b0");
  sunGlow.addColorStop(0.22, dimension.windows);
  sunGlow.addColorStop(1, `${dimension.windows}00`);
  context.fillStyle = sunGlow;
  context.beginPath();
  context.arc(690, 105, 125, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#471c36";
  context.beginPath();
  context.moveTo(0, 185);
  context.lineTo(120, 110);
  context.lineTo(200, 178);
  context.lineTo(330, 98);
  context.lineTo(460, 181);
  context.lineTo(590, 115);
  context.lineTo(760, 184);
  context.lineTo(870, 124);
  context.lineTo(960, 172);
  context.lineTo(960, 245);
  context.lineTo(0, 245);
  context.closePath();
  context.fill();

  context.fillStyle = "#29152e";
  context.beginPath();
  context.moveTo(0, 220);
  context.lineTo(140, 158);
  context.lineTo(265, 224);
  context.lineTo(430, 145);
  context.lineTo(570, 226);
  context.lineTo(740, 160);
  context.lineTo(880, 225);
  context.lineTo(960, 176);
  context.lineTo(960, 260);
  context.lineTo(0, 260);
  context.closePath();
  context.fill();

  context.strokeStyle = `${dimension.windows}aa`;
  context.lineWidth = 2;
  for (let index = 0; index < 5; index += 1) {
    const x = 70 + index * 205;
    context.beginPath();
    context.moveTo(x, 236);
    context.lineTo(x + 17, 222);
    context.lineTo(x + 10, 211);
    context.stroke();
  }
  for (let index = 0; index < 25; index += 1) {
    const x = (index * 97 + game.animationTime * (12 + index % 5)) % WIDTH;
    const y = (index * 47 + game.animationTime * (18 + index % 7)) % (HORIZON_Y + 20);
    context.globalAlpha = 0.3 + (index % 5) * 0.12;
    context.fillStyle = index % 3 === 0 ? "#fff2a1" : dimension.windows;
    context.fillRect(x, y, 3, 5);
  }
  context.globalAlpha = 1;
}

function drawAquaticBackground(dimension) {
  for (let index = 0; index < 6; index += 1) {
    const x = 35 + index * 178;
    context.fillStyle = `rgba(94, 244, 255, ${0.025 + index % 2 * 0.02})`;
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x + 95, 0);
    context.lineTo(x + 185, HORIZON_Y);
    context.lineTo(x + 90, HORIZON_Y);
    context.closePath();
    context.fill();
  }

  for (const side of [0, 1]) {
    const baseX = side === 0 ? 24 : WIDTH - 24;
    context.fillStyle = "#0a424e";
    context.beginPath();
    context.moveTo(baseX - 65, HORIZON_Y);
    context.quadraticCurveTo(baseX - 15, 128, baseX + 55, HORIZON_Y);
    context.closePath();
    context.fill();
    context.strokeStyle = side === 0 ? "#28b889" : "#51d5bd";
    context.lineWidth = 8;
    context.lineCap = "round";
    for (let branch = 0; branch < 4; branch += 1) {
      const sway = Math.sin(game.animationTime * 1.5 + branch + side) * 7;
      const x = baseX + (branch - 1.5) * 14;
      context.beginPath();
      context.moveTo(x, HORIZON_Y);
      context.quadraticCurveTo(x + sway, 150, x + sway * 0.6, 112 + branch * 12);
      context.stroke();
    }
  }

  for (let index = 0; index < 24; index += 1) {
    const x = (index * 83 + 21) % WIDTH;
    const rise = (game.animationTime * (13 + index % 6) + index * 41) % (HORIZON_Y + 30);
    const radius = 2 + index % 4;
    context.globalAlpha = 0.28 + (index % 4) * 0.13;
    context.strokeStyle = index % 3 === 0 ? "#c5ffff" : dimension.windows;
    context.lineWidth = 1.5;
    context.beginPath();
    context.arc(x + Math.sin(game.animationTime + index) * 5, HORIZON_Y - rise, radius, 0, Math.PI * 2);
    context.stroke();
  }
  context.globalAlpha = 1;
  context.lineCap = "butt";
}

function drawForestBackground(dimension) {
  for (let index = 0; index < 17; index += 1) {
    const x = (index * 79 + 18) % WIDTH;
    const height = 50 + index % 5 * 18;
    context.fillStyle = index % 2 === 0 ? "#0d3a2b" : "#124d36";
    context.fillRect(x, HORIZON_Y - height, 8 + index % 4 * 3, height);
    context.fillStyle = index % 3 === 0 ? "#9aff78" : "#40bb70";
    for (let leaf = 0; leaf < 3; leaf += 1) {
      const leafX = x + (leaf - 1) * 15;
      const leafY = HORIZON_Y - height + 12 + leaf * 11 + Math.sin(game.animationTime * 2 + index) * 3;
      context.beginPath();
      context.ellipse(leafX, leafY, 8, 4, leaf * 0.6, 0, Math.PI * 2);
      context.fill();
    }
  }
  for (let index = 0; index < 7; index += 1) {
    const x = 70 + index * 137;
    const y = HORIZON_Y - 15 - (index % 2) * 12;
    context.fillStyle = "#b9ff79";
    context.shadowBlur = 18;
    context.shadowColor = dimension.windows;
    context.beginPath();
    context.moveTo(x, y - 16);
    context.lineTo(x + 13, y);
    context.lineTo(x, y + 16);
    context.lineTo(x - 13, y);
    context.closePath();
    context.fill();
    context.shadowBlur = 0;
  }
}

function drawMachineBackground(dimension) {
  for (let index = 0; index < 9; index += 1) {
    const x = index * 118 - (game.animationTime * 12) % 118;
    const height = 55 + index % 4 * 27;
    context.fillStyle = index % 2 === 0 ? "#26353d" : "#1c2a32";
    context.fillRect(x, HORIZON_Y - height, 86, height);
    context.fillStyle = dimension.windows;
    for (let row = 0; row < 3; row += 1) {
      context.fillRect(x + 10, HORIZON_Y - height + 12 + row * 17, 15, 4);
    }
    context.fillStyle = "#101820";
    context.fillRect(x + 65, HORIZON_Y - height - 19, 8, 19);
    context.fillStyle = `${dimension.windows}66`;
    context.fillRect(x + 61, HORIZON_Y - height - 22, 16, 3);
  }
  for (let index = 0; index < 4; index += 1) {
    const x = 140 + index * 230;
    const y = 93 + index % 2 * 35;
    const radius = 19 + index % 2 * 7;
    context.save();
    context.translate(x, y);
    context.rotate(game.animationTime * (index % 2 === 0 ? 0.7 : -0.7));
    context.strokeStyle = `${dimension.windows}99`;
    context.lineWidth = 5;
    context.beginPath();
    context.arc(0, 0, radius, 0, Math.PI * 2);
    context.stroke();
    for (let tooth = 0; tooth < 8; tooth += 1) {
      context.rotate(Math.PI / 4);
      context.fillStyle = dimension.windows;
      context.fillRect(radius - 1, -3, 10, 6);
    }
    context.restore();
  }
}

function drawIceBackground(dimension) {
  const aurora = context.createLinearGradient(0, 25, WIDTH, 180);
  aurora.addColorStop(0, `${dimension.windows}00`);
  aurora.addColorStop(0.45, `${dimension.windows}88`);
  aurora.addColorStop(1, `${dimension.windows}00`);
  context.save();
  context.globalAlpha = 0.5;
  context.fillStyle = aurora;
  context.beginPath();
  context.moveTo(0, 130 + Math.sin(game.animationTime) * 10);
  for (let x = 0; x <= WIDTH; x += 40) {
    context.lineTo(x, 100 + Math.sin(x * 0.01 + game.animationTime * 1.4) * 25);
  }
  context.lineTo(WIDTH, 170);
  context.lineTo(0, 165);
  context.closePath();
  context.fill();
  context.restore();

  for (let range = 0; range < 3; range += 1) {
    context.fillStyle = range === 0 ? "#345f88" : range === 1 ? "#234c75" : "#173957";
    context.beginPath();
    context.moveTo(0, HORIZON_Y);
    for (let x = 0; x <= WIDTH; x += 80) {
      const peak = HORIZON_Y - 25 - ((x / 80 + range * 3) % 4) * 17;
      context.lineTo(x, peak);
      context.lineTo(x + 40, HORIZON_Y);
    }
    context.lineTo(WIDTH, HORIZON_Y + 12);
    context.lineTo(0, HORIZON_Y + 12);
    context.closePath();
    context.fill();
  }
  for (let index = 0; index < 36; index += 1) {
    const x = (index * 131 + 19) % WIDTH;
    const y = (index * 71 + game.animationTime * (18 + index % 9)) % (HORIZON_Y + 10);
    context.fillStyle = index % 4 === 0 ? "#ffffff" : `${dimension.windows}dd`;
    context.globalAlpha = 0.45 + index % 4 * 0.12;
    context.fillRect(x, y, 2 + index % 3, 4 + index % 4);
  }
  context.globalAlpha = 1;
}

function drawDesertBackground(dimension) {
  const sunGlow = context.createRadialGradient(170, 95, 10, 170, 95, 100);
  sunGlow.addColorStop(0, "#fff4b0");
  sunGlow.addColorStop(0.18, "#ffc46b");
  sunGlow.addColorStop(1, "#ffc46b00");
  context.fillStyle = sunGlow;
  context.beginPath();
  context.arc(170, 95, 100, 0, Math.PI * 2);
  context.fill();

  for (let dune = 0; dune < 3; dune += 1) {
    context.fillStyle = dune === 0 ? "#ad5b53" : dune === 1 ? "#824448" : "#5c3440";
    context.beginPath();
    context.moveTo(0, HORIZON_Y);
    for (let x = 0; x <= WIDTH; x += 32) {
      const y = 145 + dune * 22 + Math.sin(x * 0.009 + game.animationTime * (0.25 + dune * 0.1)) * (14 + dune * 7);
      context.lineTo(x, y);
    }
    context.lineTo(WIDTH, HORIZON_Y + 20);
    context.lineTo(0, HORIZON_Y + 20);
    context.closePath();
    context.fill();
  }

  for (let index = 0; index < 5; index += 1) {
    const x = 90 + index * 205;
    const baseY = HORIZON_Y - 8 - index % 2 * 20;
    context.strokeStyle = index % 2 === 0 ? "#69ba8b" : dimension.windows;
    context.lineWidth = 7;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(x, baseY);
    context.lineTo(x, baseY - 38);
    context.moveTo(x, baseY - 22);
    context.lineTo(x - 12, baseY - 32);
    context.lineTo(x - 12, baseY - 42);
    context.moveTo(x, baseY - 18);
    context.lineTo(x + 13, baseY - 28);
    context.lineTo(x + 13, baseY - 37);
    context.stroke();
  }
  context.lineCap = "butt";
}

function drawCosmicBackground(dimension) {
  const nebula = context.createRadialGradient(490, 106, 12, 490, 106, 310);
  nebula.addColorStop(0, "#7741ba88");
  nebula.addColorStop(0.55, "#45308755");
  nebula.addColorStop(1, "#090d2b00");
  context.fillStyle = nebula;
  context.fillRect(0, 0, WIDTH, HORIZON_Y + 20);

  for (let index = 0; index < 100; index += 1) {
    const x = (index * 137.5 + 13) % WIDTH;
    const y = (index * 67.7 + 11) % (HORIZON_Y + 24);
    const size = index % 12 === 0 ? 3 : 1 + index % 2;
    const twinkle = 0.35 + (Math.sin(game.animationTime * 2.4 + index) + 1) * 0.3;
    context.globalAlpha = twinkle;
    context.fillStyle = index % 12 === 0 ? dimension.windows : "#f4f4ff";
    context.fillRect(x, y, size, size);
  }
  context.globalAlpha = 1;

  for (let index = 0; index < 3; index += 1) {
    const x = (160 + index * 315 + Math.sin(game.animationTime * 0.15 + index) * 35) % WIDTH;
    const y = 65 + index % 2 * 70;
    const radius = 13 + index * 5;
    context.fillStyle = index === 1 ? "#ba76c7" : "#5279c9";
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = `${dimension.windows}bb`;
    context.lineWidth = 3;
    context.beginPath();
    context.ellipse(x, y, radius * 1.8, radius * 0.48, -0.3, 0, Math.PI * 2);
    context.stroke();
  }
}

function drawBackground() {
  const dimension = DIMENSIONS[game.dimensionIndex % DIMENSIONS.length];
  const sky = context.createLinearGradient(0, 0, 0, HEIGHT);
  sky.addColorStop(0, dimension.sky[0]);
  sky.addColorStop(0.62, dimension.sky[1]);
  sky.addColorStop(1, dimension.sky[2]);
  context.fillStyle = sky;
  context.fillRect(0, 0, WIDTH, HEIGHT);

  if (dimension.style === "city") drawCityBackground(dimension);
  if (dimension.style === "void") drawVoidBackground(dimension);
  if (dimension.style === "solar") drawSolarBackground(dimension);
  if (dimension.style === "aquatic") drawAquaticBackground(dimension);
  if (dimension.style === "forest") drawForestBackground(dimension);
  if (dimension.style === "machine") drawMachineBackground(dimension);
  if (dimension.style === "ice") drawIceBackground(dimension);
  if (dimension.style === "desert") drawDesertBackground(dimension);
  if (dimension.style === "cosmic") drawCosmicBackground(dimension);
  drawWorldGlow();
}

function drawWorldGlowColor(color, opacity, x, y, radius) {
  if (opacity <= 0) return;
  const glow = context.createRadialGradient(x, y, 0, x, y, radius);
  glow.addColorStop(0, `${color}66`);
  glow.addColorStop(0.38, `${color}66`);
  glow.addColorStop(1, `${color}00`);
  context.globalAlpha = opacity;
  context.fillStyle = glow;
  context.fillRect(0, 0, WIDTH, HORIZON_Y + 18);
  context.globalAlpha = 1;
}

function drawWorldGlow() {
  const current = DIMENSIONS[game.dimensionIndex % DIMENSIONS.length];
  const previous = DIMENSIONS[game.previousDimensionIndex % DIMENSIONS.length];
  const blend = game.dimensionBlendTime > 0
    ? 1 - game.dimensionBlendTime / 1.8
    : 1;
  const pulse = reducedEffects ? 0 : (Math.sin(game.animationTime * 1.7) + 1) * 0.5;
  const pace = game.state === "running" ? Math.min(1, game.elapsed / 75) : 0;
  const intensity = game.state === "running"
    ? 0.14 + pace * 0.07 + pulse * 0.05
    : 0.055;
  const centerX = WIDTH * (0.5 + (reducedEffects ? 0 : Math.sin(game.animationTime * 0.32) * 0.18));
  const centerY = 90 + (reducedEffects ? 0 : Math.cos(game.animationTime * 0.55) * 12);
  const radius = 390 + pace * 80;

  if (game.dimensionBlendTime > 0 && previous !== current) {
    drawWorldGlowColor(previous.windows, intensity * (1 - blend) * 0.72, centerX, centerY, radius);
    drawWorldGlowColor(current.windows, intensity * (0.35 + blend * 0.65), WIDTH - centerX, centerY + 18, radius);
    drawWorldGlowColor(current.lane, intensity * 0.42, centerX, centerY + 30, radius * 0.68);
    return;
  }
  drawWorldGlowColor(current.windows, intensity, centerX, centerY, radius);
  drawWorldGlowColor(current.lane, intensity * 0.52, WIDTH - centerX, centerY + 30, radius * 0.72);
}

function drawPlanes() {
  const dimension = DIMENSIONS[game.dimensionIndex % DIMENSIONS.length];
  for (let index = 0; index < 3; index += 1) {
    const speed = 42 + index * 19;
    const x = ((game.animationTime * speed + index * 330) % (WIDTH + 180)) - 90;
    const y = 54 + index * 43 + Math.sin(game.animationTime * 2 + index) * 7;
    const scale = 0.55 + index * 0.12;
    context.save();
    context.translate(x, y);
    context.scale(scale, scale);
    context.fillStyle = dimension.windows;
    context.shadowBlur = 9;
    context.shadowColor = dimension.windows;
    if (dimension.style === "city") {
      context.beginPath();
      context.moveTo(-25, 0);
      context.lineTo(-7, -3);
      context.lineTo(1, -12);
      context.lineTo(6, -12);
      context.lineTo(4, -3);
      context.lineTo(20, -1);
      context.lineTo(27, 2);
      context.lineTo(4, 3);
      context.lineTo(9, 10);
      context.lineTo(4, 10);
      context.lineTo(-5, 3);
      context.lineTo(-25, 2);
      context.closePath();
      context.fill();
      context.fillStyle = "#ff4fc8";
      context.fillRect(-3, -2, 6, 2);
    } else if (dimension.style === "void") {
      context.rotate(game.animationTime + index);
      context.beginPath();
      context.moveTo(0, -18);
      context.lineTo(7, -4);
      context.lineTo(18, 0);
      context.lineTo(7, 4);
      context.lineTo(0, 18);
      context.lineTo(-7, 4);
      context.lineTo(-18, 0);
      context.lineTo(-7, -4);
      context.closePath();
      context.fill();
      context.fillStyle = "#fff";
      context.beginPath();
      context.arc(0, 0, 3, 0, Math.PI * 2);
      context.fill();
    } else if (dimension.style === "solar") {
      context.rotate(-0.2);
      context.fillRect(-32, -2, 25, 4);
      context.beginPath();
      context.arc(0, 0, 8 + index * 2, 0, Math.PI * 2);
      context.fill();
      context.fillStyle = "#fff2a1";
      context.beginPath();
      context.arc(0, 0, 4 + index, 0, Math.PI * 2);
      context.fill();
    } else if (dimension.style === "aquatic") {
      context.beginPath();
      context.moveTo(-22, 0);
      context.quadraticCurveTo(-7, -17, 8, 0);
      context.quadraticCurveTo(-7, 17, -22, 0);
      context.fill();
      context.beginPath();
      context.moveTo(-5, 0);
      context.lineTo(10, -13);
      context.lineTo(8, 0);
      context.lineTo(10, 13);
      context.closePath();
      context.fill();
      context.fillStyle = "#083342";
      context.beginPath();
      context.arc(-12, -2, 2, 0, Math.PI * 2);
      context.fill();
    } else if (dimension.style === "forest") {
      context.rotate(Math.sin(game.animationTime + index) * 0.3);
      context.beginPath();
      context.moveTo(-25, 0);
      context.quadraticCurveTo(-2, -22, 24, 0);
      context.quadraticCurveTo(-2, 22, -25, 0);
      context.fill();
      context.strokeStyle = "#eaffbd";
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(-18, 0);
      context.lineTo(16, 0);
      context.stroke();
    } else if (dimension.style === "machine") {
      context.fillRect(-18, -9, 28, 17);
      context.fillRect(-11, -15, 14, 7);
      context.fillRect(-27, -4, 9, 3);
      context.fillRect(10, -3, 9, 3);
      context.fillStyle = "#1a2730";
      context.fillRect(-7, -6, 4, 4);
      context.fillStyle = "#ff684d";
      context.beginPath();
      context.arc(-3, 13 + Math.sin(game.animationTime * 10 + index) * 2, 3, 0, Math.PI * 2);
      context.fill();
    } else if (dimension.style === "ice") {
      context.strokeStyle = dimension.windows;
      context.lineWidth = 3;
      context.beginPath();
      context.moveTo(-17, 0);
      context.lineTo(17, 0);
      context.moveTo(0, -17);
      context.lineTo(0, 17);
      context.moveTo(-12, -12);
      context.lineTo(12, 12);
      context.moveTo(12, -12);
      context.lineTo(-12, 12);
      context.stroke();
    } else if (dimension.style === "desert") {
      context.beginPath();
      context.ellipse(0, 0, 21, 12, 0, 0, Math.PI * 2);
      context.fill();
      context.fillRect(-29, -7, 9, 14);
      context.fillRect(20, -7, 9, 14);
      context.strokeStyle = "#fff0bc";
      context.lineWidth = 2;
      context.beginPath();
      context.moveTo(-8, -8);
      context.lineTo(-15, -16);
      context.moveTo(8, -8);
      context.lineTo(15, -16);
      context.stroke();
    } else {
      context.rotate(Math.PI / 4);
      context.beginPath();
      context.moveTo(0, -20);
      context.lineTo(5, -5);
      context.lineTo(20, 0);
      context.lineTo(5, 5);
      context.lineTo(0, 20);
      context.lineTo(-5, 5);
      context.lineTo(-20, 0);
      context.lineTo(-5, -5);
      context.closePath();
      context.fill();
      context.fillStyle = "#fff";
      context.beginPath();
      context.arc(0, 0, 3, 0, Math.PI * 2);
      context.fill();
    }
    context.restore();
  }
}

function drawRoad() {
  const dimension = DIMENSIONS[game.dimensionIndex % DIMENSIONS.length];
  context.beginPath();
  context.moveTo(430, HORIZON_Y);
  context.lineTo(530, HORIZON_Y);
  context.lineTo(920, 475);
  context.lineTo(40, 475);
  context.closePath();
  context.fillStyle = dimension.road;
  context.fill();

  context.strokeStyle = `${dimension.windows}a8`;
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(430, HORIZON_Y);
  context.lineTo(40, 475);
  context.moveTo(530, HORIZON_Y);
  context.lineTo(920, 475);
  context.stroke();

  const dividerOffset = (game.animationTime * 0.62) % 0.22;
  context.lineWidth = 1;
  for (const bottomX of [390, 570]) {
    context.strokeStyle = `${dimension.lane}80`;
    for (let index = 0; index < 6; index += 1) {
      const progress = (index / 6 + dividerOffset) % 1;
      const y1 = HORIZON_Y + progress * (GROUND_Y - HORIZON_Y);
      const y2 = Math.min(GROUND_Y + 18, y1 + 8 + progress * 12);
      const x1 = 480 + (bottomX - 480) * progress;
      const nextProgress = Math.min(1, progress + (y2 - y1) / (GROUND_Y - HORIZON_Y));
      const x2 = 480 + (bottomX - 480) * nextProgress;
      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
    }
  }

  context.fillStyle = `${dimension.windows}1f`;
  context.fillRect(0, 475, WIDTH, HEIGHT - 475);
}

function drawPortal() {
  if (game.state !== "complete") return;

  const radiusX = 105 + Math.sin(game.animationTime * 4) * 5;
  const radiusY = 90 + Math.sin(game.animationTime * 4) * 4;
  const nextDimension = DIMENSIONS[game.level % DIMENSIONS.length];

  context.save();
  context.globalAlpha = 0.95;
  context.translate(480, HORIZON_Y + 64);
  context.shadowBlur = 28;
  context.shadowColor = nextDimension.windows;
  context.strokeStyle = nextDimension.windows;
  context.lineWidth = 6;
  context.beginPath();
  context.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
  context.stroke();
  context.strokeStyle = "#f4f4ff";
  context.lineWidth = 2;
  context.beginPath();
  context.ellipse(0, 0, radiusX - 10, radiusY - 9, game.animationTime * 0.3, 0, Math.PI * 2);
  context.stroke();

  const portalGlow = context.createRadialGradient(0, 0, 2, 0, 0, radiusX);
  portalGlow.addColorStop(0, `${nextDimension.windows}66`);
  portalGlow.addColorStop(1, `${nextDimension.windows}00`);
  context.fillStyle = portalGlow;
  context.beginPath();
  context.ellipse(0, 0, radiusX - 3, radiusY - 3, 0, 0, Math.PI * 2);
  context.fill();
  context.restore();
}

function drawChaser() {
  const dimension = DIMENSIONS[game.dimensionIndex % DIMENSIONS.length];
  const furious = game.rageTime > 0;
  const pulse = 1 + Math.sin(game.animationTime * (furious ? 13 : 5)) * (furious ? 0.15 : 0.06);
  const chaserColor = furious ? "#ff594f" : dimension.pursuer;
  context.save();
  context.translate(480 + (furious ? Math.sin(game.animationTime * 37) * 5 : 0), 215);
  context.scale(pulse, pulse);
  context.shadowBlur = 22;
  context.shadowColor = chaserColor;
  context.fillStyle = chaserColor;
  if (dimension.style === "city") {
    context.beginPath();
    context.moveTo(-27, 28);
    context.lineTo(-17, 1);
    context.lineTo(-8, -15);
    context.lineTo(8, -15);
    context.lineTo(18, 1);
    context.lineTo(28, 28);
    context.closePath();
    context.fill();
    context.fillStyle = "#190d2c";
    context.fillRect(-10, 4, 20, 6);
  } else if (dimension.style === "void") {
    context.beginPath();
    context.moveTo(0, -24);
    context.lineTo(12, -9);
    context.lineTo(25, 1);
    context.lineTo(16, 23);
    context.lineTo(0, 29);
    context.lineTo(-16, 23);
    context.lineTo(-25, 1);
    context.lineTo(-12, -9);
    context.closePath();
    context.fill();
    context.fillStyle = "#170d2c";
    context.beginPath();
    context.ellipse(0, 9, 15, 8, 0, 0, Math.PI * 2);
    context.fill();
  } else if (dimension.style === "cosmic") {
    context.beginPath();
    context.ellipse(0, 5, 25, 22, 0, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = chaserColor;
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(-14, -10);
    context.quadraticCurveTo(-22, -30, -12, -32);
    context.moveTo(14, -10);
    context.quadraticCurveTo(22, -30, 12, -32);
    context.stroke();
    context.fillStyle = "#171338";
    context.beginPath();
    context.ellipse(0, 10, 17, 10, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#fff";
    context.beginPath();
    context.arc(-8, 6, 4, 0, Math.PI * 2);
    context.arc(0, 2, 4, 0, Math.PI * 2);
    context.arc(8, 6, 4, 0, Math.PI * 2);
    context.fill();
  } else if (dimension.style === "solar") {
    context.beginPath();
    context.moveTo(-24, 26);
    context.quadraticCurveTo(-31, 5, -12, -5);
    context.lineTo(-5, -22);
    context.lineTo(5, -7);
    context.lineTo(15, -20);
    context.lineTo(14, -3);
    context.quadraticCurveTo(32, 11, 23, 26);
    context.closePath();
    context.fill();
    context.fillStyle = "#70222d";
    context.beginPath();
    context.arc(0, 8, 12, 0, Math.PI * 2);
    context.fill();
  } else if (dimension.style === "aquatic") {
    context.beginPath();
    context.moveTo(-27, -8);
    context.quadraticCurveTo(1, -22, 23, 0);
    context.quadraticCurveTo(2, 22, -27, 10);
    context.lineTo(-39, 20);
    context.lineTo(-36, 0);
    context.lineTo(-39, -18);
    context.closePath();
    context.fill();
    context.fillStyle = "#092633";
    context.beginPath();
    context.arc(12, -3, 3, 0, Math.PI * 2);
    context.fill();
  } else if (dimension.style === "forest") {
    context.beginPath();
    context.ellipse(0, 7, 22, 20, 0, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.moveTo(-20, -3);
    context.lineTo(-24, -23);
    context.lineTo(-5, -13);
    context.lineTo(0, -17);
    context.lineTo(6, -13);
    context.lineTo(24, -24);
    context.lineTo(20, -2);
    context.closePath();
    context.fill();
    context.fillStyle = "#2d1737";
    context.beginPath();
    context.arc(-8, 4, 3, 0, Math.PI * 2);
    context.arc(8, 4, 3, 0, Math.PI * 2);
    context.fill();
  } else if (dimension.style === "machine") {
    context.fillRect(-22, -16, 44, 43);
    context.fillStyle = "#26343b";
    context.fillRect(-15, -7, 30, 18);
    context.fillStyle = chaserColor;
    context.fillRect(-10, -1, 6, 5);
    context.fillRect(4, -1, 6, 5);
    context.fillRect(-28, -5, 7, 23);
    context.fillRect(21, -5, 7, 23);
    context.fillStyle = "#ffbd58";
    context.fillRect(-15, 22, 9, 7);
    context.fillRect(6, 22, 9, 7);
  } else if (dimension.style === "ice") {
    context.beginPath();
    context.ellipse(0, 6, 20, 24, 0, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.moveTo(-18, -10);
    context.lineTo(-21, -23);
    context.lineTo(-6, -16);
    context.lineTo(0, -27);
    context.lineTo(7, -16);
    context.lineTo(22, -23);
    context.lineTo(17, -8);
    context.closePath();
    context.fill();
    context.fillStyle = "#16334c";
    context.fillRect(-11, 0, 22, 8);
    context.fillStyle = "#fff";
    context.beginPath();
    context.moveTo(0, 7);
    context.lineTo(-4, 12);
    context.lineTo(4, 12);
    context.closePath();
    context.fill();
  } else if (dimension.style === "desert") {
    context.beginPath();
    context.ellipse(0, 6, 25, 18, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = chaserColor;
    context.beginPath();
    context.moveTo(-16, -2);
    context.lineTo(-22, -22);
    context.lineTo(-7, -15);
    context.lineTo(7, -15);
    context.lineTo(22, -22);
    context.lineTo(16, -2);
    context.closePath();
    context.fill();
    context.fillStyle = "#351a30";
    context.beginPath();
    context.ellipse(0, 10, 14, 5, 0, 0, Math.PI * 2);
    context.fill();
  } else {
    context.beginPath();
    context.ellipse(0, 5, 21, 22, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#ddd9ff";
    context.beginPath();
    context.ellipse(0, 4, 15, 14, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = chaserColor;
    context.beginPath();
    context.arc(-7, 3, 5, 0, Math.PI * 2);
    context.arc(7, 3, 5, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#19132f";
    context.beginPath();
    context.arc(-7, 3, 2, 0, Math.PI * 2);
    context.arc(7, 3, 2, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.moveTo(-12, -13);
    context.lineTo(-18, -25);
    context.lineTo(-3, -17);
    context.lineTo(0, -28);
    context.lineTo(4, -17);
    context.lineTo(19, -25);
    context.lineTo(13, -12);
    context.closePath();
    context.fill();
  }
  if (furious) {
    context.strokeStyle = "#fff4ee";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(-12, 1);
    context.lineTo(-4, 5);
    context.moveTo(12, 1);
    context.lineTo(4, 5);
    context.stroke();
  }
  context.restore();
}

function drawBoss() {
  if (game.bossState !== "active") return;
  const boss = BOSSES[game.level];
  const pulse = 1 + Math.sin(game.animationTime * 5) * 0.045;
  context.save();
  context.translate(480, HORIZON_Y + 92);
  context.scale(pulse, pulse);
  context.shadowBlur = 24;
  context.shadowColor = boss.color;
  context.fillStyle = boss.color;
  if (game.level === 3) {
    context.beginPath();
    context.moveTo(0, -37);
    context.lineTo(31, -8);
    context.lineTo(24, 26);
    context.lineTo(0, 38);
    context.lineTo(-24, 26);
    context.lineTo(-31, -8);
    context.closePath();
    context.fill();
    context.fillStyle = "#fff2a1";
    context.beginPath();
    context.arc(-11, 0, 5, 0, Math.PI * 2);
    context.arc(11, 0, 5, 0, Math.PI * 2);
    context.fill();
  } else if (game.level === 6) {
    context.fillRect(-31, -27, 62, 54);
    context.fillStyle = "#26343b";
    context.fillRect(-22, -15, 44, 24);
    context.fillStyle = "#ffbd58";
    context.fillRect(-15, -8, 8, 7);
    context.fillRect(7, -8, 8, 7);
    context.fillRect(-40, -8, 9, 25);
    context.fillRect(31, -8, 9, 25);
  } else {
    context.beginPath();
    context.ellipse(0, 3, 32, 27, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#171338";
    context.beginPath();
    context.ellipse(0, 7, 23, 16, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#fff";
    for (const eyeX of [-13, 0, 13]) {
      context.beginPath();
      context.arc(eyeX, 4, 5, 0, Math.PI * 2);
      context.fill();
    }
    context.fillStyle = boss.color;
    context.beginPath();
    context.moveTo(-20, -17);
    context.lineTo(-32, -38);
    context.lineTo(-7, -23);
    context.lineTo(0, -43);
    context.lineTo(8, -23);
    context.lineTo(32, -37);
    context.lineTo(21, -16);
    context.closePath();
    context.fill();
  }
  context.restore();
}

function drawObstacle(obstacle) {
  const dimension = DIMENSIONS[game.dimensionIndex % DIMENSIONS.length];
  const progress = Math.min(1, obstacle.progress);
  const scale = 0.24 + progress * 0.76;
  const x = projectLane(obstacle.lane, progress);
  const y = projectY(progress);
  const width = (obstacle.type === "crate" ? 42 : 66) * scale;
  const accent = dimension.windows;
  context.save();
  if (["crate", "root", "meteor"].includes(obstacle.type)) {
    const height = 49 * scale;
    context.shadowBlur = 16 * scale;
    context.shadowColor = dimension.style === "city" ? "#ff4fc8" : accent;
    context.fillStyle = dimension.style === "city" ? "#ff4fc8" : `${accent}cc`;
    if (obstacle.type === "meteor") {
      context.fillStyle = "#ff6742";
      context.beginPath();
      context.arc(x, y - height * 0.48, height * 0.38, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "#ffe66d";
      context.lineWidth = 3 * scale;
      context.beginPath();
      context.moveTo(x - width * 0.1, y - height * 0.65);
      context.lineTo(x - width * 0.46, y - height * 0.92);
      context.stroke();
    } else if (obstacle.type === "root") {
      context.fillStyle = "#65f0b5";
      context.lineWidth = 5 * scale;
      context.lineCap = "round";
      for (let root = -1; root <= 1; root += 1) {
        context.beginPath();
        context.moveTo(x + root * width * 0.22, y);
        context.quadraticCurveTo(x + root * width * 0.3, y - height * 0.55, x + root * width * 0.2, y - height);
        context.stroke();
      }
      context.lineCap = "butt";
    } else if (dimension.style === "city") {
      context.fillRect(x - width / 2, y - height, width, height);
      context.fillStyle = "#ffd1f2";
      context.fillRect(x - width / 2 + width * 0.2, y - height + height * 0.18, 3 * scale, height * 0.64);
    } else if (dimension.style === "void") {
      context.beginPath();
      context.moveTo(x, y - height * 1.15);
      context.lineTo(x + width * 0.58, y - height * 0.55);
      context.lineTo(x + width * 0.4, y);
      context.lineTo(x - width * 0.4, y);
      context.lineTo(x - width * 0.58, y - height * 0.55);
      context.closePath();
      context.fill();
      context.strokeStyle = "#f4eaff";
      context.lineWidth = 2 * scale;
      context.beginPath();
      context.moveTo(x, y - height * 0.88);
      context.lineTo(x - width * 0.12, y - height * 0.2);
      context.stroke();
    } else if (dimension.style === "solar") {
      context.fillStyle = "#c6422d";
      context.beginPath();
      context.arc(x, y - height * 0.48, height * 0.48, 0, Math.PI * 2);
      context.fill();
      context.strokeStyle = "#ffb65c";
      context.lineWidth = 3 * scale;
      context.beginPath();
      context.moveTo(x - width * 0.2, y - height * 0.78);
      context.lineTo(x + width * 0.08, y - height * 0.54);
      context.lineTo(x - width * 0.06, y - height * 0.18);
      context.stroke();
      context.fillStyle = "#ffe66d";
      context.fillRect(x - width * 0.5, y - 3 * scale, width, 3 * scale);
    } else if (dimension.style === "forest") {
      context.fillStyle = "#39a875";
      context.beginPath();
      context.moveTo(x, y - height * 1.1);
      context.lineTo(x + width * 0.43, y - height * 0.47);
      context.lineTo(x + width * 0.3, y);
      context.lineTo(x - width * 0.3, y);
      context.lineTo(x - width * 0.43, y - height * 0.47);
      context.closePath();
      context.fill();
      context.fillStyle = "#caff87";
      context.beginPath();
      context.moveTo(x, y - height * 0.9);
      context.lineTo(x + width * 0.08, y - height * 0.42);
      context.lineTo(x - width * 0.08, y - height * 0.34);
      context.closePath();
      context.fill();
    } else if (dimension.style === "machine") {
      context.fillStyle = "#586a70";
      context.fillRect(x - width / 2, y - height, width, height);
      context.strokeStyle = "#ffbd58";
      context.lineWidth = 3 * scale;
      context.strokeRect(x - width / 2 + 3 * scale, y - height + 3 * scale, width - 6 * scale, height - 6 * scale);
      context.fillStyle = "#28363d";
      context.fillRect(x - width * 0.28, y - height * 0.68, width * 0.56, height * 0.36);
      context.fillStyle = "#ff684d";
      context.beginPath();
      context.arc(x, y - height * 0.5, 3 * scale, 0, Math.PI * 2);
      context.fill();
    } else if (dimension.style === "ice") {
      context.fillStyle = "#88deef";
      context.beginPath();
      context.moveTo(x, y - height * 1.2);
      context.lineTo(x + width * 0.5, y - height * 0.45);
      context.lineTo(x + width * 0.35, y);
      context.lineTo(x - width * 0.35, y);
      context.lineTo(x - width * 0.5, y - height * 0.45);
      context.closePath();
      context.fill();
      context.strokeStyle = "#e4ffff";
      context.lineWidth = 2 * scale;
      context.beginPath();
      context.moveTo(x, y - height * 1.05);
      context.lineTo(x - width * 0.08, y - height * 0.18);
      context.stroke();
    } else if (dimension.style === "desert") {
      context.fillStyle = "#43a76a";
      context.fillRect(x - 5 * scale, y - height, 10 * scale, height);
      context.fillRect(x - width * 0.42, y - height * 0.72, width * 0.2, 7 * scale);
      context.fillRect(x - width * 0.42, y - height * 0.72, 7 * scale, height * 0.25);
      context.fillRect(x + width * 0.22, y - height * 0.48, width * 0.2, 7 * scale);
      context.fillRect(x + width * 0.34, y - height * 0.68, 7 * scale, height * 0.22);
      context.fillStyle = "#d8a36a";
      context.fillRect(x - width * 0.5, y - 3 * scale, width, 3 * scale);
    } else if (dimension.style === "cosmic") {
      context.fillStyle = "#7562ae";
      context.beginPath();
      context.moveTo(x - width * 0.5, y - height * 0.35);
      context.lineTo(x - width * 0.25, y - height * 0.88);
      context.lineTo(x + width * 0.1, y - height);
      context.lineTo(x + width * 0.5, y - height * 0.55);
      context.lineTo(x + width * 0.4, y - height * 0.08);
      context.lineTo(x - width * 0.3, y);
      context.closePath();
      context.fill();
      context.fillStyle = "#b9a2ff";
      context.beginPath();
      context.arc(x - width * 0.12, y - height * 0.55, 3 * scale, 0, Math.PI * 2);
      context.fill();
    } else {
      context.fillStyle = "#18a98c";
      context.fillRect(x - width * 0.44, y - height * 0.2, width * 0.88, height * 0.2);
      context.strokeStyle = "#65f0b5";
      context.lineWidth = 5 * scale;
      context.lineCap = "round";
      for (let branch = 0; branch < 4; branch += 1) {
        const branchX = x + (branch - 1.5) * width * 0.2;
        context.beginPath();
        context.moveTo(branchX, y - height * 0.15);
        context.quadraticCurveTo(branchX + (branch - 1) * 5 * scale, y - height * 0.6, branchX, y - height * (0.65 + branch % 2 * 0.2));
        context.stroke();
      }
      context.lineCap = "butt";
    }
    context.fillStyle = "#ffffff";
    context.font = `${Math.max(9, 17 * scale)}px monospace`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("↑", x, y - height / 2);
  } else {
    const beamY = y - 66 * scale;
    context.shadowBlur = 17 * scale;
    context.shadowColor = dimension.style === "city" ? "#ffe66d" : accent;
    context.fillStyle = dimension.style === "city" ? "#ffe66d" : accent;
    if (dimension.style === "city") {
      context.fillRect(x - width / 2, beamY, width, 12 * scale);
      context.fillRect(x - width / 2 + 3 * scale, beamY, 4 * scale, 25 * scale);
      context.fillRect(x + width / 2 - 7 * scale, beamY, 4 * scale, 25 * scale);
    } else if (dimension.style === "void") {
      context.strokeStyle = `${accent}bb`;
      context.lineWidth = 3 * scale;
      context.beginPath();
      context.ellipse(x, beamY + 10 * scale, width * 0.48, 18 * scale, 0, 0, Math.PI * 2);
      context.ellipse(x, beamY + 10 * scale, width * 0.28, 10 * scale, 0, 0, Math.PI * 2);
      context.stroke();
      context.fillRect(x - width / 2, beamY + 7 * scale, width, 5 * scale);
    } else if (dimension.style === "solar") {
      context.fillStyle = "#ff6742";
      context.fillRect(x - width / 2, beamY + 13 * scale, width, 5 * scale);
      for (let flame = 0; flame < 6; flame += 1) {
        const flameX = x - width / 2 + (flame + 0.5) * width / 6;
        context.beginPath();
        context.moveTo(flameX - 4 * scale, beamY + 15 * scale);
        context.quadraticCurveTo(flameX - 8 * scale, beamY - 5 * scale, flameX, beamY + 3 * scale);
        context.quadraticCurveTo(flameX + 8 * scale, beamY - 4 * scale, flameX + 4 * scale, beamY + 15 * scale);
        context.fill();
      }
    } else if (dimension.style === "forest") {
      context.strokeStyle = "#65f0b5";
      context.lineWidth = 5 * scale;
      context.lineCap = "round";
      context.beginPath();
      context.moveTo(x - width / 2, beamY + 13 * scale);
      context.quadraticCurveTo(x - width * 0.25, beamY - 5 * scale, x, beamY + 13 * scale);
      context.quadraticCurveTo(x + width * 0.25, beamY + 29 * scale, x + width / 2, beamY + 10 * scale);
      context.stroke();
      context.lineCap = "butt";
      context.fillStyle = "#d2ff74";
      for (let thorn = 0; thorn < 5; thorn += 1) {
        const thornX = x - width * 0.4 + thorn * width * 0.2;
        context.beginPath();
        context.moveTo(thornX - 4 * scale, beamY + 4 * scale);
        context.lineTo(thornX, beamY - 6 * scale);
        context.lineTo(thornX + 4 * scale, beamY + 4 * scale);
        context.fill();
      }
    } else if (dimension.style === "machine") {
      context.fillStyle = "#ffbd58";
      context.fillRect(x - width / 2, beamY + 10 * scale, width, 7 * scale);
      context.fillStyle = "#34464e";
      context.fillRect(x - width / 2, beamY + 17 * scale, 7 * scale, 20 * scale);
      context.fillRect(x + width / 2 - 7 * scale, beamY + 17 * scale, 7 * scale, 20 * scale);
      context.strokeStyle = "#ffe2a0";
      context.lineWidth = 2 * scale;
      for (let stripe = 0; stripe < 5; stripe += 1) {
        const stripeX = x - width * 0.38 + stripe * width * 0.19;
        context.beginPath();
        context.moveTo(stripeX - 3 * scale, beamY + 10 * scale);
        context.lineTo(stripeX + 3 * scale, beamY + 17 * scale);
        context.stroke();
      }
    } else if (dimension.style === "ice") {
      context.fillStyle = "#a9f5ff";
      context.beginPath();
      context.moveTo(x - width / 2, beamY);
      context.lineTo(x + width / 2, beamY);
      context.lineTo(x + width / 2, beamY + 7 * scale);
      for (let spike = 5; spike >= 0; spike -= 1) {
        const spikeX = x - width * 0.4 + spike * width * 0.16;
        context.lineTo(spikeX + width * 0.08, beamY + 7 * scale);
        context.lineTo(spikeX + width * 0.04, beamY + (18 + spike % 2 * 8) * scale);
        context.lineTo(spikeX, beamY + 7 * scale);
      }
      context.closePath();
      context.fill();
    } else if (dimension.style === "desert") {
      context.fillStyle = "#ff865f";
      context.beginPath();
      context.moveTo(x - width / 2, beamY + 16 * scale);
      context.quadraticCurveTo(x - width * 0.25, beamY - 4 * scale, x, beamY + 15 * scale);
      context.quadraticCurveTo(x + width * 0.25, beamY + 34 * scale, x + width / 2, beamY + 12 * scale);
      context.lineTo(x + width / 2, beamY + 21 * scale);
      context.quadraticCurveTo(x + width * 0.25, beamY + 39 * scale, x, beamY + 24 * scale);
      context.quadraticCurveTo(x - width * 0.25, beamY + 8 * scale, x - width / 2, beamY + 26 * scale);
      context.closePath();
      context.fill();
    } else if (dimension.style === "cosmic") {
      context.strokeStyle = `${accent}dd`;
      context.lineWidth = 4 * scale;
      context.beginPath();
      context.ellipse(x, beamY + 17 * scale, width * 0.48, 17 * scale, 0, Math.PI, Math.PI * 2);
      context.stroke();
      context.fillStyle = "#f18bff";
      context.fillRect(x - width / 2, beamY + 14 * scale, width, 5 * scale);
      context.strokeStyle = "#fff";
      context.lineWidth = 2 * scale;
      context.beginPath();
      context.ellipse(x, beamY + 17 * scale, width * 0.28, 8 * scale, 0, Math.PI, Math.PI * 2);
      context.stroke();
    } else {
      context.strokeStyle = "#57e5be";
      context.lineWidth = 5 * scale;
      context.beginPath();
      for (let strand = 0; strand < 5; strand += 1) {
        const strandX = x - width * 0.42 + strand * width * 0.21;
        context.moveTo(strandX, beamY - 12 * scale);
        context.quadraticCurveTo(strandX - 6 * scale, beamY + 5 * scale, strandX + 2 * scale, beamY + 22 * scale);
      }
      context.stroke();
      context.fillStyle = `${accent}aa`;
      context.fillRect(x - width / 2, beamY + 17 * scale, width, 3 * scale);
    }
    context.fillStyle = "#fff8d6";
    context.font = `${Math.max(9, 16 * scale)}px monospace`;
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("↓", x, beamY - 10 * scale);
  }
  context.restore();
}

function drawCoin(coin) {
  const progress = Math.min(1, coin.progress);
  const x = projectLane(coin.lane, progress);
  const y = projectY(progress) - 25 * progress;
  const radius = 4 + progress * 8;
  context.save();
  context.shadowBlur = 14;
  context.shadowColor = "#ffe66d";
  context.strokeStyle = "#ffe66d";
  context.lineWidth = 3 * (0.5 + progress * 0.5);
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.stroke();
  context.restore();
}

function drawPowerup(powerup) {
  const progress = Math.min(1, powerup.progress);
  const x = projectLane(powerup.lane, progress);
  const y = projectY(progress) - 35 * progress;
  const radius = 7 + progress * 8;
  const color = powerupColor(powerup.type);
  const icon = powerup.type === "shield" ? "S" : powerup.type === "magnet" ? "M" : "T";
  context.save();
  context.shadowBlur = 18;
  context.shadowColor = color;
  context.fillStyle = `${color}33`;
  context.strokeStyle = color;
  context.lineWidth = 2;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
  context.stroke();
  context.fillStyle = "#f4f4ff";
  context.font = `${Math.max(9, 12 * (0.5 + progress * 0.5))}px sans-serif`;
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillText(icon, x, y);
  context.restore();
}

function drawShots() {
  for (const shot of game.shots) {
    const progress = Math.min(1, shot.progress);
    const x = projectLane(shot.lane, progress);
    const y = projectY(progress) - 17 * progress;
    const radius = 4 + progress * (shot.rage ? 9 : 7);
    const color = shot.rage ? "#ff594f" : "#ff784f";
    context.save();
    context.shadowBlur = shot.rage ? 24 : 18;
    context.shadowColor = color;
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
    context.restore();
  }
}

function drawPlayer() {
  if (!reducedEffects && game.invulnerability > 0 && Math.floor(game.invulnerability * 13) % 2 === 0) return;

  const dimension = DIMENSIONS[game.dimensionIndex % DIMENSIONS.length];
  const sliding = game.slideTime > 0;
  const height = sliding ? 23 : 46;
  const width = sliding ? 49 : 36;
  const x = game.playerX - width / 2;
  const y = GROUND_Y - height - jumpOffset();
  const run = Math.sin(game.animationTime * 16) * 3;

  context.save();
  context.globalAlpha = Math.max(0.16, 0.5 - jumpOffset() / 280);
  context.fillStyle = "#050610";
  context.beginPath();
  context.ellipse(game.playerX, GROUND_Y + 3, width * (1 - jumpOffset() / 220), 6, 0, 0, Math.PI * 2);
  context.fill();
  context.globalAlpha = 1;
  if (game.shieldTime > 0) {
    context.strokeStyle = "rgba(84, 246, 236, 0.82)";
    context.lineWidth = 2;
    context.shadowBlur = 17;
    context.shadowColor = "#54f6ec";
    context.beginPath();
    context.ellipse(game.playerX, y + height / 2, width * 0.85, height * 0.85, 0, 0, Math.PI * 2);
    context.stroke();
  }

  context.shadowBlur = 20;
  const selectedSkin = SKINS.find((skin) => skin.key === economy.activeSkin);
  const playerColor = game.hitFlash > 0
    ? "#ff4fc8"
    : game.turboTime > 0
      ? "#ffe66d"
      : selectedSkin?.color ?? dimension.runner;
  context.shadowColor = playerColor;
  context.fillStyle = playerColor;
  if (dimension.style === "city") {
    context.fillRect(x + 5, y + 8, width - 10, height - 11);
    context.fillStyle = "#f5f7ff";
    context.fillRect(x + 9, y, width - 18, 14);
    context.fillStyle = "#18213c";
    context.fillRect(x + 20, y + 4, 8, 4);
    context.fillStyle = "#ff4fc8";
    context.fillRect(x + 4, y + 18, 5, 14);
  } else if (dimension.style === "void") {
    context.beginPath();
    context.moveTo(game.playerX, y);
    context.quadraticCurveTo(x + width, y + height * 0.2, x + width * 0.66, y + height * 0.72);
    context.quadraticCurveTo(game.playerX, y + height * 1.08, x + width * 0.34, y + height * 0.72);
    context.quadraticCurveTo(x, y + height * 0.2, game.playerX, y);
    context.fill();
    context.fillStyle = "#181229";
    context.beginPath();
    context.ellipse(game.playerX + 6, y + 17, 3, 5, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = dimension.windows;
    for (let star = 0; star < 3; star += 1) {
      context.fillRect(x + 7 + star * 11, y + 27 + star % 2 * 6, 2, 2);
    }
  } else if (dimension.style === "cosmic") {
    context.fillStyle = "#dce6ff";
    context.beginPath();
    context.ellipse(game.playerX, y + 17, 15, 16, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#4d62a1";
    context.fillRect(game.playerX - 10, y + 29, 20, 14);
    context.fillStyle = "#111a3d";
    context.beginPath();
    context.ellipse(game.playerX + 4, y + 16, 9, 7, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#9cecff";
    context.beginPath();
    context.ellipse(game.playerX + 5, y + 15, 6, 4, -0.2, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#ffca70";
    context.fillRect(game.playerX - 3, y + 32, 6, 4);
  } else if (dimension.style === "solar") {
    context.beginPath();
    context.moveTo(game.playerX - 10, y + height);
    context.quadraticCurveTo(x - 4, y + 20, game.playerX, y + 7);
    context.quadraticCurveTo(x + width + 5, y + 22, game.playerX + 10, y + height);
    context.closePath();
    context.fill();
    context.fillStyle = "#ffd1a0";
    context.beginPath();
    context.arc(game.playerX + 5, y + 14, 9, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#382039";
    context.fillRect(game.playerX + 7, y + 12, 4, 3);
  } else if (dimension.style === "aquatic") {
    context.beginPath();
    context.ellipse(game.playerX - 2, y + height * 0.53, width * 0.42, height * 0.38, 0, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.moveTo(game.playerX - 14, y + height * 0.5);
    context.lineTo(x - 3, y + height * 0.2);
    context.lineTo(x - 3, y + height * 0.82);
    context.closePath();
    context.fill();
    context.fillStyle = "#092633";
    context.beginPath();
    context.arc(game.playerX + 7, y + height * 0.4, 2, 0, Math.PI * 2);
    context.fill();
  } else if (dimension.style === "forest") {
    context.beginPath();
    context.ellipse(game.playerX, y + height * 0.58, width * 0.4, height * 0.37, 0, 0, Math.PI * 2);
    context.fill();
    context.beginPath();
    context.moveTo(game.playerX - 12, y + 18);
    context.lineTo(game.playerX - 16, y + 2);
    context.lineTo(game.playerX - 3, y + 11);
    context.lineTo(game.playerX + 5, y + 6);
    context.lineTo(game.playerX + 16, y + 1);
    context.lineTo(game.playerX + 12, y + 19);
    context.closePath();
    context.fill();
    context.fillStyle = "#14351f";
    context.fillRect(game.playerX + 4, y + 23, 3, 3);
  } else if (dimension.style === "machine") {
    context.fillRect(x + 4, y + 10, width - 8, height - 12);
    context.fillStyle = "#34464e";
    context.fillRect(x + 8, y + 2, width - 16, 15);
    context.fillStyle = "#182832";
    context.fillRect(x + 21, y + 8, 8, 4);
    context.fillStyle = "#54f6ec";
    context.fillRect(x + 1, y + 19, 5, 8);
    context.fillRect(x + width - 6, y + 19, 5, 8);
  } else if (dimension.style === "ice") {
    context.beginPath();
    context.ellipse(game.playerX, y + height * 0.56, width * 0.43, height * 0.43, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#f4faff";
    context.beginPath();
    context.ellipse(game.playerX + 4, y + 17, 10, 9, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#ffb65c";
    context.beginPath();
    context.moveTo(game.playerX + 9, y + 17);
    context.lineTo(game.playerX + 19, y + 20);
    context.lineTo(game.playerX + 9, y + 22);
    context.closePath();
    context.fill();
  } else if (dimension.style === "desert") {
    context.fillRect(x + 4, y + 12, width - 8, height - 14);
    context.fillStyle = "#f5e1c0";
    context.beginPath();
    context.arc(game.playerX, y + 9, 12, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#6b3542";
    context.fillRect(game.playerX - 11, y + 6, 23, 5);
    context.fillStyle = "#2a273c";
    context.fillRect(game.playerX + 5, y + 12, 3, 3);
  } else {
    context.fillStyle = "#363f75";
    context.fillRect(x + 6, y + 17, width - 12, height - 18);
    context.fillStyle = "#d7dcff";
    context.beginPath();
    context.ellipse(game.playerX, y + 15, 13, 14, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#342c66";
    context.beginPath();
    context.ellipse(game.playerX + 4, y + 14, 7, 6, 0, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = "#f3a5ff";
    context.beginPath();
    context.arc(game.playerX - 7, y + 12, 2, 0, Math.PI * 2);
    context.arc(game.playerX, y + 9, 2, 0, Math.PI * 2);
    context.fill();
  }
  if (!sliding) {
    context.fillStyle = playerColor;
    context.fillRect(x + 3, y + height - 1, 10, 5 + run);
    context.fillRect(x + width - 13, y + height - 1, 10, 5 - run);
  }
  context.restore();
}

function drawParticles() {
  for (const particle of game.particles) {
    context.globalAlpha = Math.min(1, particle.life * 3);
    context.fillStyle = particle.color;
    context.fillRect(particle.x, particle.y, 3, 3);
  }
  context.globalAlpha = 1;
}

function drawHud() {
  const infinite = game.mode === "infinite";
  const objective = infinite ? null : currentObjective();
  const objectiveValue = !infinite && objective.type === "distance"
    ? Math.floor(game.levelObjectiveProgress)
    : game.levelObjectiveProgress;
  context.fillStyle = "#f4f4ff";
  context.font = "500 15px monospace";
  context.textAlign = "left";
  context.fillText(game.score.toString().padStart(4, "0"), 35, 38);
  context.fillStyle = "#aaa9c3";
  context.font = "10px monospace";
  context.fillText("PUNTOS", 36, 54);

  context.textAlign = "center";
  context.fillStyle = "#f4f4ff";
  context.font = "500 12px monospace";
  context.fillText(
    infinite ? "CARRERA INFINITA" : `NIVEL ${game.level} · ${objective.label}`,
    WIDTH / 2,
    34,
  );
  context.fillStyle = "#c4c3d8";
  context.font = "9px monospace";
  context.fillText(
    infinite
      ? `MUNDO ${DIMENSIONS[game.dimensionIndex].name} · SIN LÍMITE`
      : `${objectiveValue}/${objective.target} ${objective.unit}`,
    WIDTH / 2,
    52,
  );
  if (!infinite) {
    context.fillStyle = "rgba(255, 255, 255, 0.16)";
    context.fillRect(WIDTH / 2 - 64, 61, 128, 4);
    context.fillStyle = "#ffe66d";
    context.fillRect(
      WIDTH / 2 - 64,
      61,
      128 * Math.min(1, game.levelObjectiveProgress / objective.target),
      4,
    );
  }
  if (game.bossState === "active") {
    const boss = BOSSES[game.level];
    context.textAlign = "center";
    context.fillStyle = boss.color;
    context.font = "bold 10px monospace";
    context.fillText(`${boss.name} · ${game.bossHealth}/3`, WIDTH / 2, 110);
    context.fillStyle = "rgba(255,255,255,0.2)";
    context.fillRect(WIDTH / 2 - 60, 117, 120, 4);
    context.fillStyle = boss.color;
    context.fillRect(WIDTH / 2 - 60, 117, 120 * game.bossHealth / 3, 4);
  }

  context.textAlign = "left";
  context.fillStyle = "#ffe66d";
  context.font = "500 14px monospace";
  context.fillText(`● ${game.coins}`, 35, 82);
  context.fillStyle = "#ff4fc8";
  context.fillText(`♥ ${game.lives}`, 35, 108);
  context.fillStyle = "#ffe66d";
  context.font = "10px monospace";
  context.fillText(`BANCO ${economy.coins}`, 35, 128);

  context.textAlign = "right";
  context.font = "10px monospace";
  if (game.shieldTime > 0) {
    context.fillStyle = "#54f6ec";
    context.fillText(`ESCUDO ${Math.ceil(game.shieldTime)}s`, WIDTH - 34, 36);
  }
  if (game.magnetTime > 0) {
    context.fillStyle = "#ffe66d";
    context.fillText(`IMÁN ${Math.ceil(game.magnetTime)}s`, WIDTH - 34, 52);
  }
  if (game.turboTime > 0) {
    context.fillStyle = "#ff4fc8";
    context.fillText(`TURBO x2 ${Math.ceil(game.turboTime)}s`, WIDTH - 34, 68);
  }
  context.fillStyle = game.rageTime > 0 ? "#ff594f" : "#c4c3d8";
  context.font = "bold 9px monospace";
  context.fillText(
    game.rageTime > 0
      ? `¡RABIA! ${game.rageShotsRemaining} DISPAROS`
      : `RABIA EN ${Math.max(0, Math.ceil(game.nextRageAt - game.elapsed))}s`,
    WIDTH - 34,
    88,
  );

  if (game.mechanicState !== "idle") {
    const mechanic = currentWorldMechanic();
    context.textAlign = "center";
    context.font = "bold 10px monospace";
    context.fillStyle = game.mechanicState === "warning" ? "#ffe66d" : DIMENSIONS[game.dimensionIndex].windows;
    const label = game.mechanicState === "warning"
      ? `${mechanic.warning} · ${Math.ceil(game.mechanicTimer)}`
      : `${mechanic.title} · ${Math.ceil(game.mechanicTimer)}s`;
    context.fillText(label, WIDTH / 2, 84);
  }

  if (game.feedbackTime > 0) {
    context.globalAlpha = Math.min(1, game.feedbackTime * 2);
    context.fillStyle = game.feedbackColor;
    context.shadowBlur = 18;
    context.shadowColor = game.feedbackColor;
    context.font = "bold 18px monospace";
    context.textAlign = "center";
    context.fillText(game.feedbackText, WIDTH / 2, 92);
    context.globalAlpha = 1;
    context.shadowBlur = 0;
  }
}

function draw() {
  context.clearRect(0, 0, WIDTH, HEIGHT);
  drawBackground();
  drawPlanes();
  drawRoad();
  drawPortal();
  drawChaser();
  drawBoss();
  for (const coin of game.coinsOnRoad) drawCoin(coin);
  for (const powerup of game.powerups) drawPowerup(powerup);
  for (const obstacle of game.obstacles) drawObstacle(obstacle);
  drawShots();
  drawParticles();
  drawPlayer();
  drawHud();
}

function frame(timestamp) {
  const delta = game.lastTime === 0 ? 0 : Math.min((timestamp - game.lastTime) / 1000, 0.035);
  game.lastTime = timestamp;
  game.animationTime += delta * (reducedEffects ? 0.35 : 1);
  update(delta);
  draw();
  requestAnimationFrame(frame);
}

actionButton.addEventListener("click", () => {
  if (game.state === "paused") {
    togglePause();
  } else if (game.state === "complete") {
    startGame(game.level < LEVELS.length ? game.level + 1 : game.level);
  } else if (game.state === "over") {
    if (game.mode === "infinite") startInfiniteRun();
    else startGame(game.level);
  } else {
    startGame(game.selectedLevel);
  }
});
secondaryAction.addEventListener("click", showLevelMenu);
startLevelButton.addEventListener("click", () => startGame(game.selectedLevel));
infiniteModeButton.addEventListener("click", startInfiniteRun);
for (const card of levelCards) {
  card.addEventListener("click", () => selectLevel(Number(card.dataset.level)));
}
for (const button of document.querySelectorAll(".upgrade-buy")) {
  button.addEventListener("click", () => buyUpgrade(button.dataset.buyUpgrade));
}
for (const button of document.querySelectorAll(".cosmetic-select")) {
  button.addEventListener("click", () => buyOrEquipSkin(button.dataset.selectSkin));
}
for (const button of bindingButtons) {
  button.addEventListener("click", () => {
    bindingAction = button.dataset.bindAction;
    bindingStatus.textContent = `Pulsa una tecla para ${button.dataset.label.toLowerCase()} (Esc para cancelar).`;
  });
}
document.querySelector("#reset-controls").addEventListener("click", () => {
  customBindings = {};
  if (saveCustomBindings()) bindingStatus.textContent = "Controles originales restablecidos.";
});
reducedEffectsButton.addEventListener("click", () => {
  reducedEffects = !reducedEffects;
  updateReducedEffectsButton();
  try {
    window.localStorage.setItem(REDUCED_EFFECTS_KEY, String(reducedEffects));
  } catch (error) {
    bindingStatus.textContent = "NO SE PUDO GUARDAR ESTA PREFERENCIA";
    console.error("No se pudo guardar la preferencia de efectos reducidos.", error);
  }
});
controlsSettingsButton.addEventListener("click", () => controlsDialog.showModal());
closeControlsButton.addEventListener("click", () => controlsDialog.close());
controlsDialog.addEventListener("close", () => {
  bindingAction = null;
});
pauseButton.addEventListener("click", togglePause);
audioButton.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  if (soundEnabled) {
    initializeAudio();
    if (masterGain && audioContext) {
      masterGain.gain.setTargetAtTime(0.18, audioContext.currentTime, 0.04);
    }
  } else if (masterGain && audioContext) {
    masterGain.gain.setTargetAtTime(0, audioContext.currentTime, 0.04);
  }
  updateAudioButton();
});
vibrationButton.addEventListener("click", () => {
  vibrationEnabled = !vibrationEnabled;
  updateVibrationButton();
});
instructionsButton.addEventListener("click", () => {
  game.helpReturnState = game.state;
  if (game.state === "running") {
    game.state = "paused";
    pauseButton.textContent = "CONTINUAR";
  }
  helpDialog.showModal();
});
closeHelpButton.addEventListener("click", () => helpDialog.close());
helpDialog.addEventListener("close", () => {
  if (game.helpReturnState === "running") {
    game.state = "running";
    pauseButton.textContent = "PAUSAR";
  } else if (game.helpReturnState === "paused") {
    game.state = "paused";
    pauseButton.textContent = "CONTINUAR";
  }
});

for (const button of touchButtons) {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    performAction(button.dataset.action);
  });
}

document.addEventListener("keydown", (event) => {
  if (bindingAction) {
    event.preventDefault();
    if (event.code === "Escape") {
      bindingAction = null;
      bindingStatus.textContent = "Asignación cancelada.";
      return;
    }
    if (!/^(Arrow(Left|Right|Up|Down)|Space|Key[A-Z]|Digit[0-9])$/.test(event.code)) {
      bindingStatus.textContent = "Elige una flecha, espacio, letra o número.";
      return;
    }
    const conflictingAction = Object.keys(customBindings).find((action) =>
      action !== bindingAction && customBindings[action] === event.code,
    );
    if (conflictingAction) {
      bindingStatus.textContent = "Esa tecla ya está asignada a otra acción.";
      return;
    }
    customBindings[bindingAction] = event.code;
    const actionLabel = bindingButtons.length > 0
      ? [...bindingButtons].find((button) => button.dataset.bindAction === bindingAction)?.dataset.label
      : bindingAction;
    if (saveCustomBindings()) {
      bindingStatus.textContent = `${actionLabel} asignado a ${event.code.replace("Arrow", "")}.`;
      bindingAction = null;
    }
    return;
  }
  if (event.code === "Escape") {
    if (!helpDialog.open) {
      event.preventDefault();
      togglePause();
    }
    return;
  }
  if (helpDialog.open || game.state === "paused") return;

  const actions = { ...DEFAULT_CONTROLS };
  for (const [actionName, code] of Object.entries(customBindings)) actions[code] = actionName;
  const action = actions[event.code];
  if (!action) return;
  event.preventDefault();
  if (game.state !== "running") {
    if (game.state === "over" && game.mode === "infinite") startInfiniteRun();
    else startGame();
  } else {
    performAction(action);
  }
});

updateVibrationButton();
updateReducedEffectsButton();
updateBindingButtons();
renderLevelMenu();
updateEconomyUi();
requestAnimationFrame(frame);
