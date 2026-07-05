// ==========================================
// Lotus Farm Manager
// master.js
// Version 0.9.1
// ==========================================

// ------------------------
// 田んぼマスタ
// ------------------------

let workFormVisible = false;
let workMaster = [];
let editingWorkIndex = -1;
let fieldFormVisible = false;
let fieldMaster = [];
let editingIndex = -1;
let materialFormVisible = false;
let materialMaster = [];
let editingMaterialIndex = -1;
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

    document
        .getElementById("btnBack")
        .addEventListener("click", showSettings);

    document
        .getElementById("btnToggleFieldForm")
        .addEventListener("click", toggleFieldForm);

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

            <button id="btnSaveField">${editingIndex === -1 ? "保存" : "更新"}
</button>
        `;

        document
            .getElementById("btnSaveField")
            .addEventListener("click", function () {
                saveField();
            });

    }
renderFieldList();
}

function toggleFieldForm() {

    fieldFormVisible = !fieldFormVisible;

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

    document
        .getElementById("btnBack")
        .addEventListener("click", showSettings);

    document
        .getElementById("btnToggleWorkForm")
        .addEventListener("click", toggleWorkForm);

    if (workFormVisible) {

        document.getElementById("workForm").innerHTML = `
            <br>

            <label>作業名</label><br>
            <input type="text" id="workName"><br><br>

            <button id="btnSaveWork">
                ${editingWorkIndex === -1 ? "保存" : "更新"}
            </button>
        `;

        document
            .getElementById("btnSaveWork")
            .addEventListener("click", saveWork);

    }

    renderWorkList();

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

    document
        .getElementById("btnBack")
        .addEventListener("click", showSettings);

    document
        .getElementById("btnToggleMaterialForm")
        .addEventListener("click", toggleMaterialForm);

    if (materialFormVisible) {

        document.getElementById("materialForm").innerHTML = `
            <br>

            <label>資材名</label><br>
<input type="text" id="materialName"><br><br>

<label>単位</label><br>
<select id="materialUnit">
    <option value="袋">袋</option>
    <option value="kg">kg</option>
    <option value="L">L</option>
    <option value="本">本</option>
    <option value="個">個</option>
    <option value="倍">倍</option>
</select>

<br><br>

<label>内容量</label><br>
<input
    type="number"
    id="materialWeight"
    step="0.1">
kg

<br><br>

<label>窒素(N)</label><br>
<input
    type="number"
    id="materialN"
    step="0.1">
%

<br><br>

<label>リン酸(P)</label><br>
<input
    type="number"
    id="materialP"
    step="0.1">
%

<br><br>

<label>加里(K)</label><br>
<input
    type="number"
    id="materialK"
    step="0.1">
%

<br><br>

<label>単価</label><br>
<input
    type="number"
    id="materialPrice">
円

<br><br>

<label>使用可能作業</label><br>

<div id="workCheckList"></div>

<br>

<button id="btnSaveMaterial">
    ${editingMaterialIndex === -1 ? "保存" : "更新"}
</button>
        `;

        document
            .getElementById("btnSaveMaterial")
            .addEventListener("click", saveMaterial);

        renderWorkCheckList();

        // 編集時は値を復元
        if (editingMaterialIndex !== -1) {

            const material = materialMaster[editingMaterialIndex];

            document.getElementById("materialName").value = material.name;
            document.getElementById("materialUnit").value = material.unit || "";
document.getElementById("materialWeight").value =
    material.weight || 0;

document.getElementById("materialN").value =
    material.n || 0;

document.getElementById("materialP").value =
    material.p || 0;

document.getElementById("materialK").value =
    material.k || 0;

document.getElementById("materialPrice").value =
    material.price || 0;
            document
                .querySelectorAll("#workCheckList input[type='checkbox']")
                .forEach(check => {

                    check.checked =
                        material.works &&
                        material.works.includes(check.value);

                });
        }
    }

    renderMaterialList();
}
// ------------------------
// 田んぼ保存・更新
// ------------------------

function saveField() {

    const field = {
        no: document.getElementById("fieldNo").value,
        owner: document.getElementById("fieldOwner").value,
        area: document.getElementById("fieldArea").value,
        note: document.getElementById("fieldMemo").value
    };

    if (editingIndex === -1) {

        // 新規登録
        fieldMaster.push(field);

    } else {

        // 編集
        fieldMaster[editingIndex] = field;
        editingIndex = -1;

    }

    // 保存
    saveFieldMaster();

    fieldFormVisible = false;

    renderFieldMaster();

}

// ------------------------
// 一覧表示
// ------------------------

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

    html += `
        </table>
    `;

    list.innerHTML = html;

}
// ------------------------
// 編集
// ------------------------

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
// ------------------------
// 削除
// ------------------------

function deleteField(index) {

    if (!confirm("この田んぼを削除しますか？")) {
        return;
    }

    fieldMaster.splice(index, 1);

    if (editingIndex === index) {
        editingIndex = -1;
        fieldFormVisible = false;
    }

    // 保存
    saveFieldMaster();

    renderFieldMaster();

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
                <th>操作</th>
            </tr>
    `;

    workMaster.forEach((work, index) => {

        html += `
            <tr>
                <td>${work.name}</td>
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
// ------------------------
// 作業保存
// ------------------------

function saveWork() {

    const work = {
        name: document.getElementById("workName").value
    };

    if (editingWorkIndex === -1) {

        // 新規
        workMaster.push(work);

    } else {

        // 編集
        workMaster[editingWorkIndex] = work;
        editingWorkIndex = -1;

    }

    workFormVisible = false
    
　saveWorkMaster();
    renderWorkMaster();
    

}
// ------------------------
// 編集
// ------------------------

function editWork(index) {

    editingWorkIndex = index;

    workFormVisible = true;

    renderWorkMaster();

    const work = workMaster[index];

    document.getElementById("workName").value = work.name;

}

// ------------------------
// 削除
// ------------------------

function deleteWork(index) {

    if (!confirm("この作業を削除しますか？")) {
        return;
    }

    workMaster.splice(index, 1);

    if (editingWorkIndex === index) {
        editingWorkIndex = -1;
        workFormVisible = false;
    }
    
　saveWorkMaster();
    renderWorkMaster();
    

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

    let html = `
        <table border="1" width="100%" cellspacing="0" cellpadding="5">

    <tr>
    <th>資材名</th>
    <th>単位</th>
    <th>内容量</th>
    <th>N</th>
    <th>P</th>
    <th>K</th>
    <th>単価</th>
    <th>使用可能作業</th>
    <th>操作</th>
</tr>
    `;

    materialMaster.forEach((material, index) => {
       
const worksText = (material.works || []).join("、");

html += `
<tr>
    <td>${material.name}</td>

    <td>${material.unit || ""}</td>

    <td>
        ${material.weight ? material.weight + "kg" : ""}
    </td>

    <td>${material.n || ""}</td>

    <td>${material.p || ""}</td>

    <td>${material.k || ""}</td>

    <td>
        ${material.price ? material.price + "円" : ""}
    </td>

    <td>${worksText}</td>

    <td>
        <button onclick="editMaterial(${index})">✏️</button>
        <button onclick="deleteMaterial(${index})">🗑️</button>
    </td>
</tr>
`;
    });

    html += "</table>";

    list.innerHTML = html;

}

// ------------------------
// 資材保存
// ------------------------

function saveMaterial() {
　const works = [];

　document
    .querySelectorAll("#workCheckList input[type='checkbox']")
    .forEach(check => {

        if (check.checked) {
            works.push(check.value);
        }

    });
    const material = {

    name: document.getElementById("materialName").value,

    unit: document.getElementById("materialUnit").value,

    weight: Number(
        document.getElementById("materialWeight").value
    ),

    n: Number(
        document.getElementById("materialN").value
    ),

    p: Number(
        document.getElementById("materialP").value
    ),

    k: Number(
        document.getElementById("materialK").value
    ),

    price: Number(
        document.getElementById("materialPrice").value
    ),

    works: works

};

    if (editingMaterialIndex === -1) {

        // 新規
        materialMaster.push(material);

    } else {

        // 編集
        materialMaster[editingMaterialIndex] = material;
        editingMaterialIndex = -1;

    }

    materialFormVisible = false;
　saveMaterialMaster();
    renderMaterialMaster();

}
// ------------------------
// 編集
// ------------------------

function editMaterial(index) {

    editingMaterialIndex = index;

    materialFormVisible = true;

    renderMaterialMaster();

    const material = materialMaster[index];

    document.getElementById("materialName").value = material.name;
    document.getElementById("materialUnit").value = material.unit;
document
    .querySelectorAll("#workCheckList input[type='checkbox']")
    .forEach(check => {

        check.checked = material.works &&
                        material.works.includes(check.value);

    });
}


// ------------------------
// 削除
// ------------------------

function deleteMaterial(index) {

    if (!confirm("この資材を削除しますか？")) {
        return;
    }

    materialMaster.splice(index, 1);

    if (editingMaterialIndex === index) {

        editingMaterialIndex = -1;
        materialFormVisible = false;

    }

    saveMaterialMaster();

    renderMaterialMaster();

}

// ==========================================
// 資材マスタ
// ==========================================

// ------------------------
// 保存
// ------------------------

function saveMaterialMaster() {

    localStorage.setItem(
        "materialMaster",
        JSON.stringify(materialMaster)
    );

}

// ------------------------
// 読込
// ------------------------

function loadMaterialMaster() {

    const data = localStorage.getItem("materialMaster");

    if (data) {
        materialMaster = JSON.parse(data);
    } else {
        materialMaster = [];
    }

}

// ------------------------
// 作業チェック一覧
// ------------------------

function renderWorkCheckList() {

    const list = document.getElementById("workCheckList");

    if (workMaster.length === 0) {

        list.innerHTML = "<p>作業マスタがありません。</p>";

        return;

    }

    let html = "";

    workMaster.forEach((work, index) => {

        html += `
            <label>
                <input
                    type="checkbox"
                    value="${work.name}">
                ${work.name}
            </label><br>
        `;

    });

    list.innerHTML = html;

}
