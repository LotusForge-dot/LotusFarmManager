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
    a.download = "LotusFarmManager_Backup.json";
    a.click();

    URL.revokeObjectURL(url);

}