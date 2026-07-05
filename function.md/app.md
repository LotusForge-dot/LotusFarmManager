app.js 関数仕様書

概要

作業記録画面・履歴画面・設定画面の表示、および作業記録の登録・編集・削除を担当する。

---

グローバル変数

app

画面を書き換えるメインコンテナ。

recordList

作業記録一覧。

editingRecordIndex

現在編集中の作業記録番号。

- -1：新規登録
- 0以上：編集

---

画面表示

showRecord()

概要

作業記録画面を表示する。

呼び出される場所

- 起動時
- 「作業記録」メニュー
- saveRecord()

呼び出す関数

- renderFieldOptions()
- renderWorkOptions()
- addMaterialRow()
- renderRecordList()
- setToday()
- loadRecordForEdit()（編集時）

主な処理

- 画面生成
- 保存ボタン表示切替
- 田んぼ一覧表示
- 作業一覧表示
- 資材1行追加
- 作業記録一覧表示
- 今日の日付設定
- 編集データ読込

---

showHistory()

概要

作業履歴画面を表示する。

呼び出される場所

- 「履歴」メニュー

呼び出す関数

- renderHistoryFieldOptions()
- renderHistoryWorkOptions()
- renderHistoryList()
- clearHistorySearch()

主な処理

- 検索UI生成
- プルダウン生成
- イベント登録
- 履歴一覧表示

---

showSettings()

概要

設定画面を表示する。

呼び出される場所

- 「設定」メニュー

呼び出す関数

- showFieldMaster()
- showWorkMaster()
- showMaterialMaster()

---

showFieldMaster()

概要

田んぼマスタ画面へ移動する。

呼び出される場所

- showSettings()

呼び出す関数

- renderFieldMaster()

---

showWorkMaster()

概要

作業マスタ画面へ移動する。

呼び出される場所

- showSettings()

呼び出す関数

- renderWorkMaster()

---

showMaterialMaster()

概要

資材マスタ画面へ移動する。

呼び出される場所

- showSettings()

呼び出す関数

- renderMaterialMaster()

---

プルダウン生成

renderFieldOptions()

概要

田んぼ一覧を作業記録画面へ表示する。

呼び出される場所

- showRecord()

呼び出す関数

- なし

---

renderWorkOptions()

概要

作業一覧を表示する。

呼び出される場所

- showRecord()

呼び出す関数

- なし

---

renderMaterialOptions()

概要

選択中の作業に使用できる資材だけを表示する。

呼び出される場所

- 作業変更イベント
- addMaterialRow()

呼び出す関数

- なし

主な処理

- 作業取得
- 資材絞り込み
- プルダウン更新
- 選択維持
- 単位更新

---

作業記録

saveRecord()

概要

作業記録を保存する。

呼び出される場所

- 保存ボタン

呼び出す関数

- saveRecordList()
- showRecord()

主な処理

- 入力取得
- 資材一覧取得
- 新規登録
- 更新
- LocalStorage保存
- 画面更新

---

renderRecordList()

概要

作業記録一覧を表示する。

呼び出される場所

- showRecord()

呼び出す関数

- なし

主な処理

- 日付降順
- 田んぼ名変換
- 資材一覧表示
- 単位表示

---

履歴

renderHistoryList()

概要

履歴検索結果を表示する。

呼び出される場所

- showHistory()
- 検索条件変更
- clearHistorySearch()
- deleteRecord()

呼び出す関数

- なし

検索条件

- 田んぼ
- 作業
- 開始日
- 終了日

主な処理

- フィルタ
- 日付降順
- 編集ボタン表示
- 削除ボタン表示

---

renderHistoryFieldOptions()

概要

履歴検索用田んぼ一覧生成。

呼び出される場所

- showHistory()

呼び出す関数

- なし

---

renderHistoryWorkOptions()

概要

履歴検索用作業一覧生成。

呼び出される場所

- showHistory()

呼び出す関数

- なし

---

clearHistorySearch()

概要

検索条件を初期化する。

呼び出される場所

- 検索条件クリアボタン

呼び出す関数

- renderHistoryList()

---

編集

editRecord(index)

概要

編集モードへ移行する。

呼び出される場所

- 履歴一覧編集ボタン

呼び出す関数

- showRecord()

---

loadRecordForEdit()

概要

保存済みデータを画面へ復元する。

呼び出される場所

- showRecord()

呼び出す関数

- addMaterialRow()

主な処理

- 日付復元
- 田んぼ復元
- 作業復元
- 資材復元
- 数量復元
- 単位復元
- 備考復元

---

削除

deleteRecord(index)

概要

作業記録を削除する。

呼び出される場所

- 履歴一覧削除ボタン

呼び出す関数

- saveRecordList()
- renderHistoryList()

主な処理

- 確認ダイアログ
- 配列削除
- 保存
- 一覧更新

---

日付

setToday()

概要

今日の日付を入力欄へ設定する。

呼び出される場所

- showRecord()

呼び出す関数

- なし

---

資材入力

addMaterialRow()

概要

資材入力行を追加する。

呼び出される場所

- showRecord()
- loadRecordForEdit()
- 資材追加ボタン

呼び出す関数

- renderMaterialOptions()
- updateMaterialUnit()
- deleteMaterialRow()

主な処理

- HTML生成
- 作業対応資材表示
- 単位更新イベント登録
- 削除ボタン登録

---

deleteMaterialRow(row)

概要

資材入力行を削除する。

呼び出される場所

- addMaterialRow()

呼び出す関数

- なし

制約

- 最後の1行は削除不可。

---

updateMaterialUnit(event)

概要

資材変更時に単位表示を更新する。

呼び出される場所

- addMaterialRow()

呼び出す関数

- なし

主な処理

- 選択資材取得
- マスタ検索
- 単位表示更新