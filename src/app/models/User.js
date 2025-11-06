import Sequelize, { Model } from "sequelize";

class User extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        password_hash: Sequelize.STRING,
        admin: Sequelize.BOOLEAN,

        // ✅ NOVOS CAMPOS PARA LOGIN COM GOOGLE
        google_uid: Sequelize.STRING,
        avatar: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: "users",
      }
    );
    return this;
  }
}

export default User;