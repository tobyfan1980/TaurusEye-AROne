cursor = db.users.find({});

var count = 0;
while(cursor.hasNext()){
  var userObj = cursor.next();
  if(userObj.level===0){
    continue;
  }
  user_objectId = userObj._id;
  var score = Math.floor((Math.random() * 30000 + 30000) + 1);
  db.best_scores.insert({best_score: score, city:userObj.city, user:user_objectId});
  count ++;
}

print("add " + count + " scores");
