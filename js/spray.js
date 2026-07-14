// ==========================================
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
