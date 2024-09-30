import { jwtDecode } from "jwt-decode";
import axios from "axios";

const RefreshToken = (ifixit_admin_panel, logout, login) => {
  const refresh = async () => {
    let token = ifixit_admin_panel.token;
    // console.log('token function', ifixit_admin_panel);
    // let decodedToken = jwt.decode(token, { complete: true });
    // let decodedTokenTime = decodedToken.payload.exp * 1000;
    if (!token) {
      return;
    }
    const decodedToken = jwtDecode(token);
    console.log("decodedToken", decodedToken);

    // let decodedTokenTime = ifixit_admin_panel.expires_in * 1000;
    let decodedTokenTime = decodedToken.exp * 1000;
    let dateNow = new Date();
    let NumaricDate = dateNow.getTime();

    // console.log("decodedTokenTime", decodedTokenTime);

    // console.log("NumaricDate", NumaricDate);

    try {
      if (decodedTokenTime > NumaricDate) {
        // console.log(" old access token:", token);

        return token;
      } else {
        // console.log(" old access token: ------------------------");
        let data = {
          grant_type: "refresh_token",
          client_id: process.env.REACT_APP_CLIENT_ID,
          client_secret: process.env.REACT_APP_CLIENT_SECRECT,
          refresh_token: ifixit_admin_panel.refresh_token,
        };
        let res = await axios({
          url: "/api/v1/public/auth/refresh-token",
          method: "POST",
          data: data,
          headers: {
            "Content-Type": "application/json",
          },
        });

        login(res?.data.data);
        // console.log("refresh token", res.data.data.token);
        return res.data.data.token;
      }
    } catch (error) {
      logout();
    }
  };
  return refresh();
};

export default RefreshToken;
