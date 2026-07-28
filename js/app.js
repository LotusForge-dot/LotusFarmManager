// ==========================================
// Lotus Farm Manager
// app.js
// Version 4.8.0
// ==========================================

// ------------------------------------------
// グローバル変数定義と初期化
// ------------------------------------------
const app = document.getElementById("app");
let recordList = [];
let planMaterials = [];

let editingRecordIndex = -1; // 編集中のレコードインデックス（-1は新規登録）
let recordDate = getToday();
let fertilizerTab = "design";
// ------------------------
// 入力画面
// ------------------------

// 現在選択中の入力タブ
let inputTab = "shipment";
// 肥料入力モード（元肥・追肥）
let fertilizerMode = "base";
// ----------------------
// 選択中の田んぼID
let selectedFieldIds = [];


// ------------------------
// 元肥入力中の資材一覧
// ------------------------
let baseFertilizerList = [];

// ------------------------
// 追肥入力中の資材一覧
// ------------------------
let topFertilizerList = [];

// 編集画面用データ
let editFields = [];

// ------------------------
// 展開中の資材
// ------------------------
let openedMaterials = [];
// ------------------------
// 選択中の追肥作業
// ------------------------
let selectedTopWork = "追肥①";

let historyTab = "shipment";
// ------------------------
// 作業記録
// ------------------------
// ------------------------
// 作業記録
// ------------------------

// 作業記録画面の生成と表示
function showRecord() {
    // ボタンのテキストを新規と編集で切り替え
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


    // 記録保存ボタンのイベントリスナー設定
    document
    .getElementById("btnSaveRecord")
    .addEventListener("click", saveRecord);

        
    // プルダウン等の初期化と初回描画
    renderFieldOptions();
    renderWorkOptions();

    addMaterialRow(); // 初期表示として資材入力行を1行追加

    // イベントリスナーの登録（資材追加、作業変更時の連動）
    document
    .getElementById("btnAddMaterial")
    .addEventListener("click", addMaterialRow);

    document
    .getElementById("recordWork")
    .addEventListener("change", renderMaterialOptions);
    renderRecordList();
    setToday(); // 日付初期値に今日を設定
    // 編集モードの場合は既存データをフォームに読み込む
    if (editingRecordIndex !== -1) {
        loadRecordForEdit();
    }
}

// ------------------------
// 履歴
// -----------------------
// 作業履歴画面の生成と表示
// 作業・出荷履歴画面
function showHistory() {

    let historyHtml = "";

    if (historyTab === "shipment") {

        historyHtml = getShipmentHistoryHtml();

    } else {

        historyHtml = `

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
                <p>まだ記録がありません。</p>
            </div>

        `;

    }

    app.innerHTML = `

        <h2>📋 履歴</h2>

        <div class="tab-container">

            <button
                class="${historyTab === "shipment" ? "tab active" : "tab"}"
                onclick="changeHistoryTab('shipment')">

                📦 出荷

            </button>

            <button
                class="${historyTab === "work" ? "tab active" : "tab"}"
                onclick="changeHistoryTab('work')">

                🌱 作業

            </button>

        </div>

        ${historyHtml}

    `;

    // 作業履歴だけ検索イベントを設定
    if (historyTab === "work") {

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
            .getElementById("historyYear")
            .addEventListener("change", renderHistoryList);

        document
            .getElementById("btnClearHistorySearch")
            .addEventListener("click", clearHistorySearch);

    }
if (historyTab === "shipment") {

    renderShipmentHistoryFieldOptions();
    renderShipmentHistoryYearOptions();

    renderShipmentHistory();

    document
        .getElementById("shipmentHistoryYear")
        .addEventListener("change", renderShipmentHistory);

    document
        .getElementById("shipmentHistoryField")
        .addEventListener("change", renderShipmentHistory);

    document
        .getElementById("shipmentHistoryDestination")
        .addEventListener("change", renderShipmentHistory);

    document
        .getElementById("shipmentHistoryFrom")
        .addEventListener("change", renderShipmentHistory);

    document
        .getElementById("shipmentHistoryTo")
        .addEventListener("change", renderShipmentHistory);

    document
        .getElementById("btnClearShipmentHistorySearch")
        .addEventListener("click", clearShipmentHistorySearch);
renderShipmentHistoryDestinationOptions();
}
}
// ------------------------
// 設定
// ------------------------
// 設定画面の生成と表示
function showSettings() {
console.log("showSettings");
    app.innerHTML = `
        <h2>⚙️ 設定</h2>

        <h3>マスタ管理</h3>

        <div class="menu" style="flex-direction: column; margin-top:20px;">
            <button id="btnFieldMaster">田んぼマスタ</button>
            <button id="btnWorkMaster">作業マスタ</button>
            <button id="btnMaterialMaster">資材マスタ</button>
            <button id="btnPriceMaster">    💰価格マスタ</button>
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

    // 各各種設定ボタンへのイベントリスナー設定
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
document
    .getElementById("btnPriceMaster")
    .addEventListener("click", renderPriceMaster);



}

// ------------------------
// 田んぼマスタ
// ------------------------
// 田んぼマスタ画面呼び出し
function showFieldMaster() {
    renderFieldMaster();
}

// ------------------------
// 作業マスタ
// ------------------------
// 作業マスタ画面呼び出し
function showWorkMaster() {
    renderWorkMaster();
}
// ------------------------
// 資材マスタ
// ------------------------
// 資材マスタ画面呼び出し
function showMaterialMaster() {
    renderMaterialMaster();
}

// ------------------------
// メニュー
// ------------------------
// グローバルナビゲーションのクリックイベント設定
document.getElementById("btnRecord").addEventListener("click", () => {

    editingRecordIndex = -1; // 編集状態をクリアして新規作成にする

    showInput();
});
document.getElementById("btnHistory").addEventListener("click", showHistory);
document.getElementById("btnSettings").addEventListener("click", showSettings);


// 起動時に保存データを読み込む
loadFieldMaster();
loadWorkMaster();
loadMaterialMaster();
loadFertilizerPlanList();
loadRecordList();
loadTemplateMaster();
showInput();
loadPriceMaster();
// ------------------------
// 田んぼプルダウン
// ------------------------
// 作業記録用：田んぼ選択プルダウンをマスタから生成
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
// 作業記録用：作業選択プルダウンをマスタから生成
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
// 選択された作業に応じて使用可能な資材プルダウンを更新
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

            // 資材マスタ側で使用可能作業に含まれている場合のみ選択肢に追加
            if (material.works.includes(work)) {

                select.innerHTML += `
                    <option value="${material.name}">
                        ${material.name}
                    </option>
                `;

            }

        });

        select.value = currentValue; // 選択されていた値を復元

        // 選択されている資材の単位表示を更新
        const unitSpan =
            select.parentElement.querySelector(".materialUnit");

        const material =
            materialMaster.find(m => m.name === currentValue);

        unitSpan.textContent =
            material ? material.unit : "";

    });

}

// 入力された作業記録の保存（新規・編集共通）
function saveRecord() {

    const materials = [];

    // 画面上のすべての資材入力行からデータを取得
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
// 資材と数量のペアチェック
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

    // 新規登録か編集更新かで処理を分岐
    if (editingRecordIndex === -1) {

        recordList.push(record);

    } else {

        recordList[editingRecordIndex] = record;

    }

    saveRecordList(); // ローカルストレージへ永続化

    editingRecordIndex = -1; // 編集状態をクリア

    showRecord(); // 画面をリフレッシュ

}

// ------------------------
// 作業記録一覧
// ------------------------
// 作業記録画面の下部に表示される直近の全一覧を描画
/**
 * 作業記録一覧を表示する
 */
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
            <th>作業</th>
            <th>内容</th>
            <th>備考</th>
        </tr>
    `;

    recordList
        .slice()
        .sort((a, b) => b.date.localeCompare(a.date))
        .forEach(record => {
console.log(record);
    console.log(record.fields);

            // 田んぼ・資材一覧を作成
            const detailText = record.fields
                .map(field => {

                    const fieldInfo =
                        fieldMaster.find(f => f.no == field.fieldNo);

                    const fieldName = fieldInfo
                        ? `No.${fieldInfo.no} ${fieldInfo.owner}`
                        : `No.${field.fieldNo}`;

                    const materials = field.materials
                        .map(material => {

                            const master = materialMaster.find(
                                m => m.name === material.material
                            );

                            const unit = master ? master.unit : "袋";

                            return `${material.material} ${material.amount}${unit}`;

                        })
                        .join("<br>");

                    return `
                        <b>${fieldName}</b><br>
                        ${materials}
                    `;

                })
                .join("<hr>");

            html += `
                <tr>
                    <td>${record.date}</td>
                    <td>${record.work}</td>
                    <td>${detailText}</td>
                    <td>${record.memo || ""}</td>
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

    const selectedField =
        document.getElementById("historyField").value;

    const list =
        document.getElementById("historyList");

    if (recordList.length === 0) {
        list.innerHTML = "<p>まだ記録がありません。</p>";
        return;
    }

    let html = "";

    const filteredRecords = recordList
        .slice()
        .sort((a, b) => b.date.localeCompare(a.date))
        .filter(record => {
            if (selectedYear !== "" && !record.date.startsWith(selectedYear)) {
                return false;
            }

            if (selectedWork !== "" && record.work !== selectedWork) {
                return false;
            }

            if (from !== "" && record.date < from) {
                return false;
            }

            if (to !== "" && record.date > to) {
                return false;
            }

            if (selectedField !== "") {
                return record.fields.some(field =>
                    String(field.fieldNo) === String(selectedField)
                );
            }

            return true;
        });

    // ------------------------
    // 履歴集計
    // ------------------------
    const summary = calculateHistorySummary(
        filteredRecords,
        selectedField
    );

    html += createHistoryListHtml(
        filteredRecords
    );

    html += createHistorySummaryHtml(
        filteredRecords,
        summary.materialSummary,
        summary.totalN,
        summary.totalP,
        summary.totalK,
        summary.totalCost
    );

    list.innerHTML = html;
}

// ------------------------
// 今日の日付
// ------------------------
// 入力フォームの日付を本日の日付（YYYY-MM-DDフォーマット）に設定
function setToday() {

    const today = new Date();

    const yyyy = today.getFullYear();

    const mm = String(today.getMonth() + 1).padStart(2, "0");

    const dd = String(today.getDate()).padStart(2, "0");

    document.getElementById("recordDate").value =
        `${yyyy}-${mm}-${dd}`;

}

// 指定したインデックスの記録を編集状態にする
function editRecord(index) {

    // 編集中レコード
    editingRecordIndex = index;

    // 編集データを読み込み
    loadTopFertilizerForEdit();

    // 編集画面を表示
    showTopFertilizerEdit();

}
// ------------------------
// 編集データ読込
// ------------------------
// 編集時、対象レコードの既存データを入力欄にマッピング・復元
function loadRecordForEdit() {

    const record = recordList[editingRecordIndex];

    document.getElementById("recordDate").value = record.date;
    document.getElementById("recordField").value = record.field;
    document.getElementById("recordWork").value = record.work;

    document.getElementById("materialContainer").innerHTML = "";

    // 記録されている資材の数だけ入力行を生成して値をセット
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
// 作業記録を配列から削除し、ストレージ保存と履歴再描画
function deleteRecord(index) {

    if (!confirm("この作業記録を削除しますか？")) {
        return;
    }

    recordList.splice(index, 1);

    saveRecordList();

    renderHistoryList();

}


// 履歴検索用：田んぼ選択プルダウンの選択肢生成
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

// 履歴検索用：作業選択プルダウンの選択肢生成
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
// 履歴検索条件のクリア処理
function clearHistorySearch() {

    document.getElementById("historyYear").value = "";
    document.getElementById("historyField").value = "";

    document.getElementById("historyWork").value = "";

    document.getElementById("historyFrom").value = "";

    document.getElementById("historyTo").value = "";

    renderHistoryList();
    
    

}

// 資材入力行をDOMに追加する処理
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

    // 現在選択されている作業に対応する資材のみを選択肢に並べる
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

    // 資材が選ばれたら単位を自動変更するイベント
    select.addEventListener(
        "change",
        updateMaterialUnit
    );

    // 削除ボタン押下時のイベント
    row
        .querySelector(".btnDeleteMaterial")
        .addEventListener("click", function () {

            deleteMaterialRow(row);

        });

    renderMaterialOptions();

}
// 資材入力行の削除（最低1行は残す）
function deleteMaterialRow(row) {

    const rows =
        document.querySelectorAll(".material-row");

    if (rows.length === 1) {

        alert("資材は1件以上必要です。");

        return;

    }

    row.remove();

}

// 資材変更時、該当資材マスタの単位を表示させる処理
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

// 履歴検索用：記録が存在するユニークな「年」を抽出してプルダウン化
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
// 施肥設計画面の生成と表示
function showFertilizerPlan() {

    app.innerHTML = `

        <h2>🌱施肥設計</h2>

        <div class="tab-container">

            <button
                class="${
                    fertilizerTab === "design"
                        ? "tab-button active"
                        : "tab-button"
                }"
                onclick="changeFertilizerTab('design')">

                🌱 設計

            </button>

            <button
                class="${
                    fertilizerTab === "summary"
                        ? "tab-button active"
                        : "tab-button"
                }"
                onclick="changeFertilizerTab('summary')">

                📦 集計

            </button>

        </div>

        <hr>

        <div id="planContent"></div>

    `;

    if (fertilizerTab === "design") {

        document.getElementById("planContent").innerHTML = `

            <label>年</label>

            <select id="planYear"></select>

            <label>田んぼ</label>

            <select id="planField"></select>

            <br><br>

            <label>テンプレート</label>

            <br>

            <select id="commonTemplateSelect"></select>

            <button onclick="loadTemplateSelect()">
                📂読込
            </button>

            <button onclick="deleteCommonTemplate()">
                🗑
            </button>

            <br>

            <button onclick="saveTemplate({ type: 'standard' })">
                🌱標準化
            </button>

            <button onclick="saveCommonTemplate()">
                💾共通保存
            </button>

            <hr>

            <div id="planArea"></div>

        `;

        renderPlanYearOptions();
        renderPlanFieldOptions();
        renderPlanArea();
        renderTemplateSelect();

        document
            .getElementById("planYear")
            .addEventListener("change", loadFertilizerPlan);

        document
            .getElementById("planField")
            .addEventListener("change", loadFertilizerPlan);

        loadFertilizerPlan();

    } else {

        renderFertilizerSummary();

    }

}
//========================================
// タブ切り換え
//========================================
function changeFertilizerTab(tab) {

    fertilizerTab = tab;

    showFertilizerPlan();

}
//========================================
// 施肥設計データ取得
//========================================
function getFertilizerPlan(year, field) {

    return fertilizerPlanList.find(plan =>

        plan.year === year &&
        plan.field === field

    );

}
// 選択中の年・田んぼに対応する既存の施肥設計データを読み込む
function loadFertilizerPlan() {

    const year =
        document.getElementById("planYear").value;

    const field =
        document.getElementById("planField").value;

    const plan =
    getFertilizerPlan(year, field);

    if (plan) {

        planMaterials =
            structuredClone(plan.materials); // ディープコピーで作業用変数へ代入
            
        // 下位互換用：データ構造にworkキーがなければ空文字で初期化
        planMaterials.forEach(material => {

            if (!("work" in material)) {

                material.work = "";

            }

        });
    } else {

        planMaterials = []; // データがなければ新規空配列

    }

    renderPlanMaterials();
    renderTemplateSelect();

}

// 施肥設計用：現在の年を中心に前後2年ずつのプルダウン選択肢を生成
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


// 施肥設計用：田んぼ選択プルダウンの選択肢生成
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

// 施肥設計下部の集計表示エリアおよび保存ボタンなどのHTML構造を描画
function renderPlanArea() {

    const area =
        document.getElementById("planArea");

    area.innerHTML = `

        <h3>資材</h3>

        <div id="planMaterials"></div>

      

        

<button onclick="addPlanWork()">
    ＋作業追加
</button>



<hr>

<button
    class="mainButton"
    onclick="saveFertilizerPlan()">
💾 施肥設計を保存
</button>
        <br><br
       

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

    `;
    renderPlanMaterials();
    renderTemplateSelect();
}

// 施肥設計内での資材行の追加処理（作業グループへの紐付け含む）
function addPlanMaterial(work = null) {

    // 作業未指定かつ既存データがあれば最後の行の作業グループを踏襲する
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
// 現在画面上で編集している施肥設計を保存（重複時は上書き、新規は追加）
function saveFertilizerPlan() {

    const year = document.getElementById("planYear").value;

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

    saveFertilizerPlanList(); // 永続化保存

    alert("保存しました。");

}



// 施肥設計内の資材・作業グループ要素をデータに基づいて再描画
function renderPlanMaterials() {
    const div = document.getElementById("planMaterials");
    let html = "";
    
    // 現在選択されている田んぼの面積（反）を取得しておく
    const fieldNo = document.getElementById("planField") ? document.getElementById("planField").value : "";
    const field = fieldMaster.find(f => String(f.no) === String(fieldNo));
    const area = field ? Number(field.area) || 0 : 0;

    // 現在登録されている作業グループのユニーク一覧
    const works = [...new Set(planMaterials.map(m => m.work))];
    
    works.forEach(work => {
        html += `
            <div class="work-card">
            <div class="work-header">
            🌱 
            <select onchange="changeWorkGroup('${work}', this.value)">
                <option value="">選択してください</option>
                ${workMaster.map(w => `
                    <option value="${w.name}" ${work === w.name ? "selected" : ""}>
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

            // 現在の数量から10a当たりの量を逆算（初期表示用）
            const per10aValue = (area > 0 && material.amount) ? (material.amount / area).toFixed(1) : "";

            html += `
                <div>
                    資材
                    <select onchange="changePlanMaterial(${index}, this.value)">
                        <option value="">選択してください</option>
                        ${materialMaster
                            .filter(master => {
                                if (material.work === "") return true;
                                return master.works.includes(material.work);
                            })
                            .map(master => `
                                <option value="${master.name}" ${material.material === master.name ? "selected" : ""}>
                                    ${master.name}
                                </option>
                            `)
                            .join("")}
                    </select>

                    <!-- 🌟 追加: 10a当たりの入力欄 -->
                    10a当り
                    <input type="number" step="0.1" style="width: 60px;" value="${per10aValue}" onchange="changePlanPer10a(${index}, this.value)">

                    総数量
                    <input type="number" step="0.1" style="width: 70px;" value="${material.amount}" onchange="changePlanAmount(${index}, this.value)">

                    ${(() => {
                        const master = materialMaster.find(m => m.name === material.material);
                        return master ? master.unit : "";
                    })()}

                    <button onclick="deletePlanMaterial(${index})">🗑️</button>
                </div>
                <br>
            `;
        });

        html += `
            <button onclick="addPlanMaterial('${work}')">＋資材追加</button>
            <br><br>
            </div>
        `;
    });
    
    div.innerHTML = html;
    updateFertilizerSummary(); // 成分量やコスト等の合計計算をキック
}

// 個々の計画行における作業グループを変更
function changePlanWork(index, value) {

    planMaterials[index].work = value;

    // 作業が変わったら資材をリセット
    planMaterials[index].material = "";

    renderPlanMaterials();

}
// 計画行の資材が変更された時のデータ同期処理
function changePlanMaterial(index, value) {

   

    planMaterials[index].material = value;

    renderPlanMaterials();

}
// 計画行の数量が変更された時のデータ同期処理
function changePlanAmount(index, value) {

    planMaterials[index].amount = Number(value);

    renderPlanMaterials();

}

// 施肥計画内の特定資材行の削除
function deletePlanMaterial(index) {

    planMaterials.splice(index, 1);

    renderPlanMaterials();

}

// 施肥計画の総量、純成分量(N,P,K)、コスト、および10aあたりの換算計算と表示更新
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
    const totalKg = amount * weight; // 袋数 * 内容量(kg) = 総重量(kg)

    totalAmount += totalKg;

    // 各成分量(kg)を成分比率(%)から算出
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



const field =
    fieldMaster.find(f => String(f.no) === String(fieldNo));
const area = Number(field.area); // 反数を取得
let per10aAmount = 0;
let per10aN = 0;
let per10aP = 0;
let per10aK = 0;
let per10aPrice = 0;
// 面積(反)が0より大きい場合、10a(1反)当たりの値を計算
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

// 施肥計画に新しい作業枠（グループ）を追加
function addPlanWork() {

    planMaterials.push({

        work: "",
        material: "",
        amount: ""

    });

    renderPlanMaterials();

}
// 指定した旧作業グループに属していたすべての計画資材の紐付けを新作業名へ一括更新
function changeWorkGroup(oldWork, newWork) {

    planMaterials.forEach(material => {

        if (material.work === oldWork) {

            material.work = newWork;

        }

    });

    renderPlanMaterials();

}
// ============================================================
// 共通テンプレート一覧表示
// ============================================================
function renderTemplateSelect() {

    const select =
        document.getElementById("commonTemplateSelect");

    let html = `
<option value="">
選択してください
</option>
`;

    templateMaster
        .filter(template =>
            template.type === "common" ||
            template.type === "standard"
        )
        .forEach(template => {

            let name = template.name;

            if (template.type === "standard") {

                name = "🌱 " + template.name;

            }

            html += `
<option value="${template.id}">
${name}
</option>
`;

        });

    select.innerHTML = html;

}

/**
 * 入力画面を表示
 *
 * 今後すべての作業入力の共通画面となる。
 * タブ切り替えにより、肥料・葉面散布・除草剤・その他を表示する。
 */

 function showInput() {

    let html = "";

    switch (inputTab) {
case "shipment":
    html = getShipmentHtml();
    break;
        case "fertilizer":

            // 元肥・追肥タブ
            html = `
                <div class="card">

                    <button
                        class="${fertilizerMode === "base" ? "tab active" : "tab"}"
                        onclick="changeFertilizerMode('base')">

                        🌱 元肥

                    </button>

                    <button
                        class="${fertilizerMode === "top" ? "tab active" : "tab"}"
                        onclick="changeFertilizerMode('top')">

                        🌿 追肥

                    </button>

                </div>
            `;

            if (fertilizerMode === "base") {

                let fieldListHtml = "";

                fieldMaster.forEach(field => {

                    const selected =
                        selectedFieldIds.includes(String(field.no));

                    fieldListHtml += `
                        <button
                            class="${selected ? "tab active" : "tab"}"
                            onclick="toggleFieldSelection('${field.no}')">

                            ${selected ? "☑" : "☐"} ${field.no}　${field.owner}

                        </button>
                    `;

                });

                html += `

                    <div class="card">

                        <h3>🌿 元肥入力</h3>

<label>作業日</label><br>

<input
    type="date"
    id="recordDate"
    value="${recordDate}"
    onchange="recordDate = this.value">

<br><br>

                        <p>田んぼを選択してください</p>

                        ${fieldListHtml}

                    </div>

                `;

                html += `

<div class="card">

    <button
        class="mainButton"
        onclick="loadBaseFertilizerFromPlan()">

        📋施肥設計読込

    </button>

</div>

<div id="baseFertilizerCards"></div>

<div class="card">

    <button
        class="mainButton"
        onclick="showFertilizerPlan()">

        ⚙️施肥設計を編集

    </button>

    <br><br>

    <button
        class="mainButton"
        onclick="saveTopFertilizer()">

        💾保存

    </button>

</div>

`;

            } else {

                // ------------------------
                // 追肥対象田んぼ一覧
                // ------------------------

                let fieldListHtml = "";

                const year = recordDate.substring(0, 4);

                fieldMaster.forEach(field => {

                    const plan =
                        getFertilizerPlan(
                            year,
                            String(field.no)
                        );

                    if (!plan) {

                        return;

                    }

                    const hasWork =
                        plan.materials.some(material =>
                            material.work === selectedTopWork
                        );

                    if (!hasWork) {

                        return;

                    }

                    const selected =
                        selectedFieldIds.includes(
                            String(field.no)
                        );

                    fieldListHtml += `
                        <button
                            class="${selected ? "tab active" : "tab"}"
                            onclick="toggleFieldSelection('${field.no}')">

                            ${selected ? "☑" : "☐"} ${field.no}　${field.owner}

                        </button>
                    `;

                });

                // ------------------------
                // 追肥作業タブ
                // ------------------------

                let topWorkHtml = "";

                workMaster

                    .filter(work =>
                        work.category === "fertilizer"
                       &&
        work.name !== "元肥" 
                    )

                    .forEach(work => {

                        const selected =
                            selectedTopWork === work.name;

                        topWorkHtml += `

<button
    class="${selected ? "tab active" : "tab"}"
    onclick="changeTopWork('${work.name}')">

    ${work.name}

</button>

`;

                    });

                html += `

<div class="card">

<h3>🌿 追肥入力</h3>

<label>作業日</label><br>

<input
    type="date"
    id="recordDate"
    value="${recordDate}"
    onchange="recordDate = this.value">

<br><br>

${topWorkHtml}

<p>田んぼを選択してください</p>

${fieldListHtml}

</div>

`;

                // ------------------------
                // 追肥カード
                // ------------------------

                html += `

<div class="card">

    <button
        class="mainButton"
        onclick="loadTopFertilizerFromPlan()">

        📋施肥設計読込

    </button>

</div>

<div class="card">

    <div id="topFertilizerCards"></div>

</div>

<div class="card">

    <button
        class="mainButton"
        onclick="showFertilizerPlan()">

        ⚙️施肥設計を編集

    </button>

    <br><br>

    <button
        class="mainButton"
        onclick="saveTopFertilizer()">

        💾保存

    </button>

</div>

`;

            }

            break;

                    
                    case "spray":
            html = `
                <div class="card" style="padding: 15px;">
                    <h3 style="margin-top: 0;">💧 葉面散布入力</h3>
<label>日付</label>
<input type="date" id="recordDate">
                    <!-- 散布量（タンク容量） -->
                    <div style="margin-bottom: 20px; background: #e8f5e9; padding: 12px; border-radius: 6px; border: 1px solid #c8e6c9;">
                        <label style="font-weight: bold; color: #2e7d32; font-size: 15px;">📊 今日の散布量 (タンク容量)</label><br>
                        <select id="foliarTank" onchange="calculateSprayAmounts()" style="width: 100%; height: 40px; margin-top: 6px; font-size: 16px; border: 1px solid #a5d6a7; border-radius: 4px; background: #fff;">
                            <option value="100">100L</option>
                            <option value="200" selected>200L</option>
                            <option value="300">300L</option>
                            <option value="500">500L</option>
                        </select>
                    </div>

                    <!-- 【★配置修正】田んぼ選択エリア（資材グリッドの外側・上部） -->
                    <div class="input-group" style="margin-bottom: 20px;">
                        <label style="display: block; font-weight: bold; margin-bottom: 8px; color: #2e7d32; font-size: 14px;">
                            🌾 田んぼを選択してください（複数選択可）
                        </label>
                        <!-- JSでこの中にボタン風の要素を並べます -->
                        <div id="foliarFieldButtonsContainer" style="display: flex; flex-wrap: wrap; gap: 8px;">
                            <!-- JSで動的に挿入されます -->
                        </div>
                    </div>

                    <!-- ラベル部分 -->
                    <div class="spray-grid-row" style="margin-bottom: 2px;">
                        <div class="spray-col-material">
                            <label style="font-weight: bold; font-size: 14px; color: #333;">資材</label>
                        </div>
                        <div class="spray-col-controls">
                            <label style="font-weight: bold; font-size: 14px; color: #333;">倍率</label>
                            <span class="spray-item-amount"></span>
                            <div class="spray-item-del-btn"></div>
                        </div>
                    </div>

                    <!-- メイン入力欄 -->
                    <div class="spray-grid-row" style="margin-bottom: 15px;">
                        <!-- 左：資材 -->
                        <div class="spray-col-material">
                            <select id="sprayMaterial" onchange="renderSprayDilutions()"></select>
                        </div>
                        
                        <!-- 右：倍率 ＆ メインの計算結果 ＆ ダミーのスペース -->
                        <div class="spray-col-controls">
                            <select id="sprayDilution" onchange="calculateSprayAmounts()"></select>
                            
                            <!-- 上の入力欄の計算結果 -->
                            <span id="mainSprayAmount" class="spray-item-amount"></span>
                            
                            <!-- 🌟 ❌マークを消して、下のボタンと完全に位置を揃えるための透明な枠に変更 -->
                            <div class="spray-item-del-btn" style="visibility: hidden;">❌</div>
                        </div>
                    </div>

                    <!-- 追加されたリスト -->
                    <div id="sprayMaterialList"></div>
                    
                    <br>

                    <!-- 追加ボタン -->
                    <button class="mainButton" onclick="addSprayMaterial()" style="width: 100%; padding: 12px; font-weight: bold; background-color: #2e7d32; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">
                        ＋資材追加
                    </button>
                    <!-- 「+資材追加」ボタンのすぐ下に追加 -->
                    <div style="margin-top: 20px;">
                        <button id="saveFoliarBtn" class="btn btn-primary" onclick="saveFoliarRecord()" style="width: 100%; padding: 12px; font-size: 16px; font-weight: bold;">
                            📝 この内容で記録する
                        </button>
                    </div>
 
                </div>
            `;
            break;



                case "herbicide":
            // ------------------------
            // 除草剤入力
            // ------------------------
            {
                let fieldListHtml = "";
                fieldMaster.forEach(field => {
                    const selected = selectedFieldIds.includes(String(field.no));
                    fieldListHtml += `
                        <button
                            class="${selected ? "tab active" : "tab"}"
                            onclick="toggleFieldSelection('${field.no}')">
                            ${selected ? "☑" : "☐"} ${field.no}　${field.owner}
                        </button>
                    `;
                });

                html = `
                    <div class="card">
                        <h3 class="input-header">🌿 除草剤入力</h3>
                        
                        <label>作業日</label><br>
                        <input type="date" id="recordDate" value="${recordDate}" onchange="recordDate = this.value">
                        <br><br>

                        <div class="form-group">
                            <label class="form-group-label">
                                🌾 田んぼを選択してください（複数選択可）
                            </label>
                            <div class="selection-flex-wrap">
                                ${fieldListHtml}
                            </div>
                        </div>

                        <div class="card">
                            <label>使用する除草剤</label><br>
                            <select id="herbicideMaterial" class="form-select-full" onchange="updateHerbicideUnit()">
                                <option value="">選択してください</option>
                                ${materialMaster
                                    .filter(m => m.category === "pesticide" || (m.works && m.works.includes("除草")))
                                    .map(m => `<option value="${m.name}">${m.name}</option>`).join("")}
                            </select>
                            <br><br>
                            
                            <label>使用量</label><br>
                            <div class="form-input-row">
                                <input type="number" id="herbicideAmount" step="0.1" class="form-input-amount">
                                <span id="herbicideUnit"></span>
                            </div>
                        </div>

                        <div class="card">
                            <button class="btn-save-green" onclick="saveHerbicideRecord()">
                                💾 除草剤の記録を保存
                            </button>
                        </div>
                    </div>
                `;
            }
            break;

        case "other":
            // ------------------------
            // その他入力
            // ------------------------
            {
                let fieldListHtml = "";
                fieldMaster.forEach(field => {
                    const selected = selectedFieldIds.includes(String(field.no));
                    fieldListHtml += `
                        <button
                            class="${selected ? "tab active" : "tab"}"
                            onclick="toggleFieldSelection('${field.no}')">
                            ${selected ? "☑" : "☐"} ${field.no}　${field.owner}
                        </button>
                    `;
                });

                html = `
                    <div class="card">
                        <h3 class="input-header">📦 その他作業入力</h3>
                        
                        <label>作業日</label><br>
                        <input type="date" id="recordDate" value="${recordDate}" onchange="recordDate = this.value">
                        <br><br>

                        <div class="form-group">
                            <label class="form-group-label">
                                🌾 田んぼを選択してください（複数選択可）
                            </label>
                            <div class="selection-flex-wrap">
                                ${fieldListHtml}
                            </div>
                        </div>

                        <div class="card">
                            <label>作業内容</label><br>
                            <select id="otherWorkSelect" class="form-select-full">
                                <option value="">選択してください</option>
                                ${workMaster
                                    .filter(w => w.category === "other" || (w.name !== "元肥" && !w.name.startsWith("追肥") && w.name !== "葉面散布" && w.name !== "除草"))
                                    .map(w => `<option value="${w.name}">${w.name}</option>`).join("")}
                            </select>
                            <br><br>

                            <label>使用資材 (任意)</label><br>
                            <select id="otherMaterial" class="form-select-full" onchange="updateOtherMaterialUnit()">
                                <option value="">使用なし</option>
                                ${materialMaster.map(m => `<option value="${m.name}">${m.name}</option>`).join("")}
                            </select>
                            <br><br>

                            <label>使用量</label><br>
                            <div class="form-input-row">
                                <input type="number" id="otherAmount" step="0.1" class="form-input-amount">
                                <span id="otherMaterialUnit"></span>
                            </div>
                            <br>

                            <label>備考・メモ</label><br>
                            <textarea id="otherMemo" class="form-textarea"></textarea>
                        </div>

                        <div class="card">
                            <button class="btn-save-green" onclick="saveOtherRecord()">
                                💾 その他作業の記録を保存
                            </button>
                        </div>
                    </div>
                `;
            }
            break;


    }

    app.innerHTML = `
        <div class="page">

            <div class="page-header">

                <h2>📝 入力</h2>

            </div>

            <div class="tab-container">
<button
    class="${inputTab === "shipment" ? "tab active" : "tab"}"
    onclick="changeInputTab('shipment')">

    📦 出荷

</button>
                <button
                    class="${inputTab === "fertilizer" ? "tab active" : "tab"}"
                    onclick="changeInputTab('fertilizer')">

                    🌱 肥料

                </button>

                <button
                    class="${inputTab === "spray" ? "tab active" : "tab"}"
                    onclick="changeInputTab('spray')">

                    💧 葉面散布

                </button>

                <button
                    class="${inputTab === "herbicide" ? "tab active" : "tab"}"
                    onclick="changeInputTab('herbicide')">

                    🌿 除草剤

                </button>

                <button
                    class="${inputTab === "other" ? "tab active" : "tab"}"
                    onclick="changeInputTab('other')">

                    📦 その他

                </button>

            </div>

            ${html}

        </div>
    `;
    if (inputTab === "shipment") {

    setTimeout(() => {

        renderShipmentItems();

    }, 0);

}

       // app.js の showInput() 末尾
    if (inputTab === "spray") {
    renderSprayMaterialList(); // マスタからメイン選択肢を生成
    initFoliarFieldButtons();  // 田んぼボタンを生成

    document.getElementById("recordDate").value =
        recordDate || getToday();

    calculateSprayAmounts();   // 初期計算を実行
}

}








// 入力画面のタブを切り替える
function changeInputTab(tab) {

    inputTab = tab;

    if (tab === "shipment") {

        shipmentItems = [];
        window.editShipmentIndex = null;

    }

    showInput();

}
// ------------------------
// 元肥カード表示
// ------------------------
function renderBaseFertilizerCards() {

    let html = "";

    // fieldNoごとにグループ化
    const grouped = {};

    baseFertilizerList.forEach(item => {

        if (!grouped[item.fieldNo]) {

            grouped[item.fieldNo] = [];

        }

        grouped[item.fieldNo].push(item);

    });

    Object.keys(grouped).forEach(fieldNo => {

        const field =
            fieldMaster.find(item =>
                String(item.no) === String(fieldNo)
            );

        let materialHtml = "";

        grouped[fieldNo].forEach(item => {

            materialHtml += `
<div class="input-material">

    <span>🌾 ${item.material}</span>

    <span class="input-amount">
        ${item.amount}袋
    </span>

</div>
`;

        });

        html += `
<div class="card">

    <div class="input-card-title">
        🌱 No.${field.no}　${field.owner}
    </div>

    <hr>

    ${materialHtml}

</div>
`;

    });

    document.getElementById("baseFertilizerCards").innerHTML = html;

}
// ------------------------
// 追肥カード表示
// ------------------------

function renderTopFertilizerCards() {

    console.log("===== renderTopFertilizerCards =====");
    console.log("topFertilizerList =", topFertilizerList);

    let html = "";

    // fieldNoごとにグループ化
    const grouped = {};

    topFertilizerList.forEach(item => {

        console.log("item =", item);

        if (!grouped[item.fieldNo]) {

            grouped[item.fieldNo] = [];

        }

        grouped[item.fieldNo].push(item);

    });

    console.log("grouped =", grouped);

    Object.keys(grouped).forEach(fieldNo => {

        console.log("fieldNo =", fieldNo);

        const field =
            fieldMaster.find(item =>
                String(item.no) === String(fieldNo)
            );

        console.log("field =", field);

        let materialHtml = "";

        grouped[fieldNo].forEach(item => {

            console.log("表示する資材 =", item);

            materialHtml += `
<div class="input-material">

    <span>🌾 ${item.material}</span>

    <span class="input-amount">
        ${item.amount}袋
    </span>

</div>
`;

        });

        html += `
<div class="card">

    <div class="input-card-title">
        🌱 No.${field.no}　${field.owner}
    </div>

    <hr>

    ${materialHtml}

</div>
`;

    });

    console.log("描画HTML =", html);

    document.getElementById("topFertilizerCards").innerHTML = html;

}
// ------------------------
// 肥料入力モードを切り替える
// ------------------------
function changeFertilizerMode(mode) {

    fertilizerMode = mode;

    showInput();

}

// ------------------------
// 田んぼの選択状態を切り替える
// ------------------------
function toggleFieldSelection(fieldId) {

    const index = selectedFieldIds.indexOf(fieldId);

    if (index >= 0) {

        selectedFieldIds.splice(index, 1);

    } else {

        selectedFieldIds.push(fieldId);

    }
console.log(selectedFieldIds);
saveInputState();
showInput();
 

}
// ------------------------
// 肥料一覧をプルダウンへ表示
// ------------------------
// 「追肥」で使用可能な資材のみを
// 資材選択プルダウンへ表示する。
function renderFertilizerOptions() {

    const select =
        document.getElementById("fertilizerMaterial");

    if (!select) return;

    select.innerHTML = "";
console.log("開始");

console.log(materialMaster);

    materialMaster.forEach(material => {
console.log("1件");
        if (
            !material.works ||
            !material.works.includes("追肥")
        ) {
            return;
        }

        select.innerHTML += `
            <option value="${material.name}">
                ${material.name}
            </option>
        `;

    });

}
// ------------------------
// 追肥資材を追加
// ------------------------
// 選択中の資材を追肥一覧へ追加し、
// 入力画面を再描画する。
function addTopFertilizer() {
const date = document.getElementById("recordDate");

if (date) {
    recordDate = date.value;
}
    const materialName =
        document.getElementById("fertilizerMaterial").value;

    topFertilizerList.push({

        material: materialName,

        rate: 1,

        amount: ""

    });

    saveInputState();
showInput();

}

function addBaseFertilizer() {
const date = document.getElementById("recordDate");

if (date) {
    recordDate = date.value;
}
    const materialName =
        document.getElementById("fertilizerMaterial").value;

    baseFertilizerList.push({

        material: materialName,

        rate: 1,

        amount: ""

    });

    saveInputState();
showInput();

}

// ------------------------
// 追肥数量を変更
// ------------------------
// 入力された数量を追肥一覧へ保存する。
function changeTopFertilizerAmount(index, value) {

    topFertilizerList[index].amount = value;

}

// ------------------------
// 追肥資材を削除
// ------------------------
// 選択した資材を一覧から削除する。
function removeTopFertilizer(index) {

    topFertilizerList.splice(index, 1);

    showInput();

}




/**
 * 追肥入力内容を保存用データに変換する
 */
function saveTopFertilizer() {

    const record = {

        date: recordDate,

        work: fertilizerMode === "base"
            ? "元肥"
            : selectedTopWork,

        memo: "",

        fields: []

    };

    const sourceList =
        fertilizerMode === "base"
            ? baseFertilizerList
            : topFertilizerList;

    selectedFieldIds.forEach(fieldNo => {

        const field = fieldMaster.find(
            f => String(f.no) === String(fieldNo)
        );

        if (!field) {

            return;

        }

        const fieldRecord = {

            fieldNo: field.no,

            materials: []

        };

        // この田んぼの資材だけ保存
        sourceList
            .filter(item =>
                String(item.fieldNo) === String(fieldNo)
            )
            .forEach(item => {

                fieldRecord.materials.push({

                    material: item.material,

                    amount: item.amount

                });

            });

        // 資材がある田んぼだけ保存
        if (fieldRecord.materials.length > 0) {

            record.fields.push(fieldRecord);

        }

    });

    recordList.push(record);

    saveRecordList();

    recordDate = getToday();

    showInput();

}

function getToday() {

    const today = new Date();

    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");

    return `${yyyy}-${mm}-${dd}`;

}

// ------------------------
// 入力中の日付を保存
// ------------------------
function saveInputState() {

    const date = document.getElementById("recordDate");

    if (date) {
        recordDate = date.value;
    }
console.log(recordDate);
}



// ------------------------
// 編集データ読み込み（追肥）
// ------------------------
function loadTopFertilizerForEdit() {

    const record = recordList[editingRecordIndex];

    // 作業日
    recordDate = record.date;

    // 編集用データ
    editFields = record.fields;

}

// ------------------------
// 追肥編集画面
// ------------------------
function showTopFertilizerEdit() {
let fieldHtml = "";

editFields.forEach((field, fieldIndex) => {

    const info =
        fieldMaster.find(f => f.no == field.fieldNo);

    fieldHtml += `
        <div class="card">

            <h3>
                No.${info.no}
                ${info.owner}
            </h3>
    `;

    field.materials.forEach((material, materialIndex) => {

        fieldHtml += `
       <br>

    <button
        onclick="addEditMaterial(${fieldIndex})">

        ➕ 資材追加

    </button> 
            <div>

   <select
    onchange="changeEditMaterial(${fieldIndex}, ${materialIndex}, this.value)">

    ${materialMaster.map(item => `
        <option
            value="${item.name}"
            ${item.name === material.material ? "selected" : ""}>
            ${item.name}
        </option>
    `).join("")}

</select>

    <input
    type="number"
    value="${material.amount}"
    onchange="changeEditBags(${fieldIndex}, ${materialIndex}, this.value)">

    袋
<button
                onclick="removeEditMaterial(${fieldIndex}, ${materialIndex})">

                🗑

            </button>
</div>
        `;

    });

    fieldHtml += `
    
        </div>
        
    `;
    

});
let html = `
    <div class="page">

        <div class="page-header">
            <h2>✏️ 追肥編集</h2>
        </div>

        <div class="card">

            <label>作業日</label><br>

            <input
                type="date"
                id="editRecordDate"
                value="${recordDate}">

        </div>

        ${fieldHtml}
<div class="card">

    <button onclick="saveTopFertilizerEdit()">
        💾 保存
    </button>

</div>
    </div>
`;
    app.innerHTML = html;

}

// ------------------------
// 編集袋数変更
// ------------------------
function changeEditBags(fieldIndex, materialIndex, value) {

    editFields[fieldIndex]
        .materials[materialIndex]
        .amount = Number(value);

}



// ------------------------
// 追肥編集保存
// ------------------------
function saveTopFertilizerEdit() {

    const record =
        recordList[editingRecordIndex];

    // 作業日
    record.date =
        document.getElementById("editRecordDate").value;

    // 編集内容
    record.fields = editFields;

    // 保存
    saveRecordList();
    
    // 履歴画面へ戻る
    showHistory()

}
// ------------------------
// 編集資材削除
// ------------------------
function removeEditMaterial(fieldIndex, materialIndex) {

    editFields[fieldIndex]
        .materials.splice(materialIndex, 1);

    showTopFertilizerEdit();

}
// ------------------------
// 編集資材追加
// ------------------------
function addEditMaterial(fieldIndex) {

    editFields[fieldIndex].materials.push({

        material: "",
        amount: 0

    });

    showTopFertilizerEdit();

}

// ------------------------
// 編集資材変更
// ------------------------
function changeEditMaterial(fieldIndex, materialIndex, value) {

    editFields[fieldIndex]
        .materials[materialIndex]
        .material = value;

}



// ------------------------
// 元肥を施肥設計から読込
// ------------------------
function loadBaseFertilizerFromPlan() {

    // 一旦リセット
    baseFertilizerList = [];

    const year = recordDate.substring(0, 4);

    for (const field of selectedFieldIds) {

        const plan = getFertilizerPlan(year, field);

        if (!plan) {

            // あとで前年コピーなど
            continue;

        }

        // 元肥だけ読込
        for (const material of plan.materials) {

            if (material.work !== "元肥") {

                continue;

            }

            baseFertilizerList.push({

                fieldNo: field,

                material: material.material,

                amount: material.amount

            });

        }

    }

    renderBaseFertilizerCards();

}

// ------------------------
// 施肥設計から追肥読込
// ------------------------
function loadTopFertilizerFromPlan() {

    // 一旦リセット
    topFertilizerList = [];

    const year = recordDate.substring(0, 4);

    if (selectedFieldIds.length === 0) {

        renderTopFertilizerCards();

        return;

    }

    selectedFieldIds.forEach(fieldNo => {

        const plan = getFertilizerPlan(year, fieldNo);

        if (!plan) {

            return;

        }

        plan.materials.forEach(material => {

            if (material.work !== selectedTopWork) {

                return;

            }

            topFertilizerList.push({

                fieldNo: fieldNo,

                material: material.material,

                amount: material.amount

            });

        });

    });

    renderTopFertilizerCards();

}
// ------------------------
// 追肥作業変更
// ------------------------


// ------------------------
// 追肥作業選択
// ------------------------
function changeTopWork(work) {

    selectedTopWork = work;

    selectedFieldIds = [];
    topFertilizerList = [];

    showInput();

}


// ------------------------
// 追肥対象田んぼ選択
// ------------------------
function selectTopField(fieldNo) {

    // 選択田んぼ
    selectedFieldIds = [String(fieldNo)];

    // 施肥設計から読込
    loadTopFertilizerFromPlan();

}

// ------------------------
// 履歴1件分のHTML生成
// ------------------------
function renderHistoryRecord(record, originalIndex) {

    const detailText = record.fields

        .map(field => {

            const fieldInfo =
                fieldMaster.find(f => f.no == field.fieldNo);

            const fieldName =
                fieldInfo
                    ? `No.${fieldInfo.no}<br>${fieldInfo.owner}`
                    : `No.${field.fieldNo}`;

            const materials = field.materials

                .map(material => {

                    const master =
                        materialMaster.find(
                            m => m.name === material.material
                        );

                    const unit =
                        master ? master.unit : "袋";

                    return `${material.material} ${material.amount}${unit}`;

                })

                .join("<br>");

            return `
                <b>${fieldName}</b><br>
                ${materials}
            `;

        })

        .join("<hr>");

    return `
        <tr>

            <td>${record.date}</td>

            <td>${record.work}</td>

            <td>${detailText}</td>

            <td>${record.memo || ""}</td>

            <td class="action-buttons">

                <button
                    onclick="editRecord(${originalIndex})">

                    ✏️

                </button>

                <button
                    onclick="deleteRecord(${originalIndex})">

                    🗑️

                </button>

            </td>

        </tr>
    `;

}

// ------------------------
// 履歴詳細HTML生成
// ------------------------
function createHistoryDetailHtml(record) {
    // 作業内容が「葉面散布」または「除草」の場合は、すっきりした専用レイアウトで表示する
    if (record.work === "葉面散布" || record.work === "除草") {
        return createSprayDetailHtml(record);
    }

    // それ以外の通常の肥料などは従来の表示
    return createNormalDetailHtml(record);
}

// ------------------------
// 履歴カードHTML生成
// ------------------------
function renderHistoryCard(record, originalIndex) {

    return `

        <div class="card">

            <h3>${record.work}</h3>

            ${createHistoryDetailHtml(record)}

            ${record.memo
                ? `<hr><b>備考</b><br>${record.memo}`
                : ""}

            <br><br>

            <button
                onclick="editRecord(${originalIndex})">

                ✏️ 編集

            </button>

            <button
                onclick="deleteRecord(${originalIndex})">

                🗑️ 削除

            </button>

        </div>

    `;

}


// ------------------------
// 日付カードHTML生成
// ------------------------
function renderHistoryDateCard(date, records) {

    let html = `

        <div class="card">

            <h2>📅 ${date}</h2>

    `;

    records.forEach(record => {

        const originalIndex =
            recordList.indexOf(record);

        html += renderHistoryCard(
            record,
            originalIndex
        );

    });

    html += `

        </div>

    `;

    return html;

}

// ------------------------
// 日付ごとに履歴をグループ化
// ------------------------
function groupHistoryByDate(records) {

    const grouped = {};

    records.forEach(record => {

        if (!grouped[record.date]) {

            grouped[record.date] = [];

        }

        grouped[record.date].push(record);

    });

    return grouped;

}
// ------------------------
// 履歴一覧HTML生成
// ------------------------
function createHistoryListHtml(records) {

    const grouped =
        groupHistoryByDate(records);

    let html = "";

    Object.keys(grouped)

        .sort((a, b) => b.localeCompare(a))

        .forEach(date => {

            html += renderHistoryDateCard(
                date,
                grouped[date]
            );

        });

    return html;

}
// ------------------------
// 履歴集計HTML生成
// ------------------------
function createHistorySummaryHtml(
    filteredRecords,
    materialSummary,
    totalN,
    totalP,
    totalK,
    totalCost
) {

    let materialHtml = "";
console.log(materialSummary);

    for (const name in materialSummary) {

        const master =
            materialMaster.find(
                m => m.name === name
            );

        const unit =
            master ? master.unit : "";

        materialHtml +=
    `${name}：${materialSummary[name].amount}${materialSummary[name].unit}<br>`;

    }

    if (materialHtml === "") {

        materialHtml = "使用資材なし";

    }

    return `

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

}

/**
 * フィルターされたレコードから、指定された田んぼの分だけを正確に集計する
 * @param {Array} filteredRecords - 絞り込まれた履歴データの配列
 * @param {String|Number} selectedFieldNo - 検索画面で選択されている田んぼ番号（「すべて」の場合は空文字やnull）
 * @returns {Object} 集計結果オブジェクト
 */
/**
 * フィルターされたレコードから、指定された田んぼの分だけを正確に集計する
 */
function calculateHistorySummary(filteredRecords, selectedFieldNo = "") {
    const materialSummary = {}; 
    let totalN = 0;
    let totalP = 0;
    let totalK = 0;
    let totalCost = 0;

    const targetFieldNo = selectedFieldNo ? String(selectedFieldNo).trim() : "";

    filteredRecords.forEach(record => {
        if (!record.fields || !Array.isArray(record.fields)) return;

        // 田んぼ絞り込み判定
        if (targetFieldNo !== "") {
            const hasTarget = record.fields.some(f => String(f.fieldNo).trim() === targetFieldNo);
            if (!hasTarget) return;
        }

        const isTankWork = (record.work === "葉面散布" || record.work === "除草");

        // タンク作業（葉面散布・除草）は1回の作業につき資材リストを1回だけ集計（重複防止）
        let fieldsToCalculate = isTankWork 
            ? [record.fields[0]] 
            : (targetFieldNo !== "" ? record.fields.filter(f => String(f.fieldNo).trim() === targetFieldNo) : record.fields);

        fieldsToCalculate.forEach(field => {
            if (!field || !field.materials || !Array.isArray(field.materials)) return;

            field.materials.forEach(mat => {
                const name = mat.material;
                if (!name || name === "選択してください") return;

                let rawAmount = parseFloat(mat.amount) || parseFloat(mat.bags) || 0; 
                if (rawAmount === 0) return;

                const master = materialMaster.find(m => m.name === name);
                const price = master ? parseFloat(master.price) || 0 : 0;
                
                const rawWeight = master ? parseFloat(master.weight) || 0 : 0;
                const weightUnit = master ? (master.weightUnit || "kg").toLowerCase() : "kg";

                let unit = master ? master.unit : (mat.unit || "袋");
                let displayAmount = 0;

                // 🌟 作業種別で計算を完全に切り分ける
                if (isTankWork) {
                    // 【葉面散布・除草】タンク投入量(mL) ÷ マスター内容量(mL) ＝ 本数
                    let capacityInMl = rawWeight;
                    if (weightUnit === "kg" || weightUnit === "l") {
                        capacityInMl = rawWeight * 1000;
                    }

                    if (capacityInMl > 0) {
                        let amountMl = rawAmount;
                        // 0.2 などの L 単位で入っている場合は mL に換算
                        if (rawAmount < 1 || mat.unit === "L" || mat.unit === "l") {
                            amountMl = rawAmount * 1000;
                        }
                        displayAmount = amountMl / capacityInMl;
                        unit = master.unit || "本";
                    } else {
                        displayAmount = rawAmount;
                    }
                } else {
                    // 【通常作業（元肥・追肥等）】保存されている数値（袋数など）をそのまま使う
                    displayAmount = rawAmount;
                }

                const cost = displayAmount * price;

                if (!materialSummary[name]) {
                    materialSummary[name] = { amount: 0, cost: 0, unit: unit };
                }
                materialSummary[name].amount += displayAmount;
                materialSummary[name].cost += cost;

                totalCost += cost;

                // 三要素（N・P・K）計算
                if (master) {
                    // 1袋（1本）あたりのkg数 × 使用数（袋数/本数）＝ 合計kg
                    const weightInKg = (weightUnit === "g" || weightUnit === "ml") ? rawWeight / 1000 : rawWeight;
                    const totalKg = displayAmount * weightInKg; 
                    
                    totalN += totalKg * (parseFloat(master.n) || 0) / 100;
                    totalP += totalKg * (parseFloat(master.p) || 0) / 100;
                    totalK += totalKg * (parseFloat(master.k) || 0) / 100;
                }
            });
        });
    });

    // 四捨五入・丸め処理
    Object.keys(materialSummary).forEach(name => {
        materialSummary[name].amount = Math.round(materialSummary[name].amount * 100) / 100;
        materialSummary[name].cost = Math.round(materialSummary[name].cost);
    });

    return {
        materialSummary: materialSummary,
        totalN: Math.round(totalN * 10) / 10,
        totalP: Math.round(totalP * 10) / 10,
        totalK: Math.round(totalK * 10) / 10,
        totalCost: Math.round(totalCost)
    };
}


function addSprayMaterial() {

    const materialIndex =
        document.getElementById("sprayMaterial").value;

    if (materialIndex === "") return;

    const dilution =
        document.getElementById("sprayDilution").value;

    sprayMaterials.push({

        materialIndex: Number(materialIndex),
        dilution: Number(dilution),
        amount: 0

    });

    renderSprayMaterialItems();

}
/**
 * 葉面散布の入力内容をローカルストレージに保存する
 */


/**
 * 葉面散布の入力内容をアプリ共通のrecordListへ一括保存する
 */
function saveFoliarRecord() {
    // 1. 田んぼの選択チェック
    if (selectedFieldIds.length === 0) {
        alert("散布する田んぼを少なくとも1つ選択してください。");
        return;
    }

    // 2. タンク容量の取得
    const tankSelect = document.getElementById("foliarTank");
    const tankVolumeL = tankSelect ? Number(tankSelect.value) : 0; // 例: 200 (L)
    const tankSizeStr = tankSelect ? tankSelect.value + "L" : "未設定";

    const materials = [];

    // 3. メイン行の資材データ取得
    const mainMaterialSelect = document.getElementById("sprayMaterial");
    const mainDilutionSelect = document.getElementById("sprayDilution");

    if (mainMaterialSelect && mainMaterialSelect.value !== "") {
        const matIndex = Number(mainMaterialSelect.value);
        const matMaster = materialMaster[matIndex];
        const dilution = Number(mainDilutionSelect.value);

        if (matMaster && dilution > 0) {
            // タンク容量(L) ÷ 倍率 × 1000 ＝ 使用量(mL)
            const amountMl = (tankVolumeL / dilution) * 1000;

            materials.push({
                material: matMaster.name,
                amount: amountMl,
                unit: "mL"
            });
        }
    }

    // 4. 動的に追加されたリスト（sprayMaterials）の資材データ取得
    if (typeof sprayMaterials !== "undefined" && sprayMaterials.length > 0) {
        sprayMaterials.forEach(item => {
            const matMaster = materialMaster[item.materialIndex];
            
            if (matMaster) {
                let amountMl = 0;

                // item に倍率 (item.dilution) が入っている場合はタンク容量から mL を計算
                const dilution = Number(item.dilution) || 0;
                if (tankVolumeL > 0 && dilution > 0) {
                    amountMl = (tankVolumeL / dilution) * 1000;
                } else {
                    // すでに mL 値として item.amount がセットされている場合のフォールバック
                    amountMl = Number(item.amount) || 0;
                    // もし 1未満の小数の場合（0.2などLで入っている場合）は1000倍してmLにする
                    if (amountMl > 0 && amountMl < 10) {
                        amountMl = amountMl * 1000;
                    }
                }

                if (amountMl > 0) {
                    materials.push({
                        material: matMaster.name,
                        amount: amountMl,
                        unit: "mL"
                    });
                }
            }
        });
    }

    if (materials.length === 0) {
        alert("資材を1つ以上選択・追加してください。");
        return;
    }

    // 5. 日付取得 ＆ レコード生成
    const dateInput = document.getElementById("recordDate");
    const inputDate = (dateInput && dateInput.value) ? dateInput.value : getToday();

    const record = {
        date: inputDate,
        work: "葉面散布",
        memo: `タンク容量: ${tankSizeStr}`,
        fields: []
    };

    selectedFieldIds.forEach(fieldNo => {
        record.fields.push({
            fieldNo: Number(fieldNo),
            materials: materials.map(m => ({
                material: m.material,
                amount: m.amount,
                unit: m.unit
            }))
        });
    });

    // 6. グローバル配列へ追加と保存
    recordList.push(record);
    if (typeof saveRecordList === "function") {
        saveRecordList();
    }

    alert("葉面散布の記録を保存しました！");

    // 7. 状態クリアと画面リフレッシュ
    selectedFieldIds = [];
    if (typeof sprayMaterials !== "undefined") {
        sprayMaterials = [];
    }
    
    if (typeof showHistory === "function") {
        showHistory();
    } else {
        showInput();
    }
}
　
/**
 * 葉面散布画面用の田んぼ選択ボタンを動的に生成する
 */
function initFoliarFieldButtons() {
    const container = document.getElementById("foliarFieldButtonsContainer");
    if (!container) return;

    container.innerHTML = "";
    // 葉面散布を開いた時は一旦選択状態をクリア
    selectedFieldIds = [];

    if (!fieldMaster || fieldMaster.length === 0) {
        container.innerHTML = `<span style="color: #888; font-size: 14px;">※設定画面で田んぼを登録してください</span>`;
        return;
    }

    fieldMaster.forEach(field => {
        const btn = document.createElement("div");
        btn.className = "foliar-field-btn";
        btn.dataset.id = String(field.no);
        btn.textContent = `☐ ${field.no} ${field.owner}`;

        // アプリ全体のデザインに合わせた枠線スタイル
        btn.style.padding = "8px 12px";
        btn.style.border = "1px solid #333";
        btn.style.borderRadius = "4px";
        btn.style.backgroundColor = "#fff";
        btn.style.color = "#000";
        btn.style.cursor = "pointer";
        btn.style.fontSize = "15px";
        btn.style.userSelect = "none";
        btn.style.transition = "all 0.1s";

        btn.addEventListener("click", function() {
            const fieldId = btn.dataset.id;
            const index = selectedFieldIds.indexOf(fieldId);

            if (index >= 0) {
                // 選択解除
                selectedFieldIds.splice(index, 1);
                btn.style.backgroundColor = "#fff";
                btn.style.color = "#000";
                btn.style.border = "1px solid #333";
                btn.textContent = `☐ ${field.no} ${field.owner}`;
            } else {
                // 選択 (肥料の追肥アクティブ時の緑色 #2e7d32 に統一)
                selectedFieldIds.push(fieldId);
                btn.style.backgroundColor = "#2e7d32";
                btn.style.color = "#fff";
                btn.style.border = "1px solid #2e7d32";
                btn.textContent = `☑ ${field.no} ${field.owner}`;
            }
            console.log("選択中の田んぼID:", selectedFieldIds);
        });

        container.appendChild(btn);
    });
}


function createNormalDetailHtml(record) {
    // 現在履歴検索で選択されている田んぼのNoを取得
    const selectedField = document.getElementById("historyField") ? document.getElementById("historyField").value : "";

    return record.fields
        // 🔍 もし田んぼが選択されていたら、その田んぼのデータだけに絞り込む
        .filter(field => {
            if (selectedField !== "") {
                return String(field.fieldNo) === String(selectedField);
            }
            return true;
        })
        .map(field => {
            const fieldInfo = fieldMaster.find(
                f => String(f.no) === String(field.fieldNo)
            );

            const fieldName = fieldInfo
                ? `No.${fieldInfo.no}　${fieldInfo.owner}`
                : `No.${field.fieldNo}`;

            const materials = field.materials
                .map(material => {
                    const master = materialMaster.find(
                        m => m.name === material.material
                    );
                    const unit = master ? master.unit : "";
                    return `${material.material} ${material.amount}${unit}`;
                })
                .join("<br>");

            return `
                <div class="history-field">
                    <b>${fieldName}</b><br>
                    ${materials}
                </div>
            `;
        })
        .join("<hr>");
}


// ------------------------
// 葉面散布・除草 履歴詳細HTML生成
// ------------------------
function createSprayDetailHtml(record) {
    // 現在履歴検索で選択されている田んぼのNoを取得
    const selectedField = document.getElementById("historyField") ? document.getElementById("historyField").value : "";

    // 🔍 選択された田んぼがある場合は、その田んぼに紐づくデータだけにする
    const targetFields = record.fields.filter(field => {
        if (selectedField !== "") {
            return String(field.fieldNo) === String(selectedField);
        }
        return true;
    });

    const materials = [];

    targetFields.forEach(field => {
        field.materials.forEach(material => {
            const master = materialMaster.find(
                m => m.name === material.material
            );

            if (!materials.some(m => m.name === material.material)) {
                materials.push({
                    name: material.material,
                    amount: material.amount,
                    unit: material.unit || "mL"
                });
            }
        });
    });

    // カード表示用：mLで入っている数値を表示（1000mL以上はL換算）
    const materialHtml = materials.map(m => {
        let amount = Number(m.amount);
        let unit = m.unit;

        if (unit === "mL" && amount >= 1000) {
            amount = (amount / 1000).toFixed(1);
            unit = "L";
        } else if (unit === "mL") {
            amount = Math.round(amount); // 小数点を丸めて「200mL」のように表示
        }

        return `${m.name}　${amount}${unit}`;
    }).join("<br>");

    const fieldHtml = targetFields.map(field => {
        const fieldInfo = fieldMaster.find(
            f => String(f.no) === String(field.fieldNo)
        );
        return fieldInfo
            ? `No.${fieldInfo.no}　${fieldInfo.owner}`
            : `No.${field.fieldNo}`;
    }).join("<br>");

    return `
        <b>使用資材</b><br>
        ${materialHtml}

        <hr>

        <b>対象田んぼ</b><br>
        ${fieldHtml}
    `;
}



function saveHerbicideRecord() {
    // グローバル変数 recordDate や、選択された田んぼIDの配列 selectedFieldIds を使用
    const date = recordDate || document.getElementById("recordDate").value;
    const material = document.getElementById("herbicideMaterial").value;
    const amount = parseFloat(document.getElementById("herbicideAmount").value) || 0;

    if (!selectedFieldIds || selectedFieldIds.length === 0) {
        alert("田んぼを少なくとも1つ選択してください。");
        return;
    }

    if (!material) {
        alert("使用する除草剤を選択してください。");
        return;
    }

    if (amount <= 0) {
        alert("使用量を入力してください。");
        return;
    }

    // 選択された田んぼごとに資材と数量を格納
    const fieldsData = selectedFieldIds.map(fieldNo => {
        return {
            fieldNo: fieldNo,
            materials: [{ material, amount }]
        };
    });

    const record = {
        date: date,
        work: "除草", // 履歴で「除草」として識別
        memo: "",     // 除草剤入力はメモ欄がないため空文字
        fields: fieldsData
    };

    // 【修正箇所】：LocalStorage に正しく保存
    recordList.push(record);
    saveRecordList(); // storage.js の保存関数を実行

    alert("除草剤の記録を保存しました。");
    showHistory(); // 履歴画面へ遷移
}

function saveOtherRecord() {
    const date = recordDate || document.getElementById("recordDate").value;
    const workType = document.getElementById("otherWorkSelect").value;
    const material = document.getElementById("otherMaterial").value;
    const amount = parseFloat(document.getElementById("otherAmount").value) || 0;
    const memo = document.getElementById("otherMemo").value || "";

    if (!selectedFieldIds || selectedFieldIds.length === 0) {
        alert("田んぼを少なくとも1つ選択してください。");
        return;
    }

    if (!workType) {
        alert("作業内容を選択してください。");
        return;
    }

    // 資材が選択されている場合のみ materials 配列を作成
    const materials = [];
    if (material && amount > 0) {
        materials.push({ material, amount });
    }

    const fieldsData = selectedFieldIds.map(fieldNo => {
        return {
            fieldNo: fieldNo,
            materials: materials // 資材なしの場合は空配列
        };
    });

    const record = {
        date: date,
        work: workType, // 選択した「作業内容（草刈りや耕起など）」が入る
        memo: memo,
        fields: fieldsData
    };

    // 【修正箇所】：LocalStorage に正しく保存
    recordList.push(record);
    saveRecordList(); // storage.js の保存関数を実行

    alert("その他作業の記録を保存しました。");
    showHistory(); // 履歴画面へ遷移
}


// 除草剤の単位表示を切り替える
function updateHerbicideUnit() {
    const materialName = document.getElementById("herbicideMaterial").value;
    const unitSpan = document.getElementById("herbicideUnit");
    if (!unitSpan) return;

    const item = materialMaster.find(m => m.name === materialName);
    unitSpan.innerText = item ? item.unit : "";
}

// その他作業の資材単位表示を切り替える
function updateOtherMaterialUnit() {
    const materialName = document.getElementById("otherMaterial").value;
    const unitSpan = document.getElementById("otherMaterialUnit");
    if (!unitSpan) return;

    const item = materialMaster.find(m => m.name === materialName);
    unitSpan.innerText = item ? item.unit : "";
}


// 10a当たりの量から全体の数量を自動計算する関数（四捨五入で整数化）
function changePlanPer10a(index, per10aValue) {
    const fieldNo = document.getElementById("planField").value;
    const field = fieldMaster.find(f => String(f.no) === String(fieldNo));
    const area = field ? Number(field.area) || 0 : 0;

    if (area > 0) {
        // 10a当たりの量 × 面積(反)
        const totalAmount = Number(per10aValue) * area;
        
        // 四捨五入して整数にする
        planMaterials[index].amount = Math.round(totalAmount); 
    } else {
        alert("田んぼマスタの面積が正しく登録されていません。");
    }

    renderPlanMaterials();
}
function changeHistoryTab(tab) {

    historyTab = tab;

    showHistory();

}

// ------------------------
// 資材集計画面
// ------------------------
function renderFertilizerSummary() {

    const content =
        document.getElementById("planContent");

    content.innerHTML = `

        <h3>📦 資材集計</h3>

        <label>対象年</label>

        <select id="summaryYear"></select>

        <br><br>

        <div id="fertilizerSummaryList">

            <div class="card">

                集計中...

            </div>

        </div>

    `;

    // 年プルダウンを作成
    renderSummaryYearOptions();

    // 年変更時に再集計
    document
        .getElementById("summaryYear")
        .addEventListener(
            "change",
            renderFertilizerSummaryList
        );

    // 初回表示
    renderFertilizerSummaryList();

}

// ------------------------
// 資材集計一覧表示
// ------------------------
function renderFertilizerSummaryList() {

    const list =
        document.getElementById(
            "fertilizerSummaryList"
        );

    // 資材集計取得
    const summary =
        getMaterialSummary();

    // 資材未登録
    if (Object.keys(summary).length === 0) {

        list.innerHTML = `

            <div class="card">

                資材は登録されていません。

            </div>

        `;

        return;

    }

    let html = "";

    // 合計資材費
    let totalCost = 0;

    // 資材マスタ登録順で表示
    materialMaster.forEach(master => {

        const material =
            summary[master.name];

        if (!material) return;

        // 単価
        const price =
            Number(master.price) || 0;

        // 必要数量
        const quantity =
            Number(material.quantity);

        // 資材費
        const cost =
            quantity * price;

        totalCost += cost;

        // 現在在庫
        const stock =
            Number(master.stock) || 0;

        // 不足数量
        const shortage =
            Math.max(
                0,
                quantity - stock
            );

        // 発注金額
        const orderCost =
            shortage * price;

        // 展開状態
        const opened =
            openedMaterials.includes(
                master.name
            );

        // アイコン
        const icon =
            opened
                ? "📂"
                : "📦";

        html += `

            <div
                class="card material-card"
                onclick="toggleMaterialDetail('${master.name}')"
            >

                <div class="material-summary-header">

                    <b>

                        ${icon}
                        ${master.name}

                    </b>

                    <b>

                        ${quantity}${material.unit}

                    </b>

                </div>

                <div class="material-summary-row">

                    <span>

                        単価

                    </span>

                    <b>

                        ${price.toLocaleString()}円

                    </b>

                </div>

                <div class="material-summary-row">

                    <span>

                        資材費

                    </span>

                    <b>

                        ${cost.toLocaleString()}円

                    </b>

                </div>

                <div class="material-summary-row">

                    <span>

                        在庫

                    </span>

                    <b>

                        ${stock}${material.unit}

                    </b>

                </div>

                <div class="material-summary-row">

                    <span>

                        不足

                    </span>

                    <b class="material-shortage">

                        ${
                            shortage > 0
                                ? `${shortage}${material.unit}`
                                : "なし"
                        }

                    </b>

                </div>

                ${
                    shortage > 0
                        ? `

                        <div class="material-order-cost">

                            <span>

                                発注金額

                            </span>

                            <b>

                                ${orderCost.toLocaleString()}円

                            </b>

                        </div>

                        `
                        : ""
                }

                ${
                    opened
                        ? renderMaterialDetail(master.name)
                        : ""
                }

            </div>

        `;

    });

    // 合計資材費カード
    html = `

        <div class="card">

            <h3>

                💴 合計資材費

            </h3>

            <h2>

                ${totalCost.toLocaleString()}円

            </h2>

        </div>

    ` + html;

    list.innerHTML = html;

}
// ------------------------
// 資材集計
// ------------------------
function getMaterialSummary() {

    // 資材ごとの合計
    const summary = {};
// 集計対象年
// 集計対象年
const year =
    document.getElementById(
        "summaryYear"
    ).value;
    // 全施肥設計をループ
    fertilizerPlanList.forEach(plan => {
// 年が違う施肥設計は集計しない
    if (plan.year !== year) {

        return;

    }
        // 資材一覧をループ
        plan.materials.forEach(material => {

            // 資材未選択はスキップ
if (!material.material) return;
const master =
    materialMaster.find(m =>
        m.name === material.material
    );
            // 数量未入力はスキップ
            if (!material.amount) return;

            // 初回のみ作成
            if (!summary[material.material]) {

                summary[material.material] = {

                    // 合計数量
                    quantity: 0,

                    // 単位
                    unit:
    master ? master.unit : ""

                };

            }

            // 数量加算
            summary[material.material].quantity +=
                Number(material.amount);

        });

    });

    return summary;

}
// ------------------------
// 集計年プルダウン
// ------------------------
function renderSummaryYearOptions() {

    const select =
        document.getElementById("summaryYear");

    // 登録されている年を取得
    const years = [
    ...new Set(
        fertilizerPlanList.map(
            plan => plan.year
        )
    )
].sort((a, b) => b - a);

    select.innerHTML = "";

    years.forEach(year => {

        select.innerHTML += `

            <option value="${year}">

                ${year}

            </option>

        `;

    });

}
// ------------------------
// 資材内訳開閉
// ------------------------
function toggleMaterialDetail(name) {

    const index =
        openedMaterials.indexOf(name);

    if (index >= 0) {

        openedMaterials.splice(index, 1);

    } else {

        openedMaterials.push(name);

    }

    renderFertilizerSummaryList();

}
// ------------------------
// 資材内訳生成
// ------------------------
function renderMaterialDetail(name) {

    const year =
        document.getElementById(
            "summaryYear"
        ).value;

    let html = `

        <hr>

    `;

    fertilizerPlanList.forEach(plan => {

        // 対象年のみ
        if (plan.year !== year) return;

        let quantity = 0;

        plan.materials.forEach(material => {

            if (
                material.material === name
            ) {

                quantity +=
                    Number(material.amount);

            }

        });

        // 使用していない田んぼは表示しない
        if (quantity === 0) return;

        html += `

            <div class="material-detail-row">

                <span>

                    No.${plan.field}

                </span>

                <b>

                    ${quantity}袋

                </b>

            </div>

        `;

    });

    return html;

}