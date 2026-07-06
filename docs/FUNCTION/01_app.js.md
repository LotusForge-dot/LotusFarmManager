# 1. app.js

Version 1.0

---

# 1.1 概要

app.js は Lotus Farm Manager の画面制御を担当するメインモジュールである。

主な役割は以下のとおり。

- メニュー画面
- 作業記録
- 作業履歴
- マスタ画面
- 施肥設計
- 画面遷移
- 画面描画
- ユーザー操作

本ファイルでは、画面表示を行う render○○() 関数と、ユーザー操作を処理する関数を中心に構成される。

---

# 1.2 関数一覧

本ファイルに含まれる関数をソースコード順に記載する。



# 1.2 関数一覧

| No | 関数名 | 役割 |
|---:|--------|------|
| 1 | showRecord() | 作業記録画面表示 |
| 2 | showHistory() | 作業履歴画面表示 |
| 3 | showSettings() | 設定画面表示 |
| 4 | showFieldMaster() | 田んぼマスタ画面表示 |
| 5 | showWorkMaster() | 作業マスタ画面表示 |
| 6 | showMaterialMaster() | 資材マスタ画面表示 |
| 7 | renderFieldOptions() | 田んぼ一覧生成 |
| 8 | renderWorkOptions() | 作業一覧生成 |
| 9 | renderMaterialOptions() | 資材一覧生成 |
| 10 | saveRecord() | 作業記録保存 |
| 11 | renderRecordList() | 作業記録一覧表示 |
| 12 | renderHistoryList() | 作業履歴一覧表示 |
| 13 | setToday() | 今日の日付設定 |
| 14 | editRecord() | 作業記録編集開始 |
| 15 | loadRecordForEdit() | 編集データ読込 |
| 16 | deleteRecord() | 作業記録削除 |
| 17 | renderHistoryFieldOptions() | 履歴検索用田んぼ一覧生成 |
| 18 | renderHistoryWorkOptions() | 履歴検索用作業一覧生成 |
| 19 | clearHistorySearch() | 履歴検索条件クリア |
| 20 | addMaterialRow() | 資材入力行追加 |
| 21 | deleteMaterialRow() | 資材入力行削除 |
| 22 | updateMaterialUnit() | 資材単位更新 |
| 23 | renderHistoryYearOptions() | 履歴検索用年一覧生成 |
| 24 | showFertilizerPlan() | 施肥設計画面表示 |
| 25 | loadFertilizerPlan() | 施肥設計読込 |
| 26 | renderPlanYearOptions() | 施肥設計年一覧生成 |
| 27 | renderPlanFieldOptions() | 施肥設計田んぼ一覧生成 |
| 28 | renderPlanArea() | 施肥設計画面描画 |
| 29 | addPlanMaterial() | 施肥資材追加 |
| 30 | saveFertilizerPlan() | 施肥設計保存 |
| 31 | renderPlanMaterials() | 施肥資材一覧描画 |
| 32 | changePlanWork() | 作業変更 |
| 33 | changePlanMaterial() | 資材変更 |
| 34 | changePlanAmount() | 数量変更 |
| 35 | deletePlanMaterial() | 施肥資材削除 |
| 36 | updateFertilizerSummary() | 施肥集計更新 |
| 37 | addPlanWork() | 作業グループ追加 |
| 38 | changeWorkGroup() | 作業グループ変更 |

# 1.3 作業記録

## 1.3.1 概要

作業記録機能は、日々の営農作業を登録するための機能である。

田んぼ・作業・資材をマスタから選択し、数量やメモを入力して保存する。

---

## 1.3.2 機能フロー

```
showRecord()
        │
        ▼
renderFieldOptions()
renderWorkOptions()
renderMaterialOptions()
        │
        ▼
作業記録画面表示
        │
        ▼
ユーザー入力
        │
        ├── addMaterialRow()
        ├── deleteMaterialRow()
        └── updateMaterialUnit()
        │
        ▼
saveRecord()
        │
        ▼
saveData()
        │
        ▼
作業記録保存
```

---

## 1.3.3 showRecord()

### 目的

作業記録画面を表示する。

### 引数

なし

### 戻り値

なし

### 呼び出し元

- メニュー画面

### 呼び出し先

- renderFieldOptions()
- renderWorkOptions()
- renderMaterialOptions()

### 処理概要

- 作業記録画面を生成する。
- 各選択肢を初期化する。
- 入力フォームを表示する。

### 使用画面

作業記録

---

## 1.3.4 renderFieldOptions()

### 目的

田んぼ一覧を生成する。

### 引数

なし

### 戻り値

なし

### 呼び出し元

- showRecord()

### 呼び出し先

なし

### 処理概要

fieldMaster を参照し、田んぼ選択用の option を生成する。

---

## 1.3.5 renderWorkOptions()

### 目的

作業一覧を生成する。

### 引数

なし

### 戻り値

なし

### 呼び出し元

- showRecord()

### 呼び出し先

なし

### 処理概要

workMaster を参照し、作業選択用の option を生成する。

---

## 1.3.6 renderMaterialOptions()

### 目的

資材一覧を生成する。

### 引数

なし

### 戻り値

なし

### 呼び出し元

- showRecord()

### 呼び出し先

なし

### 処理概要

materialMaster を参照し、資材選択用の option を生成する。

---

## 1.3.7 addMaterialRow()

### 目的

資材入力行を追加する。

---

## 1.3.8 deleteMaterialRow()

### 目的

資材入力行を削除する。

---

## 1.3.9 updateMaterialUnit()

### 目的

選択した資材に応じて単位表示を更新する。

---

## 1.3.10 saveRecord()

### 目的

入力内容を作業記録として保存する。

### 引数

なし

### 戻り値

なし

### 呼び出し元

- 保存ボタン

### 呼び出し先

- saveData()

### 処理概要

- 入力内容を取得する。
- records に追加する。
- saveData() を実行する。
- 必要に応じて画面を更新する。

### 使用画面

作業記録


# 1.4 作業履歴

## 1.4.1 概要

作業履歴機能は、登録済みの作業記録を検索・表示・編集・削除する機能である。

年・田んぼ・作業を条件として絞り込み検索を行い、過去の作業記録を一覧表示する。

---

## 1.4.2 機能フロー

```
showHistory()
        │
        ▼
renderHistoryYearOptions()
renderHistoryFieldOptions()
renderHistoryWorkOptions()
        │
        ▼
履歴画面表示
        │
        ▼
検索条件入力
        │
        ▼
renderHistoryList()
        │
        ├── editRecord()
        ├── loadRecordForEdit()
        ├── deleteRecord()
        └── clearHistorySearch()
        │
        ▼
画面更新
```

---

## 1.4.3 showHistory()

### 目的

作業履歴画面を表示する。

### 引数

なし

### 戻り値

なし

### 呼び出し元

- メニュー画面

### 呼び出し先

- renderHistoryYearOptions()
- renderHistoryFieldOptions()
- renderHistoryWorkOptions()
- renderHistoryList()

### 処理概要

- 作業履歴画面を表示する。
- 検索条件を初期化する。
- 履歴一覧を表示する。

### 使用画面

作業履歴

---

## 1.4.4 renderHistoryList()

### 目的

検索条件に一致する作業履歴を一覧表示する。

### 引数

なし

### 戻り値

なし

### 呼び出し元

- showHistory()
- 検索条件変更時

### 呼び出し先

なし

### 処理概要

- records を検索する。
- 条件に一致したデータを一覧表示する。
- 編集・削除ボタンを表示する。

### 使用画面

作業履歴

---

## 1.4.5 editRecord()

### 目的

編集対象の作業記録を選択する。

### 呼び出し元

- 編集ボタン

### 処理概要

編集対象を指定し、編集画面へ遷移する。

---

## 1.4.6 loadRecordForEdit()

### 目的

編集対象のデータを読み込み、入力フォームへ反映する。

### 呼び出し元

- editRecord()

### 処理概要

records の内容をフォームへ設定する。

---

## 1.4.7 deleteRecord()

### 目的

作業記録を削除する。

### 呼び出し元

- 削除ボタン

### 処理概要

対象データを削除し、saveData() を実行後、履歴一覧を更新する。

---

## 1.4.8 renderHistoryYearOptions()

### 目的

年選択一覧を生成する。

---

## 1.4.9 renderHistoryFieldOptions()

### 目的

田んぼ一覧を生成する。

---

## 1.4.10 renderHistoryWorkOptions()

### 目的

作業一覧を生成する。

---

## 1.4.11 clearHistorySearch()

### 目的

検索条件を初期化する。

### 呼び出し元

- 条件クリアボタン

### 処理概要

検索条件を初期状態へ戻し、履歴一覧を再表示する。
# 1.5 設定

## 1.5.1 概要

設定画面は、Lotus Farm Manager の各種管理機能へ遷移するためのメニュー画面である。

現在は各種マスタ管理およびデータ管理機能への入口として使用する。

---

## 1.5.2 機能フロー

```
showSettings()
        │
        ▼
設定画面表示
        │
        ├── 田んぼマスタ
        ├── 作業マスタ
        ├── 資材マスタ
        ├── バックアップ
        ├── 復元
        └── データ初期化
```

---

## 1.5.3 showSettings()

### 目的

設定画面を表示する。

### 引数

なし

### 戻り値

なし

### 呼び出し元

- メニュー画面

### 呼び出し先

- showFieldMaster()
- showWorkMaster()
- showMaterialMaster()
- バックアップ処理
- 復元処理
- データ初期化処理

### 処理概要

- 設定画面を表示する。
- 各管理画面へのメニューを生成する。
- データ管理機能への入口を提供する。

### 使用画面

設定画面


# 1.6 マスタ管理

## 1.6.1 概要

マスタ管理機能は、Lotus Farm Manager 全体で共通利用するデータを管理する機能である。

現在は以下の3種類のマスタを管理する。

- 田んぼマスタ
- 作業マスタ
- 資材マスタ

各マスタは他機能から参照されるため、登録・編集・削除時はデータ整合性に注意する。

---

## 1.6.2 機能構成

```
設定画面
    │
    ├── showFieldMaster()
    │
    ├── showWorkMaster()
    │
    └── showMaterialMaster()
```

各マスタ画面では、

```
一覧表示

↓

追加

↓

編集

↓

削除

↓

saveData()
```

の流れで管理を行う。

---

# 1.6.3 田んぼマスタ

## 概要

田んぼ情報を管理する。

登録した田んぼは作業記録・作業履歴・施肥設計などで共通利用される。

---

## showFieldMaster()

### 目的

田んぼマスタ管理画面を表示する。

### 引数

なし

### 戻り値

なし

### 呼び出し元

- showSettings()

### 処理概要

- 田んぼ一覧を表示する。
- 新規追加・編集・削除を行う。

---

# 1.6.4 作業マスタ

## 概要

作業名称を管理する。

登録した作業は作業記録および施肥設計で利用される。

---

## showWorkMaster()

### 目的

作業マスタ管理画面を表示する。

### 引数

なし

### 戻り値

なし

### 呼び出し元

- showSettings()

### 処理概要

- 作業一覧を表示する。
- 新規追加・編集・削除を行う。

---

# 1.6.5 資材マスタ

## 概要

資材情報を管理する。

資材には単位・利用可能な作業などの情報を保持する。

---

## showMaterialMaster()

### 目的

資材マスタ管理画面を表示する。

### 引数

なし

### 戻り値

なし

### 呼び出し元

- showSettings()

### 処理概要

- 資材一覧を表示する。
- 新規追加・編集・削除を行う。
- 利用可能な作業との関連付けを管理する。

# 1.7 施肥設計

## 1.7.1 概要

施肥設計機能は、田んぼごと・年度ごとに施肥計画を作成・管理する機能である。

作業（元肥・追肥など）ごとに使用資材を登録し、数量入力と施肥成分集計を行う。

---

## 1.7.2 機能フロー

```
showFertilizerPlan()
        │
        ▼
loadFertilizerPlan()
        │
        ▼
renderPlanYearOptions()
renderPlanFieldOptions()
        │
        ▼
renderPlanArea()
        │
        ▼
renderPlanMaterials()
        │
        ▼
ユーザー操作
        │
        ├── addPlanWork()
        ├── addPlanMaterial()
        ├── changeWorkGroup()
        ├── changePlanMaterial()
        ├── changePlanAmount()
        └── deletePlanMaterial()
        │
        ▼
updateFertilizerSummary()
        │
        ▼
saveFertilizerPlan()
        │
        ▼
saveData()
```

---

## 1.7.3 showFertilizerPlan()

### 目的

施肥設計画面を表示する。

### 引数

なし

### 戻り値

なし

### 呼び出し元

- メニュー画面

### 呼び出し先

- loadFertilizerPlan()
- renderPlanYearOptions()
- renderPlanFieldOptions()
- renderPlanArea()

### 処理概要

- 施肥設計画面を表示する。
- 年度・田んぼを選択できる状態にする。
- 保存済みデータを読み込む。

### 使用画面

施肥設計

---

## 1.7.4 loadFertilizerPlan()

### 目的

保存済み施肥設計を読み込む。

### 呼び出し元

- showFertilizerPlan()

### 処理概要

年度・田んぼに対応する施肥設計データを取得する。

---

## 1.7.5 renderPlanArea()

### 目的

施肥設計画面全体を描画する。

### 引数

なし

### 戻り値

なし

### 呼び出し元

- showFertilizerPlan()
- loadFertilizerPlan()

### 呼び出し先

- renderPlanMaterials()
- updateFertilizerSummary()

### 処理概要

- 作業グループを表示する。
- 資材入力欄を生成する。
- 集計表示を更新する。

---

## 1.7.6 renderPlanMaterials()

### 目的

施肥資材一覧を描画する。

### 呼び出し元

- renderPlanArea()

### 呼び出し先

- updateFertilizerSummary()

### 処理概要

- planMaterials を画面へ表示する。
- 作業ごとに資材をグループ化する。
- 資材・数量入力欄を生成する。
- 集計を更新する。

---

## 1.7.7 saveFertilizerPlan()

### 目的

施肥設計を保存する。

### 呼び出し元

- 保存ボタン

### 呼び出し先

- saveData()

### 処理概要

施肥設計データを保存し、LocalStorageへ反映する。

---

## 1.7.8 補助関数

以下の補助関数は、画面操作を担当する。

| 関数 | 役割 |
|------|------|
| renderPlanYearOptions() | 年一覧生成 |
| renderPlanFieldOptions() | 田んぼ一覧生成 |
| addPlanWork() | 作業グループ追加 |
| addPlanMaterial() | 資材追加 |
| changeWorkGroup() | 作業グループ変更 |
| changePlanMaterial() | 資材変更 |
| changePlanAmount() | 数量変更 |
| deletePlanMaterial() | 資材削除 |
| updateFertilizerSummary() | 成分集計更新 |