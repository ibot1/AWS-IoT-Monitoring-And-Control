'''
/*
 * Copyright 2010-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */ Temperature = turing Pressure = hopper Humidity = knuth
 '''

from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient
import logging
import time
import datetime
import random
import argparse
import json
import sys
import Adafruit_DHT
import Adafruit_BMP.BMP085 as BMP085 # Imports the BMP library
import Adafruit_ADXL345
import picamera
import RPi.GPIO as GPIO
from time import sleep



AllowedActions = ['both', 'publish', 'subscribe']

# Custom MQTT message callback
def customCallback(client, userdata, message):
    print("Received a new message: ")
    print(message.payload)
    print("from topic: ")
    print(message.topic)
    print("--------------\n\n")


# Read in command-line parameters
parser = argparse.ArgumentParser()
parser.add_argument("-e", "--endpoint", action="store", required=True, dest="host", help="Your AWS IoT custom endpoint")
parser.add_argument("-r", "--rootCA", action="store", required=True, dest="rootCAPath", help="Root CA file path")
parser.add_argument("-c", "--cert", action="store", dest="certificatePath", help="Certificate file path")
parser.add_argument("-k", "--key", action="store", dest="privateKeyPath", help="Private key file path")
parser.add_argument("-w", "--websocket", action="store_true", dest="useWebsocket", default=False,
                    help="Use MQTT over WebSocket")
parser.add_argument("-id", "--clientId", action="store", dest="clientId", default="basicPubSub",
                    help="Targeted client id")
parser.add_argument("-t", "--topic", action="store", dest="topic", default="sdk/test/Python", help="Targeted topic")
parser.add_argument("-m", "--mode", action="store", dest="mode", default="both",
                    help="Operation modes: %s"%str(AllowedActions))
parser.add_argument("-M", "--message", action="store", dest="message", default="Hello World!",
                    help="Message to publish")

args = parser.parse_args()
host = args.host
rootCAPath = args.rootCAPath
certificatePath = args.certificatePath
privateKeyPath = args.privateKeyPath
useWebsocket = args.useWebsocket
clientId = args.clientId
topic = args.topic

if args.mode not in AllowedActions:
    parser.error("Unknown --mode option %s. Must be one of %s" % (args.mode, str(AllowedActions)))
    exit(2)

if args.useWebsocket and args.certificatePath and args.privateKeyPath:
    parser.error("X.509 cert authentication and WebSocket are mutual exclusive. Please pick one.")
    exit(2)

if not args.useWebsocket and (not args.certificatePath or not args.privateKeyPath):
    parser.error("Missing credentials for authentication.")
    exit(2)

# Configure logging
logger = logging.getLogger("AWSIoTPythonSDK.core")
logger.setLevel(logging.DEBUG)
streamHandler = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
streamHandler.setFormatter(formatter)
logger.addHandler(streamHandler)

# Init AWSIoTMQTTClient
myAWSIoTMQTTClient = None
if useWebsocket:
    myAWSIoTMQTTClient = AWSIoTMQTTClient(clientId, useWebsocket=True)
    myAWSIoTMQTTClient.configureEndpoint(host, 443)
    myAWSIoTMQTTClient.configureCredentials(rootCAPath)
else:
    myAWSIoTMQTTClient = AWSIoTMQTTClient(clientId)
    myAWSIoTMQTTClient.configureEndpoint(host, 8883)
    myAWSIoTMQTTClient.configureCredentials(rootCAPath, privateKeyPath, certificatePath)

# AWSIoTMQTTClient connection configuration
myAWSIoTMQTTClient.configureAutoReconnectBackoffTime(1, 32, 20)
myAWSIoTMQTTClient.configureOfflinePublishQueueing(-1)  # Infinite offline Publish queueing
myAWSIoTMQTTClient.configureDrainingFrequency(2)  # Draining: 2 Hz
myAWSIoTMQTTClient.configureConnectDisconnectTimeout(10)  # 10 sec
myAWSIoTMQTTClient.configureMQTTOperationTimeout(5)  # 5 sec

# Connect and subscribe to AWS IoT
myAWSIoTMQTTClient.connect()
if args.mode == 'both' or args.mode == 'subscribe':
    myAWSIoTMQTTClient.subscribe(topic, 1, customCallback)
time.sleep(2)

# Publish to the same topic in a loop forever
loopCount = 1525395653330
GPIO.setmode(GPIO.BCM)
GPIO.setup(23, GPIO.IN)
GPIO.setup(17, GPIO.IN)
sensor = BMP085.BMP085()
GPIO.setup(22,GPIO.IN)\

accel = Adafruit_ADXL345.ADXL345()
n = 0
magsens = 0

def Motion():
	motion=GPIO.input(23)
	if(motion == 1):
		print("Motion Started")	
		time.sleep(1)
	else:
		print("Motion ended")
		time.sleep(1)
	return motion

humthresh = 65
tempthresh = 35
presthresh = 100800
c = 1
st1 = "/home/pi/Desktop/Videos/video"
st2 = ".h264"

try:
	x0, y0, z0 = accel.read()
	while True:
		humidity, temperature = Adafruit_DHT.read_retry(11, 4)
		pressure = sensor.read_pressure()
		motio = Motion()
		x, y, z = accel.read()
		if(pressure is not None):
			print("Pressure: ",pressure)
		if(humidity is not None and temperature is not None):
			print("humidity:",humidity)
			print("temperature:",temperature)
		if((x is not None and y is not None)and(z is not None)):
			print("X-axis: ",x,"Y-axis: ",y,"Z-axis: ",z)
		nn = GPIO.input(22)
		if(nn == 1):
			n+=1
		if(n%2==1):
			print("Magnet Switch On")
			magsens = 1
			time.sleep(1)
		else:
			magsens = 0
			print("Magnet Switch off")
			time.sleep(1)
		if((temperature > tempthresh or humidity > presthresh) or pressure > presthresh):
			with picamera.PiCamera() as camera:
				print("Beginning Preview")
				camera.start_preview()
				sleep(10)		
				print("End Preview")
				camera.stop_preview()
		if((motio == 1 or magsens==1) or ((abs(x0-x) > 0 or abs(y0 - y) > 0) or (abs(z0-z) > 0))):
			with picamera.PiCamera() as camera:
				print("Beginning Recording")
				f = st1+str(c)+st2
				camera.start_recording(f)
				sleep(10)
				print("End Recording")
				camera.stop_recording()
				c+=1
		if args.mode == 'both' or args.mode == 'publish':
			#message = {}
			#message['dateTime'] = datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')
			
			messageJson = json.dumps({"batteryDischargeRate": 0, "sensorReading": 0, "deviceId": "Temperature", "timeStampEpoch": loopCount, "timeStampIso": datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), "batteryCharge": temperature, "location": {"lat": 31.77637512403469,"lon": 31.77637512403469}})
			topic = "device/Temperature/devicePayload"
			myAWSIoTMQTTClient.publish(topic, messageJson, 1)
			
			messageJson = json.dumps({"batteryDischargeRate": 0, "sensorReading": 0, "deviceId": "Pressure", "timeStampEpoch": loopCount, "timeStampIso": datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), "batteryCharge": pressure, "location": {"lat": 31.77637512403469,"lon": 31.77637512403469}})
			topic = "device/Pressure/devicePayload"
			myAWSIoTMQTTClient.publish(topic, messageJson, 1)
			
			messageJson = json.dumps({"batteryDischargeRate": 0, "sensorReading": 0, "deviceId": "Humidity", "timeStampEpoch": loopCount, "timeStampIso": datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), "batteryCharge": humidity, "location": {"lat": 31.77637512403469,"lon": 31.77637512403469}})
			topic = "device/Humidity/devicePayload"
			myAWSIoTMQTTClient.publish(topic, messageJson, 1)
			
			messageJson = json.dumps({"batteryDischargeRate": 0, "sensorReading": 0, "deviceId": "Motion", "timeStampEpoch": loopCount, "timeStampIso": datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), "batteryCharge": motio, "location": {"lat": 31.77637512403469,"lon": 31.77637512403469}})
			topic = "device/Motion/devicePayload"
			myAWSIoTMQTTClient.publish(topic, messageJson, 1)
			
			messageJson = json.dumps({"batteryDischargeRate": y, "sensorReading": z, "deviceId": "Acceleration", "timeStampEpoch": loopCount, "timeStampIso": datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), "batteryCharge": x, "location": {"lat": 31.77637512403469,"lon": 31.77637512403469}})
			topic = "device/Acceleration/devicePayload"
			myAWSIoTMQTTClient.publish(topic, messageJson, 1)
			
			messageJson = json.dumps({"batteryDischargeRate": 0, "sensorReading": 0, "deviceId": "Magnet", "timeStampEpoch": loopCount, "timeStampIso": datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'), "batteryCharge": magsens, "location": {"lat": 31.77637512403469,"lon": 31.77637512403469}})
			topic = "device/Magnet/devicePayload"
			myAWSIoTMQTTClient.publish(topic, messageJson, 1)
			
			if args.mode == 'publish':
				print('Published topic %s: %s\n' % (topic, messageJson))
			loopCount += 1
			x0 = x
			y0 = y
			z0 = z
		time.sleep(2)
except:
	GPIO.cleanup()
