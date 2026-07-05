master.js 関数仕様書

Version 3.1

---

概要

各種マスタ（田んぼ・作業・資材）の画面表示・CRUD・LocalStorage管理を担当する。

管理対象

- 田んぼマスタ
- 作業マスタ
- 資材マスタ

---

グローバル変数

田んぼマスタ

- fieldMaster
- fieldFormVisible
- editingIndex

作業マスタ

- workMaster
- workFormVisible
- editingWorkIndex

資材マスタ

- materialMaster
- materialFormVisible
- editingMaterialIndex

---

田んぼマスタ

renderFieldMaster()

役割

田んぼマスタ画面を描画する。

呼び出し

- showFieldMaster()
- saveField()
- deleteField()
- toggleFieldForm()
- editField()

---

toggleFieldForm()

役割

入力フォームの開閉。

---

saveField()

役割

田んぼを新規登録・更新する。

呼び出す関数

- saveFieldMaster()
- renderFieldMaster()

---

renderFieldList()

役割

登録済み田んぼ一覧を表示。

---

editField(index)

役割

編集モードへ移行し入力内容を復元する。

---

deleteField(index)

役割

田んぼ削除。

呼び出す関数

- saveFieldMaster()
- renderFieldMaster()

---

作業マスタ

renderWorkMaster()

役割

作業マスタ画面を描画する。

---

toggleWorkForm()

役割

入力フォームの開閉。

---

renderWorkList()

役割

作業一覧表示。

---

saveWork()

役割

作業を保存・更新する。

呼び出す関数

- saveWorkMaster()
- renderWorkMaster()

---

editWork(index)

役割

編集モード開始。

---

deleteWork(index)

役割

作業削除。

呼び出す関数

- saveWorkMaster()
- renderWorkMaster()

---

資材マスタ

renderMaterialMaster()

役割

資材マスタ画面を描画する。

処理

- 資材名入力
- 単位選択
- 使用可能作業チェック一覧
- 編集時の値復元

---

toggleMaterialForm()

役割

入力フォーム開閉。

---

renderMaterialList()

役割

資材一覧表示。

表示項目

- 資材名
- 単位
- 使用可能作業
- 編集
- 削除

---

saveMaterial()

役割

資材を保存・更新する。

呼び出す関数

- saveMaterialMaster()
- renderMaterialMaster()

---

editMaterial(index)

役割

編集モード開始。

復元内容

- 資材名
- 単位
- 使用可能作業

---

deleteMaterial(index)

役割

資材削除。

呼び出す関数

- saveMaterialMaster()
- renderMaterialMaster()

---

LocalStorage

saveMaterialMaster()

資材マスタ保存。

---

loadMaterialMaster()

資材マスタ読込。

---

その他

renderWorkCheckList()

役割

資材マスタ画面へ作業一覧チェックボックスを生成する。

---

関数呼び出し関係

田んぼ

showFieldMaster()
→ renderFieldMaster()

renderFieldMaster()
├─ renderFieldList()
└─ toggleFieldForm()

saveField()
├─ saveFieldMaster()
└─ renderFieldMaster()

deleteField()
├─ saveFieldMaster()
└─ renderFieldMaster()

---

作業

showWorkMaster()
→ renderWorkMaster()

renderWorkMaster()
├─ renderWorkList()
└─ toggleWorkForm()

saveWork()
├─ saveWorkMaster()
└─ renderWorkMaster()

deleteWork()
├─ saveWorkMaster()
└─ renderWorkMaster()

---

資材

showMaterialMaster()
→ renderMaterialMaster()

renderMaterialMaster()
├─ renderMaterialList()
└─ renderWorkCheckList()

saveMaterial()
├─ saveMaterialMaster()
└─ renderMaterialMaster()

deleteMaterial()
├─ saveMaterialMaster()
└─ renderMaterialMaster()

---

担当範囲

master.js はマスタ管理のみを担当する。

担当

- 画面表示
- CRUD
- LocalStorage
- 編集モード

担当外

- 作業記録
- 履歴
- 資材入力行
- メニュー画面