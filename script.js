(() => {
  const cfg = window.LOVEOS_CONFIG || {};
  const ui = cfg.ui || {};
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const setText = (id, value) => { const el = $("#"+id); if(el) el.textContent = value; };
  const desktop = $("#desktop"), backdrop = $("#modal-backdrop"), appTitle = $("#app-title"), appContent = $("#app-content");
  const toastEl = $("#toast"), notification = $("#notification");
  let activeApp = null, toastTimer, notificationTimer;
  const name = cfg.girlfriendName || "солнышко";
  const yourName = cfg.yourName || "твой человек";
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const txt=(key,fallback)=>ui[key]??fallback;
  function applyConfig(){
    setText("brand-label",txt("siteName","LoveOS X"));
    setText("welcome-title",txt("welcomeTitle","Добро пожаловать ♡"));
    setText("welcome-edition",(txt("siteName","LoveOS X")+" · "+txt("edition","ANNIVERSARY EDITION")).toUpperCase());
    setText("greeting",txt("greeting","Привет, буся!").replace("буся",name));
    setText("welcome-lead",txt("welcomeLead","Я сделал для тебя маленький уголок интернета."));
    setText("month-label",txt("monthLabel","Один месяц вместе"));
    setText("welcome-button",txt("welcomeButton","Открыть моё письмо"));
    const note=$("#desktop-note"); if(note) note.innerHTML=esc(txt("desktopNote","счастье — это ехать рядом"))+" <span>✧</span>";
    setText("notification-title",txt("notificationTitle","Уведомление от Купидона"));
    Object.entries(ui.desktopIcons||{}).forEach(([key,value])=>{const el=$(`[data-label="${key}"]`);if(el)el.textContent=value});
    (ui.dockTitles||[]).forEach((value,i)=>{const el=$$(".dock-app")[i];if(el)el.title=value});
    setText("boot-subtitle",txt("bootSubtitle","Подготавливаем котиков и сердечки"));
    setText("skip-boot",txt("bootButton","Пропустить загрузку ♡"));
  }
  function toast(message){toastEl.textContent=message;toastEl.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toastEl.classList.remove("show"),2400)}
  function openApp(app){
    activeApp=app;
    const views={
      home:[txt("homeTitle","Рабочий стол"),`<div class="note-card"><strong>${esc(txt("homeHeading","Всё на своих местах ♡"))}</strong><p>${esc(txt("homeBody","Выбери приложение в Dock или на рабочем столе. Тут спрятано несколько маленьких сюрпризов."))}</p></div><button class="aqua-button" data-app="letter">${esc(txt("homeButton","Начать с письма →"))}</button>`],
      letter:[txt("letterTitle","Письмо тебе"),`<h2>${esc(txt("letterHeadingPrefix","Для тебя,"))} ${esc(name)} ♡</h2><div class="letter">${esc(cfg.letter || "Я очень рад, что ты есть в моей жизни. С нашим маленьким праздником!").replace(/\n/g,"<br><br>")}</div><p class="signature">${esc(txt("letterSignaturePrefix","С любовью,"))} ${esc(yourName)} ♡</p>`],
      memories:[txt("memoriesTitle","Наши моменты"),`<h2>${esc(txt("memoriesHeading","Наши любимые моменты"))}</h2><p>${esc(txt("memoriesBody","Коллекция растёт. Как и моё желание проводить с тобой время. Совпадение? Не думаю."))}</p><div class="memory-grid">${(cfg.memories||[]).map(m=>`<div class="memory"><div class="emoji">${esc(m.emoji)}</div><b>${esc(m.title)}</b><div>${esc(m.text)}</div></div>`).join("")}</div>`],
      reasons:[txt("reasonsTitle","Почему ты"),`<h2>${esc(txt("reasonsHeading","Мне нравится в тебе…"))}</h2><div class="reason-list">${(cfg.reasons||[]).map((r,i)=>`<div class="reason"><b>${i+1}.</b>${esc(r)}</div>`).join("")}</div>`],
      gallery:[txt("galleryTitle","Котоплёнка"),`<h2>${esc(txt("galleryHeading","Отдел пушистого счастья 🐈"))}</h2><p>${esc(txt("galleryBody","Эти ребята назначены ответственными за милоту и моральную поддержку наших отношений."))}</p><div class="cat-grid">${(cfg.cats||[]).map(c=>`<div class="cat-card"><img loading="lazy" src="${esc(c.image)}" alt="Милый котик"></div>`).join("")}</div>`],
      rides:[txt("ridesTitle","Наш велодневник"),`<h2>${esc(txt("ridesHeading","Наш маленький велоклуб 🚲"))}</h2><p>${esc(txt("ridesBody","Главное правило клуба: ехать вместе. Второе правило: если увидели красивое место — остановиться. Третье: перекус тоже считается частью маршрута."))}</p><div class="memory-grid">${(cfg.rides||[]).map(r=>`<div class="memory"><div class="emoji">${esc(r.emoji)}</div><b>${esc(r.title)}</b><div>${esc(r.text)}</div></div>`).join("")}</div><div class="note-card"><strong>${esc(txt("ridesFooterTitle","Статус маршрута: вместе ♡"))}</strong><p>${esc(txt("ridesFooterBody","Пункт назначения не так важен, если рядом ты. Хотя кофейня по пути — очень важный waypoint."))}</p></div>`],
      surprise:[txt("surpriseTitle","Сюрприз.zip"),`<div class="surprise-box"><div class="big-gift">🎁</div><h2>${esc(txt("surpriseHeading","Маленький сюрприз"))}</h2><p>${esc(txt("surpriseBody","Этот подарок нельзя измерить в мегабайтах. Но в нём точно много нежности."))}</p><button class="aqua-button pink-button" id="reveal-surprise">${esc(txt("surpriseButton","Распаковать подарок ♡"))}</button><div id="surprise-result"></div></div>`]
    };
    const view=views[app]||["Приложение не найдено",`<div class="note-card"><strong>Кажется, это окошко ещё не установлено ♡</strong><p>Проверь название приложения в index.html и наличие соответствующего раздела в script.js.</p></div>`];appTitle.textContent=view[0];appContent.innerHTML=view[1];backdrop.classList.add("open");
    const reveal=$("#reveal-surprise");if(reveal)reveal.addEventListener("click",()=>{$("#surprise-result").innerHTML=`<div class="note-card"><strong>${esc(txt("surpriseRevealTitle","Ты — мой любимый сюрприз."))}</strong><p>${esc(txt("surpriseRevealBody","И я хочу продолжать узнавать тебя, радовать и собирать с тобой новые счастливые моменты. ❤️"))}</p><div style="font-size:30px">🐈‍⬛ 💗 🐈</div></div>`;reveal.textContent=txt("surpriseDone","Подарок распакован!")});
  }
  function closeApp(){backdrop.classList.remove("open");activeApp=null}
  document.addEventListener("click",e=>{
    const trigger=e.target.closest("[data-app]");if(trigger){const app=trigger.dataset.app;if(app==="home"&&activeApp){closeApp();return}openApp(app)}
    if(e.target.id==="app-close"||e.target.classList.contains("close")){if(e.target.id==="app-close"||e.target.closest("#app-window"))closeApp()}
    if(e.target.id==="app-min")closeApp();
    if(e.target.id==="app-zoom"){$("#app-window").classList.toggle("expanded")}
  });
  $("#modal-backdrop").addEventListener("click",e=>{if(e.target===backdrop)closeApp()});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")closeApp()});
  $(".close",$("#welcome-window")).addEventListener("click",()=>{$("#welcome-window").style.display="none";toast(txt("toastClosed","Окошко спряталось ♡"))});
  $(".minimize",$("#welcome-window")).addEventListener("click",()=>{$("#welcome-window").style.transform="translate(-50%,120vh)";setTimeout(()=>$("#welcome-window").style.display="none",180)});
  $(".zoom",$("#welcome-window")).addEventListener("click",()=>toast(txt("zoomToast","Это окошко уже в самом уютном размере ♡")));
  function tick(){const d=new Date();$("#clock").textContent=d.toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"})}tick();setInterval(tick,30000);
  function hideNotification(){notification.classList.remove("show")}
  $("#notification-close").addEventListener("click",hideNotification);
  function showNotification(){const messages=ui.notifications||["Ты кому-то очень нравишься. Это не ошибка системы."];if(!messages.length)return;$("#notification-message").textContent=messages[Math.floor(Math.random()*messages.length)];notification.classList.add("show");clearTimeout(notificationTimer);notificationTimer=setTimeout(hideNotification,5200)}
  if(cfg.notificationsEnabled!==false)setTimeout(()=>{showNotification();setInterval(showNotification,Math.max(30000,Number(cfg.notificationDelay)||26000))},8500);
  let bootFinished=false;
  function finishBoot(){if(bootFinished)return;bootFinished=true;const boot=$("#boot-screen");if(!boot)return;boot.classList.add("boot-done");setTimeout(()=>boot.remove(),650)}
  $("#skip-boot").addEventListener("click",finishBoot);
  document.body.classList.add("booting");
  const bootFailsafe=setTimeout(finishBoot,Math.max(1200,Number(cfg.bootDuration)||2200));
  try { applyConfig(); } catch(error) { console.error("LoveOS config error:",error); }
  // A gentle cat-like sparkle trail, disabled on touch devices.
  if(!("ontouchstart" in window)){let last=0;document.addEventListener("mousemove",e=>{const now=Date.now();if(now-last<180)return;last=now;if(Math.random()>.72){const s=document.createElement("span");s.textContent="♥";s.className="sparkle";s.style.cssText=`position:fixed;left:${e.clientX}px;top:${e.clientY}px;color:#ffe5f3;pointer-events:none;z-index:40;font-size:12px;animation:fadeSpark .7s forwards`;document.body.appendChild(s);setTimeout(()=>s.remove(),700)}})}
  const style=document.createElement("style");style.textContent="@keyframes fadeSpark{to{opacity:0;transform:translateY(-12px) scale(.5)}}.app-window.expanded{width:min(900px,calc(100vw - 24px));max-height:88vh}";document.head.appendChild(style);
})();