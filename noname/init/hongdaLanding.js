import "../../noname.js";
import { lib } from "../library/index.js";
import { game } from "../game/index.js";
function showHongdaLanding(autoConnecting) {
  if (autoConnecting) {
    return;
  }
  if (sessionStorage.getItem("hongda_goto_offline")) {
    sessionStorage.removeItem("hongda_goto_offline");
    return;
  }
  const FONT = `"STKaiti","KaiTi","xinwei",serif`;
  const css = (el, text) => {
    el.style.cssText = text;
  };
  const overlay = document.createElement("div");
  overlay.id = "hongda-landing";
  css(
    overlay,
    `position:fixed!important;inset:0!important;left:0!important;top:0!important;right:0!important;bottom:0!important;
		z-index:2147483647!important;display:flex!important;flex-direction:column!important;align-items:center!important;
		justify-content:center!important;margin:0!important;padding:0!important;writing-mode:horizontal-tb!important;
		background:radial-gradient(circle at 50% 30%,#2c2521,#0c0a09 72%)!important;`
  );
  const title = document.createElement("div");
  title.id = "hongda-title";
  title.textContent = "hongda三国杀";
  css(
    title,
    `position:relative!important;color:#e8c98f!important;font-family:${FONT}!important;font-size:64px!important;letter-spacing:6px!important;
		margin:0 0 56px 0!important;padding:0!important;line-height:1.2!important;text-align:center!important;
		white-space:nowrap!important;writing-mode:horizontal-tb!important;text-shadow:0 2px 14px rgba(0,0,0,.85)!important;`
  );
  const row = document.createElement("div");
  css(
    row,
    `position:relative!important;display:flex!important;flex-direction:row!important;gap:40px!important;align-items:center!important;
		justify-content:center!important;writing-mode:horizontal-tb!important;margin:0!important;padding:0!important;`
  );
  const makeBtn = (label, id) => {
    const b = document.createElement("div");
    b.id = id;
    b.textContent = label;
    css(
      b,
      `position:relative!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important;
			font-family:${FONT}!important;font-size:30px!important;color:#f4e9d2!important;cursor:pointer!important;
			padding:18px 48px!important;min-width:170px!important;border-radius:14px!important;border:2px solid #b8924f!important;
			background:linear-gradient(180deg,#5a3f28,#3a2818)!important;box-shadow:0 6px 18px rgba(0,0,0,.5)!important;
			white-space:nowrap!important;writing-mode:horizontal-tb!important;line-height:1!important;
			transition:transform .12s,box-shadow .12s!important;`
    );
    b.onmouseenter = () => b.style.transform = "translateY(-3px)";
    b.onmouseleave = () => b.style.transform = "translateY(0)";
    return b;
  };
  const offlineBtn = makeBtn("单机模式", "hongda-offline");
  const onlineBtn = makeBtn("联机模式", "hongda-online");
  row.appendChild(offlineBtn);
  row.appendChild(onlineBtn);
  const tip = document.createElement("div");
  tip.textContent = "联机模式将自动进入大厅，可直接创建房间";
  css(
    tip,
    `position:relative!important;color:#8a7a63!important;font-family:${FONT}!important;font-size:18px!important;margin:46px 0 0 0!important;
		padding:0!important;text-align:center!important;white-space:nowrap!important;writing-mode:horizontal-tb!important;`
  );
  overlay.appendChild(title);
  overlay.appendChild(row);
  overlay.appendChild(tip);
  document.body.appendChild(overlay);
  offlineBtn.onclick = () => {
    if (lib.config.mode === "connect") {
      sessionStorage.setItem("hongda_goto_offline", "1");
      game.saveConfig("mode", "identity");
      game.reload();
    } else {
      overlay.remove();
    }
  };
  onlineBtn.onclick = () => {
    showHongdaSetup();
  };
}
function showHongdaSetup() {
  const FONT = `"STKaiti","KaiTi","xinwei",serif`;
  const css = (el, text) => {
    el.style.cssText = text;
  };
  const CUSTOM_NAMES = {
    hongda_kevin: "Kevin",
    hongda_yuchao: "宇超",
    hongda_hongda: "Hongda",
    hongda_tonysensei: "Tony老师",
    hongda_robin: "Robin",
    hongda_robin2: "Robin2",
    hongda_tonylil: "小Tony",
    hongda_tonylil2: "小Tony2",
    hongda_wangqian: "王谦",
    hongda_liaozirong: "廖梓荣"
  };
  for (const id in CUSTOM_NAMES) {
    if (!lib.translate[id]) {
      lib.translate[id] = CUSTOM_NAMES[id];
    }
  }
  const AVATARS = [
    "hongda_kevin",
    "hongda_yuchao",
    "hongda_hongda",
    "hongda_tonysensei",
    "hongda_wangqian",
    "hongda_robin",
    "hongda_robin2",
    "hongda_tonylil",
    "hongda_tonylil2",
    "hongda_liaozirong",
    "caocao",
    "simayi",
    "xiahoudun",
    "guojia",
    "zhenji",
    "liubei",
    "guanyu",
    "zhangfei",
    "zhugeliang",
    "zhaoyun",
    "machao",
    "huangyueying",
    "sunquan",
    "zhouyu",
    "ganning",
    "daqiao",
    "xiaoqiao",
    "sunshangxiang",
    "lvbu",
    "diaochan"
  ];
  let chosenAvatar = "";
  const modal = document.createElement("div");
  modal.id = "hongda-setup";
  css(
    modal,
    `position:fixed!important;inset:0!important;left:0!important;top:0!important;right:0!important;bottom:0!important;
		z-index:2147483647!important;display:flex!important;flex-direction:column!important;align-items:center!important;
		justify-content:center!important;margin:0!important;padding:20px!important;box-sizing:border-box!important;
		writing-mode:horizontal-tb!important;background:radial-gradient(circle at 50% 30%,#2c2521,#0a0908 75%)!important;`
  );
  const heading = document.createElement("div");
  heading.textContent = "进入大厅前，先设置你的昵称和头像";
  css(
    heading,
    `position:relative!important;color:#e8c98f!important;font-family:${FONT}!important;font-size:30px!important;
		margin:0 0 24px 0!important;padding:0!important;text-align:center!important;white-space:nowrap!important;
		writing-mode:horizontal-tb!important;text-shadow:0 2px 10px rgba(0,0,0,.8)!important;`
  );
  const nameInput = document.createElement("input");
  nameInput.type = "text";
  nameInput.maxLength = 12;
  nameInput.placeholder = "输入昵称（最多12字）";
  const savedName = lib.config.connect_nickname;
  nameInput.value = savedName && savedName !== "无名玩家" ? savedName : "";
  css(
    nameInput,
    `position:relative!important;display:block!important;box-sizing:border-box!important;width:300px!important;
		font-family:${FONT}!important;font-size:22px!important;color:#f4e9d2!important;text-align:center!important;
		padding:12px 16px!important;margin:0 0 22px 0!important;border-radius:10px!important;border:2px solid #b8924f!important;
		background:rgba(0,0,0,.45)!important;outline:none!important;writing-mode:horizontal-tb!important;`
  );
  const gridLabel = document.createElement("div");
  gridLabel.textContent = "选择头像";
  css(
    gridLabel,
    `position:relative!important;color:#c8b48a!important;font-family:${FONT}!important;font-size:18px!important;
		margin:0 0 12px 0!important;text-align:center!important;writing-mode:horizontal-tb!important;`
  );
  const grid = document.createElement("div");
  css(
    grid,
    `position:relative!important;display:grid!important;grid-template-columns:repeat(10,56px)!important;gap:8px!important;
		justify-content:center!important;max-width:90vw!important;margin:0 0 24px 0!important;
		max-height:30vh!important;overflow:auto!important;padding:4px!important;writing-mode:horizontal-tb!important;`
  );
  const cells = {};
  const selectAvatar = (id) => {
    chosenAvatar = id;
    for (const k in cells) {
      cells[k].style.border = k === id ? "3px solid #ffd86b" : "2px solid transparent";
      cells[k].style.boxShadow = k === id ? "0 0 10px #ffd86b" : "none";
    }
  };
  AVATARS.forEach((id) => {
    const cell = document.createElement("div");
    cell.title = lib.translate[id] || id;
    css(
      cell,
      `position:relative!important;width:56px!important;height:70px!important;border-radius:8px!important;cursor:pointer!important;
			background-image:url("image/character/${id}.jpg")!important;background-size:cover!important;background-position:top center!important;
			border:2px solid transparent!important;box-sizing:border-box!important;transition:transform .1s!important;writing-mode:horizontal-tb!important;`
    );
    cell.onmouseenter = () => cell.style.transform = "scale(1.06)";
    cell.onmouseleave = () => cell.style.transform = "scale(1)";
    cell.onclick = () => selectAvatar(id);
    cells[id] = cell;
    grid.appendChild(cell);
  });
  if (chosenAvatar) {
    selectAvatar(chosenAvatar);
  }
  const warn = document.createElement("div");
  css(
    warn,
    `position:relative!important;color:#e07a5f!important;font-family:${FONT}!important;font-size:16px!important;
		min-height:22px!important;margin:0 0 10px 0!important;text-align:center!important;writing-mode:horizontal-tb!important;`
  );
  const btnRow = document.createElement("div");
  css(btnRow, `position:relative!important;display:flex!important;flex-direction:row!important;gap:24px!important;writing-mode:horizontal-tb!important;`);
  const mkBtn = (label, primary) => {
    const b = document.createElement("div");
    b.textContent = label;
    css(
      b,
      `position:relative!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;
			box-sizing:border-box!important;font-family:${FONT}!important;font-size:24px!important;cursor:pointer!important;
			padding:14px 40px!important;min-width:130px!important;border-radius:12px!important;white-space:nowrap!important;
			writing-mode:horizontal-tb!important;line-height:1!important;border:2px solid #b8924f!important;
			color:${primary ? "#f4e9d2" : "#c8b48a"}!important;
			background:${primary ? "linear-gradient(180deg,#5a3f28,#3a2818)" : "rgba(0,0,0,.35)"}!important;`
    );
    return b;
  };
  const backBtn = mkBtn("返回", false);
  const enterBtn = mkBtn("进入大厅", true);
  backBtn.onclick = () => modal.remove();
  enterBtn.onclick = () => {
    const name = (nameInput.value || "").replace(/\s+/g, " ").trim();
    if (!name || name === "无名玩家") {
      warn.textContent = "请填写一个昵称（不能为空或“无名玩家”）";
      return;
    }
    if (!chosenAvatar) {
      warn.textContent = "请选择一个头像";
      return;
    }
    game.saveConfig("connect_nickname", name);
    game.saveConfig("connect_nickname", name, "connect");
    game.saveConfig("connect_avatar", chosenAvatar);
    game.saveConfig("connect_avatar", chosenAvatar, "connect");
    sessionStorage.setItem("hongda_autoconnect", "1");
    game.saveConfig("mode", "connect");
    game.reload();
  };
  btnRow.appendChild(backBtn);
  btnRow.appendChild(enterBtn);
  modal.appendChild(heading);
  modal.appendChild(nameInput);
  modal.appendChild(gridLabel);
  modal.appendChild(grid);
  modal.appendChild(warn);
  modal.appendChild(btnRow);
  document.body.appendChild(modal);
  setTimeout(() => nameInput.focus(), 50);
}
export {
  showHongdaLanding
};
