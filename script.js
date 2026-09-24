const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const state={checkins:JSON.parse(localStorage.getItem("sc_checkins")||"[]"),settings:JSON.parse(localStorage.getItem("sc_settings")||"{}")};

function save(){localStorage.setItem("sc_checkins",JSON.stringify(state.checkins));localStorage.setItem("sc_settings",JSON.stringify(state.settings))}
function toast(msg){const el=$("#toast");el.textContent=msg;el.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>el.classList.remove("show"),2400)}
function openModal(id){$("#"+id).classList.add("open")}
function closeModal(id){$("#"+id).classList.remove("open")}

function navigate(id){
  $$(".page").forEach(p=>p.classList.toggle("active",p.id===id));
  $$(".nav-link").forEach(b=>b.classList.toggle("active",b.dataset.nav===id));
  window.scrollTo({top:0,behavior:"smooth"});
}
$$("[data-nav]").forEach(b=>b.addEventListener("click",()=>navigate(b.dataset.nav)));

$$("[data-close]").forEach(b=>b.addEventListener("click",()=>closeModal(b.dataset.close)));
$$(".modal").forEach(m=>m.addEventListener("click",e=>{if(e.target===m)m.classList.remove("open")}));
$("#accessBtn").addEventListener("click",()=>openModal("accessModal"));
$("#urgentBtn").addEventListener("click",()=>openModal("urgentModal"));
$("#closeUrgent").addEventListener("click",()=>closeModal("urgentModal"));
$("#chatCareLink").addEventListener("click",()=>{closeModal("consultModal");navigate("care")});

function applySettings(){
  document.body.classList.toggle("large-text",!!state.settings.largeText);
  document.body.classList.toggle("high-contrast",!!state.settings.highContrast);
  document.body.classList.toggle("reduced-motion",!!state.settings.reducedMotion);
  ["largeText","highContrast","reducedMotion"].forEach(k=>{
    const el=$("#"+k);if(el)el.checked=!!state.settings[k];
    const modalBtn=$('[data-setting="'+k+'"]');if(modalBtn)modalBtn.classList.toggle("active",!!state.settings[k]);
  });
}
["largeText","highContrast","reducedMotion"].forEach(k=>{
  const el=$("#"+k);el.addEventListener("change",()=>{state.settings[k]=el.checked;save();applySettings();toast(el.checked?"Pengaturan diaktifkan":"Pengaturan dimatikan")});
  const modalBtn=$('[data-setting="'+k+'"]');modalBtn.addEventListener("click",()=>{state.settings[k]=!state.settings[k];save();applySettings();toast("Pengaturan aksesibilitas diperbarui")});
});
applySettings();

const aiReplies=[
  {keys:["cemas","pertandingan","kompetisi"],text:"Wajar kalau pertandingan penting membuat pikiran terasa lebih ramai. Coba pisahkan hal yang bisa kamu kendalikan hari ini: persiapan, komunikasi dengan tim, dan kebutuhan aksesmu. Kalau kamu mau, kita bisa membuat rutinitas 5 menit sebelum bertanding."},
  {keys:["motivasi","latihan","malas"],text:"Kalau motivasi sedang turun, kamu tidak harus langsung memaksa diri kembali 100%. Coba tentukan satu target kecil untuk sesi latihan berikutnya. Jika penurunan motivasi berlangsung lama atau mulai mengganggu aktivitasmu, berbicara dengan psikolog olahraga juga bisa membantu."},
  {keys:["performa","menurun","gagal"],text:"Performa yang naik-turun tidak otomatis berarti kemampuanmu menurun. Selain hasil, coba perhatikan tidur, beban latihan, recovery, dan tekanan yang sedang kamu hadapi. Kita bisa membahas faktor mana yang paling terasa berat."},
  {keys:["cedera","recovery","pemulihan"],text:"Cedera bisa memengaruhi tubuh sekaligus rasa percaya diri. Rasa frustrasi atau takut tertinggal juga bisa muncul selama recovery. Untuk keputusan medis dan program kembali berolahraga, tetap ikuti tenaga kesehatanmu. Dari sisi mental, kita bisa membahas cara menghadapi ketidakpastian dan menjaga rutinitas yang realistis."},
  {keys:["takut","cedera lagi","kembali"],text:"Takut cedera kembali setelah recovery adalah kekhawatiran yang bisa terasa nyata. Kamu bisa menyampaikannya kepada fisioterapis, dokter, atau psikolog olahraga agar proses return-to-sport mempertimbangkan kesiapan fisik dan mentalmu."},
  {keys:["fasilitas","aksesibel","akses"],text:"Hambatan fasilitas bukan sesuatu yang harus kamu tanggung sendirian. Coba catat kebutuhan spesifikmu—misalnya akses masuk, ruang ganti, alat latihan, transportasi, atau informasi—lalu komunikasikan kepada pengelola fasilitas atau tim. Jika hambatan ini membuatmu tertekan, kita juga bisa membahas dampaknya ke well-being."},
  {keys:["pelatih","tim","dukungan"],text:"Kebutuhan atlet difabel bisa berbeda, dan komunikasi yang jelas dapat membantu tim memahami dukungan yang kamu perlukan. Kamu bisa mulai dengan menyebut situasi spesifik, dampaknya terhadap latihan, lalu kebutuhan atau solusi yang kamu harapkan."},
  {keys:["sedih","emosional","bercerita"],text:"Terima kasih sudah mau cerita. Kamu tidak perlu langsung mencari solusi. Kalau kamu nyaman, ceritakan apa yang paling berat akhir-akhir ini dan sejak kapan kamu merasakannya. Kalau perasaan ini terus mengganggu keseharianmu, dukungan profesional bisa menjadi langkah berikutnya."},
  {keys:["karier","masa depan","pensiun"],text:"Membayangkan kehidupan setelah karier olahraga memang bisa terasa tidak pasti. Kamu bisa mulai mengeksplorasi identitas dan minat di luar kompetisi secara bertahap. Psikolog olahraga juga dapat membantu proses transisi ini."},
  {keys:["lelah","kompetisi","capek"],text:"Setelah kompetisi, tubuh dan pikiran sama-sama membutuhkan recovery. Beri ruang untuk istirahat, evaluasi secara bertahap, dan jangan menjadikan satu hasil pertandingan sebagai ukuran seluruh perjalananmu."},
  {keys:["psikolog","profesional","konsultasi"],text:"Tentu. SahabatCare menempatkan psikolog sebagai dukungan utama ketika kamu membutuhkan percakapan yang lebih personal. Kamu bisa membuka menu Konsultasi dan memilih chat, voice call, atau video call."}
];
function makeReply(input){
  const t=input.toLowerCase();
  const hit=aiReplies.find(r=>r.keys.some(k=>t.includes(k)));
  return hit?hit.text:"Aku dengar kamu. Setiap pengalaman atlet itu bisa berbeda, apalagi ketika ada kebutuhan akses dan tekanan olahraga yang bersamaan. Coba ceritakan sedikit lebih spesifik: apa yang paling mengganggu kamu saat ini, dan apa yang kamu harapkan bisa berubah?";
}
function addMessage(text,type){
  const wrap=$("#chatMessages"), item=document.createElement("div");item.className="message "+type;
  const bubble=document.createElement("div");bubble.className="bubble";bubble.textContent=text;
  const time=document.createElement("span");time.textContent="Baru saja";item.append(bubble,time);wrap.append(item);wrap.scrollTop=wrap.scrollHeight;
}
function sendChat(){
  const input=$("#chatInput"),text=input.value.trim();if(!text)return;
  addMessage(text,"user");input.value="";
  setTimeout(()=>addMessage(makeReply(text),"bot"),350);
}
$("#sendChat").addEventListener("click",sendChat);$("#chatInput").addEventListener("keydown",e=>{if(e.key==="Enter")sendChat()});
$$("[data-prompt]").forEach(b=>b.addEventListener("click",()=>{const t=b.dataset.prompt;addMessage(t,"user");setTimeout(()=>addMessage(makeReply(t),"bot"),350)}));
$("#clearChat").addEventListener("click",()=>{$("#chatMessages").innerHTML='<div class="message bot"><div class="bubble">Percakapan dibersihkan. Kamu bisa mulai lagi kapan saja.</div><span>Baru saja</span></div>';toast("Percakapan dibersihkan")});

const phqQuestions=[
  ["DEPRESI","Merasa gugup, cemas, atau gelisah"],
  ["DEPRESI","Tidak mampu menghentikan atau mengendalikan rasa khawatir"],
  ["KECEMASAN","Kurang berminat atau bergairah dalam melakukan sesuatu"],
  ["KECEMASAN","Merasa murung, tertekan, atau putus asa"]
];
const phqOptions=["Tidak sama sekali","Beberapa hari","Lebih dari setengah hari","Hampir setiap hari"];
let checkStep=0,answers=[],safetyFlag=false;

function renderCheck(){
  const q=phqQuestions[checkStep],box=$("#checkinContent");
  $("#stepLabel").textContent="PHQ-4 • Pertanyaan "+(checkStep+1)+" dari 4";
  $("#progressPct").textContent=Math.round((checkStep+1)/4*100)+"%";
  $("#progressBar").style.width=((checkStep+1)/4*100)+"%";
  box.innerHTML='<span class="question-tag">'+q[0]+'</span><h2>'+q[1]+'</h2><p class="question-help">Pilih jawaban yang paling sesuai dengan keadaanmu selama 2 minggu terakhir.</p><div class="choice-grid">'+phqOptions.map((x,i)=>'<button data-choice="'+i+'">'+x+'</button>').join("")+'</div>';
  $$(".choice-grid button",box).forEach(btn=>btn.addEventListener("click",()=>{
    answers.push(Number(btn.dataset.choice));
    if(checkStep<phqQuestions.length-1){checkStep++;renderCheck()}else{renderSafetyCheck()}
  }));
}

function renderSafetyCheck(){
  $("#stepLabel").textContent="PHQ-4 • Pemeriksaan keselamatan";
  $("#progressPct").textContent="100%";
  $("#progressBar").style.width="100%";
  $("#checkinContent").innerHTML='<span class="question-tag">SAFETY CHECK</span><h2>Apakah ada kondisi saat ini yang membuatmu merasa tidak aman atau membutuhkan bantuan segera?</h2><p class="question-help">Pertanyaan ini membantu menentukan apakah jalur dukungan perlu segera dialihkan ke bantuan profesional.</p><div class="choice-grid"><button data-safety="no">Tidak</button><button data-safety="yes">Ya, saya butuh bantuan</button></div>';
  $$("#checkinContent [data-safety]").forEach(btn=>btn.addEventListener("click",()=>{
    safetyFlag=btn.dataset.safety==="yes";
    finishCheck();
  }));
}

function getRisk(score,safety){
  if(safety || score>=9) return {
    key:"high",label:"Risiko tinggi",title:"Diperlukan dukungan profesional segera",
    text:"Hasil screening menunjukkan perlunya eskalasi ke tenaga profesional sesuai protokol keselamatan. SahabatAI tidak menjadi intervensi utama pada jalur ini."
  };
  if(score>=3) return {
    key:"medium",label:"Risiko sedang",title:"Perlu perhatian lebih lanjut",
    text:"Hasil screening menunjukkan adanya gejala yang perlu diperhatikan. SahabatCare merekomendasikan konsultasi dengan psikolog/psikiater dan monitoring berkelanjutan."
  };
  return {
    key:"low",label:"Risiko rendah",title:"Lanjutkan monitoring",
    text:"Hasil screening tidak menunjukkan gejala bermakna pada PHQ-4 dan tidak ada indikator keselamatan yang dipilih. SahabatCare menyediakan psikoedukasi, latihan relaksasi, jurnal, dan monitoring rutin."
  };
}

function finishCheck(){
  const score=answers.reduce((a,b)=>a+b,0);
  const risk=getRisk(score,safetyFlag);
  const date=new Date().toLocaleDateString("id-ID",{day:"numeric",month:"short",year:"numeric"});
  state.checkins.unshift({date,score,risk:risk.key,safety:safetyFlag});
  state.checkins=state.checkins.slice(0,8);save();
  const action=safetyFlag||risk.key==="high"
    ? '<button class="btn btn-primary" data-nav="care">Hubungi profesional</button><button class="btn btn-soft" id="againCheck">Ulangi screening</button>'
    : risk.key==="medium"
      ? '<button class="btn btn-primary" data-nav="care">Konsultasi psikolog</button><button class="btn btn-soft" id="againCheck">Ulangi screening</button>'
      : '<button class="btn btn-primary" id="againCheck">Monitoring lagi nanti</button><button class="btn btn-soft" data-nav="ai">Buka SahabatAI</button>';
  $("#checkinContent").innerHTML='<div class="result-card '+risk.key+'"><div class="result-top"><span class="risk-dot '+risk.key+'"></span><b>'+risk.label+'</b><span class="result-score">PHQ-4 '+score+'/12</span></div><h2>'+risk.title+'</h2><p>'+risk.text+'</p></div><p class="screening-note">PHQ-4 adalah alat skrining, bukan diagnosis. Hasil perlu dipahami dalam konteks kondisi individu dan, bila diperlukan, dikonfirmasi oleh tenaga profesional.</p><div class="hero-actions">'+action+'</div>';
  $("#againCheck").addEventListener("click",()=>{checkStep=0;answers=[];safetyFlag=false;renderCheck()});
  $$("[data-nav]",$("#checkinContent")).forEach(btn=>btn.addEventListener("click",()=>navigate(btn.dataset.nav)));
  renderHistory();toast("PHQ-4 berhasil disimpan");
}

function renderHistory(){
  const el=$("#historyList");
  el.innerHTML=state.checkins.length
    ? state.checkins.map(x=>'<div class="history-item"><span><b>'+x.date+'</b><br><small style="color:var(--muted)">'+x.risk+(x.safety?' • indikator keselamatan':'')+'</small></span><span class="score-pill">PHQ-4 '+x.score+'/12</span></div>').join("")
    : '<p class="empty-state">Belum ada screening tersimpan. Lakukan PHQ-4 untuk memulai monitoring.</p>';
}
renderCheck();renderHistory();

$$("[data-consult]").forEach(b=>b.addEventListener("click",()=>{const type=b.dataset.consult;$("#consultTitle").textContent=type==="video"?"Video consultation":type==="voice"?"Voice consultation":"Chat consultation";$("#consultText").textContent="Pilih metode yang nyaman. Ini hanya simulasi interaksi untuk prototype SahabatCare.";$("#consultSuccess").hidden=true;$("#consultDone").hidden=true;openModal("consultModal")}));
$$("[data-demo]").forEach(b=>b.addEventListener("click",()=>{$("#consultSuccess").textContent="✓ "+b.dataset.demo+" dipilih. Dalam versi nyata, sesi akan terhubung ke profesional yang tersedia.";$("#consultSuccess").hidden=false;$("#consultDone").hidden=false}));
$("#consultDone").addEventListener("click",()=>closeModal("consultModal"));

$("#clearData").addEventListener("click",()=>{if(confirm("Hapus seluruh data demo yang tersimpan di browser ini?")){localStorage.removeItem("sc_checkins");localStorage.removeItem("sc_settings");state.checkins=[];state.settings={};applySettings();renderHistory();toast("Data lokal dihapus")}});

document.addEventListener("keydown",e=>{if(e.key==="Escape")$$(".modal.open").forEach(m=>m.classList.remove("open"))});
