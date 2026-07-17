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

    let html = "";

    if (!shipmentRecords || shipmentRecords.length === 0) {

        html += `

            <div class="card">

                出荷履歴はありません。

            </div>

        `;

    } else {

        shipmentRecords
            .slice()
            .reverse()
            .forEach((record, index) => {

                html += `

                    <div class="card">

                        <b>${record.date}</b>

                        <br>

                        田んぼ：No.${record.fieldNo}

                        <br>

                        出荷先：${record.destination}

                        <br><br>

                        <b>${record.weight}</b>
                        　
                        <b>${record.package}</b>

                        <hr>

                `;

                record.items.forEach(item => {

                    html += `

                        <div style="
                            display:flex;
                            justify-content:space-between;
                            margin-bottom:6px;
                        ">

                            <span>${item.grade}</span>

                            <span>${item.quantity}${record.weight === "袋" ? "袋" : "箱"}</span>

                        </div>

                    `;

                });

                html += `

                        <hr>

                        <button
                            onclick="editShipmentRecord(${shipmentRecords.length - 1 - index})">

                            編集

                        </button>

                        <button
                            onclick="deleteShipmentRecord(${shipmentRecords.length - 1 - index})">

                            削除

                        </button>

                    </div>

                `;

            });

    }

    return html;

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

