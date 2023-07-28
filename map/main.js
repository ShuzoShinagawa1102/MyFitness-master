// get maplist
const maplist = new Array()
const maplistUl = document.getElementById("mapList")
let maplistLi = document.querySelectorAll("#mapList li")

// get map data
const mapCanvas = document.getElementById("map_canvas")
let currentWindow = null
let cnt = 0
const defaultIconUrl = "images/food_available.png"
const currentIconUrl = "images/food_available_big.png"
const defaultScaledSize = new google.maps.Size(30, 30)
const currentScaledSize = new google.maps.Size(40, 40)

// Google Mapsのスタイルを定義
const mapStyles = [
  {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [
          {
              "visibility": "on"
          },
          {
              "color": "#fdfdfd"
          }
      ]
  },
  {
      "featureType": "landscape.man_made",
      "elementType": "geometry",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "poi",
      "elementType": "labels.icon",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "road",
      "elementType": "all",
      "stylers": [
          {
              "color": "#000000"
          }
      ]
  },
  {
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#ffffff"
          }
      ]
  },
  {
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "gamma": 7.18
          }
      ]
  },
  {
      "featureType": "road",
      "elementType": "labels.text",
      "stylers": [
          {
              "visibility": "on"
          },
          {
              "saturation": "-35"
          },
          {
              "lightness": "-95"
          },
          {
              "gamma": "0.00"
          },
          {
              "weight": "0.01"
          }
      ]
  },
  {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [
          {
              "color": "#ffb900"
          }
      ]
  },
  {
      "featureType": "road.local",
      "elementType": "labels.text",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [
          {
              "visibility": "on"
          }
      ]
  },
  {
      "featureType": "transit.line",
      "elementType": "geometry",
      "stylers": [
          {
              "gamma": 0.48
          }
      ]
  },
  {
      "featureType": "transit.station",
      "elementType": "labels.icon",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "transit.station.rail",
      "elementType": "all",
      "stylers": [
          {
              "visibility": "off"
          },
          {
              "color": "#ff0000"
          }
      ]
  },
  {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
          {
              "color": "#4d4946"
          }
      ]
  },
  {
      "featureType": "water",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "visibility": "on"
          },
          {
              "color": "#33435a"
          }
      ]
  },
  {
      "featureType": "water",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "color": "#ffffff"
          }
      ]
  }
];




//　LocationのJSONデータの取得
class GetData {
  async getLocation() {
    try {
      const result = await fetch("location.json")
      const data = await result.json()
      let markers = data.items

      markers = markers.map((item) => {
        const {
          shop_name,
          latitude,
          longitude,
          address,
          id,
          phone,
          category
        } = item.fields
        const image = item.fields.image.fields.file.url
        return { shop_name, latitude, longitude, address, id, phone, image , category}
      })
      return markers
    } catch (error) {
      console.log(error)
    }
  }
}

//　Mapの初期化
async function initMap() {

   // Window サイズに応じて、mapオプションの表示、非表示切り替え
  const myOptionsFunc = () => {
    if(window.innerWidth < 500) {
      console.log(window.innerWidth)
      return {
        zoom: 13,
        disableDefaultUI: true,
        center: new google.maps.LatLng(35.7246, 140.0581),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
      }
    } else {
      return {
        zoom: 14,
        center: new google.maps.LatLng(35.7246, 140.0581),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        // 地図と航空写真を切り替えるボタンを非表示にする
        mapTypeControl: false,
        zoomControl: false, // ズームコントロールを非表示
      }
    }
  }
  const myOptions = myOptionsFunc()
    // Google Mapsのスタイルを設定
    
  myOptions.styles = mapStyles;
  
  const map = new google.maps.Map(
    document.getElementById("map_canvas"),
    myOptions
  )

  // ストリートビューのコントロールを非表示にする
  map.setOptions({ streetViewControl: false });

  const markers = new GetData()

  // marker配列データからマーカーの作成およびli要素の作成
  async function createMarkers() {
    try {
      const items = await markers.getLocation();
      for (const item of items) {
        const id = item.id;
        const name = item.shop_name;
        const latlng = new google.maps.LatLng(item.latitude, item.longitude);
        const address = item.address;
        const phone = item.phone;
        const image = item.image;
        const category = item.category; // 追加: categoryの値を取得
        let icons;
        let defaultIconUrl, currentIconUrl;
        if (category === "localgovernment") {
          defaultIconUrl = "images/food_available.png";
          currentIconUrl = "images/food_available_big.png";
          icons = {
            url: defaultIconUrl,
            scaledSize: currentScaledSize,
          };
        } else {
          defaultIconUrl = "images/supermarket.png";
          currentIconUrl = "images/supermarket_big.png";
          icons = {
            url: defaultIconUrl,
            scaledSize: defaultScaledSize,
          };
        }
        createMarker(name, latlng, icons, map, id, address, phone, image, category);
        // console.log(item.latitude);
        maplistUl.innerHTML += `<li id="li-${id}"><img src=${image} /><div> <h4>${name}</h4> 住所：${address} </div></li>`;
        // maplistUl.innerHTML += `<li id="li-${id}"><iframe src="https://www.google.com/maps/embed/v1/streetview?key=AIzaSyDDiCLXghb5ALx0FvTuHTw40dO2hn5f3_8&location=${item.latitude},${item.longitude}"></iframe><div> <h4>${name}</h4> 住所：${address} </div></li>`;
      }
  
      maplistLi = document.querySelectorAll("#mapList li");
      maplistLi.forEach((listItem, index) => {
        listItem.addEventListener("click", () => {
          google.maps.event.trigger(maplist[index], "click");
        });
      });
    } catch (error) {
      console.log(error);
    }
  }
  
  
  




  createMarkers()
}




// 各マーカーをクリックした際に、対応するli要素を中央にスクロールする関数
function scrollToMapListElement(id) {
  const targetLi = document.getElementById(`li-${id}`);
  if (targetLi) {
    targetLi.scrollIntoView({
      behavior: "smooth", // スクロールアニメーションを有効にするために smooth を指定
      block: "center",    // 要素をスクロールビューの中央に配置
    });
  }
}

//　各マーカーのセット
function createMarker(name, latlng, icons, map, id, address, phone, image, category) { // 追加: categoryを引数に追加
  const infoWindow = new google.maps.InfoWindow();
  let defaultIconUrl, currentIconUrl;
  if (category === "localgovernment") { // カテゴリがlocalgovernmentの場合
    defaultIconUrl = "images/food_available.png";
    currentIconUrl = "images/food_available_big.png";
  } else { // それ以外の場合（supermarket）
    defaultIconUrl = "images/supermarket.png";
    currentIconUrl = "images/supermarket_big.png";
  }

  const marker = new google.maps.Marker({
    position: latlng,
    icon: {
      url: defaultIconUrl,
      scaledSize: icons.scaledSize,
    },
    map: map,
  });



  // liリストをclickしたときに、他のアイコンを初期状態にする。
  google.maps.event.addDomListener(maplistUl, "click", function () {
    marker.setIcon({
      url: defaultIconUrl,
      scaledSize: icons.scaledSize,
    })
  })

  // 新しくマーカーをclickしたときに、他のアイコンを初期状態にする。（※１）
  let flag = false ;

  google.maps.event.addDomListener(mapCanvas, "touchstart", function () {
    flag = true;
    marker.setIcon({
      url: defaultIconUrl,
      scaledSize: icons.scaledSize,
    })
  })

  google.maps.event.addDomListener(mapCanvas, "click", function () {
    if (flag) {
      flag = false;
    } else {
      marker.setIcon({
        url: defaultIconUrl,
        scaledSize: icons.scaledSize,
      })
    }
  })


  //　markerをクリックしたときの処理
  google.maps.event.addListener(marker, "click", function (e) {
    // クリック済みのMakerに対応するliリストのCSS背景を初期化
    maplistLi.forEach((item) => {
      if (item.classList.contains("clicked")) {
        item.classList.remove("clicked")
      }
    })
    //　clickしたマーカーのアイコンを変更する処理（※1の処理の後）
    setTimeout(function () {
      marker.setIcon({
        url: currentIconUrl,
        scaledSize: currentScaledSize,
      })
    }, 10)

    // infowindow の処理
    if (currentWindow) {
      currentWindow.close();
    }
    // ボタンを含むカスタムinfoWindowのcontentを作成
    infoWindow.setContent(`
      <div class="custom-info-window">
        <h3>${name}</h3>
        <p>${address}</p>
        <button id="infoButton" onclick="handleButtonClick(${id}, '${name}', ${latlng.lat()}, ${latlng.lng()}, '${icons.url}', '${address}', '${phone}', '${image}')">詳細 ></button>
      </div>
    `);

    infoWindow.open(map, marker)
    currentWindow = infoWindow

    //markerをクリックした時に地図の中心に
    map.panTo(latlng)

    //　クリックされたMarkerに対応するli要素のcss背景を操作する。
    maplistLi[id - 1].classList.add("clicked")

    // scrollToMapListElement(id);
    
  })
  maplist[cnt++] = marker

  marker.setIcon({
    url: defaultIconUrl,
    scaledSize: icons.scaledSize,
  })
}

// ボタンがクリックされたときの処理
function handleButtonClick(id, name, lat, lng, iconsUrl, address, phone, imageUrl) {
  // shop.htmlに渡すデータをURLパラメータとしてエンコードする
  const queryParams = new URLSearchParams({
    id: id,
    name: name,
    lat: lat,
    lng: lng,
    iconsUrl: iconsUrl,
    address: address,
    phone: phone,
    imageUrl: imageUrl,
  }).toString();

  // shop.htmlに遷移する
  window.location.href = `shop.html?${queryParams}`;
}


google.maps.event.addDomListener(window, "load", initMap)
