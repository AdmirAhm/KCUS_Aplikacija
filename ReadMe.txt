Uputa za GitHub:
Instaliraj git bash
Kad hoces da preuzmes kod:
	U folderu u kojem hoces kod otvoris git bash
	git clone <url od projekta>
Kad hoces da preuzmes novu verziju (uradi kad god sta hoces da mijenjas):
	git pull origin master
Kad hoces da pohranis izmjenu:
	Za svaku izmijenjenu fajlu: git add <put do fajla> (moze i samo git add --all)
	git commit -m "naziv komita"
	git push origin master

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

Kad zelim provjeriti stranicu u folder sa aplikacijom udjem u cmd cd frontend i u drugi cmd cd backend i unosim naredbe npm run dev za frontend a za backend uvicorn main:app --reload

Terminal 2:
u frontend folderu
	npm run dev

Pogledati adresu u drugom terminalu (localhost:PORT), na toj adresi je lokalno pokrenut frontend
