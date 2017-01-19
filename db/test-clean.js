db.getCollectionNames().forEach(
  function(collection_name) {
    if(collection_name != "system.indexes"){
      print("removing collection: " + collection_name);
      db[collection_name].remove({});
    }
  }
);
