// ==========================================
// Lotus Farm Manager
// storage.js
// Version 4.8.0
// ==========================================


// ==========================================
// LocalStorage 共通保存
// ==========================================
// JSON化してLocalStorageへ保存する共通処理
function saveToStorage(key, data) {

    localStorage.setItem(
        key,
        JSON.stringify(data)
    );

}


// ==========================================
// 田んぼマスタ
// ==========================================

// ------------------------
// 保存
// ------------------------
// 田んぼマスタをローカルストレージに永続化
function saveFieldMaster() {

    saveToStorage("fieldMaster", fieldMaster);

}

// ------------------------
// 読込
// ------------------------
// 田んぼマスタをローカルストレージからロード
function loadFieldMaster() {

    const data = localStorage.getItem("fieldMaster");

    if (data) {
        fieldMaster = JSON.parse(data);
    } else {
        fieldMaster = [];
    }

}



// ==========================================
// 作業マスタ
// ==========================================

// ------------------------
// 保存
// ------------------------
// 作業マスタをローカルストレージに永続化
function saveWorkMaster() {

    saveToStorage("workMaster", workMaster);

}

// ------------------------
// 読込
// ------------------------
// 作業マスタをローカルストレージからロード
function loadWorkMaster() {

    const data = localStorage.getItem("workMaster");

    if (data) {
        workMaster = JSON.parse(data);
    } else {
        workMaster = [];
    }
// 初回起動時のみデフォルト作業を登録
if (workMaster.length === 0) {

    createDefaultWorkMaster();

}
}// ------------------------
// 作業記録保存
// ------------------------
// 入力・蓄積された全作業記録（実績リスト）をローカルストレージへ保存
function saveRecordList() {

    saveToStorage("recordList", recordList);
    saveToStorage("shipmentRecords", shipmentRecords);

}

// ------------------------
// 作業記録読込
// ------------------------
// ローカルストレージから全作業記録データを復元ロード
function loadRecordList() {

    const recordData =
        localStorage.getItem("recordList");

    if (recordData) {
        recordList = JSON.parse(recordData);
    } else {
        recordList = [];
    }

    const shipmentData =
        localStorage.getItem("shipmentRecords");

    if (shipmentData) {
        shipmentRecords = JSON.parse(shipmentData);
    } else {
        shipmentRecords = [];
    }

}



// ==========================================
// バックアップ
// ==========================================

// アプリ内全マスタ及び記録データを統合オブジェクトにしてJSONファイルとしてエクスポート
function exportBackup() {

    const backupData = {

        fieldMaster,
        workMaster,
        materialMaster,
        templateMaster,
        fertilizerPlanList,
        recordList,
        shipmentRecords,
        priceMaster

    };

    const json = JSON.stringify(backupData, null, 2);

    const blob = new Blob([json], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "LotusFarmManager_Save.json";
    a.click();

    URL.revokeObjectURL(url);

    
}

// ユーザーが選択したJSONのバックアップファイルを解析し、データをアプリ内にインポート復元

function importBackup() {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";

    input.addEventListener("change", function () {
        const file = input.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {

            let backupData;

            try {
                backupData = JSON.parse(e.target.result);
            } catch (error) {
                alert("バックアップファイルを読み込めませんでした。\n正しいJSONファイルを選択してください。");
                return;
            }

            if (!backupData || typeof backupData !== "object") {
                alert("バックアップデータが正しくありません。");
                return;
            }

            showRestoreSelection(backupData);
        };

        reader.readAsText(file);
    });

    input.click();
}

// ------------------------
// 選択復元
// ------------------------
// バックアップ内のデータを選択して復元する画面を表示
function showRestoreSelection(backupData) {

    const restoreItems = [
        { key: "fieldMaster", label: "田んぼマスタ" },
        { key: "workMaster", label: "作業マスタ" },
        { key: "materialMaster", label: "資材マスタ" },
        { key: "fertilizerPlanList", label: "施肥設計" },
        { key: "templateMaster", label: "テンプレート" },
        { key: "recordList", label: "作業記録" },
        { key: "shipmentRecords", label: "出荷記録" },
        { key: "priceMaster", label: "価格マスタ" }
    ];

    const overlay = document.createElement("div");

    overlay.id = "restoreSelectionOverlay";

    overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.45);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 20px;
        box-sizing: border-box;
    `;

    const panel = document.createElement("div");

    panel.style.cssText = `
        background: #fff;
        width: min(420px, 100%);
        max-height: 90vh;
        overflow-y: auto;
        border-radius: 12px;
        padding: 20px;
        box-sizing: border-box;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
    `;

    panel.innerHTML = `
        <h3 style="margin-top:0;">📥 復元するデータを選択</h3>
        <p style="margin-bottom:15px;">選択したデータだけをバックアップから上書き復元します。</p>
        <div id="restoreSelectionList"></div>
        <div style="display:flex; gap:8px; margin-top:18px; flex-wrap:wrap;">
            <button type="button" id="restoreSelectAll">全選択</button>
            <button type="button" id="restoreClearAll">全解除</button>
        </div>
        <div style="display:flex; gap:8px; margin-top:18px;">
            <button type="button" id="restoreCancel" style="flex:1;">キャンセル</button>
            <button type="button" id="restoreExecute" style="flex:1;">復元する</button>
        </div>
    `;

    overlay.appendChild(panel);
    document.body.appendChild(overlay);

    const list = panel.querySelector("#restoreSelectionList");

    restoreItems.forEach(item => {

        const hasData = Object.prototype.hasOwnProperty.call(
            backupData,
            item.key
        );

        const label = document.createElement("label");

        label.style.cssText = `
            display:block;
            padding:9px 4px;
            border-bottom:1px solid #eee;
        `;

        label.innerHTML = `
            <input
                type="checkbox"
                class="restore-checkbox"
                value="${item.key}"
                ${hasData ? "checked" : "disabled"}
            >
            ${item.label}
            ${hasData ? "" : "（バックアップにありません）"}
        `;

        list.appendChild(label);
    });

    panel
        .querySelector("#restoreSelectAll")
        .addEventListener("click", function () {
            panel
                .querySelectorAll(".restore-checkbox:not(:disabled)")
                .forEach(checkbox => checkbox.checked = true);
        });

    panel
        .querySelector("#restoreClearAll")
        .addEventListener("click", function () {
            panel
                .querySelectorAll(".restore-checkbox")
                .forEach(checkbox => checkbox.checked = false);
        });

    panel
        .querySelector("#restoreCancel")
        .addEventListener("click", function () {
            overlay.remove();
        });

    panel
        .querySelector("#restoreExecute")
        .addEventListener("click", function () {

            const selectedKeys = Array.from(
                panel.querySelectorAll(".restore-checkbox:checked")
            ).map(checkbox => checkbox.value);

            if (selectedKeys.length === 0) {
                alert("復元するデータを1つ以上選択してください。");
                return;
            }

            if (!confirm("選択したデータを上書き復元します。\nよろしいですか？")) {
                return;
            }

            restoreSelectedData(backupData, selectedKeys);

            overlay.remove();
        });
}

// 選択されたデータだけをアプリ内へ展開し、LocalStorageへ保存
function restoreSelectedData(backupData, selectedKeys) {

    // ----------------------------------------
    // 施肥設計の復元前チェック
    // ----------------------------------------
    // 施肥設計は、ほ場・作業・資材マスタを参照するため、
    // 復元後に必要なデータが揃っているか先に確認する。
    // 不足がある場合は、何も復元せずに中止する。
    if (selectedKeys.includes("fertilizerPlanList")) {

        const targetFieldMaster =
            selectedKeys.includes("fieldMaster")
                ? (backupData.fieldMaster || [])
                : fieldMaster;

        const targetWorkMaster =
            selectedKeys.includes("workMaster")
                ? (backupData.workMaster || [])
                : workMaster;

        const targetMaterialMaster =
            selectedKeys.includes("materialMaster")
                ? (backupData.materialMaster || [])
                : materialMaster;

        const missingFields = new Set();
        const missingWorks = new Set();
        const missingMaterials = new Set();

        const planList = backupData.fertilizerPlanList || [];

        planList.forEach(plan => {

            if (plan && plan.field != null) {

                const exists = targetFieldMaster.some(
                    field => String(field.no) === String(plan.field)
                );

                if (!exists) {
                    missingFields.add(String(plan.field));
                }
            }

            if (!plan || !Array.isArray(plan.materials)) {
                return;
            }

            plan.materials.forEach(item => {

                if (!item) {
                    return;
                }

                if (item.work) {
                    const existsWork = targetWorkMaster.some(
                        work => work && work.name === item.work
                    );

                    if (!existsWork) {
                        missingWorks.add(item.work);
                    }
                }

                if (item.material) {
                    const existsMaterial = targetMaterialMaster.some(
                        material => material && material.name === item.material
                    );

                    if (!existsMaterial) {
                        missingMaterials.add(item.material);
                    }
                }
            });
        });

        const errorLines = [];

        if (missingFields.size > 0) {
            errorLines.push(
                "不足しているほ場：" +
                Array.from(missingFields).join("、")
            );
        }

        if (missingWorks.size > 0) {
            errorLines.push(
                "不足している作業：" +
                Array.from(missingWorks).join("、")
            );
        }

        if (missingMaterials.size > 0) {
            errorLines.push(
                "不足している資材：" +
                Array.from(missingMaterials).join("、")
            );
        }

        if (errorLines.length > 0) {

            alert(
                "施肥設計を復元できません。\n\n" +
                "必要なマスタが登録されていません。\n" +
                errorLines.join("\n") +
                "\n\n先に不足しているマスタを登録してください。"
            );

            return;
        }
    }

    // ----------------------------------------
    // 選択されたデータを復元
    // ----------------------------------------
    if (selectedKeys.includes("fieldMaster")) {
        fieldMaster = backupData.fieldMaster || [];
        saveFieldMaster();
    }

    if (selectedKeys.includes("workMaster")) {
        workMaster = backupData.workMaster || [];
        saveWorkMaster();
    }

    if (selectedKeys.includes("materialMaster")) {
        materialMaster = backupData.materialMaster || [];
        saveMaterialMaster();
    }

    if (selectedKeys.includes("fertilizerPlanList")) {
        fertilizerPlanList = backupData.fertilizerPlanList || [];
        saveFertilizerPlanList();
    }

    if (selectedKeys.includes("templateMaster")) {
        templateMaster = backupData.templateMaster || [];
        saveTemplateMaster();
    }

    if (selectedKeys.includes("recordList")) {
        recordList = backupData.recordList || [];
        saveToStorage("recordList", recordList);
    }

    if (selectedKeys.includes("shipmentRecords")) {
        shipmentRecords = backupData.shipmentRecords || [];
        saveToStorage("shipmentRecords", shipmentRecords);

        window.editShipmentIndex = null;
        shipmentItems = [];
    }

    if (selectedKeys.includes("priceMaster")) {
        priceMaster = backupData.priceMaster || [];
        savePriceMaster();
    }

    alert("選択したデータを復元しました。");

    // 復元元が設定画面なので、復元後も設定画面へ戻す
    showSettings();
}



// タイムスタンプ（日時）付きのファイル名で、全データをまとめて保存・出力するエクスポート処理
function exportBackupHistory() {

    const backupData = {

        fieldMaster,
        workMaster,
        materialMaster,
        templateMaster,
        fertilizerPlanList,
        recordList,
        shipmentRecords,
        priceMaster

    };

    const json =
        JSON.stringify(backupData, null, 2);

    const blob =
        new Blob([json], {
            type: "application/json"
        });

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    const now = new Date();

    const yyyy = now.getFullYear();

    const mm =
        String(now.getMonth() + 1).padStart(2, "0");

    const dd =
        String(now.getDate()).padStart(2, "0");

    const hh =
        String(now.getHours()).padStart(2, "0");

    const mi =
        String(now.getMinutes()).padStart(2, "0");

    a.href = url;

    a.download =
        `LotusFarmManager_${yyyy}${mm}${dd}_${hh}${mi}.json`;

    a.click();

    URL.revokeObjectURL(url);

}
// ==========================================
// 施肥設計
// ==========================================

// ------------------------
// 保存
// ------------------------
// 施肥設計リストをローカルストレージに保存
function saveFertilizerPlanList() {

    saveToStorage("fertilizerPlanList", fertilizerPlanList);

}

// ------------------------
// 読込
// ------------------------
// 施肥設計リストをローカルストレージから読み出し
function loadFertilizerPlanList() {

    const data =
        localStorage.getItem("fertilizerPlanList");

    if (data) {
        fertilizerPlanList = JSON.parse(data);
    } else {
        fertilizerPlanList = [];
    }

}


// ------------------------------------------
// テンプレートマスタの永続化
// ------------------------------------------
function saveTemplateMaster() {
    saveToStorage("templateMaster", templateMaster);
}

function loadTemplateMaster() {
    const data = localStorage.getItem("templateMaster");
    templateMaster = data ? JSON.parse(data) : [];
}

// ------------------------------------------
// テンプレートを保存
// ------------------------------------------
function saveTemplate({ type }) {

if (type === "standard") {

    const field =
        document.getElementById("planField").value;

    const fieldData =
        fieldMaster.find(item => item.no == field);

    const name =
        `No.${fieldData.no} ${fieldData.owner} 標準`;
　const template = {

    id: crypto.randomUUID(),

    name,

    type,

    fieldNo: field,

    // 配列をコピーして保存
    materials: structuredClone(planMaterials)

};

const index =
    templateMaster.findIndex(item =>
        item.type === "standard" &&
        item.fieldNo == field
    );
    if (index >= 0) {

    // 上書き
    templateMaster[index] = template;

} else {

    // 新規追加
    templateMaster.push(template);
console.log("共通テンプレート保存");

}

    // 標準テンプレート保存

}
saveTemplateMaster();
renderTemplateSelect();

}

// ------------------------------------------
// テンプレートを読込
// ------------------------------------------
// ------------------------------------------
// テンプレートを読込
// ------------------------------------------
function loadTemplate(template) {

    // 資材をコピー
    planMaterials = structuredClone(template.materials);

    // 画面更新（合計も更新される）
    renderPlanMaterials();

}
// ------------------------------------------
// 標準テンプレートを読込
// ------------------------------------------
function loadStandardTemplate() {

    const field =
        document.getElementById("planField").value;

    const template =
        templateMaster.find(item =>
            item.type === "standard" &&
            item.fieldNo == field
        );

    if (!template) {

        alert("標準テンプレートがありません。");

        return;

    }

    loadTemplate(template);

}

// ============================================================
// 共通テンプレート保存
// ============================================================
function saveCommonTemplate() {

    const name = prompt("テンプレート名を入力してください");

if (name === null) {
    return;
}

if (name.trim() === "") {

    alert("テンプレート名を入力してください。");

    return;

}

    // キャンセル・未入力
    if (!name) {
        return;
    }
templateMaster.push({

    id: crypto.randomUUID(),

    name: name,

    type: "common",

    fieldNo: "",

    materials: structuredClone(planMaterials)

});
saveTemplateMaster();
renderTemplateSelect();

}

// ============================================================
// 共通テンプレート読込
// ============================================================
function loadTemplateSelect() {

    const id =
    document.getElementById("commonTemplateSelect").value;

    const template =
        templateMaster.find(item =>
            item.id === id
        );

    if (!template) {

        alert("テンプレートが見つかりません。");

        return;

    }

    loadTemplate(template);

}

// ============================================================
// 共通テンプレート削除
// ============================================================
function deleteCommonTemplate() {

    const id =
        document.getElementById("commonTemplateSelect").value;

    if (!id) {

        alert("テンプレートを選択してください。");

        return;

    }

    if (!confirm("削除しますか？")) {

        return;

    }

    templateMaster =
        templateMaster.filter(item =>
            item.id !== id
        );

    saveTemplateMaster();

    renderTemplateSelect();

}
// ------------------------
// 作業マスタ初期化
// 初回起動時のみデフォルト作業を登録
// ------------------------
function createDefaultWorkMaster() {

    workMaster = [

        { name: "元肥", category: "fertilizer" },
        { name: "追肥①", category: "fertilizer" },
        { name: "追肥②", category: "fertilizer" },
        { name: "追肥③", category: "fertilizer" },

        { name: "葉面散布", category: "spray" },

        { name: "除草", category: "weed" }

    ];

    saveWorkMaster();

}

function savePriceMaster() {

    saveToStorage("priceMaster", priceMaster);

}

function loadPriceMaster() {

    const data = localStorage.getItem("priceMaster");

    if (data) {
        priceMaster = JSON.parse(data);
    } else {
        priceMaster = [];
    }

}

