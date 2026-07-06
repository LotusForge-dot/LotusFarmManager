# 2. master.js

Version 1.0

---

# 2.1 概要

master.js は Lotus Farm Manager の各種マスタデータを管理するモジュールである。

主な役割は以下のとおり。

- 田んぼマスタ管理
- 作業マスタ管理
- 資材マスタ管理
- マスタデータ更新
- マスタデータ削除
- マスタデータ表示

各マスタはアプリ全体で共通利用されるため、データの整合性を維持する重要な役割を持つ。

---

# 2.2 関数一覧

本ファイルに含まれる関数をソースコード順に記載する。




| No | 関数 | 役割 |
|---:|------|------|
| 1 | renderFieldMaster() | 田んぼマスタ画面表示 |
| 2 | toggleFieldForm() | 田んぼ入力フォーム表示切替 |
| 3 | renderWorkMaster() | 作業マスタ画面表示 |
| 4 | renderMaterialMaster() | 資材マスタ画面表示 |
| 5 | saveField() | 田んぼ保存 |
| 6 | renderFieldList() | 田んぼ一覧表示 |
| 7 | editField() | 田んぼ編集 |
| 8 | deleteField() | 田んぼ削除 |
| 9 | toggleWorkForm() | 作業入力フォーム表示切替 |
|10 | renderWorkList() | 作業一覧表示 |
|11 | saveWork() | 作業保存 |
|12 | editWork() | 作業編集 |
|13 | deleteWork() | 作業削除 |
|14 | toggleMaterialForm() | 資材入力フォーム表示切替 |
|15 | renderMaterialList() | 資材一覧表示 |
|16 | saveMaterial() | 資材保存 |
|17 | editMaterial() | 資材編集 |
|18 | deleteMaterial() | 資材削除 |
|19 | saveMaterialMaster() | 資材マスタ保存 |
|20 | loadMaterialMaster() | 資材マスタ読込 |
|21 | renderWorkCheckList() | 使用可能作業一覧生成 |

# 2.3 田んぼマスタ

## 2.3.1 概要

田んぼマスタは、Lotus Farm Managerで利用する田んぼ情報を管理する機能である。

登録した田んぼは、作業記録・作業履歴・施肥設計など、システム全体から共通利用される。

---

## 2.3.2 機能フロー

```
renderFieldMaster()
        │
        ▼
renderFieldList()
        │
        ▼
ユーザー操作
        │
        ├── toggleFieldForm()
        ├── saveField()
        ├── editField()
        └── deleteField()
        │
        ▼
saveData()
        │
        ▼
renderFieldList()
```

---

## 2.3.3 renderFieldMaster()

### 目的

田んぼマスタ画面を表示する。

### 引数

なし

### 戻り値

なし

### 呼び出し元

- 設定画面

### 呼び出し先

- renderFieldList()

### 処理概要

- 田んぼマスタ画面を表示する。
- 一覧表示と入力フォームを初期化する。

### 使用画面

田んぼマスタ

---

## 2.3.4 renderFieldList()

### 目的

田んぼ一覧を表示する。

### 呼び出し元

- renderFieldMaster()
- saveField()
- deleteField()

### 処理概要

登録済み田んぼを一覧表示する。

---

## 2.3.5 saveField()

### 目的

田んぼを登録・更新する。

### 引数

なし

### 戻り値

なし

### 呼び出し元

- 保存ボタン

### 呼び出し先

- saveData()
- renderFieldList()

### 処理概要

- 入力内容を保存する。
- 新規登録・更新を判定する。
- 一覧を再表示する。

---

## 2.3.6 editField()

### 目的

選択した田んぼを編集する。

### 呼び出し元

- 編集ボタン

### 処理概要

対象データを入力フォームへ反映する。

---

## 2.3.7 deleteField()

### 目的

田んぼを削除する。

### 呼び出し元

- 削除ボタン

### 呼び出し先

- saveData()
- renderFieldList()

### 処理概要

選択した田んぼを削除し、一覧を更新する。

---

## 2.3.8 toggleFieldForm()

### 目的

入力フォームの表示・非表示を切り替える。

### 呼び出し元

- 新規追加ボタン
- キャンセルボタン

### 処理概要

入力フォームの表示状態を切り替える。

# 2.4 作業マスタ

## 2.4.1 概要

作業マスタは、Lotus Farm Managerで利用する作業名称を管理する機能である。

登録した作業は、作業記録・作業履歴・施肥設計など、システム全体から共通利用される。

---

## 2.4.2 機能フロー

```
renderWorkMaster()
        │
        ▼
renderWorkList()
        │
        ▼
ユーザー操作
        │
        ├── toggleWorkForm()
        ├── saveWork()
        ├── editWork()
        └── deleteWork()
        │
        ▼
saveData()
        │
        ▼
renderWorkList()
```

---

## 2.4.3 renderWorkMaster()

### 目的

作業マスタ画面を表示する。

### 引数

なし

### 戻り値

なし

### 呼び出し元

- 設定画面

### 呼び出し先

- renderWorkList()

### 処理概要

- 作業マスタ画面を表示する。
- 一覧表示と入力フォームを初期化する。

### 使用画面

作業マスタ

---

## 2.4.4 renderWorkList()

### 目的

作業一覧を表示する。

### 呼び出し元

- renderWorkMaster()
- saveWork()
- deleteWork()

### 処理概要

登録済み作業を一覧表示する。

---

## 2.4.5 saveWork()

### 目的

作業を登録・更新する。

### 引数

なし

### 戻り値

なし

### 呼び出し元

- 保存ボタン

### 呼び出し先

- saveData()
- renderWorkList()

### 処理概要

- 入力内容を保存する。
- 新規登録・更新を判定する。
- 一覧を再表示する。

---

## 2.4.6 editWork()

### 目的

選択した作業を編集する。

### 呼び出し元

- 編集ボタン

### 処理概要

対象データを入力フォームへ反映する。

---

## 2.4.7 deleteWork()

### 目的

作業を削除する。

### 呼び出し元

- 削除ボタン

### 呼び出し先

- saveData()
- renderWorkList()

### 処理概要

選択した作業を削除し、一覧を更新する。

---

## 2.4.8 toggleWorkForm()

### 目的

入力フォームの表示・非表示を切り替える。

### 呼び出し元

- 新規追加ボタン
- キャンセルボタン

### 処理概要

入力フォームの表示状態を切り替える。

---

# 2.5 資材マスタ

## 2.5.1 概要

資材マスタは、Lotus Farm Managerで利用する資材情報を管理する機能である。

資材名・単位・使用可能作業などの情報を管理し、作業記録および施肥設計から共通利用される。

---

## 2.5.2 機能フロー

```
renderMaterialMaster()
        │
        ▼
loadMaterialMaster()
        │
        ▼
renderMaterialList()
        │
        ▼
ユーザー操作
        │
        ├── toggleMaterialForm()
        ├── saveMaterial()
        ├── editMaterial()
        ├── deleteMaterial()
        └── renderWorkCheckList()
        │
        ▼
saveMaterialMaster()
        │
        ▼
saveData()
        │
        ▼
renderMaterialList()
```

---

## 2.5.3 renderMaterialMaster()

### 目的

資材マスタ画面を表示する。

### 引数

なし

### 戻り値

なし

### 呼び出し元

- 設定画面

### 呼び出し先

- loadMaterialMaster()
- renderMaterialList()

### 処理概要

- 資材マスタ画面を表示する。
- 資材一覧を表示する。
- 入力フォームを初期化する。

### 使用画面

資材マスタ

---

## 2.5.4 renderMaterialList()

### 目的

資材一覧を表示する。

### 呼び出し元

- renderMaterialMaster()
- saveMaterial()
- deleteMaterial()

### 処理概要

登録済み資材を一覧表示する。

---

## 2.5.5 saveMaterial()

### 目的

資材を登録・更新する。

### 引数

なし

### 戻り値

なし

### 呼び出し元

- 保存ボタン

### 呼び出し先

- saveMaterialMaster()
- renderMaterialList()

### 処理概要

- 入力内容を保存する。
- 新規登録・更新を判定する。
- 一覧を再表示する。

---

## 2.5.6 editMaterial()

### 目的

選択した資材を編集する。

### 呼び出し元

- 編集ボタン

### 処理概要

対象データを入力フォームへ反映する。

---

## 2.5.7 deleteMaterial()

### 目的

資材を削除する。

### 呼び出し元

- 削除ボタン

### 呼び出し先

- saveMaterialMaster()
- renderMaterialList()

### 処理概要

選択した資材を削除し、一覧を更新する。

---

## 2.5.8 toggleMaterialForm()

### 目的

入力フォームの表示・非表示を切り替える。

### 呼び出し元

- 新規追加ボタン
- キャンセルボタン

### 処理概要

入力フォームの表示状態を切り替える。

---

## 2.5.9 renderWorkCheckList()

### 目的

資材に紐付け可能な作業一覧を表示する。

### 呼び出し元

- renderMaterialMaster()
- editMaterial()

### 処理概要

作業マスタを参照し、チェックボックス一覧を生成する。

---

## 2.5.10 loadMaterialMaster()

### 目的

資材マスタデータを読み込む。

### 呼び出し元

- renderMaterialMaster()

### 処理概要

保存済み資材マスタを取得し、画面表示用データを初期化する。

---

## 2.5.11 saveMaterialMaster()

### 目的

資材マスタを保存する。

### 呼び出し元

- saveMaterial()
- deleteMaterial()

### 呼び出し先

- saveData()

### 処理概要

資材マスタを保存し、永続化処理を実行する。
# 2.6 共通処理

## 2.6.1 概要

master.js に実装されている各マスタ管理機能は、共通した CRUD（Create・Read・Update・Delete）の流れで構成される。

田んぼ・作業・資材の管理対象は異なるが、基本的な処理手順は共通である。

---

## 2.6.2 共通フロー

```
マスタ画面表示
        │
        ▼
一覧表示
        │
        ▼
ユーザー操作
        │
        ├── 新規登録
        ├── 編集
        ├── 削除
        └── キャンセル
        │
        ▼
データ更新
        │
        ▼
saveData()
        │
        ▼
一覧再表示
```

---

## 2.6.3 共通ルール

master.js では以下の設計ルールを採用する。

- 各マスタは独立して管理する。
- 一覧表示は `render○○List()` が担当する。
- 保存処理は `save○○()` が担当する。
- 編集処理は `edit○○()` が担当する。
- 削除処理は `delete○○()` が担当する。
- 入力フォーム表示切替は `toggle○○Form()` が担当する。
- データ永続化は `saveData()` を通じて行う。

---

## 2.6.4 設計方針

master.js は、アプリ全体で利用する共通マスタデータを管理するモジュールである。

各マスタは同一の構成・命名規則・処理フローで実装することで、保守性と可読性を向上させる。

新しいマスタを追加する場合も、本章で示した構成およびルールに従うことを基本とする。