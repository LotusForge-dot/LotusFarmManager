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

    const record =
        recordList[editingRecordIndex];

    if (!record) {
        alert("編集する記録が見つかりません。");
        return;
    }

    // --------------------------
    // 作業日
    // --------------------------
    recordDate =
        record.date;


    // --------------------------
    // 田んぼ
    // --------------------------
    selectedFieldIds =
        (record.fields || []).map(
            field => String(field.fieldNo)
        );


    // --------------------------
    // タンク容量を復元
    // --------------------------
    let tankVolume = 0;

    const memo =
        record.memo || "";

    const match =
        memo.match(
            /タンク容量:\s*([\d.]+)L/
        );

    if (match) {
        tankVolume =
            Number(match[1]);
    }


    // --------------------------
    // 既存資材を復元
    // --------------------------
    const firstField =
        record.fields &&
        record.fields.length > 0
            ? record.fields[0]
            : null;

    const materials =
        firstField &&
        Array.isArray(firstField.materials)
            ? firstField.materials
            : [];


    materialInputRows =
        materials.map(mat => {

            const materialIndex =
                materialMaster.findIndex(
                    material =>
                        material.name === mat.material
                );


            let dilution = "";


            // 使用量から倍率を逆算
            if (
                tankVolume > 0 &&
                Number(mat.amount) > 0
            ) {

                dilution =
                    tankVolume /
                    Number(mat.amount);

            }


            return {

                materialIndex:
                    materialIndex >= 0
                        ? materialIndex
                        : "",

                dilution:
                    dilution > 0
                        ? dilution
                        : ""

            };

        });


    // 資材がない古い記録への保険
    if (materialInputRows.length === 0) {

        resetMaterialInputRows();

    }

}
// ==========================================
// 葉面散布編集画面
// ==========================================
function showSprayEdit() {

    const record =
        recordList[editingRecordIndex];

    if (!record) {
        alert("編集する記録が見つかりません。");
        return;
    }


    // ----------------------------------------
    // タンク容量
    // 既存データは memo から復元
    // ----------------------------------------
    let tankVolume = 0;

    const memo =
        record.memo || "";

    const match =
        memo.match(/タンク容量:\s*([0-9.]+)L/);

    if (match) {
        tankVolume = Number(match[1]);
    }


    // ----------------------------------------
    // 編集画面
    // ----------------------------------------
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


            <!-- 作業日 -->

            <div class="card">

                <label>作業日</label><br>

                <input
                    type="date"
                    id="editSprayDate"
                    value="${record.date || ""}"
                >

            </div>


            <!-- 田んぼ -->

            <div class="card">

                <label class="form-group-label">
                    🌾 田んぼを選択してください（複数選択可）
                </label>

                <div class="selection-flex-wrap">

                    ${renderSprayEditFieldButtons()}

                </div>

            </div>


            <!-- タンク容量 -->

            <div class="card">

                <label>タンク容量</label><br>

                <select
                    id="editSprayTank"
                    class="form-select-full"
                    onchange="
                        calculateMaterialInputAmounts(
                            this.value,
                            '葉面散布'
                        );
                    "
                >

                    <option value="">
                        -- タンク容量 --
                    </option>

                    <option
                        value="100"
                        ${Number(tankVolume) === 100
                            ? "selected"
                            : ""}
                    >
                        100L
                    </option>

                    <option
                        value="200"
                        ${Number(tankVolume) === 200
                            ? "selected"
                            : ""}
                    >
                        200L
                    </option>

                    <option
                        value="300"
                        ${Number(tankVolume) === 300
                            ? "selected"
                            : ""}
                    >
                        300L
                    </option>
   <option
                        value="400"
                        ${Number(tankVolume) === 400
                            ? "selected"
                            : ""}
                    >
                        400L
                    </option>
                    <option
                        value="500"
                        ${Number(tankVolume) === 500
                            ? "selected"
                            : ""}
                    >
                        500L
                    </option>

                </select>

            </div>


            <!-- 資材 -->

            <div class="card">

                <h3>使用資材</h3>

                <div id="materialInputRows"></div>

                <br>

                <button
                    type="button"
                    class="btn-save-green"
                    onclick="
                        addMaterialInputRowAndRender(
                            '葉面散布',
                            Number(
                                document.getElementById(
                                    'editSprayTank'
                                )?.value || 0
                            )
                        );
                    "
                >
                    ＋資材追加
                </button>

            </div>


            <!-- 保存 -->

            <div class="card">

                <button
                    class="btn-save-green"
                    onclick="saveSprayEdit()"
                >
                    💾 葉面散布の変更を保存
                </button>

            </div>

        </div>
    `;


    // ----------------------------------------
    // 資材入力行を描画
    // ----------------------------------------

    renderMaterialInputRows(
        "葉面散布",
        tankVolume,
        true
    );

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



// ========================================
// 葉面散布編集保存
// ========================================
function saveSprayEdit() {

    const record =
        recordList[editingRecordIndex];

    if (!record) {
        alert("編集する記録が見つかりません。");
        return;
    }


    // ----------------------------------------
    // 作業日
    // ----------------------------------------
    const date =
        document.getElementById("editSprayDate")?.value ||
        recordDate;

    if (!date) {

        alert("作業日を入力してください。");
        return;

    }


    // ----------------------------------------
    // 田んぼ
    // ----------------------------------------
    if (
        !selectedFieldIds ||
        selectedFieldIds.length === 0
    ) {

        alert("田んぼを選択してください。");
        return;

    }


    // ----------------------------------------
    // タンク容量
    // ----------------------------------------
    const tank =
        Number(
            document.getElementById(
                "editSprayTank"
            )?.value || 0
        );

    if (tank <= 0) {

        alert("タンク容量を入力してください。");
        return;

    }


    // ----------------------------------------
    // 資材入力チェック
    // ----------------------------------------
    if (
        !Array.isArray(materialInputRows) ||
        materialInputRows.length === 0
    ) {

        alert("使用資材を1つ以上入力してください。");
        return;

    }


    // ----------------------------------------
    // 保存用資材データ
    // ----------------------------------------
    const materials = [];


    materialInputRows.forEach(row => {

        // 資材未選択
        if (
            row.materialIndex === "" ||
            row.materialIndex === null ||
            row.materialIndex === undefined
        ) {
            return;
        }


        // 倍率未選択
        if (
            row.dilution === "" ||
            Number(row.dilution) <= 0
        ) {
            return;
        }


        const material =
            materialMaster[
                Number(row.materialIndex)
            ];


        if (!material) {
            return;
        }


        const amount =
            tank /
            Number(row.dilution);


        materials.push({

            material:
                material.name,

            amount:
                amount,

            unit:
                "L"

        });

    });


    // ----------------------------------------
    // 資材チェック
    // ----------------------------------------
    if (materials.length === 0) {

        alert(
            "資材と倍率を1つ以上入力してください。"
        );

        return;

    }


    // ----------------------------------------
    // 既存レコードを更新
    // ----------------------------------------
    record.date =
        date;

    record.work =
        "葉面散布";

    record.memo =
        `タンク容量: ${tank}L`;


    record.fields =
        selectedFieldIds.map(fieldNo => {

            return {

                fieldNo:
                    Number(fieldNo),

                materials:
                    materials.map(item => ({

                        material:
                            item.material,

                        amount:
                            item.amount,

                        unit:
                            item.unit

                    }))

            };

        });


    // ----------------------------------------
    // 保存
    // ----------------------------------------
    saveRecordList();


    // ----------------------------------------
    // 編集状態を解除
    // ----------------------------------------
    selectedFieldIds = [];

    resetMaterialInputRows();

    editingRecordIndex = -1;


    // ----------------------------------------
    // 完了
    // ----------------------------------------
    alert(
        "葉面散布の記録を更新しました。"
    );


    showHistory();

}