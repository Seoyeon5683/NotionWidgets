let map;
const markers = [];

window.onload = function () {
    map = new naver.maps.Map("map", {
        center: new naver.maps.LatLng(37.5665, 126.978),
        zoom: 12,
    });
    loadMarkers();
};

function showPopup() {
    document.getElementById("popup").style.display = "block";
}

function addMarkerAndClose() {
    const title = document.getElementById("title").value;
    const lat = parseFloat(document.getElementById("lat").value);
    const lng = parseFloat(document.getElementById("lng").value);
    const desc = document.getElementById("desc").value;

    if (!title || isNaN(lat) || isNaN(lng)) {
        alert("제목과 위치 정보를 확인해주세요.");
        return;
    }

    const markerData = { title, lat, lng, desc };

  // 기존 데이터 불러오기
    fetch("markers.json")
        .then((response) => response.json())
        .then((data) => {
            data.push(markerData);
            // 마커 추가
            const position = new naver.maps.LatLng(lat, lng);
            const marker = new naver.maps.Marker({ position, map, title });
            const infoWindow = new naver.maps.InfoWindow({
                content: `<div style='padding:10px'><strong>${title}</strong><br>${desc}</div>`,
            });
            naver.maps.Event.addListener(marker, "click", () => {
                infoWindow.open(map, marker);
            });
            markers.push(marker);
        // 저장용 JSON 생성
            const blob = new Blob([JSON.stringify(data, null, 2)], {
                type: "application/json",
            });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = "markers.json";
            link.click();
            document.getElementById("popup").style.display = "none";
            document.getElementById("title").value = "";
            document.getElementById("address").value = "";
            document.getElementById("lat").value = "";
            document.getElementById("lng").value = "";
            document.getElementById("desc").value = "";
        });
}

function loadMarkers() {
    fetch("markers.json")
        .then((response) => response.json())
        .then((data) => {
            data.forEach(({ title, lat, lng, desc }) => {
                const position = new naver.maps.LatLng(
                    parseFloat(lat),
                    parseFloat(lng)
                );
                const marker = new naver.maps.Marker({ position, map, title });
                const infoWindow = new naver.maps.InfoWindow({
                    content: `<div style='padding:10px'><strong>${title}</strong><br>${desc}</div>`,
                });
                naver.maps.Event.addListener(marker, "click", () => {
                    infoWindow.open(map, marker);
                });
                markers.push(marker);
            });
        });
}

function lookupAddress() {
    const address = document.getElementById("address").value;
    if (!address) return;

    axios
        .get("https://maps.apigw.ntruss.com/map-geocode/v2/geocode", {
            params: { query: address },
            headers: {
                "X-NCP-APIGW-API-KEY-ID": "%NAVERMAPID%",
                "X-NCP-APIGW-API-KEY": "%NAVERMAPKEY%",
            },
        })
        .then((res) => {
            const data = res.data.addresses[0];
            if (data) {
                document.getElementById("lat").value = data.y;
                document.getElementById("lng").value = data.x;
            } else {
                alert("주소를 찾을 수 없습니다.");
            }
        })
        .catch((err) => {
            console.error(err);
            alert("주소 조회 중 오류가 발생했습니다.");
        });
}
