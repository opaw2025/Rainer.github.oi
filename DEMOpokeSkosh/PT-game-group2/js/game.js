(function(){
  'use strict';

  /* Utilities */

  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));
  function clamp(n,a,b){ return Math.max(a, Math.min(b,n)); }
  function sleep(ms){ return new Promise(r=>setTimeout(r,ms)); }
  function randInt(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
  function shuffle(arr){ const a = arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }
  function showScene(id){
    $$('.scene').forEach(s=>s.classList.remove('active'));
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  }

  /* POKEMON Types & Stats & Sprites */

  const TYPE_CHART = {
    Fire:     { strong:['Grass','Bug','Ice'], weak:['Water','Rock','Ground'] },
    Water:    { strong:['Fire','Rock','Ground'], weak:['Grass','Electric'] },
    Grass:    { strong:['Water','Ground','Rock'], weak:['Fire','Ice','Flying'] },
    Electric: { strong:['Water','Flying'], weak:['Ground'] },
    Rock:     { strong:['Fire','Flying','Bug','Ice'], weak:['Water','Grass','Fighting','Ground'] },
    Normal:   { strong:[], weak:[] },
    Flying:   { strong:['Grass','Fighting','Bug'], weak:['Electric','Rock','Ice'] },
    Ground:   { strong:['Fire','Electric','Rock'], weak:['Water','Grass','Ice'] },
    Bug:      { strong:['Grass','Psychic','Dark'], weak:['Fire','Flying','Rock'] },
    Fighting: { strong:['Normal','Rock','Ice','Dark'], weak:['Flying','Psychic','Fairy'] }
  };

  const POKEMON_DB = {
    1: { name:'Bulbasaur', type:'Grass', maxHp:100, attack:49, defense:49, speed:45, moves:['Tackle','Vine Whip','Growl','Leech Seed'] },
    2: { name:'Charmander', type:'Fire', maxHp:95, attack:52, defense:43, speed:65, moves:['Scratch','Ember','Growl','Smokescreen'] },
    3: { name:'Squirtle', type:'Water', maxHp:105, attack:48, defense:65, speed:43, moves:['Tackle','Water Gun','Tail Whip','Bubble'] },
    4: { name:'Treecko', type:'Grass', maxHp:90, attack:45, defense:35, speed:70, moves:['Pound','Absorb','Leer','Quick Attack'] },
    5: { name:'Torchic', type:'Fire', maxHp:92, attack:60, defense:40, speed:45, moves:['Scratch','Ember','Focus Energy','Peck'] },
    6: { name:'Mudkip', type:'Water', maxHp:105, attack:50, defense:50, speed:40, moves:['Tackle','Water Gun','Mud-Slap','Growl'] },
    7: { name:'Turtwig', type:'Grass', maxHp:110, attack:68, defense:64, speed:31, moves:['Tackle','Withdraw','Absorb','Razor Leaf'] },
    8: { name:'Chimchar', type:'Fire', maxHp:90, attack:58, defense:44, speed:61, moves:['Scratch','Ember','Leer','Taunt'] },
    9: { name:'Piplup', type:'Water', maxHp:100, attack:51, defense:53, speed:40, moves:['Pound','Bubble','Growl','Water Sport'] },
    10:{ name:'Chespin', type:'Grass', maxHp:110, attack:61, defense:65, speed:38, moves:['Vine Whip','Tackle','Rollout','Growl'] },
    11:{ name:'Fennekin', type:'Fire', maxHp:95, attack:56, defense:40, speed:60, moves:['Scratch','Ember','Tail Whip','Howl'] },
    12:{ name:'Froakie', type:'Water', maxHp:90, attack:56, defense:41, speed:71, moves:['Pound','Bubble','Quick Attack','Growl'] },
    13:{ name:'Rowlet', type:'Grass', maxHp:100, attack:55, defense:50, speed:42, moves:['Tackle','Leafage','Growl','Peck'] },
    14:{ name:'Litten', type:'Fire', maxHp:95, attack:65, defense:45, speed:70, moves:['Scratch','Ember','Growl','Lick'] },
    15:{ name:'Popplio', type:'Water', maxHp:105, attack:54, defense:54, speed:50, moves:['Pound','Water Gun','Growl','Disarming Voice'] },
    16:{ name:'Eevee', type:'Normal', maxHp:100, attack:55, defense:50, speed:55, moves:['Tackle','Quick Attack','Growl','Sand Attack'] },
    17:{ name:'Rockruff', type:'Rock', maxHp:95, attack:65, defense:40, speed:60, moves:['Tackle','Rock Throw','Howl','Bite'] },
    18:{ name:'Pikachu', type:'Electric', maxHp:90, attack:55, defense:40, speed:90, moves:['Quick Attack','Thunder Shock','Growl','Tail Whip'] }
  };

  const SPRITE_FILES = {
  front: {
    Bulbasaur: '../assets/image/bulbasaurFront1.png',
    Charmander: '../assets/image/charmanderFront1.png',
    Squirtle: '../assets/image/squirtleFront1.png',
    Treecko: '../assets/image/treeckoFront1.png',
    Torchic: '../assets/image/torchicFront1.png',
    Mudkip: '../assets/image/mudkipFront1.png',
    Turtwig: '../assets/image/turtwigFront1.png',
    Chimchar: '../assets/image/chimcharFront1.png',
    Piplup: '../assets/image/piplupFront1.png',
    Chespin: '../assets/image/chespinFront1.png',
    Fennekin: '../assets/image/fennekinFront1.png',
    Froakie: '../assets/image/froakieFront1.png',
    Rowlet: '../assets/image/rowletFront1.png',
    Litten: '../assets/image/littenFront1.png',
    Popplio: '../assets/image/poplioFront1.png',
    Eevee: '../assets/image/eeveeFront1.png',
    Rockruff: '../assets/image/rockruffFront1.png',
    Pikachu: '../assets/image/pikachuFront1.png'
  },
  back: {
    Bulbasaur: '../assets/image/bulbasaurBack.png',
    Charmander: '../assets/image/charmanderBack.png',
    Squirtle: '../assets/image/squirtleBack.png',
    Treecko: '../assets/image/treeckoBack.png',
    Torchic: '../assets/image/torchicBack.png',
    Mudkip: '../assets/image/mudkipBack.png',
    Turtwig: '../assets/image/turtwigBack.png',
    Chimchar: '../assets/image/chimcharBack.png',
    Piplup: '../assets/image/piplupBack.png',
    Chespin: '../assets/image/chespinBack.png',
    Fennekin: '../assets/image/fennekinBack.png',
    Froakie: '../assets/image/froakieBack.png',
    Rowlet: '../assets/image/rowletBack.png',
    Litten: '../assets/image/littenBack.png',
    Popplio: '../assets/image/popplioBack.png',
    Eevee: '../assets/image/eeveeBack.png',
    Rockruff: '../assets/image/rockruffBack.png',
    Pikachu: '../assets/image/pikachuBack.png'
  }
};

  const MOVE_POWER = {
    'Tackle':35,'Vine Whip':45,'Leech Seed':0,'Scratch':40,'Ember':40,'Growl':0,'Smokescreen':0,
    'Water Gun':40,'Tail Whip':0,'Bubble':40,'Quick Attack':40,'Thunder Shock':40,'Rock Throw':50,
    'Rollout':30,'Pound':40,'Absorb':20,'Mud-Slap':20,'Razor Leaf':55,'Peck':35,
    'Bite':60,'Howl':0,'Disarming Voice':40,'Sand Attack':0
  };

  const MOVE_TYPE = {
    'Ember':'Fire','Water Gun':'Water','Bubble':'Water','Vine Whip':'Grass','Razor Leaf':'Grass',
    'Thunder Shock':'Electric','Rock Throw':'Rock','Quick Attack':'Normal','Tackle':'Normal',
    'Scratch':'Normal','Bite':'Dark','Peck':'Flying','Mud-Slap':'Ground','Pound':'Normal'
  };

  /* Trainers */

  const TRAINERS_META = [
  { 
    name: 'Kai', 
    trainerImg: 'assets/image/enemyNO1.png', 
    introText: "I’ve trained day and night — you won’t beat me easily!", 
    outroText: "Whoa… you’re stronger than I expected!" 
  },
  { 
    name: 'Mira', 
    trainerImg: 'assets/image/enemyNO2.png', 
    introText: "I’ll show you the true bond between me and my Pokémon!", 
    outroText: "Guess our bond needs a little more training..." 
  },
  { 
    name: 'Dex', 
    trainerImg: 'assets/image/enemyNO3.png', 
    introText: "Let’s make this battle quick — I’ve got places to be.", 
    outroText: "Ugh… maybe I should’ve slowed down after all..." 
  },
  { 
    name: 'Luna', 
    trainerImg: 'assets/image/enemyNO4.png', 
    introText: "The moon’s on my side tonight! Let’s battle!", 
    outroText: "The stars just weren’t with me this time..." 
  }
];


  /* Game State */

  const GAME = {
    player: {
      trainer: null,
      name: '',
      difficulty: 'normal',
      coins: 200,
      score: 0,
      potions: 2,
      reviveStones: 1,
      selectedPokemon: [],
      activeIndex: 0,
      trainerImg: null
    },
    enemies: [],
    currentTrainerIndex: 0,
    battle: null,
    paused: false
  };

  /* Music: menu + battle (looping, auto-switch) */

let menuMusic = null;
let battleMusic = null;

// menu & battle
let activeTrack = null;
// pangpahinumdom asa siya dapit na pause/resume
let prevActiveTrack = null;
// mute
let isMuted = false;

const MUSIC = {
  menuSrc: 'assets/audio/backgroundMusic1.mp3',
  battleSrc: 'assets/audio/backgroundMusic2.mp3',
  defaultVolume: 0.5
};



// SOUND EFFECTS
let hurtSound = null;
let faintSound = null;
let healSound = null;
let reviveSound = null;
let deploySound = null;
let switchSound = null;
let winSound = null;

function initBattleSounds(){
  try {
    hurtSound = new Audio('assets/audio/hurt.mp3');
    faintSound = new Audio('assets/audio/faint.mp3');
    healSound = new Audio('assets/audio/heal.mp3');
    reviveSound = new Audio('assets/audio/revive.mp3');
    deploySound = new Audio('assets/audio/deploy.mp3');
    switchSound = new Audio('assets/audio/switch.mp3');
  } catch(e){
    console.debug('initBattleSounds error', e);
  }
}

function playSound(s){
  try {
    if (!s) return;
    s.currentTime = 0;
    s.play().catch(()=>{});
  } catch(e){}
}

// Initialize audio objects once
function initMusic() {
  if (menuMusic && battleMusic) return;

  menuMusic = new Audio(MUSIC.menuSrc);
  battleMusic = new Audio(MUSIC.battleSrc);

  menuMusic.loop = true;
  battleMusic.loop = true;

  menuMusic.volume = 0;
  battleMusic.volume = MUSIC.defaultVolume;

  menuMusic.muted = isMuted;
  battleMusic.muted = isMuted;

  // Try to play menu silently so audio context is unlocked on first user interaction.
  menuMusic.play().catch(err => {
    console.debug('silent autoplay blocked (expected):', err);
  });

  console.debug('initMusic: created audio objects');
}

// call this once on first user gesture to unmute/enable playback
function unlockAudioOnUserGesture() {
  // If user has already clicked and initMusic ran, unmute menu (but keep isMuted respected)
  if (!menuMusic || !battleMusic) initMusic();

  // if not muted by user, set menu volume
  if (!isMuted) {
    menuMusic.volume = MUSIC.defaultVolume;
    if (menuMusic.paused) {
      menuMusic.play().catch(() => {});
    }
  }
  window.removeEventListener('click', unlockAudioOnUserGesture);
}
window.addEventListener('click', unlockAudioOnUserGesture, { once: true });

// Play menu music and stop battle music
function playMenuMusic() {
  if (!menuMusic || !battleMusic) initMusic();

  console.debug('playMenuMusic called');

  // stop battle
  if (battleMusic && !battleMusic.paused) {
    battleMusic.pause();
    battleMusic.currentTime = 0;
    console.debug('playMenuMusic: stopped battleMusic');
  }

  activeTrack = 'menu';

  menuMusic.currentTime = 0;
  menuMusic.muted = !!isMuted;
  menuMusic.volume = MUSIC.defaultVolume;
  menuMusic.play().catch(err => {
    console.debug('playMenuMusic.play() caught:', err);
  });
}

// Play battle music and stop menu music
function playBattleMusic() {
  if (!menuMusic || !battleMusic) initMusic();

  console.debug('playBattleMusic called');

  // stop menu
  if (menuMusic && !menuMusic.paused) {
    menuMusic.pause();
    menuMusic.currentTime = 0;
    console.debug('playBattleMusic: stopped menuMusic');
  }

  activeTrack = 'battle';

  battleMusic.currentTime = 0;
  battleMusic.muted = !!isMuted;
  battleMusic.volume = MUSIC.defaultVolume;
  battleMusic.play().catch(err => {
    console.debug('playBattleMusic.play() caught:', err);
  });
}

// Stops both immediately
function stopAllMusic() {
  if (menuMusic) {
    menuMusic.pause();
    menuMusic.currentTime = 0;
  }
  if (battleMusic) {
    battleMusic.pause();
    battleMusic.currentTime = 0;
  }
  prevActiveTrack = null;
  activeTrack = null;
  console.debug('stopAllMusic: all stopped');
}

// Controls init — call after DOM is ready
function initControls() {
  const muteBtn = document.getElementById('muteBtn');
  const pauseBtn = document.getElementById('pauseBtn');

  // set initial button icons if elements exist
  if (muteBtn) muteBtn.textContent = isMuted ? '🔈' : '🔊';
  if (pauseBtn) pauseBtn.textContent = (typeof GAME !== 'undefined' && GAME.paused) ? '▶️' : '⏸️';

  // MUTE button toggles both tracks
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      isMuted = !isMuted;
      if (menuMusic) menuMusic.muted = isMuted;
      if (battleMusic) battleMusic.muted = isMuted;

      muteBtn.textContent = isMuted ? '🔈' : '🔊';
      console.debug('mute toggled ->', isMuted);
    });
  }

  // PAUSE button: toggles GAME.paused if present, and pauses/resumes audio properly
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      // Toggle game paused flag if present
      if (typeof GAME !== 'undefined') {
        GAME.paused = !GAME.paused;
      } else {
        // if GAME doesn't exist, emulate a paused flag for audio logic
        GAME = { paused: !(typeof GAME !== 'undefined' ? GAME.paused : false) };
      }

      const paused = !!(typeof GAME !== 'undefined' && GAME.paused);
      pauseBtn.textContent = paused ? '▶️' : '⏸️';
      console.debug('pause toggled ->', paused);

      if (paused) {
        // store which track was active so we can resume it later
        prevActiveTrack = activeTrack;
        // pause both tracks
        if (menuMusic && !menuMusic.paused) {
          menuMusic.pause();
          console.debug('menuMusic paused');
        }
        if (battleMusic && !battleMusic.paused) {
          battleMusic.pause();
          console.debug('battleMusic paused');
        }
      } else {
        // Resume the track that was active before pause
        if (prevActiveTrack === 'battle') {
          // Only start if battleMusic exists
          if (!battleMusic) initMusic();
          battleMusic.muted = !!isMuted;
          battleMusic.play().catch(err => {
            console.debug('resume battleMusic.play() caught:', err);
          });
          activeTrack = 'battle';
          console.debug('resumed battleMusic');
        } else if (prevActiveTrack === 'menu') {
          if (!menuMusic) initMusic();
          menuMusic.muted = !!isMuted;
          menuMusic.play().catch(err => {
            console.debug('resume menuMusic.play() caught:', err);
          });
          activeTrack = 'menu';
          console.debug('resumed menuMusic');
        } else {
          console.debug('no previous active track to resume');
        }
        prevActiveTrack = null;
      }
    });
  }
}

// Auto-init controls when DOM loaded
document.addEventListener('DOMContentLoaded', () => {
  initMusic();
  initBattleSounds(); // initialize sfx
  initControls();
  
});

  /* PokemonInstance */

  class PokemonInstance {
    constructor(id, level=5){
      const base = POKEMON_DB[id];
      if (!base) throw new Error('Unknown Pokemon id '+id);
      this.id = id;
      this.name = base.name;
      this.type = base.type;
      this.level = level;
      this.maxHp = Math.max(1, Math.round(base.maxHp * (1 + (level-5)*0.06)));
      this.hp = this.maxHp;
      this.attack = Math.max(1, Math.round(base.attack * (1 + (level-5)*0.04)));
      this.defense = Math.max(1, Math.round(base.defense * (1 + (level-5)*0.04)));
      this.speed = Math.max(1, Math.round(base.speed * (1 + (level-5)*0.03)));
      this.moves = base.moves.slice().map(mn => ({
        name: mn,
        power: MOVE_POWER[mn] || 30,
        type: MOVE_TYPE[mn] || base.type || 'Normal'
      }));
      this.frontSprite = SPRITE_FILES.front[this.name] ? `assets/${SPRITE_FILES.front[this.name]}` : '';
      this.backSprite = SPRITE_FILES.back[this.name] ? `assets/${SPRITE_FILES.back[this.name]}` : this.frontSprite;
      this.fainted = false;
    }
    isAlive(){ return this.hp > 0; }
    receiveDamage(dmg){ this.hp = clamp(this.hp - dmg, 0, this.maxHp); if (this.hp===0) this.fainted=true; }
    heal(amount){ this.hp = clamp(this.hp + amount, 0, this.maxHp); if (this.hp>0) this.fainted=false; }
    reviveTo(amt){ this.hp = clamp(amt,1,this.maxHp); this.fainted=false; }
  }

  /* Helpers: type multiplier & damage */

  function typeMultiplier(moveType, defenderType){
    if (!moveType || !defenderType) return 1;
    const atk = TYPE_CHART[moveType];
    if (!atk) return 1;
    if (atk.strong.includes(defenderType)) return 2.0;
    if (atk.weak.includes(defenderType)) return 0.5;
    return 1.0;
  }

  function calculateDamage(attacker, defender, moveObj, difficulty='normal'){
    const power = moveObj.power || 30;
    const moveType = moveObj.type || attacker.type || 'Normal';
    const L = attacker.level;
    const A = attacker.attack;
    const D = Math.max(1, defender.defense);
    const base = Math.floor( (((2*L/5 + 2) * power * (A/D)) / 50) + 2 );
    const stab = (attacker.type === moveType) ? 1.5 : 1.0;
    const tmult = typeMultiplier(moveType, defender.type);
    const diffFactor = difficulty === 'easy' ? 0.85 : difficulty === 'hard' ? 1.15 : 1.0;
    const rand = (Math.random() * 0.15) + 0.85;
    const total = Math.max(1, Math.floor(base * stab * tmult * diffFactor * rand));
    return { dmg: total, typeMult: tmult, stab, moveType };
  }

  /* UI helpers */
  function showMessage(sceneId, text, color='red', autoHide=true){
    const scene = document.getElementById(sceneId);
    if (!scene) return;
    const msg = scene.querySelector('.message');
    if (!msg) return;
    msg.style.color = color;
    msg.textContent = text;
    msg.style.opacity = '1';
    if (autoHide) setTimeout(()=> msg.style.opacity='0', 3000);
  }

  function updateHUD(){
    const coinsEl = document.getElementById('playerCoins') || document.getElementById('gameCoins');
    if (coinsEl) coinsEl.textContent = `Coins: ${GAME.player.coins}`;
    const potEl = document.getElementById('playerPotions');
    if (potEl) potEl.textContent = `Potions: ${GAME.player.potions}`;
    const scoreEl = document.getElementById('gameScore');
    if (scoreEl) scoreEl.textContent = `Score: ${GAME.player.score}`;
    const shopCoins = document.getElementById('playerCoins');
    if (shopCoins) shopCoins.textContent = `Coins: ${GAME.player.coins}`;
  }

  function renderSelectedPokemonSummary(){
    const list = $('#selectedPokemonList');
    if (!list) return;
    list.innerHTML = '';
    GAME.player.selectedPokemon.forEach((p, idx)=>{
      const li = document.createElement('li');
      li.className = 'pokemon-summary';
      li.innerHTML = `
        <div style="display:flex;gap:12px;align-items:center;">
          <img src="${p.frontSprite}" alt="${p.name}" style="width:56px;height:56px;image-rendering:pixelated;">
          <div style="text-align:left;">
            <strong>${p.name} (Lv ${p.level})</strong>
            <div>HP: ${p.hp}/${p.maxHp}</div>
            <div>ATK:${p.attack} DEF:${p.defense} SPD:${p.speed}</div>
            <div>Moves: ${p.moves.map(m=>m.name).join(', ')}</div>
          </div>
        </div>
      `;
      list.appendChild(li);
    });
  }

  /* Trainer overlay (intro/outr) */

  function ensureTrainerOverlay(){
    if ($('#trainer-intro')) return;
    const overlay = document.createElement('div');
    overlay.id = 'trainer-intro';
    Object.assign(overlay.style, { position:'fixed', inset:0, display:'flex', justifyContent:'center', alignItems:'center', pointerEvents:'none', zIndex:9998 });
    overlay.innerHTML = `<div id="trainer-intro-inner" style="pointer-events:auto; background:rgba(0,0,0,0.85); color:#fff; padding:14px; border-radius:8px; display:flex; gap:12px; align-items:center; opacity:0; transform:scale(0.98);">
      <img id="trainer-intro-img" src="" alt="Trainer" style="width:96px;height:96px;object-fit:contain;">
      <div>
        <strong id="trainer-intro-name"></strong>
        <p id="trainer-intro-text" style="margin:6px 0 0 0;"></p>
      </div>
    </div>`;
    document.body.appendChild(overlay);
  }

  async function showTrainerIntro(trainerObj){
    ensureTrainerOverlay();
    const outer = $('#trainer-intro');
    const inner = $('#trainer-intro-inner');
    $('#trainer-intro-img').src = trainerObj.trainerImg || '';
    $('#trainer-intro-name').textContent = trainerObj.name;
    $('#trainer-intro-text').textContent = trainerObj.introText || '';
    outer.style.display = 'flex';
    inner.style.transition = 'opacity 400ms ease, transform 400ms ease';
    inner.style.opacity = '0';
    inner.style.transform = 'scale(0.98)';
    await sleep(20);
    inner.style.opacity = '1';
    inner.style.transform = 'scale(1)';
    await sleep(1000);
    inner.style.opacity = '0';
    inner.style.transform = 'scale(0.98)';
    await sleep(420);
    outer.style.display = 'none';
  }

  async function showTrainerOutro(trainerObj){
    ensureTrainerOverlay();
    const outer = $('#trainer-intro');
    const inner = $('#trainer-intro-inner');
    $('#trainer-intro-img').src = trainerObj.trainerImg || '';
    $('#trainer-intro-name').textContent = trainerObj.name;
    $('#trainer-intro-text').textContent = trainerObj.outroText || '';
    outer.style.display = 'flex';
    inner.style.transition = 'opacity 400ms ease, transform 400ms ease';
    inner.style.opacity = '0';
    inner.style.transform = 'scale(0.98)';
    await sleep(20);
    inner.style.opacity = '1';
    inner.style.transform = 'scale(1)';
    await sleep(1200);
    inner.style.opacity = '0';
    inner.style.transform = 'scale(0.98)';
    await sleep(420);
    outer.style.display = 'none';
  }

  /* Difficulty helpers & AI choice */

  function computePlayerTeamAverages(){
    const arr = GAME.player.selectedPokemon || [];
    if (!arr.length) return null;
    const avg = { attack:0, defense:0, speed:0, maxHp:0 };
    arr.forEach(p=>{
      avg.attack += p.attack;
      avg.defense += p.defense;
      avg.speed += p.speed;
      avg.maxHp += p.maxHp;
    });
    avg.attack = Math.round(avg.attack/arr.length);
    avg.defense = Math.round(avg.defense/arr.length);
    avg.speed = Math.round(avg.speed/arr.length);
    avg.maxHp = Math.round(avg.maxHp/arr.length);
    return avg;
  }

  function applyDifficultyToEnemyInstance(inst){
    const diff = GAME.player.difficulty || 'normal';
    if (diff === 'easy'){
      inst.attack = Math.max(1, inst.attack - 10);
      inst.defense = Math.max(1, inst.defense - 10);
      inst.speed = Math.max(1, inst.speed - 10);
      inst.maxHp = Math.max(1, Math.round(inst.maxHp * 0.85));
      inst.hp = Math.min(inst.hp, inst.maxHp);
    } else if (diff === 'normal'){
      const avg = computePlayerTeamAverages();
      if (avg){
        inst.attack = Math.max(1, avg.attack);
        inst.defense = Math.max(1, avg.defense);
        inst.speed = Math.max(1, avg.speed);
        inst.maxHp = Math.max(1, avg.maxHp);
        inst.hp = inst.maxHp;
      }
    } else if (diff === 'hard'){
      inst.attack = inst.attack + 10;
      inst.defense = inst.defense + 10;
      inst.speed = inst.speed + 10;
      inst.maxHp = Math.round(inst.maxHp * 1.10);
      inst.hp = inst.maxHp;
    }
  }

  function aiChooseMove(aiPokemon, targetPokemon){
    const diff = GAME.player.difficulty || 'normal';
    if (diff === 'hard'){
      let best = aiPokemon.moves[0];
      let bestScore = -Infinity;
      aiPokemon.moves.forEach(mv=>{
        const est = estimateDamage(aiPokemon, targetPokemon, mv);
        if (est > bestScore){ bestScore = est; best = mv; }
      });
      return best;
    } else {
      const damaging = aiPokemon.moves.filter(m=> (m.power || 0) > 0 );
      const pool = damaging.length ? damaging : aiPokemon.moves;
      return pool[randInt(0, pool.length-1)];
    }
  }

  function estimateDamage(attacker, defender, move){
    const power = move.power || 30;
    const moveType = move.type || attacker.type || 'Normal';
    const A = attacker.attack;
    const D = Math.max(1, defender.defense);
    const base = Math.floor( (((2*attacker.level/5 + 2) * power * (A/D)) / 50) + 2 );
    const stab = (attacker.type === moveType) ? 1.5 : 1.0;
    const tmult = typeMultiplier(moveType, defender.type);
    const diffFactor = GAME.player.difficulty === 'easy' ? 0.85 : GAME.player.difficulty === 'hard' ? 1.15 : 1.0;
    return base * stab * tmult * diffFactor;
  }

  /* Battle class */

  class Battle {
    constructor(trainerObj){
      this.trainer = trainerObj;
      this.enemyPokemons = trainerObj.pokemons.map(spec => {
        const inst = new PokemonInstance(spec.id, spec.level || trainerObj.level || 5);
        const trainerLevelFactor = 1 + ((trainerObj.level || 5) * 0.02);
        inst.maxHp = Math.max(1, Math.round(inst.maxHp * trainerLevelFactor));
        inst.hp = inst.maxHp;
        inst.attack = Math.max(1, Math.round(inst.attack * trainerLevelFactor));
        inst.defense = Math.max(1, Math.round(inst.defense * trainerLevelFactor));
        inst.speed = Math.max(1, Math.round(inst.speed * trainerLevelFactor));
        applyDifficultyToEnemyInstance(inst);
        return inst;
      });
      this.currentEnemyIndex = 0;
      this.playerPokemons = GAME.player.selectedPokemon;
      this.playerActiveIndex = GAME.player.activeIndex || 0;
      this.isOver = false;
    }

    get enemyActive(){ return this.enemyPokemons[this.currentEnemyIndex]; }
    get playerActive(){ return this.playerPokemons[GAME.player.activeIndex]; }

    async start(){
      await showTrainerIntro(this.trainer);

      // set battle background
      const battleScene = document.getElementById('battle-scene');
      if (battleScene){
        battleScene.style.backgroundImage = `url('assets/image/battle-bg1.jpg')`;
        battleScene.style.backgroundSize = 'cover';
        battleScene.style.backgroundPosition = 'center';
      }

      // switch music to battle
      playBattleMusic();

      showScene('battle-scene');
      updateBattleUI(this);
      await sleep(300);
      updateBattleText(`${this.trainer.name} challenges you!`);
      await sleep(600);
      updateBattleText(`${this.trainer.name} sent out ${this.enemyActive.name}!`);
      playSound(deploySound);
      await sleep(600);
      updateBattleText(`${GAME.player.name} sent out ${this.playerActive.name}!`);
      playSound(deploySound);
      await sleep(500);
      updateBattleUI(this);
      const result = await this.runLoop();
      // after battle, switch back to menu music so shop/victory screens have menu music
      playMenuMusic();
      return result;
    }

    async runLoop(){
      let turn = (this.playerActive.speed >= this.enemyActive.speed) ? 'player' : 'enemy';
      while(!this.isOver){
        while(GAME.paused) await sleep(200);

        if (turn === 'player'){
          const action = await promptPlayerAction(this);
          if (!action) { turn = 'enemy'; continue; }

          if (action.type === 'move'){
            const moveObj = action.payload;
            await animateAttack('player');
            const { dmg, typeMult } = calculateDamage(this.playerActive, this.enemyActive, moveObj, GAME.player.difficulty);
            this.enemyActive.receiveDamage(dmg);
            playSound(hurtSound);
            updateBattleText(`${this.playerActive.name} used ${moveObj.name}!${typeMult>1?' It\'s super effective!':''}`);
            updateBattleUI(this);
            await sleep(700);

            if (!this.enemyActive.isAlive()){
              playSound(faintSound);
              updateBattleText(`${this.enemyActive.name} fainted!`);
              await sleep(700);
              this.currentEnemyIndex++;
              if (this.currentEnemyIndex >= this.enemyPokemons.length){
                this.isOver = true;
                await showTrainerOutro(this.trainer);
                break;
              } else {
                updateBattleText(`${this.trainer.name} sent out ${this.enemyActive.name}!`);
                playSound(deploySound);
                updateBattleUI(this);
                await sleep(700);
                turn = 'enemy';
                continue;
              }
            } else {
              turn = 'enemy';
            }

          } else if (action.type === 'bag'){
            if (action.payload === 'potion'){
              if (GAME.player.potions > 0){
                GAME.player.potions--;
                this.playerActive.heal(50);
                playSound(healSound);
                updateBattleText(`${this.playerActive.name} restored 50 HP!`);
                updateBattleUI(this);
              } else {
                updateBattleText('No potions left!');
              }
            } else if (action.payload === 'revive'){
              const fainted = GAME.player.selectedPokemon.find(p=>p.fainted);
              if (!fainted) {
                updateBattleText('No fainted Pokémon to revive!');
              } else if (GAME.player.reviveStones <= 0){
                updateBattleText('No revives left!');
              } else {
                GAME.player.reviveStones--;
                fainted.reviveTo(Math.floor(fainted.maxHp * 0.5) || 1);
                playSound(reviveSound);
                updateBattleText(`${fainted.name} was revived to ${fainted.hp} HP!`);
                updateBattleUI(this);
              }
            }
            await sleep(600);
            turn = 'enemy';
          } else if (action.type === 'switch'){
            const newIndex = action.payload;
            if (GAME.player.selectedPokemon[newIndex].isAlive()){
              GAME.player.activeIndex = newIndex;
              playSound(switchSound);
              updateBattleText(`${GAME.player.selectedPokemon[newIndex].name}, I choose you!`);
              updateBattleUI(this);
            } else {
              updateBattleText('Cannot switch to a fainted Pokémon!');
            }
            await sleep(400);
            turn = 'enemy';
          } else if (action.type === 'run'){
            updateBattleText("You can't run from a trainer battle!");
            await sleep(500);
            turn = 'enemy';
          } else if (action.type === 'none'){
            await sleep(200);
            turn = 'player';
          }

        } else { // enemy turn
          await sleep(500);
          const aiMove = aiChooseMove(this.enemyActive, this.playerActive);
          await animateAttack('enemy');
          const { dmg } = calculateDamage(this.enemyActive, this.playerActive, aiMove, GAME.player.difficulty);
          this.playerActive.receiveDamage(dmg);
          playSound(hurtSound);
          updateBattleText(`${this.enemyActive.name} used ${aiMove.name}!`);
          updateBattleUI(this);
          await sleep(700);

          if (!this.playerActive.isAlive()){
            playSound(faintSound);
            updateBattleText(`${this.playerActive.name} fainted!`);
            await sleep(700);
            const alive = GAME.player.selectedPokemon.find(p=>p.isAlive());
            if (alive){
              GAME.player.activeIndex = GAME.player.selectedPokemon.indexOf(alive);
              playSound(deploySound);
              updateBattleText(`${alive.name}, I choose you!`);
              updateBattleUI(this);
              await sleep(700);
              turn = 'player';
            } else {
              this.isOver = true;
              break;
            }
          } else {
            turn = 'player';
          }
        }
      }

      const playerLost = !GAME.player.selectedPokemon.some(p=>p.isAlive());
      return !playerLost;
    }
  }

  /* Update battle UI & move menu */

  function updateBattleUI(battle){
    const enemyNameEl = document.querySelector('.enemy-info .enemy-name') || document.querySelector('.enemy-name');
    const playerNameEl = document.querySelector('.player-info .player-name') || document.querySelector('.player-name');
    if (enemyNameEl && battle) enemyNameEl.textContent = `${battle.trainer.name}`;
    if (playerNameEl) playerNameEl.textContent = GAME.player.name || 'Player';

    const enemySprite = document.querySelector('.enemy-pokemon');
    const playerSprite = document.querySelector('.player-pokemon');
    if (battle && enemySprite) {
      enemySprite.src = battle.enemyActive.frontSprite || '';
      enemySprite.style.display = 'block';
      enemySprite.alt = battle.enemyActive.name;
    }
    if (battle && playerSprite) {
      playerSprite.src = battle.playerActive.backSprite || battle.playerActive.frontSprite || '';
      playerSprite.style.display = 'block';
      playerSprite.alt = battle.playerActive.name;
    }

    const enemyHpEl = document.querySelector('.enemy-info .hp-bar');
    const playerHpEl = document.querySelector('.player-info .hp-bar');
    if (battle && enemyHpEl){
      const pct = Math.round((battle.enemyActive.hp / battle.enemyActive.maxHp) * 100);
      enemyHpEl.style.width = pct + '%';
    }
    if (battle && playerHpEl){
      const pct = Math.round((battle.playerActive.hp / battle.playerActive.maxHp) * 100);
      playerHpEl.style.width = pct + '%';
    }

    const moveMenu = document.querySelector('.move-menu');
    if (moveMenu && battle){
      moveMenu.classList.remove('hidden');
      moveMenu.style.display = 'none';
      moveMenu.setAttribute('aria-hidden','true');
      moveMenu.innerHTML = '';
      const movesWrap = document.createElement('div');
      movesWrap.style.display = 'flex';
      movesWrap.style.flexWrap = 'wrap';
      movesWrap.style.gap = '8px';

      battle.playerActive.moves.slice(0,4).forEach(mv => {
        const btn = document.createElement('button');
        btn.className = 'move-btn';
        btn.textContent = `${mv.name}`;
        btn.addEventListener('click', ()=> {
          document.dispatchEvent(new CustomEvent('playerAction', { detail:{ type:'move', payload: mv } }));
        });
        movesWrap.appendChild(btn);
      });
      moveMenu.appendChild(movesWrap);

      const switchArea = document.createElement('div');
      switchArea.style.marginTop = '10px';
      battle.playerPokemons.forEach((p,idx)=>{
        const sbtn = document.createElement('button');
        sbtn.textContent = `Switch ${p.name}`;
        sbtn.style.marginRight = '6px';
        sbtn.addEventListener('click', ()=> {
          document.dispatchEvent(new CustomEvent('playerAction', { detail:{ type:'switch', payload: idx } } ));
        });
        switchArea.appendChild(sbtn);
      });
      moveMenu.appendChild(switchArea);
    }
  }

  async function animateAttack(side){
    const sel = side === 'player' ? '.player-pokemon' : '.enemy-pokemon';
    const el = document.querySelector(sel);
    if (!el) return;
    el.classList.add('attack-anim');
    await sleep(220);
    el.classList.remove('attack-anim');
    const targetSel = side === 'player' ? '.enemy-pokemon' : '.player-pokemon';
    const target = document.querySelector(targetSel);
    if (target){
      target.classList.add('damage-anim');
      await sleep(260);
      target.classList.remove('damage-anim');
    }
  }

  function updateBattleText(text){
    const el = document.querySelector('.battle-text');
    if (el) el.textContent = text;
  }

  /* Prompt player action */

  function promptPlayerAction(battle){
    return new Promise(resolve => {
      const menu = document.querySelector('.menu-buttons');
      const moveMenu = document.querySelector('.move-menu');
      if (menu) menu.style.display = 'flex';
      if (moveMenu) { moveMenu.style.display='none'; moveMenu.classList.remove('hidden'); moveMenu.setAttribute('aria-hidden','true'); }

      updateBattleUI(battle);

      const fightBtn = document.getElementById('fightBtn');
      const bagBtn = document.getElementById('bagBtn');
      const runBtn = document.getElementById('runBtn');

      const onPlayerAction = (e) => {
        const det = e.detail;
        if (!det) return;
        cleanup();
        resolve(det);
      };

      function fightHandler(){
        if (moveMenu) {
          moveMenu.classList.remove('hidden');
          moveMenu.style.display = 'block';
          moveMenu.setAttribute('aria-hidden','false');
        }
      }
      function bagHandler(){
        openBagModal(resolve);
      }
      function runHandler(){
        document.dispatchEvent(new CustomEvent('playerAction', { detail:{ type:'run' } } ));
      }

      function cleanup(){
        document.removeEventListener('playerAction', onPlayerAction);
        if (fightBtn) fightBtn.removeEventListener('click', fightHandler);
        if (bagBtn) bagBtn.removeEventListener('click', bagHandler);
        if (runBtn) runBtn.removeEventListener('click', runHandler);
        if (menu) menu.style.display = 'none';
        if (moveMenu) {
          moveMenu.style.display = 'none';
          moveMenu.setAttribute('aria-hidden','true');
        }
      }

      document.addEventListener('playerAction', onPlayerAction);
      if (fightBtn) fightBtn.addEventListener('click', fightHandler);
      if (bagBtn) bagBtn.addEventListener('click', bagHandler);
      if (runBtn) runBtn.addEventListener('click', runHandler);
      updateBattleUI(battle);
    });
  }

  /* Bag & Shop modals */

  function openBagModal(resolveFn){
    const existing = document.getElementById('bagModal');
    if (existing) existing.remove();
    const modal = document.createElement('div');
    modal.id = 'bagModal';
    Object.assign(modal.style, { position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:9999 });
    modal.innerHTML = `
      <div style="background:#222;color:#fff;padding:16px;border-radius:8px;min-width:260px;text-align:center;">
        <h3>Bag</h3>
        <p>Potions: ${GAME.player.potions} | Revives: ${GAME.player.reviveStones}</p>
        <div style="display:flex;gap:10px;justify-content:center;margin-top:8px;">
          <button id="bagPotionBtn">Use Potion (Heal 50)</button>
          <button id="bagReviveBtn">Use Revive</button>
        </div>
        <div style="margin-top:10px;">
          <button id="bagCloseBtn">Cancel</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    $('#bagPotionBtn').addEventListener('click', ()=> {
      document.body.removeChild(modal);
      resolveFn({ type:'bag', payload:'potion' });
    });
    $('#bagReviveBtn').addEventListener('click', ()=> {
      document.body.removeChild(modal);
      resolveFn({ type:'bag', payload:'revive' });
    });
    $('#bagCloseBtn').addEventListener('click', ()=> {
      document.body.removeChild(modal);
      resolveFn({ type:'none' });
    });
  }

  function openShopModal(continueCallback){
    const existing = document.getElementById('shopModal');
    if (existing) existing.remove();
    const modal = document.createElement('div');
    modal.id = 'shopModal';
    Object.assign(modal.style, { position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', justifyContent:'center', alignItems:'center', zIndex:9999 });
    modal.innerHTML = `
      <div style="background:#222;color:#fff;padding:18px;border-radius:8px;min-width:320px;">
        <h3>Shop</h3>
        <p>Potion (restores 50 HP) — 150 coins</p>
        <p>Revive — 300 coins</p>
        <div style="display:flex;gap:10px;margin-top:10px;">
          <button id="buyPotionBtn">Buy Potion</button>
          <button id="buyReviveBtn">Buy Revive</button>
          <button id="closeShopBtn">Continue</button>
        </div>
        <p style="margin-top:12px;">You have ${GAME.player.coins} coins. Potions: ${GAME.player.potions}</p>
      </div>
    `;
    document.body.appendChild(modal);

    $('#buyPotionBtn').addEventListener('click', ()=> {
      if (GAME.player.coins >= 150){
        GAME.player.coins -= 150;
        GAME.player.potions++;
        updateHUD();
        alert('Purchased Potion!');
        modal.querySelector('p:last-of-type').textContent = `You have ${GAME.player.coins} coins. Potions: ${GAME.player.potions}`;
      } else {
        alert('Not enough coins.');
      }
    });

    $('#buyReviveBtn').addEventListener('click', ()=> {
      if (GAME.player.coins >= 300){
        GAME.player.coins -= 300;
        GAME.player.reviveStones++;
        updateHUD();
        alert('Purchased Revive!');
        modal.querySelector('p:last-of-type').textContent = `You have ${GAME.player.coins} coins. Potions: ${GAME.player.potions}`;
      } else {
        alert('Not enough coins.');
      }
    });

    $('#closeShopBtn').addEventListener('click', ()=> {
      document.body.removeChild(modal);
      if (typeof continueCallback === 'function') continueCallback();
    });
  }

  /*  Full run: generate random trainer teams, then run through them */
  function generateRandomTrainers(){
    const allIds = Object.keys(POKEMON_DB).map(n=>Number(n));
    const trainers = TRAINERS_META.map((meta, idx) => {
      const pool = shuffle(allIds);
      const chosen = pool.slice(0,3).map(id => ({ id, level: Math.max(5, meta.level || 5) }));
      return Object.assign({}, meta, { pokemons: chosen, level: meta.level || 6 });
    });
    GAME.enemies = trainers;
  }

  async function startFullRun(){
    if (!GAME.player.selectedPokemon || GAME.player.selectedPokemon.length !== 3){
      showMessage('pokemon-select','Please select 3 Pokémon!');
      return;
    }
    generateRandomTrainers();

    GAME.currentTrainerIndex = 0;
    GAME.player.activeIndex = 0;
    GAME.player.selectedPokemon.forEach(p=>{ p.hp = p.maxHp; p.fainted=false; });

    while (GAME.currentTrainerIndex < GAME.enemies.length){
      const trainer = GAME.enemies[GAME.currentTrainerIndex];
      const battle = new Battle(trainer);
      GAME.battle = battle;
      const won = await battle.start();
    if (won) {
  // 🛑 Stop battle loop first
  stopBattleLoop();

  // Player victory rewards
  GAME.player.coins += 100;
  GAME.player.score += 1;
  updateHUD();

  // Heal Pokémon for next fight
  GAME.player.selectedPokemon.forEach(p => {
    p.hp = p.maxHp;
    p.fainted = false;
  });

  GAME.currentTrainerIndex++;

  // 🏆 Show victory popup before shop
  if (GAME.currentTrainerIndex < GAME.enemies.length) {
    const popup = document.createElement('div');
    Object.assign(popup.style, {
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.75)',
      color: '#fff',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '1.4em',
      fontWeight: 'bold',
      zIndex: 9999,
      textAlign: 'center',
      flexDirection: 'column',
      transition: 'opacity 0.5s ease, transform 0.5s ease',
      opacity: '0',
      transform: 'scale(0.95)'
    });

    popup.innerHTML = `
      <div style="background:#1e1e1e;padding:20px 28px;border-radius:12px;box-shadow:0 0 16px rgba(255,255,255,0.3);">
        🏆 You defeated <span style="color:#4caf50;">${trainer.name.toUpperCase()}</span>!<br>
        <small style="color:#ccc;">+100 Coins Reward</small>
      </div>
    `;
    document.body.appendChild(popup);

    // 🎵 Play victory sound
    playSound(winSound);

    // Fade in animation
    await sleep(50);
    popup.style.opacity = '1';
    popup.style.transform = 'scale(1)';

    // Display for 2.5 seconds
    await sleep(2500);

    // Fade out animation
    popup.style.opacity = '0';
    popup.style.transform = 'scale(0.95)';
    await sleep(500);

    // Remove popup
    document.body.removeChild(popup);

    // 🛍️ Open shop after popup
    await new Promise(resolve => openShopModal(resolve));
  }

} else {
  // Player defeated logic
  GAME.player.coins = Math.max(0, GAME.player.coins - 50);
  GAME.player.score = Math.max(0, GAME.player.score - 1);
  updateHUD();
  updateBattleText('💀 You were defeated... -50 coins');
  await sleep(1000);

  GAME.player.selectedPokemon.forEach(p => {
    p.hp = p.maxHp;
    p.fainted = false;
  });

  showScene('pokemon-select');
  playMenuMusic();
  return;
}

await sleep(400);
}

await showVictoryScreen();
}

  

  /* Victory screen */
  async function showVictoryScreen(){
    const existing = document.getElementById('victoryOverlay');
    if (existing) existing.remove();
    const overlay = document.createElement('div');
    overlay.id = 'victoryOverlay';
    Object.assign(overlay.style, { position:'fixed', inset:0, display:'flex', justifyContent:'center', alignItems:'center', background:'rgba(0,0,0,0.9)', color:'#fff', zIndex:9999 });

    const trainerImg = GAME.player.trainerImg || (GAME.player.trainer ? `assets/${GAME.player.trainer}Front.png` : '');
    const chosen = GAME.player.selectedPokemon || [];
    const pokesHtml = chosen.map(p => `<div style="margin:6px;text-align:center;"><img src="${p.frontSprite}" alt="${p.name}" style="width:96px;height:96px;object-fit:contain;"><div>${p.name} (Lv ${p.level})</div></div>`).join('');

    overlay.innerHTML = `
      <div style="text-align:center; padding:18px; border-radius:10px; background:linear-gradient(180deg,#0b3 0%, #034 100%); max-width:720px;">
        <h2>Congratulations, Champion!</h2>
        <div style="display:flex;gap:20px;align-items:center;justify-content:center;margin-top:8px;">
          <div>
            <img id="victTrainer" src="${trainerImg}" alt="Your Trainer" style="width:140px;height:140px;object-fit:contain;">
            <div style="margin-top:6px;font-weight:700;">${GAME.player.name}</div>
          </div>
          <div style="text-align:left;">
            <div style="font-weight:700;">Your Team</div>
            <div style="display:flex;gap:12px;margin-top:6px;">${pokesHtml}</div>
          </div>
        </div>
        <div style="margin-top:12px;">
          <button id="victContinueBtn">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
    $('#victContinueBtn').addEventListener('click', ()=> {
      document.body.removeChild(overlay);
      showScene('difficulty-select');
      playMenuMusic();
    });
  }

  /* Selection UI wiring & controls */
  function wireSelectionUI(){
    let selectedTrainer = null;
    const trainerImgs = $$('#character-select .characters img');
    trainerImgs.forEach(img=>{
      img.addEventListener('click', ()=>{
        trainerImgs.forEach(i=>i.classList.remove('selected'));
        img.classList.add('selected');
        selectedTrainer = img.dataset.char;
        GAME.player.trainer = selectedTrainer;
        GAME.player.trainerImg = img.src || null;
      });
    });

    $('#toNameInput').addEventListener('click', ()=> {
      if (!GAME.player.trainer) { showMessage('character-select','Please select a trainer!'); return; }
      showScene('name-input');
    });

    $('#toDifficulty').addEventListener('click', ()=> {
      const name = ($('#playerNameInput') && $('#playerNameInput').value.trim()) || '';
      if (!name) { showMessage('name-input','Please enter your name!'); return; }
      GAME.player.name = name;
      showScene('difficulty-select');
    });

    $$('#difficulty-select .difficulty-buttons button').forEach(btn=>{
      btn.addEventListener('click', ()=>{
        $$('#difficulty-select .difficulty-buttons button').forEach(b=>b.classList.remove('selected'));
        btn.classList.add('selected');
        GAME.player.difficulty = btn.dataset.difficulty || 'normal';
      });
    });

    $('#backToDifficulty').addEventListener('click', () => {
    showScene('difficulty-select');
    });

    $('#toPokemonSelect').addEventListener('click', ()=> showScene('pokemon-select'));

    document.getElementById('backToHome').addEventListener('click', () => {
    window.location.href = 'index.html';
    });


    const pokemonImgs = $$('#pokemon-select .pokemon img');
    const MAX = 3;
    let chosen = [];
    pokemonImgs.forEach(img=>{
      img.addEventListener('click', ()=>{
        const parent = img.closest('.pokemon');
        const id = Number(img.dataset.id);
        const already = parent.classList.contains('selected');
        if (already){
          parent.classList.remove('selected');
          chosen = chosen.filter(p=>p.id !== id);
        } else {
          if (chosen.length >= MAX){ showMessage('pokemon-select',`You can only select ${MAX} Pokémon!`); return; }
          parent.classList.add('selected');
          const inst = new PokemonInstance(id, 5);
          chosen.push(inst);
        }
      });
    });

    $('#toBattleOrder').addEventListener('click', ()=> {
      if (chosen.length !== MAX){ showMessage('pokemon-select',`Please select exactly ${MAX} Pokémon to continue.`); return; }
      GAME.player.selectedPokemon = chosen.map(p=>p);
      GAME.player.activeIndex = 0;
      renderSelectedPokemonSummary();
      showScene('battle-order');
      updateHUD();
      initControls();
      initMusic();
      playMenuMusic();
    });

    $('#startBattle').addEventListener('click', ()=> {
      startFullRun();
    });
    $('#backToPokemonSelect').addEventListener('click', () => {
  showScene('pokemon-select');
});
  }

  

  /* Controls: mute / pause / restart / shop */

function initControls() {
  const muteBtn = document.getElementById('muteBtn');
  const pauseBtn = document.getElementById('pauseBtn');
  const restartBtn = document.getElementById('restartBtn');

  // 🎵 MUTE BUTTON
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      const isMuted = !(menuMusic?.muted ?? false);
      if (menuMusic) menuMusic.muted = isMuted;
      if (battleMusic) battleMusic.muted = isMuted;
      muteBtn.textContent = isMuted ? '🔈' : '🔊';
    });
  }

  // ⏸️ PAUSE BUTTON
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      if (typeof GAME !== 'undefined') {
        GAME.paused = !GAME.paused;
      }

      const paused = GAME?.paused;
      pauseBtn.textContent = paused ? '▶️' : '⏸️';

      if (paused) {
        if (menuMusic && !menuMusic.paused) menuMusic.pause();
        if (battleMusic && !battleMusic.paused) battleMusic.pause();
      } else {
        if (battleMusic && battleMusic.paused && battleMusic.currentTime > 0) {
          battleMusic.play().catch(() => {});
        } else if (menuMusic && menuMusic.paused && menuMusic.currentTime > 0) {
          menuMusic.play().catch(() => {});
        }
      }
    });
  }

  // 🔁 RESTART BUTTON — goes back to difficulty selection
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      // Stop battle music and resume menu theme if needed
      if (typeof stopAllMusic === 'function') stopAllMusic();
      if (typeof playMenuMusic === 'function') playMenuMusic();

      // Go back to the difficulty selection screen
      showScene('difficulty-select');
    });
  }
}


  /* Dynamic CSS for small animations */

  function injectDynamicStyles(){
    if (document.getElementById('gameDynamicStyles')) return;
    const style = document.createElement('style');
    style.id = 'gameDynamicStyles';
    style.textContent = `
      .player-pokemon.attack-anim{ transform: translateX(8px) scale(1.02); transition: transform 200ms; }
      .enemy-pokemon.attack-anim{ transform: translateX(-8px) scale(1.02); transition: transform 200ms; }
      .player-pokemon.damage-anim, .enemy-pokemon.damage-anim { animation: flashDamage 320ms linear; }
      @keyframes flashDamage { 0% { filter: brightness(1.6); transform: translateY(0); } 50% { filter: brightness(0.6); transform: translateY(2px); } 100% { filter: brightness(1); transform: translateY(0); } }
      .pokemon-summary img { image-rendering: pixelated; }
      .move-menu { display:none; padding:8px; background:rgba(0,0,0,0.6); border-radius:6px; margin-top:8px; }
      .move-btn { padding:8px 10px; margin:4px; }
      .hp-bar-container { width:140px; background:#333; border-radius:6px; overflow:hidden; height:10px; }
      .hp-bar { height:100%; background:#4caf50; width:100%; transition: width 300ms ease; }
    `;
    document.head.appendChild(style);
  }

  /* Boot on DOMContentLoaded */

  document.addEventListener('DOMContentLoaded', ()=> {
    injectDynamicStyles();
    wireSelectionUI();
    initMusic();
    initControls();
    updateHUD();
    const enemyName = document.querySelector('.enemy-info .enemy-name') || document.querySelector('.enemy-name');
    if (enemyName) enemyName.classList.add('enemy-name');
    const playerName = document.querySelector('.player-info .player-name') || document.querySelector('.player-name');
    if (playerName) playerName.classList.add('player-name');

    // start with menu music
    playMenuMusic();
  });

  window.addEventListener('resize', ()=> { if (GAME.battle) updateBattleUI(GAME.battle); });

  // debug exposure
  window.__POKEMON_GAME = { GAME, POKEMON_DB };

})(); // end IIFE

function showScene(sceneId) {
  document.querySelectorAll('.scene').forEach(scene => scene.classList.remove('active'));
  const sceneToShow = document.getElementById(sceneId);
  if (sceneToShow) sceneToShow.classList.add('active');
}

// Call this before restarting or leaving the battle
function stopBattleLoop() {
  if (window.battleInterval) {
    clearInterval(window.battleInterval);
    window.battleInterval = null;
  }
  if (window.battleTimeouts) {
    window.battleTimeouts.forEach(clearTimeout);
    window.battleTimeouts = [];
  }
}