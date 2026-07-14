// ==========================================
// Lotus Farm Manager
// storage.js
// Version 4.8.0
// ==========================================



// ==========================================
// 田んぼマスタ
// ==========================================

// ------------------------
// 保存
// ------------------------
// 田んぼマスタをローカルストレージに永続化
function saveFieldMaster() {

    localStorage.setItem(
        "fieldMaster",
        JSON.stringify(fieldMaster)
    );

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

    localStorage.setItem(
        "workMaster",
        JSON.stringify(workMaster)
    );

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

    localStorage.setItem(
        "recordList",
        JSON.stringify(recordList)
    );

}

// ------------------------
// 作業記録読込
// ------------------------
// ローカルストレージから全作業記録データを復元ロード
function loadRecordList() {

    const data = localStorage.getItem("recordList");

    if (data) {
        recordList = JSON.parse(data);
    } else {
        recordList = [];
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
    recordList
};

    const json = JSON.stringify(backupData, null, 2);

    const blob = new Blob([json], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    // 仮想のダウンロード用リンクを動的生成してクリック処理
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

            const backupData =
                JSON.parse(e.target.result);

            // データ展開（各項目が存在しない場合は空配列セーフティ）
            fieldMaster = backupData.fieldMaster || [];
            workMaster = backupData.workMaster || [];
            materialMaster = backupData.materialMaster || [];
            recordList = backupData.recordList || [];
            fertilizerPlanList = backupData.fertilizerPlanList || [];
　　　templateMaster = backupData.templateMaster || [];
            // すべての内部データをストレージへ即時反映
            saveFieldMaster();
            saveWorkMaster();
            saveMaterialMaster();
            saveRecordList();
            saveFertilizerPlanList();
            saveTemplateMaster();
            alert("復元しました。");

            showRecord(); // 画面を再描画

        };

        reader.readAsText(file);

    });

    input.click();

}

// タイムスタンプ（日時）付きのファイル名で、全データをまとめて保存・出力するエクスポート処理
function exportBackupHistory() {

    const backupData = {
    fieldMaster,
    workMaster,
    materialMaster,
    templateMaster,
    fertilizerPlanList,
    recordList
};

    const json =
        JSON.stringify(backupData, null, 2);

    const blob =
        new Blob([json], { type: "application/json" });

    const url =
        URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    // ファイル名に組み込む現在日時のフォーマット生成
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

    // YYYYMMDD_HHMI 形式の接尾辞を持たせてダウンロード
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

    localStorage.setItem(
        "fertilizerPlanList",
        JSON.stringify(fertilizerPlanList)
    );

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
    localStorage.setItem("templateMaster", JSON.stringify(templateMaster));
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