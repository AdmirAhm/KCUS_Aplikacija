Priprema:

pip install fastapi uvicorn
instaliraj Node.js ()
u frontend folderu:
	npm install
	npm install react-router-dom
	npm run dev

Terminal 1:
u backend folderu
	uvicorn main:app --reload

Terminal 2:
u frontend folderu
	npm run dev

Pogledati adresu u drugom terminalu (localhost:PORT), na toj adresi je lokalno pokrenut frontend