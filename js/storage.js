// ==========================================
// Lotus Farm Manager
// storage.js
// Version 1.2.0
// ==========================================



// ==========================================
// 田んぼマスタ
// ==========================================

// ------------------------
// 保存
// ------------------------

function saveFieldMaster() {

    localStorage.setItem(
        "fieldMaster",
        JSON.stringify(fieldMaster)
    );

}

// ------------------------
// 読込
// ------------------------

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

function saveWorkMaster() {

    localStorage.setItem(
        "workMaster",
        JSON.stringify(workMaster)
    );

}

// ------------------------
// 読込
// ------------------------

function loadWorkMaster() {

    const data = localStorage.getItem("workMaster");

    if (data) {
        workMaster = JSON.parse(data);
    } else {
        workMaster = [];
    }

}// ------------------------
// 作業記録保存
// ------------------------

function saveRecordList() {

    localStorage.setItem(
        "recordList",
        JSON.stringify(recordList)
    );

}

// ------------------------
// 作業記録読込
// ------------------------

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

function exportBackup() {

    const backupData = {
        fieldMaster,
        workMaster,
        materialMaster,
        recordList
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

            fieldMaster = backupData.fieldMaster || [];
            workMaster = backupData.workMaster || [];
            materialMaster = backupData.materialMaster || [];
            recordList = backupData.recordList || [];

            saveFieldMaster();
            saveWorkMaster();
            saveMaterialMaster();
            saveRecordList();

            alert("復元しました。");

            showRecord();

        };

        reader.readAsText(file);

    });

    input.click();

}

function exportBackupHistory() {

    const backupData = {

        fieldMaster,
        workMaster,
        materialMaster,
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