# 3. storage.js

Version 1.0

---

# 3.1 概要

storage.js は Lotus Farm Manager のデータ保存・読込を担当するモジュールである。

LocalStorage への保存・読込を一元管理し、他モジュールは storage.js を通じてデータへアクセスする。

本モジュールは画面表示や業務ロジックを持たず、データの永続化のみを担当する。

---

# 3.2 関数一覧

| No | 関数 | 役割 |
|---:|------|------|
| 1 | saveFieldMaster() | 田んぼマスタ保存 |
| 2 | loadFieldMaster() | 田んぼマスタ読込 |
| 3 | saveWorkMaster() | 作業マスタ保存 |
| 4 | loadWorkMaster() | 作業マスタ読込 |
| 5 | saveMaterialMaster() | 資材マスタ保存 |
| 6 | loadMaterialMaster() | 資材マスタ読込 |
| 7 | saveRecordList() | 作業記録保存 |
| 8 | loadRecordList() | 作業記録読込 |
| 9 | saveFertilizerPlanList() | 施肥設計保存 |
|10 | loadFertilizerPlanList() | 施肥設計読込 |
|11 | exportBackup() | バックアップ出力 |
|12 | importBackup() | バックアップ読込 |
|13 | exportBackupHistory() | バックアップ履歴出力 |

---

# 3.3 田んぼマスタ

## 3.3.1 概要

田んぼマスタの保存および読込を担当する。

### データ責務

管理データ

- fieldMaster

保存先

- LocalStorage

利用機能

- 田んぼマスタ
- 作業記録
- 作業履歴
- 施肥設計

---

## 3.3.2 機能フロー

```
saveFieldMaster()
        │
        ▼
LocalStorage 保存

----------------------------

loadFieldMaster()
        │
        ▼
LocalStorage 読込
        │
        ▼
fieldMaster 更新
```

---

## 3.3.3 saveFieldMaster()

### 目的

田んぼマスタを LocalStorage へ保存する。

### 呼び出し元

- saveField()

### 処理概要

fieldMaster の内容を LocalStorage へ保存する。

---

## 3.3.4 loadFieldMaster()

### 目的

田んぼマスタを LocalStorage から読み込む。

### 呼び出し元

- アプリ初期化

### 処理概要

保存済みの田んぼマスタを読み込み、fieldMaster を初期化する。

---

# 3.4 作業マスタ

## 3.4.1 概要

作業マスタの保存および読込を担当する。

### データ責務

管理データ

- workMaster

保存先

- LocalStorage

利用機能

- 作業マスタ
- 作業記録
- 施肥設計

---

## 3.4.2 機能フロー

```
saveWorkMaster()
        │
        ▼
LocalStorage 保存

----------------------------

loadWorkMaster()
        │
        ▼
LocalStorage 読込
        │
        ▼
workMaster 更新
```

---

## 3.4.3 saveWorkMaster()

### 目的

作業マスタを LocalStorage へ保存する。

### 呼び出し元

- saveWork()

### 処理概要

workMaster の内容を LocalStorage へ保存する。

---

## 3.4.4 loadWorkMaster()

### 目的

作業マスタを LocalStorage から読み込む。

### 呼び出し元

- アプリ初期化

### 処理概要

保存済み作業マスタを読み込み、workMaster を初期化する。

---

# 3.5 資材マスタ

## 3.5.1 概要

資材マスタの保存および読込を担当する。

### データ責務

管理データ

- materialMaster

保存先

- LocalStorage

利用機能

- 資材マスタ
- 作業記録
- 施肥設計

---

## 3.5.2 機能フロー

```
saveMaterialMaster()
        │
        ▼
LocalStorage 保存

----------------------------

loadMaterialMaster()
        │
        ▼
LocalStorage 読込
        │
        ▼
materialMaster 更新
```

---

## 3.5.3 saveMaterialMaster()

### 目的

資材マスタを LocalStorage へ保存する。

### 呼び出し元

- saveMaterial()

### 処理概要

materialMaster の内容を LocalStorage へ保存する。

---

## 3.5.4 loadMaterialMaster()

### 目的

資材マスタを LocalStorage から読み込む。

### 呼び出し元

- アプリ初期化

### 処理概要

保存済み資材マスタを読み込み、materialMaster を初期化する。

---

# 3.6 作業記録

## 3.6.1 概要

作業記録データの保存および読込を担当する。

作業記録は Lotus Farm Manager の中心データであり、作業記録・作業履歴機能から共通利用される。

### データ責務

管理データ

- recordList

保存先

- LocalStorage

利用機能

- 作業記録
- 作業履歴

---

## 3.6.2 機能フロー

```
saveRecordList()
        │
        ▼
LocalStorage 保存

----------------------------

loadRecordList()
        │
        ▼
LocalStorage 読込
        │
        ▼
recordList 更新
```

---

## 3.6.3 saveRecordList()

### 目的

作業記録を LocalStorage へ保存する。

### 呼び出し元

- saveRecord()

### 処理概要

recordList の内容を LocalStorage へ保存する。

---

## 3.6.4 loadRecordList()

### 目的

作業記録を LocalStorage から読み込む。

### 呼び出し元

- アプリ初期化

### 処理概要

保存済み作業記録を読み込み、recordList を初期化する。

---

# 3.7 施肥設計

## 3.7.1 概要

施肥設計データの保存および読込を担当する。

### データ責務

管理データ

- fertilizerPlanList

保存先

- LocalStorage

利用機能

- 施肥設計

---

## 3.7.2 機能フロー

```
saveFertilizerPlanList()
        │
        ▼
LocalStorage 保存

----------------------------

loadFertilizerPlanList()
        │
        ▼
LocalStorage 読込
        │
        ▼
fertilizerPlanList 更新
```

---

## 3.7.3 saveFertilizerPlanList()

### 目的

施肥設計データを LocalStorage へ保存する。

### 呼び出し元

- saveFertilizerPlan()

### 処理概要

fertilizerPlanList の内容を LocalStorage へ保存する。

---

## 3.7.4 loadFertilizerPlanList()

### 目的

施肥設計データを LocalStorage から読み込む。

### 呼び出し元

- アプリ初期化

### 処理概要

保存済み施肥設計データを読み込み、fertilizerPlanList を初期化する。

---

# 3.8 バックアップ

## 3.8.1 概要

Lotus Farm Manager の全データのバックアップおよび復元を担当する。

### データ責務

管理データ

- 全マスタ
- 作業記録
- 施肥設計

保存先

- JSONファイル

利用機能

- バックアップ
- 復元

---

## 3.8.2 機能フロー

```
exportBackup()
        │
        ▼
JSON生成
        │
        ▼
ファイル保存

----------------------------

importBackup()
        │
        ▼
JSON読込
        │
        ▼
各データ更新
        │
        ▼
saveData()
```

---

## 3.8.3 exportBackup()

### 目的

全データを JSON ファイルとして出力する。

---

## 3.8.4 importBackup()

### 目的

JSON ファイルから全データを復元する。

---

## 3.8.5 exportBackupHistory()

### 目的

バックアップ履歴を出力する。

---

# 3.9 共通処理

## 3.9.1 概要

storage.js は Lotus Farm Manager 全体のデータ永続化を担当する。

各データは保存対象ごとに独立した save / load 関数を持ち、画面や業務ロジックから分離して管理する。

---

## 3.9.2 共通ルール

- データ保存は LocalStorage を利用する。
- 保存・読込はデータ種別ごとに関数を分離する。
- save○○() は保存のみを担当する。
- load○○() は読込のみを担当する。
- 業務ロジックは持たず、永続化のみを担当する。
- バックアップは全データを JSON 形式で管理する。