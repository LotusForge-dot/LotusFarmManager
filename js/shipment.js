// ============================================================
// 出荷入力画面
// ============================================================

let shipmentItems = [];
let shipmentRecords = [];
const shipmentGradeMaster = {
    "4kg": ["M", "○M", "S", "○S", "2S", "C", "B"],
    "2kg": ["2L", "L", "M", "S", "C"],
    "袋": ["袋"]
};

function getShipmentHtml() {

    

    let packageOptions = "";

    materialMaster
        .filter(item =>
            item.category === "包装" ||
            item.works?.includes("包装")
        )
        .forEach(item => {

            packageOptions += `
                <option value="${item.name}">
                    ${item.name}
                </option>
            `;

        });

    if (packageOptions === "") {

        packageOptions = `
            <option>DB</option>
            <option>発泡</option>
        `;

    }

    return `

    <div class="card">

        <label>出荷日</label><br>

        <input
            type="date"
            id="recordDate"
            value="${recordDate}">

        <br><br>

        <label>田んぼ</label><br>

        <select id="shipmentField">

            ${fieldMaster.map(field => `
                <option value="${field.no}">
                    No.${field.no}
                    ${field.owner}
                </option>
            `).join("")}

        </select>

        <br><br>

        <label>出荷先</label><br>

<select id="shipmentDestination">

    <option value="JA">JA</option>
    <option value="直売所">直売所</option>
    <option value="市場">市場</option>
    <option value="その他">その他</option>

</select>
        <br><br>

        <label>重量</label><br>

        <select
    id="shipmentWeight"
    onchange="shipmentItems=[];renderShipmentItems()">

            <option value="4kg">4kg</option>
            <option value="2kg">2kg</option>
            <option value="袋">袋</option>

        </select>

        <br><br>

        <label>包装</label><br>

        <select
            id="shipmentPackage">

            ${packageOptions}

        </select>

    </div>

    <div
        id="shipmentItemList">

    </div>

    <div class="card">

        <button
            class="mainButton"
            onclick="saveShipmentRecord()">

            💾保存

        </button>

    </div>

`;

}


function renderShipmentItems() {

    const list =
        document.getElementById("shipmentItemList");

    const weight =
        document.getElementById("shipmentWeight").value;

    const packageName =
        document.getElementById("shipmentPackage").value;

    let grades = [];

    switch (weight) {

    case "4kg":

        grades = [
            "M",
            "S",
            "2S",
            "○M",
            "C"
        ];

        break;

    case "2kg":

        grades = [
            "M",
            "S",
            "○M",
            "B"
        ];

        break;

    default:

    list.innerHTML = `
        <div class="card">

            <b>${weight}</b>
            　
            <b>${packageName}</b>

            <hr>

            <div style="
                display:flex;
                align-items:center;
                justify-content:space-between;
            ">

                <div>

                    袋数

                </div>

                <input
                    type="number"
                    min="0"
                    value="${
                        shipmentItems[0]
                            ? shipmentItems[0].quantity
                            : ""
                    }"
                    style="width:80px"
                    onchange="updateShipmentQuantity('袋', this.value)">

                <span>袋</span>

            </div>

        </div>
    `;

    return;

}

    let html = `
        <div class="card">

            <b>${weight}</b>
            　
            <b>${packageName}</b>

            <hr>
    `;

    grades.forEach(grade => {

        const item = shipmentItems.find(
            x => x.grade === grade
        );

        const quantity = item ? item.quantity : "";

        html += `

            <div style="
                display:flex;
                align-items:center;
                justify-content:space-between;
                margin-bottom:8px;
            ">

                <div style="width:60px;">

                    ${grade}

                </div>

                <input
                    type="number"
                    min="0"
                    value="${quantity}"
                    style="width:80px"
                    onchange="updateShipmentQuantity('${grade}', this.value)">

                <span>箱</span>

            </div>

        `;

    });

    html += `
        </div>
    `;

    list.innerHTML = html;

}
function updateShipmentQuantity(grade, quantity) {

    quantity = Number(quantity);

    const index = shipmentItems.findIndex(
        item => item.grade === grade
    );

    if (!quantity || quantity <= 0) {

        if (index >= 0) {

            shipmentItems.splice(index, 1);

        }

        return;

    }

    if (index >= 0) {

        shipmentItems[index].quantity = quantity;

    } else {

        shipmentItems.push({

            grade,

            quantity

        });

    }

}


function saveShipmentRecord() {

    if (shipmentItems.length === 0) {

        alert("出荷内容を追加してください。");
        return;

    }

    const destination =
    document.getElementById("shipmentDestination").value;

    if (destination === "") {

        alert("出荷先を入力してください。");
        return;

    }

    const record = {

        date: document.getElementById("recordDate").value,

        fieldNo: Number(
            document.getElementById("shipmentField").value
        ),

        destination,

        weight:
            document.getElementById("shipmentWeight").value,

        package:
            document.getElementById("shipmentPackage").value,

        memo: "",

        items: [...shipmentItems],

        createdAt: Date.now()

    };

    if (window.editShipmentIndex != null) {

        shipmentRecords[window.editShipmentIndex] = record;

        window.editShipmentIndex = null;

    } else {

        shipmentRecords.push(record);

    }

    saveRecordList();

    shipmentItems = [];

window.editShipmentIndex = null;

inputTab = "shipment";

alert("出荷記録を保存しました。");

showInput();

}
function getShipmentHistoryHtml() {

    return `

        <div class="search-box">

            <h3>🔍 検索条件</h3>

            <br>

            <label>年</label>

            <select id="shipmentHistoryYear">
                <option value="">全て</option>
            </select>

            <label>田んぼ</label>

            <select id="shipmentHistoryField">
                <option value="">全て</option>
            </select>

            <label>出荷先</label>

            <select id="shipmentHistoryDestination">
                <option value="">全て</option>
            </select>

            <label>開始日</label>

            <input type="date" id="shipmentHistoryFrom">

            <br><br>

            <label>終了日</label>

            <input type="date" id="shipmentHistoryTo">

            <button id="btnClearShipmentHistorySearch">
                🧹 検索条件クリア
            </button>

        </div>

        <hr>

        <h3>📊 集計</h3>

        <div id="shipmentSummary">

        </div>

        <hr>

        <h3>📋 検索結果</h3>

        <div id="shipmentHistoryList">

        </div>

    `;

}
function editShipmentRecord(index) {

    const record = shipmentRecords[index];

    window.editShipmentIndex = index;

    shipmentItems = record.items.map(item => ({ ...item }));

    inputTab = "shipment";

    showInput();

    document.getElementById("recordDate").value =
        record.date;

    document.getElementById("shipmentField").value =
        record.fieldNo;

    document.getElementById("shipmentDestination").value =
        record.destination;

    document.getElementById("shipmentWeight").value =
        record.weight;

    document.getElementById("shipmentPackage").value =
        record.package;

    renderShipmentItems();

}
function deleteShipmentRecord(index) {

    if (!confirm("この出荷記録を削除しますか？")) return;

    shipmentRecords.splice(index, 1);

    saveRecordList();

    showShipmentHistory();

}
function renderShipmentHistory() {

    const list =
        document.getElementById("shipmentHistoryList");

    let records = [...shipmentRecords];

    // 年
    const year =
        document.getElementById("shipmentHistoryYear").value;

    if (year !== "") {

        records = records.filter(record =>
            record.date.startsWith(year)
        );

    }

    // 田んぼ
    const field =
        document.getElementById("shipmentHistoryField").value;

    if (field !== "") {

        records = records.filter(record =>
            String(record.fieldNo) === field
        );

    }

    // 出荷先
    const destination =
        document.getElementById("shipmentHistoryDestination").value;

    if (destination !== "") {

        records = records.filter(record =>
            record.destination === destination
        );

    }

    // 開始日
    const from =
        document.getElementById("shipmentHistoryFrom").value;

    if (from !== "") {

        records = records.filter(record =>
            record.date >= from
        );

    }

    // 終了日
    const to =
        document.getElementById("shipmentHistoryTo").value;

    if (to !== "") {

        records = records.filter(record =>
            record.date <= to
        );

    }

    if (records.length === 0) {

        list.innerHTML = `
            <div class="card">
                出荷履歴はありません。
            </div>
        `;

        return;

    }

    let html = "";

    records
        .slice()
        .reverse()
        .forEach((record) => {

            const totalBoxes =
                record.items.reduce(
                    (sum, item) =>
                        sum + Number(item.quantity),
                    0
                );

            const sales =
                getShipmentSales(record);

            html += `

                <div class="card">

                    <b>${record.date}</b>

                    <br>

                    田んぼ：No.${record.fieldNo}

                    <br>

                    出荷先：${record.destination}

                    <br><br>

                    <b>${record.weight}</b>
                    &nbsp;&nbsp;
                    <b>${record.package}</b>

                    <br>

                    <b>
                        合計：${totalBoxes}${record.weight === "袋" ? "袋" : "箱"}
                    </b>

                    <br>

                    <b>
                        💰 売上：
                        ${
                            sales == null
                                ? "価格未登録"
                                : sales.toLocaleString() + "円"
                        }
                    </b>

                    <hr>

            `;

            record.items.forEach(item => {

                const price = getPrice(
                    record.weight,
                    item.grade,
                    record.date
                );

                const itemSales =
                    price == null
                        ? null
                        : price * Number(item.quantity);

                html += `

                    <div class="shipment-sale-row">

                        <span class="shipment-sale-grade">
                            ${item.grade}
                        </span>

                        ${
                            price == null
                                ? `
                                    <span style="flex:1;">
                                        価格未登録
                                    </span>
                                `
                                : `
                                    <span class="shipment-sale-price">
                                        ${price.toLocaleString()}円
                                    </span>

                                    <span class="shipment-sale-quantity">
                                        × ${item.quantity}${record.weight === "袋" ? "袋" : "箱"}
                                    </span>

                                    <span class="shipment-sale-total">
                                        = ${itemSales.toLocaleString()}円
                                    </span>
                                `
                        }

                    </div>

                `;

            });

            const originalIndex =
                shipmentRecords.indexOf(record);

            html += `

                    <hr>

                    <button
                        onclick="editShipmentRecord(${originalIndex})">
                        編集
                    </button>

                    <button
                        onclick="deleteShipmentRecord(${originalIndex})">
                        削除
                    </button>

                </div>

            `;

        });

    renderShipmentSummary(records);

    list.innerHTML = html;

}
function clearShipmentHistorySearch() {

    document.getElementById("shipmentHistoryYear").value = "";

    document.getElementById("shipmentHistoryField").value = "";

    document.getElementById("shipmentHistoryDestination").value = "";

    document.getElementById("shipmentHistoryFrom").value = "";

    document.getElementById("shipmentHistoryTo").value = "";

    renderShipmentHistory();

}

function renderShipmentHistoryFieldOptions() {

    const select =
        document.getElementById("shipmentHistoryField");

    select.innerHTML =
        `<option value="">全て</option>`;

    fieldMaster.forEach(field => {

        select.innerHTML += `
            <option value="${field.no}">
                No.${field.no} ${field.owner}
            </option>
        `;

    });

}
function renderShipmentHistoryYearOptions() {

    const select =
        document.getElementById("shipmentHistoryYear");

    select.innerHTML =
        `<option value="">全て</option>`;

    const years = [
        ...new Set(
            shipmentRecords.map(record =>
                record.date.substring(0, 4)
            )
        )
    ].sort().reverse();

    years.forEach(year => {

        select.innerHTML += `
            <option value="${year}">
                ${year}年
            </option>
        `;

    });

}
function renderShipmentHistoryDestinationOptions() {

    const select =
        document.getElementById("shipmentHistoryDestination");

    select.innerHTML =
        `<option value="">全て</option>`;

    const destinations = [
        ...new Set(
            shipmentRecords.map(record => record.destination)
        )
    ].sort();

    destinations.forEach(destination => {

        select.innerHTML += `
            <option value="${destination}">
                ${destination}
            </option>
        `;

    });

}
function renderShipmentSummary(records) {

    // 総売上
    const totalSales = getTotalShipmentSales(records);

    const summary =
        document.getElementById("shipmentSummary");

    // 4kg箱数
    const total = {
        "M": 0,
        "S": 0,
        "2S": 0,
        "○M": 0,
        "C": 0
    };

    // 2kg箱数
    const total2kg = {
        "M": 0,
        "S": 0,
        "○M": 0,
        "B": 0
    };

    // 4kg売上
    const sales4kg = {
        "M": 0,
        "S": 0,
        "2S": 0,
        "○M": 0,
        "C": 0
    };

    // 2kg売上
    const sales2kg = {
        "M": 0,
        "S": 0,
        "○M": 0,
        "B": 0
    };

    // 袋
    let totalBag = 0;
    let salesBag = 0;

    // 集計
    records.forEach(record => {

        // ----------4kg----------
        if (record.weight === "4kg") {

            record.items.forEach(item => {

                if (total[item.grade] != null) {

                    total[item.grade] += Number(item.quantity);

                }

                const price = getPrice(
                    record.weight,
                    item.grade,
                    record.date
                );

                if (
                    price != null &&
                    sales4kg[item.grade] != null
                ) {

                    sales4kg[item.grade] +=
                        price * Number(item.quantity);

                }

            });

        }

        // ----------2kg----------
        if (record.weight === "2kg") {

            record.items.forEach(item => {

                if (total2kg[item.grade] != null) {

                    total2kg[item.grade] +=
                        Number(item.quantity);

                }

                const price = getPrice(
                    record.weight,
                    item.grade,
                    record.date
                );

                if (
                    price != null &&
                    sales2kg[item.grade] != null
                ) {

                    sales2kg[item.grade] +=
                        price * Number(item.quantity);

                }

            });

        }

        // ----------袋----------
        if (record.weight === "袋") {

            record.items.forEach(item => {

                totalBag += Number(item.quantity);

                const price = getPrice(
                    record.weight,
                    item.grade,
                    record.date
                );

                if (price != null) {

                    salesBag +=
                        price * Number(item.quantity);

                }

            });

        }

    });

    // 合計箱数
    const totalBoxes =
        total["M"] +
        total["S"] +
        total["2S"] +
        total["○M"] +
        total["C"];

    const totalBoxes2kg =
        total2kg["M"] +
        total2kg["S"] +
        total2kg["○M"] +
        total2kg["B"];

    summary.innerHTML = `

<div class="card">

<h4>📦4kg（合計 ${totalBoxes}箱）</h4>

M：${total["M"]}箱（${sales4kg["M"].toLocaleString()}円）<br>
○M：${total["○M"]}箱（${sales4kg["○M"].toLocaleString()}円）<br>
S：${total["S"]}箱（${sales4kg["S"].toLocaleString()}円）<br>
2S：${total["2S"]}箱（${sales4kg["2S"].toLocaleString()}円）<br>
C：${total["C"]}箱（${sales4kg["C"].toLocaleString()}円）

</div>

<div class="card">

<h4>📦2kg（合計 ${totalBoxes2kg}箱）</h4>

M：${total2kg["M"]}箱（${sales2kg["M"].toLocaleString()}円）<br>
○M：${total2kg["○M"]}箱（${sales2kg["○M"].toLocaleString()}円）<br>
S：${total2kg["S"]}箱（${sales2kg["S"].toLocaleString()}円）<br>
B：${total2kg["B"]}箱（${sales2kg["B"].toLocaleString()}円）

</div>

<div class="card">

<h4>🛍袋（合計 ${totalBag}袋）</h4>

売上：${salesBag.toLocaleString()}円

</div>

<div class="card">

<h3>📊総出荷</h3>

4kg：${totalBoxes}箱<br>
2kg：${totalBoxes2kg}箱<br>
袋：${totalBag}袋

<br><br>

<b>
💰総売上：
${
    totalSales == null
        ? "価格未登録"
        : totalSales.toLocaleString() + "円"
}
</b>

</div>

`;

}

// 出荷記録の売上を計算
function getShipmentSales(record) {

    let total = 0;
    let hasPrice = false;

    // 出荷内容ごとに売上を計算
    for (const item of record.items) {

        // 単価を取得
        const price = getPrice(
            record.weight,
            item.grade,
            record.date
        );
console.log(
    record.date,
    record.weight,
    item.grade,
    getPrice(record.weight, item.grade, record.date)
);
        // 価格未登録ならスキップ
        if (price == null) continue;

        hasPrice = true;

        // 売上加算
        total += price * item.quantity;

    }

    // 価格が1件も見つからなかった場合
    if (!hasPrice) {
        return null;
    }

    return total;

}

// 売上を表示用文字列へ変換
function formatSales(record) {

    const sales = getShipmentSales(record);

    // 価格未登録
    if (sales == null) {
        return "価格未登録";
    }

    // 金額表示
    return sales.toLocaleString() + "円";

}

// 出荷記録一覧の総売上を計算
function getTotalShipmentSales(records) {

    let total = 0;
    let hasPrice = false;

    for (const record of records) {

        const sales = getShipmentSales(record);

        if (sales == null) continue;

        hasPrice = true;
        total += sales;

    }

    if (!hasPrice) {
        return null;
    }

    return total;

}