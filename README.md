[English README](README_EN.md)

# Prompt Supporter

Prompt Supporterは、画像生成におけるプロンプト管理を効率化するためのツールです。

特に、DanbooruタグをキーワードとするStable Diffusion系のモデル（IL/NAIなど）を使用する際や、LoRA利用時にトリガーワードを選別する際に、正確なプロンプト入力は生成画像の品質に大きく影響します。しかし、日本語と英語の対訳が直感的でない場合や、特定の版権名に関連するキーワードの管理、キャラクターに紐づいたDanbooruタグの検索・管理は煩雑になりがちです。

本ツールは、以下のような課題を軽減するために役立ちます。

- Danbooruタグの対訳や、版権名、キャラクターに沿った衣装セットなどのキーワードを**手動で**登録・検索できます。
- 自身で設定した任意のキーワード（例: `twintails`などメモに記載したタグ名や、検索ワードに記載した日本語での作品名など）からも検索が可能となっており、柔軟なプロンプト検索を提供します。
  - これにより、ツインテールのキャラクターを抽出したり、同じ作品に登場するキャラクターを検索することが可能になります。
- 登録したタグ名、メモなどを簡単にコピーできます。

本ツールは、ComfyUI上に膨大なメモを残したり、専用のUIを構築する必要をなくし、情報整理を外部に任せたいという個人的な欲求を満たすために開発されています。

## 注意点

**本ツールはデータ管理にSQLiteを使用しています。登録件数が肥大化すると、パフォーマンスが劣化する可能性があります。**

## 開発環境

本ツールはWindows 11環境での開発・動作確認を行っています。その他のOSでの動作は未確認です。

- Electron
- Vite
- React
- TypeScript
- TailwindCSS
- SQLite

### ディレクトリ構成

-   `src/electron/`: Electronのメインプロセスとプリロードスクリプト関連のコード
-   `src/ui/`: ReactアプリケーションのUI関連のコード
-   `src/db/`: SQLiteデータベース関連のコード
-   `src/i18n/`: 国際化（i18n）関連のコード
-   `src/types/`: TypeScriptの型定義ファイル
-   `src/stories/`: Storybookのストーリーファイル
-   `public/`: 静的ファイル

## 開発手順

### 前提条件

-   Node.js (v18以上)
-   npm (Node.jsに同梱)
-   volta (推奨): Node.jsのバージョン管理ツール。プロジェクトで指定されたNode.jsバージョンを自動で使用します。

### インストール方法

1.  **Node.jsとnpmのインストール**:
    プロジェクトはNode.jsとnpmを使用しています。Node.jsのバージョン管理には`volta`の使用を推奨します。`volta`をインストールしていれば、プロジェクトの`package.json`に定義されているNode.jsのバージョンが自動的に適用されます。

    `volta`のインストール方法については、[Voltaの公式ドキュメント](https://docs.volta.sh/guide/getting-started)を参照してください。

2.  **依存関係のインストール**:
    プロジェクトのルートディレクトリで以下のコマンドを実行し、必要な依存関係をインストールします。

    ```bash
    npm install
    ```

    **OSごとの注意点**:
    -   **Windows/macOS/Linux**: `better-sqlite3`のようなネイティブモジュールを使用しているため、`npm install`の後に`electron-rebuild`の実行が必要になる場合があります。
        ```bash
        npm run rebuild
        ```
        このコマンドは、Electronのバージョンに合わせてネイティブモジュールを再ビルドします。

### コマンド

プロジェクトのルートディレクトリで以下のコマンドを実行できます。

-   **開発モードで起動**:
    開発中にアプリケーションを起動します。変更が自動的にリロードされます。
    ```bash
    npm run dev
    ```

-   **プレビューモードで起動**:
    ビルドされたアプリケーションをプレビューモードで起動します。変更が自動的にリロードされます。
    ```bash
    npm run preview
    ```

-   **テストの実行**:
    ユニットテストを実行します。
    ```bash
    npm test
    ```
    UI付きでテストを実行する場合は以下を使用します。
    ```bash
    npm run test:ui
    ```

### ビルド方法

アプリケーションを配布可能な形式でビルドするには、以下のコマンドを実行します。

```bash
npm run build
```

このコマンドは、`electron-forge make`を実行し、お使いのOSに応じた実行可能ファイル（例: Windowsでは`.exe`、macOSでは`.dmg`や`.app`、Linuxでは`.deb`や`.rpm`）を生成します。

**OSごとの出力パス**:
ビルドされたファイルは通常、`out/`ディレクトリ内に生成されます。
-   **Windows**: `out/make/squirrel.windows/` または `out/make/zip/win32/`
-   **macOS**: `out/make/zip/darwin/` または `out/make/dmg/`
-   **Linux**: `out/make/deb/` または `out/make/rpm/`
