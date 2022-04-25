#include <ArduinoJson.h>
StaticJsonDocument<200> doc;

void setup()
{
	Serial.begin(9600);
}

void loop()
{
	if (Serial.available() > 0)
	{
		String receivedString = (String)Serial.readStringUntil('\n');
		DeserializationError error = deserializeJson(doc, receivedString);
		if (error)
		{
			return;
		}
		const char *action = doc["action"];

		if (strcmp(action, "LIGHT") == 0)
		{
			const char *state = doc["state"];
			if (strcmp(state, "ON") == 0)
			{
				digitalWrite(4, HIGH);
			}
			else
			{
				digitalWrite(4, LOW);
			}
		}
		else if (strcmp(action, "WATER") == 0)
		{
			digitalWrite(5, HIGH);
		}
		else if (strcmp(action, "GET_INFO") == 0)
		{
			digitalWrite(6, HIGH);
		}
		else if (strcmp(action, "SET_PLANT") == 0)
		{
			digitalWrite(7, HIGH);
		}
	}
}