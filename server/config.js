const fs = require('fs');
const crypto = require('crypto');

module.exports.createFile = function(name, defaultValue){
  const dir = "./data";

  fs.stat(dir, (err, stats) =>{
    if(err){
      if(err.code==="ENOENT"){
        fs.mkdir(dir, (err)=>{
          if(err){
            console.log("Directory not created");
          }else{
            console.log("Directory create successfully");
          }
        });
      }
    }
  });

  const filePath = `${dir}/${name}`;
  fs.stat(filePath, (err, stats) =>{
    if(err){
      if(err.code==="ENOENT"){
        fs.writeFile(filePath, JSON.stringify(defaultValue, null, 4), (err) =>{
          console.warn(err);
        });
      }
    }
  });
  return filePath;
}


module.exports.createHash = function(size, initial){
  const date = new Date();
  const hash = crypto
    .createHash('md5')
    .update(date.getTime().toString())
    .digest('hex');

  return hash;
}
