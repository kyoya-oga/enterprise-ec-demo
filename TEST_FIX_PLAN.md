# テスト修正計画

現在 `npm test` 実行時に複数のユニットテストが失敗しています。主な問題は以下の通りです。

- `src/lib/auth/jwt.test.ts` で JWT 生成関数が失敗し、`Token generation error` が発生
- `src/lib/auth/cookies.test.ts` で `generateCSRFToken` のフォールバックロジックが想定通り動作しない
- `/api/login` の API ルートテストが 500 エラーを返す

次回以降の対応として下記を予定しています。

1. **JWT 生成処理の確認**
   - `jose` ライブラリの利用方法を再確認し、テスト用の `JWT_SECRET` を適切に設定する
   - エラーハンドリングを見直し、テストで期待されるトークンを生成できるよう調整する
2. **CSRF トークン生成のフォールバック改善**
   - `global.require` を参照するよう修正したため、次回テストで挙動を確認する
   - それでも失敗する場合は、`vi.dynamicImport` を利用してモックする案を検討
3. **ログイン API テストの 500 エラー調査**
   - モックユーザーとセッション生成ロジックを見直し、JWT 生成エラーとの関連を調べる
   - 必要に応じて `createTokenPair` のモックを追加

これらの修正により、残っているテスト失敗を解消する予定です。

## 追加調査結果と次回方針

上記対応を試みたものの、`jose` 利用箇所で `payload must be an instance of Uint8Array` という例外が発生し、JWT 生成に失敗することが判明しました。jsdom 環境では WebCrypto API の `subtle` 実装が存在せず、この影響で `jose` が正しく動作していない可能性があります。

次回は以下を試行します。

1. **テストセットアップで WebCrypto を polyfill**
   - `tests/setup.ts` に `globalThis.crypto ||= require('crypto').webcrypto` を追加し、`subtle` を提供する。
   - これで `jose` の内部実装が WebCrypto を利用できるか確認する。
2. **環境変数の読み取りタイミングの見直し**
   - モジュール読み込み時に `process.env` から値をキャッシュしているため、テスト中に環境変数を変更しても反映されない。テストで秘密鍵を変更する必要がある箇所は、関数実行時に `process.env` を参照するようリファクタリングする。
3. **上記でも解決しない場合の代替案**
   - `jsonwebtoken` など別の JWT ライブラリへの置き換えを検討する。

まずは polyfill と環境変数読み取りの修正を優先し、テストが通るか確認する予定です。
