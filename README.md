# GuardianCar

🚗 GuardianCar — Smart Anti-Theft & Safe Immobiliser System
Built by StackWave • 1st Year Hackathon Project • 2025

GuardianCar is an intelligent vehicle-security system that instantly alerts owners when their car starts, verifies whether the ignition is authorized, and safely immobilises the vehicle if theft is detected — without ever risking safety.
Designed for rapid action, real-time tracking, and legally safe operation.

⭐ Key Features
🔔 Instant Ignition Alert

Car starts → owner receives an immediate push notification with Yes / Not Me / Track options.

🛑 Safe, Smart Immobiliser

If “Not Me” is selected:

➖ If stationary (≤ 3 km/h, RPM ≤ 1200): car is safely immobilised

➕ If moving: tracking is enabled & immobilisation waits until the vehicle stops

🗺️ Live GPS Tracking

Real-time location updates until the vehicle is secured.

🧠 Safety-First Logic

Never cuts engine while moving

Auto fallback to safe state if connection fails

Tamper detection & last-location fallback

📡 IoT + Mobile Integration

ESP32 vehicle module communicates with cloud + app to verify events instantly.

🧩 Architecture Overview
[Car Module: ESP32 + GPS + Relay]
          ↓
      Backend / Cloud
          ↓
  [Owner Mobile App]


ESP32 detects ignition

Sends event to cloud

Owner gets verification alert

Owner action → cloud → ESP32

Immobilise or track (based on speed & safety logic)

🛠️ Tech Stack
Hardware

ESP32

Relay module (starter/fuel cut)

GPS / OBD-II (optional in demo)

Software

Arduino (ESP32)

Firebase / Blynk / IFTTT (demo-friendly backend)

React Native / Flutter app 

Security

Command signing

Encrypted communication

Audit logs

🎮 Demo Highlights

Ignition simulation button

Push notification

“Not Me” → immobiliser triggers

Moving simulation → tracking only

Tamper alert with last known location

🎯 Why GuardianCar?

Vehicle theft is rising globally — but most solutions notify owners after the vehicle is gone.
GuardianCar focuses on preventing movement, not just tracking losses.
It is safe, fast, affordable, and scalable for bikes, cars, fleets, and EVs.

🧑‍💻 Team — StackWave

Built by first-year engineering students passionate about IoT, safety, and smart mobility.
(StackWave)

📝 License

MIT License (open-source for education & hackathons)

📦 Project Structure (example)
/esp32-code      → firmware for ignition + relay logic
/app             → mobile app source (React Native/Flutter)
/backend         → cloud backend or IFTTT/Firebase scripts
/documents       → architecture diagrams, PPT, hackathon report

🙌 Acknowledgments

Thanks to our mentors, hackathon organizers, and the open-source community.
