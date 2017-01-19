echo "cleanup"
mongo arone --quiet test-clean.js

echo "add users"
mongoimport --db arone --collection users --type json --file user-bootstrap.json --jsonArray

echo "add notifications"
mongoimport --db arone --collection notifications --type json --file notes-bootstrap.json --jsonArray

echo "add top scores"
mongo arone --quiet init-best-score.js
 
