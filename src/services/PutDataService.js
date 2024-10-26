import axios from "axios";

const handlePutData = async (url, data, isFormData) => {
  let headers = {
    // Authorization: `Bearer ${token}`,
  };
  if (isFormData) {
    headers["Content-Type"] = "multipart/form-data";
  }
  try {
    let response = await axios({
      method: "put",
      url: url,
      data: data,
      headers: headers,
      // headers: {
      //   Authorization: `Bearer ${token}`,
      //   "Accept-Language": `en`,
      //   "Content-Type": "multipart/form-data",
      // },
    });

    return response;
  } catch (error) {
    console.log("error", error);
    return error.response;
  }
};

export { handlePutData };
