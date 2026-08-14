// =========================================
// 葉面散布 管理モジュール
// spray_2.js
// Version 4.8.0
// ==========================================

let sprayMaterials = [];

// ========================================
// 葉面散布入力画面の初期化・描画
// ========================================
function showFoliarInput() {
    selectedFieldIds = [];
    sprayMaterials = [];

    renderSprayMaterialList();
    renderSprayDilutions();
    if (typeof initFoliarFieldButtons === "function") {
        initFoliarFieldButtons();
    }
    
}

// ========================================
// メイン入力欄（資材プルダウン）にマスタの値を詰め込む
// ========================================
function renderSprayMaterialList() {
    const materialSelect = document.getElementById("sprayMaterial");
    if (!materialSelect) return;

    let html = '<option value="">-- 資材を選択 --</option>';
    if (Array.isArray(materialMaster)) {
        materialMaster.forEach((m, mIdx) => {
            if (m.works && m.works.includes("葉面散布")) {
                html += `<option value="${mIdx}">${m.name}</option>`;
            }
        });
    }
    materialSelect.innerHTML = html;
    renderSprayDilutions();
}

// ========================================
// 選択された資材に登録されている倍率を読み込む
// ========================================
function renderSprayDilutions() {
    const materialSelect = document.getElementById("sprayMaterial");
    if (!materialSelect) return;

    const materialIndex = materialSelect.value;
    const select = document.getElementById("sprayDilution");
    if (!select) return;

    if (materialIndex === "") {
        select.innerHTML = '<option value="">-- 倍率 --</option>';
        return;
    }

    const material = materialMaster[materialIndex];
    let html = "";
    (material.dilutions || []).forEach(d => {
        html += `<option value="${d}">${d}倍</option>`;
    });
    select.innerHTML = html;

    calculateSprayAmounts();
}

// ========================================
// 資材追加ボタンを押したとき
// ========================================
function addSprayMaterial() {
    const materialSelect = document.getElementById("sprayMaterial");
    const dilutionSelect = document.getElementById("sprayDilution");
    if (!materialSelect || !dilutionSelect) return;

    const materialIndex = materialSelect.value;
    const dilution = dilutionSelect.value;

    if (materialIndex === "" || dilution === "") return;

    sprayMaterials.push({
        materialIndex: Number(materialIndex),
        dilution: Number(dilution),
        amount: 0
    });

    materialSelect.value = "";
    dilutionSelect.innerHTML = '<option value="">-- 倍率 --</option>';
    const mainAmountSpan = document.getElementById("mainSprayAmount");
    if (mainAmountSpan) mainAmountSpan.textContent = "";

    calculateSprayAmounts();
}

// ========================================
// 追加された資材リスト（下部）を描画する
// ========================================
function renderSprayMaterialItems() {
    const list = document.getElementById("sprayMaterialList");
    if (!list) return;

    let html = "";

    sprayMaterials.forEach((item, index) => {
        let optionsHtml = "";
        materialMaster.forEach((m, mIdx) => {
            if (m.works && m.works.includes("葉面散布")) {
                const selected = mIdx === item.materialIndex ? "selected" : "";
                optionsHtml += `<option value="${mIdx}" ${selected}>${m.name}</option>`;
            }
        });

        let dilutionOptionsHtml = "";
        const currentMaterial = materialMaster[item.materialIndex];
        if (currentMaterial && currentMaterial.dilutions) {
            currentMaterial.dilutions.forEach(d => {
                const selected = Number(d) === Number(item.dilution) ? "selected" : "";
                dilutionOptionsHtml += `<option value="${d}" ${selected}>${d}倍</option>`;
            });
        }

        let amountText = "";
        if (item.amount > 0) {
            if (item.amount < 0.1) {
                amountText = `${Math.round(item.amount * 1000)}ml`;
            } else {
                amountText = `${item.amount.toFixed(2)}L`;
            }
        }

        html += `
            <div class="spray-grid-row spray-added-item" style="margin-bottom: 8px;">
                <div class="spray-col-material">
                    <select onchange="changeAddedMaterial(${index}, this.value)" style="width: 100%; height: 36px;">
                        ${optionsHtml}
                    </select>
                </div>
                <div class="spray-col-controls" style="display: flex; align-items: center; gap: 8px;">
                    <select onchange="changeAddedDilution(${index}, this.value)" style="width: 70px; height: 36px;">
                        ${dilutionOptionsHtml}
                    </select>
                    <span class="spray-item-amount" style="min-width: 60px; text-align: right; font-weight: bold;">
                        ${amountText}
                    </span>
                    <button class="spray-item-del-btn" onclick="removeSprayMaterial(${index})" style="background: none; border: none; cursor: pointer;">
                        ❌
                    </button>
                </div>
            </div>
        `;
    });

    list.innerHTML = html;
}

// ========================================
// タンク容量をもとに、薬品の必要量を自動計算する関数
// ========================================
function calculateSprayAmounts() {
    const tankSelect = document.getElementById("foliarTank");
    if (!tankSelect) return;

    const tankVolume = Number(tankSelect.value);

    const mainMaterialSelect = document.getElementById("sprayMaterial");
    const mainDilutionSelect = document.getElementById("sprayDilution");
    const mainAmountSpan = document.getElementById("mainSprayAmount");

    if (mainMaterialSelect && mainDilutionSelect && mainAmountSpan) {
        const mainDilution = Number(mainDilutionSelect.value);
        if (mainMaterialSelect.value !== "" && mainDilution > 0) {
            const mainAmount = tankVolume / mainDilution;
            mainAmountSpan.dataset.amount = mainAmount;
            if (mainAmount < 0.1) {
                mainAmountSpan.textContent = `${Math.round(mainAmount * 1000)}ml`;
            } else {
                mainAmountSpan.textContent = `${mainAmount.toFixed(2)}L`;
            }
        } else {
            mainAmountSpan.textContent = "";
        }
        
    }

    sprayMaterials.forEach(item => {
        if (item.dilution && item.dilution > 0) {
            item.amount = tankVolume / item.dilution;
        } else {
            item.amount = 0;
        }
    });

    renderSprayMaterialItems();
}

function changeAddedMaterial(index, newMaterialIndex) {
    const mIdx = Number(newMaterialIndex);
    sprayMaterials[index].materialIndex = mIdx;
    
    const material = materialMaster[mIdx];
    if (material && material.dilutions && material.dilutions.length > 0) {
        sprayMaterials[index].dilution = Number(material.dilutions[0]);
    } else {
        sprayMaterials[index].dilution = 0;
    }
    calculateSprayAmounts();
}

function changeAddedDilution(index, newDilution) {
    sprayMaterials[index].dilution = Number(newDilution);
    calculateSprayAmounts();
}

function removeSprayMaterial(index) {
    sprayMaterials.splice(index, 1);
    calculateSprayAmounts();
}
// ==========================================
// 葉面散布編集データ読込
// ==========================================
function loadSprayForEdit() {

    const record = recordList[editingRecordIndex];

    if (!record) {
        alert("編集する記録が見つかりません。");
        return;
    }

    // 作業日を復元
    recordDate = record.date;

    // 田んぼを復元
    selectedFieldIds = (record.fields || []).map(field =>
        String(field.fieldNo)
    );
}


// ==========================================
// 葉面散布編集画面
// ==========================================
function showSprayEdit() {

    const record = recordList[editingRecordIndex];

    if (!record) {
        alert("編集する記録が見つかりません。");
        return;
    }

    const firstField =
        record.fields && record.fields.length > 0
            ? record.fields[0]
            : null;

    const materials =
        firstField &&
        Array.isArray(firstField.materials)
            ? firstField.materials
            : [];

    // タンク容量をメモから復元
    let tankSize = "";

    if (record.memo) {

        const match =
            record.memo.match(/タンク容量:\s*([0-9.]+)L/);

        if (match) {
            tankSize = match[1];
        }
    }

    const app =
        document.getElementById("app");

    if (!app) {
        return;
    }

    app.innerHTML = `
        <div class="page">

            <div class="page-header">
                <h2>✏️ 葉面散布編集</h2>
            </div>

            <div class="card">

                <label>作業日</label><br>

                <input
                    type="date"
                    id="editSprayDate"
                    value="${record.date || ""}">

            </div>


            <div class="card">

                <label class="form-group-label">
                    🌾 田んぼを選択してください（複数選択可）
                </label>

                <div class="selection-flex-wrap">

                    ${renderSprayEditFieldButtons()}

                </div>

            </div>


            <div class="card">

                <label>タンク容量</label><br>

                <div class="form-input-row">

                    <input
                        type="number"
                        id="editSprayTank"
                        step="1"
                        class="form-input-amount"
                        value="${tankSize}">

                    <span>L</span>

                </div>

            </div>


            <div class="card">

                <h3>使用資材</h3>

                <div id="editSprayMaterials">

                    ${
                        materials.length > 0
                            ? materials.map((mat, index) => {

                                const master =
                                    materialMaster.find(
                                        m => m.name === mat.material
                                    );

                                const unit =
                                    master && master.weightUnit
                                        ? master.weightUnit
                                        : mat.unit || "";

                                return `
                                    <div
                                        class="card"
                                        style="margin-bottom:10px;">

                                        <label>資材</label><br>

                                        <select
                                            class="form-select-full"
                                            id="editSprayMaterial_${index}">

                                            <option value="">
                                                選択してください
                                            </option>

                                            ${materialMaster
                                                .map(m => `
                                                    <option
                                                        value="${m.name}"
                                                        ${m.name === mat.material
                                                            ? "selected"
                                                            : ""}>
                                                        ${m.name}
                                                    </option>
                                                `)
                                                .join("")}

                                        </select>

                                        <br><br>

                                        <label>使用量</label><br>

                                        <div class="form-input-row">

                                            <input
                                                type="number"
                                                step="0.001"
                                                class="form-input-amount"
                                                id="editSprayAmount_${index}"
                                                value="${mat.amount}">

                                            <span>${unit}</span>

                                        </div>

                                    </div>
                                `;

                            }).join("")
                            : `
                                <p>使用資材がありません。</p>
                            `
                    }

                </div>

            </div>


            <div class="card">

                <button
                    class="btn-save-green"
                    onclick="saveSprayEdit()">

                    💾 保存

                </button>

            </div>

        </div>
    `;
}


// ==========================================
// 葉面散布編集用 田んぼ選択
// ==========================================
function toggleSprayEditFieldSelection(fieldId) {

    const id = String(fieldId);

    const index =
        selectedFieldIds.indexOf(id);

    if (index >= 0) {

        selectedFieldIds.splice(index, 1);

    } else {

        selectedFieldIds.push(id);

    }

    showSprayEdit();
}


// ==========================================
// 葉面散布編集用 田んぼボタン生成
// ==========================================
function renderSprayEditFieldButtons() {

    let html = "";

    fieldMaster.forEach(field => {

        const fieldId =
            String(field.no);

        const selected =
            selectedFieldIds.includes(fieldId);

        html += `
            <button
                class="${selected ? "tab active" : "tab"}"
                onclick="toggleSprayEditFieldSelection('${fieldId}')">

                ${selected ? "☑" : "☐"}
                ${field.no}　${field.owner}

            </button>
        `;
    });

    return html;
}


// ==========================================
// 葉面散布編集保存
// ==========================================
function saveSprayEdit() {

    const record =
        recordList[editingRecordIndex];

    if (!record) {
        alert("編集する記録が見つかりません。");
        return;
    }

    // --------------------------
    // 入力値取得
    // --------------------------

    const date =
        document.getElementById("editSprayDate").value;

    const tank =
        Number(
            document.getElementById("editSprayTank").value
        );


    // --------------------------
    // 入力チェック
    // --------------------------

    if (!date) {
        alert("作業日を入力してください。");
        return;
    }

    if (
        !selectedFieldIds ||
        selectedFieldIds.length === 0
    ) {
        alert("田んぼを選択してください。");
        return;
    }

    if (!tank || tank <= 0) {
        alert("タンク容量を入力してください。");
        return;
    }


    // --------------------------
    // 資材を取得
    // --------------------------

    const oldMaterials =
        record.fields &&
        record.fields.length > 0 &&
        Array.isArray(record.fields[0].materials)
            ? record.fields[0].materials
            : [];

    const materials = [];

    let hasError = false;


    oldMaterials.forEach((oldMaterial, index) => {

        const materialSelect =
            document.getElementById(
                `editSprayMaterial_${index}`
            );

        const amountInput =
            document.getElementById(
                `editSprayAmount_${index}`
            );

        if (!materialSelect || !amountInput) {
            return;
        }

        const material =
            materialSelect.value;

        const amount =
            Number(amountInput.value);


        if (!material) {
            alert("使用資材を選択してください。");
            hasError = true;
            return;
        }

        if (amount <= 0) {
            alert("使用量を入力してください。");
            hasError = true;
            return;
        }


        const master =
            materialMaster.find(
                m => m.name === material
            );


        materials.push({

            material: material,

            amount: amount,

            // 資材マスタの「内容量単位」を使用
            unit: master && master.weightUnit
                ? master.weightUnit
                : oldMaterial.unit || ""

        });

    });


    if (hasError) {
        return;
    }

    if (materials.length === 0) {
        alert("使用資材を1つ以上入力してください。");
        return;
    }


    // --------------------------
    // fields を再構築
    // --------------------------

    const fieldsData =
        selectedFieldIds.map(fieldNo => {

            return {

                fieldNo: fieldNo,

                materials: materials.map(mat => ({
                    material: mat.material,
                    amount: mat.amount,
                    unit: mat.unit
                }))

            };

        });


    // --------------------------
    // レコード更新
    // --------------------------

    record.date = date;

    record.work = "葉面散布";

    record.memo =
        `タンク容量: ${tank}L`;

    record.fields =
        fieldsData;


    // --------------------------
    // 保存
    // --------------------------

    saveRecordList();

    selectedFieldIds = [];

    editingRecordIndex = -1;

    alert("葉面散布の記録を更新しました。");

    showHistory();
}