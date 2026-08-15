// ==========================================
// ほ場詳細画面
// ==========================================

// ------------------------------------------
// ほ場詳細画面HTML
// ------------------------------------------
function getFieldDetailHtml() {

    return `

        <div class="card">

            <h3>🌾 ほ場詳細</h3>

            <label>年度</label><br>

            <select
                id="fieldDetailYear"
                class="form-select-full"
                onchange="renderFieldDetail()"
            >
                <option value="">
                    -- 年度を選択 --
                </option>
            </select>

            <br><br>

            <label>ほ場</label><br>

            <select
                id="fieldDetailField"
                class="form-select-full"
                onchange="renderFieldDetail()"
            >
                <option value="">
                    -- ほ場を選択 --
                </option>
            </select>

        </div>


        <!-- ほ場詳細表示エリア -->

        <div id="fieldDetailContent">

            <div class="card">

                <p>
                    年度とほ場を選択してください。
                </p>

            </div>

        </div>

    `;
}


// ==========================================
// ほ場詳細画面の初期化
// ==========================================
function initFieldDetail() {

    renderFieldDetailYearOptions();

    renderFieldDetailFieldOptions();

    renderFieldDetail();

}


// ==========================================
// 年度プルダウン
// ==========================================
function renderFieldDetailYearOptions() {

    const select =
        document.getElementById(
            "fieldDetailYear"
        );

    if (!select) return;


    const years = [];


    // ----------------------------------------
    // 施肥設計から年度を取得
    // ----------------------------------------
    if (Array.isArray(fertilizerPlanList)) {

        fertilizerPlanList.forEach(plan => {

            if (plan.year) {

                const year =
                    String(plan.year);

                if (!years.includes(year)) {
                    years.push(year);
                }

            }

        });

    }


    // ----------------------------------------
    // 作業記録から年度を取得
    // ----------------------------------------
    if (Array.isArray(recordList)) {

        recordList.forEach(record => {

            if (record.date) {

                const year =
                    String(record.date)
                        .substring(0, 4);

                if (!years.includes(year)) {
                    years.push(year);
                }

            }

        });

    }


    // ----------------------------------------
    // 年度を新しい順に並べる
    // ----------------------------------------
    years.sort(
        (a, b) =>
            Number(b) - Number(a)
    );


    // ----------------------------------------
    // 選択肢を作成
    // ----------------------------------------
    select.innerHTML = `

        <option value="">
            -- 年度を選択 --
        </option>

        ${years.map(year => `
            <option value="${year}">
                ${year}年
            </option>
        `).join("")}

    `;


    // ----------------------------------------
    // 現在年度を初期選択
    // ----------------------------------------
    const currentYear =
        String(
            new Date().getFullYear()
        );


    if (years.includes(currentYear)) {

        select.value =
            currentYear;

    }

}


// ==========================================
// ほ場プルダウン
// ==========================================
function renderFieldDetailFieldOptions() {

    const select =
        document.getElementById(
            "fieldDetailField"
        );

    if (!select) return;


    if (!Array.isArray(fieldMaster)) {

        select.innerHTML = `
            <option value="">
                -- ほ場を選択 --
            </option>
        `;

        return;

    }


    select.innerHTML = `

        <option value="">
            -- ほ場を選択 --
        </option>

        ${fieldMaster.map(field => `

            <option value="${field.no}">
                ${field.no}　${field.owner || ""}
            </option>

        `).join("")}

    `;

}


// ==========================================
// ほ場詳細表示
// ==========================================
function renderFieldDetail() {

    const content =
        document.getElementById(
            "fieldDetailContent"
        );

    if (!content) return;


    const year =
        document.getElementById(
            "fieldDetailYear"
        )?.value || "";


    const fieldNo =
        document.getElementById(
            "fieldDetailField"
        )?.value || "";


    // ----------------------------------------
    // 未選択
    // ----------------------------------------
    if (!year || !fieldNo) {

        content.innerHTML = `

            <div class="card">

                <p>
                    年度とほ場を選択してください。
                </p>

            </div>

        `;

        return;

    }


    // ----------------------------------------
    // ほ場マスターから取得
    // ----------------------------------------
    const field =
        fieldMaster.find(
            item =>
                String(item.no) ===
                String(fieldNo)
        );


    if (!field) {

        content.innerHTML = `

            <div class="card">

                <p>
                    ほ場情報が見つかりません。
                </p>

            </div>

        `;

        return;

    }


    // ========================================
    // ほ場詳細
    // ========================================

    content.innerHTML = `

        <!-- ==================================
             基本情報
        =================================== -->

        <div class="card">

            <h3>
                🌾 No.${field.no}
            </h3>

            <p>
                所有者：
                ${field.owner || ""}
            </p>

            <p>
                面積：
                ${field.area || ""}反
            </p>

        </div>


        <!-- ==================================
             施肥実績
        =================================== -->

        <details open>

            <summary>
                🌱 施肥実績
            </summary>

            <div style="padding-top: 10px;">

                ${getFieldFertilizerHtml(
                    year,
                    fieldNo
                )}

            </div>

        </details>


        <!-- ==================================
             施肥設計との比較
        =================================== -->

   <details>

    <summary>
        📊 施肥設計との比較
    </summary>

    <div style="padding: 10px;">

        ${getFieldPlanComparisonHtml(
            year,
            fieldNo
        )}

    </div>

</details>


        <!-- ==================================
             作業履歴
        =================================== -->

        <details>

    <summary>
        📋 作業履歴
    </summary>

    <div style="padding: 10px;">

        ${getFieldWorkHistoryHtml(
            year,
            fieldNo
        )}

    </div>

</details>

        <!-- ==================================
             出荷実績
        =================================== -->

        <details>

    <summary>
        📦 出荷実績
    </summary>

    <div style="padding: 10px;">

        ${getFieldShipmentHtml(
            year,
            fieldNo
        )}

    </div>

</details>


        <!-- ==================================
             資材費
        =================================== -->

        <details>

            <summary>
                💰 資材費
            </summary>

            <div style="padding: 10px;">

                <p>
                    資材費は
                    これから追加します。
                </p>

            </div>

        </details>

    `;

}
// ==========================================
// ほ場別・年度別 施肥実績集計
// ==========================================
// 指定した年度・ほ場について、
// 実際に記録された「元肥・追肥」の使用量と
// N・P・K投入量を集計する。
function calculateFieldFertilizerSummary(
    year,
    fieldNo
) {

    const summary = {

        base: {},

        top: {},

        totalN: 0,

        totalP: 0,

        totalK: 0

    };


    // ----------------------------------------
    // 作業記録がない場合
    // ----------------------------------------
    if (!Array.isArray(recordList)) {
        return summary;
    }


    // ========================================
    // 作業記録を確認
    // ========================================
    recordList.forEach(record => {

        if (!record) {
            return;
        }


        // ------------------------------------
        // 年度
        // ------------------------------------
        if (
            !record.date ||
            String(record.date).substring(0, 4) !==
                String(year)
        ) {
            return;
        }


        // ------------------------------------
        // 元肥・追肥だけを対象
        // ------------------------------------
        if (
            record.work !== "元肥" &&
            record.work !== "追肥"
        ) {
            return;
        }


        // ------------------------------------
        // 対象ほ場だけ取得
        // ------------------------------------
        const field =
            Array.isArray(record.fields)
                ? record.fields.find(
                    item =>
                        String(item.fieldNo) ===
                        String(fieldNo)
                )
                : null;


        if (!field) {
            return;
        }


        if (
            !Array.isArray(field.materials)
        ) {
            return;
        }


        // ====================================
        // 資材ごとの集計
        // ====================================
        field.materials.forEach(mat => {

            if (!mat || !mat.material) {
                return;
            }


            const amount =
                Number(mat.amount) || 0;


            if (amount <= 0) {
                return;
            }


            const master =
                materialMaster.find(
                    material =>
                        material.name ===
                        mat.material
                );


            // --------------------------------
            // 資材別使用量
            // --------------------------------
            const target =
                record.work === "元肥"
                    ? summary.base
                    : summary.top;


            if (!target[mat.material]) {

                target[mat.material] = {

                    amount: 0,

                    unit:
                        master
                            ? master.unit
                            : (
                                mat.unit || ""
                            )

                };

            }


            target[mat.material].amount +=
                amount;


            // --------------------------------
            // N・P・K
            // --------------------------------
            if (!master) {
                return;
            }


            const weight =
                Number(master.weight) || 0;


            const totalKg =
                amount * weight;


            summary.totalN +=
                totalKg *
                (Number(master.n) || 0) /
                100;


            summary.totalP +=
                totalKg *
                (Number(master.p) || 0) /
                100;


            summary.totalK +=
                totalKg *
                (Number(master.k) || 0) /
                100;

        });

    });


    // ========================================
    // 丸め
    // ========================================

    Object.keys(summary.base)
        .forEach(name => {

            summary.base[name].amount =
                Math.round(
                    summary.base[name].amount *
                    100
                ) / 100;

        });


    Object.keys(summary.top)
        .forEach(name => {

            summary.top[name].amount =
                Math.round(
                    summary.top[name].amount *
                    100
                ) / 100;

        });


    summary.totalN =
        Math.round(
            summary.totalN * 10
        ) / 10;


    summary.totalP =
        Math.round(
            summary.totalP * 10
        ) / 10;


    summary.totalK =
        Math.round(
            summary.totalK * 10
        ) / 10;


    return summary;

}
// ==========================================
// ほ場別・年度別 施肥実績集計
// ==========================================
// 指定した年度・ほ場について、
// 実際に記録された肥料作業を集計する。
//
// ・元肥 → 元肥として集計
// ・元肥以外の肥料カテゴリー → 追肥として集計
//
// 追肥①・追肥②など、作業名が増えても
// workMaster のカテゴリーを基準に判定する。
function calculateFieldFertilizerSummary(
    year,
    fieldNo
) {

    const summary = {

        base: {},

        top: {},

        totalN: 0,

        totalP: 0,

        totalK: 0

    };


    // ----------------------------------------
    // 作業記録がない場合
    // ----------------------------------------
    if (!Array.isArray(recordList)) {
        return summary;
    }


    // ========================================
    // 作業記録を確認
    // ========================================
    recordList.forEach(record => {

        if (!record) {
            return;
        }


        // ------------------------------------
        // 年度
        // ------------------------------------
        if (
            !record.date ||
            String(record.date).substring(0, 4) !==
                String(year)
        ) {
            return;
        }


        // ------------------------------------
        // 作業マスターからカテゴリーを取得
        // ------------------------------------
        const workMasterItem =
            Array.isArray(workMaster)
                ? workMaster.find(
                    work =>
                        work.name ===
                        record.work
                )
                : null;


        // ------------------------------------
        // 肥料カテゴリー以外は対象外
        // ------------------------------------
        if (
            !workMasterItem ||
            workMasterItem.category !==
                "fertilizer"
        ) {
            return;
        }


        // ------------------------------------
        // 元肥か追肥か判定
        // ------------------------------------
        const isBase =
            record.work === "元肥";


        // ------------------------------------
        // 対象ほ場を取得
        // ------------------------------------
        const field =
            Array.isArray(record.fields)
                ? record.fields.find(
                    item =>
                        String(item.fieldNo) ===
                        String(fieldNo)
                )
                : null;


        if (!field) {
            return;
        }


        if (
            !Array.isArray(field.materials)
        ) {
            return;
        }


        // ====================================
        // 資材ごとの集計
        // ====================================
        field.materials.forEach(mat => {

            if (
                !mat ||
                !mat.material
            ) {
                return;
            }


            const amount =
                Number(mat.amount) || 0;


            if (amount <= 0) {
                return;
            }


            // --------------------------------
            // 資材マスター
            // --------------------------------
            const master =
                materialMaster.find(
                    material =>
                        material.name ===
                        mat.material
                );


            // --------------------------------
            // 元肥 / 追肥の格納先
            // --------------------------------
            const target =
                isBase
                    ? summary.base
                    : summary.top;


            // --------------------------------
            // 資材別使用量
            // --------------------------------
            if (
                !target[mat.material]
            ) {

                target[mat.material] = {

                    amount: 0,

                    unit:
                        master
                            ? master.unit
                            : (
                                mat.unit ||
                                ""
                            )

                };

            }


            target[mat.material].amount +=
                amount;


            // --------------------------------
            // N・P・K
            // --------------------------------
            if (!master) {
                return;
            }


            const weight =
                Number(master.weight) || 0;


            const totalKg =
                amount * weight;


            summary.totalN +=
                totalKg *
                (Number(master.n) || 0) /
                100;


            summary.totalP +=
                totalKg *
                (Number(master.p) || 0) /
                100;


            summary.totalK +=
                totalKg *
                (Number(master.k) || 0) /
                100;

        });

    });


    // ========================================
    // 丸め処理
    // ========================================

    Object.keys(summary.base)
        .forEach(name => {

            summary.base[name].amount =
                Math.round(
                    summary.base[name].amount *
                    100
                ) / 100;

        });


    Object.keys(summary.top)
        .forEach(name => {

            summary.top[name].amount =
                Math.round(
                    summary.top[name].amount *
                    100
                ) / 100;

        });


    summary.totalN =
        Math.round(
            summary.totalN * 10
        ) / 10;


    summary.totalP =
        Math.round(
            summary.totalP * 10
        ) / 10;


    summary.totalK =
        Math.round(
            summary.totalK * 10
        ) / 10;


    return summary;

}

// ==========================================
// 施肥実績HTML
// ==========================================
function getFieldFertilizerHtml(
    year,
    fieldNo
) {

    const summary =
        calculateFieldFertilizerSummary(
            year,
            fieldNo
        );


    // ----------------------------------------
    // ほ場面積
    // ----------------------------------------
    const field =
        fieldMaster.find(
            item =>
                String(item.no) ===
                String(fieldNo)
        );


    const area =
        field
            ? Number(field.area) || 0
            : 0;


    // 1反あたりの換算
    const tanCount =
        area ;


    // ----------------------------------------
    // 元肥
    // ----------------------------------------
    const baseNames =
        Object.keys(summary.base);


    let baseHtml = "";


    if (baseNames.length === 0) {

        baseHtml =
            "<p>元肥の記録はありません。</p>";

    } else {

        baseHtml =
            baseNames
                .map(name => {

                    const item =
                        summary.base[name];


                    const perTan =
                        tanCount > 0
                            ? item.amount / tanCount
                            : 0;


                    return `
                        <div
                            class="record-row"
                        >

                            <span>
                                ${name}
                            </span>

                            <span>

                                <strong>
                                    ${item.amount}
                                    ${item.unit}
                                </strong>

                                <small>
                                    （${perTan.toFixed(2)}
                                    ${item.unit}/反）
                                </small>

                            </span>

                        </div>
                    `;

                })
                .join("");

    }


    // ----------------------------------------
    // 追肥
    // ----------------------------------------
    const topNames =
        Object.keys(summary.top);


    let topHtml = "";


    if (topNames.length === 0) {

        topHtml =
            "<p>追肥の記録はありません。</p>";

    } else {

        topHtml =
            topNames
                .map(name => {

                    const item =
                        summary.top[name];


                    const perTan =
                        tanCount > 0
                            ? item.amount / tanCount
                            : 0;


                    return `
                        <div
                            class="record-row"
                        >

                            <span>
                                ${name}
                            </span>

                            <span>

                                <strong>
                                    ${item.amount}
                                    ${item.unit}
                                </strong>

                                <small>
                                    （${perTan.toFixed(2)}
                                    ${item.unit}/反）
                                </small>

                            </span>

                        </div>
                    `;

                })
                .join("");

    }


    // ----------------------------------------
    // NPK 1反あたり
    // ----------------------------------------
    const nPerTan =
        tanCount > 0
            ? summary.totalN / tanCount
            : 0;


    const pPerTan =
        tanCount > 0
            ? summary.totalP / tanCount
            : 0;


    const kPerTan =
        tanCount > 0
            ? summary.totalK / tanCount
            : 0;


    // ========================================
    // HTML
    // ========================================
    return `

        <div class="card">

            <h3>🌱 施肥実績</h3>

            <p>
                総量
                <small>
                    （括弧内は1反あたり）
                </small>
            </p>


            <h4>元肥</h4>

            ${baseHtml}


            <hr>


            <h4>追肥</h4>

            ${topHtml}

        </div>


        <div class="card">

            <h3>🧪 成分投入量</h3>

            <div class="field-detail-npk">

                <div>

                    <small>N</small>

                    <strong>
                        ${summary.totalN}kg
                    </strong>

                    <small>
                        ${nPerTan.toFixed(2)}kg/反
                    </small>

                </div>


                <div>

                    <small>P</small>

                    <strong>
                        ${summary.totalP}kg
                    </strong>

                    <small>
                        ${pPerTan.toFixed(2)}kg/反
                    </small>

                </div>


                <div>

                    <small>K</small>

                    <strong>
                        ${summary.totalK}kg
                    </strong>

                    <small>
                        ${kPerTan.toFixed(2)}kg/反
                    </small>

                </div>

            </div>

        </div>

    `;

}

// ==========================================
// 施肥設計のN・P・K集計
// ==========================================
// 指定した年度・ほ場の施肥設計から、
// N・P・Kの予定投入量を計算する。
function calculateFieldFertilizerPlanSummary(
    year,
    fieldNo
) {

    const summary = {

        totalN: 0,

        totalP: 0,

        totalK: 0

    };


    // ----------------------------------------
    // 施肥設計を取得
    // ----------------------------------------
    const plan =
    getFertilizerPlan(
        year,
        fieldNo
    );


    if (
        !plan ||
        !Array.isArray(plan.materials)
    ) {
        return summary;
    }


    // ========================================
    // 施肥設計の資材を集計
    // ========================================
    plan.materials.forEach(material => {

        if (
            !material ||
            !material.material
        ) {
            return;
        }


        const amount =
            Number(material.amount) || 0;


        if (amount <= 0) {
            return;
        }


        // ------------------------------------
        // 資材マスター
        // ------------------------------------
        const master =
            materialMaster.find(
                item =>
                    item.name ===
                    material.material
            );


        if (!master) {
            return;
        }


        // ------------------------------------
        // 内容量 × 使用数量
        // ------------------------------------
        const weight =
            Number(master.weight) || 0;


        const totalKg =
            amount * weight;


        // ------------------------------------
        // N・P・K
        // ------------------------------------
        summary.totalN +=
            totalKg *
            (Number(master.n) || 0) /
            100;


        summary.totalP +=
            totalKg *
            (Number(master.p) || 0) /
            100;


        summary.totalK +=
            totalKg *
            (Number(master.k) || 0) /
            100;

    });


    // ========================================
    // 丸め
    // ========================================

    summary.totalN =
        Math.round(
            summary.totalN * 10
        ) / 10;


    summary.totalP =
        Math.round(
            summary.totalP * 10
        ) / 10;


    summary.totalK =
        Math.round(
            summary.totalK * 10
        ) / 10;


    return summary;

}


// ==========================================
// 施肥設計との比較HTML
// ==========================================
function getFieldPlanComparisonHtml(
    year,
    fieldNo
) {

    const plan =
        calculateFieldFertilizerPlanSummary(
            year,
            fieldNo
        );


    const actual =
        calculateFieldFertilizerSummary(
            year,
            fieldNo
        );


    // ----------------------------------------
    // ほ場面積
    // ----------------------------------------
    const field =
        fieldMaster.find(
            item =>
                String(item.no) ===
                String(fieldNo)
        );


    const area =
        field
            ? Number(field.area) || 0
            : 0;


    const tanCount =
        area ;


    // ----------------------------------------
    // 1反あたり
    // ----------------------------------------
    const planNPerTan =
        tanCount > 0
            ? plan.totalN / tanCount
            : 0;

    const planPPerTan =
        tanCount > 0
            ? plan.totalP / tanCount
            : 0;

    const planKPerTan =
        tanCount > 0
            ? plan.totalK / tanCount
            : 0;


    const actualNPerTan =
        tanCount > 0
            ? actual.totalN / tanCount
            : 0;

    const actualPPerTan =
        tanCount > 0
            ? actual.totalP / tanCount
            : 0;

    const actualKPerTan =
        tanCount > 0
            ? actual.totalK / tanCount
            : 0;


    // ----------------------------------------
    // 差
    // ----------------------------------------
    const diffN =
        actual.totalN -
        plan.totalN;

    const diffP =
        actual.totalP -
        plan.totalP;

    const diffK =
        actual.totalK -
        plan.totalK;


    const diffNPerTan =
        actualNPerTan -
        planNPerTan;

    const diffPPerTan =
        actualPPerTan -
        planPPerTan;

    const diffKPerTan =
        actualKPerTan -
        planKPerTan;


    // ----------------------------------------
    // 差の表示
    // ----------------------------------------
    const formatDiff =
        value => {

            const rounded =
                Math.round(
                    value * 100
                ) / 100;


            if (rounded > 0) {
                return `+${rounded}`;
            }


            return String(rounded);

        };


    // ========================================
    // HTML
    // ========================================
    return `

        <div class="card">

            <h3>
                📊 施肥設計との比較
            </h3>

            <table
                style="
                    width: 100%;
                    border-collapse: collapse;
                "
            >

                <thead>

                    <tr>

                        <th
                            style="
                                padding: 8px;
                                text-align: left;
                            "
                        >
                            成分
                        </th>

                        <th
                            style="
                                padding: 8px;
                                text-align: right;
                            "
                        >
                            設計
                        </th>

                        <th
                            style="
                                padding: 8px;
                                text-align: right;
                            "
                        >
                            実績
                        </th>

                        <th
                            style="
                                padding: 8px;
                                text-align: right;
                            "
                        >
                            差
                        </th>

                    </tr>

                </thead>


                <tbody>

                    <tr>

                        <td style="padding: 8px;">
                            N
                        </td>

                        <td
                            style="
                                padding: 8px;
                                text-align: right;
                            "
                        >
                            ${plan.totalN}kg
                            <br>
                            <small>
                                ${planNPerTan.toFixed(2)}
                                kg/反
                            </small>
                        </td>

                        <td
                            style="
                                padding: 8px;
                                text-align: right;
                            "
                        >
                            ${actual.totalN}kg
                            <br>
                            <small>
                                ${actualNPerTan.toFixed(2)}
                                kg/反
                            </small>
                        </td>

                        <td
                            style="
                                padding: 8px;
                                text-align: right;
                            "
                        >
                            ${formatDiff(diffN)}kg
                            <br>
                            <small>
                                ${formatDiff(
                                    diffNPerTan
                                )}kg/反
                            </small>
                        </td>

                    </tr>


                    <tr>

                        <td style="padding: 8px;">
                            P
                        </td>

                        <td
                            style="
                                padding: 8px;
                                text-align: right;
                            "
                        >
                            ${plan.totalP}kg
                            <br>
                            <small>
                                ${planPPerTan.toFixed(2)}
                                kg/反
                            </small>
                        </td>

                        <td
                            style="
                                padding: 8px;
                                text-align: right;
                            "
                        >
                            ${actual.totalP}kg
                            <br>
                            <small>
                                ${actualPPerTan.toFixed(2)}
                                kg/反
                            </small>
                        </td>

                        <td
                            style="
                                padding: 8px;
                                text-align: right;
                            "
                        >
                            ${formatDiff(diffP)}kg
                            <br>
                            <small>
                                ${formatDiff(
                                    diffPPerTan
                                )}kg/反
                            </small>
                        </td>

                    </tr>


                    <tr>

                        <td style="padding: 8px;">
                            K
                        </td>

                        <td
                            style="
                                padding: 8px;
                                text-align: right;
                            "
                        >
                            ${plan.totalK}kg
                            <br>
                            <small>
                                ${planKPerTan.toFixed(2)}
                                kg/反
                            </small>
                        </td>

                        <td
                            style="
                                padding: 8px;
                                text-align: right;
                            "
                        >
                            ${actual.totalK}kg
                            <br>
                            <small>
                                ${actualKPerTan.toFixed(2)}
                                kg/反
                            </small>
                        </td>

                        <td
                            style="
                                padding: 8px;
                                text-align: right;
                            "
                        >
                            ${formatDiff(diffK)}kg
                            <br>
                            <small>
                                ${formatDiff(
                                    diffKPerTan
                                )}kg/反
                            </small>
                        </td>

                    </tr>

                </tbody>

            </table>

        </div>

    `;

}
// ==========================================
// ほ場詳細・作業履歴
// ==========================================

// ------------------------------------------
// 作業カテゴリーの表示名
// ------------------------------------------
function getFieldDetailWorkCategoryLabel(
    category
) {

    switch (category) {

        case "fertilizer":
            return "肥料";

        case "spray":
            return "葉面散布";

        case "herbicide":
        case "weed":
            return "除草";

        case "planting":
            return "植え付け";

        case "shipment":
            return "出荷";

        case "other":
        default:
            return "その他";

    }

}


// ------------------------------------------
// 作業カテゴリーを取得
// ------------------------------------------
function getFieldDetailWorkCategory(
    workName
) {

    const work =
        Array.isArray(workMaster)
            ? workMaster.find(
                item =>
                    item.name === workName
            )
            : null;

    return work
        ? work.category
        : "other";

}



// ==========================================
// ほ場詳細・作業履歴HTML
// ==========================================
function getFieldWorkHistoryHtml(
    year,
    fieldNo
) {

    // ----------------------------------------
    // 対象年度・ほ場の記録を取得
    // ----------------------------------------
    const records =
        Array.isArray(recordList)
            ? recordList
                .filter(record => {

                    // 年度
                    if (
                        !record.date ||
                        !String(record.date)
                            .startsWith(
                                String(year)
                            )
                    ) {
                        return false;
                    }


                    // ほ場
                    if (
                        !Array.isArray(
                            record.fields
                        )
                    ) {
                        return false;
                    }


                    return record.fields.some(
                        field =>
                            String(
                                field.fieldNo
                            ) ===
                            String(fieldNo)
                    );

                })
                .sort(
                    (a, b) =>
                        b.date.localeCompare(
                            a.date
                        )
                )
            : [];


    // ----------------------------------------
    // カテゴリー一覧
    // ----------------------------------------
    const categories = [

        {
            value: "",
            label: "すべて"
        },

        {
            value: "fertilizer",
            label: "肥料"
        },

        {
            value: "spray",
            label: "葉面散布"
        },

        {
            value: "herbicide",
            label: "除草"
        },

        {
            value: "planting",
            label: "植え付け"
        },

        {
            value: "other",
            label: "その他"
        }

    ];


    // ========================================
    // HTML
    // ========================================
    return `

        <div class="card">

            <h3>📋 作業履歴</h3>


            <!-- ==============================
                 カテゴリーフィルター
            =============================== -->

            <div
                id="fieldDetailWorkFilters"
                class="selection-flex-wrap"
                style="margin-bottom: 12px;"
            >

                ${categories.map(category => `

                    <button
                        type="button"
                        class="${
                            category.value === ""
                                ? "tab active"
                                : "tab"
                        }"
                        data-category="${category.value}"
                        onclick="
                            filterFieldDetailWork(
                                '${category.value}'
                            );
                        "
                    >
                        ${category.label}
                    </button>

                `).join("")}

            </div>


            <!-- ==============================
                 資材合計
            =============================== -->

            <div id="fieldDetailWorkSummary">

                ${getFieldDetailMaterialSummaryHtml(
                    records,
                    fieldNo
                )}

            </div>


            <!-- ==============================
                 作業履歴
            =============================== -->

            <div id="fieldDetailWorkList">

                ${renderFieldDetailWorkList(
                    records,
                    ""
                )}

            </div>


        </div>

    `;

}

// ==========================================
// 作業履歴一覧
// ==========================================
function renderFieldDetailWorkList(
    records,
    selectedCategory
) {

    // ----------------------------------------
    // カテゴリー絞り込み
    // ----------------------------------------
    const filtered =
        selectedCategory === ""
            ? records
            : records.filter(record => {

                const category =
                    getFieldDetailWorkCategory(
                        record.work
                    );

                return (
                    category ===
                    selectedCategory
                );

            });


    // ----------------------------------------
    // 記録なし
    // ----------------------------------------
    if (filtered.length === 0) {

        return `
            <p>
                この条件の作業記録はありません。
            </p>
        `;

    }


    // ----------------------------------------
    // 日付ごとに表示
    // ----------------------------------------
    let html = "";


    filtered.forEach(record => {

        const field =
            record.fields.find(
                item =>
                    String(item.fieldNo) ===
                    String(
                        document.getElementById(
                            "fieldDetailField"
                        )?.value
                    )
            );


        if (!field) {
            return;
        }


        const category =
            getFieldDetailWorkCategory(
                record.work
            );


        const categoryLabel =
            getFieldDetailWorkCategoryLabel(
                category
            );


        // ------------------------------------
        // 資材
        // ------------------------------------
        let materialsHtml = "";


        if (
            Array.isArray(field.materials) &&
            field.materials.length > 0
        ) {

            materialsHtml =
                field.materials
                    .map(material => {

                        const master =
                            materialMaster.find(
                                item =>
                                    item.name ===
                                    material.material
                            );


                        const unit =
                            master
                                ? master.unit
                                : (
                                    material.unit ||
                                    ""
                                );


                        return `
                            <div>
                                🌱
                                ${material.material}
                                ${material.amount}${unit}
                            </div>
                        `;

                    })
                    .join("");

        }


        html += `

            <div
                class="card"
                style="margin-bottom: 10px;"
            >

                <h4>
                    ${record.date}
                   　
                    ${record.work}
                </h4>

                <small>
                    ${categoryLabel}
                </small>

                ${
                    materialsHtml
                        ? `
                            <hr>
                            ${materialsHtml}
                        `
                        : ""
                }


                ${
                    record.memo
                        ? `
                            <hr>
                            <div>
                                📝 ${record.memo}
                            </div>
                        `
                        : ""
                }

            </div>

        `;

    });


    return html;

}


// ==========================================
// 作業履歴カテゴリー切り替え
// ==========================================
function filterFieldDetailWork(
    category
) {

    const year =
        document.getElementById(
            "fieldDetailYear"
        )?.value || "";


    const fieldNo =
        document.getElementById(
            "fieldDetailField"
        )?.value || "";


    const list =
        document.getElementById(
            "fieldDetailWorkList"
        );


    const summary =
        document.getElementById(
            "fieldDetailWorkSummary"
        );


    // ----------------------------------------
    // 必要な情報がない場合
    // ----------------------------------------
    if (
        !list ||
        !year ||
        !fieldNo
    ) {
        return;
    }


    // ========================================
    // 対象年度・ほ場の記録を取得
    // ========================================
    const records =
        Array.isArray(recordList)
            ? recordList
                .filter(record => {

                    // 年度
                    if (
                        !record.date ||
                        !String(record.date)
                            .startsWith(
                                String(year)
                            )
                    ) {
                        return false;
                    }


                    // ほ場
                    if (
                        !Array.isArray(
                            record.fields
                        )
                    ) {
                        return false;
                    }


                    return record.fields.some(
                        field =>
                            String(
                                field.fieldNo
                            ) ===
                            String(fieldNo)
                    );

                })
                .sort(
                    (a, b) =>
                        b.date.localeCompare(
                            a.date
                        )
                )
            : [];


    // ========================================
    // カテゴリーで絞り込み
    // ========================================
    const filteredRecords =
        category === ""
            ? records
            : records.filter(record => {

                const workCategory =
                    getFieldDetailWorkCategory(
                        record.work
                    );

                return (
                    workCategory ===
                    category
                );

            });


    // ========================================
    // 資材合計を更新
    // ========================================
    if (summary) {

        summary.innerHTML =
            getFieldDetailMaterialSummaryHtml(
                filteredRecords,
                fieldNo
            );

    }


    // ========================================
    // 作業履歴を更新
    // ========================================
    list.innerHTML =
        renderFieldDetailWorkList(
            records,
            category
        );


    // ========================================
    // 選択中カテゴリーをactive表示
    // ========================================
    document
        .querySelectorAll(
            "#fieldDetailWorkFilters button"
        )
        .forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.category ===
                    category
            );

        });

}
// ==========================================
// ほ場詳細・資材合計
// ==========================================
// 選択した年度・ほ場・カテゴリーの作業について、
// 使用した資材を合計する。
function getFieldDetailMaterialSummaryHtml(
    records,
    fieldNo
) {

    const summary =
        calculateHistorySummary(
            records,
            fieldNo
        );


    const materials =
        Object.entries(
            summary.materialSummary
        );


    // ----------------------------------------
    // 資材がない場合
    // ----------------------------------------
    if (materials.length === 0) {

        return `

            <div class="card">

                <h4>📦 資材合計</h4>

                <p>
                    資材の記録はありません。
                </p>

            </div>

        `;

    }


    // ----------------------------------------
    // 資材一覧
    // ----------------------------------------
    const html =
        materials
            .map(([name, item]) => {

                return `

                    <div
                        class="record-row"
                    >

                        <span>
                            ${name}
                        </span>

                        <strong>
                            ${item.amount}
                            ${item.unit || ""}
                        </strong>

                    </div>

                `;

            })
            .join("");


    return `

        <div class="card">

            <h4>📦 資材合計</h4>

            ${html}

        </div>

    `;

}
// ==========================================
// ほ場詳細・出荷実績
// ==========================================

function getFieldShipmentHtml(
    year,
    fieldNo
) {

    // ========================================
    // 対象年度・ほ場の出荷記録
    // ========================================

    const records =
        Array.isArray(
            shipmentRecords
        )
            ? shipmentRecords
                .filter(record => {

                    if (
                        !record.date ||
                        !String(
                            record.date
                        ).startsWith(
                            String(year)
                        )
                    ) {
                        return false;
                    }

                    return (
                        String(
                            record.fieldNo
                        ) ===
                        String(fieldNo)
                    );

                })
                .sort(
                    (a, b) =>
                        b.date.localeCompare(
                            a.date
                        )
                )
            : [];


    // ========================================
    // 出荷なし
    // ========================================

    if (
        records.length === 0
    ) {

        return `

            <div class="card">

                <p>
                    この年度の出荷記録はありません。
                </p>

            </div>

        `;

    }


    // ========================================
    // 共通出荷集計
    // ========================================

    const summaryHtml =
        getShipmentSummaryHtml(records);

    // ========================================
    // 個別出荷履歴
    // ========================================

    const historyHtml =
        records
            .map(
                record => {

                    const recordTotal =
                        Array.isArray(
                            record.items
                        )
                            ? record.items.reduce(
                                (
                                    total,
                                    item
                                ) =>
                                    total +
                                    (
                                        Number(
                                            item.quantity
                                        ) || 0
                                    ),
                                0
                            )
                            : 0;


                    const quantityUnit =
                        record.weight === "袋"
                            ? "袋"
                            : "箱";


                    const recordSales =
                        getShipmentSales(
                            record
                        );


                    const itemsHtml =
                        Array.isArray(
                            record.items
                        )
                            ? record.items
                                .map(
                                    item => {

                                        const price =
                                            getPrice(
                                                record.weight,
                                                item.grade,
                                                record.date
                                            );


                                        const quantity =
                                            Number(
                                                item.quantity
                                            ) || 0;


                                        const itemSales =
                                            price == null
                                                ? null
                                                : price *
                                                  quantity;


                                        return `

                                            <div
                                                class="
                                                    shipment-sale-row
                                                "
                                            >

                                                <span
                                                    class="
                                                        shipment-sale-grade
                                                    "
                                                >
                                                    ${item.grade}
                                                </span>


                                                ${
                                                    price == null

                                                        ? `

                                                            <span
                                                                style="
                                                                    flex:1;
                                                                "
                                                            >
                                                                価格未登録
                                                            </span>

                                                        `

                                                        : `

                                                            <span
                                                                class="
                                                                    shipment-sale-price
                                                                "
                                                            >
                                                                ${
                                                                    price
                                                                        .toLocaleString()
                                                                }円
                                                            </span>


                                                            <span
                                                                class="
                                                                    shipment-sale-quantity
                                                                "
                                                            >
                                                                ×
                                                                ${quantity}
                                                                ${quantityUnit}
                                                            </span>


                                                            <span
                                                                class="
                                                                    shipment-sale-total
                                                                "
                                                            >
                                                                =
                                                                ${
                                                                    itemSales
                                                                        .toLocaleString()
                                                                }円
                                                            </span>

                                                        `
                                                }

                                            </div>

                                        `;

                                    }
                                )
                                .join("")
                            : "";


                    return `

                        <details
                            style="
                                margin-bottom:
                                    10px;
                            "
                        >

                            <summary
                                style="
                                    cursor:
                                        pointer;
                                    padding:
                                        12px;
                                    font-weight:
                                        bold;
                                "
                            >

                                ${record.date}

                               　

                                ${
                                    record.destination ||
                                    ""
                                }

                               　

                                ${recordTotal}
                                ${quantityUnit}

                               　

                                ${
                                    recordSales == null
                                        ? ""
                                        : recordSales
                                            .toLocaleString()
                                            + "円"
                                }

                            </summary>


                            <div
                                class="card"
                                style="
                                    margin-top:
                                        8px;
                                "
                            >

                                <div>
                                    出荷先：
                                    ${
                                        record.destination ||
                                        ""
                                    }
                                </div>


                                <div>
                                    重量：
                                    ${
                                        record.weight ||
                                        ""
                                    }
                                </div>


                                ${
                                    record.weight !==
                                        "袋" &&
                                    record.package
                                        ? `
                                            <div>
                                                包装：
                                                ${record.package}
                                            </div>
                                        `
                                        : ""
                                }


                                <hr>


                                ${itemsHtml}


                                <hr>


                                <div
                                    class="
                                        record-row
                                    "
                                >

                                    <strong>
                                        合計
                                    </strong>

                                    <strong>
                                        ${recordTotal}
                                        ${quantityUnit}
                                    </strong>

                                </div>


                                <div
                                    class="
                                        record-row
                                    "
                                >

                                    <strong>
                                        💰 売上
                                    </strong>

                                    <strong>
                                        ${
                                            recordSales == null
                                                ? "価格未登録"
                                                : recordSales
                                                    .toLocaleString()
                                                    + "円"
                                        }
                                    </strong>

                                </div>

                            </div>

                        </details>

                    `;

                }
            )
            .join("");



    // ========================================
    // 最終HTML
    // ========================================

    return `

        <div>

            ${summaryHtml}


            <!-- ==========================
                 出荷履歴
            =========================== -->

            <h3>
                📋 出荷履歴
            </h3>

            ${historyHtml}

        </div>

    `;

}
