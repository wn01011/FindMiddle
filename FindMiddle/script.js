const mapOptions = {
  center: new naver.maps.LatLng(37.5403622, 127.1258416),
  zoom: 15,
};
const color1 = "rgb(121, 189, 154)";
const color2 = "rgb(252, 145, 58)";
const firstPerson = document.getElementById("firstPerson");
const secondPerson = document.getElementById("secondPerson");
const middlePoint = document.getElementById("middlePoint");
const firstPersonText = firstPerson.getElementsByTagName("p")[0];
const secondPersonText = secondPerson.getElementsByTagName("p")[0];
const map = new naver.maps.Map("map", mapOptions);

const proj = map.getProjection();
firstPerson.style.backgroundColor = `rgba(${parseInt(
  color1.split(",")[0].match(/\d+/g)
)}, ${parseInt(color1.split(",")[1].match(/\d+/g))}, ${parseInt(
  color1.split(",")[2].match(/\d+/g)
)}, 0.9)`;
secondPerson.style.backgroundColor = `rgba(${parseInt(
  color2.split(",")[0].match(/\d+/g)
)}, ${parseInt(color2.split(",")[1].match(/\d+/g))}, ${parseInt(
  color2.split(",")[2].match(/\d+/g)
)}, 0.9)`;

firstPerson.onclick = (e) => {
  map.panTo(marker1.getPosition(), "easeInCubic");
};
secondPerson.onclick = (e) => {
  map.panTo(marker2.getPosition(), "easeInCubic");
};
middlePoint.onclick = (e) => {
  map.panTo(center, "easeInCubic");
};

let marker1 = new naver.maps.Marker({
  position: map.getCenter(),
  map: map,
  clickable: true,
  icon: {
    url: `./metamong-back.png`,
    size: new naver.maps.Size(50, 52),
    origin: new naver.maps.Point(0, 0),
    anchor: new naver.maps.Point(25, 26),
  },
  zIndex: 3,
});
let marker2 = new naver.maps.Marker({
  position: map.getCenter(),
  map: map,
  clickable: true,
  icon: {
    url: `./metamong-front.png`,
    size: new naver.maps.Size(50, 52),
    origin: new naver.maps.Point(0, 0),
    anchor: new naver.maps.Point(25, 26),
  },
  zIndex: 3,
});
let centerMarker = new naver.maps.Marker({
  position: map.getCenter(),
  map: map,
  clickable: false,
  icon: {
    url: `./radar.gif`,
    size: new naver.maps.Size(100, 100),
    origin: new naver.maps.Point(0, 0),
    anchor: new naver.maps.Point(50, 50),
  },
  zIndex: -1,
});

let curItem = [];
let len = 0;
let searchAddressToCoordinate = function (address, idx) {
  naver.maps.Service.geocode({ query: address }, function (status, response) {
    if (status == naver.maps.Service.Status.ERROR) {
      if (!address) return alert("Geocode Error, Please check address");
      if (address.includes(":")) address = address.split(":")[1];
      let address2 = address.split("로")[0] + "로";
      if (address.length > address2.length) {
        console.log(address2);
        return searchAddressToCoordinate(address2, idx);
      } else return alert("Geocode Error, address: " + address);
    }

    if (response.v2.meta.totalCount == 0) {
      let address2 = address.split("로")[0] + "로";
      if (address.length > address2.length) {
        console.log(address2);
        return searchAddressToCoordinate(address2, idx);
      } else return alert("Geocode No Result, address: " + address);
    }
    let item = response.v2.addresses[0];
    let lat = item.y;
    let lng = item.x;
    curItem[idx] = item;
  });
};

let address1;
let address2;
let center = { y: 37.5403622, x: 127.1258416 };
let centerAddress = "";
function setMarkers() {
  searchAddressToCoordinate(address1, 0);
  searchAddressToCoordinate(address2, 1);

  const getItemInterval = setInterval(() => {
    if (curItem[0] != undefined) {
      map.setCenter(curItem[0]);
      marker1.setPosition(curItem[0]);
      clearInterval(getItemInterval);
      const getSecondItemInterval = setInterval(() => {
        if (curItem[1] != undefined) {
          marker2.setPosition(curItem[1]);
          center = {
            x: (+curItem[0].x + +curItem[1].x) / 2,
            y: (+curItem[0].y + +curItem[1].y) / 2,
          };
          centerMarker.setPosition(center);
          map.setCenter(center);
          // 중앙의 위경도 값에 따른 주소값을 불러옴.
          searchAddressFromCoords(center, displayCenterInfo);

          clearInterval(getSecondItemInterval);
          address1 = undefined;
          address2 = undefined;
          curItem[0] = undefined;
          curItem[1] = undefined;
        }
      }, 10);
    }
  }, 10);
}

const adderessView = document.getElementById("addressView");

const kakaoInput = document.getElementById("address_kakao");
const kakaoInput2 = document.getElementById("address_kakao2");

kakaoInput.onkeydown = (e) => {
  if (kakaoInput.value && e.key == "Enter") {
    addressView.style.display = "flex";
    new daum.Postcode({
      oncomplete: function (data) {
        if (kakaoInput.value != data.address)
          kakaoInput.value += " : " + data.address;

        firstPerson.classList.remove("moveFirst");
        secondPerson.classList.remove("moveSecond");
        if (kakaoInput.value && kakaoInput2.value)
          searchBtn.classList.add("active");
      },
      focusInput: false,
    }).open({
      q: kakaoInput.value,
      left: -window.outerWidth / 2 - 250,
      top: window.outerHeight / 2 - 250,
      autoClose: true,
    });
  } else {
    addressView.style.display = "none";
  }
};
kakaoInput2.onkeydown = (e) => {
  if (kakaoInput2.value && e.key == "Enter") {
    addressView.style.display = "flex";
    new daum.Postcode({
      oncomplete: function (data) {
        if (kakaoInput2.value != data.address)
          kakaoInput2.value += " : " + data.address;
        firstPerson.classList.remove("moveFirst");
        secondPerson.classList.remove("moveSecond");
        if (kakaoInput.value && kakaoInput2.value)
          searchBtn.classList.add("active");
      },
      focusInput: false,
    }).open({
      q: kakaoInput2.value,
      left: -window.outerWidth / 2 - 250,
      top: window.outerHeight / 2 - 250,
      autoClose: true,
    });
  } else {
    addressView.style.display = "none";
  }
};

let searchMarkers = [];
let searchInfoWindows = [];

const searchBtn = document.getElementById("searchBtn");
searchBtn.onclick = () => {
  address1 = kakaoInput.value.split(":")[1];
  address2 = kakaoInput2.value.split(":")[1];
  if (!address1) address1 = kakaoInput.value.split(":")[0];
  if (!address2) address2 = kakaoInput.value.split(":")[0];

  firstPerson.classList.add("moveFirst");
  secondPerson.classList.add("moveSecond");
  if (address1 && address2) {
    setMarkers();
    searchBtn.classList.remove("active");
  } else return;
};

const ps = new kakao.maps.services.Places();
const infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

function searchPlace(address, keyword = "") {
  let searchStr = address + keyword;
  ps.keywordSearch(searchStr, placesSearchCB);
}

function placesSearchCB(data, status, pagination) {
  if (status === kakao.maps.services.Status.OK) {
    for (let i = 0; i < data.length; ++i) {
      let phoneData = "";
      if (data[i].phone) phoneData = `폰 번호 : ${data[i].phone}<br />`;

      if (searchMarkers.length >= 15) {
        let curPos = { x: data[i].x, y: data[i].y };
        searchMarkers[i].setPosition(curPos);
        searchInfoWindows[i].setPosition(curPos);
        searchInfoWindows[i].setContent(
          `<div style="text-align:center;padding:10px;line-height:1rem;">장소 : ${data[i].place_name}<br />${phoneData}카테고리 : ${data[i].category_name}</div>`
        );
      } else {
        let curMarker = new naver.maps.Marker({
          position: { x: data[i].x, y: data[i].y },
          map: map,
          clickable: true,
        });
        naver.maps.Event.addListener(curMarker, "click", getClickHandler(i));
        searchMarkers.push(curMarker);

        let curInfoWindow = new naver.maps.InfoWindow({
          content: `<div style="text-align:center;padding:10px;line-height:1rem;">장소 : ${data[i].place_name}<br />${phoneData}카테고리 : ${data[i].category_name}</div>`,
          backgroundColor: `rgba(255, 255, 255, 0.6)`,
          anchorColor: `rgba(255, 255, 255, 0.6)`,
          borderWidth: 3,
          borderColor: "black",
          borderRadius: 30,
        });
        searchInfoWindows.push(curInfoWindow);
        naver.maps.Event.addListener(map, "idle", function () {
          updateMarkers(map, searchMarkers);
        });
      }
    }
    map.panTo(searchMarkers[0].getPosition(), "easeInCubic");
    searchInfoWindows[0].open(map, searchMarkers[0]);
    sendAxiosRequest(
      marker1.position.x,
      marker1.position.y,
      data[0].x,
      data[0].y,
      0,
      marker2.position.x,
      marker2.position.y
    );
  } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
    alert("검색 결과가 존재하지 않습니다.");
    return;
  } else if (status === kakao.maps.services.Status.ERROR) {
    alert("검색 결과 중 오류가 발생했습니다.");
    return;
  }
}

function updateMarkers(map, markers) {
  let mapBounds = map.getBounds();
  let marker, position;
  for (let i = 0; i < markers.length; ++i) {
    marker = markers[i];
    position = marker.getPosition();

    if (mapBounds.hasLatLng(position)) showMarker(map, marker);
    else hideMarker(map, marker);
  }
}

function showMarker(map, marker) {
  if (marker.setMap()) return;
  marker.setMap(map);
}

function hideMarker(map, marker) {
  if (!marker.setMap()) return;
  marker.setMap(null);
}

function getClickHandler(seq) {
  return function (e) {
    let marker = searchMarkers[seq];
    let infoWindow = searchInfoWindows[seq];

    if (infoWindow.getMap()) {
      infoWindow.close();
    } else {
      map.panTo(marker.getPosition(), "easeInCubic");
      console.log(marker);
      sendAxiosRequest(
        marker1.position.x,
        marker1.position.y,
        marker.position.x,
        marker.position.y,
        0,
        marker2.position.x,
        marker2.position.y
      );
      infoWindow.open(map, marker);
    }
  };
}

const geocoder = new kakao.maps.services.Geocoder();

function searchAddressFromCoords(coords, callback) {
  geocoder.coord2RegionCode(coords.x, coords.y, callback);
}

function displayCenterInfo(result, status) {
  if (status === kakao.maps.services.Status.OK) {
    const infoDiv = document.getElementById("centerAddress");
    for (let i = 0; i < result.length; ++i) {
      if (result[i].region_type === "H") {
        infoDiv.innerHTML = result[i].address_name;
        searchPlace(result[i].address_name, "");
        break;
      }
    }
  } else alert("위경도로 주소에 접근할 수 없어");
}

let curData;
let curData2;
let lineCoords = [];
let lineCoords2 = [];
let polyLines = [];

function sendAxiosRequest(
  _startX = 127.135000768,
  _startY = 37.547504463683,
  _endX = 127.03278576199,
  _endY = 37.491810114094,
  index = 0,
  _start2X,
  _start2Y
) {
  const options = {
    method: "POST",
    url: "https://apis.openapi.sk.com/tmap/routes",
    params: { version: "1", callback: "function" },
    headers: {
      accept: "application/json",
      appKey: "l7xxbbd9d1540e37447ba7a28a071bddb75c",
    },
    data: {
      startX: _startX,
      startY: _startY,
      angle: 20,
      speed: 30,
      endPoiId: "10001",
      endX: _endX,
      endY: _endY,
      reqCoordType: "WGS84GEO",
      startName: "%EC%B6%9C%EB%B0%9C",
      endName: "%EB%8F%84%EC%B0%A9",
      searchOption: "0",
      resCoordType: "WGS84GEO",
      sort: "index",
    },
  };
  const options2 = {
    method: "POST",
    url: "https://apis.openapi.sk.com/tmap/routes",
    params: { version: "1", callback: "function" },
    headers: {
      accept: "application/json",
      appKey: "l7xxbbd9d1540e37447ba7a28a071bddb75c",
    },
    data: {
      startX: _start2X,
      startY: _start2Y,
      angle: 20,
      speed: 30,
      endPoiId: "10001",
      endX: _endX,
      endY: _endY,
      reqCoordType: "WGS84GEO",
      startName: "%EC%B6%9C%EB%B0%9C",
      endName: "%EB%8F%84%EC%B0%A9",
      searchOption: "0",
      resCoordType: "WGS84GEO",
      sort: "index",
    },
  };

  let axios1 = axios
    .request(options)
    .then(function (response) {
      curData = response.data;
    })
    .catch(function (error) {
      console.error(error);
    });
  let axios2 = axios
    .request(options2)
    .then(function (response) {
      curData2 = response.data;
    })
    .catch(function (error) {
      console.error(error);
    });

  // waiting for curData

  const waitDataId = setInterval(() => {
    if (curData) {
      let hourStr = "";
      if (parseInt(curData.features[0].properties.totalTime / 3600) != 0)
        hourStr =
          parseInt(curData.features[0].properties.totalTime / 3600).toString() +
          " 시간";
      if (window.innerWidth <= 822) {
        firstPersonText.innerHTML = `${
          parseInt(curData.features[0].properties.totalDistance / 10) / 100
        }km<br />${hourStr} ${
          Math.round(
            parseInt(curData.features[0].properties.totalTime % 3600) / 60
          ) + "분"
        }`;
      } else {
        firstPersonText.innerHTML = `가야할 거리 : ${
          parseInt(curData.features[0].properties.totalDistance / 10) / 100
        }km<br />남은 시간 : ${hourStr} ${
          Math.round(
            parseInt(curData.features[0].properties.totalTime % 3600) / 60
          ) + "분"
        }`;
      }

      if (lineCoords.length) lineCoords = [];
      for (let i = 0; i < curData.features.length; ++i) {
        const curGeom = curData.features[i].geometry;
        if (!isNaN(curGeom.coordinates[0])) {
          lineCoords.push({
            x: curGeom.coordinates[0],
            y: curGeom.coordinates[1],
          });
        } else {
          for (let j = 0; j < curData.features.length; ++j) {
            if (curGeom.coordinates[j]) {
              lineCoords.push({
                x: curGeom.coordinates[j][0],
                y: curGeom.coordinates[j][1],
              });
            }
          }
        }
      }
      curData = undefined;
      if (index == 0) {
        if (polyLines[0]) {
          polyLines[0].setOptions({
            path: lineCoords,
            strokeColor: color1,
          });
        } else {
          let polyline = new naver.maps.Polyline({
            path: lineCoords,
            strokeColor: color1,
            strokeOpacity: 0.8,
            strokeWeight: 6,
            strokeLineJoin: "miter",
            map: map,
          });
          polyLines[0] = polyline;
        }
      }
      curData = undefined;
    }
  }, 100);

  const waitDataId2 = setInterval(() => {
    if (curData2) {
      let hourStr = "";
      if (parseInt(curData2.features[0].properties.totalTime / 3600) != 0)
        hourStr =
          parseInt(
            curData2.features[0].properties.totalTime / 3600
          ).toString() + " 시간";
      if (window.innerWidth <= 822) {
        secondPersonText.innerHTML = `${
          parseInt(curData2.features[0].properties.totalDistance / 10) / 100
        }km<br />${hourStr} ${
          Math.round(
            parseInt(curData2.features[0].properties.totalTime % 3600) / 60
          ) + "분"
        }`;
      } else {
        secondPersonText.innerHTML = `가야할 거리 : ${
          parseInt(curData2.features[0].properties.totalDistance / 10) / 100
        }km<br />남은 시간 : ${hourStr} ${
          Math.round(
            parseInt(curData2.features[0].properties.totalTime % 3600) / 60
          ) + "분"
        }`;
      }

      if (lineCoords2.length) lineCoords2 = [];
      for (let i = 0; i < curData2.features.length; ++i) {
        const curGeom = curData2.features[i].geometry;
        if (!isNaN(curGeom.coordinates[0])) {
          lineCoords2.push({
            x: curGeom.coordinates[0],
            y: curGeom.coordinates[1],
          });
        } else {
          for (let j = 0; j < curData2.features.length; ++j) {
            if (curGeom.coordinates[j]) {
              lineCoords2.push({
                x: curGeom.coordinates[j][0],
                y: curGeom.coordinates[j][1],
              });
            }
          }
        }
      }
      curData2 = undefined;
      if (index == 0) {
        if (polyLines[1]) {
          polyLines[1].setOptions({
            path: lineCoords2,
            strokeColor: color2,
          });
        } else {
          let polyline = new naver.maps.Polyline({
            path: lineCoords2,
            strokeColor: color2,
            strokeOpacity: 0.8,
            strokeWeight: 6,
            map: map,
          });
          polyLines[1] = polyline;
        }
      }
      curData2 = undefined;
    }
  }, 100);
}
