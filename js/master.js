// ==========================================
// Lotus Farm Manager
// master.js
// Version 0.9.1
// ==========================================

// ------------------------
// 田んぼマスタ
// ------------------------
let fertilizerPlanList = [];
let workFormVisible = false;
let workMaster = [];
let editingWorkIndex = -1;
let fieldFormVisible = false;
let fieldMaster = [];
let editingIndex = -1;
let materialFormVisible = false;
let materialMaster = [];
let editingMaterialIndex = -1;

// ========================================
// 資材倍率
// ========================================
let materialDilutions = [];

// ========================================
// カテゴリー

// ========================
const MATERIAL_CATEGORIES = [
    { value: "fertilizer", label: "肥料" },
    { value: "variety", label: "品種" },
    { value: "spray", label: "葉面散布" },
    { value: "pesticide", label: "農薬" },
    { value: "soil", label: "土壌改良材" },
    { value: "other", label: "その他" }
];

// 田んぼマスタ管理画面のレンダリング
function renderFieldMaster() {
    app.innerHTML = `
        <button id="btnBack">← 戻る</button>
        <h2 style="margin-top:20px;">🌾 田んぼマスタ</h2>
        <button id="btnToggleFieldForm">
            ${fieldFormVisible ? "－ 入力を閉じる" : "＋ 新しい田んぼ"}
        </button>
        <div id="fieldForm"></div>
        <hr>
        <h3>登録された田んぼ</h3>
        <div id="fieldList">
            <p>まだ登録されていません。</p>
        </div>
    `;

    document.getElementById("btnBack").addEventListener("click", showSettings);
    document.getElementById("btnToggleFieldForm").addEventListener("click", toggleFieldForm);

    if (fieldFormVisible) {
        document.getElementById("fieldForm").innerHTML = `
            <br>
            <label>No.</label><br>
            <input type="text" id="fieldNo"><br><br>
            <label>地主名</label><br>
            <input type="text" id="fieldOwner"><br><br>
            <label>面積（反）</label><br>
            <input type="number" id="fieldArea" step="0.1"><br><br>
            <label>備考</label><br>
            <textarea id="fieldMemo"></textarea><br><br>
            <button id="btnSaveField">${editingIndex === -1 ? "保存" : "更新"}</button>
        `;
        document.getElementById("btnSaveField").addEventListener("click", function () {
            saveField();
        });
    }
    renderFieldList();
}

function toggleFieldForm() {
    fieldFormVisible = !fieldFormVisible;
    renderFieldMaster();
}

function saveField() {
    const field = {
        no: document.getElementById("fieldNo").value,
        owner: document.getElementById("fieldOwner").value,
        area: document.getElementById("fieldArea").value,
        note: document.getElementById("fieldMemo").value
    };

    if (editingIndex === -1) {
        fieldMaster.push(field);
    } else {
        fieldMaster[editingIndex] = field;
        editingIndex = -1;
    }

    saveFieldMaster();
    fieldFormVisible = false;
    renderFieldMaster();
}

function renderFieldList() {
    const list = document.getElementById("fieldList");
    if (fieldMaster.length === 0) {
        list.innerHTML = "<p>まだ登録されていません。</p>";
        return;
    }

    let html = `
        <table border="1" width="100%" cellspacing="0" cellpadding="5">
            <tr>
                <th>No.</th>
                <th>地主名</th>
                <th>面積</th>
                <th>備考</th>
                <th>操作</th>
            </tr>
    `;

    fieldMaster.forEach((field, index) => {
        html += `
            <tr>
                <td>${field.no}</td>
                <td>${field.owner}</td>
                <td>${field.area}反</td>
                <td>${field.note}</td>
                <td>
                    <button onclick="editField(${index})">✏️</button>
                    <button onclick="deleteField(${index})">🗑️</button>
                </td>
            </tr>
        `;
    });
    html += `</table>`;
    list.innerHTML = html;
}

function editField(index) {
    editingIndex = index;
    fieldFormVisible = true;
    renderFieldMaster();

    const field = fieldMaster[index];
    document.getElementById("fieldNo").value = field.no;
    document.getElementById("fieldOwner").value = field.owner;
    document.getElementById("fieldArea").value = field.area;
    document.getElementById("fieldMemo").value = field.note;
}

function deleteField(index) {
    if (!confirm("この田んぼを削除しますか？")) return;
    fieldMaster.splice(index, 1);

    if (editingIndex === index) {
        editingIndex = -1;
        fieldFormVisible = false;
    }
    saveFieldMaster();
    renderFieldMaster();
}

// ------------------------
// 作業マスタ
// ------------------------
function renderWorkMaster() {
    app.innerHTML = `
        <button id="btnBack">← 戻る</button>
        <h2 style="margin-top:20px;">🔧 作業マスタ</h2>
        <button id="btnToggleWorkForm">
            ${workFormVisible ? "－ 入力を閉じる" : "＋ 新しい作業"}
        </button>
        <div id="workForm"></div>
        <hr>
        <h3>登録された作業</h3>
        <div id="workList">
            <p>まだ登録されていません。</p>
        </div>
    `;

    document.getElementById("btnBack").addEventListener("click", showSettings);
    document.getElementById("btnToggleWorkForm").addEventListener("click", toggleWorkForm);

    if (workFormVisible) {
        document.getElementById("workForm").innerHTML = `
            <br>
            <label>作業名</label><br>
            <input type="text" id="workName"><br><br>
            <label>カテゴリー</label><br>
            <select id="workCategory">
                <option value="fertilizer">肥料</option>
                <option value="spray">葉面散布</option>
                <option value="weed">除草</option>
                <option value="other">その他</option>
            </select>
            <br><br>
            <button id="btnSaveWork">${editingWorkIndex === -1 ? "保存" : "更新"}</button>
        `;
        document.getElementById("btnSaveWork").addEventListener("click", saveWork);
    }
    renderWorkList();
}

function toggleWorkForm() {
    workFormVisible = !workFormVisible;
    renderWorkMaster();
}

function renderWorkList() {
    const list = document.getElementById("workList");
    if (workMaster.length === 0) {
        list.innerHTML = "<p>まだ登録されていません。</p>";
        return;
    }

    let html = `
        <table border="1" width="100%" cellspacing="0" cellpadding="5">
            <tr>
                <th>作業名</th>
                <th>カテゴリー</th>
                <th>操作</th>
            </tr>
    `;

    workMaster.forEach((work, index) => {
        let categoryName = "";
        switch (work.category) {
            case "fertilizer": categoryName = "肥料"; break;
            case "spray": categoryName = "葉面散布"; break;
            case "weed": categoryName = "除草"; break;
            default: categoryName = "その他";
        }
        html += `
            <tr>
                <td>${work.name}</td>
                <td>${categoryName}</td>
                <td>
                    <button onclick="editWork(${index})">✏️</button>
                    <button onclick="deleteWork(${index})">🗑️</button>
                </td>
            </tr>
        `;
    });
    html += "</table>";
    list.innerHTML = html;
}

function saveWork() {
    const work = {
        name: document.getElementById("workName").value,
        category: document.getElementById("workCategory").value
    };

    if (editingWorkIndex === -1) {
        workMaster.push(work);
    } else {
        workMaster[editingWorkIndex] = work;
        editingWorkIndex = -1;
    }

    workFormVisible = false;
    saveWorkMaster();
    renderWorkMaster();
}

function editWork(index) {
    editingWorkIndex = index;
    workFormVisible = true;
    renderWorkMaster();

    const work = workMaster[index];
    document.getElementById("workName").value = work.name;
    document.getElementById("workCategory").value = work.category || "other";
}

function deleteWork(index) {
    if (!confirm("この作業を削除しますか？")) return;
    workMaster.splice(index, 1);

    if (editingWorkIndex === index) {
        editingWorkIndex = -1;
        workFormVisible = false;
    }
    saveWorkMaster();
    renderWorkMaster();
}

// ------------------------
// 資材マスタ
// ------------------------
function renderMaterialMaster() {
    app.innerHTML = `
        <button id="btnBack">← 戻る</button>
        <h2 style="margin-top:20px;">🧪 資材マスタ</h2>
        <button id="btnToggleMaterialForm">
            ${materialFormVisible ? "－ 入力を閉じる" : "＋ 新しい資材"}
        </button>
        <div id="materialForm"></div>
        <hr>
        <h3>登録された資材</h3>
        <div id="materialList">
            <p>まだ登録されていません。</p>
        </div>
    `;

    document.getElementById("btnBack").addEventListener("click", showSettings);
    document.getElementById("btnToggleMaterialForm").addEventListener("click", toggleMaterialForm);

    if (materialFormVisible) {
        document.getElementById("materialForm").innerHTML = `
            <br>
            <label>資材名</label><br>
            <input type="text" id="materialName"><br><br>
            <label>カテゴリー</label><br>
<select id="materialCategory"></select>
<br><br>



<br><br>
            <label>単位</label><br>
            <select id="materialUnit">

    <option value="kg">kg</option>
    <option value="g">g</option>

    <option value="L">L</option>
    <option value="ml">ml</option>

    <option value="袋">袋</option>
    <option value="本">本</option>

    <option value="缶">缶</option>
    <option value="箱">箱</option>

    <option value="個">個</option>

</select>
            <label>内容量</label><br>
            <input type="number" id="materialWeight"><br><br>
            <label>N（％）</label><br>
            <input type="number" id="materialN" step="0.1"><br><br>
            <label>P（％）</label><br>
            <input type="number" id="materialP" step="0.1"><br><br>
            <label>K（％）</label><br>
            <input type="number" id="materialK" step="0.1"><br><br>
            <label>単価（円）</label><br>
            <input type="number" id="materialPrice"><br><br>
            <hr>
            <h3>登録倍率</h3>
            <div id="dilutionList"></div>
            <button type="button" id="btnAddDilution">＋倍率追加</button>
            <hr>
            <label>使用可能作業</label><br>
            <div id="workCheckList"></div>
            <br>
            <button id="btnSaveMaterial">${editingMaterialIndex === -1 ? "保存" : "更新"}</button>
        `;
        
        document.getElementById("btnSaveMaterial").addEventListener("click", saveMaterial);
        document.getElementById("btnAddDilution").addEventListener("click", addDilution);
const categorySelect = document.getElementById("materialCategory");

categorySelect.innerHTML = MATERIAL_CATEGORIES.map(c =>
    `<option value="${c.value}">${c.label}</option>`
).join("");
        renderDilutionInputs();
        renderWorkCheckList();

        if (editingMaterialIndex !== -1) {
            const material = materialMaster[editingMaterialIndex];
            materialDilutions = [...(material.dilutions || [])];

            renderDilutionInputs();
            document.getElementById("materialName").value = material.name;
            document.getElementById("materialUnit").value = material.unit || "";
            document.getElementById("materialWeight").value = material.weight || 0;
            document.getElementById("materialN").value = material.n || 0;
            document.getElementById("materialP").value = material.p || 0;
            document.getElementById("materialK").value = material.k || 0;
            document.getElementById("materialPrice").value = material.price || 0;
           document.getElementById("materialCategory").value =
    material.category || "fertilizer";     
            document.querySelectorAll("#workCheckList input[type='checkbox']").forEach(check => {
                check.checked = material.works && material.works.includes(check.value);
            });
        }
    }
    renderMaterialList();
}

function toggleMaterialForm() {
    materialFormVisible = !materialFormVisible;
    renderMaterialMaster();
}

function renderMaterialList() {
    const list = document.getElementById("materialList");

    if (materialMaster.length === 0) {
        list.innerHTML = "<p>まだ登録されていません。</p>";
        return;
    }

    let html = "";

    MATERIAL_CATEGORIES.forEach(category => {

        const materials = materialMaster.filter(
            material => material.category === category.value
        );

        if (materials.length === 0) return;

        html += `
            <h3>${category.label}</h3>
            <table border="1" width="100%" cellspacing="0" cellpadding="5">
                <tr>
                    <th>資材名</th>
                    
                    <th>単位</th>
                    <th>内容量</th>
                    <th>N</th>
                    <th>P</th>
                    <th>K</th>
                    <th>単価</th>
                    <th>倍率</th>
                    <th>使用可能作業</th>
                    <th>操作</th>
                </tr>
        `;

        materials.forEach(material => {

            const dilutionsText = (material.dilutions || []).map(v => v + "倍").join("、");
            const worksText = (material.works || []).join("、");
            const index = materialMaster.indexOf(material);

            html += `
                <tr>
                    <td>${material.name}</td>
                    <td>${material.unit || ""}</td>
                    <td>${material.weight ? material.weight + "kg" : ""}</td>
                    <td>${material.n || ""}</td>
                    <td>${material.p || ""}</td>
                    <td>${material.k || ""}</td>
                    <td>${material.price ? material.price + "円" : ""}</td>
                    <td>${dilutionsText}</td>
                    <td>${worksText}</td>
                    <td>
                        <button onclick="editMaterial(${index})">✏️</button>
                        <button onclick="deleteMaterial(${index})">🗑️</button>
                    </td>
                </tr>
            `;
        });

        html += `</table><br>`;

    });

    list.innerHTML = html;
}

function saveMaterial() {
    const works = [];
    document.querySelectorAll("#workCheckList input[type='checkbox']").forEach(check => {
        if (check.checked) works.push(check.value);
    });

    const material = {
        name: document.getElementById("materialName").value,
        category: document.getElementById("materialCategory").value,
        unit: document.getElementById("materialUnit").value,
        weight: Number(document.getElementById("materialWeight").value),
        n: Number(document.getElementById("materialN").value),
        p: Number(document.getElementById("materialP").value),
        k: Number(document.getElementById("materialK").value),
        price: Number(document.getElementById("materialPrice").value),
        works: works,
        dilutions: materialDilutions.filter(v => v !== "" && v !== 0).map(Number)
    };

    if (editingMaterialIndex === -1) {
        materialMaster.push(material);
    } else {
        materialMaster[editingMaterialIndex] = material;
        editingMaterialIndex = -1;
    }

    materialFormVisible = false;
    saveMaterialMaster();
    renderMaterialMaster();
}

function editMaterial(index) {
    editingMaterialIndex = index;
    materialFormVisible = true;
    renderMaterialMaster();

    const material = materialMaster[index];
    document.getElementById("materialName").value = material.name;
    document.getElementById("materialUnit").value = material.unit;
    document.getElementById("materialCategory").value =
    material.category || "fertilizer";
    document.querySelectorAll("#workCheckList input[type='checkbox']").forEach(check => {
        check.checked = material.works && material.works.includes(check.value);
    });
}

function deleteMaterial(index) {
    if (!confirm("この資材を削除しますか？")) return;
    materialMaster.splice(index, 1);

    if (editingMaterialIndex === index) {
        editingMaterialIndex = -1;
        materialFormVisible = false;
    }
    saveMaterialMaster();
    renderMaterialMaster();
}

function saveMaterialMaster() {
    localStorage.setItem("materialMaster", JSON.stringify(materialMaster));
}

function loadMaterialMaster() {
    const data = localStorage.getItem("materialMaster");
    materialMaster = data ? JSON.parse(data) : [];
}

function renderWorkCheckList() {
    const list = document.getElementById("workCheckList");
    if (workMaster.length === 0) {
        list.innerHTML = "<p>作業マスタがありません。</p>";
        return;
    }

    let html = "";
    workMaster.forEach(work => {
        html += `
            <label>
                <input type="checkbox" value="${work.name}">
                ${work.name}
            </label><br>
        `;
    });
    list.innerHTML = html;
}

// ------------------------------------------
// テンプレートマスタ
// ------------------------------------------
let templateMaster = [];

function addDilution() {
    materialDilutions.push("");
    renderDilutionInputs();
}

// 資材マスタ設定画面用の倍率入力UI描画関数
function renderDilutionInputs() {
    const area = document.getElementById("dilutionList");
    if (!area) return;

    let html = "";
    materialDilutions.forEach((value, index) => {
        html += `
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                <input
                    type="number"
                    value="${value}"
                    placeholder="1000"
                    onchange="materialDilutions[${index}] = Number(this.value)">
                <span>倍</span>
                <button type="button" onclick="removeDilution(${index})">✕</button>
            </div>
        `;
    });
    area.innerHTML = html;
}
// 指定した資材の希釈設定を削除して入力欄を更新
function removeDilution(index) {
    materialDilutions.splice(index, 1);
    renderDilutionInputs();
}
// 資材カテゴリーコードから表示名を取得
function getMaterialCategoryName(category) {
    switch (category) {
        case "fertilizer": return "肥料";
        case "variety": return "品種";
        case "spray": return "葉面散布";
        case "pesticide": return "農薬";
        case "soil": return "土壌改良材";
        default: return "その他";
    }
}
