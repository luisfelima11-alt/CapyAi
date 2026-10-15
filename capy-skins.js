/* Capy wardrobe: a shared, closed catalog for browser and server. */
(function (root, factory) {
  const catalog = factory();
  if (typeof module === 'object' && module.exports) module.exports = catalog;
  else {
    root.CapySkins = catalog;
    const update = user => {
      document.querySelectorAll('[data-capy-avatar],#profile-avatar,#acc-avatar').forEach(el => {
        el.innerHTML = catalog.image(user?.avatar, 64);
      });
    };
    root.addEventListener('capy:session', event => update(event.detail));
    root.addEventListener('storage', event => {
      if (event.key !== 'capySession') return;
      try { update(JSON.parse(event.newValue || 'null')); } catch {}
    });
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const items = Object.freeze([
  {
    "id": "capy-gymbot",
    "name": "Robô de academia",
    "color": "#c7f4eb",
    "src": "assets/skins/gymbot.png"
  },
  {
    "id": "capy-football",
    "name": "Craque do futebol",
    "color": "#dbefb4",
    "src": "assets/skins/football.png"
  },
  {
    "id": "capy-astronaut",
    "name": "Astronauta",
    "color": "#d9d3fc",
    "src": "assets/skins/astronaut.png"
  },
  {
    "id": "capy-sushi",
    "name": "Chef de sushi",
    "color": "#ffd4c9",
    "src": "assets/skins/sushi.png"
  },
  {
    "id": "capy-pirate",
    "name": "Pirata dos mares",
    "color": "#bfe8f4",
    "src": "assets/skins/pirate.png"
  },
  {
    "id": "capy-wizard",
    "name": "Maga das estrelas",
    "color": "#ead2fb",
    "src": "assets/skins/wizard.png"
  },
  {
    "id": "capy-dj",
    "name": "DJ Capy",
    "color": "#f9c9e3",
    "src": "assets/skins/dj.png"
  },
  {
    "id": "capy-detective",
    "name": "Detetive",
    "color": "#e9dec7",
    "src": "assets/skins/detective.png"
  },
  {
    "id": "capy-dinosaur",
    "name": "Capyssauro",
    "color": "#c9edcd",
    "src": "assets/skins/dinosaur.png"
  },
  {
    "id": "capy-bee",
    "name": "Abelhinha",
    "color": "#ffe6b3",
    "src": "assets/skins/bee.png"
  },
  {
    "id": "capy-cowboy",
    "name": "Cowboy do cerrado",
    "color": "#ffd2b2",
    "src": "assets/skins/cowboy.png"
  },
  {
    "id": "capy-samurai",
    "name": "Samurai das flores",
    "color": "#ffd5da",
    "src": "assets/skins/samurai.png"
  },
  {
    "id": "capy-diver",
    "name": "Mergulhadora",
    "color": "#bcefee",
    "src": "assets/skins/diver.png"
  },
  {
    "id": "capy-queen",
    "name": "Rainha das capys",
    "color": "#e2d4fa",
    "src": "assets/skins/queen.png"
  },
  {
    "id": "capy-pizza",
    "name": "Pizza express",
    "color": "#ffd9c9",
    "src": "assets/skins/pizza.png"
  }
].map(Object.freeze));
  const defaultId = 'capy-astronaut';
  const byId = new Map(items.map(skin => [skin.id, skin]));
  const valid = value => typeof value === 'string' && byId.has(value);
  const get = value => byId.get(value) || byId.get(defaultId);
  const normalize = value => get(value).id;
  function image(value, size) {
    const skin = get(value);
    const px = Math.max(16, Math.min(512, Number(size) || 80));
    return '<img src="' + skin.src + '" alt="Capy: ' + skin.name + '" width="' + px + '" height="' + px + '" decoding="async" style="width:100%;height:100%;object-fit:cover;display:block;border-radius:inherit" data-capy-skin="' + skin.id + '">';
  }
  return Object.freeze({ items, defaultId, valid, get, normalize, image });
});
