var options = {  
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
    port: 5000,
    
    clearExpired : true ,             // 만료된 세션 자동 확인 및 지우기 여부
    checkExpirationInterval: 10000,   // 만료된 세션이 지워지는 빈도 (milliseconds)
    expiration: 1000*60*60*2,         // 유효한 세션의 최대 기간 2시간으로 설정 (milliseconds) 
  };
  console.log("db connected")
  module.exports = options;