db.getCollectionNames().forEach(function(collection) {
  print(collection);
});

cursor = db.users.find();
while ( cursor.hasNext() ) {
   printjson( cursor.next() );
}
