// ==========================================
// Lotus Farm Manager
// master.js
// Version 4.8.0
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
let priceMaster = [];
let openedPriceIndex = -1;
let priceFormVisible = false;
let editingPriceIndex = -1;

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

// 指定日以前で一番新しい価格マスタを取得
function getPriceByDate(date) {

    // 新しい日付順に並び替え
    const prices = [...priceMaster]
        .sort((a, b) => b.date.localeCompare(a.date));

    // 指定日以前の価格を探す
    for (const price of prices) {

        if (price.date <= date) {
            return price;
        }

    }

    // 該当する価格がない場合
    return null;

}
// 指定日の重量・等級に対応する価格を取得
function getPrice(weight, grade, date) {

    // 指定日の価格マスタを取得
    const priceData = getPriceByDate(date);

    if (!priceData) return null;
console.log(priceData.items);
console.log(weight, grade);
    // 重量・等級が一致する価格を検索
    const item = priceData.items.find(item =>
        item.weight === weight &&
        item.grade === grade
    );

    // 見つかれば価格、なければnull
    return item ? item.price : null;

}

// ------------------------
// 価格マスタ
// ------------------------
function renderPriceMaster() {

    app.innerHTML = `
        <button id="btnBack">← 戻る</button>

        <h2 style="margin-top:20px;">💰 価格マスタ</h2>

        <button id="btnTogglePriceForm">
            ${priceFormVisible ? "－ 入力を閉じる" : "＋ 新しい価格"}
        </button>

        <div id="priceForm"></div>

        <hr>

        <h3>登録された価格</h3>

        <div id="priceList">
            <p>まだ登録されていません。</p>
        </div>
    `;

    document
        .getElementById("btnBack")
        .addEventListener("click", showSettings);

    document
        .getElementById("btnTogglePriceForm")
        .addEventListener("click", togglePriceForm);

    if (priceFormVisible) {

        document.getElementById("priceForm").innerHTML = `

            <br>

            <label>日付</label><br>

            <input type="date" id="priceDate"><br><br>

            <h3>📦4kg</h3>

            M<br>
            <input type="number" id="price4kgM"><br><br>

            ○M<br>
            <input type="number" id="price4kgOM"><br><br>

            S<br>
            <input type="number" id="price4kgS"><br><br>

            2S<br>
            <input type="number" id="price4kg2S"><br><br>

            C<br>
            <input type="number" id="price4kgC"><br><br>

            <hr>

            <h3>📦2kg</h3>

            M<br>
            <input type="number" id="price2kgM"><br><br>

            ○M<br>
            <input type="number" id="price2kgOM"><br><br>

            S<br>
            <input type="number" id="price2kgS"><br><br>

            B<br>
            <input type="number" id="price2kgB"><br><br>

            <hr>

            <h3>🛍袋</h3>

            袋<br>
            <input type="number" id="priceBag"><br><br>

            <button id="btnSavePrice">
                ${editingPriceIndex === -1 ? "保存" : "更新"}
            </button>

        `;

        document
            .getElementById("btnSavePrice")
            .addEventListener("click", savePrice);

        if (editingPriceIndex !== -1) {

            // editPrice()で値をセット
            if (editingPriceIndex !== -1) {

    setPriceForm(
        priceMaster[editingPriceIndex]
    );

}

        }

    }

    renderPriceList();

}
// ------------------------
// 価格を保存
// ------------------------
function savePrice() {

    const items = [];
const date = document.getElementById("priceDate").value;

if (!date) {

    alert("日付を入力してください。");

    return;

}
    // 価格を追加
    function addPrice(weight, grade, value) {

        value = Number(value);

        if (!value || value <= 0) {
            return;
        }

        items.push({
            weight,
            grade,
            price: value
        });

    }

    // 4kg
    addPrice("4kg", "M", document.getElementById("price4kgM").value);
    addPrice("4kg", "○M", document.getElementById("price4kgOM").value);
    addPrice("4kg", "S", document.getElementById("price4kgS").value);
    addPrice("4kg", "2S", document.getElementById("price4kg2S").value);
    addPrice("4kg", "C", document.getElementById("price4kgC").value);

    // 2kg
    addPrice("2kg", "M", document.getElementById("price2kgM").value);
    addPrice("2kg", "○M", document.getElementById("price2kgOM").value);
    addPrice("2kg", "S", document.getElementById("price2kgS").value);
    addPrice("2kg", "B", document.getElementById("price2kgB").value);

    // 袋
    addPrice("袋", "", document.getElementById("priceBag").value);

    const price = {

        date: date,

        items

    };

    // 同じ日付があるか検索
    const sameDateIndex = priceMaster.findIndex(
        item => item.date === price.date
    );

    // 編集
    if (editingPriceIndex !== -1) {

        priceMaster[editingPriceIndex] = price;
        editingPriceIndex = -1;

    // 同じ日付なら上書き
    } else if (sameDateIndex !== -1) {

        priceMaster[sameDateIndex] = price;

    // 新規追加
    } else {

        priceMaster.push(price);

    }

    // 日付の新しい順に並び替え
    priceMaster.sort((a, b) =>
        b.date.localeCompare(a.date)
    );

    savePriceMaster();
openedPriceIndex = -1;
editingPriceIndex = -1;
    priceFormVisible = false;

    renderPriceMaster();

}


// ------------------------
// 価格一覧を表示
// ------------------------
function renderPriceList() {

    const list =
        document.getElementById("priceList");

    if (priceMaster.length === 0) {

        list.innerHTML = `
            <p>まだ登録されていません。</p>
        `;

        return;

    }

    let html = "";

    priceMaster.forEach((price, index) => {

        html += `

            <div class="card">

                <b>${price.date}</b>

                <br><br>

                <button
                    onclick="togglePriceDetail(${index})">

                    ${
                        openedPriceIndex === index
                            ? "▲ 閉じる"
                            : "▼ 価格を見る"
                    }

                </button>

        `;

        if (openedPriceIndex === index) {

            html += `

                <hr>

                <b>📦4kg</b><br><br>

            `;

            price.items
                .filter(item => item.weight === "4kg")
                .forEach(item => {

                    html += `
                        ${item.grade}：
                        ${item.price.toLocaleString()}円<br>
                    `;

                });

            html += `

                <br>

                <b>📦2kg</b><br><br>

            `;

            price.items
                .filter(item => item.weight === "2kg")
                .forEach(item => {

                    html += `
                        ${item.grade}：
                        ${item.price.toLocaleString()}円<br>
                    `;

                });

            html += `

                <br>

                <b>🛍袋</b><br><br>

            `;

            price.items
                .filter(item => item.weight === "袋")
                .forEach(item => {

                    html += `
                        袋：
                        ${item.price.toLocaleString()}円<br>
                    `;

                });

            html += `<hr>`;

        }

        html += `

                <button
                    onclick="editPrice(${index})">

                    編集

                </button>

                <button
                    onclick="deletePrice(${index})">

                    削除

                </button>

            </div>

        `;

    });

    list.innerHTML = html;

}
// ------------------------
// 価格詳細を開閉
// ------------------------
function togglePriceDetail(index) {

    if (openedPriceIndex === index) {

        openedPriceIndex = -1;

    } else {

        openedPriceIndex = index;

    }

    renderPriceList();

}
// ------------------------
// 価格入力フォームへ値をセット
// ------------------------
function setPriceForm(price) {

    document.getElementById("priceDate").value =
        price.date;

    // 一度空にする
    document.getElementById("price4kgM").value = "";
    document.getElementById("price4kgOM").value = "";
    document.getElementById("price4kgS").value = "";
    document.getElementById("price4kg2S").value = "";
    document.getElementById("price4kgC").value = "";

    document.getElementById("price2kgM").value = "";
    document.getElementById("price2kgOM").value = "";
    document.getElementById("price2kgS").value = "";
    document.getElementById("price2kgB").value = "";

    document.getElementById("priceBag").value = "";

    // 価格をセット
    price.items.forEach(item => {

        if (item.weight === "4kg") {

            if (item.grade === "M") {
                document.getElementById("price4kgM").value = item.price;
            }

            if (item.grade === "○M") {
                document.getElementById("price4kgOM").value = item.price;
            }

            if (item.grade === "S") {
                document.getElementById("price4kgS").value = item.price;
            }

            if (item.grade === "2S") {
                document.getElementById("price4kg2S").value = item.price;
            }

            if (item.grade === "C") {
                document.getElementById("price4kgC").value = item.price;
            }

        }

        if (item.weight === "2kg") {

            if (item.grade === "M") {
                document.getElementById("price2kgM").value = item.price;
            }

            if (item.grade === "○M") {
                document.getElementById("price2kgOM").value = item.price;
            }

            if (item.grade === "S") {
                document.getElementById("price2kgS").value = item.price;
            }

            if (item.grade === "B") {
                document.getElementById("price2kgB").value = item.price;
            }

        }

        if (item.weight === "袋") {

            document.getElementById("priceBag").value =
                item.price;

        }

    });

}
// ------------------------
// 価格を編集
// ------------------------
function editPrice(index) {

    editingPriceIndex = index;

    priceFormVisible = true;

    renderPriceMaster();

}
// ------------------------
// 価格を削除
// ------------------------
function deletePrice(index) {

    if (!confirm("この価格を削除しますか？")) {

        return;

    }

    priceMaster.splice(index, 1);

    savePriceMaster();

    if (editingPriceIndex === index) {

        editingPriceIndex = -1;

        priceFormVisible = false;

    }

    openedPriceIndex = -1;

    renderPriceMaster();

}
// ------------------------
// 価格入力フォーム開閉
// ------------------------
function togglePriceForm() {

    priceFormVisible = !priceFormVisible;

    if (!priceFormVisible) {

        editingPriceIndex = -1;

    }

    renderPriceMaster();

}