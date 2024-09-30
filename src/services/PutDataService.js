import axios from "axios";

const handlePutData = async (url, data, token) => {
  console.log(url, data, token);

  
  try {
    let response = await axios({
      method: "put",
      url: url,
      data: data,
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Language": `en`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response;
  } catch (error) {
    console.log("error", error);
    return error.response;
  }
};

export { handlePutData };
