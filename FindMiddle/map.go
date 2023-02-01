package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"strings"
)

const clientId string = "d7wxiw8fm8"
const clientSecret string = "sktJ3xHn5Koy2GOCyQkgsRePV4qbRaACxwDTF0SB"

func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello, World!");
}

func main() {
	fmt.Println(FindLocation("경기도 성남시 분당구 정자동 178-1"));
	// http.HandleFunc("/", handler);
	// http.ListenAndServe(":5000", nil);
	fmt.Println("Hello");

}

// 주소를 이용하여 위도, 경도 값 받아오기 (NAVER API 이용)
func FindLocation(address string) (string, error) {
	var tAddress string = strings.TrimSpace(address)
    
	value := url.Values{}
	value.Set("query", tAddress)
	naverMapUrl := &url.URL{
		Scheme:   "https",
		Host:     "naveropenapi.apigw.ntruss.com",
		Path:     "map-geocode/v2/geocode",
		RawQuery: value.Encode(),
	}
	request, err := http.NewRequest("GET", naverMapUrl.String(), nil)
	if err != nil {
		log.Panic(err)
	}

	request.Header.Add("X-NCP-APIGW-API-KEY-ID", clientId)
	request.Header.Add("X-NCP-APIGW-API-KEY", clientSecret)

	client := &http.Client{}
	response, err := client.Do(request)
	if err != nil {
		log.Panic(err)
	}
	defer response.Body.Close()
	if response.StatusCode != 200 { // 요청 실패시
		return "", fmt.Errorf("StatusCode : %d", response.StatusCode)
	}
	bytes, err := ioutil.ReadAll(response.Body)
	str := string(bytes)
	
	x := ""
	y := ""
	coordinate := ""
	strList := strings.Split(str, ",")
	for i := 0; i < len(strList); i++ {
		if len(strList[i]) > 5 && strList[i][:3] == "\"x\"" {
			tmp := strings.Split(strList[i], "\"")
			x = tmp[3]
		} else if len(strList[i]) > 5 && strList[i][:3] == "\"y\"" {
			tmp := strings.Split(strList[i], "\"")
			y = tmp[3]
		}
	}
	coordinate = x + "," + y

	return coordinate, nil
}