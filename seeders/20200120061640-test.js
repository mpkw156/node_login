'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    let datas = [];
    for(let i = 0; i <10; i++){
      let obj = {
        email: "test" + i +"@example.com",
        name: "teestUser" + 1,
        password: "1234",
        createdAt: new Date().tolSOString().replace(/T/,"").replace(/\..+/,''),
        updatedAt: new Date().tolSOString().replace(/T/,"").replace(/\..+/,'')
      }
      datas.push(obj)
    }

    return queryInterface.bulkInsert('users', datas,{});
  },

  down: (queryInterface, Sequelize) => {
    
  }
};
