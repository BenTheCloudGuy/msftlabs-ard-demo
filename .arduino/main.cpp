#include <WiFiS3.h>
#include <HTTPClient.h>

const char* ssid = "TheMitchellFamily";
const char* password = "TMFAESSECURITY";
const char* signalrUrl = "https://msftlabs-ard-sigr.service.signalr.net;AccessKey=FymRIatXTogEBH5Fpnh9YF4WDUe5h2fY9OUbxOIyLvIMxvaFXXPvJQQJ99BFAC1i4TkXJ3w3AAAAASRSZPCo;Version=1.0;";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(signalrUrl);
    http.addHeader("Content-Type", "application/json");

    String payload = "{\"ip\":\"" + WiFi.localIP().toString() + "\",\"timestamp\":\"" + String(millis()) + "\"}";
    int httpResponseCode = http.POST(payload);

    if (httpResponseCode > 0) {
      String response = http.getString();
      Serial.println(httpResponseCode);
      Serial.println(response);
    } else {
      Serial.print("Error on sending POST: ");
      Serial.println(httpResponseCode);
    }

    http.end();
  }
  delay(60000); // Send data every 60 seconds
}
