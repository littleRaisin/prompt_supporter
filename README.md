# Prompt Supporter

Prompt Supporterは、画像生成におけるプロンプト管理を効率化するために開発されたツールです。

特に、DanbooruタグをキーワードとするCheckpointを使用する際、正確なプロンプト入力は生成画像の品質に直結します。しかし、日本語と英語の対訳が直感的でない場合や、特定の版権名に関連するキーワードの管理は煩雑になりがちです。

本ツールは以下の機能を提供します。

- Danbooruタグの対訳や、版権名、キャラクターに沿った衣装セットなどのキーワードを登録・検索できます。
- 自身で設定した任意のキーワード（例: 「ツンデレ」）からも検索が可能で、柔軟にプロンプト検索が可能です。
- 登録したプロンプトやメモを簡単にコピーできます。
- ComfyUI上に膨大なメモを残す必要がなくなります。

本ツールは個人的な利用を目的として開発されており、基本的に改善要求にはお応えできません。また、本ソフトウェアの利用により発生したいかなる損害についても、開発者は一切の責任を負いません。自己責任においてご使用ください。

# 開発環境
Electron + Vite + React + TypeScript + TailwindCSS + SQLite

## 開発手順

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
    ビルドされたアプリケーションをプレビューモードで起動します。
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
