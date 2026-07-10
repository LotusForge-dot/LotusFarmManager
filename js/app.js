// ==========================================
// Lotus Farm Manager
// app.js
// Version 0.9.0
// ==========================================

// ------------------------------------------
// グローバル変数定義と初期化
// ------------------------------------------
const app = document.getElementById("app");
let recordList = [];
let planMaterials = [];

let editingRecordIndex = -1; // 編集中のレコードインデックス（-1は新規登録）
let recordDate = getToday();

// ------------------------
// 入力画面
// ------------------------

// 現在選択中の入力タブ
let inputTab = "fertilizer";
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
// 選択中の追肥作業
// ------------------------
let selectedTopWork = "追肥①";


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
    // 履歴検索用プルダウンの生成
    renderHistoryFieldOptions();
    renderHistoryWorkOptions();
    renderHistoryYearOptions();

    // 履歴一覧の初回描画
    renderHistoryList();
    // 検索条件変更時の自動再描画イベント設定
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
    // 検索条件クリアボタンのイベント設定
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
// 設定画面の生成と表示
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

                            return `${material.material} ${material.bags}${unit}`;

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

// 履歴画面にて、検索フィルター条件に合致するデータを抽出・集計して描画
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

    let html = `
        <table border="1" width="100%" cellspacing="0" cellpadding="5">

        <tr>
            <th>日付</th>
            <th>作業</th>
            <th>内容</th>
            <th>備考</th>
            <th>操作</th>
        </tr>
    `;

    const filteredRecords = recordList

        .slice()

        .sort((a, b) => b.date.localeCompare(a.date))

        .filter(record => {

            if (selectedYear !== "" &&
                !record.date.startsWith(selectedYear)) {

                return false;

            }

            if (selectedWork !== "" &&
                record.work !== selectedWork) {

                return false;

            }

            if (from !== "" &&
                record.date < from) {

                return false;

            }

            if (to !== "" &&
                record.date > to) {

                return false;

            }

            if (selectedField !== "") {

                return record.fields.some(field =>
                    String(field.fieldNo) === String(selectedField)
                );

            }

            return true;

        });

    const materialSummary = {};

    let totalN = 0;
    let totalP = 0;
    let totalK = 0;
    let totalCost = 0;

    filteredRecords.forEach(record => {

        record.fields.forEach(field => {

            field.materials.forEach(material => {

                const master =
                    materialMaster.find(m => m.name === material.material);

                const amount = Number(material.bags);

                if (master) {

                    totalN += amount * master.weight * master.n / 100;
                    totalP += amount * master.weight * master.p / 100;
                    totalK += amount * master.weight * master.k / 100;
                    totalCost += amount * master.price;

                }

                if (!materialSummary[material.material]) {

                    materialSummary[material.material] = 0;

                }

                materialSummary[material.material] += amount;

            });

        });

        const originalIndex =
            recordList.indexOf(record);

        const detailText = record.fields

            .map(field => {

                const fieldInfo =
                    fieldMaster.find(f => f.no == field.fieldNo);

                const fieldName = fieldInfo
                    ? `No.${fieldInfo.no}<br>${fieldInfo.owner}`
                    : `No.${field.fieldNo}`;

                const materials = field.materials

                    .map(material => {

                        const master =
                            materialMaster.find(m => m.name === material.material);

                        const unit =
                            master ? master.unit : "袋";

                        return `${material.material} ${material.bags}${unit}`;

                    })

                    .join("<br>");

                return `<b>${fieldName}</b><br>${materials}`;

            })

            .join("<hr>");

        html += `
            <tr>
                <td>${record.date}</td>
                <td>${record.work}</td>
                <td>${detailText}</td>
                <td>${record.memo || ""}</td>
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

        const unit =
            master ? master.unit : "";

        materialHtml += `${name}：${materialSummary[name]}${unit}<br>`;

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

        <label>年</label>

        <select id="planYear"></select>

        <label>田んぼ</label>

        <select id="planField"></select>

<br><br>
<label>テンプレート</label>
<br>
<select id="commonTemplateSelect"></select>
<button onclick=" loadTemplateSelect()">
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

    // 年、田んぼが変更されたら該当の施肥設計をロード
    document
    .getElementById("planYear")
    .addEventListener("change", loadFertilizerPlan);

    document
    .getElementById("planField")
    .addEventListener("change", loadFertilizerPlan);

    loadFertilizerPlan();
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

    const year =
        document.getElementById("getElementById") ? "" : document.getElementById("planYear").value;

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

    const div =
        document.getElementById("planMaterials");

    let html = "";
    // 現在登録されている作業グループのユニーク一覧
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

console.log("fieldNo =", fieldNo);
console.log("fieldMaster =", fieldMaster);

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

                    const selected = selectedFieldIds.includes(String(field.no));

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
    onchange="recordDate = this.value"><br><br>
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

                let fieldListHtml = "";

                fieldMaster.forEach(field => {
// この田んぼの施肥設計を取得
const plan = getFertilizerPlan(
    recordDate.substring(0, 4),
    String(field.no)
);

if (!plan) {

    return;

}

// 選択中の作業が登録されているか
const hasWork = plan.materials.some(material =>
    material.work === selectedTopWork
);

if (!hasWork) {

    return;

}
                    const selected = selectedFieldIds.includes(String(field.no));

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
    .filter(work => work.category === "fertilizer")
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
    onchange="recordDate = this.value"><br><br>
        ${topWorkHtml}
                        <p>田んぼを選択してください</p>

                        ${fieldListHtml}

                    </div>
                    
                `;
                
 

topFertilizerList.forEach((item, index) => {

    let fieldHtml = "";

    selectedFieldIds.forEach(fieldNo => {

        const field =
            fieldMaster.find(f => String(f.no) === String(fieldNo));

        if (!field) return;

        const area = Number(field.area);

const rawBags = area * item.rate;

const bags =
    rawBags % 1 >= 0.4
        ? Math.ceil(rawBags)
        : Math.floor(rawBags);

        fieldHtml += `
            <div>
                ${field.no} ${field.owner}
                ：${bags.toFixed(1)}袋
            </div>
        `;
    });

    

});
                html += `
                <button
    class="mainButton"
    onclick="loadTopFertilizerFromPlan()">

    📋施肥設計読込

</button>
    <div class="card">

        <div id="topFertilizerCards"></div>

        

  
<button onclick="saveTopFertilizer()">
    💾 保存
</button>


    </div>
    
`;

            }

            break;

        case "spray":

            html = `
                <div class="card">

                    <h3>💧 葉面散布入力</h3>

                    <p>作成中</p>

                </div>
            `;

            break;

        case "herbicide":

            html = `
                <div class="card">

                    <h3>🌿 除草剤入力</h3>

                    <p>作成中</p>

                </div>
            `;

            break;

        case "other":

            html = `
                <div class="card">

                    <h3>📦 その他入力</h3>

                    <p>作成中</p>

                </div>
            `;

            break;

    }

    app.innerHTML = `
        <div class="page">

            <div class="page-header">
                <h2>📝 入力</h2>
            </div>

            <div class="tab-container">

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
renderFertilizerOptions()


}
// 入力画面のタブを切り替える
function changeInputTab(tab) {

    inputTab = tab;

    // 入力画面を再表示
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

    let html = "";

    // fieldNoごとにグループ化
    const grouped = {};

    topFertilizerList.forEach(item => {

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


function saveTopFertilizer() {

    console.log("保存");

}

/**
 * 追肥入力内容を保存用データに変換する
 */
function saveTopFertilizer() {

    // 保存用データを作成
    const record = {

        // 作業日
        
        date: recordDate,

        // 作業名
        work: "追肥",

        // 田んぼごとのデータ
        fields: []

    };

    // 選択された田んぼを順番に処理
    selectedFieldIds.forEach(fieldNo => {

        // 田んぼマスタから情報を取得
        const field = fieldMaster.find(
            f => String(f.no) === String(fieldNo)
        );

        // 保存用の田んぼデータを作成
        const fieldRecord = {

            // 田んぼNo.
            fieldNo: field.no,

            // 使用した資材一覧
            materials: []

        };
// 使用した資材を追加
topFertilizerList.forEach(item => {

    const area = Number(field.area);

    const rawBags = area * item.rate;

    const bags =
        rawBags % 1 >= 0.4
            ? Math.ceil(rawBags)
            : Math.floor(rawBags);

    fieldRecord.materials.push({

        material: item.material,

        bags: bags

    });

});
        // 保存データに追加
        record.fields.push(fieldRecord);

    });

    console.log(record);

// 履歴に追加

recordList.push(record);

// 保存
saveRecordList();
recordDate = getToday();

console.log(recordList);


// 入力画面を更新
showInput();
}



function changeTopFertilizerRate(index, value) {

    topFertilizerList[index].rate = Number(value);

    showInput();

}

function changeBaseFertilizerRate(index, value) {

    baseFertilizerList[index].rate = Number(value);

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
    value="${material.bags}"
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
        .bags = Number(value);

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

    saveData();

    showRecord();

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
        bags: 0

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


function loadTopFertilizerFromPlan() {

    // 一旦リセット
    topFertilizerList = [];

    const year = recordDate.substring(0, 4);

    for (const field of selectedFieldIds) {

        const plan = getFertilizerPlan(year, field);

        if (!plan) {

            continue;

        }

        for (const material of plan.materials) {

            // 選択した作業だけ読込
            if (material.work !== selectedTopWork) {

                continue;

            }

            topFertilizerList.push({

                fieldNo: field,

                material: material.material,

                amount: material.amount

            });

        }

    }

    renderTopFertilizerCards();

}

// ------------------------
// 追肥作業変更
// ------------------------
function changeTopWork(workName) {

    selectedTopWork = workName;

    showInput();

}

