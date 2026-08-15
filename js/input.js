// ==========================================
// 1. showInput() メイン関数
// ==========================================
function showInput() {

    let html = "";


    // ==========================================
    // 各タブのHTML
    // ==========================================

    switch (inputTab) {

        case "shipment":

            if (
                typeof getShipmentHtml === "function"
            ) {

                html = getShipmentHtml();

            }

            break;


        case "fertilizer":

            html = getFertilizerHtml();

            break;


        case "planting":

            html = getPlantingHtml();

            break;


        case "spray":

            html = getSprayHtml();

            break;


        case "herbicide":

            html = getHerbicideHtml();

            break;


        case "other":

            html = getOtherHtml();

            break;

    }


    // ==========================================
    // 共通ページ
    // ==========================================

    app.innerHTML = `
        <div class="page">

            <div class="page-header">

                <h2>📝 入力</h2>

            </div>


            <div class="tab-container">

                <button
                    class="${inputTab === "shipment" ? "tab active" : "tab"}"
                    onclick="changeInputTab('shipment')"
                >
                    📦 出荷
                </button>


                <button
                    class="${inputTab === "fertilizer" ? "tab active" : "tab"}"
                    onclick="changeInputTab('fertilizer')"
                >
                    🌱 肥料
                </button>


                <button
                    class="${inputTab === "planting" ? "tab active" : "tab"}"
                    onclick="changeInputTab('planting')"
                >
                    🌱 植え付け
                </button>


                <button
                    class="${inputTab === "spray" ? "tab active" : "tab"}"
                    onclick="changeInputTab('spray')"
                >
                    💧 葉面散布
                </button>


                <button
                    class="${inputTab === "herbicide" ? "tab active" : "tab"}"
                    onclick="changeInputTab('herbicide')"
                >
                    🌿 除草剤
                </button>


                <button
                    class="${inputTab === "other" ? "tab active" : "tab"}"
                    onclick="changeInputTab('other')"
                >
                    📦 その他
                </button>

            </div>


            ${html}

        </div>
    `;


    // ==========================================
    // DOM描画後の初期化
    // ==========================================


    // ------------------------------------------
    // 出荷
    // ------------------------------------------

    if (inputTab === "shipment") {

        setTimeout(() => {

            if (
                typeof renderShipmentItems === "function"
            ) {

                renderShipmentItems();

            }

        }, 0);

    }


    // ------------------------------------------
    // 葉面散布
    // ------------------------------------------

    if (inputTab === "spray") {

        // --------------------------------------
        // 作業日
        // --------------------------------------

        const recordDateEl =
            document.getElementById("recordDate");


        if (recordDateEl) {

            recordDateEl.value =
                recordDate ||
                (
                    typeof getToday === "function"
                        ? getToday()
                        : ""
                );

        }


        // --------------------------------------
        // 田んぼ選択
        // --------------------------------------

        if (
            typeof initFoliarFieldButtons === "function"
        ) {

            initFoliarFieldButtons();

        }


        // --------------------------------------
        // 共通資材入力行
        // --------------------------------------

        if (
            typeof resetMaterialInputRows === "function" &&
            typeof renderMaterialInputRows === "function"
        ) {

            resetMaterialInputRows();


            const tankVolume =
                Number(
                    document.getElementById(
                        "foliarTank"
                    )?.value || 0
                );


            renderMaterialInputRows(
                "葉面散布",
                tankVolume
            );

        }

    }


// ------------------------------------------
// 除草剤
// ------------------------------------------
if (inputTab === "herbicide") {

    // ----------------------------------------
    // 作業日
    // ----------------------------------------

    const recordDateEl =
        document.getElementById("recordDate");


    if (recordDateEl) {

        recordDateEl.value =
            recordDate ||
            (
                typeof getToday === "function"
                    ? getToday()
                    : ""
            );

    }


    // ----------------------------------------
    // 共通資材入力行
    // ----------------------------------------

    if (
        typeof resetMaterialInputRows === "function" &&
        typeof renderMaterialInputRows === "function"
    ) {

        resetMaterialInputRows();


        const tankVolume =
            Number(
                document.getElementById(
                    "herbicideTank"
                )?.value || 0
            );


        renderMaterialInputRows(
            "除草",
            tankVolume
        );

    } else {

        console.error(
            "除草剤：共通資材入力関数が読み込まれていません。"
        );

    }

}
}
// ==========================================
// 2. 共通パーツ：全田んぼ選択ボタンの生成
// ==========================================
function renderAllFieldButtons() {
    let fieldListHtml = "";
    fieldMaster.forEach(field => {
        const selected = selectedFieldIds.includes(String(field.no));
        fieldListHtml += `
            <button
                class="${selected ? "tab active" : "tab"}"
                onclick="toggleFieldSelection('${field.no}')">
                ${selected ? "☑" : "☐"} ${field.no}　${field.owner}
            </button>
        `;
    });
    return fieldListHtml;
}
// ==========================================
// 肥料入力用：施肥設計がある田んぼだけ生成
// ==========================================
function renderFertilizerFieldButtons() {

    let fieldListHtml = "";

    const year =
        recordDate
            ? recordDate.substring(0, 4)
            : "";

    fieldMaster.forEach(field => {

        const plan =
            typeof getFertilizerPlan === "function"
                ? getFertilizerPlan(
                    year,
                    String(field.no)
                )
                : null;

        if (!plan) return;


        // ----------------------------------------
        // 元肥
        // ----------------------------------------
        if (fertilizerMode === "base") {

            const hasBase =
                Array.isArray(plan.materials) &&
                plan.materials.some(
                    material =>
                        material.work === "元肥"
                );

            if (!hasBase) return;

        }


        // ----------------------------------------
        // 追肥
        // ----------------------------------------
        if (fertilizerMode === "top") {

            const hasWork =
                Array.isArray(plan.materials) &&
                plan.materials.some(
                    material =>
                        material.work === selectedTopWork
                );

            if (!hasWork) return;

        }


        const selected =
            selectedFieldIds.includes(
                String(field.no)
            );


        fieldListHtml += `
            <button
                class="${selected ? "tab active" : "tab"}"
                onclick="toggleFieldSelection('${field.no}')">

                ${selected ? "☑" : "☐"}
                ${field.no}　${field.owner}

            </button>
        `;

    });

    return fieldListHtml;
}
// ==========================================
// 3. 各タブのHTML生成関数
// ==========================================

// --- 肥料 (fertilizer) ---
function getFertilizerHtml() {
    let html = `
        <div class="card">
            <button
                class="${fertilizerMode === "base" ? "tab active" : "tab"}"
                onclick="changeFertilizerMode('base')">
                🌱 元肥
            </button>
            <button
                class="${fertilizerMode === "top" ? "tab active" : "tab"}"
                onclick="changeFertilizerMode('top')">
                🌿 追肥
            </button>
        </div>
    `;

    if (fertilizerMode === "base") {
        html += `
            <div class="card">
                <h3>🌿 元肥入力</h3>
                <label>作業日</label><br>
                <input
                    type="date"
                    id="recordDate"
                    value="${recordDate}"
                    onchange="recordDate = this.value">
                <br><br>
                <p>田んぼを選択してください</p>

<div class="selection-flex-wrap">
    ${renderFertilizerFieldButtons()}
</div>
            <div class="card">
                <button class="mainButton" onclick="loadBaseFertilizerFromPlan()">
                    📋施肥設計読込
                </button>
            </div>
            <div id="baseFertilizerCards"></div>
            <div class="card">
                <button class="mainButton" onclick="showFertilizerPlan()">
                    ⚙️施肥設計を編集
                </button>
                <br><br>
                <button class="mainButton" onclick="saveTopFertilizer()">
                    💾保存
                </button>
            </div>
        `;
    } else {
        // --- 追肥対象田んぼ一覧 (ロジックを正確に保持) ---
        let fieldListHtml = "";
        const year = recordDate ? recordDate.substring(0, 4) : "";

        fieldMaster.forEach(field => {
            const plan = typeof getFertilizerPlan === "function" 
                ? getFertilizerPlan(year, String(field.no)) 
                : null;

            if (!plan) return;

            const hasWork = plan.materials.some(material => material.work === selectedTopWork);
            if (!hasWork) return;

            const selected = selectedFieldIds.includes(String(field.no));
            fieldListHtml += `
                <button
                    class="${selected ? "tab active" : "tab"}"
                    onclick="toggleFieldSelection('${field.no}')">
                    ${selected ? "☑" : "☐"} ${field.no}　${field.owner}
                </button>
            `;
        });

        // --- 追肥作業タブ ---
        let topWorkHtml = "";
        workMaster
            .filter(work => work.category === "fertilizer" && work.name !== "元肥")
            .forEach(work => {
                const selected = selectedTopWork === work.name;
                topWorkHtml += `
                    <button
                        class="${selected ? "tab active" : "tab"}"
                        onclick="changeTopWork('${work.name}')">
                        ${work.name}
                    </button>
                `;
            });

        html += `
            <div class="card">
                <h3>🌿 追肥入力</h3>
                <label>作業日</label><br>
                <input
                    type="date"
                    id="recordDate"
                    value="${recordDate}"
                    onchange="recordDate = this.value">
                <br><br>
                ${topWorkHtml}
                <p>田んぼを選択してください</p>

<div class="selection-flex-wrap">
    ${fieldListHtml}
</div>
            </div>
            <div class="card">
                <button class="mainButton" onclick="loadTopFertilizerFromPlan()">
                    📋施肥設計読込
                </button>
            </div>
            <div class="card">
                <div id="topFertilizerCards"></div>
            </div>
            <div class="card">
                <button class="mainButton" onclick="showFertilizerPlan()">
                    ⚙️施肥設計を編集
                </button>
                <br><br>
                <button class="mainButton" onclick="saveTopFertilizer()">
                    💾保存
                </button>
            </div>
        `;
    }

    return html;
}

// ========================================
// 葉面散布入力画面
// ========================================
function getSprayHtml() {

    return `
        <div class="card" style="padding: 15px;">

            <h3 style="margin-top: 0;">
                💧 葉面散布入力
            </h3>


            <!-- ================================ -->
            <!-- 作業日 -->
            <!-- ================================ -->

            <label>日付</label>

            <input
                type="date"
                id="recordDate"
                value="${recordDate}"
                onchange="recordDate = this.value"
            >


            <!-- ================================ -->
            <!-- タンク容量 -->
            <!-- ================================ -->

            <div
                style="
                    margin-bottom: 20px;
                    background: #e8f5e9;
                    padding: 12px;
                    border-radius: 6px;
                    border: 1px solid #c8e6c9;
                "
            >

                <label
                    style="
                        font-weight: bold;
                        color: #2e7d32;
                        font-size: 15px;
                    "
                >
                    📊 今日の散布量 (タンク容量)
                </label>

                <br>

                <select
                    id="foliarTank"
                    onchange="
                        calculateMaterialInputAmounts(
                            Number(this.value),
                            '葉面散布'
                        );
                    "
                    style="
                        width: 100%;
                        height: 40px;
                        margin-top: 6px;
                        font-size: 16px;
                        border: 1px solid #a5d6a7;
                        border-radius: 4px;
                        background: #fff;
                    "
                >

                    <option value="100">100L</option>

                    <option
                        value="200"
                        selected
                    >
                        200L
                    </option>

                    <option value="300">300L</option>
<option value="400">400L</option>
                    <option value="500">500L</option>

                </select>

            </div>


            <!-- ================================ -->
            <!-- 田んぼ選択 -->
            <!-- ================================ -->

            <div
                class="input-group"
                style="margin-bottom: 20px;"
            >

                <label
                    style="
                        display: block;
                        font-weight: bold;
                        margin-bottom: 8px;
                        color: #2e7d32;
                        font-size: 14px;
                    "
                >
                    🌾 田んぼを選択してください（複数選択可）
                </label>

                <div
                    id="foliarFieldButtonsContainer"
                    style="
                        display: flex;
                        flex-wrap: wrap;
                        gap: 8px;
                    "
                >
                    ${renderAllFieldButtons()}
                </div>

            </div>


            <!-- ================================ -->
            <!-- 共通資材入力 -->
            <!-- ================================ -->

            <div class="spray-grid-row" style="margin-bottom: 2px;">

                <div class="spray-col-material">

                    <label
                        style="
                            font-weight: bold;
                            font-size: 14px;
                            color: #333;
                        "
                    >
                        資材
                    </label>

                </div>

                <div class="spray-col-controls">

                    <label
                        style="
                            font-weight: bold;
                            font-size: 14px;
                            color: #333;
                        "
                    >
                        倍率
                    </label>

                    <span class="spray-item-amount"></span>

                    <div class="spray-item-del-btn"></div>

                </div>

            </div>


            <!-- 共通入力行の描画先 -->

            <div id="materialInputRows"></div>


            <br>


            <!-- ================================ -->
            <!-- 資材入力行追加 -->
            <!-- ================================ -->

            <button
                type="button"
                class="mainButton"
                onclick="
                    addMaterialInputRowAndRender(
                        '葉面散布',
                        Number(
                            document.getElementById(
                                'foliarTank'
                            )?.value || 0
                        )
                    );
                "
                style="
                    width: 100%;
                    padding: 12px;
                    font-weight: bold;
                    background-color: #2e7d32;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                "
            >
                ＋資材追加
            </button>


            <!-- ================================ -->
            <!-- 保存 -->
            <!-- ================================ -->

            <div style="margin-top: 20px;">

                <button
                    id="saveFoliarBtn"
                    class="btn btn-primary"
                    onclick="saveFoliarRecord()"
                    style="
                        width: 100%;
                        padding: 12px;
                        font-size: 16px;
                        font-weight: bold;
                    "
                >
                    📝 この内容で記録する
                </button>

            </div>

        </div>
    `;
}

// --- その他 (other) ---
function getOtherHtml() {
    return `
        <div class="card">
            <h3 class="input-header">📦 その他作業入力</h3>
            
            <label>作業日</label><br>
            <input type="date" id="recordDate" value="${recordDate}" onchange="recordDate = this.value">
            <br><br>

            <div class="form-group">
                <label class="form-group-label">
                    🌾 田んぼを選択してください（複数選択可）
                </label>
                <div class="selection-flex-wrap">
                    ${renderAllFieldButtons()}
                </div>
            </div>

            <div class="card">
                <label>作業内容</label><br>
                <select id="otherWorkSelect" class="form-select-full">
                    <option value="">選択してください</option>
                    ${workMaster
                        .filter(w => w.category === "other" || (w.name !== "元肥" && !w.name.startsWith("追肥") && w.name !== "葉面散布" && w.name !== "除草"))
                        .map(w => `<option value="${w.name}">${w.name}</option>`).join("")}
                </select>
                <br><br>

                <label>使用資材 (任意)</label><br>
                <select id="otherMaterial" class="form-select-full" onchange="updateOtherMaterialUnit()">
                    <option value="">使用なし</option>
                    ${materialMaster
    .filter(m => m.category === "other")
    .map(m => `<option value="${m.name}">${m.name}</option>`)
    .join("")}
                </select>
                <br><br>

                <label>使用量</label><br>
                <div class="form-input-row">
                    <input type="number" id="otherAmount" step="0.1" class="form-input-amount">
                    <span id="otherMaterialUnit"></span>
                </div>
                <br>

                <label>備考・メモ</label><br>
                <textarea id="otherMemo" class="form-textarea"></textarea>
            </div>

            <div class="card">
                <button class="btn-save-green" onclick="saveOtherRecord()">
                    💾 その他作業の記録を保存
                </button>
            </div>
        </div>
    `;
}

function getPlantingHtml() {
    return `
        <div class="card">
            <h3 class="input-header">🌱 植え付け入力</h3>

            <label>作業日</label><br>
            <input
                type="date"
                id="recordDate"
                value="${recordDate}"
                onchange="recordDate = this.value">
            <br><br>

            <div class="form-group">
                <label class="form-group-label">
                    🌾 田んぼを選択してください（複数選択可）
                </label>
                <div class="selection-flex-wrap">
                    ${renderAllFieldButtons()}
                </div>
            </div>

            <div class="card">

                <label>品種</label><br>
                <select id="plantingMaterial" class="form-select-full">
                    <option value="">選択してください</option>
                    ${materialMaster
                        .filter(m => m.category === "variety")
                        .map(m => `<option value="${m.name}">${m.name}</option>`)
                        .join("")}
                </select>

                <br><br>

                <label>使用量</label><br>

                <div class="form-input-row">
                    <input
                        type="number"
                        id="plantingAmount"
                        step="0.1"
                        class="form-input-amount">

                    <span>艘</span>
                </div>

                <br>

                <label>備考・メモ</label><br>

                <textarea
                    id="plantingMemo"
                    class="form-textarea"></textarea>

            </div>

            <div class="card">
                <button
                    class="btn-save-green"
                    onclick="savePlantingRecord()">

                    💾 植え付けを保存

                </button>
            </div>

        </div>
    `;
}






// ========================================
// 除草剤入力画面の初期化
// ========================================
function showHerbicideInput() {

    selectedFieldIds = [];
    herbicideMaterials = [];

    renderHerbicideMaterialList();
    renderHerbicideDilutions();

}


// ========================================
// 除草剤入力画面
// 共通資材入力行方式
// ========================================
function getHerbicideHtml() {

    return `
        <div class="card">

            <h3 class="input-header">
                🌿 除草剤入力
            </h3>


            <!-- ================================ -->
            <!-- 作業日 -->
            <!-- ================================ -->

            <label>作業日</label>

            <input
                type="date"
                id="recordDate"
                value="${recordDate}"
                onchange="recordDate = this.value"
            >

            <br><br>


            <!-- ================================ -->
            <!-- 田んぼ -->
            <!-- ================================ -->

            <div class="form-group">

                <label class="form-group-label">
                    🌾 田んぼを選択してください（複数選択可）
                </label>

                <div class="selection-flex-wrap">
                    ${renderAllFieldButtons()}
                </div>

            </div>


            <!-- ================================ -->
            <!-- タンク容量 -->
            <!-- ================================ -->

            <div class="card">

                <label>タンク容量</label>

                <select
                    id="herbicideTank"
                    class="form-select-full"
                    onchange="
                        calculateMaterialInputAmounts(
                            Number(this.value),
                            '除草'
                        );
                    "
                >

                    <option value="">
                        -- タンク容量 --
                    </option>

                    ${Array.from(
                        { length: 10 },
                        (_, i) => `
                            <option value="${i + 1}">
                                ${i + 1}L
                            </option>
                        `
                    ).join("")}

                </select>

            </div>


            <!-- ================================ -->
            <!-- 共通資材入力 -->
            <!-- ================================ -->

            <div class="card">

                <div class="spray-grid-row">

                    <div class="spray-col-material">

                        <label>
                            資材
                        </label>

                    </div>

                    <div class="spray-col-controls">

                        <label>
                            倍率
                        </label>

                        <span class="spray-item-amount"></span>

                        <span
                            style="
                                width: 24px;
                                display: inline-block;
                            "
                        ></span>

                    </div>

                </div>


                <!-- 共通入力行 -->

                <div id="materialInputRows"></div>


                <br>


                <!-- 資材入力行追加 -->

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


            <!-- ================================ -->
            <!-- 保存 -->
            <!-- ================================ -->

            <div class="card">

                <button
                    class="btn-save-green"
                    onclick="saveHerbicideRecord()"
                >
                    💾 除草剤の記録を保存
                </button>

            </div>

        </div>
    `;
}

// ========================================
// 除草剤の資材プルダウン生成
// ========================================
function renderHerbicideMaterialList() {

    const materialSelect =
        document.getElementById("herbicideMaterial");

    if (!materialSelect) return;


    let html =
        '<option value="">-- 除草剤を選択 --</option>';


    if (Array.isArray(materialMaster)) {

        materialMaster.forEach(
            (material, index) => {

                if (
                    material.works &&
                    material.works.includes("除草")
                ) {

                    html += `
                        <option value="${index}">
                            ${material.name}
                        </option>
                    `;

                }

            }
        );

    }


    materialSelect.innerHTML = html;


    // 資材変更時の倍率欄を初期化
    renderHerbicideDilutions();

}

// ========================================
// 選択した除草剤の倍率を表示
// ========================================
function renderHerbicideDilutions() {

    const materialSelect =
        document.getElementById("herbicideMaterial");

    const dilutionSelect =
        document.getElementById("herbicideDilution");

    if (!materialSelect || !dilutionSelect) {
        return;
    }


    const materialIndex =
        materialSelect.value;


    // 資材未選択
    if (materialIndex === "") {

        dilutionSelect.innerHTML =
            '<option value="">-- 倍率 --</option>';

        const mainAmountSpan =
            document.getElementById(
                "mainHerbicideAmount"
            );

        if (mainAmountSpan) {
            mainAmountSpan.textContent = "";
            mainAmountSpan.dataset.amount = "";
        }

        return;
    }


    // 選択された資材
    const material =
        materialMaster[
            Number(materialIndex)
        ];


    // 倍率プルダウン生成
    let html =
        '<option value="">-- 倍率 --</option>';


    if (
        material &&
        Array.isArray(material.dilutions)
    ) {

        material.dilutions.forEach(
            dilution => {

                html += `
                    <option value="${dilution}">
                        ${dilution}倍
                    </option>
                `;

            }
        );

    }


    dilutionSelect.innerHTML = html;


    // 使用量を計算
    calculateHerbicideAmounts();

}
// ========================================
// 除草剤使用量の自動計算
// ========================================
function calculateHerbicideAmounts() {

    const tankSelect =
        document.getElementById(
            "herbicideTank"
        );

    const materialSelect =
        document.getElementById(
            "herbicideMaterial"
        );

    const dilutionSelect =
        document.getElementById(
            "herbicideDilution"
        );

    const amountSpan =
        document.getElementById(
            "mainHerbicideAmount"
        );


    if (
        !tankSelect ||
        !materialSelect ||
        !dilutionSelect ||
        !amountSpan
    ) {
        return;
    }


    const tankVolume =
        Number(tankSelect.value);

    const dilution =
        Number(dilutionSelect.value);


    if (
        tankVolume <= 0 ||
        materialSelect.value === "" ||
        dilution <= 0
    ) {

        amountSpan.textContent = "";

        return;
    }


    const amount =
        tankVolume / dilution;


    amountSpan.dataset.amount =
        amount;


    const material =
        materialMaster[
            Number(materialSelect.value)
        ];


    const unit =
        material && material.weightUnit
            ? material.weightUnit
            : "";


    if (amount < 0.1) {

        amountSpan.textContent =
            `${Math.round(amount * 1000)}${unit}`;

    } else {

        amountSpan.textContent =
            `${amount.toFixed(2)}L`;

    }

}


// ========================================
// 除草剤を追加
// ========================================
function addHerbicideMaterial() {

    const materialSelect =
        document.getElementById("herbicideMaterial");

    const dilutionSelect =
        document.getElementById("herbicideDilution");

    if (
        !materialSelect ||
        !dilutionSelect
    ) {
        return;
    }


    const materialIndex =
        materialSelect.value;

    const dilution =
        dilutionSelect.value;


    // ----------------------------------------
    // 資材・倍率チェック
    // ----------------------------------------
    if (
        materialIndex === "" ||
        dilution === ""
    ) {
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
        return;
    }


    // ----------------------------------------
    // 追加
    // ----------------------------------------
    herbicideMaterials.push({

        materialIndex:
            Number(materialIndex),

        dilution:
            Number(dilution),

        amount:
            tankVolume / Number(dilution)

    });


    // ----------------------------------------
    // 入力欄をリセット
    // ----------------------------------------
    materialSelect.value = "";

    dilutionSelect.innerHTML =
        '<option value="">-- 倍率 --</option>';


    const mainAmountSpan =
        document.getElementById(
            "mainHerbicideAmount"
        );

    if (mainAmountSpan) {

        mainAmountSpan.textContent = "";

    }


    // ----------------------------------------
    // 追加済み一覧を再描画
    // ----------------------------------------
    renderHerbicideMaterialItems();

}　
// ========================================
// 追加済み除草剤一覧
// ========================================
function renderHerbicideMaterialItems() {
　
    const list =
        document.getElementById("herbicideMaterialList");

    if (!list) return;


    let html = "";


    herbicideMaterials.forEach((item, index) => {

        // ----------------------------------------
        // 資材プルダウン
        // ----------------------------------------
        let optionsHtml = "";

        materialMaster.forEach((material, materialIndex) => {

            if (
                material.works &&
                material.works.includes("除草")
            ) {

                const selected =
                    materialIndex === item.materialIndex
                        ? "selected"
                        : "";

                optionsHtml += `
                    <option
                        value="${materialIndex}"
                        ${selected}
                    >
                        ${material.name}
                    </option>
                `;
            }

        });


        // ----------------------------------------
        // 倍率プルダウン
        // ----------------------------------------
        let dilutionOptionsHtml = "";

        const currentMaterial =
            materialMaster[item.materialIndex];


        if (
            currentMaterial &&
            Array.isArray(currentMaterial.dilutions)
        ) {

            currentMaterial.dilutions.forEach(dilution => {

                const selected =
                    Number(dilution) ===
                    Number(item.dilution)
                        ? "selected"
                        : "";

                dilutionOptionsHtml += `
                    <option
                        value="${dilution}"
                        ${selected}
                    >
                        ${dilution}倍
                    </option>
                `;

            });

        }


        // ----------------------------------------
        // 使用量表示
        // ----------------------------------------
        let amountText = "";

        if (item.amount > 0) {

            if (item.amount < 0.1) {

                amountText =
                    `${Math.round(item.amount * 1000)}mL`;

            } else {

                amountText =
                    `${item.amount.toFixed(2)}L`;

            }

        }


        // ----------------------------------------
        // 追加された1行
        // ----------------------------------------
        html += `
            <div
                class="spray-grid-row spray-added-item"
                style="margin-bottom: 8px;"
            >

                <div class="spray-col-material">

                    <select
                        onchange="
                            changeAddedHerbicideMaterial(
                                ${index},
                                this.value
                            )
                        "
                        style="
                            width: 100%;
                            height: 36px;
                        "
                    >
                        ${optionsHtml}
                    </select>

                </div>


                <div
                    class="spray-col-controls"
                    style="
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    "
                >

                    <select
                        onchange="
                            changeAddedHerbicideDilution(
                                ${index},
                                this.value
                            )
                        "
                        style="
                            width: 80px;
                            height: 36px;
                        "
                    >
                        ${dilutionOptionsHtml}
                    </select>


                    <span
                        class="spray-item-amount"
                    >
                        ${amountText}
                    </span>


                    <button
                        class="spray-item-del-btn"
                        onclick="
                            removeHerbicideMaterial(
                                ${index}
                            )
                        "
                    >
                        ❌
                    </button>

                </div>

            </div>
        `;

    });


    // ----------------------------------------
    // 追加された行を一覧へ表示
    // ----------------------------------------
    list.innerHTML = html;

}
// ========================================
// 追加済み除草剤の資材変更
// ========================================
function changeAddedHerbicideMaterial(
    index,
    newMaterialIndex
) {

    const materialIndex =
        Number(newMaterialIndex);


    herbicideMaterials[
        index
    ].materialIndex =
        materialIndex;


    const material =
        materialMaster[
            materialIndex
        ];


    if (
        material &&
        Array.isArray(material.dilutions) &&
        material.dilutions.length > 0
    ) {

        herbicideMaterials[
            index
        ].dilution =
            Number(
                material.dilutions[0]
            );

    } else {

        herbicideMaterials[
            index
        ].dilution = 0;

    }


    calculateHerbicideAddedAmounts();

}


// ========================================
// 追加済み除草剤の倍率変更
// ========================================
function changeAddedHerbicideDilution(
    index,
    newDilution
) {

    herbicideMaterials[
        index
    ].dilution =
        Number(newDilution);


    calculateHerbicideAddedAmounts();

}


// ========================================
// 追加済み除草剤の量を再計算
// ========================================
function calculateHerbicideAddedAmounts() {

    const tankSelect =
        document.getElementById(
            "herbicideTank"
        );

    if (!tankSelect) return;


    const tankVolume =
        Number(tankSelect.value);


    herbicideMaterials.forEach(
        item => {

            if (
                item.dilution &&
                item.dilution > 0
            ) {

                item.amount =
                    tankVolume /
                    item.dilution;

            } else {

                item.amount = 0;

            }

        }
    );


    renderHerbicideMaterialItems();

}


function removeHerbicideMaterial(index) {

    herbicideMaterials.splice(index, 1);

    renderHerbicideMaterialItems();

}


