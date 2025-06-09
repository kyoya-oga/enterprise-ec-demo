import type { Product } from '@/features/products/types'

export const mockProducts: Product[] = [
  {
    id: 1,
    name: 'プレミアムワイヤレスヘッドフォン',
    description: '最高品質のノイズキャンセリング機能を搭載したワイヤレスヘッドフォン。長時間の使用でも快適な装着感を実現。',
    price: 29800,
    image: '/images/placeholder.jpg',
    category: 'オーディオ',
    stock: 15,
    rating: 4.8,
    reviews: 124
  },
  {
    id: 2,
    name: 'スマートウォッチ Pro',
    description: '健康管理とフィットネス追跡に最適な多機能スマートウォッチ。GPS内蔵で屋外活動にも対応。',
    price: 45000,
    image: '/images/placeholder.jpg',
    category: 'ウェアラブル',
    stock: 8,
    rating: 4.6,
    reviews: 89
  },
  {
    id: 3,
    name: '完全ワイヤレスイヤホン',
    description: '高音質とクリアな通話品質を実現した完全ワイヤレスイヤホン。防水設計でスポーツにも最適。',
    price: 18000,
    image: '/images/placeholder.jpg',
    category: 'オーディオ',
    stock: 32,
    rating: 4.5,
    reviews: 67
  },
  {
    id: 4,
    name: 'ポータブルBluetoothスピーカー',
    description: 'コンパクトながらパワフルなサウンドを提供するポータブルスピーカー。アウトドアでも活躍。',
    price: 12000,
    image: '/images/placeholder.jpg',
    category: 'オーディオ',
    stock: 25,
    rating: 4.3,
    reviews: 156
  },
  {
    id: 5,
    name: '4K Webカメラ',
    description: '超高画質4K解像度でのビデオ通話やライブ配信に最適なWebカメラ。自動フォーカス機能付き。',
    price: 22000,
    image: '/images/placeholder.jpg',
    category: 'PC周辺機器',
    stock: 12,
    rating: 4.7,
    reviews: 43
  },
  {
    id: 6,
    name: 'ゲーミングキーボード',
    description: 'メカニカルスイッチ採用のゲーミングキーボード。RGB LEDバックライト搭載でカスタマイズ可能。',
    price: 16500,
    image: '/images/placeholder.jpg',
    category: 'PC周辺機器',
    stock: 18,
    rating: 4.4,
    reviews: 92
  },
  {
    id: 7,
    name: 'ワイヤレスマウス Pro',
    description: '高精度センサーを搭載したワイヤレスマウス。長時間のバッテリー持続時間を実現。',
    price: 8900,
    image: '/images/placeholder.jpg',
    category: 'PC周辺機器',
    stock: 40,
    rating: 4.2,
    reviews: 78
  },
  {
    id: 8,
    name: 'モバイルバッテリー 20000mAh',
    description: '大容量20000mAhのモバイルバッテリー。急速充電対応で複数デバイスを同時充電可能。',
    price: 6800,
    image: '/images/placeholder.jpg',
    category: 'アクセサリー',
    stock: 60,
    rating: 4.1,
    reviews: 134
  },
  {
    id: 9,
    name: 'USB-C ハブ 7in1',
    description: '7つのポートを搭載したUSB-Cハブ。4K HDMI出力、USB 3.0、SD カードリーダーなど多機能。',
    price: 9500,
    image: '/images/placeholder.jpg',
    category: 'アクセサリー',
    stock: 28,
    rating: 4.3,
    reviews: 61
  },
  {
    id: 10,
    name: 'スマートフォンスタンド',
    description: '角度調整可能なアルミニウム製スマートフォンスタンド。動画視聴やビデオ通話に最適。',
    price: 3200,
    image: '/images/placeholder.jpg',
    category: 'アクセサリー',
    stock: 85,
    rating: 4.0,
    reviews: 203
  },
  {
    id: 11,
    name: 'ノートパソコンスタンド',
    description: '放熱性に優れたアルミニウム製ノートパソコンスタンド。角度調整可能で姿勢改善に効果的。',
    price: 7400,
    image: '/images/placeholder.jpg',
    category: 'アクセサリー',
    stock: 22,
    rating: 4.5,
    reviews: 87
  },
  {
    id: 12,
    name: 'タブレット用キーボードケース',
    description: 'タブレットをノートパソコンのように使用できるキーボード付きケース。タッチパッド搭載。',
    price: 11800,
    image: '/images/placeholder.jpg',
    category: 'アクセサリー',
    stock: 16,
    rating: 4.2,
    reviews: 54
  }
]

export const categories = [
  'オーディオ',
  'ウェアラブル', 
  'PC周辺機器',
  'アクセサリー'
]