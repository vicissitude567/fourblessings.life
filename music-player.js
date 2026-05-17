(function() {
  var audio = new Audio();
  var isPlaying = false;
  var currentTrack = {
    title: 'New Soul',
    artist: 'Yael Naim',
    src: 'music/Yael%20Naim%20-%20New%20Soul.mp3',
    cover: 'music/cover.jpg'
  };
  var playlist = [
    currentTrack,
    { title: '7 Years', artist: 'Lukas Graham', src: 'music/Lukas%20Graham%20-%207%20Years.mp3', cover: 'music/cover.jpg' },
    { title: 'Call Me Maybe', artist: 'Carly Rae Jepsen', src: 'music/Carly%20Rae%20Jepsen%20-%20Call%20Me%20Maybe.mp3', cover: 'music/cover.jpg' },
    { title: 'Take Me Hand', artist: 'DAISHI DANCE & Cécile Corbel', src: 'music/DAISHI%20DANCE%E3%80%81C%C3%A9cile%20Corbel%20-%20Take%20Me%20Hand.mp3', cover: 'music/cover.jpg' },
    { title: '在你的身边', artist: '盛哲', src: 'music/%E7%9B%9B%E5%93%B2%20-%20%E5%9C%A8%E4%BD%A0%E7%9A%84%E8%BA%AB%E8%BE%B9.mp3', cover: 'music/cover.jpg' },
    { title: '坏女孩', artist: '徐良 & 小凌', src: 'music/%E5%BE%90%E8%89%AF%E3%80%81%E5%B0%8F%E5%87%8C%20-%20%E5%9D%8F%E5%A5%B3%E5%AD%A9.mp3', cover: 'music/cover.jpg' }
  ];
  var trackIndex = 0;

  // ── 注入样式 ──
  var style = document.createElement('style');
  style.textContent = [
    ':root {',
    '  --mp-bg: #fdfaf5;',
    '  --mp-border: #e5ded2;',
    '  --mp-olive: #8b9d83;',
    '  --mp-brown: #a68b6f;',
    '  --mp-ink: #3a3530;',
    '  --mp-ink2: #6b635c;',
    '  --mp-ink3: #9c948d;',
    '}',
    '#music-player {',
    '  position: fixed; bottom: 0; left: 0; right: 0; z-index: 9999;',
    '  font-family: "PingFang SC","Microsoft YaHei",sans-serif;',
    '  user-select: none;',
    '}',

    '.mp-bar {',
    '  display: flex; align-items: center; gap: 16px;',
    '  padding: 10px 28px;',
    '  background: rgba(253,250,245,0.95);',
    '  backdrop-filter: blur(12px);',
    '  -webkit-backdrop-filter: blur(12px);',
    '  border-top: 1px solid var(--mp-border);',
    '  box-shadow: 0 -2px 16px rgba(0,0,0,0.05);',
    '  height: 56px;',
    '}',

    /* 封面小图 */
    '.mp-thumb {',
    '  width: 36px; height: 36px; border-radius: 50%;',
    '  overflow: hidden; flex-shrink: 0;',
    '  box-shadow: 0 1px 4px rgba(0,0,0,0.1);',
    '}',
    '.mp-thumb img { width: 100%; height: 100%; object-fit: cover; }',

    /* 歌曲信息 */
    '.mp-info {',
    '  min-width: 0; flex-shrink: 1;',
    '}',
    '.mp-song-title {',
    '  font-size: 13px; font-weight: 600; color: var(--mp-ink);',
    '  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;',
    '}',
    '.mp-song-artist {',
    '  font-size: 11px; color: var(--mp-ink3);',
    '}',

    /* 进度条 */
    '.mp-progress-wrap {',
    '  flex: 1; min-width: 80px; cursor: pointer;',
    '}',
    '.mp-progress-bar {',
    '  height: 4px; background: #e8e2d8;',
    '  border-radius: 2px; overflow: hidden;',
    '}',
    '.mp-progress-fill {',
    '  height: 100%; width: 0%; background: var(--mp-olive);',
    '  border-radius: 2px; transition: width 0.1s linear;',
    '}',

    /* 时间 */
    '.mp-time {',
    '  font-size: 11px; color: var(--mp-ink3); white-space: nowrap;',
    '}',

    /* 按钮 */
    '.mp-controls {',
    '  display: flex; align-items: center; gap: 12px; flex-shrink: 0;',
    '}',
    '.mp-btn {',
    '  background: none; border: none; cursor: pointer;',
    '  color: var(--mp-ink2); transition: all 0.2s;',
    '  display: flex; align-items: center; justify-content: center;',
    '  font-size: 13px; padding: 4px;',
    '}',
    '.mp-btn:hover { color: var(--mp-olive); }',
    '.mp-btn-play {',
    '  width: 30px; height: 30px; border-radius: 50%;',
    '  background: var(--mp-olive); color: #fff; font-size: 12px;',
    '}',
    '.mp-btn-play:hover { background: #7d8f76; color: #fff; }',

    /* 音量 */
    '.mp-volume-wrap {',
    '  display: flex; align-items: center; gap: 5px; flex-shrink: 0;',
    '}',
    '.mp-volume-bar {',
    '  width: 50px; height: 3px; background: #e8e2d8;',
    '  border-radius: 2px; cursor: pointer;',
    '}',
    '.mp-volume-fill {',
    '  height: 100%; width: 70%; background: var(--mp-brown);',
    '  border-radius: 2px;',
    '}',

    /* 小唱片 */
    '.mp-record-wrap {',
    '  position: relative; flex-shrink: 0;',
    '  width: 36px; height: 36px;',
    '}',
    '.mp-record {',
    '  width: 36px; height: 36px; border-radius: 50%;',
    '  background: repeating-radial-gradient(circle at 50% 50%,',
    '    #2a2520 0px,#1a1510 2px,#2a2520 4px,#1a1510 6px,#2a2520 8px,',
    '    #1a1510 10px,#2a2520 12px,#1a1510 14px,#2a2520 16px,#1a1510 18px,',
    '    #2a2520 20px,#1a1510 22px,#2a2520 24px,#1a1510 26px,#2a2520 28px,',
    '    #1a1510 30px,#2a2520 32px,#1a1510 34px,#2a2520 36px',
    '  );',
    '  box-shadow: 0 1px 6px rgba(0,0,0,0.2), inset 0 0 16px rgba(255,255,255,0.03);',
    '}',
    '.mp-record::after {',
    '  content: ""; position: absolute; inset: 0; border-radius: 50%;',
    '  background: radial-gradient(ellipse at 35% 30%, rgba(255,255,255,0.15) 0%, transparent 50%);',
    '  pointer-events: none;',
    '}',
    '.mp-record.spinning {',
    '  animation: vinyl-spin 2s linear infinite;',
    '}',
    '@keyframes vinyl-spin {',
    '  from { transform: rotate(0deg); }',
    '  to { transform: rotate(360deg); }',
    '}',

    /* 音符 */
    '.mp-note {',
    '  position: absolute; pointer-events: none; z-index: 10;',
    '  font-size: 12px; opacity: 0;',
    '  animation: note-float 2.2s ease-out forwards;',
    '}',
    '@keyframes note-float {',
    '  0%   { opacity: 0; transform: translate(0,0) scale(0.5); }',
    '  15%  { opacity: 0.7; }',
    '  85%  { opacity: 0.4; }',
    '  100% { opacity: 0; transform: translate(var(--nx), var(--ny)) scale(1.2); }',
    '}',

    /* 收起 */
    '.mp-close-btn {',
    '  background: none; border: none; cursor: pointer;',
    '  color: var(--mp-ink3); font-size: 12px; padding: 4px;',
    '  transition: color 0.2s; flex-shrink: 0;',
    '}',
    '.mp-close-btn:hover { color: var(--mp-ink); }',
    '#music-player.collapsed .mp-bar { display: none; }',
    '#music-player.collapsed ~ .mp-toggle { display: flex; }',
    '#music-player:not(.collapsed) ~ .mp-toggle { display: none; }',

    '.mp-toggle {',
    '  position: fixed; bottom: 16px; right: 20px; z-index: 9998;',
    '  width: 34px; height: 34px; border-radius: 50%;',
    '  background: var(--mp-bg); border: 1px solid var(--mp-border);',
    '  cursor: pointer; font-size: 14px; color: var(--mp-ink2);',
    '  box-shadow: 0 2px 10px rgba(0,0,0,0.06);',
    '  display: flex; align-items: center; justify-content: center;',
    '  transition: all 0.3s;',
    '}',
    '.mp-toggle:hover { color: var(--mp-olive); }',
    '#music-player.collapsed ~ .mp-toggle { bottom: 16px; }',

    '@media (max-width: 768px) {',
    '  .mp-bar { padding: 8px 14px; gap: 10px; height: 48px; }',
    '  .mp-info { display: none; }',
    '  .mp-progress-wrap { min-width: 40px; }',
    '  .mp-time { display: none; }',
    '  .mp-volume-wrap { display: none; }',
    '}',
  ].join('\n');
  document.head.appendChild(style);

  // ── 构建 DOM ──
  function buildPlayer() {
    var player = document.createElement('div');
    player.id = 'music-player';
    player.className = 'collapsed';
    player.innerHTML =
      '<div class="mp-bar">' +
        // 封面
        '<div class="mp-thumb">' +
          (currentTrack.cover ? '<img src="' + currentTrack.cover + '" alt="cover">' : '<span style="font-size:16px;">🎵</span>') +
        '</div>' +
        // 歌曲信息
        '<div class="mp-info">' +
          '<div class="mp-song-title">' + currentTrack.title + '</div>' +
          '<div class="mp-song-artist">' + currentTrack.artist + '</div>' +
        '</div>' +
        // 进度条
        '<div class="mp-progress-wrap">' +
          '<div class="mp-progress-bar"><div class="mp-progress-fill"></div></div>' +
        '</div>' +
        // 时间
        '<div class="mp-time"><span class="mp-current">0:00</span> / <span class="mp-duration">0:00</span></div>' +
        // 控制按钮
        '<div class="mp-controls">' +
          '<button class="mp-btn mp-btn-prev" title="上一曲"><i class="fa-solid fa-backward-step"></i></button>' +
          '<button class="mp-btn mp-btn-play" title="播放"><i class="fa-solid fa-play"></i></button>' +
          '<button class="mp-btn mp-btn-next" title="下一曲"><i class="fa-solid fa-forward-step"></i></button>' +
        '</div>' +
        // 音量
        '<div class="mp-volume-wrap">' +
          '<i class="fa-solid fa-volume-high" style="font-size:11px;color:var(--mp-ink3);"></i>' +
          '<div class="mp-volume-bar"><div class="mp-volume-fill"></div></div>' +
        '</div>' +
        // 小唱片
        '<div class="mp-record-wrap">' +
          '<div class="mp-record"></div>' +
        '</div>' +
        '<button class="mp-close-btn" title="收起"><i class="fa-solid fa-xmark"></i></button>' +
      '</div>';
    document.body.appendChild(player);

    var toggle = document.createElement('button');
    toggle.className = 'mp-toggle';
    toggle.title = '音乐';
    toggle.innerHTML = '<i class="fa-solid fa-music"></i>';
    document.body.appendChild(toggle);
  }

  buildPlayer();

  // ── 元素引用 ──
  var playerEl = document.getElementById('music-player');
  var bar = playerEl.querySelector('.mp-bar');
  var record = playerEl.querySelector('.mp-record');
  var playBtn = playerEl.querySelector('.mp-btn-play');
  var prevBtn = playerEl.querySelector('.mp-btn-prev');
  var nextBtn = playerEl.querySelector('.mp-btn-next');
  var progressWrap = playerEl.querySelector('.mp-progress-wrap');
  var progressFill = playerEl.querySelector('.mp-progress-fill');
  var timeCurrent = playerEl.querySelector('.mp-current');
  var timeDuration = playerEl.querySelector('.mp-duration');
  var volumeBar = playerEl.querySelector('.mp-volume-bar');
  var volumeFill = playerEl.querySelector('.mp-volume-fill');
  var toggleBtn = document.querySelector('.mp-toggle');
  var recordWrap = playerEl.querySelector('.mp-record-wrap');

  // ── 音符 ──
  var notes = ['♪','♫','♩','♬','♡'];
  var noteTimer = null;

  function spawnNote() {
    var note = document.createElement('span');
    note.className = 'mp-note';
    note.textContent = notes[Math.floor(Math.random() * notes.length)];
    note.style.setProperty('--nx', (Math.random() * 50 - 25) + 'px');
    note.style.setProperty('--ny', -(Math.random() * 60 + 20) + 'px');
    note.style.left = (50 + Math.random() * 20) + '%';
    note.style.bottom = '100%';
    recordWrap.appendChild(note);
    setTimeout(function() { note.remove(); }, 2300);
  }

  function startNotes() {
    if (noteTimer) return;
    spawnNote();
    noteTimer = setInterval(spawnNote, 900);
  }

  function stopNotes() {
    clearInterval(noteTimer);
    noteTimer = null;
  }

  // ── 进度 ──
  function fmtTime(s) {
    if (isNaN(s) || !isFinite(s)) return '0:00';
    var m = Math.floor(s / 60);
    var sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  audio.addEventListener('loadedmetadata', function() {
    timeDuration.textContent = fmtTime(audio.duration);
  });

  audio.addEventListener('timeupdate', function() {
    var pct = audio.duration ? (audio.currentTime / audio.duration * 100) : 0;
    progressFill.style.width = pct + '%';
    timeCurrent.textContent = fmtTime(audio.currentTime);
  });

  progressWrap.addEventListener('click', function(e) {
    if (!audio.duration) return;
    var rect = progressWrap.getBoundingClientRect();
    var pct = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pct * audio.duration;
  });

  // ── 播放 ──
  function play() {
    audio.play().then(function() {
      isPlaying = true;
      record.classList.add('spinning');
      playBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      startNotes();
    }).catch(function() {});
  }

  function pause() {
    audio.pause();
    isPlaying = false;
    record.classList.remove('spinning');
    playBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
    stopNotes();
  }

  playBtn.addEventListener('click', function() {
    if (isPlaying) { pause(); } else { play(); }
  });

  // ── 切歌 ──
  function loadTrack(idx) {
    trackIndex = (idx + playlist.length) % playlist.length;
    var t = playlist[trackIndex];
    currentTrack = t;
    playerEl.querySelector('.mp-song-title').textContent = t.title;
    playerEl.querySelector('.mp-song-artist').textContent = t.artist;
    audio.src = t.src;
    var thumb = playerEl.querySelector('.mp-thumb');
    if (t.cover) {
      thumb.innerHTML = '<img src="' + t.cover + '" alt="cover">';
    } else {
      thumb.innerHTML = '<span style="font-size:16px;">🎵</span>';
    }
    audio.load();
    if (isPlaying) { play(); }
  }

  prevBtn.addEventListener('click', function() { loadTrack(trackIndex - 1); });
  nextBtn.addEventListener('click', function() { loadTrack(trackIndex + 1); });
  audio.addEventListener('ended', function() { loadTrack(trackIndex + 1); });

  // ── 音量 ──
  audio.volume = 0.7;
  volumeBar.addEventListener('click', function(e) {
    var rect = volumeBar.getBoundingClientRect();
    var pct = (e.clientX - rect.left) / rect.width;
    audio.volume = Math.max(0, Math.min(1, pct));
    volumeFill.style.width = (audio.volume * 100) + '%';
  });

  // ── 收起/展开 ──
  toggleBtn.addEventListener('click', function() {
    playerEl.classList.remove('collapsed');
  });

  var closeBtn = playerEl.querySelector('.mp-close-btn');
  closeBtn.addEventListener('click', function() {
    playerEl.classList.add('collapsed');
  });

  // ── 加载 ──
  audio.src = currentTrack.src;
  audio.load();

})();
