# そらとおと

**そらとおと** は、天気、時刻、位置情報に応じて音楽と映像が変化する癒し系の環境アプリです。Lofi-girl のようなアニメーションと共に、集中やリラックスなどのムードに合わせた音楽体験を提供します。

## 特徴

- 天気・時刻・位置情報に連動した音楽と背景映像
- おしゃれなロード画面
- ジャンル別に楽曲生成
- 曲のお気に入り登録・保存（アプリ内）
- 背景画像/アニメーション

## 使用技術

### フロントエンド
- **React**

### バックエンド
- **Node.js**
- **Firebase Authentication**
- **Firebase Firestore**（お気に入り管理など）

### API
- [OpenWeather API](https://openweathermap.org/api)（天気情報）
- [Suno AI (via GoAPI)](https://goapi.ai/suno-api)（音楽生成）

## 主な機能

| 機能名             | 内容                                                                 |
|------------------|----------------------------------------------------------------------|
| ロード画面         | シンプルでおしゃれなアニメーション表示                                      |
| 環境連動           | 現在の天気・時刻・位置に応じて楽曲/背景映像を自動生成                             |
| 曲のお気に入り保存   | Firebase に保存、再度アクセス時に表示可能                                       |
| 楽曲ジャンル選択     | Lofi、Ambient、Chillhop、Jazz などから選択                                          |
| アニメーション背景   | Midjourneyなどで生成した画像を用いて動きのある背景を実装予定             |
| 楽曲生成           | GoAPI 経由でSunoの楽曲生成AIを利用し、ジャンル・ムード・天気に応じて自動生成               |

## 将来的な拡張性

- **Apple Watch** との連携：心拍数を取り入れたムード推定
- **SNS連携**：友人と気分やお気に入りをシェア

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

ターミナルで npm install next を実行してから...

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```
In .env.local, insert your API key for OpenWeather.
```bash
WEATHER_API_KEY=your_openweathermap_api_key
```
In .env.local, insert your API key for GoAPI.
```bash
GO_API_KEY=your_openweathermap_api_key
```
Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

