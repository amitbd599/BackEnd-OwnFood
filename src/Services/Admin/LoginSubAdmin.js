const CreateToken = require("../../Utility/CreateToken");
var md5 = require("md5");
const LoginSubAdmin = async (request, UsersModel) => {
  try {
    let postBody = request.body;

    const enPassword = md5(postBody.password);
    postBody.password = enPassword;

    let data = await UsersModel.aggregate([
      { $match: request.body },
      {
        $project: {
          _id: 0,
          email: 1,
          firstName: 1,
          lastName: 1,
          mobile: 1,
          photo: 1,
        },
      },
    ]);
    if (data.length > 0) {
      let Token = await CreateToken(data[0]["email"]);
      return { status: "Success", Token: Token, data: data[0] };
    } else {
      return { status: "Unauthorized" };
    }
  } catch (e) {
    return { status: "Fail", data: e.toString() };
  }
};

module.exports = LoginSubAdmin;
