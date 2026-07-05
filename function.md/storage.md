storage.js 関数仕様書

Version 3.1

---

概要

LocalStorageへの保存・読込を担当する。

画面描画や編集処理は行わず、データの永続化のみを担当する。

---

田んぼマスタ

saveFieldMaster()

役割

田んぼマスタをLocalStorageへ保存する。

保存キー

fieldMaster

呼び出し元

- saveField()
- deleteField()

---

loadFieldMaster()

役割

LocalStorageから田んぼマスタを読込む。

読込キー

fieldMaster

呼び出し元

- アプリ起動時

---

作業マスタ

saveWorkMaster()

役割

作業マスタをLocalStorageへ保存する。

保存キー

workMaster

呼び出し元

- saveWork()
- deleteWork()

---

loadWorkMaster()

役割

LocalStorageから作業マスタを読込む。

読込キー

workMaster

呼び出し元

- アプリ起動時

---

資材マスタ

saveMaterialMaster()

役割

資材マスタをLocalStorageへ保存する。

保存キー

materialMaster

呼び出し元

- saveMaterial()
- deleteMaterial()

---

loadMaterialMaster()

役割

LocalStorageから資材マスタを読込む。

読込キー

materialMaster

呼び出し元

- アプリ起動時

---

作業記録

saveRecordList()

役割

作業記録一覧をLocalStorageへ保存する。

保存キー

recordList

呼び出し元

- saveRecord()
- deleteRecord()

---

loadRecordList()

役割

LocalStorageから作業記録一覧を読込む。

読込キー

recordList

呼び出し元

- アプリ起動時

---

関数呼び出し関係

アプリ起動

loadFieldMaster()

loadWorkMaster()

loadMaterialMaster()

loadRecordList()

↓

各データをメモリへ展開

---

田んぼ編集

saveField()

↓

saveFieldMaster()

---

作業編集

saveWork()

↓

saveWorkMaster()

---

資材編集

saveMaterial()

↓

saveMaterialMaster()

---

作業記録

saveRecord()

↓

saveRecordList()

deleteRecord()

↓

saveRecordList()

---

担当範囲

storage.js はデータの保存・読込のみを担当する。

担当

- LocalStorage保存
- LocalStorage読込

担当外

- 画面表示
- 編集
- 一覧表示
- 入力チェック
- データ加工