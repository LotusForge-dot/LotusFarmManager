// ==========================================
// Lotus Farm Manager
// app.js
// Version 0.9.0
// ==========================================

const app = document.getElementById("app");
let recordList = [];
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
        </div>

        <hr>

        <h3>データ管理</h3>

        <div class="menu" style="flex-direction: column; margin-top:20px;">
            <button id="btnBackup">💾 バックアップ</button>
            <button id="btnRestore">📥 復元</button>
        </div>
    `;

    document.getElementById("btnFieldMaster")
        .addEventListener("click", showFieldMaster);

    document.getElementById("btnWorkMaster")
        .addEventListener("click", showWorkMaster);

    document.getElementById("btnMaterialMaster")
        .addEventListener("click", showMaterialMaster);
document.getElementById("btnBackup")
    .addEventListener("click", exportBackup);
    document.getElementById("btnBackup")
        .addEventListener("click", exportBackup);

    document.getElementById("btnRestore")
    .addEventListener("click", () => {
        alert("復元機能は開発中です。");
    });

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

    recordList
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    
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

})
 .forEach(record => {

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

    html += "</table>";

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
