const fetch = require("node-fetch");
const apiKey = "AIzaSyBXyvizWEhXxMtVxJlo7be8d6E4FXDOILM"; // 実際のAPIキーに置き換える
const searchEngineId = "a396bea8ab302431b";  // 実際の検索エンジンIDに置き換える


async function searchImages(query) {
  const apiUrl = `https://www.googleapis.com/customsearch/v1?q=${query}&key=${apiKey}&cx=${searchEngineId}&searchType=image`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      return data.items[0].link; // 検索結果の最初の画像のURLを返す
    } else {
      return null; // 画像が見つからなかった場合はnullを返す
    }
  } catch (error) {
    console.error("画像の検索中にエラーが発生しました:", error);
    return null;
  }
}
async function downloadImage(url, filename) {
  try {
    await new Promise((resolve, reject) => {
      const command = `wget -O "${filename}" "${url}"`;
      exec(command, (error, stdout, stderr) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });

    console.log(`${filename}のダウンロードが完了しました。`);
  } catch (error) {
    console.error("画像のダウンロード中にエラーが発生しました:", error);
  }
}

async function searchAndDownloadImages(shops) {
  for (const shop of shops) {
    try {
      const searchQuery = `${shop} ロゴ`; // 店舗名に「ロゴ」と付けて検索する例
      const imageUrl = await searchImages(searchQuery);

      if (imageUrl) {
        const filename = `${shop}.png`; // 保存する画像ファイルの名前を指定
        await downloadImage(imageUrl, filename);
      } else {
        console.log(`${shop}の画像が見つかりませんでした。`);
      }
    } catch (error) {
      console.error(`${shop}の画像の取得中にエラーが発生しました:`, error);
    }
  }
}

// 検索する店舗名のリスト
const shops = [

  "西友新北習志野店",
  "西友北習志野店",
  "マルエツ習志野店",
  "ビッグ・エー船橋習志野台店",
  "渡辺ストアー",
  "ヨークマート習志野台店",
  "イオン高根木戸店",
  "新鮮館魚次　習志野台６丁目店",
  "西友薬円台店",
  "ビッグ・エー船橋高根台店",
  "マックスバリュ習志野台店",
  "ミニコープ松が丘店",
  "コープ薬円台店",
  "リブレ京成高根台店",
  "エコ・ピア本部事務所",
  "フードスクエアカスミ高根台店",
  "マルエツ高根台店",
  "ビッグ・エー船橋松が丘店",
  "マミーマート船橋日大前店",
  "新鮮市場マルエイ薬円台店",
  "ビッグ・エー船橋田喜野井店",
  "ミニコープ芝山店",
  "マミーマート飯山満駅前店",
  "株式会社ロピア　ゆめまち習志野台モール店",
  "リブレ京成高根グリーンハイツ店",
  "マルエツ金杉店",
  "トップマート津田沼店",
  "ヤオコー八千代緑が丘店",
  "マルエツ東習志野店",
  "ワイズマート飯山満店",
  "ベルク八千代緑が丘店",
  "イオン八千代緑が丘店",
  "リブレ京成アルビス前原店",
  "まちの駅",
  "タイヨー八千代店",
  "ヤオコー船橋三山店",
  "メガセンタートライアル八千代店",
  "有限会社大野ストアー",
  "ヤオコー船橋三咲店",
  "オーケー八千代緑が丘店",
  "マックスバリュ東習志野店",
  "マルエツ船橋三山店",
  "ビッグ・エー習志野大久保店",
  "リブレ京成三咲店",
  "フレッシュワンたくぼ",
  "フードスクエアカスミ東習志野店",
  "イオン津田沼ショッピングセンター",
  "イオン津田沼店",
  "マルエツ大久保駅前店",
  "イトーヨーカドー津田沼店",
  "河内屋　津田沼店",
  "アコレ　本大久保１丁目店",
  "船橋中学校",
  "湊中学校",
  "宮本中学校",
  "若松中学校",
  "海神中学校",
  "葛飾中学校",
  "行田中学校",
  "法田中学校",
  "旭中学校",
  "御滝中学校",
  "高根中学校",
  "八木が谷中学校",
  "前原中学校",
  "二宮中学校",
  "飯山満中学校",
  "芝山中学校",
  "七林中学校",
  "三田中学校",
  "三山中学校",
  "高根台中学校",
  "習志野台中学校",
  "古和釜中学校",
  "坪井中学校",
  "大穴中学校",
  "豊富中学校",
  "小室中学校"
];

// 全ての店舗の画像を検索してダウンロードする
searchAndDownloadImages(shops);
