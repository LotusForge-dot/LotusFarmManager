// ==========================================
// Lotus Farm Manager
// app.js
// Version 0.9.0
// ==========================================

const app = document.getElementById("app");
let recordList = [];
let planMaterials = [];

let editingRecordIndex = -1;
// ------------------------
// 作業記録
// ------------------------
// ------------------------
// 作業記録
// ------------------------

function showRecord() {
　const buttonText =
    editingRecordIndex === -1
        ? "💾 保存"
        : "💾 更新";
    app.innerHTML = `

        <h2>📝 作業記録</h2>

        <br>

        <label>日付</label><br>
        <input type="date" id="recordDate"><br><br>

        <label>田んぼ</label><br>
        <select id="recordField">
            <option value="">選択してください</option>
        </select><br><br>

        <label>作業</label><br>
        <select id="recordWork">
            <option value="">選択してください</option>
        </select><br><br>
<h3>資材一覧</h3>

<div id="materialContainer">
</div>

<button type="button" id="btnAddMaterial">
➕ 資材追加
</button>

<br><br>
        

        <label>備考</label><br>
        <textarea id="recordMemo"></textarea><br><br>

        <button id="btnSaveRecord">
    ${buttonText}
</button>
        
        <hr>

<h3>作業記録一覧</h3>

<div id="recordList">
    <p>まだ記録がありません。</p>
</div>

    `;


            document
    .getElementById("btnSaveRecord")
    .addEventListener("click", saveRecord);

        
        renderFieldOptions();
renderWorkOptions();

addMaterialRow();

document
    .getElementById("btnAddMaterial")
    .addEventListener("click", addMaterialRow);

document
    .getElementById("recordWork")
    .addEventListener("change", renderMaterialOptions);
renderRecordList();
setToday();
if (editingRecordIndex !== -1) {
    loadRecordForEdit();
}
}

// ------------------------
// 履歴
// -----------------------
function showHistory() {

    app.innerHTML = `

        <h2>📋 作業履歴</h2>
        <div class="search-box">

<h3>🔍 検索条件</h3>

<br>
<label>年</label>

<select id="historyYear">
    <option value="">全て</option>
</select>
        <label>田んぼ</label>
        

<select id="historyField">
    <option value="">全て</option>
</select>
<label>作業</label>

<select id="historyWork">
    <option value="">全て</option>
</select>
<label>開始日</label>

<input type="date" id="historyFrom">

<br><br>

<label>終了日</label>

<input type="date" id="historyTo">
<button id="btnClearHistorySearch">
    🧹 検索条件クリア
</button>

</div>

<hr>

<h3>📋 検索結果</h3>

<div id="historyList">

<br><br>

<br><br>
<br><br>
<br><br>


        <div id="historyList">
            <p>まだ記録がありません。</p>
        </div>

    `;
renderHistoryFieldOptions();
renderHistoryWorkOptions();
renderHistoryYearOptions();

renderHistoryList();
 document
    .getElementById("historyWork")
    .addEventListener("change", renderHistoryList);   
document
    .getElementById("historyField")
    .addEventListener("change", renderHistoryList);
    document
    .getElementById("historyFrom")
    .addEventListener("change", renderHistoryList);

document
    .getElementById("historyTo")
    .addEventListener("change", renderHistoryList);
    document
    .getElementById("btnClearHistorySearch")
    .addEventListener("click", clearHistorySearch);
    document
    .getElementById("historyYear")
    .addEventListener("change", renderHistoryList);
}
// ------------------------
// 設定
// ------------------------
function showSettings() {

    app.innerHTML = `
        <h2>⚙️ 設定</h2>

        <h3>マスタ管理</h3>

        <div class="menu" style="flex-direction: column; margin-top:20px;">
            <button id="btnFieldMaster">田んぼマスタ</button>
            <button id="btnWorkMaster">作業マスタ</button>
            <button id="btnMaterialMaster">資材マスタ</button>
            <button onclick="showFertilizerPlan()">    🌱施肥設計</button>
        </div>

        <hr>

        <h3>データ管理</h3>

        <div class="menu" style="flex-direction: column; margin-top:20px;">
            <button id="btnSave">
💾 セーブ
</button>

<button id="btnBackupHistory">
📦 バックアップ
</button>

<button id="btnRestore">
📥 復元
</button>
        </div>
    `;

    document.getElementById("btnFieldMaster")
        .addEventListener("click", showFieldMaster);

    document.getElementById("btnWorkMaster")
        .addEventListener("click", showWorkMaster);

    document.getElementById("btnMaterialMaster")
        .addEventListener("click", showMaterialMaster);


    document.getElementById("btnRestore")
    .addEventListener("click", importBackup);


document
    .getElementById("btnSave")
    .addEventListener("click", exportBackup);

document
    .getElementById("btnBackupHistory")
    .addEventListener("click", exportBackupHistory);




}

// ------------------------
// 田んぼマスタ
// ------------------------
function showFieldMaster() {
    renderFieldMaster();
}

// ------------------------
// 作業マスタ
// ------------------------
function showWorkMaster() {
    renderWorkMaster();
}
// ------------------------
// 資材マスタ
// ------------------------
function showMaterialMaster() {
    renderMaterialMaster();
}

// ------------------------
// メニュー
// ------------------------
document.getElementById("btnRecord").addEventListener("click", () => {

    editingRecordIndex = -1;

    showRecord();

});
document.getElementById("btnHistory").addEventListener("click", showHistory);
document.getElementById("btnSettings").addEventListener("click", showSettings);


// 起動時に保存データを読み込む
loadFieldMaster();
loadWorkMaster();
loadMaterialMaster();
loadFertilizerPlanList();
loadRecordList();

// 初期画面
showRecord();

// ------------------------
// 田んぼプルダウン
// ------------------------

function renderFieldOptions() {

    const select = document.getElementById("recordField");

    fieldMaster.forEach(field => {

        select.innerHTML += `
            <option value="${field.no}">
                ${field.no}　${field.owner}
            </option>
        `;

    });

}

// ------------------------
// 作業プルダウン
// ------------------------

function renderWorkOptions() {

    const select = document.getElementById("recordWork");

    workMaster.forEach(work => {

        select.innerHTML += `
            <option value="${work.name}">
                ${work.name}
            </option>
        `;

    });

}

// ------------------------
// 資材プルダウン
// ------------------------

function renderMaterialOptions() {

    const work =
        document.getElementById("recordWork").value;

    const selects =
        document.querySelectorAll(".recordMaterial");

    selects.forEach(select => {

        const currentValue = select.value;

        select.innerHTML = `
            <option value="">選択してください</option>
        `;

        materialMaster.forEach(material => {

            if (material.works.includes(work)) {

                select.innerHTML += `
                    <option value="${material.name}">
                        ${material.name}
                    </option>
                `;

            }

        });

        select.value = currentValue;

        const unitSpan =
            select.parentElement.querySelector(".materialUnit");

        const material =
            materialMaster.find(m => m.name === currentValue);

        unitSpan.textContent =
            material ? material.unit : "";

    });

}

function saveRecord() {

    const materials = [];

    document
        .querySelectorAll(".material-row")
        .forEach(row => {

            const material =
                row.querySelector(".recordMaterial").value;

            const amount =
                row.querySelector(".recordAmount").value;

            materials.push({

                material: material,

                amount: amount

            });

        });

    const record = {

        date: document.getElementById("recordDate").value,

        field: document.getElementById("recordField").value,

        work: document.getElementById("recordWork").value,

        materials: materials,

        memo: document.getElementById("recordMemo").value

    };
    
    
// ------------------------
// 入力チェック
// ------------------------

if (record.date === "") {

    alert("日付を入力してください。");

    return;

}

if (record.field === "") {

    alert("田んぼを選択してください。");

    return;

}

if (record.work === "") {

    alert("作業を選択してください。");

    return;

}
for (const m of materials) {

    if (m.material !== "" && m.amount === "") {

        alert("資材の数量を入力してください。");

        return;

    }
if (m.material === "" && m.amount !== "") {

    alert("資材を選択してください。");

    return;

}
}

    if (editingRecordIndex === -1) {

        recordList.push(record);

    } else {

        recordList[editingRecordIndex] = record;

    }

    saveRecordList();

    editingRecordIndex = -1;

    showRecord();

}

// ------------------------
// 作業記録一覧
// ------------------------

function renderRecordList() {

    const list = document.getElementById("recordList");

    if (recordList.length === 0) {

        list.innerHTML = "<p>まだ記録がありません。</p>";

        return;

    }

    let html = `
        <table border="1" width="100%" cellspacing="0" cellpadding="5">

        <tr>
            <th>日付</th>
            <th>田んぼ</th>
            <th>作業</th>
            <th>資材</th>
            <th>備考</th>
        </tr>
    `;

     recordList
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .forEach(record => {

    const field = fieldMaster.find(f => f.no == record.field);

    const fieldText = field
        ? `No.${field.no}<br>${field.owner}`
        : `No.${record.field}`;

    html += `
        <tr>
    <td>${record.date}</td>
    <td>${fieldText}</td>
    <td>${record.work}</td>
    <td>
        ${record.materials
    .map(m => {

        const master =
            materialMaster.find(mat => mat.name === m.material);

        const unit = master ? master.unit : "";

        return `${m.material} ${m.amount}${unit}`;

    })
    .join("<br>")}
    </td>
    <td>${record.memo}</td>
</tr>
    `;

});

    html += "</table>";

    list.innerHTML = html;

}


function renderHistoryList() {
const selectedYear =
    document.getElementById("historyYear").value;
	const from =
    document.getElementById("historyFrom").value;

const to =
    document.getElementById("historyTo").value;
const selectedWork =
    document.getElementById("historyWork").value;
    const list = document.getElementById("historyList");
const selectedField =
    document.getElementById("historyField").value;
    if (recordList.length === 0) {

        list.innerHTML = "<p>まだ記録がありません。</p>";

        return;

    }

    let html = `
        <table border="1" width="100%" cellspacing="0" cellpadding="5">

  <tr>
    <th>日付</th>
    <th>田んぼ</th>
    <th>作業</th>
    <th>資材</th>
    <th>備考</th>
    <th>操作</th>
</tr>
    `;

    const filteredRecords = recordList
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    
    .filter(record => {

    if (selectedYear === "") {
        return true;
    }

    return record.date.startsWith(selectedYear);

})
    .filter(record => {

        if (selectedField === "") {
            return true;
        }

        return record.field == selectedField;

    })
    .filter(record => {

        if (selectedWork === "") {
            return true;
        }

        return record.work == selectedWork;

    })
    .filter(record => {

        if (from !== "" && record.date < from) {
            return false;
        }

        if (to !== "" && record.date > to) {
            return false;
        }

        return true;

    });
    const materialSummary = {};
    let totalN = 0;
    let totalP = 0;
    let totalK = 0;
    let totalCost = 0;
 filteredRecords.forEach(record => {
    record.materials.forEach(material => {

const master =
    materialMaster.find(m => m.name === material.material);

if (master) {

    totalN +=
        material.amount * master.weight * master.n / 100;

    totalP +=
        material.amount * master.weight * master.p / 100;

    totalK +=
        material.amount * master.weight * master.k / 100;

totalCost +=
        material.amount * master.price;

}
        if (material.material === "") {
            return;
        }

        if (!materialSummary[material.material]) {
            materialSummary[material.material] = 0;
        }

        materialSummary[material.material] +=
            Number(material.amount);

    });
    const originalIndex = recordList.indexOf(record);
    const field = fieldMaster.find(f => f.no == record.field);

    const fieldText = field
        ? `No.${field.no}<br>${field.owner}`
        : `No.${record.field}`;

    html += `
        <tr>
            <td>${record.date}</td>
            <td>${fieldText}</td>
            <td>${record.work}</td>
            <td>
    ${record.materials
    .map(m => {

        const master =
            materialMaster.find(mat => mat.name === m.material);

        const unit = master ? master.unit : "";

        return `${m.material} ${m.amount}${unit}`;

    })
    .join("<br>")}
</td>
<td>${record.memo}</td>
            <td class="action-buttons">
    <button onclick="editRecord(${originalIndex})">✏️</button>
<button onclick="deleteRecord(${originalIndex})">🗑️</button>
</td>
        </tr>
    `;

});
let materialHtml = "";

for (const name in materialSummary) {

    const master =
        materialMaster.find(m => m.name === name);

    const unit = master ? master.unit : "";

    materialHtml += `
        ${name}：${materialSummary[name]}${unit}<br>
    `;

}

if (materialHtml === "") {

    materialHtml = "使用資材なし";

}
    html += "</table>";

html += `
<hr>

<h3>📊 集計</h3>

<p>対象件数：${filteredRecords.length}件</p>

<h4>使用資材</h4>

${materialHtml}

<h4>肥料成分</h4>

N：${Number(totalN.toFixed(2))} kg<br>
P：${Number(totalP.toFixed(2))} kg<br>
K：${Number(totalK.toFixed(2))} kg

<h4>資材費</h4>

${Number(totalCost.toFixed(0)).toLocaleString()} 円
`;
list.innerHTML = html;
    

}

// ------------------------
// 今日の日付
// ------------------------

function setToday() {

    const today = new Date();

    const yyyy = today.getFullYear();

    const mm = String(today.getMonth() + 1).padStart(2, "0");

    const dd = String(today.getDate()).padStart(2, "0");

    document.getElementById("recordDate").value =
        `${yyyy}-${mm}-${dd}`;

}

function editRecord(index){

    editingRecordIndex = index;

    showRecord();

}

// ------------------------
// 編集データ読込
// ------------------------

function loadRecordForEdit() {

    const record = recordList[editingRecordIndex];

    document.getElementById("recordDate").value = record.date;
    document.getElementById("recordField").value = record.field;
    document.getElementById("recordWork").value = record.work;

    document.getElementById("materialContainer").innerHTML = "";

    record.materials.forEach(material => {

        addMaterialRow();

        const rows =
            document.querySelectorAll(".material-row");

        const row =
            rows[rows.length - 1];

        row.querySelector(".recordAmount").value =
            material.amount;

        row.querySelector(".recordMaterial").value =
            material.material;

        // ★ 単位復元
        const master =
            materialMaster.find(m => m.name === material.material);

        row.querySelector(".materialUnit").textContent =
            master ? master.unit : "";

    });

    document.getElementById("recordMemo").value = record.memo;

}

// ------------------------
// 作業記録削除
// ------------------------

function deleteRecord(index) {

    if (!confirm("この作業記録を削除しますか？")) {
        return;
    }

    recordList.splice(index, 1);

    saveRecordList();

    renderHistoryList();

}


function renderHistoryFieldOptions() {

    const select = document.getElementById("historyField");

    fieldMaster.forEach(field => {

        select.innerHTML += `
            <option value="${field.no}">
                No.${field.no} ${field.owner}
            </option>
        `;

    });

}

function renderHistoryWorkOptions() {

    const select = document.getElementById("historyWork");

    workMaster.forEach(work => {

        select.innerHTML += `
            <option value="${work.name}">
                ${work.name}
            </option>
        `;

    });

}
function clearHistorySearch() {

document.getElementById("historyYear").value = "";
    document.getElementById("historyField").value = "";

    document.getElementById("historyWork").value = "";

    document.getElementById("historyFrom").value = "";

    document.getElementById("historyTo").value = "";

    renderHistoryList();
    
    

}

function addMaterialRow() {

    const container =
        document.getElementById("materialContainer");

    const row = document.createElement("div");

    row.className = "material-row";

    row.innerHTML = `
        <label>資材</label><br>

        <select class="recordMaterial">
            <option value="">選択してください</option>
        </select>

        <br><br>

        <label>数量</label><br>

        <input
            type="number"
            class="recordAmount"
            step="0.1">

        <span class="materialUnit"></span>

        <button
            type="button"
            class="btnDeleteMaterial">
            🗑️
        </button>

        <br><br>
    `;

    container.appendChild(row);

    const select =
        row.querySelector(".recordMaterial");

    materialMaster.forEach(material => {

        if (material.works.includes(
            document.getElementById("recordWork").value
        )) {

            select.innerHTML += `
                <option value="${material.name}">
                    ${material.name}
                </option>
            `;

        }

    });

    select.addEventListener(
        "change",
        updateMaterialUnit
    );

    row
        .querySelector(".btnDeleteMaterial")
        .addEventListener("click", function () {

            deleteMaterialRow(row);

        });

    renderMaterialOptions();

}
function deleteMaterialRow(row) {

    const rows =
        document.querySelectorAll(".material-row");

    if (rows.length === 1) {

        alert("資材は1件以上必要です。");

        return;

    }

    row.remove();

}

function updateMaterialUnit(event) {

    const select = event.target;

    const material = materialMaster.find(m =>
        m.name === select.value
    );

    const unitSpan =
        select.parentElement.querySelector(".materialUnit");

    unitSpan.textContent =
        material ? material.unit : "";

}

function renderHistoryYearOptions() {

    const select =
        document.getElementById("historyYear");

    const years = [
        ...new Set(
            recordList.map(record => record.date.substring(0, 4))
        )
    ].sort().reverse();

    years.forEach(year => {

        select.innerHTML += `
            <option value="${year}">
                ${year}年
            </option>
        `;

    });

}
function showFertilizerPlan() {

    app.innerHTML = `

        <h2>🌱施肥設計</h2>

        <label>年</label>

        <select id="planYear"></select>

        <label>田んぼ</label>

        <select id="planField"></select>

        <hr>

        <div id="planArea"></div>

    `;

    renderPlanYearOptions();
renderPlanFieldOptions();
renderPlanArea();

document
    .getElementById("planYear")
    .addEventListener("change", loadFertilizerPlan);

document
    .getElementById("planField")
    .addEventListener("change", loadFertilizerPlan);

loadFertilizerPlan();
}
function loadFertilizerPlan() {

    const year =
        document.getElementById("planYear").value;

    const field =
        document.getElementById("planField").value;

    const plan =
        fertilizerPlanList.find(p =>

            p.year === year &&
            p.field === field

        );

    if (plan) {

        planMaterials =
            structuredClone(plan.materials);
            
planMaterials.forEach(material => {

    if (!("work" in material)) {

        material.work = "";

    }

});
    } else {

        planMaterials = [];

    }

    renderPlanMaterials();

}

function renderPlanYearOptions() {

    const select =
        document.getElementById("planYear");

    const year = new Date().getFullYear();

    select.innerHTML = "";

    for (let y = year - 2; y <= year + 2; y++) {

        select.innerHTML += `
            <option value="${y}">
                ${y}
            </option>
        `;

    }

    select.value = year;

}


function renderPlanFieldOptions() {

    const select =
        document.getElementById("planField");

    select.innerHTML = "";

    fieldMaster.forEach(field => {

        select.innerHTML += `
            <option value="${field.no}">
                No.${field.no}
            </option>
        `;

    });

}

function renderPlanArea() {

    const area =
        document.getElementById("planArea");

    area.innerHTML = `

        <h3>資材</h3>

        <div id="planMaterials"></div>

        <br>

        

<button onclick="addPlanWork()">
    ＋作業追加
</button>

        <br><br>

<div class="summary-card">
  <h3>施肥合計</h3>
  

  <div class="summary-card">
  <h3>🧪 施肥量</h3>

  <div>総施肥量：<span id="totalAmount">0.0</span> kg</div>
  <div>N：<span id="totalN">0.0</span> kg</div>
  <div>P：<span id="totalP">0.0</span> kg</div>
  <div>K：<span id="totalK">0.0</span> kg</div>
</div>

<br>
<div class="summary-card">
  <h3>📏 10a当たり</h3>

  <div>施肥量：<span id="per10aAmount">0.0</span> kg</div>
  <div>N：<span id="per10aN">0.0</span> kg</div>
  <div>P：<span id="per10aP">0.0</span> kg</div>
  <div>K：<span id="per10aK">0.0</span> kg</div>
</div>

<br>
<div class="summary-card">
  <h3>💰 コスト</h3>

  <div>総費用：<span id="totalPrice">0</span> 円</div>
  <div>10a当たり：<span id="per10aPrice">0</span> 円</div>
</div>

<br>

<button onclick="saveFertilizerPlan()">
    💾保存
</button>
    `;
renderPlanMaterials();
}

function addPlanMaterial(work = null) {

    if (work === null && planMaterials.length > 0) {

        work = planMaterials[
            planMaterials.length - 1
        ].work;

    }

    if (work === null) {

        work = "";

    }

    planMaterials.push({

        work: work,
        material: "",
        amount: ""

    });

    renderPlanMaterials();

}
function saveFertilizerPlan() {

    const year =
        document.getElementById("planYear").value;

    const field =
        document.getElementById("planField").value;

    const plan = {

        year,
        field,

        // 配列をコピーして保存
        materials: structuredClone(planMaterials)

    };

    const index =
        fertilizerPlanList.findIndex(p =>

            p.year === year &&
            p.field === field

        );

    if (index >= 0) {

        fertilizerPlanList[index] = plan;

    } else {

        fertilizerPlanList.push(plan);

    }

    saveFertilizerPlanList();

    alert("保存しました。");

}



function renderPlanMaterials() {

    const div =
        document.getElementById("planMaterials");

    let html = "";
const works = [
    ...new Set(
        planMaterials.map(m => m.work)
    )
];
works.forEach(work => {

    html += `

<div class="work-card">

<div class="work-header">

🌱 

<select onchange="changeWorkGroup('${work}', this.value)">

    <option value="">選択してください</option>

    ${workMaster.map(w => `
        <option
            value="${w.name}"
            ${work === w.name ? "selected" : ""}
        >
            ${w.name}
        </option>
    `).join("")}

</select>

</div>
`;
    planMaterials.forEach((material, index) => {

        if (material.work !== work) {
            return;
        }
    

        html += `
            <div>



資材
<select
    onchange="changePlanMaterial(${index}, this.value)">

    <option value="">選択してください</option>

    ${materialMaster
        .filter(master => {

            if (material.work === "") {
                return true;
            }

            return master.works.includes(material.work);

        })
        .map(master => `
            <option
                value="${master.name}"
                ${material.material === master.name ? "selected" : ""}
            >
                ${master.name}
            </option>
        `)
        .join("")}

</select>

数量

<input
    type="number"
    value="${material.amount}"
    onchange="changePlanAmount(${index}, this.value)">

${(() => {

    const master =
        materialMaster.find(
            m => m.name === material.material
        );

    return master ? master.unit : "";

})()}

<button
    onclick="deletePlanMaterial(${index})">
    🗑️
</button>

</div>

<br>
                `;

        });

    html += `
<button onclick="addPlanMaterial('${work}')">
    ＋資材追加
</button>

<br><br>
</div>
`;

});
div.innerHTML = html;

    updateFertilizerSummary();

}

function changePlanWork(index, value) {

    planMaterials[index].work = value;

    // 作業が変わったら資材をリセット
    planMaterials[index].material = "";

    renderPlanMaterials();

}
function changePlanMaterial(index, value) {

   

    planMaterials[index].material = value;

    renderPlanMaterials();

}
function changePlanAmount(index, value) {

    planMaterials[index].amount = Number(value);

    renderPlanMaterials();

}

function deletePlanMaterial(index) {

    planMaterials.splice(index, 1);

    renderPlanMaterials();

}

function updateFertilizerSummary() {
    let totalAmount = 0;
    let totalN = 0;
    let totalP = 0;
    let totalK = 0;
let totalPrice = 0;
    planMaterials.forEach(material => {

    const master = materialMaster.find(
        m => m.name === material.material
    );

    if (!master) return;

    const amount = Number(material.amount) || 0;
    const weight = Number(master.weight) || 0;
const price = Number(master.price) || 0;

totalPrice += amount * price;
    const totalKg = amount * weight;

    totalAmount += totalKg;

    totalN += totalKg * (Number(master.n) || 0) / 100;
    totalP += totalKg * (Number(master.p) || 0) / 100;
    totalK += totalKg * (Number(master.k) || 0) / 100;

});

    document.getElementById("totalAmount").textContent = totalAmount.toFixed(1);
    document.getElementById("totalN").textContent = totalN.toFixed(1);
    document.getElementById("totalP").textContent = totalP.toFixed(1);
    document.getElementById("totalK").textContent = totalK.toFixed(1);
    document.getElementById("totalPrice").textContent =   totalPrice.toLocaleString();
    const fieldNo = document.getElementById("planField").value;

console.log("fieldNo =", fieldNo);
console.log("fieldMaster =", fieldMaster);

const field =
    fieldMaster.find(f => String(f.no) === String(fieldNo));
const area = Number(field.area);
let per10aAmount = 0;
let per10aN = 0;
let per10aP = 0;
let per10aK = 0;
let per10aPrice = 0;
if (area > 0) {
    per10aAmount = totalAmount / area;
    per10aN = totalN / area;
    per10aP = totalP / area;
    per10aK = totalK / area;
    per10aPrice = totalPrice / area;
}
document.getElementById("per10aAmount").textContent =
    per10aAmount.toFixed(1);

document.getElementById("per10aN").textContent =
    per10aN.toFixed(1);

document.getElementById("per10aP").textContent =
    per10aP.toFixed(1);

document.getElementById("per10aK").textContent =
    per10aK.toFixed(1);
console.log(per10aAmount);
console.log(area);
console.log("field =", field);
document.getElementById("per10aPrice").textContent =
    per10aPrice.toLocaleString();

}

function addPlanWork() {

    planMaterials.push({

        work: "",
        material: "",
        amount: ""

    });

    renderPlanMaterials();

}
function changeWorkGroup(oldWork, newWork) {

    planMaterials.forEach(material => {

        if (material.work === oldWork) {

            material.work = newWork;

        }

    });

    renderPlanMaterials();

}
