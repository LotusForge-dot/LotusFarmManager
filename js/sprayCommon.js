// ========================================
// 葉面散布・除草剤 共通入力行管理
// ========================================

let materialInputRows = [];


// ========================================
// 共通：入力行データを初期化
// ========================================
function resetMaterialInputRows() {

    materialInputRows = [
        {
            materialIndex: "",
            dilution: ""
        }
    ];

}

// ========================================
// 入力行を追加
// ========================================
function addMaterialInputRow() {

    materialInputRows.push({
        materialIndex: "",
        dilution: ""
    });

}


// ========================================
// 入力行を削除
// ========================================
function removeMaterialInputRow(index) {

    if (materialInputRows.length <= 1) {
        return;
    }

    materialInputRows.splice(index, 1);

}


// ========================================
// 資材を変更
// ========================================
function changeMaterialInputRow(
    index,
    materialIndex
) {

    materialInputRows[index].materialIndex =
        materialIndex;

    // 資材を変更したら倍率はリセット
    materialInputRows[index].dilution = "";

}


// ========================================
// 倍率を変更
// ========================================
function changeMaterialInputDilution(
    index,
    dilution
) {

    materialInputRows[index].dilution =
        Number(dilution);

}


// ========================================
// 共通：資材入力行を描画
// 葉面散布・除草剤で共通使用
// ========================================
function renderMaterialInputRows(workName, tankVolume,isEdit = false) {

    const container =
        document.getElementById("materialInputRows");

    if (!container) return;


    let html = "";


    // ========================================
    // 入力行を1行ずつ描画
    // ========================================
    materialInputRows.forEach((row, index) => {

        // ----------------------------------------
        // 資材プルダウン
        // ----------------------------------------
        let materialOptions = "";

if (isEdit) {

    const record =
        recordList[editingRecordIndex];

    const existingMaterials =
        record &&
        Array.isArray(record.fields)
            ? record.fields.flatMap(
                field =>
                    Array.isArray(field.materials)
                        ? field.materials
                        : []
            )
            : [];

    const selectedMaterial =
        materialMaster[
            Number(row.materialIndex)
        ]?.name || "";

    materialOptions =
        getEditMaterialOptions(
            null,
            workName,
            existingMaterials,
            selectedMaterial
        );

} else {

    materialOptions = `
        <option value="">
            -- 資材を選択 --
        </option>
    `;

    if (Array.isArray(materialMaster)) {

        materialMaster.forEach(
            (material, materialIndex) => {

                if (
                    material.works &&
                    material.works.includes(workName)
                ) {

                    const selected =
                        String(materialIndex) ===
                        String(row.materialIndex)
                            ? "selected"
                            : "";

                    materialOptions += `
                        <option
                            value="${materialIndex}"
                            ${selected}
                        >
                            ${material.name}
                        </option>
                    `;

                }

            }
        );

    }

}

        // ----------------------------------------
        // 倍率プルダウン
        // ----------------------------------------
        let dilutionOptions = `
            <option value="">
                -- 倍率 --
            </option>
        `;


        const material =
            materialMaster[
                Number(row.materialIndex)
            ];


        if (
            material &&
            Array.isArray(material.dilutions)
        ) {

            material.dilutions.forEach(
                dilution => {

                    const selected =
                        Number(dilution) ===
                        Number(row.dilution)
                            ? "selected"
                            : "";

                    dilutionOptions += `
                        <option
                            value="${dilution}"
                            ${selected}
                        >
                            ${dilution}倍
                        </option>
                    `;
                }
            );

        }


        // ----------------------------------------
        // 使用量を自動計算
        // ----------------------------------------
        let amountText = "";


        if (
            Number(tankVolume) > 0 &&
            Number(row.dilution) > 0
        ) {

            const amount =
                Number(tankVolume) /
                Number(row.dilution);


            if (amount < 1) {

                amountText =
                    `${Math.round(amount * 1000)}mL`;

            } else {

                amountText =
                    `${amount.toFixed(2)}L`;

            }

        }


        // ----------------------------------------
        // 入力行
        // ----------------------------------------
        html += `
            <div
                class="spray-grid-row material-input-row"
                style="margin-bottom: 8px;"
            >

                <!-- 資材 -->
                <div class="spray-col-material">

                    <select
                        onchange="
                            updateMaterialInputRowMaterial(
                                ${index},
                                this.value,
                                '${workName}',
                                ${Number(tankVolume)}
                            );
                        "
                        style="
                            width: 100%;
                            height: 36px;
                        "
                    >

                        ${materialOptions}

                    </select>

                </div>


                <!-- 倍率・使用量・削除 -->
                <div
                    class="spray-col-controls"
                    style="
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    "
                >

                    <!-- 倍率 -->
                    <select
                        onchange="
                            updateMaterialInputRowDilution(
                                ${index},
                                this.value,
                                '${workName}',
                                ${Number(tankVolume)}
                            );
                        "
                        style="
                            width: 80px;
                            height: 36px;
                        "
                    >

                        ${dilutionOptions}

                    </select>


                    <!-- 使用量 -->
                    <span
                        class="spray-item-amount"
                        style="
                            min-width: 60px;
                            text-align: right;
                            font-weight: bold;
                        "
                    >
                        ${amountText}
                    </span>


                    <!-- 削除 -->
                    ${
                        materialInputRows.length > 1
                            ? `
                                <button
                                    type="button"
                                    class="spray-item-del-btn"
                                    onclick="
                                        removeMaterialInputRow(
                                            ${index}
                                        );

                                        renderMaterialInputRows(
                                            '${workName}',
                                            ${Number(tankVolume)}
                                        );
                                    "
                                >
                                    ❌
                                </button>
                            `
                            : `
                                <span
                                    style="
                                        width: 24px;
                                        display: inline-block;
                                    "
                                ></span>
                            `
                    }

                </div>

            </div>
        `;

    });


    // ========================================
    // 画面へ反映
    // ========================================
    container.innerHTML = html;

}
// ========================================
// 共通：資材入力行を初期化して描画
// ========================================
function initMaterialInputRows(workName, tankVolume) {

    // 入力行を1行にリセット
    initMaterialInputRows();

    // 入力行を描画
    renderMaterialInputRows(
        workName,
        tankVolume
    );

}
// ========================================
// 共通：資材入力行を追加
// ========================================
function addMaterialInputRowAndRender(
    workName,
    tankVolume
) {

    // 空の入力行を1つ追加
    addMaterialInputRow();

    // 画面を再描画
    renderMaterialInputRows(
        workName,
        tankVolume
    );

}
// ========================================
// 共通：資材入力行の使用量を再計算
// ========================================
function calculateMaterialInputAmounts(
    tankVolume,
    workName
) {

    const container =
        document.getElementById("materialInputRows");

    if (!container) return;


    // 入力行の表示を更新
    renderMaterialInputRows(
        workName,
        Number(tankVolume)
    );

}

// ========================================
// 共通：資材選択時に倍率を更新
// ========================================
function updateMaterialInputRowMaterial(
    index,
    materialIndex,
    workName,
    tankVolume
) {

    const row =
        materialInputRows[index];

    if (!row) return;


    // 資材を変更
    row.materialIndex =
        materialIndex === ""
            ? ""
            : Number(materialIndex);


    // 資材を変更したら倍率はリセット
    row.dilution = "";


    // 全入力行を再描画
    renderMaterialInputRows(
        workName,
        tankVolume
    );

}

// ========================================
// 共通：倍率変更
// ========================================
function updateMaterialInputRowDilution(
    index,
    dilution,
    workName,
    tankVolume
) {

    const row =
        materialInputRows[index];

    if (!row) return;


    // 倍率を更新
    row.dilution =
        dilution === ""
            ? ""
            : Number(dilution);


    // 使用量を再計算して再描画
    renderMaterialInputRows(
        workName,
        Number(tankVolume)
    );

}
// ========================================
// 葉面散布：資材入力部分
// ========================================
function getSprayMaterialInputHtml() {

    return `
        <div class="card">

            <label>使用する資材</label><br>

            <div id="materialInputRows"></div>

            <br>

            <button
                type="button"
                class="btn-save-green"
                onclick="
                    addMaterialInputRowAndRender(
                        '葉面散布',
                        Number(
                            document.getElementById('foliarTank')?.value || 0
                        )
                    );
                "
            >
                ＋資材追加
            </button>

        </div>
    `;
}

// ========================================
// 葉面散布記録保存
// 共通入力行 materialInputRows 対応
// ========================================
function saveFoliarRecord() {

    // ----------------------------------------
    // 作業日
    // ----------------------------------------
    const date =
        document.getElementById("recordDate")?.value ||
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

        alert(
            "散布する田んぼを少なくとも1つ選択してください。"
        );

        return;

    }


    // ----------------------------------------
    // タンク容量
    // ----------------------------------------
    const tankSelect =
        document.getElementById("foliarTank");

    const tankVolume =
        Number(tankSelect?.value || 0);

    if (tankVolume <= 0) {

        alert("タンク容量を選択してください。");
        return;

    }


    // ----------------------------------------
    // 共通入力行チェック
    // ----------------------------------------
    if (
        !Array.isArray(materialInputRows) ||
        materialInputRows.length === 0
    ) {

        alert("資材を1つ以上選択してください。");
        return;

    }


    // ----------------------------------------
    // 入力行から保存用資材データを作成
    // ----------------------------------------
    const materials = [];


    materialInputRows.forEach(row => {

        // 資材未選択の行は無視
        if (
            row.materialIndex === "" ||
            row.materialIndex === null ||
            row.materialIndex === undefined
        ) {
            return;
        }


        // 倍率未選択の行は無視
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
            tankVolume /
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
            "資材と倍率を1つ以上選択してください。"
        );

        return;

    }


    // ----------------------------------------
    // 記録データ作成
    // ----------------------------------------
    const record = {

        date:
            date,

        work:
            "葉面散布",

        memo:
            `タンク容量: ${tankVolume}L`,

        fields:
            []

    };


    // ----------------------------------------
    // 田んぼごとに資材を登録
    // ----------------------------------------
    selectedFieldIds.forEach(fieldNo => {

        record.fields.push({

            fieldNo:
                Number(fieldNo),

            materials:
                materials.map(item => ({

                    material:
                        item.material,

                    amount:
                        item.amount

                }))

        });

    });


    // ----------------------------------------
    // 保存
    // ----------------------------------------
    recordList.push(record);

    saveRecordList();


    // ----------------------------------------
    // 入力状態をクリア
    // ----------------------------------------
    selectedFieldIds = [];

    resetMaterialInputRows();


    // ----------------------------------------
    // 完了
    // ----------------------------------------
    alert(
        "葉面散布の記録を保存しました！"
    );


    // ----------------------------------------
    // 履歴へ
    // ----------------------------------------
    if (
        typeof showHistory === "function"
    ) {

        showHistory();

    } else {

        showInput();

    }

}
// ========================================
// 除草剤記録保存
// 共通入力行 materialInputRows 対応
// ========================================
function saveHerbicideRecord() {

    // ----------------------------------------
    // 作業日
    // ----------------------------------------
    const date =
        document.getElementById("recordDate")?.value ||
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

        alert(
            "田んぼを少なくとも1つ選択してください。"
        );

        return;

    }


    // ----------------------------------------
    // タンク容量
    // ----------------------------------------
    const tankSelect =
        document.getElementById("herbicideTank");

    const tankVolume =
        Number(tankSelect?.value || 0);

    if (tankVolume <= 0) {

        alert("タンク容量を選択してください。");
        return;

    }


    // ----------------------------------------
    // 共通入力行チェック
    // ----------------------------------------
    if (
        !Array.isArray(materialInputRows) ||
        materialInputRows.length === 0
    ) {

        alert("除草剤を1つ以上選択してください。");
        return;

    }


    // ----------------------------------------
    // 入力行から保存用資材データを作成
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


        // タンク容量 ÷ 倍率
        const amount =
            tankVolume /
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
            "除草剤と倍率を1つ以上選択してください。"
        );

        return;

    }


    // ----------------------------------------
    // 記録データ作成
    // ----------------------------------------
    const record = {

        date:
            date,

        work:
            "除草",

        memo:
            `タンク容量: ${tankVolume}L`,

        fields:
            []

    };


    // ----------------------------------------
    // 田んぼごとに登録
    // ----------------------------------------
    selectedFieldIds.forEach(fieldNo => {

        record.fields.push({

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

        });

    });


    // ----------------------------------------
    // 保存
    // ----------------------------------------
    recordList.push(record);

    saveRecordList();


    // ----------------------------------------
    // 入力状態をリセット
    // ----------------------------------------
    selectedFieldIds = [];

    resetMaterialInputRows();


    // ----------------------------------------
    // 完了
    // ----------------------------------------
    alert(
        "除草剤の記録を保存しました！"
    );


    // ----------------------------------------
    // 履歴へ
    // ----------------------------------------
    if (
        typeof showHistory === "function"
    ) {

        showHistory();

    } else {

        showInput();

    }

}

function loadHerbicideForEdit() {

    const record =
        recordList[editingRecordIndex];

    if (!record) return;


    // 作業日
    recordDate = record.date;


    // 田んぼ
    selectedFieldIds =
    record.fields.map(
        field => String(field.fieldNo)
    );


    // タンク容量
    const memo =
        record.memo || "";

    const match =
        memo.match(/タンク容量:\s*([\d.]+)L/);

    const tankVolume =
        match
            ? Number(match[1])
            : 0;


    // 共通入力行を作成
    materialInputRows = [];


    // 最初の田んぼの資材を基準に復元
    const firstField =
        record.fields?.[0];


    if (
        firstField &&
        Array.isArray(firstField.materials)
    ) {

        firstField.materials.forEach(
            item => {

                const materialIndex =
                    materialMaster.findIndex(
                        material =>
                            material.name ===
                            item.material
                    );


                if (materialIndex < 0) {
                    return;
                }


                const amount =
                    Number(item.amount) || 0;


                const dilution =
                    amount > 0 &&
                    tankVolume > 0
                        ? tankVolume / amount
                        : "";


                materialInputRows.push({

                    materialIndex:
                        materialIndex,

                    dilution:
                        dilution

                });

            }
        );

    }


    // 資材がない場合でも1行
    if (
        materialInputRows.length === 0
    ) {

        resetMaterialInputRows();

    }

}


// ========================================
// 除草剤編集画面
// ========================================
function showHerbicideEdit() {

    const record =
        recordList[editingRecordIndex];

    if (!record) {
        alert("編集対象の記録が見つかりません。");
        return;
    }


    // ----------------------------------------
    // タンク容量
    // ----------------------------------------
    const memo =
        record.memo || "";

    const match =
        memo.match(/タンク容量:\s*([\d.]+)L/);

    const tankVolume =
        match
            ? Number(match[1])
            : 0;


    // ----------------------------------------
    // 編集画面HTML
    // ----------------------------------------
    let html = `

        <div class="card">

            <h3 class="input-header">
                🌿 除草剤記録を編集
            </h3>


            <!-- 作業日 -->

            <label>作業日</label>

            <input
                type="date"
                id="recordDate"
                value="${record.date || ""}"
                onchange="
                    recordDate = this.value;
                "
            >

            <br><br>


            <!-- 田んぼ -->

            <div class="form-group">

                <label class="form-group-label">
                    🌾 田んぼを選択してください
                </label>

                <div class="selection-flex-wrap">
                    ${renderAllFieldButtons()}
                </div>

            </div>


            <!-- タンク容量 -->

            <div class="card">

                <label>タンク容量</label>

                <select
                    id="herbicideTank"
                    class="form-select-full"
                    onchange="
                        renderMaterialInputRows(
                            '除草',
                            Number(this.value),
                            true
                        );
                    "
                >

                    <option value="">
                        -- タンク容量 --
                    </option>

                    ${Array.from(
                        { length: 10 },
                        (_, i) => {

                            const value = i + 1;

                            const selected =
                                value === tankVolume
                                    ? "selected"
                                    : "";

                            return `
                                <option
                                    value="${value}"
                                    ${selected}
                                >
                                    ${value}L
                                </option>
                            `;

                        }
                    ).join("")}

                </select>

            </div>


            <!-- 資材 -->

            <div class="card">

                <div class="spray-grid-row">

                    <div class="spray-col-material">
                        <label>資材</label>
                    </div>

                    <div class="spray-col-controls">
                        <label>倍率</label>
                        <span class="spray-item-amount"></span>

                        <span
                            style="
                                width: 24px;
                                display: inline-block;
                            "
                        ></span>
                    </div>

                </div>


                <div id="materialInputRows"></div>


                <br>


                <button
                    type="button"
                    class="btn-save-green"
                    onclick="
                        addMaterialInputRowAndRender(
                            '除草',
                            Number(
                                document.getElementById(
                                    'herbicideTank'
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
                    onclick="updateHerbicideRecord()"
                >
                    💾 除草剤の変更を保存
                </button>

            </div>

        </div>
    `;


    // ----------------------------------------
    // 表示
    // ----------------------------------------

    const container =
        document.getElementById("app");

    if (!container) return;

    container.innerHTML = html;


    // ----------------------------------------
    // 共通資材入力行を描画
    // ----------------------------------------

    renderMaterialInputRows(
        "除草",
        tankVolume
    );

}
// ========================================
// 除草剤編集保存
// ========================================
function updateHerbicideRecord() {

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
        document.getElementById("recordDate")?.value ||
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

        alert(
            "田んぼを少なくとも1つ選択してください。"
        );

        return;

    }


    // ----------------------------------------
    // タンク容量
    // ----------------------------------------
    const tankVolume =
        Number(
            document.getElementById(
                "herbicideTank"
            )?.value || 0
        );

    if (tankVolume <= 0) {

        alert("タンク容量を選択してください。");
        return;

    }


    // ----------------------------------------
    // 共通入力行チェック
    // ----------------------------------------
    if (
        !Array.isArray(materialInputRows) ||
        materialInputRows.length === 0
    ) {

        alert("除草剤を1つ以上選択してください。");
        return;

    }


    // ----------------------------------------
    // 資材データ作成
    // ----------------------------------------
    const materials = [];


    materialInputRows.forEach(row => {

        if (
            row.materialIndex === "" ||
            row.materialIndex === null ||
            row.materialIndex === undefined
        ) {
            return;
        }


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


        const dilution =
            Number(row.dilution);


        const amount =
            tankVolume / dilution;


        materials.push({

            material:
                material.name,

            amount:
                amount,

            unit:
                "L",

            dilution:
                dilution

        });

    });


    // ----------------------------------------
    // 資材チェック
    // ----------------------------------------
    if (materials.length === 0) {

        alert(
            "除草剤と倍率を1つ以上選択してください。"
        );

        return;

    }


    // ----------------------------------------
    // 田んぼごとのデータを再構築
    // ----------------------------------------
    const fieldsData =
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
                            item.unit,

                        dilution:
                            item.dilution

                    }))

            };

        });


    // ----------------------------------------
    // 既存レコードを更新
    // ----------------------------------------
    record.date =
        date;

    record.work =
        "除草";

    record.tankVolume =
        tankVolume;

    record.memo =
        `タンク容量: ${tankVolume}L`;

    record.fields =
        fieldsData;


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
        "除草剤の記録を更新しました。"
    );


    // ----------------------------------------
    // 履歴へ
    // ----------------------------------------
    showHistory();

}
// ========================================
// 編集用：資材プルダウン候補を生成
// ========================================
// 現在使用可能な資材
// ＋
// 編集対象レコードに既に登録されている資材
// を候補にする
//
// category を指定
//   → category で絞る
//
// workName を指定
//   → works に workName が含まれる資材で絞る
//
// selectedMaterial
//   → 現在の行で選択されている資材
// ========================================
function getEditMaterialOptions(
    category,
    workName,
    existingMaterials = [],
    selectedMaterial = ""
) {

    const existingNames =
        Array.isArray(existingMaterials)
            ? existingMaterials
                .map(item =>
                    typeof item === "string"
                        ? item
                        : item?.material
                )
                .filter(Boolean)
            : [];


    const options = [];


    if (!Array.isArray(materialMaster)) {

        return `
            <option value="">
                -- 資材を選択 --
            </option>
        `;

    }


    materialMaster.forEach(
        (material, materialIndex) => {

            const isExistingMaterial =
                existingNames.includes(
                    material.name
                );


            const matchesCategory =
                category &&
                material.category === category;


            const matchesWork =
                workName &&
                Array.isArray(material.works) &&
                material.works.includes(workName);


            if (
                matchesCategory ||
                matchesWork ||
                isExistingMaterial
            ) {

                options.push({

                    index:
                        materialIndex,

                    name:
                        material.name

                });

            }

        }
    );


    // ----------------------------------------
    // 重複除去
    // ----------------------------------------
    const uniqueOptions =
        options.filter(
            (item, index, array) =>
                array.findIndex(
                    other =>
                        other.index === item.index
                ) === index
        );


    // ----------------------------------------
    // HTML生成
    // ----------------------------------------
    let html = `
        <option value="">
            -- 資材を選択 --
        </option>
    `;


    uniqueOptions.forEach(item => {

        const selected =
            item.name === selectedMaterial
                ? "selected"
                : "";

console.log(
        "候補:",
        item.name,
        "現在:",
        selectedMaterial,
        "selected:",
        selected
    );
        html += `
            <option
                value="${item.name}"
                ${selected}
            >
                ${item.name}
            </option>
        `;

    });


    return html;

}