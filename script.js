const PLACEHOLDER_URL = "#";
const CHANNEL_URL = "https://whatsapp.com/channel/0029VbCcx0V7tkjD8n3SvF0a";
const COMMUNITY_URL = "https://chat.whatsapp.com/FFGV8CBoQgsFQeSWudwcLu?s=cl&p=a&ilr=0";

const channelMessages = [
  {
    name: "Build Club",
    time: "Aujourd'hui, 09:12",
    body: "Nouveau setup partagé : <strong>Claude Code + MCP</strong> pour brancher ses outils sans perdre le contexte."
  },
  {
    name: "Build Club",
    time: "Aujourd'hui, 11:08",
    body: "Comparatif rapide : <strong>Cursor, Codex, Windsurf et OpenCode</strong>. Quand prendre quoi selon le workflow."
  },
  {
    name: "Build Club",
    time: "Aujourd'hui, 14:42",
    body: "Ressource du jour : une stack simple pour builder des automatisations avec <strong>n8n</strong>, des agents et du no-code."
  }
];

const communityMessages = [
  {
    name: "Nassim",
    time: "09:22",
    body: "Vous gardez quoi en daily pour du front : Claude Code, Codex ou Cursor ?"
  },
  {
    name: "Boris",
    time: "09:28",
    body: "Claude Code pour les gros refactors, Cursor pour itérer vite, et Codex quand je veux déléguer un vrai bloc de travail."
  },
  {
    name: "Sarah",
    time: "09:31",
    body: "Si tu es plus no-code, n8n + MCP + un bon planner suffisent déjà pour beaucoup d'agents utiles."
  }
];

function hydrateLinks() {
  const groups = [
    { selector: "[data-channel-url]", href: CHANNEL_URL, label: "Lien de chaîne à venir" },
    { selector: "[data-community-url]", href: COMMUNITY_URL, label: "Lien de communauté à venir" }
  ];

  groups.forEach(({ selector, href, label }) => {
    document.querySelectorAll(selector).forEach((node) => {
      node.href = href;

      if (href !== PLACEHOLDER_URL) {
        return;
      }

      node.removeAttribute("target");
      node.removeAttribute("rel");
      node.setAttribute("aria-disabled", "true");
      node.setAttribute("title", label);
      node.addEventListener("click", (event) => {
        event.preventDefault();
      });
    });
  });
}

function setupMobileMenu() {
  const button = document.querySelector("[data-mobile-menu-button]");
  const panel = document.querySelector("[data-mobile-menu]");

  if (!button || !panel) return;

  button.addEventListener("click", () => {
    panel.classList.toggle("hidden");
  });

  panel.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      panel.classList.add("hidden");
    });
  });
}

function setupHeroGrid() {
  const canvas = document.getElementById("hero-grid-bg");
  if (!canvas) return;

  const context = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const pointer = { x: -1000, y: -1000 };
  const cell = 32;
  const radius = 170;

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;

    const width = parent.clientWidth;
    const height = parent.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function updatePointer(event) {
    const rect = canvas.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    ) {
      pointer.x = -1000;
      pointer.y = -1000;
      return;
    }

    pointer.x = event.clientX - rect.left;
    pointer.y = event.clientY - rect.top;
  }

  function resetPointer() {
    pointer.x = -1000;
    pointer.y = -1000;
  }

  function draw() {
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;
    context.clearRect(0, 0, width, height);

    const cols = Math.ceil(width / cell) + 1;
    const rows = Math.ceil(height / cell) + 1;

    for (let i = 0; i <= cols; i += 1) {
      for (let j = 0; j <= rows; j += 1) {
        const x = i * cell;
        const y = j * cell;
        const dx = pointer.x - x;
        const dy = pointer.y - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const proximity = Math.max(0, 1 - distance / radius);
        const alpha = 0.05 + proximity * 0.2;
        const size = 1.5 + proximity * 2;

        context.strokeStyle = `rgba(16, 185, 129, ${alpha})`;
        context.lineWidth = 1;
        
        // Draw small crosses
        context.beginPath();
        context.moveTo(x - size, y);
        context.lineTo(x + size, y);
        context.moveTo(x, y - size);
        context.lineTo(x, y + size);
        context.stroke();
      }
    }

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });
  window.addEventListener("mousemove", updatePointer, { passive: true });
  window.addEventListener("mouseout", resetPointer, { passive: true });
  draw();
}

function buildMessage(item, self = false) {
  const wrapper = document.createElement("div");
  wrapper.className = self
    ? "bg-emerald-50/80 ml-auto rounded-xl p-3 shadow-sm border border-zinc-200/50 max-w-[85%]"
    : "bg-white rounded-xl p-3 shadow-sm border border-zinc-200/50 max-w-[90%] mr-auto";

  wrapper.innerHTML = `
    <div class="flex items-center justify-between mb-1.5 ${self ? "" : "border-b border-zinc-100 pb-1"}">
      <span class="font-bold text-zinc-800 text-[10px]">${item.name}</span>
      <span class="text-[9px] text-zinc-400">${item.time}</span>
    </div>
    <p class="text-zinc-600 text-xs leading-relaxed">${item.body}</p>
    ${item.actionLabel ? `<a href="${item.actionHref}" class="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-zinc-900 hover:underline">${item.actionLabel}</a>` : ""}
  `;

  return wrapper;
}

function renderSimulator(mode) {
  const title = document.querySelector("[data-sim-title]");
  const subtitle = document.querySelector("[data-sim-subtitle]");
  const input = document.querySelector("[data-sim-input]");
  const area = document.querySelector("[data-sim-area]");
  const channelTab = document.querySelector("[data-sim-tab='channel']");
  const communityTab = document.querySelector("[data-sim-tab='community']");

  if (!title || !subtitle || !input || !area || !channelTab || !communityTab) return;

  area.innerHTML = "";

  if (mode === "community") {
    title.textContent = "Build Club — Communauté";
    subtitle.textContent = "Benchmarks, questions et entraide";
    input.textContent = "Écrire un message...";
    channelTab.className = "w-1/2 py-2 text-center font-semibold border-b-2 border-transparent text-zinc-400 hover:text-white transition-all";
    communityTab.className = "w-1/2 py-2 text-center font-semibold border-b-2 border-emerald-500 text-emerald-400 transition-all";
    communityMessages.forEach((message, index) => {
      area.appendChild(buildMessage(message, index > 0));
    });
    return;
  }

  title.textContent = "Build Club — Chaîne";
  subtitle.textContent = "Veille, setups et workflows";
  input.textContent = "Lecture seule pour la chaîne";
  channelTab.className = "w-1/2 py-2 text-center font-semibold border-b-2 border-emerald-500 text-emerald-400 transition-all";
  communityTab.className = "w-1/2 py-2 text-center font-semibold border-b-2 border-transparent text-zinc-400 hover:text-white transition-all";
  channelMessages.forEach((message) => {
    area.appendChild(buildMessage(message));
  });
}

function setupSimulator() {
  const tabs = document.querySelectorAll("[data-sim-tab]");
  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      renderSimulator(tab.dataset.simTab);
    });
  });

  renderSimulator("channel");
}

document.addEventListener("DOMContentLoaded", () => {
  hydrateLinks();
  setupMobileMenu();
  setupHeroGrid();
  setupSimulator();

  if (window.lucide) {
    window.lucide.createIcons();
  }
});
