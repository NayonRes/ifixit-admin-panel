import axios from "axios";

const getDataWithToken = async (url, token) => {
  try {
    // console.log("localData.token", localData.token);
    let response = await axios({
      method: "get",
      url: url,
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": `en`,
      },
    });

    return response;
  } catch (error) {
    console.log("error", error);
    return error.response;
  }
};

export { getDataWithToken };
